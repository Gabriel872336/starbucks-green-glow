import { memberships, products, storeProducts } from "@/lib/products";

export const catalog = [...products, ...memberships, ...storeProducts];

export const catalogForPrompt = catalog
  .map((p) => `${p.id} | ${p.title} | S/ ${p.price.toFixed(2)} | ${p.category} | ${p.collection} | ${p.exclusive ? "Exclusivo" : "No"}${p.description ? ` | ${p.description}` : ""}${p.originalPrice ? ` | Oferta: antes S/ ${p.originalPrice.toFixed(2)}, ahora S/ ${p.price.toFixed(2)}, -${Math.round((1 - p.price / p.originalPrice) * 100)}% OFF; por tiempo limitado (promoción ilustrativa)` : ""}`)
  .join("\n");

export const PRODUCT_MARKER = /\[\[producto:(\d+)\]\]/g;
