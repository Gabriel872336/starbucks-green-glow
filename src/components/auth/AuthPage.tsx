import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import authImage from "@/assets/auth-golden-coffee-maker.jpg";

type AuthPageProps = { mode: "login" | "register" };

function GoogleMark() {
  return <span aria-hidden="true" className="text-base font-bold text-foreground">G</span>;
}

export function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function ensureProfile(userId: string, fullName: string) {
    if (!fullName.trim()) return;
    await supabase.from("profiles").upsert({ id: userId, full_name: fullName.trim() });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    if (isRegister && password !== confirmPassword) {
      setIsError(true);
      setMessage("Las contraseñas no coinciden.");
      return;
    }
    setBusy(true);
    if (isRegister) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin, data: { full_name: name.trim() } },
      });
      if (error) {
        setIsError(true);
        setMessage(error.message);
      } else if (data.session && data.user) {
        await ensureProfile(data.user.id, name);
        await navigate({ to: "/" });
      } else {
        setMessage("Revisa tu correo para confirmar tu cuenta y luego inicia sesión.");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setIsError(true);
        setMessage("No pudimos iniciar sesión. Revisa tus datos e inténtalo nuevamente.");
      } else {
        const savedName = typeof data.user.user_metadata.full_name === "string" ? data.user.user_metadata.full_name : "";
        await ensureProfile(data.user.id, savedName);
        await navigate({ to: "/" });
      }
    }
    setBusy(false);
  }

  async function handleGoogle() {
    setBusy(true);
    setMessage("");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setIsError(true);
      setMessage("No pudimos conectar tu cuenta de Google.");
      setBusy(false);
      return;
    }
    if (!result.redirected) await navigate({ to: "/" });
  }

  return (
    <main className="grid min-h-screen bg-card text-foreground lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-forest lg:block">
        <img src={authImage} alt="Cafetera dorada con diseños inspirados en Machu Picchu" width={1024} height={1536} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest/90 to-transparent px-12 pb-12 pt-32 text-primary-foreground">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Colección Reserva</p>
          <p className="mt-3 max-w-md font-display text-3xl leading-tight">Una experiencia extraordinaria comienza con cada detalle.</p>
        </div>
      </section>
      <section className="flex min-h-screen items-center justify-center bg-background px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <Button variant="ghost" size="sm" asChild className="mb-10 -ml-3">
            <Link to="/"><ArrowLeft /> Volver a la tienda</Link>
          </Button>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Starbucks Perú</p>
          <h1 className="mt-3 font-display text-4xl font-medium text-forest sm:text-5xl">{isRegister ? "Crea tu cuenta" : "Bienvenido de nuevo"}</h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{isRegister ? "Regístrate para acceder a experiencias y colecciones exclusivas." : "Ingresa para continuar tu experiencia y revisar tus favoritos."}</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {isRegister && <div className="space-y-2"><Label htmlFor="name">Nombre</Label><Input id="name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} autoComplete="name" className="h-12 bg-card" /></div>}
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" className="h-12 bg-card" /></div>
            <div className="space-y-2"><Label htmlFor="password">Contraseña</Label><div className="relative"><Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} autoComplete={isRegister ? "new-password" : "current-password"} className="h-12 bg-card pr-12" /><Button type="button" variant="ghost" size="icon" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setShowPassword((value) => !value)} className="absolute right-1.5 top-1.5">{showPassword ? <EyeOff /> : <Eye />}</Button></div></div>
            {isRegister && <div className="space-y-2"><Label htmlFor="confirm-password">Confirmar contraseña</Label><Input id="confirm-password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={6} autoComplete="new-password" className="h-12 bg-card" /></div>}
            {!isRegister && <div className="text-right"><Link to="/forgot-password" className="text-sm font-semibold text-primary hover:underline">Olvidé mi contraseña</Link></div>}
            {message && <p role="status" className={`rounded-md px-4 py-3 text-sm ${isError ? "bg-destructive/10 text-destructive" : "bg-mint text-forest"}`}>{message}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? "Procesando…" : isRegister ? "Crear Cuenta" : "Iniciar Sesión"}</Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs uppercase text-muted-foreground"><span className="h-px flex-1 bg-border" />o continúa con<span className="h-px flex-1 bg-border" /></div>
          <Button type="button" variant="outline" size="lg" className="w-full" onClick={handleGoogle} disabled={busy}><GoogleMark /> Google</Button>
          <p className="mt-8 text-center text-sm text-muted-foreground">{isRegister ? "¿Ya tienes una cuenta?" : "¿Aún no tienes una cuenta?"} <Link to={isRegister ? "/login" : "/register"} className="font-bold text-primary hover:underline">{isRegister ? "Inicia sesión" : "Regístrate"}</Link></p>
        </div>
      </section>
    </main>
  );
}