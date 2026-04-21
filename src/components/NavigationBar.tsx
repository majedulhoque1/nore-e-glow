import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, Heart, Sparkles, Package } from 'lucide-react';
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
];

const accentLink = { label: 'Build Your Box', href: '/mystery-collection/build', icon: Package };

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

  const [searchValue, setSearchValue] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    } else {
      setSearchOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-ivory/70 backdrop-blur-xl border-b border-bark/8 supports-[backdrop-filter]:bg-ivory/60">
        {/* Utility row */}
        <div className="hidden md:block border-b border-bark/8">
          <div className="max-w-[1400px] mx-auto px-8 h-9 flex items-center justify-between font-body text-[11px] text-bark-muted tracking-wide">
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-gold" />
                Free delivery in Dhaka
              </span>
              <span className="text-bark/15">|</span>
              <span>Cash on delivery, nationwide</span>
            </div>
            <div className="flex items-center gap-5">
              <Link to="/shop" className="hover:text-gold transition-colors">Track Order</Link>
              <Link to="/shop" className="hover:text-gold transition-colors">FAQ</Link>
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Main row */}
        <div className="hidden md:flex relative items-center h-[72px] px-8 max-w-[1400px] mx-auto gap-8">
          {/* Left — primary nav */}
          <div className="flex items-center gap-7 flex-1">
            {navLinks.map(link => (
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
            {/* Build Your Box — special accent button */}
            <Link
              to={accentLink.href}
              className={`inline-flex items-center gap-1.5 font-display italic text-[13px] px-4 py-2 rounded-full border-2 transition-all ${
                isActive(accentLink.href)
                  ? 'border-gold bg-gold text-bark'
                  : 'border-gold bg-gold/10 text-gold hover:bg-gold hover:text-bark'
              }`}
            >
              <Package size={14} />
              {accentLink.label}
            </Link>
          </div>

          {/* Center — logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 absolute left-1/2 -translate-x-1/2">
            <img src={logo} alt="Nore'e" className="h-8 w-8 object-contain" />
            <span className="font-display font-semibold text-[1.7rem] text-bark tracking-tight leading-none">Nore'e</span>
          </Link>

          {/* Right — search pill + icons */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center bg-white/70 border border-bark/10 rounded-full h-9 px-4 w-[220px] focus-within:border-gold transition-colors"
            >
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search jewelry..."
                className="flex-1 bg-transparent font-body text-[13px] text-bark placeholder:text-bark-muted/70 focus:outline-none"
              />
              <button type="submit" aria-label="Search" className="text-bark-muted hover:text-gold transition-colors">
                <Search size={15} strokeWidth={1.8} />
              </button>
            </form>
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="lg:hidden text-bark-mid hover:text-gold transition-colors"
            >
              <Search size={19} strokeWidth={1.6} />
            </button>
            <button
              aria-label="Wishlist"
              onClick={() => navigate('/shop')}
              className="text-bark-mid hover:text-gold transition-colors"
            >
              <Heart size={19} strokeWidth={1.6} />
            </button>
            <div
              className="relative"
              onMouseEnter={() => setMiniCartOpen(true)}
              onMouseLeave={() => setMiniCartOpen(false)}
            >
              <button
                aria-label="Cart"
                className="relative text-bark-mid hover:text-gold transition-colors flex items-center"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag size={19} strokeWidth={1.6} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 font-body font-semibold text-[10px] text-bark min-w-[18px] h-[18px] px-1 rounded-full bg-gold flex items-center justify-center">
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
      </header>

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
