import { forwardRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useBuilderStore, builderTotals } from "@/store/builderStore";
import { formatINR } from "@/lib/format";

export const LunchBoxCanvas = forwardRef<HTMLDivElement>((_props, ref) => {
  const selectedItems = useBuilderStore((s) => s.selectedItems);
  const removeItem = useBuilderStore((s) => s.removeItem);
  const maxItems = useBuilderStore((s) => s.maxItems);
  const totals = builderTotals(selectedItems);
  const [bounce, setBounce] = useState(0);

  useEffect(() => {
    setBounce((b) => b + 1);
  }, [selectedItems.length]);

  const slots = Array.from({ length: maxItems });

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        ref={ref}
        key={bounce}
        animate={{ scale: [1, 1.05, 0.97, 1.02, 1] }}
        transition={{ duration: 0.5 }}
        className="relative w-[260px] rounded-3xl border-4 border-slate-300 bg-white shadow-2xl"
      >
        <div className="flex h-[50px] items-center justify-center rounded-t-2xl bg-gradient-to-r from-brand-green to-emerald-600 font-display font-bold text-white">
          ProteinBox 🥗
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-3">
          {slots.map((_, i) => {
            const item = selectedItems[i];
            return (
              <div
                key={i}
                className="group relative flex aspect-square items-center justify-center rounded-lg border border-dashed border-slate-200"
                style={{ background: item?.color ?? "#F8FAFC" }}
              >
                <AnimatePresence mode="wait">
                  {item ? (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0, opacity: 0, rotate: -45 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      className="flex flex-col items-center justify-center px-1"
                    >
                      <span className="text-2xl leading-none">{item.emoji}</span>
                      <span className="mt-0.5 line-clamp-1 text-[9px] font-semibold text-textprimary">
                        {item.name.split(" ")[0]}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white shadow lg:hidden lg:group-hover:flex"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </motion.div>
                  ) : (
                    <Plus className="h-5 w-5 text-slate-300" />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="flex h-9 items-center justify-around rounded-b-2xl bg-brand-greenlight font-mono text-[11px] font-semibold text-brand-greendark">
          <span>📦 {totals.count}/{maxItems}</span>
          <span>💪 {totals.protein.toFixed(0)}g</span>
          <span>{formatINR(totals.price)}</span>
        </div>
      </motion.div>
      <p className="text-center text-xs text-textsecond">
        Tap any food item — watch it fly into your box ✨
      </p>
    </div>
  );
});
LunchBoxCanvas.displayName = "LunchBoxCanvas";