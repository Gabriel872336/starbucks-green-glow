import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Menu, Minus, Plus, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/collection-hero.jpg";
import vaultImage from "@/assets/membership-vault.jpg";
import mapImage from "@/assets/plaza-san-miguel-map.jpg";
import tumblerImage from "@/assets/products/tumbler-green.jpg";
import mugImage from "@/assets/products/mug-botanical.jpg";
import kitImage from "@/assets/products/kit-gold.jpg";
import coffeeImage from "@/assets/products/coffee-reserve.jpg";
import pinImage from "@/assets/products/pin-botanical.jpg";
import travelImage from "@/assets/products/travel-cup.jpg";

const navItems = ["Ediciones Limitadas", "Colección", "Exclusivos", "Membresía"];
const categories = ["Todos", "Vasos térmicos", "Pines", "Kit reutilizable", "Tazas", "Bolsas de café", "Exclusivo"];
const products = [
  { id: 1, title: "Tumbler Verde Reserva", price: 129, category: "Vasos térmicos", collection: "Green", image: tumblerImage, exclusive: true },
  { id: 2, title: "Taza Botánica Andes", price: 89, category: "Tazas", collection: "Perú", image: mugImage, exclusive: false },
  { id: 3, title: "Kit Experiencia Dorada", price: 249, category: "Kit reutilizable", collection: "Green", image: kitImage, exclusive: true },
  { id: 4, title: "Café Reserva del Valle", price: 72, category: "Bolsas de café", collection: "Perú", image: coffeeImage, exclusive: true },
  { id: 5, title: "Pin Botánico Colección", price: 49, category: "Pines", collection: "Perú", image: pinImage, exclusive: false },
  { id: 6, title: "Vaso Reutilizable Verde", price: 79, category: "Vasos térmicos", collection: "Green", image: travelImage, exclusive: false },
];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Colecciones exclusivas — Starbucks Perú" },
    { name: "description", content: "Descubre ediciones limitadas, café peruano y accesorios creados para elevar tu experiencia diaria." },
    { property: "og:title", content: "Colecciones exclusivas — Starbucks Perú" },
    { property: "og:description", content: "Una selección extraordinaria de café y accesorios para crear una experiencia única." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Storefront,
});

function Logo() {
  return <Link to="/" aria-label="Starbucks Perú, inicio" className="flex shrink-0 items-center gap-2.5"><span className="grid size-10 place-items-center rounded-full bg-primary font-display text-lg font-semibold text-primary-foreground ring-2 ring-primary/15 ring-offset-2">S</span><span className="hidden font-display text-lg font-semibold text-forest sm:block">Starbucks<sup className="ml-0.5 text-[8px]">®</sup></span></Link>;
}

function CoffeeCupIcon() {
  return <svg viewBox="0 0 28 28" aria-hidden="true" className="size-6 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 10.5h13v5.2a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6v-5.2Z"/><path d="M19.5 12h1.7a3 3 0 0 1 0 6h-2.8M5 23h16M10 7.5c-1.4-1.5 1.4-2.3 0-3.8M15 7.5c-1.4-1.5 1.4-2.3 0-3.8"/></svg>;
}

function WhatsAppIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true" className="size-7 fill-current"><path d="M16.04 4A11.8 11.8 0 0 0 5.85 21.76L4 28l6.42-1.68A11.91 11.91 0 1 0 16.04 4Zm0 21.82c-1.85 0-3.65-.5-5.22-1.45l-.37-.22-3.8 1 1.02-3.7-.24-.38a9.83 9.83 0 1 1 8.61 4.75Zm5.4-7.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.76.96-.94 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47a8.9 8.9 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.66-1.6-.91-2.18-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.24-.7.24-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg>;
}

function Storefront() {
  const [collection, setCollection] = useState("Green");
  const [category, setCategory] = useState("Todos");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => products.filter((product) => product.collection === collection && (category === "Todos" || product.category === category || category === "Exclusivo" && product.exclusive)), [collection, category]);
  const cartItems = products.filter((product) => cart[product.id]);
  const itemCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const subtotal = cartItems.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session?.user)));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!cartOpen) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setCartOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [cartOpen]);

  function addToCart(id: number, title: string) {
    setCart((items) => ({ ...items, [id]: (items[id] ?? 0) + 1 }));
    setNotice(`${title} se añadió a tu carrito`);
    window.setTimeout(() => setNotice(""), 2400);
  }
  function changeQuantity(id: number, change: number) {
    setCart((items) => { const next = Math.max(0, (items[id] ?? 0) + change); const updated = { ...items }; if (next === 0) delete updated[id]; else updated[id] = next; return updated; });
  }

  return <main id="inicio" className="min-h-screen bg-background text-foreground">
    <div className="bg-forest px-4 py-2.5 text-center text-xs font-semibold text-primary-foreground sm:text-sm">Ediciones limitadas · Envío gratis en compras desde S/ 180 <a href="#coleccion" className="ml-2 underline underline-offset-4">Descubrir ahora</a></div>
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto grid h-18 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:grid-cols-[auto_1fr_auto] lg:px-8">
        <Logo />
        <nav className="hidden items-center justify-center gap-7 lg:flex">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="text-sm font-semibold text-foreground/80 transition-colors hover:text-primary">{item}</a>)}</nav>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Buscar" onClick={() => setSearchOpen(!searchOpen)}><Search /></Button>
          <Button variant="ghost" size="icon" aria-label={signedIn ? "Mi cuenta" : "Iniciar sesión"} asChild><Link to="/login"><UserRound /></Link></Button>
          <Button variant="ghost" size="icon" aria-label={`Abrir carrito con ${itemCount} productos`} className="relative" onClick={() => setCartOpen(true)}><CoffeeCupIcon />{itemCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">{itemCount}</span>}</Button>
          <Button variant="ghost" size="icon" aria-label="Abrir menú" className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {searchOpen && <div className="border-t border-border bg-background px-5 py-3"><label className="mx-auto flex max-w-2xl items-center gap-3 rounded-full border border-input bg-card px-4 py-2.5"><Search className="size-4 text-muted-foreground"/><input autoFocus className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Buscar tazas, café y accesorios…" /></label></div>}
      {menuOpen && <nav className="border-t border-border bg-background px-5 py-4 lg:hidden">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMenuOpen(false)} className="block border-b border-border/60 py-3 text-sm font-semibold">{item}</a>)}</nav>}
    </header>

    <section id="ediciones-limitadas" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-12 pt-10 sm:pt-16 lg:px-8 lg:pb-20">
      <div className="reveal-up mb-10 max-w-4xl"><p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-primary">Colección Reserva · 2026</p><h1 className="text-balance font-display text-5xl font-medium leading-[1.02] text-forest sm:text-6xl lg:text-8xl">Haz de cada café<br/><em className="font-medium text-primary">una experiencia extraordinaria.</em></h1><p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Objetos únicos, café excepcional y detalles que convierten tu momento favorito en una experiencia que merece quedarse.</p><div className="mt-8 flex flex-wrap gap-3"><Button size="lg" asChild><a href="#coleccion">Explorar colección <ArrowRight /></a></Button><Button size="lg" variant="outline" asChild><a href="#membresía">Ver membresía</a></Button></div></div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary sm:aspect-[16/9]"><img src={heroImage} alt="Colección premium de café, tazas y accesorios en verde y dorado" width={1920} height={1080} className="h-full w-full object-cover"/><div className="absolute bottom-5 left-5 rounded-full bg-background/90 px-4 py-2 text-xs font-bold text-forest backdrop-blur sm:bottom-7 sm:left-7">Solo por tiempo limitado</div></div>
    </section>

    <section id="membresía" className="scroll-mt-24 bg-forest text-primary-foreground"><div className="mx-auto grid max-w-7xl lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16 lg:py-24"><p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">The Reserve Circle</p><h2 className="mt-5 text-balance font-display text-4xl font-medium leading-tight sm:text-5xl">La puerta a lo que pocos pueden descubrir.</h2><p className="mt-6 max-w-xl leading-7 text-primary-foreground/75">Únete a una comunidad que vive el café de otra manera. Recibe lanzamientos raros, degustaciones exclusivas con envío gratis y acceso prioritario a experiencias VIP.</p><ul className="my-8 grid gap-3 text-sm">{["Acceso anticipado a piezas de colección", "Degustación exclusiva cada temporada", "Envíos y beneficios VIP incluidos"].map((benefit) => <li key={benefit} className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full bg-gold text-forest"><Check className="size-3.5" /></span>{benefit}</li>)}</ul><Button size="lg" className="w-fit bg-gold text-forest hover:bg-gold/90">Comprar membresía</Button></div>
      <div className="min-h-[560px] lg:min-h-[700px]"><img src={vaultImage} alt="Bóveda de productos exclusivos en edición dorada" loading="lazy" width={1200} height={1500} className="h-full w-full object-cover"/></div>
    </div></section>

    <section id="coleccion" className="scroll-mt-24 px-5 py-16 sm:py-24 lg:px-8"><div id="exclusivos" className="mx-auto max-w-7xl scroll-mt-24">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Curaduría de temporada</p><h2 className="mt-3 font-display text-4xl font-medium text-forest sm:text-5xl">Encuentra tu próximo favorito.</h2></div><div className="grid grid-cols-2 rounded-full bg-secondary p-1" role="tablist" aria-label="Colecciones">{["Green", "Perú"].map((tab) => <Button key={tab} role="tab" aria-selected={collection === tab} onClick={() => {setCollection(tab);setCategory("Todos")}} variant={collection === tab ? "default" : "ghost"} className="rounded-full px-5">Colección {tab}</Button>)}</div></div>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-3">{categories.map((item) => <Button key={item} onClick={() => setCategory(item)} variant={category === item ? "default" : "outline"} size="sm" className="shrink-0 rounded-full">{item}</Button>)}</div>
      <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-6">{filtered.length ? filtered.map((product) => <article key={product.id} className="group min-w-0"><div className="relative aspect-square overflow-hidden rounded-xl bg-card"><img src={product.image} alt={product.title} loading="lazy" width={600} height={600} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"/>{product.exclusive && <span className="absolute left-3 top-3 rounded-full bg-forest px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">Exclusivo</span>}</div><div className="pt-4"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">{product.category}</p><h3 className="mt-1 truncate font-display text-lg font-semibold text-forest sm:text-xl">{product.title}</h3><div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2"><span className="font-bold">S/ {product.price}.00</span><Button size="sm" onClick={() => addToCart(product.id, product.title)}><ShoppingBag className="sm:mr-1"/><span className="hidden sm:inline">Agregar</span></Button></div></div></article>) : <div className="col-span-full py-16 text-center text-muted-foreground">No hay productos en esta categoría. Prueba otra selección.</div>}</div>
    </div></section>

    <section id="referidos" className="bg-mint px-5 py-14 text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Comparte la experiencia</p><h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-medium text-forest sm:text-4xl">Invita a alguien. Su primer café especial corre por nuestra cuenta.</h2><Button className="mt-6">Conocer referidos</Button></section>
    <footer className="bg-forest px-5 py-14 text-primary-foreground lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.1fr_0.7fr_1.2fr]"><div><Logo/><p className="mt-5 max-w-sm text-sm leading-6 text-primary-foreground/65">Desde Lima, celebramos la calidad del café peruano y las pequeñas experiencias que hacen grande cada día.</p></div><div><h3 className="text-sm font-bold">Explora</h3><div className="mt-4 grid gap-2.5">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="w-fit text-sm text-primary-foreground/65 hover:text-primary-foreground">{item}</a>)}</div></div><div><h3 className="text-sm font-bold">Visítanos</h3><div className="mt-4 space-y-2 text-sm leading-6 text-primary-foreground/70"><p>Visítanos en Av. de la Marina 21 - Plaza San Miguel</p><p>Horario: Lunes a sábado · 8:00 a.m. — 8:00 p.m.</p></div><div className="mt-5 aspect-[2/1] overflow-hidden rounded-lg border border-primary-foreground/15"><img src={mapImage} alt="Mapa de ubicación de Plaza San Miguel" loading="lazy" width={1200} height={608} className="h-full w-full object-cover"/></div></div></div><div className="mx-auto mt-12 max-w-7xl border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/50">© 2026 Starbucks Perú. Prototipo conceptual no afiliado.</div></footer>

    <a href="https://wa.me/51999999999" target="_blank" rel="noreferrer" aria-label="Hablar por WhatsApp" className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:-translate-y-1"><WhatsAppIcon /></a>
    {notice && <div role="status" className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-primary-foreground shadow-xl">{notice}</div>}

    {cartOpen && <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Tu carrito"><button aria-label="Cerrar carrito" className="absolute inset-0 bg-forest/45 backdrop-blur-[2px]" onClick={() => setCartOpen(false)} /><aside className="cart-drawer absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-background shadow-2xl"><header className="flex items-start justify-between border-b border-border px-6 py-7 sm:px-8"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Tu carrito</p><h2 className="mt-2 font-display text-3xl font-medium text-forest">{itemCount} {itemCount === 1 ? "producto" : "productos"}</h2></div><Button variant="ghost" size="icon" aria-label="Cerrar" onClick={() => setCartOpen(false)}><X /></Button></header><div className="flex-1 overflow-y-auto px-6 py-3 sm:px-8">{cartItems.length ? cartItems.map((product) => <article key={product.id} className="grid grid-cols-[92px_minmax(0,1fr)] gap-4 border-b border-border py-6"><img src={product.image} alt={product.title} width={180} height={180} className="aspect-square h-full w-full rounded-lg object-cover"/><div className="min-w-0"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Starbucks · {product.category}</p><h3 className="mt-1 font-display text-lg font-semibold text-forest">{product.title}</h3></div><Button variant="ghost" size="icon" aria-label={`Eliminar ${product.title}`} onClick={() => setCart((items) => { const updated = { ...items }; delete updated[product.id]; return updated; })} className="-mr-2 -mt-2 size-8"><X className="size-4"/></Button></div><div className="mt-5 flex items-center justify-between gap-3"><div className="flex h-9 items-center rounded-full border border-border bg-card"><Button variant="ghost" size="icon" aria-label="Disminuir cantidad" onClick={() => changeQuantity(product.id, -1)} className="size-8 rounded-full"><Minus className="size-3"/></Button><span className="w-7 text-center text-sm font-bold">{cart[product.id]}</span><Button variant="ghost" size="icon" aria-label="Aumentar cantidad" onClick={() => changeQuantity(product.id, 1)} className="size-8 rounded-full"><Plus className="size-3"/></Button></div><span className="font-bold">S/ {product.price * (cart[product.id] ?? 0)}.00</span></div></div></article>) : <div className="grid h-full place-items-center py-20 text-center"><div><CoffeeCupIcon/><h3 className="mt-5 font-display text-2xl text-forest">Tu carrito está vacío</h3><p className="mt-2 text-sm text-muted-foreground">Añade una pieza especial de la colección.</p><Button className="mt-6" onClick={() => setCartOpen(false)}>Seguir explorando</Button></div></div>}</div><footer className="border-t border-border bg-card px-6 py-6 sm:px-8"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.16em]">Subtotal</span><span className="font-display text-2xl font-semibold text-forest">S/ {subtotal}.00</span></div><p className="mt-2 text-xs text-muted-foreground">Envío y descuentos se calculan en el checkout</p><Button size="lg" className="mt-5 w-full" disabled={!itemCount}>Ir al checkout <ArrowRight /></Button></footer></aside></div>}
  </main>;
}