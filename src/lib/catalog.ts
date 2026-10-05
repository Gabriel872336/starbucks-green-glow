import { memberships, products } from "@/lib/products";

export const catalog = [...products, ...memberships];

export const catalogForPrompt = catalog
  .map((p) => `${p.id} | ${p.title} | S/ ${p.price.toFixed(2)} | ${p.category} | ${p.collection} | ${p.exclusive ? "Exclusivo" : "No"}`)
  .join("\n");

export const PRODUCT_MARKER = /\[\[producto:(\d+)\]\]/g;
