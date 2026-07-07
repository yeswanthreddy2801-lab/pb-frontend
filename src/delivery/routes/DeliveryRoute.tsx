import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDeliveryAuth } from '../hooks/useDeliveryAuth';

export const DeliveryRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useDeliveryAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/delivery/login" state={{ from: location.pathname + location.search }} replace />;
  }

  return <>{children}</>;
};
