import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storeCategories, storeProducts } from "@/lib/products";
import { OfferBadge, ProductPrice } from "@/components/product-price";

export function StoreFavorites({ onAdd }: { onAdd: (id: number, title: string) => void }) {
  const [category, setCategory] = useState<(typeof storeCategories)[number]>("Bebidas Icónicas");
  const items = storeProducts.filter((product) => product.category === category);

  return <section id="favoritos-en-tienda" aria-labelledby="store-favorites-title" className="scroll-mt-24 border-b border-border/70 bg-card px-5 py-16 sm:py-24 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <p id="store-favorites-title" className="text-xs font-bold uppercase text-primary">NUESTROS FAVORITOS EN TIENDA</p>
      <h2 className="mt-4 max-w-3xl text-balance font-display text-4xl font-medium leading-tight text-forest sm:text-5xl">Tu experiencia favorita,<br className="hidden sm:block" /> ahora en casa.</h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Disfruta en casa la auténtica experiencia de nuestros productos favoritos preparados en tienda.</p>
      <div role="tablist" aria-label="Categorías de productos en tienda" className="mt-8 flex flex-wrap gap-2">
        {storeCategories.map((item, index) => <Button key={item} id={`store-tab-${index}`} role="tab" aria-selected={category === item} aria-controls="store-products-panel" variant={category === item ? "default" : "outline"} className={`h-auto min-h-10 whitespace-normal px-4 py-2 text-xs sm:text-sm ${item === "Ofertas Limitadas 🔥" ? "border-gold bg-gold text-accent-foreground hover:bg-gold/80 hover:text-accent-foreground" : ""} ${category === item && item === "Ofertas Limitadas 🔥" ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""}`} onClick={() => setCategory(item)}>{item}</Button>)}
      </div>
      <div id="store-products-panel" role="tabpanel" aria-labelledby={`store-tab-${storeCategories.indexOf(category)}`} className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => <article key={product.id} className="group flex min-w-0 flex-col">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-background">
            <div className="absolute left-3 top-3 z-10"><OfferBadge product={product} /></div>
            <img src={product.image} alt={product.title} loading="lazy" width={512} height={1024} className="h-full w-full object-contain transition-transform duration-500 motion-safe:group-hover:scale-[1.04]" />
          </div>
          <div className="flex flex-1 flex-col pt-5">
            <h3 className="font-display text-2xl font-semibold leading-tight text-forest">{product.title}</h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{product.description}</p>
            {product.originalPrice && <p className="mt-3 text-xs font-medium text-primary">Oferta por tiempo limitado</p>}
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
              <div className="text-lg"><ProductPrice product={product} /></div>
              <Button onClick={() => onAdd(product.id, product.title)} className="text-xs"><ShoppingBag />Añadir al Carrito</Button>
            </div>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}