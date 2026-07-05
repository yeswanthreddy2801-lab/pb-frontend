import { create } from "zustand";
import { api } from "@/lib/api";
import type { FoodItem } from "@/types/food.types";

interface InventoryState {
  items: FoodItem[];
  loading: boolean;
  fetchItems: () => Promise<void>;
  addItem: (item: Omit<FoodItem, "id">) => Promise<void>;
  updateItem: (id: string, item: Partial<FoodItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  loading: false,

  fetchItems: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/food-items");
      if (res.success) {
        set({ items: res.data });
      }
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    } finally {
      set({ loading: false });
    }
  },
  
  addItem: async (itemData) => {
    try {
      const payload: any = { ...itemData };
      if (itemData.planType !== undefined) payload.plan_type = itemData.planType;
      if (itemData.protein !== undefined) payload.protein_g = itemData.protein;
      if (itemData.isActive !== undefined) payload.is_active = itemData.isActive;
      if (itemData.isAvailable !== undefined) payload.is_available = itemData.isAvailable;
      if ((itemData as any).imageUrl !== undefined) payload.image_url = (itemData as any).imageUrl;
      if ((itemData as any).sortOrder !== undefined) payload.sort_order = (itemData as any).sortOrder;
      
      delete payload.planType;
      delete payload.protein;
      delete payload.isActive;
      delete payload.isAvailable;
      delete payload.imageUrl;
      delete payload.sortOrder;
      delete payload.id;

      const res = await api.post("/admin/inventory", payload);
      if (res.success) {
        await get().fetchItems();
      }
    } catch (error) {
      console.error("Failed to add item", error);
      throw error;
    }
  },
  
  updateItem: async (id, itemData) => {
    try {
      const payload: any = { ...itemData };
      if (itemData.planType !== undefined) payload.plan_type = itemData.planType;
      if (itemData.protein !== undefined) payload.protein_g = itemData.protein;
      if (itemData.isActive !== undefined) payload.is_active = itemData.isActive;
      if (itemData.isAvailable !== undefined) payload.is_available = itemData.isAvailable;
      if ((itemData as any).imageUrl !== undefined) payload.image_url = (itemData as any).imageUrl;
      if ((itemData as any).sortOrder !== undefined) payload.sort_order = (itemData as any).sortOrder;
      
      delete payload.planType;
      delete payload.protein;
      delete payload.isActive;
      delete payload.isAvailable;
      delete payload.imageUrl;
      delete payload.sortOrder;
      delete payload.id;

      const res = await api.patch(`/admin/inventory/${id}`, payload);
      if (res.success) {
        await get().fetchItems();
      }
    } catch (error) {
      console.error("Failed to update item", error);
      throw error;
    }
  },
  
  deleteItem: async (id) => {
    try {
      await api.delete(`/admin/inventory/${id}`);
      await get().fetchItems();
    } catch (error) {
      console.error("Failed to delete item", error);
      throw error;
    }
  }
}));
