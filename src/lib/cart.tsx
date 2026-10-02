import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { products, memberships, type Product } from "./products";

export type CartItem = Product & { quantity: number };
export type Order = { number: string; items: CartItem[]; total: number; method: string };

type CartState = {
  ids: number[];
  items: CartItem[];
  subtotal: number;
  lastOrder: Order | null;
  add: (id: number) => void;
  removeOne: (id: number) => void;
  removeAll: (id: number) => void;
  clear: () => void;
  placeOrder: (method: string) => Order;
  setMembership: (id: number) => void;
};

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const items = useMemo(
    () => [...products, ...memberships].map((p) => ({ ...p, quantity: ids.filter((id) => id === p.id).length })).filter((p) => p.quantity > 0),
    [ids],
  );
  const subtotal = items.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const value: CartState = {
    ids,
    items,
    subtotal,
    lastOrder,
    add: (id) => setIds((c) => [...c, id]),
    removeOne: (id) =>
      setIds((c) => {
        const i = c.lastIndexOf(id);
        return i < 0 ? c : c.filter((_, idx) => idx !== i);
      }),
    removeAll: (id) => setIds((c) => c.filter((x) => x !== id)),
    clear: () => setIds([]),
    setMembership: (id) => setIds((c) => [...c.filter((x) => !memberships.some((m) => m.id === x)), id]),
    placeOrder: (method) => {
      const order: Order = {
        number: `SBX-${Date.now().toString().slice(-8)}`,
        items,
        total: subtotal,
        method,
      };
      setLastOrder(order);
      setIds([]);
      return order;
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
