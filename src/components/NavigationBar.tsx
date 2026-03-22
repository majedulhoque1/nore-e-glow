import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '@/assets/logo.png';

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Rings', href: '/category/rings' },
  { label: 'Bracelets', href: '/category/bracelets' },
  { label: 'Phone Charms', href: '/category/phone-charms' },
  { label: 'New Arrivals', href: '/category/new-arrivals' },
];

const NavigationBar = () => {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <nav className="sticky top-0 z-30 bg-ivory/95 backdrop-blur-sm border-b border-border">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between h-16 px-8 max-w-[1400px] mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Nore'e" className="h-8 w-8 object-contain" />
            <span className="font-display font-semibold text-2xl text-bark">Nore'e</span>
          </Link>
          <div className="flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-body text-sm tracking-wide hover:text-gold transition-colors ${isActive(link.href) ? 'text-gold' : 'text-bark-mid'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="text-bark-mid hover:text-gold transition-colors">
              <Search size={20} />
            </button>
            <button className="relative text-bark-mid hover:text-gold transition-colors" onClick={() => setCartOpen(true)}>
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[10px] font-body font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center justify-between h-14 px-4">
          <button onClick={() => setMobileMenuOpen(true)} className="text-bark">
            <Menu size={22} />
          </button>
          <Link to="/" className="flex items-center gap-1.5">
            <img src={logo} alt="Nore'e" className="h-7 w-7 object-contain" />
            <span className="font-display font-semibold text-xl text-bark">Nore'e</span>
          </Link>
          <button className="relative text-bark" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[10px] font-body font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-bark/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-[280px] bg-bark z-50 flex flex-col p-8"
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="self-end text-gold mb-8"
              >
                <X size={24} />
              </button>
              <div className="flex flex-col gap-6">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-display text-2xl text-ivory hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default NavigationBar;
