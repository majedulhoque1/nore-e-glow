import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';
import MiniCartPreview from './MiniCartPreview';
import { AnimatePresence, motion } from 'framer-motion';

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Rings', href: '/category/rings' },
  { label: 'Bracelets', href: '/category/bracelets' },
  { label: 'New', href: '/category/new-arrivals' },
];

const discoverLink = { label: 'Build Your Box', href: '/mystery-collection/build' };

const NavigationBar = () => {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

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

  const NavItem = ({ href, label, glyph, accent }: { href: string; label: string; glyph?: string; accent?: boolean }) => (
    <Link
      to={href}
      className={`relative font-body text-[11.5px] uppercase tracking-[0.18em] py-1 transition-colors ${
        accent
          ? isActive(href) ? 'text-gold-dark' : 'text-gold hover:text-gold-dark'
          : isActive(href) ? 'text-bark' : 'text-bark-mid hover:text-gold'
      }`}
    >
      {glyph && <span className="text-gold mr-1.5">{glyph}</span>}
      {label}
      <span
        className={`absolute left-0 right-0 -bottom-1 h-px bg-gold transition-transform origin-center duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive(href) ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-30 bg-ivory/75 backdrop-blur-xl supports-[backdrop-filter]:bg-ivory/65">
        {/* Desktop main row — symmetrical 3-column grid */}
        <div className="hidden md:grid relative items-center grid-cols-[1fr_auto_1fr] h-20 px-10 max-w-[1400px] mx-auto">
          {/* Left — primary nav */}
          <nav className="flex items-center gap-8">
            {navLinks.map(link => (
              <NavItem key={link.href} {...link} />
            ))}
            <NavItem {...discoverLink} glyph="✦" accent />
          </nav>

          {/* Center — wordmark */}
          <Link to="/" className="shrink-0 px-6">
            <span className="font-display text-[28px] text-bark tracking-tight leading-none">
              Nore'e
            </span>
          </Link>

          {/* Right — icon cluster */}
          <div className="flex items-center justify-end gap-5">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="text-bark-mid hover:text-gold transition-colors p-1"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Wishlist"
              onClick={() => navigate('/shop')}
              className="text-bark-mid hover:text-gold transition-colors p-1"
            >
              <Heart size={18} strokeWidth={1.5} />
            </button>
            <div
              className="relative"
              onMouseEnter={() => setMiniCartOpen(true)}
              onMouseLeave={() => setMiniCartOpen(false)}
            >
              <button
                aria-label="Cart"
                className="relative text-bark-mid hover:text-gold transition-colors p-1 flex items-center"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-1 font-body font-medium text-[9.5px] text-ivory min-w-[16px] h-[16px] px-1 rounded-full bg-gold flex items-center justify-center leading-none">
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

        {/* Mobile — three column grid */}
        <div className="grid md:hidden grid-cols-3 items-center h-14 px-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-bark-mid justify-self-start p-1"
            aria-label="Menu"
          >
            <Menu size={20} strokeWidth={1.6} />
          </button>
          <Link to="/" className="justify-self-center">
            <span className="font-display text-[22px] text-bark tracking-tight leading-none">
              Nore'e
            </span>
          </Link>
          <div className="flex items-center gap-4 justify-self-end">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="text-bark-mid p-1"
            >
              <Search size={18} strokeWidth={1.6} />
            </button>
            <button
              className="relative text-bark-mid p-1"
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.6} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-1 bg-gold text-ivory text-[9.5px] font-body font-medium rounded-full min-w-[16px] h-[16px] px-1 flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Hairline gold rule */}
        <div className="rule-gold opacity-40" />
      </header>

      {/* Mobile Menu Drawer — refined ivory */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-bark/40 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 h-full w-[300px] bg-ivory z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-7 pt-6 pb-5">
                <span className="font-display text-[22px] text-bark tracking-tight leading-none">
                  Nore'e
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-bark-mid hover:text-gold transition-colors"
                  aria-label="Close menu"
                >
                  <X size={22} strokeWidth={1.6} />
                </button>
              </div>

              <div className="rule-gold opacity-50 mx-7" />

              <div className="flex flex-col px-7 pt-7 pb-8 gap-7 overflow-y-auto">
                <div>
                  <div className="font-body text-[10px] uppercase tracking-[0.25em] text-bark-muted mb-4">
                    Shop
                  </div>
                  <div className="flex flex-col gap-4">
                    {navLinks.map(link => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="font-display text-[26px] text-bark hover:text-gold transition-colors leading-none"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rule-gold opacity-40" />

                <div>
                  <div className="font-body text-[10px] uppercase tracking-[0.25em] text-bark-muted mb-4">
                    Discover
                  </div>
                  <Link
                    to={discoverLink.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-display italic text-[24px] text-gold hover:text-gold-dark transition-colors leading-none inline-flex items-center gap-2"
                  >
                    <span className="text-gold">✦</span>
                    {discoverLink.label}
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
