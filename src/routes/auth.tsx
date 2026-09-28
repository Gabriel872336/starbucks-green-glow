import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import authImage from "@/assets/auth-espresso.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Iniciar sesión o crear cuenta — Starbucks Perú" },
    { name: "description", content: "Accede a tu cuenta para comprar ediciones limitadas y colecciones exclusivas." },
    { property: "og:title", content: "Iniciar sesión — Starbucks Perú" },
    { property: "og:description", content: "Ingresa o crea tu cuenta para disfrutar la experiencia completa." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AuthPage,
});

const email = z.string().trim().min(1, "Ingresa tu correo").max(255).email("Correo no válido");
const password = z.string().min(1, "Ingresa tu contraseña").min(6, "Mínimo 6 caracteres").max(100);
const loginSchema = z.object({ email, password });
const registerSchema = z.object({
  name: z.string().trim().min(1, "Ingresa tu nombre completo").max(100),
  email, password,
  confirm: z.string().min(1, "Confirma tu contraseña"),
  terms: z.literal(true, { errorMap: () => ({ message: "Debes aceptar los términos" }) }),
}).refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Las contraseñas no coinciden" });

type Errors = Partial<Record<"name" | "email" | "password" | "confirm" | "terms", string>>;

function Field({ label, name, type = "text", value, onChange, error, autoComplete }: { label: string; name: string; type?: string; value: string; onChange: (v: string) => void; error?: string | undefined; autoComplete?: string }) {
  return <label className="block">
    <span className="text-xs font-bold uppercase tracking-[0.14em] text-forest">{label}</span>
    <input name={name} type={type} value={value} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error}
      className={`mt-2 w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${error ? "border-destructive" : "border-input"}`} />
    {error && <span className="mt-1.5 block text-xs font-semibold text-destructive">{error}</span>}
  </label>;
}

function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", terms: false });
  const [errors, setErrors] = useState<Errors>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const set = (k: keyof typeof form) => (v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const result = tab === "login" ? loginSchema.safeParse(form) : registerSchema.safeParse(form);
    if (!result.success) {
      const errs: Errors = {};
      for (const issue of result.error.issues) errs[issue.path[0] as keyof Errors] ??= issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    const name = tab === "register" ? form.name.trim() : form.email.split("@")[0]!;
    login({ name, email: form.email.trim() });
    toast.success(tab === "login" ? "¡Bienvenido de vuelta!" : "Tu cuenta fue creada");
    navigate({ to: "/" });
  }

  return <main className="grid min-h-screen bg-background lg:grid-cols-2">
    <div className="relative hidden overflow-hidden lg:block">
      <img src={authImage} alt="Máquina de espresso con detalles dorados junto a un vaso con arte de Machu Picchu" width={1200} height={1504} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent" />
      <div className="absolute bottom-12 left-12 right-12 text-primary-foreground">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Colección Perú</p>
        <p className="mt-4 font-display text-4xl leading-tight">Cada taza, una experiencia inspirada en nuestra tierra.</p>
      </div>
    </div>
    <div className="flex flex-col px-6 py-8 sm:px-12">
      <Link to="/" className="font-display text-2xl font-semibold text-forest">Starbucks<sup className="ml-0.5 text-[8px]">®</sup></Link>
      <div className="mx-auto my-auto w-full max-w-md py-10">
        <h1 className="font-display text-4xl font-medium text-forest">{tab === "login" ? "Bienvenido" : "Únete a nosotros"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{tab === "login" ? "Ingresa para continuar con tu compra." : "Crea tu cuenta y accede a colecciones exclusivas."}</p>
        <div className="mt-8 grid grid-cols-2 rounded-full bg-secondary p-1" role="tablist">
          {(["login", "register"] as const).map((t) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => { setTab(t); setErrors({}); }}
            className={`rounded-full py-2.5 text-sm font-bold transition-all ${tab === t ? "bg-primary text-primary-foreground shadow-sm" : "text-secondary-foreground"}`}>{t === "login" ? "Iniciar Sesión" : "Crear Cuenta"}</button>)}
        </div>
        <form onSubmit={submit} noValidate className="mt-8 grid gap-5">
          {tab === "register" && <Field label="Nombre completo" name="name" value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" />}
          <Field label="Correo electrónico" name="email" type="email" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />
          <Field label="Contraseña" name="password" type="password" value={form.password} onChange={set("password")} error={errors.password} autoComplete={tab === "login" ? "current-password" : "new-password"} />
          {tab === "register" && <>
            <Field label="Confirmar contraseña" name="confirm" type="password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} autoComplete="new-password" />
            <div>
              <label className="flex items-start gap-3 text-sm text-muted-foreground">
                <input type="checkbox" checked={form.terms} onChange={(e) => set("terms")(e.target.checked)} className="mt-0.5 size-4 accent-[var(--color-primary)]" />
                <span>Acepto los <span className="font-semibold text-forest underline underline-offset-4">Términos y Condiciones</span> y la política de privacidad.</span>
              </label>
              {errors.terms && <span className="mt-1.5 block text-xs font-semibold text-destructive">{errors.terms}</span>}
            </div>
          </>}
          <Button type="submit" size="lg" className="mt-2 w-full">{tab === "login" ? "Iniciar sesión" : "Crear cuenta"}</Button>
        </form>
      </div>
    </div>
  </main>;
}
