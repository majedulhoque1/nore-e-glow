import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, removeItem, updateQty, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-bark/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-[380px] bg-white z-50 flex flex-col"
            style={{ boxShadow: '-8px 0 40px rgba(28,25,23,0.12)' }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-border">
              <h2 className="font-display font-medium text-xl text-bark">Your Cart</h2>
              <button onClick={onClose} className="hover:text-gold transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center flex-col gap-4">
                <ShoppingBag size={40} className="text-bark-muted" />
                <p className="font-display text-lg text-bark-mid">Your cart is empty</p>
                <button
                  onClick={() => { onClose(); navigate('/shop'); }}
                  className="border border-gold text-gold font-body text-sm uppercase tracking-[0.1em] px-6 py-3 rounded-[2px] hover:bg-gold hover:text-bark transition-colors"
                >
                  Browse Collection
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 items-start relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover border border-border"
                    />
                    <div className="flex-1">
                      <p className="font-display text-[0.95rem] text-bark font-medium line-clamp-1">{item.name}</p>
                      <p className="font-body text-sm text-gold font-semibold mt-1">৳{item.price}</p>
                      <div className="flex items-center gap-0 mt-2 border border-border rounded-sm w-fit">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-ivory-warm transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center border-x border-border font-body font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-ivory-warm transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-bark-muted hover:text-crimson transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5">
                <div className="flex justify-between">
                  <span className="font-body text-sm text-bark-muted">Subtotal</span>
                  <span className="font-display font-semibold text-lg text-bark">৳{subtotal}</span>
                </div>
                <p className="font-body text-[11px] text-bark-muted mt-1">Delivery charge calculated at checkout</p>
                <button
                  onClick={() => { onClose(); navigate('/checkout'); }}
                  className="w-full bg-gold text-bark h-[50px] font-body text-sm uppercase tracking-[0.1em] mt-4 hover:bg-gold-dark transition-colors rounded-[2px]"
                >
                  Checkout · ৳{subtotal}
                </button>
                <button
                  onClick={onClose}
                  className="w-full text-center mt-3 font-body text-sm text-gold hover:underline cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
