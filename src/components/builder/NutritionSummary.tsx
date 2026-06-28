import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useBuilderStore, builderTotals } from "@/store/builderStore";
import { formatINR } from "@/lib/format";

function Stat({ label, value, color, emoji }: { label: string; value: string; color: string; emoji: string }) {
  return (
    <motion.div
      key={value}
      initial={{ scale: 0.92, opacity: 0.6 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className="flex flex-col gap-1 rounded-2xl border border-bordersoft bg-white p-3"
    >
      <div className="flex items-center gap-1.5 text-xs font-semibold text-textsecond">
        <span>{emoji}</span>
        <span>{label}</span>
      </div>
      <div className="font-mono text-2xl font-bold" style={{ color }}>{value}</div>
    </motion.div>
  );
}

export function NutritionSummary() {
  const selectedItems = useBuilderStore((s) => s.selectedItems);
  const removeItem = useBuilderStore((s) => s.removeItem);
  const clearAll = useBuilderStore((s) => s.clearAll);
  const maxItems = useBuilderStore((s) => s.maxItems);
  const totals = builderTotals(selectedItems);
  const proteinPct = Math.min(100, (totals.protein / 50) * 100);
  const caloriesPct = Math.min(100, (totals.calories / 500) * 100);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2.5">
        <Stat label="Price/mo" value={formatINR(totals.price * 30)} color="#EA580C" emoji="💰" />
        <Stat label="Protein/day" value={`${totals.protein.toFixed(1)}g`} color="#16A34A" emoji="💪" />
        <Stat label="Calories" value={`${Math.round(totals.calories)}`} color="#DC2626" emoji="🔥" />
        <Stat label="Items" value={`${totals.count}/${maxItems}`} color="#2563EB" emoji="📦" />
      </div>

      <div className="space-y-2.5">
        <div>
          <div className="mb-1 flex justify-between text-[11px] font-semibold text-textsecond">
            <span>Protein goal (50g/day)</span>
            <span>{Math.round(proteinPct)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface">
            <motion.div
              className="h-full bg-brand-green"
              animate={{ width: `${proteinPct}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[11px] font-semibold text-textsecond">
            <span>Calories (500 kcal target)</span>
            <span>{Math.round(caloriesPct)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface">
            <motion.div
              className="h-full bg-brand-orange"
              animate={{ width: `${caloriesPct}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-bordersoft bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-textprimary">Your selections</h3>
          {totals.count > 0 && (
            <button onClick={clearAll} className="text-[11px] font-semibold text-rose-500 hover:text-rose-600">
              Clear all
            </button>
          )}
        </div>
        {totals.count === 0 ? (
          <div className="flex flex-col items-center gap-1 py-6 text-center text-textsecond">
            <Sparkles className="h-5 w-5 opacity-50" />
            <p className="text-xs">Tap items to fill your box</p>
          </div>
        ) : (
          <ul className="space-y-1.5">
            <AnimatePresence initial={false}>
              {selectedItems.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2 rounded-lg bg-surface px-2 py-1.5"
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="flex-1 truncate text-xs font-semibold text-textprimary">{item.name}</span>
                  <span className="rounded-full bg-brand-greenlight px-1.5 py-0.5 text-[10px] font-bold text-brand-greendark">
                    {item.protein}g
                  </span>
                  <span className="font-mono text-[11px] font-bold text-brand-orange">₹{item.price}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded p-0.5 text-textsecond hover:bg-rose-50 hover:text-rose-500"
                    aria-label={`Remove ${item.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}