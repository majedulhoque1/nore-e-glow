import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

const VISITOR_KEY = 'noree_visitor_id';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type EventType = 'pageview' | 'product_view' | 'add_to_cart';

interface EventPayload {
  path?: string;
  productId?: string;
  productSlug?: string;
  metadata?: Record<string, Json>;
}

export const getVisitorId = (): string => {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (private mode etc.) — still count the event
    return 'no-storage';
  }
};

export const trackEvent = (eventType: EventType, payload: EventPayload = {}) => {
  try {
    if (window.location.pathname.startsWith('/admin')) return;
    void supabase
      .from('analytics_events')
      .insert({
        event_type: eventType,
        visitor_id: getVisitorId(),
        path: payload.path ?? null,
        // product_id has an FK to products — only send real catalog UUIDs
        product_id: payload.productId && UUID_RE.test(payload.productId) ? payload.productId : null,
        product_slug: payload.productSlug ?? null,
        metadata: payload.metadata ?? {},
      })
      .then(
        () => {},
        () => {}
      );
  } catch {
    // analytics must never break the UI
  }
};

export const trackPageview = (path: string) => trackEvent('pageview', { path });

export const trackProductView = (product: { id: string; slug: string }) =>
  trackEvent('product_view', { productId: product.id, productSlug: product.slug });

export const trackAddToCart = (
  item: { id: string; slug: string; isMystery?: boolean; isCustomBox?: boolean },
  qty: number
) =>
  trackEvent('add_to_cart', {
    productId: item.isMystery || item.isCustomBox ? undefined : item.id,
    productSlug: item.slug,
    metadata: { quantity: qty },
  });
