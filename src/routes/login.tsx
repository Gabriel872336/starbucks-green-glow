import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { AuthField, AuthForm, AuthLayout } from "@/components/auth-layout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Iniciar sesión — Starbucks Perú" },
    { name: "description", content: "Accede a tu cuenta para descubrir experiencias y colecciones exclusivas." },
    { property: "og:title", content: "Iniciar sesión — Starbucks Perú" },
    { property: "og:description", content: "Accede a tu cuenta y continúa tu experiencia Starbucks Perú." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setMessage("No pudimos iniciar sesión. Revisa tus datos e inténtalo nuevamente.");
    await navigate({ to: "/" });
  }

  async function resetPassword() {
    if (!email) return setMessage("Ingresa tu correo para enviarte el enlace de recuperación.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setMessage(error ? "No pudimos enviar el enlace. Inténtalo nuevamente." : "Revisa tu correo para continuar con la recuperación.");
  }

  return <AuthLayout eyebrow="Bienvenido de nuevo" title="Inicia sesión" description="Accede a tus selecciones, beneficios y experiencias exclusivas."><AuthForm onSubmit={submit}><AuthField label="Email" name="email" type="email" autoComplete="email" value={email} onChange={setEmail}/><AuthField label="Contraseña" name="password" type="password" autoComplete="current-password" value={password} onChange={setPassword}/><Button type="submit" size="lg" disabled={busy} className="mt-1 w-full">{busy ? "Iniciando…" : "Iniciar Sesión"}</Button><Button type="button" variant="link" onClick={resetPassword} className="h-auto justify-start p-0 text-primary">Olvidé mi contraseña</Button>{message && <p role="status" className="rounded-lg bg-secondary px-4 py-3 text-sm text-secondary-foreground">{message}</p>}<p className="border-t border-border pt-5 text-sm text-muted-foreground">¿Aún no tienes una cuenta? <Link to="/register" className="font-bold text-primary hover:underline">Crear cuenta</Link></p></AuthForm></AuthLayout>;
}