import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

type Form = {
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  stock_qty: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  images: string[];
};

const empty: Form = {
  name: '', slug: '', category: '', description: '',
  price: 0, compare_at_price: null, stock_qty: 0,
  is_featured: false, is_new_arrival: false, images: [],
};

const AdminProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  const [form, setForm] = useState<Form>(empty);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [tempId] = useState(() => crypto.randomUUID());
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    supabase.from('categories').select('slug, name').order('display_order').then(({ data }) => {
      setCategories(data || []);
    });
    if (!isNew && id) {
      supabase.from('products').select('*').eq('id', id).maybeSingle().then(({ data, error }) => {
        if (error) toast.error(error.message);
        if (data) {
          setForm({
            name: data.name,
            slug: data.slug,
            category: data.category,
            description: data.description ?? '',
            price: data.price,
            compare_at_price: data.compare_at_price,
            stock_qty: data.stock_qty ?? 0,
            is_featured: !!data.is_featured,
            is_new_arrival: !!data.is_new_arrival,
            images: data.images || [],
          });
          setSlugTouched(true);
        }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  const update = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const onNameChange = (v: string) => {
    update('name', v);
    if (!slugTouched) update('slug', slugify(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.category) {
      toast.error('Name, slug and category are required');
      return;
    }
    if (form.images.length === 0) {
      toast.error('Add at least one image');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug,
      category: form.category,
      description: form.description || null,
      price: Math.round(Number(form.price) || 0),
      compare_at_price: form.compare_at_price ? Math.round(Number(form.compare_at_price)) : null,
      stock_qty: Math.round(Number(form.stock_qty) || 0),
      is_featured: form.is_featured,
      is_new_arrival: form.is_new_arrival,
      images: form.images,
    };

    if (isNew) {
      const { error } = await supabase.from('products').insert(payload);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success('Product created');
      navigate('/admin', { replace: true });
    } else {
      const { error } = await supabase.from('products').update(payload).eq('id', id!);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success('Product updated');
      navigate('/admin', { replace: true });
    }
  };

  if (loading) {
    return <AdminLayout><div className="text-muted-foreground">Loading…</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link to="/admin"><ArrowLeft size={14} /> Back</Link>
      </Button>
      <h1 className="font-display text-3xl text-bark mb-6">
        {isNew ? 'New product' : 'Edit product'}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5 bg-ivory-warm border border-bark/15 rounded-[4px] p-6">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => onNameChange(e.target.value)} required maxLength={120} />
          </div>
          <div>
            <Label>Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => { setSlugTouched(true); update('slug', slugify(e.target.value)); }}
              required maxLength={120}
            />
          </div>
          <div>
            <Label>Category</Label>
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              required
              className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Select…</option>
              {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={5} maxLength={2000} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Price (৳)</Label>
              <Input type="number" min={0} value={form.price} onChange={(e) => update('price', Number(e.target.value))} required />
            </div>
            <div>
              <Label>Compare at (৳)</Label>
              <Input
                type="number" min={0}
                value={form.compare_at_price ?? ''}
                onChange={(e) => update('compare_at_price', e.target.value === '' ? null : Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Stock</Label>
              <Input type="number" min={0} value={form.stock_qty} onChange={(e) => update('stock_qty', Number(e.target.value))} />
            </div>
          </div>
          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Switch checked={form.is_featured} onCheckedChange={(v) => update('is_featured', v)} id="feat" />
              <Label htmlFor="feat" className="cursor-pointer">Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_new_arrival} onCheckedChange={(v) => update('is_new_arrival', v)} id="new" />
              <Label htmlFor="new" className="cursor-pointer">New arrival</Label>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-ivory-warm border border-bark/15 rounded-[4px] p-6">
            <ImageUploader
              productId={isNew ? tempId : id!}
              images={form.images}
              onChange={(urls) => update('images', urls)}
            />
          </div>
          <div className="flex gap-2 sticky top-4">
            <Button type="submit" disabled={saving} className="flex-1 bg-bark text-ivory hover:bg-bark/90">
              {saving ? 'Saving…' : isNew ? 'Create product' : 'Save changes'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminProductEdit;
