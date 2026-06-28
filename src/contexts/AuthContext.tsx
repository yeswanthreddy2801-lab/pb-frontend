import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types/user.types";

const ADMIN_MOBILE = "9999999999";
const ADMIN_PASSWORD = "admin123";
const STORAGE_KEY = "proteinbox_user";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginUser: (mobile: string) => User;
  registerUser: (data: Omit<User, "id" | "createdAt" | "isAdmin">) => User;
  loginAdmin: (mobile: string, password: string) => boolean;
  updateProfile: (data: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const loginUser = (mobile: string): User => {
    const existingRaw = localStorage.getItem(`proteinbox_user_${mobile}`);
    if (existingRaw) {
      const existing = JSON.parse(existingRaw) as User;
      persist(existing);
      return existing;
    }
    const fresh: User = {
      id: crypto.randomUUID(),
      mobile,
      name: "",
      createdAt: new Date().toISOString(),
    };
    persist(fresh);
    return fresh;
  };

  const registerUser = (data: Omit<User, "id" | "createdAt" | "isAdmin">): User => {
    const u: User = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...data };
    localStorage.setItem(`proteinbox_user_${u.mobile}`, JSON.stringify(u));
    persist(u);
    return u;
  };

  const loginAdmin = (mobile: string, password: string): boolean => {
    if (mobile === ADMIN_MOBILE && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: "admin",
        mobile,
        name: "Admin",
        isAdmin: true,
        createdAt: new Date().toISOString(),
      };
      persist(adminUser);
      return true;
    }
    return false;
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...data };
    localStorage.setItem(`proteinbox_user_${merged.mobile}`, JSON.stringify(merged));
    persist(merged);
  };

  const logout = () => persist(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin,
        loginUser,
        registerUser,
        loginAdmin,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const ADMIN_CREDENTIALS = { mobile: ADMIN_MOBILE, password: ADMIN_PASSWORD };