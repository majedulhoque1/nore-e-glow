import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, ArrowRight } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '8801700000000';

  return (
    <footer className="bg-bark text-ivory">
      {/* WhatsApp CTA band */}
      <div className="border-b border-bark-mid/30">
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.18em] text-gold">Need help?</p>
            <h3 className="font-display italic font-light text-ivory mt-2" style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2rem)' }}>
              Questions? Message us on WhatsApp.
            </h3>
            <p className="font-body text-sm text-bark-muted mt-2 max-w-md">
              Our team replies within minutes — order help, sizing, custom requests.
            </p>
          </div>
          <a
            href={`https://wa.me/${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold text-bark font-body font-medium text-sm uppercase tracking-[0.1em] px-7 py-4 rounded-[2px] hover:bg-gold-light hover:-translate-y-px transition-all duration-200 active:scale-[0.97]"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-8 py-12 md:py-16">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Nore'e" className="h-7 w-7 object-contain brightness-200" />
            <span className="font-display text-2xl text-ivory">Nore'e</span>
          </div>
          <p className="font-body text-sm text-bark-muted mt-3 max-w-[200px] font-light">
            Dhaka, Bangladesh.
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href="https://www.instagram.com/noreejewellery/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100066478733144"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-body font-medium text-xs uppercase tracking-[0.15em] text-bark-muted mb-4">Shop</h4>
          <div className="flex flex-col gap-2.5">
            {[
              { label: 'All Collections', href: '/shop' },
              { label: 'Rings', href: '/category/rings' },
              { label: 'Bracelets', href: '/category/bracelets' },
              { label: 'Phone Charms', href: '/category/phone-charms' },
              { label: 'New Arrivals', href: '/category/new-arrivals' },
            ].map(l => (
              <Link key={l.label} to={l.href} className="font-body text-sm text-bark-muted hover:text-gold transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-body font-medium text-xs uppercase tracking-[0.15em] text-bark-muted mb-4">Help</h4>
          <div className="flex flex-col gap-2.5">
            {['How to Order', 'Delivery Info', 'Contact Us'].map(l => (
              <span key={l} className="font-body text-sm text-bark-muted hover:text-gold transition-colors cursor-pointer">{l}</span>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-body font-medium text-xs uppercase tracking-[0.15em] text-bark-muted mb-4">Contact</h4>
          <a
            href={`https://wa.me/${phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gold font-body text-sm hover:text-gold-light transition-colors"
          >
            <MessageCircle size={16} />
            Order via WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-bark-mid/30 py-6 px-6 md:px-8 max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <span className="font-body text-xs text-bark-muted">© 2025 Nore'e. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link to="/admin" className="font-body text-[10px] text-bark-muted/40 hover:text-bark-muted transition-colors">admin</Link>
          <span className="font-body text-xs text-bark-muted">Made with care in Dhaka</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
