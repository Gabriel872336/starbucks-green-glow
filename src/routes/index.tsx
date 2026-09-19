import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Coffee, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/collection-hero.jpg";
import vaultImage from "@/assets/membership-vault.jpg";
import tumblerImage from "@/assets/products/tumbler-green.jpg";
import mugImage from "@/assets/products/mug-botanical.jpg";
import kitImage from "@/assets/products/kit-gold.jpg";
import coffeeImage from "@/assets/products/coffee-reserve.jpg";
import pinImage from "@/assets/products/pin-botanical.jpg";
import travelImage from "@/assets/products/travel-cup.jpg";

const navItems = ["Ediciones Limitadas", "Colección", "Exclusivos", "Membresía", "Referidos"];
const categories = ["Todos", "Vasos térmicos", "Pines", "Kit reutilizable", "Tazas", "Bolsas de café", "Exclusivo"];
const products = [
  { id: 1, title: "Tumbler Verde Reserva", price: 129, category: "Vasos térmicos", collection: "Green", image: tumblerImage, exclusive: true },
  { id: 2, title: "Taza Botánica Andes", price: 89, category: "Tazas", collection: "Perú", image: mugImage, exclusive: false },
  { id: 3, title: "Kit Ritual Dorado", price: 249, category: "Kit reutilizable", collection: "Green", image: kitImage, exclusive: true },
  { id: 4, title: "Café Reserva del Valle", price: 72, category: "Bolsas de café", collection: "Perú", image: coffeeImage, exclusive: true },
  { id: 5, title: "Pin Botánico Colección", price: 49, category: "Pines", collection: "Perú", image: pinImage, exclusive: false },
  { id: 6, title: "Vaso Reutilizable Verde", price: 79, category: "Vasos térmicos", collection: "Green", image: travelImage, exclusive: false },
];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Colecciones exclusivas — Starbucks Perú" },
    { name: "description", content: "Descubre ediciones limitadas, café peruano y accesorios creados para elevar tu ritual diario." },
    { property: "og:title", content: "Colecciones exclusivas — Starbucks Perú" },
    { property: "og:description", content: "Una selección extraordinaria de café y accesorios para quienes hacen del café un ritual." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Storefront,
});

function Logo() {
  return <a href="#inicio" aria-label="Starbucks Perú, inicio" className="flex shrink-0 items-center gap-2.5"><span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground ring-2 ring-primary/15 ring-offset-2"><Coffee className="size-5" /></span><span className="hidden font-display text-lg font-semibold text-forest sm:block">Starbucks<sup className="ml-0.5 text-[8px]">®</sup></span></a>;
}

function Storefront() {
  const [collection, setCollection] = useState("Green");
  const [category, setCategory] = useState("Todos");
  const [cart, setCart] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => products.filter((p) => p.collection === collection && (category === "Todos" || p.category === category || category === "Exclusivo" && p.exclusive)), [collection, category]);

  function addToCart(id: number, title: string) {
    setCart((items) => [...items, id]);
    setNotice(`${title} se añadió a tu bolsa`);
    window.setTimeout(() => setNotice(""), 2400);
  }

  return <main id="inicio" className="min-h-screen bg-background text-foreground">
    <div className="bg-forest px-4 py-2.5 text-center text-xs font-semibold text-primary-foreground sm:text-sm">Ediciones limitadas · Envío gratis en compras desde S/ 180 <a href="#coleccion" className="ml-2 underline underline-offset-4">Descubrir ahora</a></div>
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto grid h-18 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:grid-cols-[auto_1fr_auto] lg:px-8">
        <Logo />
        <nav className="hidden items-center justify-center gap-7 lg:flex">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="text-sm font-semibold text-foreground/80 transition-colors hover:text-primary">{item}</a>)}</nav>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Buscar" onClick={() => setSearchOpen(!searchOpen)}><Search /></Button>
          <Button variant="ghost" size="icon" aria-label="Mi cuenta"><UserRound /></Button>
          <Button variant="ghost" size="icon" aria-label={`Bolsa de compras con ${cart.length} productos`} className="relative"><Coffee />{cart.length > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">{cart.length}</span>}</Button>
          <Button variant="ghost" size="icon" aria-label="Abrir menú" className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {searchOpen && <div className="border-t border-border bg-background px-5 py-3"><label className="mx-auto flex max-w-2xl items-center gap-3 rounded-full border border-input bg-card px-4 py-2.5"><Search className="size-4 text-muted-foreground"/><input autoFocus className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Buscar tazas, café y accesorios…" /></label></div>}
      {menuOpen && <nav className="border-t border-border bg-background px-5 py-4 lg:hidden">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMenuOpen(false)} className="block border-b border-border/60 py-3 text-sm font-semibold">{item}</a>)}</nav>}
    </header>

    <section id="ediciones-limitadas" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-12 pt-10 sm:pt-16 lg:px-8 lg:pb-20">
      <div className="reveal-up mb-10 max-w-4xl"><p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-primary">Colección Reserva · 2026</p><h1 className="text-balance font-display text-5xl font-medium leading-[1.02] text-forest sm:text-6xl lg:text-8xl">Haz de cada café<br/><em className="font-medium text-primary">un ritual extraordinario.</em></h1><p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Objetos únicos, café excepcional y detalles que convierten tu momento favorito en una experiencia que merece quedarse.</p><div className="mt-8 flex flex-wrap gap-3"><Button size="lg" asChild><a href="#coleccion">Explorar colección <ArrowRight /></a></Button><Button size="lg" variant="outline" asChild><a href="#membresía">Ver membresía</a></Button></div></div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary sm:aspect-[16/9]"><img src={heroImage} alt="Colección premium de café, tazas y accesorios en verde y dorado" width={1920} height={1080} className="h-full w-full object-cover"/><div className="absolute bottom-5 left-5 rounded-full bg-background/90 px-4 py-2 text-xs font-bold text-forest backdrop-blur sm:bottom-7 sm:left-7">Solo por tiempo limitado</div></div>
    </section>

    <section id="membresía" className="scroll-mt-24 bg-forest text-primary-foreground"><div className="mx-auto grid max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16 lg:py-24"><p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">The Reserve Circle</p><h2 className="mt-5 text-balance font-display text-4xl font-medium leading-tight sm:text-5xl">La puerta a lo que pocos pueden descubrir.</h2><p className="mt-6 max-w-xl leading-7 text-primary-foreground/75">Únete a una comunidad que vive el café de otra manera. Recibe lanzamientos raros, degustaciones exclusivas con envío gratis y acceso prioritario a experiencias VIP.</p><ul className="my-8 grid gap-3 text-sm">{["Acceso anticipado a piezas de colección", "Degustación exclusiva cada temporada", "Envíos y beneficios VIP incluidos"].map((benefit) => <li key={benefit} className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full bg-gold text-forest"><Check className="size-3.5" /></span>{benefit}</li>)}</ul><Button size="lg" className="w-fit bg-gold text-forest hover:bg-gold/90">Comprar membresía</Button></div>
      <div className="min-h-[560px] lg:min-h-[700px]"><img src={vaultImage} alt="Bóveda de productos exclusivos en edición dorada" loading="lazy" width={1200} height={1500} className="h-full w-full object-cover"/></div>
    </div></section>

    <section id="coleccion" className="scroll-mt-24 px-5 py-16 sm:py-24 lg:px-8"><div id="exclusivos" className="mx-auto max-w-7xl scroll-mt-24">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Curaduría de temporada</p><h2 className="mt-3 font-display text-4xl font-medium text-forest sm:text-5xl">Encuentra tu próximo favorito.</h2></div><div className="grid grid-cols-2 rounded-full bg-secondary p-1" role="tablist" aria-label="Colecciones">{["Green", "Perú"].map((tab) => <button key={tab} role="tab" aria-selected={collection === tab} onClick={() => {setCollection(tab);setCategory("Todos")}} className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${collection === tab ? "bg-primary text-primary-foreground shadow-sm" : "text-secondary-foreground hover:bg-background/70"}`}>Colección {tab}</button>)}</div></div>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-3">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all ${category === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50"}`}>{item}</button>)}</div>
      <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-6">{filtered.length ? filtered.map((product) => <article key={product.id} className="group min-w-0"><div className="relative aspect-square overflow-hidden rounded-xl bg-card"><img src={product.image} alt={product.title} loading="lazy" width={600} height={600} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"/>{product.exclusive && <span className="absolute left-3 top-3 rounded-full bg-forest px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">Exclusivo</span>}</div><div className="pt-4"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">{product.category}</p><h3 className="mt-1 truncate font-display text-lg font-semibold text-forest sm:text-xl">{product.title}</h3><div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2"><span className="font-bold">S/ {product.price}.00</span><Button size="sm" onClick={() => addToCart(product.id, product.title)}><ShoppingBag className="sm:mr-1"/><span className="hidden sm:inline">Agregar</span></Button></div></div></article>) : <div className="col-span-full py-16 text-center text-muted-foreground">No hay productos en esta categoría. Prueba otra selección.</div>}</div>
    </div></section>

    <section id="referidos" className="bg-mint px-5 py-14 text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Comparte el ritual</p><h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-medium text-forest sm:text-4xl">Invita a alguien. Su primer café especial corre por nuestra cuenta.</h2><Button className="mt-6">Conocer referidos</Button></section>
    <footer className="bg-forest px-5 py-14 text-primary-foreground lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_0.8fr_1fr]"><div><Logo/><p className="mt-5 max-w-sm text-sm leading-6 text-primary-foreground/65">Desde Lima, celebramos la calidad del café peruano y los pequeños rituales que hacen grande cada día.</p></div><div><h3 className="text-sm font-bold">Explora</h3><div className="mt-4 grid gap-2.5">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="w-fit text-sm text-primary-foreground/65 hover:text-primary-foreground">{item}</a>)}</div></div><div><h3 className="text-sm font-bold">Visítanos</h3><div className="mt-4 space-y-2 text-sm leading-6 text-primary-foreground/65"><p>Dirección: Lima, Perú</p><p>Atención al cliente: (01) 505-0050</p><p>Lunes a sábado · 8:00 a.m. — 8:00 p.m.</p></div></div></div><div className="mx-auto mt-12 max-w-7xl border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/50">© 2026 Starbucks Perú. Prototipo conceptual no afiliado.</div></footer>
    <a href="https://wa.me/51999999999" target="_blank" rel="noreferrer" aria-label="Hablar por WhatsApp" className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:-translate-y-1"><span className="text-lg font-bold">WA</span></a>
    {notice && <div role="status" className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-primary-foreground shadow-xl">{notice}</div>}
  </main>;
}