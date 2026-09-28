import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Prototype-only client-side session (no real backend auth).
export type AuthUser = { name: string; email: string };
type AuthState = { user: AuthUser | null; login: (u: AuthUser) => void; logout: () => void };

const AuthContext = createContext<AuthState | null>(null);
const KEY = "sbx-demo-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setUser(JSON.parse(raw)); } catch { /* ignore */ }
  }, []);
  const login = (u: AuthUser) => { setUser(u); localStorage.setItem(KEY, JSON.stringify(u)); };
  const logout = () => { setUser(null); localStorage.removeItem(KEY); };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");
}
