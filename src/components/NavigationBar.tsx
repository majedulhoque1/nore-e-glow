import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';
import MiniCartPreview from './MiniCartPreview';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '@/assets/logo.png';

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Rings', href: '/category/rings' },
  { label: 'Bracelets', href: '/category/bracelets' },
  { label: 'New Arrivals', href: '/category/new-arrivals' },
  { label: 'Mystery Box', href: '/mystery-collection', accent: true },
];

const leftLinks = navLinks.slice(0, 2);
const rightLinks = navLinks.slice(2);

const NavigationBar = () => {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  // Cmd/Ctrl + K to open search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-30 bg-ivory/95 backdrop-blur-sm border-b border-border">
        {/* Desktop — centered logo, nav split left/right */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center h-16 px-8 max-w-[1400px] mx-auto gap-8">
          {/* Left nav */}
          <div className="flex items-center gap-7 justify-start">
            {leftLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-body text-sm tracking-wide hover:text-gold transition-colors ${isActive(link.href) ? 'text-gold' : 'text-bark-mid'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Centered logo */}
          <Link to="/" className="flex items-center gap-2 justify-self-center">
            <img src={logo} alt="Nore'e" className="h-8 w-8 object-contain" />
            <span className="font-display font-semibold text-2xl text-bark">Nore'e</span>
          </Link>

          {/* Right nav + actions */}
          <div className="flex items-center gap-7 justify-end">
            {rightLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-body text-sm tracking-wide hover:text-gold transition-colors ${
                  link.accent
                    ? `font-display italic ${isActive(link.href) ? 'text-gold' : 'text-gold/85'}`
                    : isActive(link.href) ? 'text-gold' : 'text-bark-mid'
                }`}
              >
                {link.accent && '✦ '}{link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 pl-3 border-l border-border">
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="text-bark-mid hover:text-gold transition-colors"
              >
                <Search size={20} />
              </button>
              <div
                className="relative"
                onMouseEnter={() => setMiniCartOpen(true)}
                onMouseLeave={() => setMiniCartOpen(false)}
              >
                <button
                  aria-label="Cart"
                  className="relative text-bark-mid hover:text-gold transition-colors"
                  onClick={() => setCartOpen(true)}
                >
                  <ShoppingBag size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[10px] font-body font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {miniCartOpen && (
                    <MiniCartPreview onOpenFull={() => { setMiniCartOpen(false); setCartOpen(true); }} />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center justify-between h-14 px-4">
          <button onClick={() => setMobileMenuOpen(true)} className="text-bark" aria-label="Menu">
            <Menu size={22} />
          </button>
          <Link to="/" className="flex items-center gap-1.5">
            <img src={logo} alt="Nore'e" className="h-7 w-7 object-contain" />
            <span className="font-display font-semibold text-xl text-bark">Nore'e</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="text-bark"
            >
              <Search size={20} />
            </button>
            <button className="relative text-bark" onClick={() => setCartOpen(true)} aria-label="Cart">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[10px] font-body font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
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
                aria-label="Close menu"
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
                <div className="border-t border-bark-mid/30 pt-6 mt-2">
                  <Link
                    to="/mystery-collection"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-display text-2xl text-gold italic"
                  >
                    Mystery Box ✦
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default NavigationBar;
