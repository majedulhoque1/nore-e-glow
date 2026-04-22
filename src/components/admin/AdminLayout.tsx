import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Package, DollarSign, Plus, KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  const navItem = ({ isActive }: { isActive: boolean }) =>
    `font-body text-sm px-3 py-2 rounded transition-colors ${
      isActive ? 'bg-bark text-ivory' : 'text-bark hover:bg-bark/10'
    }`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-bark/15 bg-ivory-warm">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/admin" className="font-display text-xl text-bark">
            Nore'e <span className="text-gold">·</span> Admin
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/admin" end className={navItem}>
              <Package size={14} className="inline mr-1" /> Products
            </NavLink>
            <NavLink to="/admin/bulk-prices" className={navItem}>
              <DollarSign size={14} className="inline mr-1" /> Bulk prices
            </NavLink>
            <NavLink to="/admin/products/new" className={navItem}>
              <Plus size={14} className="inline mr-1" /> New
            </NavLink>
            <NavLink to="/admin/change-password" className={navItem}>
              <KeyRound size={14} className="inline mr-1" /> Password
            </NavLink>
          </nav>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={14} /> Logout
          </Button>
        </div>
      </header>
      <main className="max-w-[1400px] mx-auto px-6 py-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
