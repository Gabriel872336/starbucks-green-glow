import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import authImage from "@/assets/golden-machu-coffee-maker.jpg";

export function AuthLayout({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-forest lg:block">
        <img src={authImage} alt="Cafetera dorada con diseños inspirados en Machu Picchu" width={1280} height={1600} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-forest/90 to-transparent px-12 pb-12 pt-40 text-primary-foreground">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Colección Reserva</p>
          <p className="mt-3 max-w-lg font-display text-4xl leading-tight">Una pieza extraordinaria para una experiencia inolvidable.</p>
        </div>
      </section>
      <section className="flex min-h-screen flex-col px-6 py-7 sm:px-12 lg:px-16 xl:px-24">
        <Link to="/" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-forest transition-colors hover:text-primary"><ArrowLeft className="size-4" /> Volver a la tienda</Link>
        <div className="my-auto w-full max-w-md py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-medium text-forest sm:text-5xl">{title}</h1>
          <p className="mt-4 leading-7 text-muted-foreground">{description}</p>
          <div className="mt-9">{children}</div>
        </div>
        <p className="text-xs text-muted-foreground">Starbucks Perú · Experiencias exclusivas</p>
      </section>
    </main>
  );
}

export function AuthField({ label, name, type = "text", autoComplete, value, onChange }: { label: string; name: string; type?: string; autoComplete?: string; value: string; onChange: (value: string) => void }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  return <label className="grid gap-2 text-sm font-semibold text-forest"><span>{label}</span><span className="relative"><input name={name} type={isPassword && visible ? "text" : type} autoComplete={autoComplete} required value={value} onChange={(event) => onChange(event.target.value)} className="h-12 w-full rounded-lg border border-input bg-card px-4 pr-11 font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />{isPassword && <Button type="button" variant="ghost" size="icon" aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setVisible((current) => !current)} className="absolute right-1 top-1/2 -translate-y-1/2">{visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</Button>}</span></label>;
}

export function AuthForm({ children, onSubmit }: { children: ReactNode; onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void> }) {
  return <form onSubmit={onSubmit} className="grid gap-5">{children}</form>;
}

export function useHomeNavigate() {
  return useNavigate({ from: "/" });
}