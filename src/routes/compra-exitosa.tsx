import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ORDER_KEY, type Order } from "@/lib/cart";

export const Route = createFileRoute("/compra-exitosa")({
  head: () => ({ meta: [
    { title: "¡Compra exitosa! — Starbucks Perú" },
    { name: "description", content: "Tu compra se completó correctamente. Revisa el recibo de tu pedido." },
    { property: "og:title", content: "¡Compra exitosa! — Starbucks Perú" },
    { property: "og:description", content: "Confirmación y recibo de tu pedido en Starbucks Perú." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: SuccessPage,
});

const money = (n: number) => `S/ ${n.toFixed(2)}`;

function SuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => { try { const raw = sessionStorage.getItem(ORDER_KEY); if (raw) setOrder(JSON.parse(raw)); } catch { /* ignore */ } }, []);

  return <main className="grid min-h-screen place-items-center bg-background px-5 py-12">
    <div className="w-full max-w-xl text-center">
      <span className="mx-auto grid size-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl ring-8 ring-mint"><Check className="size-10" strokeWidth={3} /></span>
      <h1 className="mt-8 font-display text-4xl font-medium text-forest sm:text-5xl">¡Compra Exitosa!</h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">Hemos enviado el resumen y recibo de tu compra al correo registrado.</p>

      {order && <section className="mt-10 rounded-2xl border border-border bg-card p-6 text-left shadow-sm sm:p-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Recibo</p>
          <p className="text-sm font-bold text-forest">Pedido {order.id}</p>
        </div>
        <ul className="grid gap-3 border-b border-border py-5">{order.items.map((i) => <li key={i.title} className="flex justify-between gap-4 text-sm"><span>{i.quantity} × {i.title}</span><span className="font-semibold">{money(i.price * i.quantity)}</span></li>)}</ul>
        <dl className="grid gap-3 pt-5 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Método de pago</dt><dd className="font-semibold">{order.method}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Dirección de entrega</dt><dd className="text-right font-semibold">Av. de la Marina 21 - Plaza San Miguel</dd></div>
          <div className="mt-2 flex items-center justify-between border-t border-border pt-4"><dt className="text-xs font-bold uppercase tracking-[0.16em] text-forest">Total pagado</dt><dd className="font-display text-2xl text-forest">{money(order.total)}</dd></div>
        </dl>
      </section>}

      <Button size="lg" className="mt-8" asChild><Link to="/">Volver a la tienda</Link></Button>
    </div>
  </main>;
}
