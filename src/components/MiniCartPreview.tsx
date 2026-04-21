import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

interface Props {
  onOpenFull: () => void;
}

const MiniCartPreview = ({ onOpenFull }: Props) => {
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const recent = items.slice(-2).reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="absolute right-0 top-full mt-2 w-[300px] bg-white border border-border rounded-[2px] shadow-card-hover z-50 overflow-hidden"
    >
      {items.length === 0 ? (
        <div className="p-5 text-center">
          <p className="font-body text-sm text-bark-mid">Your cart is empty.</p>
        </div>
      ) : (
        <>
          <ul className="max-h-[260px] overflow-y-auto divide-y divide-border">
            {recent.map(item => (
              <li key={item.id} className="flex gap-3 p-3">
                <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-[2px] border border-border" />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-[0.95rem] text-bark line-clamp-1">{item.name}</p>
                  <p className="font-body text-xs text-bark-muted mt-0.5">Qty {item.quantity}</p>
                  <p className="font-body text-sm text-gold font-semibold mt-0.5">৳{item.price * item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-border px-4 py-3 flex items-center justify-between">
            <span className="font-body text-xs text-bark-muted uppercase tracking-wider">Subtotal</span>
            <span className="font-display font-semibold text-bark">৳{subtotal}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 p-3 border-t border-border">
            <button
              onClick={onOpenFull}
              className="font-body text-xs uppercase tracking-[0.1em] py-2.5 border border-gold text-gold rounded-[2px] hover:bg-gold hover:text-bark transition-colors"
            >
              View Cart
            </button>
            <button
              onClick={() => navigate('/checkout')}
              className="font-body text-xs uppercase tracking-[0.1em] py-2.5 bg-gold text-bark rounded-[2px] hover:bg-gold-dark transition-colors"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default MiniCartPreview;
