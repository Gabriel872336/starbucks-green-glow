import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Nueva contraseña — Starbucks Perú" },
    { name: "description", content: "Crea una nueva contraseña segura para tu cuenta." },
    { property: "og:title", content: "Nueva contraseña — Starbucks Perú" },
    { property: "og:description", content: "Crea una nueva contraseña segura para tu cuenta." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [validRecovery, setValidRecovery] = useState(false);
  const [message, setMessage] = useState("Validando enlace…");
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search);
    const isRecovery = hash.get("type") === "recovery" || query.get("type") === "recovery";
    setValidRecovery(isRecovery);
    setMessage(isRecovery ? "" : "Este enlace de recuperación no es válido o ha expirado.");
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirm) { setMessage("Las contraseñas no coinciden."); return; }
    const { error } = await supabase.auth.updateUser({ password });
    setMessage(error ? "No pudimos actualizar la contraseña." : "Contraseña actualizada. Ya puedes iniciar sesión.");
  }
  return <main className="flex min-h-screen items-center justify-center bg-background px-6"><div className="w-full max-w-md"><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Acceso seguro</p><h1 className="mt-3 font-display text-4xl font-medium text-forest">Crea una nueva contraseña</h1>{validRecovery && <form onSubmit={submit} className="mt-8 space-y-5"><div className="space-y-2"><Label htmlFor="password">Nueva contraseña</Label><Input id="password" type="password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 bg-card" /></div><div className="space-y-2"><Label htmlFor="confirm">Confirmar contraseña</Label><Input id="confirm" type="password" minLength={6} required value={confirm} onChange={(event) => setConfirm(event.target.value)} className="h-12 bg-card" /></div><Button size="lg" className="w-full">Guardar contraseña</Button></form>}{message && <p role="status" className="mt-6 rounded-md bg-mint px-4 py-3 text-sm text-forest">{message}</p>}<Button variant="link" asChild className="mt-4 px-0"><Link to="/login">Ir a iniciar sesión</Link></Button></div></main>;
}