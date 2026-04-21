import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

type Row = {
  id: string;
  name: string;
  category: string;
  price: number;
  compare_at_price: number | null;
  newPrice: string;
  newCompare: string;
};

const AdminBulkPrices = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('products').select('id, name, category, price, compare_at_price').order('name').then(({ data, error }) => {
      if (error) toast.error(error.message);
      setRows((data || []).map(p => ({
        ...p,
        newPrice: String(p.price),
        newCompare: p.compare_at_price != null ? String(p.compare_at_price) : '',
      })));
      setLoading(false);
    });
  }, []);

  const update = (id: string, key: 'newPrice' | 'newCompare', value: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [key]: value } : r));
  };

  const dirty = rows.filter(r =>
    Number(r.newPrice) !== r.price ||
    (r.newCompare === '' ? r.compare_at_price !== null : Number(r.newCompare) !== r.compare_at_price)
  );

  const saveAll = async () => {
    if (dirty.length === 0) { toast.info('Nothing changed'); return; }
    setSaving(true);
    let okCount = 0;
    for (const r of dirty) {
      const compare = r.newCompare === '' ? null : Math.round(Number(r.newCompare));
      const { error } = await supabase.from('products').update({
        price: Math.round(Number(r.newPrice) || 0),
        compare_at_price: compare,
      }).eq('id', r.id);
      if (error) {
        toast.error(`${r.name}: ${error.message}`);
      } else {
        okCount++;
      }
    }
    setSaving(false);
    toast.success(`Updated ${okCount} product(s)`);
    // Refresh baseline
    setRows(prev => prev.map(r => ({
      ...r,
      price: Number(r.newPrice) || 0,
      compare_at_price: r.newCompare === '' ? null : Number(r.newCompare),
    })));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-bark">Bulk prices</h1>
          <p className="font-body text-sm text-muted-foreground">
            Edit any rows then save. {dirty.length > 0 && <span className="text-gold">{dirty.length} pending change(s)</span>}
          </p>
        </div>
        <Button onClick={saveAll} disabled={saving || dirty.length === 0} className="bg-bark text-ivory hover:bg-bark/90">
          {saving ? 'Saving…' : `Save all (${dirty.length})`}
        </Button>
      </div>

      <div className="bg-ivory-warm border border-bark/15 rounded-[4px] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right w-32">Price (৳)</TableHead>
              <TableHead className="text-right w-32">Compare (৳)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>}
            {rows.map(r => {
              const changed = Number(r.newPrice) !== r.price ||
                (r.newCompare === '' ? r.compare_at_price !== null : Number(r.newCompare) !== r.compare_at_price);
              return (
                <TableRow key={r.id} className={changed ? 'bg-gold/5' : ''}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.category}</TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number" min={0}
                      value={r.newPrice}
                      onChange={(e) => update(r.id, 'newPrice', e.target.value)}
                      className="text-right h-9"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number" min={0}
                      value={r.newCompare}
                      onChange={(e) => update(r.id, 'newCompare', e.target.value)}
                      placeholder="—"
                      className="text-right h-9"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default AdminBulkPrices;
