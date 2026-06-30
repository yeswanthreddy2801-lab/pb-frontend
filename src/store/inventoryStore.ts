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
      const res = await api.post("/admin/inventory", itemData);
      if (res.success && res.data) {
        set({ items: [res.data, ...get().items] });
      }
    } catch (error) {
      console.error("Failed to add item", error);
      throw error;
    }
  },
  
  updateItem: async (id, itemData) => {
    try {
      const res = await api.patch(`/admin/inventory/${id}`, itemData);
      if (res.success && res.data) {
        const list = get().items.map(item => 
          item.id === id ? { ...item, ...res.data } : item
        );
        set({ items: list });
      }
    } catch (error) {
      console.error("Failed to update item", error);
      throw error;
    }
  },
  
  deleteItem: async (id) => {
    try {
      await api.delete(`/admin/inventory/${id}`);
      const list = get().items.filter(item => item.id !== id);
      set({ items: list });
    } catch (error) {
      console.error("Failed to delete item", error);
      throw error;
    }
  }
}));
