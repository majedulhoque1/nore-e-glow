-- ============================================================================
-- First-party analytics: events table + INSERT-only RLS for anon
-- + admin-gated aggregation RPCs for the admin dashboard.
-- Safe to re-run (idempotent).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Events table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type   TEXT NOT NULL CHECK (event_type IN ('pageview', 'product_view', 'add_to_cart')),
  visitor_id   TEXT NOT NULL CHECK (char_length(visitor_id) BETWEEN 6 AND 64),
  path         TEXT CHECK (path IS NULL OR char_length(path) <= 500),
  product_id   UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_slug TEXT CHECK (product_slug IS NULL OR char_length(product_slug) <= 200),
  metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON public.analytics_events (created_at);
CREATE INDEX IF NOT EXISTS analytics_events_event_type_idx ON public.analytics_events (event_type);
CREATE INDEX IF NOT EXISTS analytics_events_product_id_idx ON public.analytics_events (product_id);

-- ----------------------------------------------------------------------------
-- 2. RLS: anon may INSERT only — never read. Admins may SELECT.
-- ----------------------------------------------------------------------------
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;
CREATE POLICY "Anyone can insert analytics events"
ON public.analytics_events FOR INSERT
TO anon, authenticated
WITH CHECK (event_type IN ('pageview', 'product_view', 'add_to_cart'));

DROP POLICY IF EXISTS "Admins can read analytics events" ON public.analytics_events;
CREATE POLICY "Admins can read analytics events"
ON public.analytics_events FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- No UPDATE/DELETE policies: events are append-only from clients.

-- ----------------------------------------------------------------------------
-- 3. Aggregation RPCs (SECURITY DEFINER, admin-gated). Doing the math in SQL
--    avoids shipping thousands of raw rows to the browser.
-- ----------------------------------------------------------------------------

-- Summary: unique visitors + pageviews for today / last 7d / last 30d.
CREATE OR REPLACE FUNCTION public.get_analytics_summary()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT jsonb_build_object(
    'today_visitors',  COUNT(DISTINCT e.visitor_id) FILTER (WHERE e.created_at >= date_trunc('day', now())),
    'today_pageviews', COUNT(*) FILTER (WHERE e.event_type = 'pageview' AND e.created_at >= date_trunc('day', now())),
    'week_visitors',   COUNT(DISTINCT e.visitor_id) FILTER (WHERE e.created_at >= now() - INTERVAL '7 days'),
    'week_pageviews',  COUNT(*) FILTER (WHERE e.event_type = 'pageview' AND e.created_at >= now() - INTERVAL '7 days'),
    'month_visitors',  COUNT(DISTINCT e.visitor_id),
    'month_pageviews', COUNT(*) FILTER (WHERE e.event_type = 'pageview')
  )
  INTO v_result
  FROM public.analytics_events e
  WHERE e.created_at >= now() - INTERVAL '30 days';

  RETURN v_result;
END;
$$;

-- One row per day: date, unique visitors, pageviews. Zero-filled days included.
CREATE OR REPLACE FUNCTION public.get_visitors_timeseries(_days INT DEFAULT 30)
RETURNS TABLE (day DATE, visitors BIGINT, pageviews BIGINT)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_days INT := LEAST(GREATEST(COALESCE(_days, 30), 1), 365);
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  RETURN QUERY
  SELECT
    d.d::date,
    COUNT(DISTINCT e.visitor_id),
    COUNT(e.id) FILTER (WHERE e.event_type = 'pageview')
  FROM generate_series(
    date_trunc('day', now()) - make_interval(days => v_days - 1),
    date_trunc('day', now()),
    INTERVAL '1 day'
  ) AS d(d)
  LEFT JOIN public.analytics_events e
    ON e.created_at >= d.d AND e.created_at < d.d + INTERVAL '1 day'
  GROUP BY d.d
  ORDER BY d.d;
END;
$$;

-- Top products by event count (product_view or add_to_cart) over the last N days.
CREATE OR REPLACE FUNCTION public.get_top_products(
  _event_type TEXT DEFAULT 'product_view',
  _days INT DEFAULT 7,
  _limit INT DEFAULT 10
)
RETURNS TABLE (
  product_id UUID,
  product_slug TEXT,
  product_name TEXT,
  product_image TEXT,
  event_count BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  IF _event_type NOT IN ('product_view', 'add_to_cart') THEN
    RAISE EXCEPTION 'invalid event type';
  END IF;

  RETURN QUERY
  SELECT
    e.product_id,
    COALESCE(p.slug, e.product_slug),
    COALESCE(p.name, e.product_slug, 'Unknown product'),
    (p.images)[1],
    COUNT(*)
  FROM public.analytics_events e
  LEFT JOIN public.products p ON p.id = e.product_id
  WHERE e.event_type = _event_type
    AND e.created_at >= now() - make_interval(days => LEAST(GREATEST(COALESCE(_days, 7), 1), 365))
    AND (e.product_id IS NOT NULL OR e.product_slug IS NOT NULL)
  GROUP BY e.product_id, COALESCE(p.slug, e.product_slug),
           COALESCE(p.name, e.product_slug, 'Unknown product'), (p.images)[1]
  ORDER BY COUNT(*) DESC
  LIMIT LEAST(GREATEST(COALESCE(_limit, 10), 1), 50);
END;
$$;

-- Only logged-in users may even attempt the RPCs (has_role still gates inside).
REVOKE EXECUTE ON FUNCTION public.get_analytics_summary() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_visitors_timeseries(INT) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_top_products(TEXT, INT, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_analytics_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_visitors_timeseries(INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_top_products(TEXT, INT, INT) TO authenticated;
