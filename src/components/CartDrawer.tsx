import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Minus, Plus, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftCustomizationPanel, type GiftData } from './mystery/GiftCustomizationPanel';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, removeItem, updateQty, updateCartItem, subtotal } = useCart();
  const navigate = useNavigate();

  const mysteryItem = items.find(i => i.isMystery);
  const giftCost = (mysteryItem?.isGift && mysteryItem?.giftWrapPaper) ? 50 : 0;
  const cartTotal = subtotal + giftCost;

  const giftValue: GiftData = {
    isGift: mysteryItem?.isGift ?? false,
    recipientName: mysteryItem?.giftRecipientName ?? '',
    message: mysteryItem?.giftMessage ?? '',
    wrapPaper: mysteryItem?.giftWrapPaper ?? false,
  };

  const handleGiftChange = (data: GiftData) => {
    if (!mysteryItem) return;
    updateCartItem(mysteryItem.id, {
      isGift: data.isGift,
      giftRecipientName: data.recipientName || undefined,
      giftMessage: data.message || undefined,
      giftWrapPaper: data.wrapPaper,
      giftCost: data.isGift && data.wrapPaper ? 50 : 0,
    });
  };

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
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onRemove={() => removeItem(item.id)}
                    onQty={(q) => updateQty(item.id, q)}
                  />
                ))}

                {/* Gift wrap panel — only when mystery box in cart */}
                {mysteryItem && (
                  <GiftCustomizationPanel value={giftValue} onChange={handleGiftChange} />
                )}
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-5">
                <div className="flex justify-between">
                  <span className="font-body text-sm text-bark-muted">Subtotal</span>
                  <span className="font-body text-sm text-bark">৳{subtotal}</span>
                </div>
                {giftCost > 0 && (
                  <div className="flex justify-between mt-1.5">
                    <span className="font-body text-sm text-bark-muted">Gift wrap</span>
                    <span className="font-body text-sm text-gold font-medium">+৳{giftCost}</span>
                  </div>
                )}
                <div className="flex justify-between mt-2 pt-2 border-t border-border">
                  <span className="font-display text-base text-bark">Total</span>
                  <span className="font-display font-semibold text-lg text-bark">৳{cartTotal}</span>
                </div>
                <p className="font-body text-[11px] text-bark-muted mt-1">Delivery calculated at checkout</p>
                <button
                  onClick={() => { onClose(); navigate('/checkout'); }}
                  className="w-full bg-gold text-bark h-[50px] font-body text-sm uppercase tracking-[0.1em] mt-4 hover:bg-gold-dark transition-colors rounded-[2px]"
                >
                  Checkout · ৳{cartTotal}
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

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  isCustomBox?: boolean;
  customBoxItems?: { id: string; name: string; price: number; image: string; slug: string }[];
}

const CartItemRow = ({ item, onRemove, onQty }: { item: CartItem; onRemove: () => void; onQty: (q: number) => void }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex gap-3 items-start relative">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-20 object-cover border border-border"
      />
      <div className="flex-1 min-w-0">
        <p className="font-display text-[0.95rem] text-bark font-medium line-clamp-1">{item.name}</p>
        <p className="font-body text-sm text-gold font-semibold mt-1">৳{item.price}</p>

        {item.isCustomBox && item.customBoxItems ? (
          <button
            onClick={() => setExpanded(e => !e)}
            className="mt-2 inline-flex items-center gap-1 font-body text-xs text-bark-muted hover:text-gold transition-colors"
          >
            <ChevronDown size={12} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            {expanded ? 'Hide' : `View ${item.customBoxItems.length} items`}
          </button>
        ) : (
          <div className="flex items-center gap-0 mt-2 border border-border rounded-sm w-fit">
            <button
              onClick={() => onQty(item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-ivory-warm transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 h-8 flex items-center justify-center border-x border-border font-body font-medium text-sm">
              {item.quantity}
            </span>
            <button
              onClick={() => onQty(item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-ivory-warm transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        )}

        {expanded && item.customBoxItems && (
          <ul className="mt-2 space-y-1 bg-ivory-warm p-2 rounded-sm">
            {item.customBoxItems.map(ci => (
              <li key={ci.id} className="flex justify-between font-body text-[11px] text-bark-mid">
                <span className="line-clamp-1">{ci.name}</span>
                <span className="text-bark-muted shrink-0 ml-2">৳{ci.price}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={onRemove}
        className="text-bark-muted hover:text-crimson transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default CartDrawer;
