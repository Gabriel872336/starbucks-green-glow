import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/auth/AuthPage";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [
    { title: "Crear cuenta — Starbucks Perú" },
    { name: "description", content: "Crea tu cuenta para descubrir experiencias y colecciones exclusivas." },
    { property: "og:title", content: "Crear cuenta — Starbucks Perú" },
    { property: "og:description", content: "Crea tu cuenta para descubrir experiencias y colecciones exclusivas." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AuthPage mode="register" />,
});