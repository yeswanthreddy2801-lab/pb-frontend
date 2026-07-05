import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthDeliveryBoy } from '../types/delivery.types';
import { deliveryApi } from '../api/delivery.api';
import { toast } from 'sonner';

interface DeliveryAuthContextType {
  deliveryBoy: AuthDeliveryBoy | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (mobile: string, passwordPlain: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const DeliveryAuthContext = createContext<DeliveryAuthContextType | undefined>(undefined);

export const DeliveryAuthProvider = ({ children }: { children: ReactNode }) => {
  const [deliveryBoy, setDeliveryBoy] = useState<AuthDeliveryBoy | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('delivery_token');
    const storedUser = localStorage.getItem('delivery_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setDeliveryBoy(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('delivery_token');
        localStorage.removeItem('delivery_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (mobile: string, passwordPlain: string) => {
    try {
      const data = await deliveryApi.login(mobile, passwordPlain);
      const authToken = data.data.token;
      const user = data.data.deliveryBoy;
      
      setToken(authToken);
      setDeliveryBoy(user);
      localStorage.setItem('delivery_token', authToken);
      localStorage.setItem('delivery_user', JSON.stringify(user));
      
      toast.success('Logged in successfully!');
    } catch (error: any) {
      console.error('Delivery login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setDeliveryBoy(null);
    localStorage.removeItem('delivery_token');
    localStorage.removeItem('delivery_user');
    toast.info('Logged out successfully');
  };

  return (
    <DeliveryAuthContext.Provider
      value={{
        deliveryBoy,
        isAuthenticated: !!token,
        token,
        login,
        logout,
        isLoading
      }}
    >
      {children}
    </DeliveryAuthContext.Provider>
  );
};

export const useDeliveryAuth = () => {
  const context = useContext(DeliveryAuthContext);
  if (context === undefined) {
    throw new Error('useDeliveryAuth must be used within a DeliveryAuthProvider');
  }
  return context;
};
