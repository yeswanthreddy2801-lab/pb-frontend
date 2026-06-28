import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "egg", label: "Egg" },
  { id: "dairy", label: "Dairy" },
  { id: "grain", label: "Grain" },
  { id: "legume", label: "Legume" },
  { id: "fruit", label: "Fruit" },
  { id: "nut", label: "Nut" },
  { id: "meat", label: "Meat" },
  { id: "supplement", label: "Supplement" },
];

interface Props {
  active: string;
  onChange: (id: string) => void;
}

export function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
            active === c.id
              ? "bg-brand-green text-white shadow"
              : "bg-surface text-textsecond hover:bg-brand-greenlight hover:text-brand-greendark",
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}