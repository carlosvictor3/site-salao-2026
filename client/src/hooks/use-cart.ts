import { useState, useEffect } from 'react';

export interface CartItem {
  serviceId: string;
  serviceName: string;
  price: string;
  quantity: number;
  promotionId?: string;
  isPromotion?: boolean;
}

const CART_KEY = 'beauty-salon-cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.serviceId === item.serviceId && i.promotionId === item.promotionId);
      if (existing) {
        return prev.map(i =>
          i.serviceId === item.serviceId && i.promotionId === item.promotionId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (serviceId: string, promotionId?: string) => {
    setItems(prev => prev.filter(i => 
      !(i.serviceId === serviceId && i.promotionId === promotionId)
    ));
  };

  const updateQuantity = (serviceId: string, quantity: number, promotionId?: string) => {
    if (quantity <= 0) {
      removeItem(serviceId, promotionId);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.serviceId === serviceId && i.promotionId === promotionId
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}
