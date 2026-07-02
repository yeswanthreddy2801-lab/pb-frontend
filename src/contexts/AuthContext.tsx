import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types/user.types";
import { api } from "@/lib/api";

const STORAGE_TOKEN_KEY = "proteinbox_token";
const STORAGE_USER_KEY = "proteinbox_user";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginUser: (mobile: string) => Promise<User>;
  registerUser: (data: Omit<User, "id" | "createdAt" | "isAdmin">) => Promise<User>;
  loginAdmin: (mobile: string, password: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(STORAGE_TOKEN_KEY);
      if (token) {
        try {
          // Load cached user immediately to avoid flicker
          const cached = localStorage.getItem(STORAGE_USER_KEY);
          if (cached) setUser(JSON.parse(cached));
          
          // Verify with backend
          const res = await api.get("/auth/me");
          if (res.success && res.data) {
            persistUser(res.data);
          }
        } catch (error) {
          console.error("Auth verification failed", error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const persistUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    }
  };

  const loginUser = async (mobile: string): Promise<User> => {
    const res = await api.post("/auth/login", { mobile });
    if (res.success && res.data) {
      localStorage.setItem(STORAGE_TOKEN_KEY, res.data.token);
      persistUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.message || "Login failed");
  };

  const registerUser = async (data: Omit<User, "id" | "createdAt" | "isAdmin">): Promise<User> => {
    // Note: Registration might be merged with updateProfile in this backend flow, 
    // but keeping it for context compat.
    const res = await api.patch("/users/me", data);
    if (res.success && res.data) {
      persistUser(res.data);
      return res.data;
    }
    throw new Error("Registration failed");
  };

  const loginAdmin = async (mobile: string, passwordPlain: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/admin/login", { mobile, password: passwordPlain });
      if (res.success && res.data) {
        localStorage.setItem(STORAGE_TOKEN_KEY, res.data.token);
        persistUser(res.data.admin);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const res = await api.patch("/users/me", data);
    if (res.success && res.data) {
      persistUser(res.data);
    }
  };

  const logout = () => {
    api.post("/auth/logout").catch(() => {});
    persistUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin || (user as any)?.role === 'admin' || (user as any)?.role === 'superadmin',
        loginUser,
        registerUser,
        loginAdmin,
        updateProfile,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}