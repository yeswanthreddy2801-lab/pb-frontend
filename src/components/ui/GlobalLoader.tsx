import { motion } from "framer-motion";

export function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-brand-greendark flex items-center justify-center">
      {/* Cinematic slowly zooming background image */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.15 }}
        transition={{ duration: 6, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-[url('/loading-bg.png')] bg-cover bg-center bg-no-repeat"
      />

      {/* Dark gradient overlay for contrast */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60" />

      {/* Center Giant Pulse */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.2 }}
        className="relative z-10 flex flex-col items-center rounded-3xl bg-black/30 p-12 backdrop-blur-md border border-white/10 shadow-2xl"
      >
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-center"
        >
          <h1 className="font-display text-5xl md:text-7xl font-extrabold text-white drop-shadow-xl tracking-tight">
            ProteinBox <span className="inline-block animate-bounce ml-2">🥗</span>
          </h1>
          <h2 className="mt-4 text-xl md:text-2xl font-medium text-emerald-300 tracking-wide drop-shadow-md">
            Preparing your daily fuel...
          </h2>
          
          <div className="mt-8 flex justify-center gap-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -15, 0], scale: [1, 1.2, 1], backgroundColor: ["#ffffff", "#4ade80", "#ffffff"] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="h-4 w-4 rounded-full shadow-[0_0_15px_rgba(74,222,128,0.6)]"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
