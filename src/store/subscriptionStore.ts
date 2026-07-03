import { create } from "zustand";
import { api } from "@/lib/api";
import type { SelectedFoodItem, SubscriptionPlan } from "@/types/food.types";

export type SubscriptionStatus = "pending" | "approved" | "active" | "expired" | "rejected";

export interface Subscription {
  id: string;
  userId: string;
  userMobile: string;
  userName: string;
  plan: SubscriptionPlan;
  items: SelectedFoodItem[];
  totalPrice: number;
  totalProtein: number;
  totalCalories: number;
  address: string;
  startDate: string;
  status: SubscriptionStatus;
  submittedAt: string;
  approvedAt?: string;
}

interface SubStore {
  subscriptions: Subscription[];
  loading: boolean;
  fetchSubscriptions: () => Promise<void>;
  create: (s: any) => Promise<Subscription>;
  approve: (id: string) => Promise<void>;
  reject: (id: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubStore>((set, get) => ({
  subscriptions: [],
  loading: false,

  fetchSubscriptions: async () => {
    set({ loading: true });
    try {
      const userStr = localStorage.getItem("proteinbox_user");
      const user = userStr ? JSON.parse(userStr) : null;
      const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || !!user?.isAdmin;

      let res;
      if (isAdmin) {
        res = await api.get("/admin/orders");
      } else {
        res = await api.get("/subscriptions/my");
      }
      
      if (res && res.data) {
        // Map backend structure to frontend structure
        const mapped = res.data.map((b: any) => ({
          id: b.id,
          userId: b.user_id,
          userMobile: b.users?.mobile,
          userName: b.users?.name,
          plan: { ...b.subscription_plans, emoji: b.subscription_plans?.icon || "📦" },
          items: b.subscription_items?.map((i: any) => ({ ...i.food_items, quantity: i.quantity })) || [],
          totalPrice: b.total_price,
          totalProtein: b.total_protein || 0,
          totalCalories: b.total_calories || 0,
          address: b.addresses?.street_address || "Unknown Address",
          startDate: b.start_date,
          status: b.status,
          submittedAt: b.created_at,
          approvedAt: b.approved_at,
        }));
        set({ subscriptions: mapped });
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions", error);
    } finally {
      set({ loading: false });
    }
  },

  create: async (s) => {
    try {
      // 1. We must have an address_id for the backend. 
      // If the frontend only collects a string, we need to create it first.
      let addressId = "";
      try {
        const addressRes = await api.post("/users/me/addresses", {
          address: s.address,
          city: "Not specified",
          state: "Not specified",
          pincode: "000000",
          is_default: true
        });
        addressId = addressRes.data.id;
      } catch (e) {
        console.warn("Failed to create address, using fallback if possible", e);
      }

      // 2. The mock plans might not have a UUID. Let's send a fake one if needed, 
      // but ideally we should fetch plans from backend.
      // We will send the plan_id from the selected plan.
      const payload = {
        // If it's a mock plan ID like 'p1', the backend will reject it because of UUID validation.
        // We'll pass it as is and if validation fails, the user will see it.
        plan_id: s.plan.id,
        address_id: addressId,
        duration_days: 30,
        items: s.items.map((i: any) => ({
          food_item_id: i.id,
          quantity: i.quantity || 1
        }))
      };

      const res = await api.post("/subscriptions", payload);
      if (res.success) {
        // Refresh the list
        get().fetchSubscriptions();
        return res.data;
      }
      throw new Error("Failed to create subscription");
    } catch (error: any) {
      console.error("Create subscription error:", error);
      throw error;
    }
  },

  approve: async (id) => {
    try {
      await api.patch(`/admin/orders/${id}/approve`);
      get().fetchSubscriptions();
    } catch (error) {
      console.error("Failed to approve", error);
      throw error;
    }
  },

  reject: async (id) => {
    try {
      await api.patch(`/admin/orders/${id}/reject`, { reason: "Rejected by admin" });
      get().fetchSubscriptions();
    } catch (error) {
      console.error("Failed to reject", error);
      throw error;
    }
  },
}));