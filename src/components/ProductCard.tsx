import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number | null;
  images: string[];
  is_new_arrival?: boolean;
  index?: number;
}

const ProductCard = ({ name, slug, price, compare_at_price, images, is_new_arrival, index = 0 }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => navigate(`/product/${slug}`)}
      className="group cursor-pointer bg-white border border-transparent hover:border-gold hover:shadow-card-hover transition-all duration-300 rounded-[2px]"
    >
      <div className="aspect-[4/5] overflow-hidden relative">
        <img
          src={images[0] || '/placeholder.svg'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        {is_new_arrival && (
          <span className="absolute top-2 left-2 bg-crimson text-white font-body text-[11px] px-2 py-0.5 uppercase tracking-wider">
            New
          </span>
        )}
        {compare_at_price && (
          <span className="absolute top-2 left-2 bg-gold text-bark font-body text-[11px] px-2 py-0.5 uppercase tracking-wider">
            Sale
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="font-display font-medium text-[1.05rem] text-bark leading-snug line-clamp-1">{name}</p>
        <div className="flex justify-between items-center mt-1">
          <span className="font-body font-semibold text-gold">৳{price}</span>
          {compare_at_price && (
            <span className="font-body text-bark-muted line-through text-sm">৳{compare_at_price}</span>
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
