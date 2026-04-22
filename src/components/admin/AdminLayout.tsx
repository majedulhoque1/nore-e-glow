import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Package, DollarSign, Plus, KeyRound, Menu, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

const navLinks = [
  { to: '/admin', label: 'Products', icon: Package, end: true },
  { to: '/admin/bulk-prices', label: 'Bulk prices', icon: DollarSign },
  { to: '/admin/products/new', label: 'New product', icon: Plus },
  { to: '/admin/change-password', label: 'Password', icon: KeyRound },
];

const backToSiteLink = { to: '/', label: 'Back to Website', icon: ExternalLink };

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  const desktopNavItem = ({ isActive }: { isActive: boolean }) =>
    `font-body text-sm px-3 py-2 rounded transition-colors ${
      isActive ? 'bg-bark text-ivory' : 'text-bark hover:bg-bark/10'
    }`;

  const mobileNavItem = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 font-body text-base px-4 py-3 rounded transition-colors ${
      isActive ? 'bg-bark text-ivory' : 'text-bark hover:bg-bark/10'
    }`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-bark/15 bg-ivory-warm sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3">
          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-bark hover:bg-bark/10"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-ivory-warm w-[280px] p-0 flex flex-col">
              <SheetHeader className="p-5 border-b border-bark/15 text-left">
                <SheetTitle className="font-display text-xl text-bark">
                  Nore'e <span className="text-gold">·</span> Admin
                </SheetTitle>
              </SheetHeader>
              <nav className="flex-1 flex flex-col gap-1 p-3">
                {navLinks.map(({ to, label, icon: Icon, end }) => (
                  <SheetClose asChild key={to}>
                    <NavLink to={to} end={end} className={mobileNavItem}>
                      <Icon size={18} />
                      {label}
                    </NavLink>
                  </SheetClose>
                ))}
                <div className="my-2 border-t border-bark/15" />
                <SheetClose asChild>
                  <NavLink to={backToSiteLink.to} className={mobileNavItem}>
                    <backToSiteLink.icon size={18} />
                    {backToSiteLink.label}
                  </NavLink>
                </SheetClose>
              </nav>
              <div className="p-4 border-t border-bark/15">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={16} /> Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/admin" className="font-display text-lg md:text-xl text-bark truncate">
            Nore'e <span className="text-gold">·</span> Admin
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={desktopNavItem}>
                <Icon size={14} className="inline mr-1" /> {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop logout */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="hidden md:inline-flex"
          >
            <LogOut size={14} /> Logout
          </Button>

          {/* Spacer to balance hamburger on mobile */}
          <span className="md:hidden w-9" aria-hidden />
        </div>
      </header>
      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
