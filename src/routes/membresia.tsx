import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/membresia")({
  head: () => ({
    meta: [
      { title: "Membresías Exclusivas — Starbucks Perú" },
      { name: "description", content: "Elige entre Green, Gold y Reserve y disfruta descuentos, regalos y experiencias VIP." },
      { property: "og:title", content: "Membresías Exclusivas — Starbucks Perú" },
      { property: "og:description", content: "Tres niveles de beneficios para vivir el café como una experiencia VIP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MembershipPage,
});

const tiers = [
  { id: 101, name: "Green", price: 49, popular: false, benefits: ["10% de descuento en bebidas preparadas.", "Vaso reutilizable de edición estándar de regalo.", "Acceso prioritario a lanzamientos de temporada."] },
  { id: 102, name: "Gold", price: 89, popular: true, benefits: ["Todos los beneficios de la Membresía Green.", "15% de descuento en todos los productos de la tienda.", "Envío mensual gratuito de muestras de café de especialidad.", "Regalo de cumpleaños exclusivo."] },
  { id: 103, name: "Reserve", price: 149, popular: false, benefits: ["Todos los beneficios de la Membresía Gold.", "20% de descuento total en café en grano, merchandise y accesorios.", "Acceso garantizado y reservado a la Colección Exclusiva de Oro.", "Invitación VIP a degustaciones privadas y catas de café con Baristas Reserve."] },
];

function MembershipPage() {
  const { user } = useAuth();
  const { setMembership } = useCart();
  const navigate = useNavigate();

  function choose(id: number) {
    if (!user) {
      toast.error("Debes iniciar sesión para realizar una compra");
      navigate({ to: "/auth" });
      return;
    }
    setMembership(id);
    navigate({ to: "/checkout" });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/" className="font-display text-2xl font-semibold text-forest">Starbucks<sup className="ml-0.5 text-[8px]">®</sup></Link>
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Volver a la tienda</Link>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24 lg:px-8">
        <div className="reveal-up mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">The Reserve Circle</p>
          <h1 className="mt-4 text-balance font-display text-4xl font-medium text-forest sm:text-6xl">Membresías Exclusivas Starbucks</h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">Cada nivel abre una puerta más a la experiencia VIP: descuentos crecientes, regalos únicos y acceso a momentos que pocos llegan a vivir.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3 md:items-stretch">
          {tiers.map((t) => (
            <article key={t.id} className={`relative flex flex-col rounded-2xl p-8 transition-transform hover:-translate-y-1 ${t.popular ? "border-2 border-gold bg-forest text-primary-foreground shadow-2xl" : "border border-border bg-card"}`}>
              {t.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-forest">Más popular</span>}
              <p className={`text-xs font-bold uppercase tracking-[0.2em] ${t.popular ? "text-gold" : "text-primary"}`}>Membresía</p>
              <h2 className={`mt-2 font-display text-3xl ${t.popular ? "" : "text-forest"}`}>Membresía {t.name}</h2>
              <p className="mt-6"><span className="font-display text-4xl">S/ {t.price}.00</span><span className={`text-sm ${t.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}> / mes</span></p>
              <ul className="my-8 grid flex-1 content-start gap-3 text-sm leading-6">
                {t.benefits.map((b) => (
                  <li key={b} className="flex gap-3"><span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${t.popular ? "bg-gold text-forest" : "bg-mint text-forest"}`}><Check className="size-3" /></span>{b}</li>
                ))}
              </ul>
              <Button size="lg" className={t.popular ? "w-full bg-gold text-forest hover:bg-gold/90" : "w-full"} onClick={() => choose(t.id)}>Elegir Membresía {t.name}</Button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
