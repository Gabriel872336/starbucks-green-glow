import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [
    { title: "Recuperar contraseña — Starbucks Perú" },
    { name: "description", content: "Solicita un enlace seguro para recuperar el acceso a tu cuenta." },
    { property: "og:title", content: "Recuperar contraseña — Starbucks Perú" },
    { property: "og:description", content: "Solicita un enlace seguro para recuperar el acceso a tu cuenta." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setMessage(error ? "No pudimos enviar el enlace. Inténtalo nuevamente." : "Revisa tu correo: te enviamos un enlace para crear una nueva contraseña.");
  }
  return <main className="flex min-h-screen items-center justify-center bg-background px-6"><div className="w-full max-w-md"><Button variant="ghost" size="sm" asChild className="mb-8 -ml-3"><Link to="/login"><ArrowLeft /> Volver</Link></Button><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Acceso seguro</p><h1 className="mt-3 font-display text-4xl font-medium text-forest">Recupera tu contraseña</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">Ingresa tu email y recibirás un enlace de recuperación.</p><form onSubmit={submit} className="mt-8 space-y-5"><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="h-12 bg-card" /></div>{message && <p role="status" className="rounded-md bg-mint px-4 py-3 text-sm text-forest">{message}</p>}<Button size="lg" className="w-full">Enviar enlace</Button></form></div></main>;
}