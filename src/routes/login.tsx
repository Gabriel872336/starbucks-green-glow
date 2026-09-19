import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/auth/AuthPage";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Iniciar sesión — Starbucks Perú" },
    { name: "description", content: "Accede a tu cuenta y continúa tu experiencia Starbucks Perú." },
    { property: "og:title", content: "Iniciar sesión — Starbucks Perú" },
    { property: "og:description", content: "Accede a tu cuenta y continúa tu experiencia Starbucks Perú." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AuthPage mode="login" />,
});