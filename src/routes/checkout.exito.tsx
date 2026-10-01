import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout/exito")({
  head: () => ({
    meta: [
      { title: "Compra exitosa — Starbucks Perú" },
      { name: "description", content: "Tu pedido fue confirmado. Gracias por tu compra." },
      { property: "og:title", content: "Compra exitosa — Starbucks Perú" },
      { property: "og:description", content: "Tu pedido fue confirmado. Gracias por tu compra." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { lastOrder } = useCart();

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-16 text-foreground">
      <div className="w-full max-w-lg text-center">
        <div className="reveal-up mx-auto grid size-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl ring-8 ring-mint">
          <Check className="size-10" strokeWidth={3} />
        </div>
        <h1 className="mt-8 font-display text-4xl font-medium text-forest sm:text-5xl">¡Gracias por tu compra!</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Tu pedido fue confirmado y pronto estará en camino. Recibirás los detalles en tu correo.
        </p>

        {lastOrder ? (
          <div className="mt-8 rounded-xl border border-border bg-card p-6 text-left">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Pedido</p>
              <p className="font-mono text-sm font-bold text-forest">{lastOrder.number}</p>
            </div>
            <div className="mt-4 grid gap-3 border-t border-border pt-4">
              {lastOrder.items.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.image} alt="" className="size-12 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.title}</p>
                    <p className="text-xs text-muted-foreground">Cantidad: {p.quantity}</p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-bold">S/ {p.price * p.quantity}.00</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-1.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Método de pago</span>
                <span className="font-semibold text-foreground">{lastOrder.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Total pagado</span>
                <span className="font-display text-xl text-forest">S/ {lastOrder.total}.00</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No encontramos un pedido reciente en esta sesión.
          </p>
        )}

        <Button size="lg" className="mt-8" asChild>
          <Link to="/">Volver a la tienda</Link>
        </Button>
      </div>
    </main>
  );
}
