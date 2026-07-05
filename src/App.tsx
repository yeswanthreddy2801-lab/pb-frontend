import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { ReactNode } from "react";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import UserDashboard from "@/pages/UserDashboard";
import SubscriptionBuilder from "@/pages/SubscriptionBuilder";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminInventory from "@/pages/AdminInventory";
import AdminPlans from "@/pages/AdminPlans";
import AdminDelivery from "@/pages/AdminDelivery";
import { DeliveryRoute } from "@/delivery/routes/DeliveryRoute";
import DeliveryLoginPage from "@/delivery/pages/DeliveryLoginPage";
import DeliveryDashboard from "@/delivery/pages/DeliveryDashboard";
import PendingDeliveries from "@/delivery/pages/PendingDeliveries";
import CompletedDeliveries from "@/delivery/pages/CompletedDeliveries";
import DeliveryDetailsPage from "@/delivery/pages/DeliveryDetailsPage";

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

function RootRoute() {
  const { isAuthenticated, isAdmin } = useAuth();
  const loc = useLocation();
  const searchParams = new URLSearchParams(loc.search);
  
  // Allow explicitly viewing the home page if ?view=home is in the URL
  if (searchParams.get("view") === "home") {
    return <LandingPage />;
  }
  
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  }
  
  return <LandingPage />;
}

export function App() {
  const { isAuthenticated, isAdmin } = useAuth();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace /> : <LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route path="/dashboard" element={<Protected><UserDashboard /></Protected>} />
        <Route path="/subscription/build" element={<Protected><SubscriptionBuilder /></Protected>} />

        <Route path="/admin" element={<Protected admin><AdminDashboard /></Protected>} />
        <Route path="/admin/orders" element={<Protected admin><AdminDashboard /></Protected>} />
        <Route path="/admin/inventory" element={<Protected admin><AdminInventory /></Protected>} />
        <Route path="/admin/plans" element={<Protected admin><AdminPlans /></Protected>} />
        <Route path="/admin/delivery" element={<Protected admin><AdminDelivery /></Protected>} />

        <Route path="/delivery/login" element={<DeliveryLoginPage />} />
        <Route path="/delivery/dashboard" element={<DeliveryRoute><DeliveryDashboard /></DeliveryRoute>} />
        <Route path="/delivery/pending" element={<DeliveryRoute><PendingDeliveries /></DeliveryRoute>} />
        <Route path="/delivery/completed" element={<DeliveryRoute><CompletedDeliveries /></DeliveryRoute>} />
        <Route path="/delivery/details/:id" element={<DeliveryRoute><DeliveryDetailsPage /></DeliveryRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default App;