import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth, initials } from "@/lib/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Menu, Minus, Plus, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";
import { useCart } from "@/lib/cart";
import heroImage from "@/assets/collection-hero.jpg";
import vaultImage from "@/assets/membership-vault.jpg";

const navItems = ["Ediciones Limitadas", "Colección", "Exclusivos", "Membresía"];
const categories = ["Todos", "Vasos térmicos", "Pines", "Kit reutilizable", "Tazas", "Bolsas de café", "Exclusivo"];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Colecciones exclusivas — Starbucks Perú" },
    { name: "description", content: "Descubre ediciones limitadas, café peruano y accesorios creados para elevar tu experiencia diaria." },
    { property: "og:title", content: "Colecciones exclusivas — Starbucks Perú" },
    { property: "og:description", content: "Una selección extraordinaria de café y accesorios para quienes hacen del café una experiencia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Storefront,
});

function Logo() {
  return <a href="#inicio" aria-label="Starbucks Perú, inicio" className="shrink-0 font-display text-2xl font-semibold text-forest">Starbucks<sup className="ml-0.5 text-[8px]">®</sup></a>;
}

function CoffeeCupIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 8h12v6.5A4.5 4.5 0 0 1 12.5 19h-3A4.5 4.5 0 0 1 5 14.5V8Z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 5c0-1 1-1 1-2M12 5c0-1 1-1 1-2"/></svg>;
}

function WhatsAppIcon() {
  return <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.02 3.2A12.74 12.74 0 0 0 5.05 22.4L3.2 28.8l6.56-1.72A12.79 12.79 0 1 0 16.02 3.2Zm0 23.42c-2.06 0-4.08-.56-5.83-1.62l-.42-.25-3.9 1.02 1.04-3.8-.27-.44a10.61 10.61 0 1 1 9.38 5.09Zm5.82-7.95c-.32-.16-1.89-.93-2.18-1.04-.3-.11-.51-.16-.72.16-.21.32-.83 1.04-1.02 1.25-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.56-1.58a9.57 9.57 0 0 1-1.77-2.2c-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.73-.99-2.37-.26-.63-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.31 3.3c.16.21 2.25 3.44 5.46 4.82.76.33 1.36.53 1.82.67.77.24 1.46.21 2.01.13.61-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z"/></svg>;
}

function Storefront() {
  const [collection, setCollection] = useState("Green");
  const [category, setCategory] = useState("Todos");
  const { ids: cart, items: cartItems, subtotal, add, removeOne, removeAll, clear } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function requireLogin() {
    if (user) return true;
    toast.error("Debes iniciar sesión para realizar una compra");
    setCartOpen(false);
    navigate({ to: "/auth" });
    return false;
  }
  const filtered = useMemo(() => products.filter((p) => p.collection === collection && (category === "Todos" || p.category === category || category === "Exclusivo" && p.exclusive)), [collection, category]);
  const cartItems = useMemo(() => products.map((product) => ({ ...product, quantity: cart.filter((id) => id === product.id).length })).filter((product) => product.quantity > 0), [cart]);
  const subtotal = cartItems.reduce((sum, product) => sum + product.price * product.quantity, 0);

  useEffect(() => {
    if (!cartOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setCartOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", closeOnEscape); };
  }, [cartOpen]);

  function addToCart(id: number, title: string) {
    if (!requireLogin()) return;
    setCart((items) => [...items, id]);
    setNotice(`${title} se añadió a tu bolsa`);
    window.setTimeout(() => setNotice(""), 2400);
  }

  function removeOne(id: number) {
    const index = cart.lastIndexOf(id);
    if (index < 0) return;
    setCart((items) => items.filter((_, itemIndex) => itemIndex !== index));
  }

  return <main id="inicio" className="min-h-screen bg-background text-foreground">
    <div className="bg-forest px-4 py-2.5 text-center text-xs font-semibold text-primary-foreground sm:text-sm">Ediciones limitadas · Envío gratis en compras desde S/ 180 <a href="#coleccion" className="ml-2 underline underline-offset-4">Descubrir ahora</a></div>
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto grid h-18 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:grid-cols-[auto_1fr_auto] lg:px-8">
        <Logo />
        <nav className="hidden items-center justify-center gap-7 lg:flex">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="text-sm font-semibold text-foreground/80 transition-colors hover:text-primary">{item}</a>)}</nav>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Buscar" onClick={() => setSearchOpen(!searchOpen)}><Search /></Button>
          {user ? <DropdownMenu><DropdownMenuTrigger asChild><button aria-label="Mi cuenta" className="mx-1 grid size-9 place-items-center rounded-full bg-forest text-xs font-bold text-primary-foreground ring-2 ring-gold/60">{initials(user.name)}</button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56"><DropdownMenuLabel><p className="truncate">{user.name}</p><p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p></DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem>Mi Perfil</DropdownMenuItem><DropdownMenuItem onClick={() => { logout(); setCart([]); toast("Sesión cerrada"); }}>Cerrar Sesión</DropdownMenuItem></DropdownMenuContent></DropdownMenu> : <Button variant="ghost" size="icon" aria-label="Iniciar sesión" asChild><Link to="/auth"><UserRound /></Link></Button>}
          <Button variant="ghost" size="icon" aria-label={`Carrito con ${cart.length} productos`} className="relative" onClick={() => setCartOpen(true)}><CoffeeCupIcon />{cart.length > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">{cart.length}</span>}</Button>
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
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Curaduría de temporada</p><h2 className="mt-3 font-display text-4xl font-medium text-forest sm:text-5xl">Encuentra tu próximo favorito.</h2></div><div className="grid grid-cols-2 rounded-full bg-secondary p-1" role="tablist" aria-label="Colecciones">{["Green", "Perú"].map((tab) => <button key={tab} role="tab" aria-selected={collection === tab} onClick={() => {setCollection(tab);setCategory("Todos")}} className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${collection === tab ? "bg-primary text-primary-foreground shadow-sm" : "text-secondary-foreground hover:bg-background/70"}`}>Colección {tab}</button>)}</div></div>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-3">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all ${category === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50"}`}>{item}</button>)}</div>
      <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-6">{filtered.length ? filtered.map((product) => <article key={product.id} className="group min-w-0"><div className="relative aspect-square overflow-hidden rounded-xl bg-card"><img src={product.image} alt={product.title} loading="lazy" width={600} height={600} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"/>{product.exclusive && <span className="absolute left-3 top-3 rounded-full bg-forest px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">Exclusivo</span>}</div><div className="pt-4"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">{product.category}</p><h3 className="mt-1 truncate font-display text-lg font-semibold text-forest sm:text-xl">{product.title}</h3><div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2"><span className="font-bold">S/ {product.price}.00</span><Button size="sm" onClick={() => addToCart(product.id, product.title)}><ShoppingBag className="sm:mr-1"/><span className="hidden sm:inline">Agregar</span></Button></div></div></article>) : <div className="col-span-full py-16 text-center text-muted-foreground">No hay productos en esta categoría. Prueba otra selección.</div>}</div>
    </div></section>

    <section id="ubicacion" className="bg-mint px-5 py-16 sm:py-20 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Visítanos</p><h2 className="mt-3 font-display text-4xl font-medium text-forest sm:text-5xl">Plaza San Miguel</h2><p className="mt-3 font-semibold text-forest">Av. de la Marina 21</p><div className="mt-8 aspect-[4/3] overflow-hidden rounded-xl border border-border bg-card sm:aspect-[16/7]"><iframe title="Mapa de Starbucks en Plaza San Miguel" src="https://www.google.com/maps?q=Av.%20de%20la%20Marina%2021%2C%20Plaza%20San%20Miguel%2C%20Lima%2C%20Per%C3%BA&output=embed" className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></div></section>
    <footer className="bg-forest px-5 py-14 text-primary-foreground lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_0.8fr_1fr]"><div><a href="#inicio" aria-label="Starbucks Perú, inicio" className="font-display text-2xl font-semibold text-primary-foreground">Starbucks<sup className="ml-0.5 text-[8px]">®</sup></a><p className="mt-5 max-w-sm text-sm leading-6 text-primary-foreground/65">Desde Lima, celebramos la calidad del café peruano y las pequeñas experiencias que hacen grande cada día.</p></div><div><h3 className="text-sm font-bold">Explora</h3><div className="mt-4 grid gap-2.5">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="w-fit text-sm text-primary-foreground/65 hover:text-primary-foreground">{item}</a>)}</div></div><div><h3 className="text-sm font-bold">Visítanos</h3><div className="mt-4 space-y-2 text-sm leading-6 text-primary-foreground/65"><p>Dirección: Av. de la Marina 21 - Plaza San Miguel, Lima, Perú</p><p>Horario: Lunes a sábado · 8:00 a.m. — 8:00 p.m.</p></div></div></div><div className="mx-auto mt-12 max-w-7xl border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/50">© 2026 Starbucks Perú. Prototipo conceptual no afiliado.</div></footer>
    <a href="https://wa.me/51999999999" target="_blank" rel="noreferrer" aria-label="Hablar por WhatsApp" className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-xl transition-transform hover:-translate-y-1"><span className="size-7"><WhatsAppIcon /></span></a>
    {notice && <div role="status" className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-primary-foreground shadow-xl">{notice}</div>}
    {cartOpen && <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby="cart-title"><button type="button" aria-label="Cerrar carrito" onClick={() => setCartOpen(false)} className="absolute inset-0 h-full w-full cursor-default bg-overlay backdrop-blur-sm"/><aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cart text-cart-foreground shadow-2xl">
      <div className="flex items-start justify-between border-b border-cart-foreground/15 px-6 py-7"><div><p id="cart-title" className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Tu carrito</p><p className="mt-1 font-display text-2xl">{cart.length} {cart.length === 1 ? "producto" : "productos"}</p></div><Button variant="ghost" size="icon" aria-label="Cerrar carrito" className="text-cart-foreground hover:bg-cart-foreground/10 hover:text-cart-foreground" onClick={() => setCartOpen(false)}><X /></Button></div>
      <div className="flex-1 overflow-y-auto px-6 py-5">{cartItems.length ? <div className="grid gap-4">{cartItems.map((product) => <article key={product.id} className="grid grid-cols-[84px_minmax(0,1fr)_auto] gap-4 border-b border-cart-foreground/15 pb-5"><img src={product.image} alt="" className="aspect-square w-full rounded-md object-cover"/><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold">{product.category}</p><h3 className="mt-1 font-display text-lg leading-tight">{product.title}</h3><div className="mt-4 flex w-fit items-center rounded-full border border-cart-foreground/25"><Button variant="ghost" size="icon" aria-label={`Quitar una unidad de ${product.title}`} className="size-8 text-cart-foreground hover:bg-cart-foreground/10 hover:text-cart-foreground" onClick={() => removeOne(product.id)}><Minus /></Button><span className="w-7 text-center text-sm font-semibold">{product.quantity}</span><Button variant="ghost" size="icon" aria-label={`Añadir una unidad de ${product.title}`} className="size-8 text-cart-foreground hover:bg-cart-foreground/10 hover:text-cart-foreground" onClick={() => addToCart(product.id, product.title)}><Plus /></Button></div></div><div className="flex flex-col items-end justify-between"><Button variant="ghost" size="icon" aria-label={`Eliminar ${product.title}`} className="size-8 text-cart-foreground/60 hover:bg-cart-foreground/10 hover:text-cart-foreground" onClick={() => setCart((items) => items.filter((id) => id !== product.id))}><X /></Button><p className="whitespace-nowrap text-sm font-bold">S/ {product.price * product.quantity}.00</p></div></article>)}</div> : <div className="grid h-full place-items-center text-center"><div><p className="font-display text-2xl">Tu carrito está vacío</p><Button variant="outline" className="mt-5 border-cart-foreground/50 text-cart-foreground hover:bg-cart-foreground hover:text-cart" onClick={() => setCartOpen(false)}>Seguir comprando</Button></div></div>}</div>
      <div className="border-t border-cart-foreground/15 bg-cart-summary px-6 py-6"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.16em]">Subtotal</span><span className="font-display text-2xl">S/ {subtotal}.00</span></div><p className="mt-2 text-xs text-cart-foreground/60">Envío y descuentos se calculan en el checkout</p><Button size="lg" className="mt-5 w-full bg-gold text-cart hover:bg-gold/90" disabled={cart.length === 0} onClick={() => { if (requireLogin()) toast.success("¡Pedido listo! Continuaremos con el pago."); }}>Ir al checkout <ArrowRight /></Button></div>
    </aside></div>}
  </main>;
}