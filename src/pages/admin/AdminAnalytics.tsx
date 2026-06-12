import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Eye, ShoppingBag, Users } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const GOLD = '#C9A052';
const BARK_MID = '#6B5E52';

type Summary = {
  today_visitors: number;
  today_pageviews: number;
  week_visitors: number;
  week_pageviews: number;
  month_visitors: number;
  month_pageviews: number;
};

type TimeseriesRow = { day: string; visitors: number; pageviews: number };

type TopProductRow = {
  product_id: string | null;
  product_slug: string | null;
  product_name: string | null;
  product_image: string | null;
  event_count: number;
};

type RangeDays = 7 | 30;

const RangeToggle = ({ value, onChange }: { value: RangeDays; onChange: (v: RangeDays) => void }) => (
  <div className="inline-flex rounded-md border border-border overflow-hidden">
    {([7, 30] as RangeDays[]).map(d => (
      <button
        key={d}
        onClick={() => onChange(d)}
        className={`font-body text-xs px-3 py-1.5 transition-colors ${
          value === d ? 'bg-bark text-ivory' : 'bg-background text-bark hover:bg-bark/10'
        }`}
      >
        {d} days
      </button>
    ))}
  </div>
);

const SummaryCard = ({
  title,
  visitors,
  pageviews,
  loading,
}: {
  title: string;
  visitors?: number;
  pageviews?: number;
  loading: boolean;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="font-body text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-12 w-full" />
      ) : (
        <div className="flex items-end gap-6">
          <div>
            <p className="font-display text-3xl text-bark leading-none">{visitors ?? 0}</p>
            <p className="font-body text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Users size={12} /> visitors
            </p>
          </div>
          <div>
            <p className="font-display text-3xl text-bark leading-none">{pageviews ?? 0}</p>
            <p className="font-body text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Eye size={12} /> pageviews
            </p>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

const AdminAnalytics = () => {
  const [days, setDays] = useState<RangeDays>(7);
  const [topEvent, setTopEvent] = useState<'product_view' | 'add_to_cart'>('product_view');

  const summaryQuery = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_analytics_summary');
      if (error) throw error;
      return data as Summary;
    },
  });

  const timeseriesQuery = useQuery({
    queryKey: ['analytics-timeseries', days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_visitors_timeseries', { _days: days });
      if (error) throw error;
      return (data ?? []) as TimeseriesRow[];
    },
  });

  const topProductsQuery = useQuery({
    queryKey: ['analytics-top-products', topEvent, days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_top_products', {
        _event_type: topEvent,
        _days: days,
        _limit: 8,
      });
      if (error) throw error;
      return (data ?? []) as TopProductRow[];
    },
  });

  const summary = summaryQuery.data;
  const chartData = (timeseriesQuery.data ?? []).map(row => ({
    ...row,
    label: format(parseISO(row.day), 'd MMM'),
  }));

  const queryError = summaryQuery.error || timeseriesQuery.error || topProductsQuery.error;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl text-bark">Analytics</h1>
          <p className="font-body text-sm text-muted-foreground">Website activity, first-party</p>
        </div>
        <RangeToggle value={days} onChange={setDays} />
      </div>

      {queryError && (
        <p className="font-body text-sm text-destructive mb-4">
          Could not load analytics: {(queryError as Error).message}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          title="Today"
          visitors={summary?.today_visitors}
          pageviews={summary?.today_pageviews}
          loading={summaryQuery.isLoading}
        />
        <SummaryCard
          title="Last 7 days"
          visitors={summary?.week_visitors}
          pageviews={summary?.week_pageviews}
          loading={summaryQuery.isLoading}
        />
        <SummaryCard
          title="Last 30 days"
          visitors={summary?.month_visitors}
          pageviews={summary?.month_pageviews}
          loading={summaryQuery.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl font-normal text-bark">
              Visitors over time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timeseriesQuery.isLoading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                  <defs>
                    <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={GOLD} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#E8DDD0" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: BARK_MID }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: BARK_MID }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 12,
                      border: '1px solid #E8DDD0',
                      borderRadius: 4,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pageviews"
                    name="Pageviews"
                    stroke={BARK_MID}
                    strokeWidth={1.5}
                    fill="transparent"
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    name="Visitors"
                    stroke={GOLD}
                    strokeWidth={2}
                    fill="url(#goldFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="font-display text-xl font-normal text-bark">Top products</CardTitle>
            <div className="inline-flex rounded-md border border-border overflow-hidden">
              <button
                onClick={() => setTopEvent('product_view')}
                className={`font-body text-xs px-2.5 py-1.5 flex items-center gap-1 transition-colors ${
                  topEvent === 'product_view' ? 'bg-bark text-ivory' : 'bg-background text-bark hover:bg-bark/10'
                }`}
              >
                <Eye size={12} /> Views
              </button>
              <button
                onClick={() => setTopEvent('add_to_cart')}
                className={`font-body text-xs px-2.5 py-1.5 flex items-center gap-1 transition-colors ${
                  topEvent === 'add_to_cart' ? 'bg-bark text-ivory' : 'bg-background text-bark hover:bg-bark/10'
                }`}
              >
                <ShoppingBag size={12} /> Carts
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {topProductsQuery.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (topProductsQuery.data ?? []).length === 0 ? (
              <p className="font-body text-sm text-muted-foreground py-6 text-center">
                No {topEvent === 'product_view' ? 'product views' : 'add-to-cart events'} in the last {days} days.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {(topProductsQuery.data ?? []).map((p, i) => (
                  <li key={`${p.product_id ?? p.product_slug ?? i}`} className="flex items-center gap-3 py-2.5">
                    <span className="font-body text-xs text-muted-foreground w-5 text-right shrink-0">
                      {i + 1}.
                    </span>
                    {p.product_image ? (
                      <img
                        src={p.product_image}
                        alt={p.product_name ?? ''}
                        className="w-10 h-10 object-cover rounded-sm shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-ivory-warm rounded-sm shrink-0" />
                    )}
                    <span className="font-body text-sm text-bark flex-1 line-clamp-1">
                      {p.product_name ?? p.product_slug ?? 'Unknown product'}
                    </span>
                    <span className="font-body text-sm font-medium text-gold shrink-0">
                      {p.event_count}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
