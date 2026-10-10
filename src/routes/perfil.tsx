import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Crown, LogOut, Package, Plus, Receipt, Smartphone, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, initials } from "@/lib/auth";
import { activeMembership, useCart, type Order } from "@/lib/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/perfil")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Mi Perfil — Starbucks Perú" },
      { name: "description", content: "Tus datos, métodos de pago guardados e historial de pedidos en Starbucks Perú." },
      { property: "og:title", content: "Mi Perfil — Starbucks Perú" },
      { property: "og:description", content: "Tus datos, métodos de pago guardados e historial de pedidos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

type Tab = "datos" | "pagos" | "pedidos";
type PayMethod = { id: string; kind: "Tarjeta" | "Yape"; label: string };
type OrderFilter = "todos" | "tienda" | "coleccion" | "membresias";

const money = (v: number) => `S/ ${v.toFixed(2)}`;

function ProfilePage() {
  const { user, ready, logout } = useAuth();
  const { orders, clear } = useCart();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("datos");

  useEffect(() => {
    if (ready && !user) navigate({ to: "/auth", replace: true });
  }, [ready, user, navigate]);

  if (!ready || !user) return <main className="min-h-screen bg-background" />;

  const membership = activeMembership(orders);
  const tabs: { id: Tab; label: string; icon: typeof UserRound }[] = [
    { id: "datos", label: "Mis Datos Personales", icon: UserRound },
    { id: "pagos", label: "Métodos de Pago Guardados", icon: CreditCard },
    { id: "pedidos", label: "Historial de Pedidos", icon: Package },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="bg-forest text-primary-foreground">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="font-display text-2xl font-semibold">Starbucks®</Link>
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
            <Link to="/"><ArrowLeft className="size-4" />Volver a la tienda</Link>
          </Button>
        </div>
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 pb-10 pt-6 sm:flex-row sm:items-center sm:px-6">
          <div className={cn("grid size-20 shrink-0 place-items-center rounded-full bg-primary-foreground/10 font-display text-3xl", membership ? "ring-4 ring-gold" : "ring-2 ring-primary-foreground/30")}>
            {initials(user.name)}
          </div>
          <div className="min-w-0">
            {membership && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-gold/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
                <Crown className="size-3.5" /> Miembro Starbucks VIP
              </span>
            )}
            <h1 className={cn("mt-2 truncate font-display text-4xl font-medium sm:text-5xl", membership && "text-gold-shine")}>{user.name}</h1>
            <p className="mt-1 text-sm text-primary-foreground/75">
              {membership ? `${membership.title} activa` : user.email}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {!membership && (
          <div className="mb-8 flex flex-col gap-4 rounded-xl border border-gold/50 bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl text-forest">Vive la experiencia VIP</p>
              <p className="text-sm text-muted-foreground">Activa tu membresía y disfruta beneficios exclusivos cada mes.</p>
            </div>
            <Button className="bg-gold text-forest hover:bg-gold/90" asChild>
              <Link to="/membresia"><Crown className="size-4" />Activar Membresía</Link>
            </Button>
          </div>
        )}

        <div role="tablist" className="flex gap-2 overflow-x-auto rounded-full border border-border bg-card p-1.5">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
              className={cn("flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                tab === t.id ? "bg-forest text-primary-foreground" : "text-muted-foreground hover:text-forest")}>
              <t.icon className="size-4" />{t.label}
            </button>
          ))}
        </div>

        <section key={tab} className="reveal-up mt-6">
          {tab === "datos" && <PersonalData />}
          {tab === "pagos" && <PaymentMethods email={user.email} />}
          {tab === "pedidos" && <OrderHistory orders={orders} />}
        </section>

        <div className="mt-10 border-t border-border pt-6">
          <Button variant="outline" onClick={() => { logout(); clear(); toast("Sesión cerrada"); navigate({ to: "/", replace: true }); }}>
            <LogOut className="size-4" />Cerrar Sesión
          </Button>
        </div>
      </div>
    </main>
  );
}

function PersonalData() {
  const { user, update } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user!.name, email: user!.email, phone: user!.phone ?? "", address: user!.address ?? "Lima, Perú" });
  const [error, setError] = useState("");

  const save = () => {
    if (!form.name.trim()) return setError("Ingresa tu nombre completo.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("Ingresa un correo válido.");
    if (form.phone && !/^\+?[\d\s]{9,15}$/.test(form.phone)) return setError("Ingresa un teléfono válido (9 dígitos).");
    setError("");
    update({ name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim() });
    setEditing(false);
    toast.success("Datos actualizados");
  };

  const fields: { key: keyof typeof form; label: string; placeholder?: string; readOnly?: boolean }[] = [
    { key: "name", label: "Nombre completo" },
    { key: "email", label: "Correo electrónico", readOnly: true },
    { key: "phone", label: "Teléfono", placeholder: "999 999 999" },
    { key: "address", label: "Dirección de envío predeterminada", placeholder: "Lima, Perú" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className="block text-sm">
            <span className="font-semibold text-forest">{f.label}</span>
            {editing && !f.readOnly ? (
              <Input className="mt-1.5" value={form[f.key]} placeholder={f.placeholder} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            ) : (
              <p className="mt-1.5 rounded-md bg-secondary/40 px-3 py-2 text-foreground">{form[f.key] || <span className="text-muted-foreground">Sin registrar</span>}</p>
            )}
          </label>
        ))}
      </div>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <div className="mt-6 flex gap-3">
        {editing ? (
          <>
            <Button onClick={save}>Guardar cambios</Button>
            <Button variant="outline" onClick={() => { setEditing(false); setError(""); }}>Cancelar</Button>
          </>
        ) : (
          <Button onClick={() => setEditing(true)}>Editar Datos</Button>
        )}
      </div>
    </div>
  );
}

function PaymentMethods({ email }: { email: string }) {
  const key = `sbx-payments:${email.toLowerCase()}`;
  const [methods, setMethods] = useState<PayMethod[]>([]);
  const [adding, setAdding] = useState<null | "Tarjeta" | "Yape">(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      setMethods(raw ? JSON.parse(raw) : [
        { id: "v1", kind: "Tarjeta", label: "Tarjeta Visa terminada en **** 4821" },
        { id: "y1", kind: "Yape", label: "Yape asociado al *****9201" },
      ]);
    } catch { setMethods([]); }
  }, [key]);

  const persist = (next: PayMethod[]) => { setMethods(next); localStorage.setItem(key, JSON.stringify(next)); };

  const addMethod = () => {
    const digits = value.replace(/\D/g, "");
    if (adding === "Tarjeta" && digits.length !== 16) return setError("El número de tarjeta debe tener 16 dígitos.");
    if (adding === "Yape" && digits.length !== 9) return setError("El celular debe tener 9 dígitos.");
    const brand = digits.startsWith("5") ? "Mastercard" : "Visa";
    const label = adding === "Tarjeta" ? `Tarjeta ${brand} terminada en **** ${digits.slice(-4)}` : `Yape asociado al *****${digits.slice(-4)}`;
    persist([...methods, { id: crypto.randomUUID(), kind: adding!, label }]);
    setAdding(null); setValue(""); setError("");
    toast.success("Método de pago agregado");
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Datos de demostración guardados solo en este navegador. Nunca ingreses una tarjeta real.</p>
      {methods.length === 0 && <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No tienes métodos de pago guardados.</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {methods.map((m) => (
          <div key={m.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className={cn("grid size-11 place-items-center rounded-lg", m.kind === "Tarjeta" ? "bg-forest text-primary-foreground" : "bg-secondary text-forest")}>
              {m.kind === "Tarjeta" ? <CreditCard className="size-5" /> : <Smartphone className="size-5" />}
            </div>
            <p className="flex-1 text-sm font-medium">{m.label}</p>
            <Button variant="ghost" size="icon" aria-label="Eliminar método" onClick={() => { persist(methods.filter((x) => x.id !== m.id)); toast("Método eliminado"); }}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      {adding ? (
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-semibold text-forest">{adding === "Tarjeta" ? "Nueva tarjeta" : "Nuevo Yape"}</p>
          <Input className="mt-2" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)}
            placeholder={adding === "Tarjeta" ? "0000 0000 0000 0000" : "999 999 999"} />
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          <div className="mt-4 flex gap-3">
            <Button onClick={addMethod}>Guardar</Button>
            <Button variant="outline" onClick={() => { setAdding(null); setError(""); setValue(""); }}>Cancelar</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setAdding("Tarjeta")}><Plus className="size-4" />Agregar tarjeta</Button>
          <Button variant="outline" onClick={() => setAdding("Yape")}><Plus className="size-4" />Agregar Yape</Button>
        </div>
      )}
    </div>
  );
}

const filters: { id: OrderFilter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "tienda", label: "Productos de Tienda" },
  { id: "coleccion", label: "Colección & Merchandise" },
  { id: "membresias", label: "Membresías" },
];

function matches(order: Order, f: OrderFilter) {
  if (f === "todos") return true;
  return order.items.some((i) =>
    f === "tienda" ? i.collection === "En tienda" : f === "membresias" ? i.collection === "Membresía" : i.collection === "Green" || i.collection === "Perú");
}

function OrderHistory({ orders }: { orders: Order[] }) {
  const { viewOrder } = useCart();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<OrderFilter>("todos");
  const list = orders.filter((o) => matches(o, filter));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={cn("rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f.id ? "border-forest bg-forest text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-forest hover:text-forest")}>
            {f.label}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          <p>Aún no tienes pedidos en esta categoría.</p>
          <Button className="mt-4" asChild><Link to="/">Ir a la tienda</Link></Button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {list.map((o) => {
            const delivered = Date.now() - new Date(o.issuedAt).getTime() > 1000 * 60 * 60 * 24;
            const isMembership = o.items.some((i) => i.collection === "Membresía");
            const status = isMembership ? "Activa" : delivered ? "Entregado" : "En proceso";
            return (
              <article key={o.number} className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-sm font-bold text-forest">#{o.number}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Lima" }).format(new Date(o.issuedAt))}
                      {" · "}{o.method === "Tarjeta" ? "Tarjeta de Crédito/Débito" : o.method}
                    </p>
                  </div>
                  <span className={cn("self-start rounded-full px-3 py-1 text-xs font-bold",
                    status === "En proceso" ? "bg-gold/20 text-forest" : "bg-forest text-primary-foreground")}>{status}</span>
                </div>
                <p className="mt-3 text-sm text-foreground">{o.items.map((i) => `${i.quantity}× ${i.title}`).join(", ")}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <p className="text-lg font-bold text-forest">{money(o.total)}</p>
                  <Button size="sm" variant="outline" onClick={() => { viewOrder(o); navigate({ to: "/checkout/exito" }); }}>
                    <Receipt className="size-4" />Ver Boleta
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
