import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { AuthField, AuthForm, AuthLayout } from "@/components/auth-layout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Restablecer contraseña — Starbucks Perú" },
    { name: "description", content: "Crea una nueva contraseña para tu cuenta Starbucks Perú." },
    { property: "og:title", content: "Restablecer contraseña — Starbucks Perú" },
    { property: "og:description", content: "Recupera el acceso a tu cuenta de forma segura." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [recovery, setRecovery] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => { setRecovery(new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery"); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (password !== confirm) return setMessage("Las contraseñas deben coincidir."); const { error } = await supabase.auth.updateUser({ password }); setMessage(error ? "No pudimos actualizar la contraseña. Solicita un nuevo enlace." : "Contraseña actualizada. Ya puedes iniciar sesión."); }
  return <AuthLayout eyebrow="Recuperación segura" title="Nueva contraseña" description="Elige una contraseña segura para volver a disfrutar tus beneficios.">{recovery ? <AuthForm onSubmit={submit}><AuthField label="Nueva contraseña" name="password" type="password" autoComplete="new-password" value={password} onChange={setPassword}/><AuthField label="Confirmar contraseña" name="confirm" type="password" autoComplete="new-password" value={confirm} onChange={setConfirm}/><Button type="submit" size="lg" className="w-full">Actualizar contraseña</Button>{message && <p role="status" className="rounded-lg bg-secondary px-4 py-3 text-sm text-secondary-foreground">{message}</p>}</AuthForm> : <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-secondary-foreground">Abre el enlace enviado a tu correo para continuar. <Link to="/login" className="font-bold underline">Volver al inicio de sesión</Link></p>}</AuthLayout>;
}