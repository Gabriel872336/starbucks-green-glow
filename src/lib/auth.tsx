import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Prototype-only client-side session (no real backend auth).
export type AuthUser = { name: string; email: string; phone?: string; address?: string };
type AuthState = {
  user: AuthUser | null;
  ready: boolean;
  login: (u: AuthUser) => void;
  logout: () => void;
  update: (patch: Partial<AuthUser>) => void;
};

const AuthContext = createContext<AuthState | null>(null);
const KEY = "sbx-demo-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setUser(JSON.parse(raw)); } catch { /* ignore */ }
    setReady(true);
  }, []);
  const save = (u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  };
  const login = (u: AuthUser) => save(u);
  const logout = () => save(null);
  const update = (patch: Partial<AuthUser>) => { if (user) save({ ...user, ...patch }); };
  return <AuthContext.Provider value={{ user, ready, login, logout, update }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("");
}
