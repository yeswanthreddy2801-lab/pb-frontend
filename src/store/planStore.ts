import { create } from "zustand";
import { api } from "@/lib/api";
import { SubscriptionPlan } from "@/types/food.types";

interface PlanStore {
  plans: SubscriptionPlan[];
  loading: boolean;
  fetchPlans: () => Promise<void>;
  createPlan: (data: Partial<SubscriptionPlan>) => Promise<void>;
  updatePlan: (id: string, data: Partial<SubscriptionPlan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
}

export const usePlanStore = create<PlanStore>((set, get) => ({
  plans: [],
  loading: false,

  fetchPlans: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/admin/plans");
      if (res.success && res.data) {
        // Map backend structure to frontend structure
        const mapped = res.data.map((b: any) => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
          description: b.description,
          category: b.category,
          basePrice: b.base_price,
          maxItems: b.max_items,
          color: b.color,
          emoji: b.icon || "📦",
          isActive: b.is_active,
        }));
        set({ plans: mapped });
      }
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      set({ loading: false });
    }
  },

  createPlan: async (data) => {
    try {
      const payload = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        category: data.category || data.slug, // fallback
        base_price: data.basePrice,
        max_items: data.maxItems,
        color: data.color,
        icon: data.emoji,
      };
      await api.post("/admin/plans", payload);
      get().fetchPlans();
    } catch (error) {
      console.error("Failed to create plan", error);
      throw error;
    }
  },

  updatePlan: async (id, data) => {
    try {
      const payload: any = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.slug !== undefined) payload.slug = data.slug;
      if (data.description !== undefined) payload.description = data.description;
      if (data.category !== undefined) payload.category = data.category;
      if (data.basePrice !== undefined) payload.base_price = data.basePrice;
      if (data.maxItems !== undefined) payload.max_items = data.maxItems;
      if (data.color !== undefined) payload.color = data.color;
      if (data.emoji !== undefined) payload.icon = data.emoji;
      
      await api.patch(`/admin/plans/${id}`, payload);
      get().fetchPlans();
    } catch (error) {
      console.error("Failed to update plan", error);
      throw error;
    }
  },

  deletePlan: async (id) => {
    try {
      await api.delete(`/admin/plans/${id}`);
      get().fetchPlans();
    } catch (error) {
      console.error("Failed to delete plan", error);
      throw error;
    }
  },
}));
