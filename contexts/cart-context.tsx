// contexts/cart-context.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  nankey: number;
  description: string;
  inventarioSala: number;
  inventarioDeposito: number;
  inventarioFrio: number;
  precio: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (index: number, item: CartItem) => void;
  removeItem: (index: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("alternativas-cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("alternativas-cart", JSON.stringify(items));
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem: (item) => setItems((prev) => [...prev, item]),
        updateItem: (i, item) =>
          setItems((prev) => prev.map((p, idx) => (idx === i ? item : p))),
        removeItem: (i) =>
          setItems((prev) => prev.filter((_, idx) => idx !== i)),
        clear: () => setItems([]),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("CartProvider missing");
  return ctx;
}
