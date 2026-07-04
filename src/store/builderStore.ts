import { create } from "zustand";
import type { FlyingItem, FoodItem, SelectedFoodItem, SubscriptionPlan } from "@/types/food.types";

interface BuilderState {
  selectedItems: SelectedFoodItem[];
  flyingItems: FlyingItem[];
  maxItems: number;
  addItem: (item: FoodItem) => boolean;
  removeItem: (id: string) => void;
  clearAll: () => void;
  addFlying: (f: FlyingItem) => void;
  removeFlying: (id: string) => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  selectedItems: [],
  flyingItems: [],
  maxItems: 6,
  addItem: (item) => {
    const { selectedItems, maxItems } = get();
    if (selectedItems.find((s) => s.id === item.id)) return false;
    if (selectedItems.length >= maxItems) return false;
    set({ selectedItems: [...selectedItems, { ...item, quantity: 1 }] });
    return true;
  },
  removeItem: (id) => set({ selectedItems: get().selectedItems.filter((s) => s.id !== id) }),
  clearAll: () => set({ selectedItems: [] }),
  addFlying: (f) => set({ flyingItems: [...get().flyingItems, f] }),
  removeFlying: (id) => set({ flyingItems: get().flyingItems.filter((f) => f.id !== id) }),
}));

export const builderTotals = (items: SelectedFoodItem[]) => ({
  price: items.reduce((s, i) => s + i.price * i.quantity, 0),
  protein: items.reduce((s, i) => s + i.protein * i.quantity, 0),
  calories: items.reduce((s, i) => s + i.calories * i.quantity, 0),
  count: items.length,
});