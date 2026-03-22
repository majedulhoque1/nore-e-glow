import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => (
  <footer className="bg-bark text-ivory">
    <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-8 py-12 md:py-16">
      {/* Brand */}
      <div className="col-span-2 md:col-span-1">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Nore'e" className="h-7 w-7 object-contain brightness-200" />
          <span className="font-display text-2xl text-ivory">Nore'e</span>
        </div>
        <p className="font-body text-sm text-bark-muted mt-3 max-w-[200px] font-light">
          Handcrafted jewelry, delivered with care. Dhaka, Bangladesh.
        </p>
        <div className="flex gap-3 mt-4">
          <a href="#" className="text-gold hover:text-gold-light transition-colors"><Instagram size={18} /></a>
          <a href="#" className="text-gold hover:text-gold-light transition-colors"><Facebook size={18} /></a>
        </div>
      </div>

      {/* Shop */}
      <div>
        <h4 className="font-body font-medium text-xs uppercase tracking-[0.15em] text-bark-muted mb-4">Shop</h4>
        <div className="flex flex-col gap-2.5">
          {['All Collections', 'Rings', 'Bracelets', 'Phone Charms', 'New Arrivals'].map(l => (
            <Link key={l} to="/shop" className="font-body text-sm text-bark-muted hover:text-gold transition-colors">{l}</Link>
          ))}
        </div>
      </div>

      {/* Help */}
      <div>
        <h4 className="font-body font-medium text-xs uppercase tracking-[0.15em] text-bark-muted mb-4">Help</h4>
        <div className="flex flex-col gap-2.5">
          {['How to Order', 'Delivery Info', 'Exchange Policy', 'Contact Us'].map(l => (
            <span key={l} className="font-body text-sm text-bark-muted hover:text-gold transition-colors cursor-pointer">{l}</span>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div>
        <h4 className="font-body font-medium text-xs uppercase tracking-[0.15em] text-bark-muted mb-4">Contact</h4>
        <a
          href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '8801700000000'}`}
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
      <span className="font-body text-xs text-bark-muted">Made with care in Dhaka</span>
    </div>
  </footer>
);

export default Footer;
