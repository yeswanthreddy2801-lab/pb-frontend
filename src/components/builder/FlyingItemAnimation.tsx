import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useBuilderStore } from "@/store/builderStore";

export function FlyingItemAnimation() {
  const flyingItems = useBuilderStore((s) => s.flyingItems);
  const removeFlying = useBuilderStore((s) => s.removeFlying);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {flyingItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{ x: item.fromX, y: item.fromY, scale: 1, opacity: 1, rotate: 0 }}
          animate={{
            x: item.toX,
            y: item.toY,
            scale: 0.25,
            opacity: 0,
            rotate: 360,
          }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => removeFlying(item.id)}
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 9999,
            pointerEvents: "none",
            filter: "drop-shadow(0 8px 16px rgba(22,163,74,0.35))",
          }}
          className="text-5xl"
        >
          {item.emoji}
        </motion.div>
      ))}
    </AnimatePresence>,
    document.body,
  );
}