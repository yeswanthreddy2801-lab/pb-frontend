import { useMemo, useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { useInventoryStore } from "@/store/inventoryStore";
import { useBuilderStore } from "@/store/builderStore";
import type { FoodItem, PlanType } from "@/types/food.types";
import { CategoryFilter } from "./CategoryFilter";
import { FoodItemCard } from "./FoodItemCard";
import { LunchBoxCanvas } from "./LunchBoxCanvas";
import { NutritionSummary } from "./NutritionSummary";
import { FlyingItemAnimation } from "./FlyingItemAnimation";

interface Props {
  planType?: PlanType;
}

export function ContainerBuilder({ planType = "veg" }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState("all");
  const selectedItems = useBuilderStore((s) => s.selectedItems);
  const addItem = useBuilderStore((s) => s.addItem);
  const addFlying = useBuilderStore((s) => s.addFlying);
  const inventoryItems = useInventoryStore((s) => s.items);
  const fetchInventory = useInventoryStore((s) => s.fetchItems);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const items = useMemo(() => {
    return inventoryItems.filter((it) => {
      if (!it.isActive || !it.isAvailable) return false;
      if (planType === "veg" && it.planType === "nonveg") return false;
      if (planType === "nonveg") { /* allow both veg + nonveg */ }
      if (category !== "all" && it.category !== category) return false;
      return true;
    });
  }, [category, planType, inventoryItems]);

  const handleAdd = (item: FoodItem, fromRect: DOMRect) => {
    if (selectedItems.find((s) => s.id === item.id)) {
      toast.info(`${item.name} is already in your box`);
      return;
    }
    if (selectedItems.length >= 6) {
      toast.error("Box is full! Remove an item to add another.");
      return;
    }
    const boxRect = boxRef.current?.getBoundingClientRect();
    if (boxRect) {
      addFlying({
        id: `${item.id}-${Date.now()}-${Math.random()}`,
        emoji: item.emoji,
        fromX: fromRect.left + fromRect.width / 2 - 24,
        fromY: fromRect.top + fromRect.height / 2 - 24,
        toX: boxRect.left + boxRect.width / 2 - 24,
        toY: boxRect.top + boxRect.height / 2 - 24,
      });
    }
    setTimeout(() => {
      const ok = addItem(item);
      if (ok) toast.success(`${item.emoji} ${item.name} added`);
    }, 320);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1.1fr)]">
      {/* LEFT — grid */}
      <div className="space-y-3">
        <CategoryFilter active={category} onChange={setCategory} />
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <FoodItemCard
              key={item.id}
              item={item}
              selected={!!selectedItems.find((s) => s.id === item.id)}
              onClick={handleAdd}
            />
          ))}
        </div>
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-bordersoft p-6 text-center text-sm text-textsecond">
            No items in this category 🥗
          </div>
        )}
      </div>

      {/* CENTER — box */}
      <div className="flex items-start justify-center lg:sticky lg:top-24 lg:self-start">
        <LunchBoxCanvas ref={boxRef} />
      </div>

      {/* RIGHT — summary */}
      <div>
        <NutritionSummary />
      </div>

      <FlyingItemAnimation />
    </div>
  );
}