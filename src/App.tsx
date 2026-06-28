import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { ReactNode } from "react";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UserDashboard from "@/pages/UserDashboard";
import SubscriptionBuilder from "@/pages/SubscriptionBuilder";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboard from "@/pages/AdminDashboard";

function Protected({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const loc = useLocation();
  if (!isAuthenticated) return <Navigate to={admin ? "/admin/login" : "/login"} replace state={{ from: loc.pathname }} />;
  if (admin && !isAdmin) return <Navigate to="/dashboard" replace />;
  if (!admin && isAdmin) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface text-center">
      <div>
        <p className="text-6xl">🥗</p>
        <h1 className="mt-4 font-display text-3xl font-bold">Page not found</h1>
        <a href="/" className="mt-3 inline-block text-brand-green underline">Back home</a>
      </div>
    </div>
  );
}

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route path="/dashboard" element={<Protected><UserDashboard /></Protected>} />
        <Route path="/subscription/build" element={<Protected><SubscriptionBuilder /></Protected>} />

        <Route path="/admin" element={<Protected admin><AdminDashboard /></Protected>} />
        <Route path="/admin/orders" element={<Protected admin><AdminDashboard /></Protected>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;