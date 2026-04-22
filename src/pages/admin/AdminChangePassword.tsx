import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const AdminChangePassword = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (next !== confirm) {
      toast.error('New passwords do not match');
      return;
    }
    setSaving(true);

    // Re-authenticate with the current password before changing it.
    const { data: sessionData } = await supabase.auth.getSession();
    const email = sessionData.session?.user.email;
    if (!email) {
      toast.error('Session expired, please log in again');
      setSaving(false);
      navigate('/admin/login', { replace: true });
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: current,
    });
    if (signInError) {
      toast.error('Current password is incorrect');
      setSaving(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: next });
    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    toast.success('Password updated');
    setCurrent('');
    setNext('');
    setConfirm('');
    setSaving(false);
  };

  return (
    <AdminLayout>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link to="/admin"><ArrowLeft size={14} /> Back</Link>
      </Button>
      <h1 className="font-display text-3xl text-bark mb-6">Change password</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-5 bg-ivory-warm border border-bark/15 rounded-[4px] p-6"
      >
        <div>
          <Label htmlFor="current">Current password</Label>
          <Input
            id="current"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="next">New password</Label>
          <Input
            id="next"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
            minLength={8}
          />
          <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters.</p>
        </div>
        <div>
          <Label htmlFor="confirm">Confirm new password</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <Button type="submit" disabled={saving} className="w-full bg-bark text-ivory hover:bg-bark/90">
          {saving ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </AdminLayout>
  );
};

export default AdminChangePassword;
