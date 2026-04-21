import { Check, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  product: { id: string; name: string; price: number; images: string[]; slug: string };
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}

export const BuildBoxProductCard = ({ product, selected, disabled, onToggle }: Props) => {
  const img = product.images?.[0] || '/placeholder.svg';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <div className="relative aspect-[4/5] bg-ivory-warm overflow-hidden border border-border">
        <img
          src={img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {selected && (
          <div className="absolute inset-0 bg-bark/40 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center">
              <Check size={26} className="text-bark" strokeWidth={2.5} />
            </div>
          </div>
        )}
      </div>

      <div className="mt-2.5">
        <p className="font-display text-[0.95rem] text-bark line-clamp-1">{product.name}</p>
        <p className="font-body text-sm text-bark-mid mt-0.5">৳{product.price}</p>

        <button
          onClick={onToggle}
          disabled={disabled && !selected}
          className={`mt-2 w-full h-9 font-body text-xs uppercase tracking-[0.1em] rounded-[2px] transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-1.5 ${
            selected
              ? 'bg-gold text-bark hover:bg-gold-dark'
              : disabled
                ? 'bg-bark-muted/15 text-bark-muted cursor-not-allowed'
                : 'border border-bark/20 text-bark hover:border-gold hover:text-gold'
          }`}
        >
          {selected ? <><Check size={13} /> Added</> : <><Plus size={13} /> Add to Box</>}
        </button>
      </div>
    </motion.div>
  );
};
