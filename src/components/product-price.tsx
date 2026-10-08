import type { Product } from "@/lib/products";

export function discountPercent(product: Product) {
  if (!product.originalPrice || product.originalPrice <= product.price) return null;
  return Math.round((1 - product.price / product.originalPrice) * 100);
}

export function ProductPrice({ product }: { product: Product }) {
  const discount = discountPercent(product);
  return <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
    {discount !== null && <><span className="sr-only">Precio original:</span><del className="text-sm font-normal text-muted-foreground">S/ {product.originalPrice?.toFixed(2)}</del><span className="sr-only">Precio de oferta:</span></>}
    <span className="font-bold text-primary">S/ {product.price.toFixed(2)}</span>
  </span>;
}

export function OfferBadge({ product }: { product: Product }) {
  const discount = discountPercent(product);
  if (discount === null) return null;
  return <span className="inline-flex rounded-sm bg-gold px-2.5 py-1 text-xs font-bold text-accent-foreground">-{discount}% OFF</span>;
}