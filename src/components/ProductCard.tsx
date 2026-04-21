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
}

const ProductCard = ({ id, name, slug, price, compare_at_price, images, is_new_arrival, index = 0, ribbon }: ProductCardProps) => {
  const navigate = useNavigate();
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const wished = has(id);
  const primary = images?.[0] || '/placeholder.svg';
  const secondary = images?.[1];
  const savings = compare_at_price && compare_at_price > price ? compare_at_price - price : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (added) return;
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
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => navigate(`/product/${slug}`)}
      className="group cursor-pointer bg-white border border-transparent hover:border-gold hover:shadow-card-hover transition-all duration-300 rounded-[2px]"
    >
      <div className="aspect-[4/5] overflow-hidden relative">
        {/* Primary image */}
        <img
          src={primary}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {/* Secondary swap image */}
        {secondary && (
          <img
            src={secondary}
            alt={`${name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-[1.02]"
          />
        )}
        {!secondary && (
          <div className="absolute inset-0 bg-bark/0 group-hover:bg-bark/0 transition-colors" />
        )}

        {/* Top-left badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {ribbon && (
            <span className="bg-bark text-gold font-body text-[10px] px-2 py-0.5 uppercase tracking-wider">
              {ribbon}
            </span>
          )}
          {is_new_arrival && (
            <span className="bg-crimson text-white font-body text-[10px] px-2 py-0.5 uppercase tracking-wider">
              New
            </span>
          )}
          {compare_at_price && (
            <span className="bg-gold text-bark font-body text-[10px] px-2 py-0.5 uppercase tracking-wider">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist heart */}
        <button
          onClick={handleHeart}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors active:scale-90"
        >
          <Heart
            size={14}
            className={wished ? 'fill-crimson text-crimson' : 'text-bark-mid'}
          />
        </button>

        {/* Quick-add (desktop only) */}
        <button
          onClick={handleQuickAdd}
          className="hidden md:flex absolute left-2 right-2 bottom-2 h-9 items-center justify-center gap-1.5 bg-bark text-ivory font-body text-[11px] uppercase tracking-[0.12em] rounded-[2px] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-gold hover:text-bark"
        >
          {added ? <><Check size={14} /> Added</> : <><Plus size={14} /> Quick Add</>}
        </button>
      </div>

      <div className="p-3">
        <p className="font-display font-medium text-[1.05rem] text-bark leading-snug line-clamp-1">{name}</p>
        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          <span className="font-body font-semibold text-gold">৳{price}</span>
          {compare_at_price && (
            <>
              <span className="font-body text-bark-muted line-through text-sm">৳{compare_at_price}</span>
              {savings > 0 && (
                <span className="font-body text-[10px] text-crimson font-medium">Save ৳{savings}</span>
              )}
            </>
          )}
        </div>
        <p className="mt-2 text-[11px] font-body text-bark-muted border border-border rounded-sm px-2 py-0.5 w-fit">
          COD Available
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
