import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CreditCard, Lock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout/")({
  head: () => ({
    meta: [
      { title: "Checkout — Starbucks Perú" },
      { name: "description", content: "Completa tu compra de forma segura con tarjeta o Yape." },
      { property: "og:title", content: "Checkout — Starbucks Perú" },
      { property: "og:description", content: "Completa tu compra de forma segura con tarjeta o Yape." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutPage,
});

type Method = "tarjeta" | "yape";
type PaymentStatus = "idle" | "processing" | "success";

const inputClass =
  "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

function CheckoutPage() {
  const { items, subtotal, placeOrder } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [cardErrors, setCardErrors] = useState<{ name?: string; number?: string; expiry?: string; cvv?: string }>({});
  const [reference, setReference] = useState("");
  const [refError, setRefError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    return () => timers.current.forEach((timer) => clearTimeout(timer));
  }, []);

  function formatNumber(value: string) {
    return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  }

  function validateCard() {
    const errors: { name?: string; number?: string; expiry?: string; cvv?: string } = {};
    if (!card.name.trim()) errors.name = "Ingresa el nombre del titular";
    if (card.number.replace(/\s/g, "").length !== 16) errors.number = "Ingresa los 16 dígitos de la tarjeta";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) errors.expiry = "Usa el formato MM/AA";
    if (!/^\d{3,4}$/.test(card.cvv)) errors.cvv = "Ingresa el CVV";
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function processPayment(paymentMethod: string) {
    if (paymentStatus !== "idle") return;

    setConfirmOpen(false);
    setPaymentStatus("processing");

    timers.current.push(
      setTimeout(() => setPaymentStatus("success"), 3000),
      setTimeout(() => {
        placeOrder(paymentMethod);
        navigate({ to: "/checkout/exito" });
      }, 4000),
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/95">
        <div className="mx-auto flex h-18 max-w-5xl items-center justify-between px-5 lg:px-8">
          <Link to="/" aria-label="Volver a la tienda" className="font-display text-2xl font-semibold text-forest">
            Starbucks<sup className="ml-0.5 text-[8px]">®</sup>
          </Link>
          <p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Lock className="size-3.5 text-primary" /> Pago seguro
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-14">
        {items.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-3xl text-forest">Tu carrito está vacío</p>
            <p className="mt-3 text-sm text-muted-foreground">Agrega productos antes de continuar al pago.</p>
            <Button size="lg" className="mt-8" asChild>
              <Link to="/">Volver a la tienda</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              {step === 1 ? (
                <section aria-labelledby="metodo-title">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Paso 1 de 2</p>
                  <h1 id="metodo-title" className="mt-3 font-display text-4xl font-medium text-forest sm:text-5xl">
                    Seleccione su método de pago
                  </h1>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Método de pago">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={method === "tarjeta"}
                      onClick={() => setMethod("tarjeta")}
                      className={`rounded-xl border-2 bg-card p-6 text-left transition-all hover:-translate-y-0.5 ${
                        method === "tarjeta" ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <span className={`grid size-11 place-items-center rounded-full ${method === "tarjeta" ? "bg-primary text-primary-foreground" : "bg-secondary text-forest"}`}>
                        <CreditCard className="size-5" />
                      </span>
                      <span className="mt-4 block font-display text-xl font-semibold text-forest">Tarjeta de Crédito / Débito</span>
                      <span className="mt-1 block text-sm text-muted-foreground">Paga de forma segura con tu tarjeta.</span>
                      <span className="mt-4 flex gap-2">
                        <span className="rounded border border-border bg-background px-2.5 py-1 text-[10px] font-bold italic text-[#1A1F71]">VISA</span>
                        <span className="flex items-center rounded border border-border bg-background px-2.5 py-1">
                          <span className="size-3 rounded-full bg-[#EB001B]" />
                          <span className="-ml-1.5 size-3 rounded-full bg-[#F79E1B]" />
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={method === "yape"}
                      onClick={() => setMethod("yape")}
                      className={`rounded-xl border-2 bg-card p-6 text-left transition-all hover:-translate-y-0.5 ${
                        method === "yape" ? "border-[#742284] shadow-lg ring-2 ring-[#742284]/20" : "border-border hover:border-[#742284]/40"
                      }`}
                    >
                      <span className={`grid size-11 place-items-center rounded-full ${method === "yape" ? "bg-[#742284] text-white" : "bg-secondary text-forest"}`}>
                        <Smartphone className="size-5" />
                      </span>
                      <span className="mt-4 block font-display text-xl font-semibold text-forest">Yape</span>
                      <span className="mt-1 block text-sm text-muted-foreground">Escanea el QR y paga desde tu app.</span>
                      <span className="mt-4 inline-block rounded bg-[#742284] px-2.5 py-1 text-[10px] font-bold text-white">yape</span>
                    </button>
                  </div>
                  <div className="mt-10 flex justify-end">
                    <Button size="lg" disabled={!method} onClick={() => setStep(2)}>
                      Continuar <ArrowRight />
                    </Button>
                  </div>
                </section>
              ) : (
                <section aria-labelledby="pago-title">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                  >
                    <ArrowLeft className="size-4" /> Cambiar método de pago
                  </button>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-primary">Paso 2 de 2</p>
                  <h1 id="pago-title" className="mt-3 font-display text-4xl font-medium text-forest sm:text-5xl">
                    {method === "tarjeta" ? "Datos de tu tarjeta" : "Paga con Yape"}
                  </h1>

                  {method === "tarjeta" ? (
                    <form
                      className="mt-8 grid gap-5"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (validateCard()) setConfirmOpen(true);
                      }}
                    >
                      <div>
                        <label htmlFor="card-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest">Nombre del titular</label>
                        <input
                          id="card-name"
                          className={inputClass}
                          placeholder="Como aparece en la tarjeta"
                          value={card.name}
                          onChange={(e) => setCard({ ...card, name: e.target.value })}
                          maxLength={60}
                        />
                        {cardErrors.name && <p className="mt-1.5 text-xs font-semibold text-destructive">{cardErrors.name}</p>}
                      </div>
                      <div>
                        <label htmlFor="card-number" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest">Número de tarjeta</label>
                        <input
                          id="card-number"
                          className={inputClass}
                          placeholder="0000 0000 0000 0000"
                          inputMode="numeric"
                          value={card.number}
                          onChange={(e) => setCard({ ...card, number: formatNumber(e.target.value) })}
                        />
                        {cardErrors.number && <p className="mt-1.5 text-xs font-semibold text-destructive">{cardErrors.number}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="card-expiry" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest">Vencimiento (MM/AA)</label>
                          <input
                            id="card-expiry"
                            className={inputClass}
                            placeholder="MM/AA"
                            inputMode="numeric"
                            value={card.expiry}
                            onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                          />
                          {cardErrors.expiry && <p className="mt-1.5 text-xs font-semibold text-destructive">{cardErrors.expiry}</p>}
                        </div>
                        <div>
                          <label htmlFor="card-cvv" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest">CVV</label>
                          <input
                            id="card-cvv"
                            className={inputClass}
                            placeholder="123"
                            inputMode="numeric"
                            value={card.cvv}
                            onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                          />
                          {cardErrors.cvv && <p className="mt-1.5 text-xs font-semibold text-destructive">{cardErrors.cvv}</p>}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button size="lg" type="submit">
                          <Lock /> Pagar ahora · S/ {subtotal.toFixed(2)}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="mt-8 grid gap-6">
                      <p className="max-w-md text-sm leading-6 text-muted-foreground">
                        Escanea el código QR desde tu app Yape para realizar el pago de <strong className="text-foreground">S/ {subtotal.toFixed(2)}</strong>.
                      </p>
                      <div className="w-fit rounded-xl border border-border bg-card p-5">
                        {/* Reemplaza el src de esta imagen con tu código QR de Yape */}
                        <img
                          id="yape-qr-image"
                          src="/yape-qr-placeholder.svg"
                          alt="Código QR de Yape"
                          width={220}
                          height={220}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="max-w-md">
                        <label htmlFor="yape-ref" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest">Número de operación / Referencia</label>
                        <input
                          id="yape-ref"
                          className={inputClass}
                          placeholder="Ej. 12345678"
                          inputMode="numeric"
                          value={reference}
                          onChange={(e) => { setReference(e.target.value.replace(/\D/g, "").slice(0, 12)); setRefError(""); }}
                        />
                        {refError && <p className="mt-1.5 text-xs font-semibold text-destructive">{refError}</p>}
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="lg"
                          className="bg-[#742284] text-white hover:bg-[#742284]/90"
                          onClick={() => {
                            if (reference.trim().length < 6) {
                              setRefError("Ingresa un número de operación válido");
                              return;
                            }
                            processPayment("Yape");
                          }}
                        >
                          Confirmar Pago Yape
                        </Button>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>

            <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Resumen del pedido</p>
              <div className="mt-5 grid gap-4">
                {items.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <img src={p.image} alt="" className="size-14 rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.title}</p>
                      <p className="text-xs text-muted-foreground">Cantidad: {p.quantity}</p>
                    </div>
                    <p className="whitespace-nowrap text-sm font-bold">S/ {(p.price * p.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Total</span>
                <span className="font-display text-2xl text-forest">S/ {subtotal.toFixed(2)}</span>
              </div>
            </aside>
          </div>
        )}
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center px-5" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <button type="button" aria-label="Cancelar" onClick={() => setConfirmOpen(false)} className="absolute inset-0 h-full w-full cursor-default bg-overlay backdrop-blur-sm" />
          <div className="relative w-full max-w-sm rounded-xl bg-cart p-8 text-center text-cart-foreground shadow-2xl">
            <p id="confirm-title" className="font-display text-2xl">¿Confirmar transacción?</p>
            <p className="mt-3 text-sm text-cart-foreground/70">
              Se cargará <strong className="text-gold">S/ {subtotal.toFixed(2)}</strong> a tu tarjeta terminada en {card.number.replace(/\s/g, "").slice(-4)}.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <Button variant="outline" className="border-cart-foreground/40 text-cart-foreground hover:bg-cart-foreground hover:text-cart" onClick={() => setConfirmOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-gold text-cart hover:bg-gold/90" onClick={() => processPayment("Tarjeta")}>
                Aceptar
              </Button>
            </div>
          </div>
        </div>
      )}

      {paymentStatus !== "idle" && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-overlay px-5 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-status-title"
          aria-live="assertive"
        >
          <div className="w-full max-w-sm rounded-xl border border-gold/50 bg-cart p-9 text-center text-cart-foreground shadow-2xl">
            {paymentStatus === "processing" ? (
              <>
                <div className="mx-auto size-16 animate-spin rounded-full border-4 border-cart-foreground/25 border-t-gold motion-reduce:animate-none" />
                <h2 id="payment-status-title" className="mt-7 font-display text-3xl font-medium">
                  Procesando pago...
                </h2>
                <p className="mt-3 text-sm text-cart-foreground/70">Estamos validando tu transacción de forma segura.</p>
              </>
            ) : (
              <div className="animate-scale-in">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-gold text-cart">
                  <Check className="size-8" strokeWidth={3} />
                </div>
                <h2 id="payment-status-title" className="mt-7 font-display text-3xl font-medium">
                  ¡Pago exitoso!
                </h2>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
