import tumblerImage from "@/assets/products/tumbler-green.jpg";
import mugImage from "@/assets/products/mug-botanical.jpg";
import kitImage from "@/assets/products/kit-gold.jpg";
import coffeeImage from "@/assets/products/coffee-reserve.jpg";
import pinImage from "@/assets/products/pin-botanical.jpg";
import vaultImage from "@/assets/membership-vault.jpg";
import travelImage from "@/assets/products/travel-cup.jpg";

export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  collection: string;
  image: string;
  exclusive: boolean;
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
