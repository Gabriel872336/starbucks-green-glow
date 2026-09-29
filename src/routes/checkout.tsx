import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Check, CreditCard, Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { ORDER_KEY, useCart, type Order } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [
    { title: "Checkout y pago — Starbucks Perú" },
    { name: "description", content: "Elige tu método de pago con tarjeta o Yape y completa tu compra de forma segura." },
    { property: "og:title", content: "Checkout y pago — Starbucks Perú" },
    { property: "og:description", content: "Completa tu compra con tarjeta de crédito, débito o Yape." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: CheckoutPage,
});

type Method = "tarjeta" | "yape";
const money = (n: number) => `S/ ${n.toFixed(2)}`;

function CardBrands() {
  return <div className="flex gap-1.5" aria-hidden="true">
    <span className="rounded bg-forest px-2 py-0.5 text-[10px] font-black italic text-primary-foreground">VISA</span>
    <span className="flex items-center rounded bg-card px-1.5 py-0.5 ring-1 ring-border"><span className="size-3 rounded-full bg-destructive/90" /><span className="-ml-1.5 size-3 rounded-full bg-gold/90" /></span>
    <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">AMEX</span>
  </div>;
}

function QrPlaceholder() {
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const x = i % 21, y = Math.floor(i / 21);
    const finder = (a: number, b: number) => x >= a && x < a + 7 && y >= b && y < b + 7;
    if (finder(0, 0) || finder(14, 0) || finder(0, 14)) {
      const lx = x % 14 === x ? x : x - 14, ly = y % 14 === y ? y : y - 14;
      return lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4);
    }
    return ((x * 7 + y * 13 + x * y) % 5) < 2;
  });
  return <svg viewBox="0 0 21 21" className="size-full" role="img" aria-label="Código QR de Yape (referencial)" shapeRendering="crispEdges">
    {cells.map((on, i) => on ? <rect key={i} x={i % 21} y={Math.floor(i / 21)} width="1" height="1" fill="currentColor" /> : null)}
  </svg>;
}

function Field({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return <label className="grid gap-1.5 text-sm font-semibold text-forest">{label}
    <input {...props} className={`h-11 rounded-lg border bg-background px-3 text-sm font-normal text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${error ? "border-destructive" : "border-input"}`} />
    {error && <span className="text-xs font-medium text-destructive">{error}</span>}
  </label>;
}

function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal, setCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<"select" | "details">("select");
  const [method, setMethod] = useState<Method>("tarjeta");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [operation, setOperation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!localStorage.getItem("sbx-demo-user")) {
        toast.error("Debes iniciar sesión para realizar una compra");
        navigate({ to: "/auth" });
      }
    }, 50);
    return () => window.clearTimeout(t);
  }, [navigate]);

  function finish(label: string) {
    const order: Order = {
      id: `SBX-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      items: items.map((i) => ({ title: i.title, quantity: i.quantity, price: i.price })),
      total: subtotal, method: label, date: new Date().toISOString(),
    };
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    setCart([]);
    navigate({ to: "/compra-exitosa" });
  }

  function validateCard() {
    const e: Record<string, string> = {};
    if (card.name.trim().length < 3) e.name = "Ingresa el nombre del titular";
    if (card.number.replace(/\s/g, "").length !== 16) e.number = "El número debe tener 16 dígitos";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) e.expiry = "Formato MM/AA";
    if (!/^\d{3,4}$/.test(card.cvv)) e.cvv = "CVV inválido";
    setErrors(e);
    if (!Object.keys(e).length) setConfirmOpen(true);
  }

  function confirmYape() {
    setLoading(true);
    window.setTimeout(() => finish("Yape"), 2000);
  }

  if (!user) return <main className="grid min-h-screen place-items-center bg-background"><Loader2 className="size-6 animate-spin text-primary" /></main>;

  if (!items.length) return <main className="grid min-h-screen place-items-center bg-background px-5 text-center">
    <div><h1 className="font-display text-3xl text-forest">Tu carrito está vacío</h1><p className="mt-2 text-muted-foreground">Agrega productos para continuar con el pago.</p><Button className="mt-6" asChild><Link to="/">Volver a la tienda</Link></Button></div>
  </main>;

  return <main className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-background"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
      <Link to="/" className="font-display text-2xl font-semibold text-forest">Starbucks<sup className="ml-0.5 text-[8px]">®</sup></Link>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Pago seguro</span>
    </div></header>

    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1fr_360px] lg:py-14">
      <section>
        <button onClick={() => step === "details" ? setStep("select") : navigate({ to: "/" })} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" />{step === "details" ? "Cambiar método de pago" : "Volver a la tienda"}</button>

        {step === "select" ? <>
          <h1 className="font-display text-4xl font-medium text-forest sm:text-5xl">Selecciona tu método de pago</h1>
          <div className="mt-8 grid gap-4 sm:grid-cols-2" role="radiogroup">
            {([["tarjeta", "Tarjeta de Crédito / Débito", "Visa, Mastercard y American Express"], ["yape", "Yape", "Paga al instante escaneando un QR"]] as const).map(([id, title, sub]) => {
              const active = method === id;
              return <button key={id} role="radio" aria-checked={active} onClick={() => setMethod(id)} className={`relative flex min-h-44 flex-col justify-between rounded-2xl border-2 bg-card p-6 text-left transition-all hover:-translate-y-0.5 ${active ? "border-primary shadow-lg" : "border-border hover:border-primary/40"}`}>
                <div className="flex items-start justify-between">
                  {id === "tarjeta" ? <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary"><CreditCard /></span> : <span className="grid size-12 place-items-center rounded-xl bg-yape text-lg font-black italic text-yape-foreground">yape</span>}
                  <span className={`grid size-6 place-items-center rounded-full border-2 ${active ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{active && <Check className="size-3.5" />}</span>
                </div>
                <div><p className="font-display text-xl font-semibold text-forest">{title}</p><p className="mt-1 text-sm text-muted-foreground">{sub}</p>{id === "tarjeta" && <div className="mt-3"><CardBrands /></div>}</div>
              </button>;
            })}
          </div>
          <div className="mt-8 flex justify-end"><Button size="lg" onClick={() => setStep("details")}>Continuar</Button></div>
        </> : method === "tarjeta" ? <>
          <h1 className="font-display text-4xl font-medium text-forest">Datos de la tarjeta</h1>
          <div className="mt-8 grid gap-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex justify-end"><CardBrands /></div>
            <Field label="Nombre del titular" placeholder="Como aparece en la tarjeta" value={card.name} error={errors.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
            <Field label="Número de tarjeta" inputMode="numeric" placeholder="0000 0000 0000 0000" value={card.number} error={errors.number} onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim() })} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Vencimiento" inputMode="numeric" placeholder="MM/AA" value={card.expiry} error={errors.expiry} onChange={(e) => { const d = e.target.value.replace(/\D/g, "").slice(0, 4); setCard({ ...card, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }); }} />
              <Field label="CVV" inputMode="numeric" type="password" placeholder="•••" value={card.cvv} error={errors.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
            </div>
            <div className="flex justify-end"><Button size="lg" onClick={validateCard}>Pagar {money(subtotal)}</Button></div>
          </div>
        </> : <>
          <h1 className="font-display text-4xl font-medium text-forest">Paga con Yape</h1>
          <div className="mt-8 grid gap-8 rounded-2xl border border-border bg-card p-6 sm:grid-cols-[220px_1fr] sm:p-8">
            <div className="rounded-2xl bg-yape p-4 text-center text-yape-foreground">
              <p className="text-2xl font-black italic">yape</p>
              <div className="mt-3 aspect-square rounded-xl bg-background p-3 text-foreground"><QrPlaceholder /></div>
              <p className="mt-3 text-xs font-semibold">Starbucks Perú</p>
            </div>
            <div className="grid content-start gap-5">
              <ol className="grid gap-3 text-sm text-muted-foreground">
                {["Abre la app Yape en tu celular.", "Toca «Escanear QR» y apunta al código.", `Verifica el monto de ${money(subtotal)} y confirma.`].map((t, i) => <li key={t} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>{t}</li>)}
              </ol>
              <Field label="Número de operación (opcional)" inputMode="numeric" placeholder="Ej. 12345678" value={operation} onChange={(e) => setOperation(e.target.value.replace(/\D/g, "").slice(0, 12))} />
              <Button size="lg" className="w-full sm:w-fit sm:justify-self-end" disabled={loading} onClick={confirmYape}>{loading ? <><Loader2 className="animate-spin" />Verificando transacción...</> : "Confirmar Pago Yape"}</Button>
            </div>
          </div>
        </>}
      </section>

      <aside className="h-fit rounded-2xl bg-forest p-6 text-primary-foreground lg:sticky lg:top-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Resumen del pedido</p>
        <ul className="mt-5 grid gap-4">{items.map((i) => <li key={i.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-3">
          <img src={i.image} alt="" className="aspect-square w-full rounded-md object-cover" />
          <div className="min-w-0"><p className="truncate text-sm font-semibold">{i.title}</p><p className="text-xs text-primary-foreground/65">Cantidad: {i.quantity}</p></div>
          <span className="text-sm font-bold">{money(i.price * i.quantity)}</span>
        </li>)}</ul>
        <div className="mt-6 flex items-center justify-between border-t border-primary-foreground/15 pt-5"><span className="text-xs font-bold uppercase tracking-[0.16em]">Total</span><span className="font-display text-2xl">{money(subtotal)}</span></div>
      </aside>
    </div>

    {confirmOpen && <div className="fixed inset-0 z-50 grid place-items-center p-5" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <button aria-label="Cancelar" className="absolute inset-0 bg-overlay backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
      <div className="relative w-full max-w-md rounded-2xl bg-card p-7 text-center shadow-2xl">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-secondary text-primary"><CreditCard /></span>
        <h2 id="confirm-title" className="mt-4 font-display text-2xl font-semibold text-forest">¿Confirmar la transacción por {money(subtotal)}?</h2>
        <p className="mt-2 text-sm text-muted-foreground">Se realizará el cargo a la tarjeta terminada en {card.number.slice(-4)}.</p>
        <div className="mt-6 grid grid-cols-2 gap-3"><Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button><Button onClick={() => finish(`Tarjeta •••• ${card.number.slice(-4)}`)}>Confirmar</Button></div>
      </div>
    </div>}
  </main>;
}
