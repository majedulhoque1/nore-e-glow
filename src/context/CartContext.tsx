import React, { createContext, useContext, useState, useCallback } from 'react';
import { trackAddToCart } from '@/lib/analytics';

export type GiftWrapType = 'kraft' | 'gold' | 'burgundy';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
  // Mystery box fields
  isMystery?: boolean;
  campaignId?: string;
  // Gift wrap fields
  isGift?: boolean;
  giftRecipientName?: string;
  giftMessage?: string;
  giftWrapType?: GiftWrapType;
  giftHandwritten?: boolean;
  giftWrapPaper?: boolean;
  giftCost?: number;
  // Custom box fields
  isCustomBox?: boolean;
  customBoxItems?: { id: string; name: string; price: number; image: string; slug: string }[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  updateCartItem: (id: string, partial: Partial<CartItem>) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Omit<CartItem, 'quantity'>, qty = 1) => {
    trackAddToCart(product, qty);
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { ...product, quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, []);

  const updateCartItem = useCallback((id: string, partial: Partial<CartItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...partial } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, updateCartItem, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
