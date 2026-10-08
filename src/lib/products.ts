import tumblerImage from "@/assets/products/tumbler-green.jpg";
import mugImage from "@/assets/products/mug-botanical.jpg";
import kitImage from "@/assets/products/kit-gold.jpg";
import coffeeImage from "@/assets/products/coffee-reserve.jpg";
import pinImage from "@/assets/products/pin-botanical.jpg";
import vaultImage from "@/assets/membership-vault.jpg";
import travelImage from "@/assets/products/travel-cup.jpg";

import storeImage0 from "@/assets/store/frappuccino.jpg";
import storeImage1 from "@/assets/store/espresso.jpg";
import storeImage2 from "@/assets/store/tea.jpg";
import storeImage3 from "@/assets/store/muffin.jpg";
import storeImage4 from "@/assets/store/croissant.jpg";
import storeImage5 from "@/assets/store/sandwich.jpg";
import storeImage6 from "@/assets/store/coffee-muffin.jpg";
import storeImage7 from "@/assets/store/latte-croissant.jpg";
import storeImage8 from "@/assets/store/frappuccino-brownie.jpg";

export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  collection: string;
  image: string;
  exclusive: boolean;
  description?: string;
  originalPrice?: number;
};

export const products: Product[] = [
  { id: 1, title: "Tumbler Verde Reserva", price: 129, category: "Vasos térmicos", collection: "Green", image: tumblerImage, exclusive: true },
  { id: 2, title: "Taza Botánica Andes", price: 89, category: "Tazas", collection: "Perú", image: mugImage, exclusive: false },
  { id: 3, title: "Kit Experiencia Dorada", price: 249, category: "Kit reutilizable", collection: "Green", image: kitImage, exclusive: true },
  { id: 4, title: "Café Reserva del Valle", price: 72, category: "Bolsas de café", collection: "Perú", image: coffeeImage, exclusive: true },
  { id: 5, title: "Pin Botánico Colección", price: 49, category: "Pines", collection: "Perú", image: pinImage, exclusive: false },
  { id: 6, title: "Vaso Reutilizable Verde", price: 79, category: "Vasos térmicos", collection: "Green", image: travelImage, exclusive: false },
];

export const memberships: Product[] = [
  { id: 101, title: "Membresía Green", price: 49, category: "Membresía mensual", collection: "Membresía", image: vaultImage, exclusive: false },
  { id: 102, title: "Membresía Gold", price: 89, category: "Membresía mensual", collection: "Membresía", image: vaultImage, exclusive: true },
  { id: 103, title: "Membresía Reserve", price: 149, category: "Membresía mensual", collection: "Membresía", image: vaultImage, exclusive: true },
];

// Illustrative menu and prices for the conceptual store.
export const storeCategories = ["Bebidas Icónicas", "Panadería & Pastelería", "Packs de Experiencia", "Ofertas Limitadas 🔥"] as const;
export const storeProducts: Product[] = [
  { id: 201, title: "Caramel Frappuccino", description: "Café, hielo y caramelo con crema batida para un momento especial.", price: 19.90, category: "Bebidas Icónicas", collection: "En tienda", image: storeImage0, exclusive: false },
  { id: 202, title: "Espresso Clásico", description: "Un espresso intenso y aromático, con una delicada capa de crema.", price: 9.90, category: "Bebidas Icónicas", collection: "En tienda", image: storeImage1, exclusive: false },
  { id: 203, title: "Té Verde Helado", description: "Té verde con hielo y un toque cítrico, fresco y ligero.", price: 14.90, category: "Bebidas Icónicas", collection: "En tienda", image: storeImage2, exclusive: false },
  { id: 204, title: "Muffin de Arándanos", description: "Suave por dentro, dorado por fuera y lleno de arándanos.", price: 10.90, category: "Panadería & Pastelería", collection: "En tienda", image: storeImage3, exclusive: false },
  { id: 205, title: "Croissant de Mantequilla", description: "Capas delicadas y crujientes con el sabor de la mantequilla.", price: 9.90, category: "Panadería & Pastelería", collection: "En tienda", image: storeImage4, exclusive: false },
  { id: 206, title: "Sándwich de Pollo y Queso", description: "Pan tostado, pollo, queso, lechuga y tomate en cada bocado.", price: 18.90, category: "Panadería & Pastelería", collection: "En tienda", image: storeImage5, exclusive: false },
  { id: 207, title: "Pack Cappuccino & Muffin", description: "Cappuccino con espuma cremosa y un muffin de arándanos.", price: 24.90, category: "Packs de Experiencia", collection: "En tienda", image: storeImage6, exclusive: false },
  { id: 208, title: "Pack Latte & Croissant", description: "La suavidad de un latte junto a un croissant de mantequilla.", price: 23.90, category: "Packs de Experiencia", collection: "En tienda", image: storeImage7, exclusive: false },
  { id: 209, title: "Pack Frappuccino & Brownie", description: "Caramel Frappuccino y brownie de chocolate para darte un gusto.", price: 29.90, category: "Packs de Experiencia", collection: "En tienda", image: storeImage8, exclusive: false },
  // Illustrative promotions: price is the amount charged; originalPrice is display-only.
  { id: 210, title: "Pack Cappuccino & Muffin", description: "Tu desayuno con cappuccino cremoso y muffin de arándanos, ahora en promoción.", originalPrice: 24.90, price: 19.92, category: "Ofertas Limitadas 🔥", collection: "En tienda", image: storeImage6, exclusive: false },
  { id: 211, title: "Pack Latte & Croissant", description: "Un latte suave y un croissant de mantequilla para empezar bien el día.", originalPrice: 23.90, price: 16.73, category: "Ofertas Limitadas 🔥", collection: "En tienda", image: storeImage7, exclusive: false },
  { id: 212, title: "Pack Frappuccino & Brownie", description: "Caramel Frappuccino y brownie de chocolate: una combinación para darte un gusto.", originalPrice: 29.90, price: 23.92, category: "Ofertas Limitadas 🔥", collection: "En tienda", image: storeImage8, exclusive: false },
];
