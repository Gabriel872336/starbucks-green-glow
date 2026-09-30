import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import tumblerImage from "@/assets/products/tumbler-green.jpg";
import mugImage from "@/assets/products/mug-botanical.jpg";
import kitImage from "@/assets/products/kit-gold.jpg";
import coffeeImage from "@/assets/products/coffee-reserve.jpg";
import pinImage from "@/assets/products/pin-botanical.jpg";
import travelImage from "@/assets/products/travel-cup.jpg";

export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  collection: string;
  image: string;
  exclusive: boolean;
}

export const products: Product[] = [
  { id: 1, title: "Tumbler Verde Reserva", price: 129, category: "Vasos térmicos", collection: "Green", image: tumblerImage, exclusive: true },
  { id: 2, title: "Taza Botánica Andes", price: 89, category: "Tazas", collection: "Perú", image: mugImage, exclusive: false },
  { id: 3, title: "Kit Experiencia Dorada", price: 249, category: "Kit reutilizable", collection: "Green", image: kitImage, exclusive: true },
  { id: 4, title: "Café Reserva del Valle", price: 72, category: "Bolsas de café", collection: "Perú", image: coffeeImage, exclusive: true },
  { id: 5, title: "Pin Botánico Colección", price: 49, category: "Pines", collection: "Perú", image: pinImage, exclusive: false },
  { id: 6, title: "Vaso Reutilizable Verde", price: 79, category: "Vasos térmicos", collection: "Green", image: travelImage, exclusive: false },
];

export interface CartLine extends Product {
  quantity: number;
}

export interface Order {
  number: string;
  items: CartLine[];
  total: number;
  method: "tarjeta" | "yape";
}

interface CartContextValue {
  cart: number[];
  cartItems: CartLine[];
  subtotal: number;
  add: (id: number) => void;
  removeOne: (id: number) => void;
  removeAll: (id: number) => void;
  clear: () => void;
  lastOrder: Order | null;
  placeOrder: (method: Order["method"]) => Order;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<number[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const cartItems = useMemo(
    () =>
      products
        .map((product) => ({ ...product, quantity: cart.filter((id) => id === product.id).length }))
        .filter((product) => product.quantity > 0),
    [cart],
  );
  const subtotal = cartItems.reduce((sum, product) => sum + product.price * product.quantity, 0);

  function add(id: number) {
    setCart((items) => [...items, id]);
  }

  function removeOne(id: number) {
    const index = cart.lastIndexOf(id);
    if (index < 0) return;
    setCart((items) => items.filter((_, itemIndex) => itemIndex !== index));
  }

  function removeAll(id: number) {
    setCart((items) => items.filter((itemId) => itemId !== id));
  }

  function clear() {
    setCart([]);
  }

  function placeOrder(method: Order["method"]): Order {
    const order: Order = {
      number: `SBX-${Date.now().toString().slice(-6)}`,
      items: cartItems,
      total: subtotal,
      method,
    };
    setLastOrder(order);
    return order;
  }

  return (
    <CartContext.Provider value={{ cart, cartItems, subtotal, add, removeOne, removeAll, clear, lastOrder, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
