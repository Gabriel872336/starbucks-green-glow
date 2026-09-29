import { createContext, useContext, useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import tumblerImage from "@/assets/products/tumbler-green.jpg";
import mugImage from "@/assets/products/mug-botanical.jpg";
import kitImage from "@/assets/products/kit-gold.jpg";
import coffeeImage from "@/assets/products/coffee-reserve.jpg";
import pinImage from "@/assets/products/pin-botanical.jpg";
import travelImage from "@/assets/products/travel-cup.jpg";

export const products = [
  { id: 1, title: "Tumbler Verde Reserva", price: 129, category: "Vasos térmicos", collection: "Green", image: tumblerImage, exclusive: true },
  { id: 2, title: "Taza Botánica Andes", price: 89, category: "Tazas", collection: "Perú", image: mugImage, exclusive: false },
  { id: 3, title: "Kit Experiencia Dorada", price: 249, category: "Kit reutilizable", collection: "Green", image: kitImage, exclusive: true },
  { id: 4, title: "Café Reserva del Valle", price: 72, category: "Bolsas de café", collection: "Perú", image: coffeeImage, exclusive: true },
  { id: 5, title: "Pin Botánico Colección", price: 49, category: "Pines", collection: "Perú", image: pinImage, exclusive: false },
  { id: 6, title: "Vaso Reutilizable Verde", price: 79, category: "Vasos térmicos", collection: "Green", image: travelImage, exclusive: false },
];

export type CartItem = (typeof products)[number] & { quantity: number };
export type Order = { id: string; items: { title: string; quantity: number; price: number }[]; total: number; method: string; date: string };

type CartState = { cart: number[]; setCart: Dispatch<SetStateAction<number[]>>; items: CartItem[]; subtotal: number };
const CartContext = createContext<CartState | null>(null);
const KEY = "sbx-demo-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setCart(JSON.parse(raw)); } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(cart)); }, [cart, ready]);
  const items = useMemo(() => products.map((p) => ({ ...p, quantity: cart.filter((id) => id === p.id).length })).filter((p) => p.quantity > 0), [cart]);
  const subtotal = items.reduce((s, p) => s + p.price * p.quantity, 0);
  return <CartContext.Provider value={{ cart, setCart, items, subtotal }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const ORDER_KEY = "sbx-last-order";
