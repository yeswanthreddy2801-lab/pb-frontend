import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { FoodItem } from "@/types/food.types";
import { cn } from "@/lib/utils";

interface Props {
  item: FoodItem;
  selected: boolean;
  onClick: (item: FoodItem, rect: DOMRect) => void;
}

export function FoodItemCard({ item, selected, onClick }: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      onClick={(e) => onClick(item, e.currentTarget.getBoundingClientRect())}
      style={{ background: item.color }}
      className={cn(
        "relative flex h-[110px] w-full flex-col items-center justify-between rounded-2xl border-2 p-2 text-center shadow-sm transition-shadow hover:shadow-lg",
        selected ? "border-brand-green ring-2 ring-brand-green/30" : "border-transparent",
      )}
      aria-pressed={selected}
    >
      {selected && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-white shadow">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
      <span className="text-3xl leading-none" aria-hidden>{item.emoji}</span>
      <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-textprimary">
        {item.name}
      </span>
      <div className="flex w-full items-center justify-between text-[10px] font-bold">
        <span className="text-brand-greendark">💪 {item.protein}g</span>
        <span className="text-brand-orange">₹{item.price}</span>
      </div>
    </motion.button>
  );
}