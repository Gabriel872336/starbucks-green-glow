import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { AuthField, AuthForm, AuthLayout } from "@/components/auth-layout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [
    { title: "Crear cuenta — Starbucks Perú" },
    { name: "description", content: "Crea tu cuenta para acceder a colecciones y experiencias exclusivas." },
    { property: "og:title", content: "Crear cuenta — Starbucks Perú" },
    { property: "og:description", content: "Únete y descubre una selección extraordinaria de café y accesorios." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate({ from: "/register" });
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const update = (field: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [field]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    if (form.password !== form.confirm) return setMessage("Las contraseñas deben coincidir.");
    if (form.password.length < 8) return setMessage("La contraseña debe tener al menos 8 caracteres.");
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { emailRedirectTo: window.location.origin, data: { full_name: form.name } } });
    if (!error && data.user && data.session) await supabase.from("profiles").upsert({ id: data.user.id, full_name: form.name });
    setBusy(false);
    if (error) return setMessage("No pudimos crear la cuenta. Revisa tus datos e inténtalo nuevamente.");
    if (!data.session) return setMessage("Revisa tu correo y confirma tu cuenta para iniciar sesión.");
    await navigate({ to: "/" });
  }

  return <AuthLayout eyebrow="Comienza tu experiencia" title="Crea tu cuenta" description="Descubre lanzamientos exclusivos y guarda tus favoritos en un solo lugar."><AuthForm onSubmit={submit}><AuthField label="Nombre" name="name" autoComplete="name" value={form.name} onChange={update("name")}/><AuthField label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={update("email")}/><AuthField label="Contraseña" name="password" type="password" autoComplete="new-password" value={form.password} onChange={update("password")}/><AuthField label="Confirmar contraseña" name="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={update("confirm")}/><Button type="submit" size="lg" disabled={busy} className="mt-1 w-full">{busy ? "Creando…" : "Crear Cuenta"}</Button>{message && <p role="status" className="rounded-lg bg-secondary px-4 py-3 text-sm text-secondary-foreground">{message}</p>}<p className="border-t border-border pt-5 text-sm text-muted-foreground">¿Ya tienes una cuenta? <Link to="/login" className="font-bold text-primary hover:underline">Iniciar sesión</Link></p></AuthForm></AuthLayout>;
}