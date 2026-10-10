import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, memberships, storeProducts, type Product } from "./products";
import { useAuth } from "./auth";

export type CartItem = Product & { quantity: number };
export type Order = {
  number: string;
  receiptNumber: string;
  issuedAt: string;
  items: CartItem[];
  total: number;
  method: string;
};

type CartState = {
  ids: number[];
  items: CartItem[];
  subtotal: number;
  lastOrder: Order | null;
  orders: Order[];
  add: (id: number) => void;
  removeOne: (id: number) => void;
  removeAll: (id: number) => void;
  clear: () => void;
  placeOrder: (method: string) => Order;
  setMembership: (id: number) => void;
  viewOrder: (order: Order) => void;
};

const CartContext = createContext<CartState | null>(null);
const ordersKey = (email: string) => `sbx-orders:${email.toLowerCase()}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [ids, setIds] = useState<number[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Order history is kept per account in this browser only (prototype).
  useEffect(() => {
    if (!user) { setOrders([]); return; }
    try { setOrders(JSON.parse(localStorage.getItem(ordersKey(user.email)) || "[]")); } catch { setOrders([]); }
  }, [user?.email]);

  const items = useMemo(
    () => [...products, ...memberships, ...storeProducts].map((p) => ({ ...p, quantity: ids.filter((id) => id === p.id).length })).filter((p) => p.quantity > 0),
    [ids],
  );
  const subtotal = items.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const value: CartState = {
    ids,
    items,
    subtotal,
    lastOrder,
    orders,
    add: (id) => setIds((c) => [...c, id]),
    removeOne: (id) =>
      setIds((c) => {
        const i = c.lastIndexOf(id);
        return i < 0 ? c : c.filter((_, idx) => idx !== i);
      }),
    removeAll: (id) => setIds((c) => c.filter((x) => x !== id)),
    clear: () => setIds([]),
    setMembership: (id) => setIds((c) => [...c.filter((x) => !memberships.some((m) => m.id === x)), id]),
    viewOrder: (order) => setLastOrder(order),
    placeOrder: (method) => {
      const receiptSequence = Math.floor(100000 + Math.random() * 900000);
      const order: Order = {
        number: `SBX-${Date.now().toString().slice(-8)}`,
        receiptNumber: `B001-${receiptSequence}`,
        issuedAt: new Date().toISOString(),
        items,
        total: subtotal,
        method,
      };
      setLastOrder(order);
      if (user) {
        const next = [order, ...orders];
        setOrders(next);
        localStorage.setItem(ordersKey(user.email), JSON.stringify(next));
      }
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

export function activeMembership(orders: Order[]) {
  for (const o of orders) {
    const m = o.items.find((i) => i.collection === "Membresía");
    if (m) return m;
  }
  return null;
}
