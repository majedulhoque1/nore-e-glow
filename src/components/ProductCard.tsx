import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number | null;
  images: string[];
  is_new_arrival?: boolean;
  index?: number;
  ribbon?: string;
  stock_qty?: number | null;
}

const ProductCard = ({ id, name, slug, price, compare_at_price, images, is_new_arrival, index = 0, ribbon, stock_qty }: ProductCardProps) => {
  const navigate = useNavigate();
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const wished = has(id);
  const primary = images?.[0] || '/placeholder.svg';
  const secondary = images?.[1];
  const savings = compare_at_price && compare_at_price > price ? compare_at_price - price : 0;
  // null/undefined stock = untracked (unlimited); <= 0 = sold out.
  const soldOut = stock_qty !== null && stock_qty !== undefined && stock_qty <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (added || soldOut) return;
    addItem({ id, name, price, image: primary, slug });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => navigate(`/product/${slug}`)}
      className="group cursor-pointer"
    >
      <div className="aspect-[4/5] overflow-hidden relative bg-ivory-warm">
        {/* Primary image */}
        <img
          src={primary}
          alt={name}
          className="w-full h-full object-cover transition-all duration-[900ms] ease-out group-hover:opacity-0 group-hover:scale-[1.02]"
        />
        {/* Secondary swap image */}
        {secondary && (
          <img
            src={secondary}
            alt={`${name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-[900ms] ease-out scale-[1.04] group-hover:scale-[1.06]"
          />
        )}

        {/* Sold-out overlay */}
        {soldOut && (
          <div className="absolute inset-0 z-[2] bg-ivory/55 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-bark/90 text-ivory font-body text-[10px] px-3 py-1.5 uppercase tracking-[0.2em]">
              Sold out
            </span>
          </div>
        )}

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-[2]">
          {ribbon && (
            <span className="bg-bark text-gold font-body text-[9.5px] px-2.5 py-1 uppercase tracking-[0.18em]">
              {ribbon}
            </span>
          )}
          {is_new_arrival && (
            <span className="bg-crimson text-white font-body text-[9.5px] px-2.5 py-1 uppercase tracking-[0.18em]">
              New
            </span>
          )}
          {compare_at_price && (
            <span className="bg-gold text-bark font-body text-[9.5px] px-2.5 py-1 uppercase tracking-[0.18em]">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist heart */}
        <button
          onClick={handleHeart}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ivory/95 backdrop-blur flex items-center justify-center hover:bg-ivory transition-all active:scale-90 z-[2] shadow-soft"
        >
          <Heart
            size={15}
            className={wished ? 'fill-crimson text-crimson' : 'text-bark-mid'}
          />
        </button>

        {/* Quick-add (desktop only) — hidden when sold out */}
        {!soldOut && (
          <button
            onClick={handleQuickAdd}
            className="hidden md:flex absolute left-3 right-3 bottom-3 h-10 items-center justify-center gap-2 bg-bark/95 backdrop-blur text-ivory font-body text-[11px] uppercase tracking-[0.18em] rounded-[2px] opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 hover:bg-gold hover:text-bark z-[2]"
          >
            {added ? <><Check size={14} /> Added</> : <><Plus size={14} /> Quick Add</>}
          </button>
        )}
      </div>

      <div className="pt-4 pb-2">
        <p className="font-display font-medium text-[1.1rem] text-bark leading-snug line-clamp-1 group-hover:text-gold-dark transition-colors">{name}</p>
        <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
          <span className="font-body font-semibold text-bark tracking-wide">৳{price}</span>
          {compare_at_price && (
            <>
              <span className="font-body text-bark-muted line-through text-sm">৳{compare_at_price}</span>
              {savings > 0 && (
                <span className="font-body text-[10px] text-crimson font-medium uppercase tracking-wider">Save ৳{savings}</span>
              )}
            </>
          )}
        </div>
        <p className="mt-2.5 text-[10px] font-body text-bark-mid uppercase tracking-[0.16em] flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-gold" />
          Cash on delivery
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
