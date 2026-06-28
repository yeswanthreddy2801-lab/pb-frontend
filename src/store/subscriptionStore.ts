import { create } from "zustand";
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

const KEY = "proteinbox_subscriptions";

function load(): Subscription[] {
  if (typeof localStorage === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function save(list: Subscription[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

interface SubStore {
  subscriptions: Subscription[];
  create: (s: Omit<Subscription, "id" | "status" | "submittedAt">) => Subscription;
  approve: (id: string) => void;
  reject: (id: string) => void;
  refresh: () => void;
}

export const useSubscriptionStore = create<SubStore>((set, get) => ({
  subscriptions: load(),
  refresh: () => set({ subscriptions: load() }),
  create: (s) => {
    const sub: Subscription = {
      ...s,
      id: crypto.randomUUID(),
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    const list = [sub, ...get().subscriptions];
    save(list);
    set({ subscriptions: list });
    return sub;
  },
  approve: (id) => {
    const list = get().subscriptions.map((s) =>
      s.id === id ? { ...s, status: "active" as SubscriptionStatus, approvedAt: new Date().toISOString() } : s,
    );
    save(list); set({ subscriptions: list });
  },
  reject: (id) => {
    const list = get().subscriptions.map((s) =>
      s.id === id ? { ...s, status: "rejected" as SubscriptionStatus } : s,
    );
    save(list); set({ subscriptions: list });
  },
}));