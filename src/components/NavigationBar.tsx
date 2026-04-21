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
      <nav className="sticky top-0 z-30 bg-ivory/65 backdrop-blur-xl border-b border-bark/8 supports-[backdrop-filter]:bg-ivory/55">
        {/* Desktop — left logo, nav row, right actions */}
        <div className="hidden md:flex items-center h-[68px] px-8 max-w-[1400px] mx-auto gap-10">
          {/* Left — logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="Nore'e" className="h-8 w-8 object-contain" />
            <span className="font-display font-semibold text-2xl text-bark tracking-tight">Nore'e</span>
          </Link>

          {/* Center — primary nav */}
          <div className="flex items-center gap-8 flex-1">
            {navLinks.filter(l => !l.accent).map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative font-body text-[13px] tracking-[0.04em] hover:text-gold transition-colors py-1 ${
                  isActive(link.href) ? 'text-gold' : 'text-bark-mid'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gold" />
                )}
              </Link>
            ))}
            {/* Mystery box — accent pill */}
            {navLinks.filter(l => l.accent).map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`group relative inline-flex items-center gap-1.5 font-display italic text-[13px] px-3 py-1 rounded-full border transition-all ${
                  isActive(link.href)
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-gold/40 text-gold hover:bg-gold/10 hover:border-gold'
                }`}
              >
                <span className="text-gold text-[10px]">✦</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-5 shrink-0">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="text-bark-mid hover:text-gold transition-colors"
            >
              <Search size={19} strokeWidth={1.6} />
            </button>
            <div
              className="relative"
              onMouseEnter={() => setMiniCartOpen(true)}
              onMouseLeave={() => setMiniCartOpen(false)}
            >
              <button
                aria-label="Cart"
                className="relative text-bark-mid hover:text-gold transition-colors flex items-center gap-1.5"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag size={19} strokeWidth={1.6} />
                {totalItems > 0 && (
                  <span className="font-body font-semibold text-[11px] text-bark min-w-[20px] h-5 px-1.5 rounded-full bg-gold flex items-center justify-center">
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
                {navLinks.filter(l => !l.accent).map(link => (
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
