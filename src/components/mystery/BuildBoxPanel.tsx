import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Package } from 'lucide-react';

export interface SelectedItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

interface Props {
  items: SelectedItem[];
  min: number;
  max: number;
  onRemove: (id: string) => void;
  onAddToCart: () => void;
  added: boolean;
}

export const BuildBoxPanel = ({ items, min, max, onRemove, onAddToCart, added }: Props) => {
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const discountEligible = items.length >= min;
  const discount = discountEligible ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  const hint =
    items.length === 0
      ? `Pick ${min}–${max} pieces to build your box`
      : items.length < min
        ? `Add ${min - items.length} more to unlock 10% off`
        : items.length < max
          ? `Add ${max - items.length} more to maximize your box`
          : 'Box full — ready!';

  return (
    <div className="bg-white border border-border rounded-[2px] p-5 md:p-6 flex flex-col max-h-[70vh] lg:max-h-none">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Package size={18} className="text-gold" />
          <h3 className="font-display font-medium text-lg text-bark">Your Box</h3>
        </div>
        <span className="font-body text-xs text-bark-muted">
          <span className={items.length >= min ? 'text-gold font-semibold' : ''}>{items.length}</span> / {max}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-3 shrink-0">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
              i < items.length ? 'bg-gold' : 'bg-border'
            }`}
          />
        ))}
      </div>

      <p className="font-body text-xs text-bark-muted mt-2 italic shrink-0">{hint}</p>

      {/* Selected items — scrolls when overflowing */}
      <div className="mt-4 min-h-[80px] flex-1 overflow-y-auto -mx-1 px-1">
        <AnimatePresence>
          {items.length === 0 ? (
            <div className="border border-dashed border-border rounded-[2px] py-8 text-center">
              <p className="font-body text-xs text-bark-muted">No items yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 bg-ivory-warm p-2 rounded-[2px]"
                >
                  <img src={item.image} alt={item.name} className="w-10 h-12 object-cover border border-border shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-xs text-bark line-clamp-1">{item.name}</p>
                    <p className="font-body text-xs text-bark-mid">৳{item.price}</p>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-bark-muted hover:text-crimson transition-colors p-1"
                    aria-label="Remove"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Pricing + CTA — pinned at bottom */}
      <div className="shrink-0">
        {items.length > 0 && (
          <div className="mt-5 pt-4 border-t border-border space-y-2">
            <div className="flex justify-between font-body text-sm text-bark-mid">
              <span>Subtotal</span>
              <span>৳{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between font-body text-sm">
                <span className="text-gold inline-flex items-center gap-1">
                  <Sparkles size={12} /> Bundle discount (10%)
                </span>
                <span className="text-gold font-medium">−৳{discount}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-border">
              <span className="font-display font-medium text-base text-bark">Total</span>
              <span className="font-display font-semibold text-xl text-gold">৳{total}</span>
            </div>
          </div>
        )}

        <button
          onClick={onAddToCart}
          disabled={items.length < min || added}
          className={`mt-5 w-full h-12 font-body font-medium text-sm uppercase tracking-[0.1em] rounded-[2px] transition-all duration-200 active:scale-[0.97] ${
            items.length < min
              ? 'bg-bark-muted/20 text-bark-muted cursor-not-allowed'
              : 'bg-gold text-bark hover:bg-gold-dark hover:-translate-y-px'
          }`}
        >
          {added ? '✓ Added to Cart' : items.length < min ? `Pick ${min - items.length} more` : `Add Custom Box — ৳${total}`}
        </button>

        <p className="font-body text-[10px] text-bark-muted mt-3 text-center leading-relaxed">
          Free delivery within Dhaka · No returns on custom boxes
        </p>
      </div>
    </div>
  );
};
