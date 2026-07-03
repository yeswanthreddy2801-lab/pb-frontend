import { useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const STATUS_META: Record<string, { label: string; tone: string; emoji: string }> = {
  pending: { label: "Pending approval", tone: "bg-amber-100 text-amber-900 border-amber-200", emoji: "⏳" },
  approved: { label: "Approved", tone: "bg-blue-100 text-blue-900 border-blue-200", emoji: "👍" },
  active: { label: "Active", tone: "bg-emerald-100 text-emerald-900 border-emerald-200", emoji: "✅" },
  completed: { label: "Completed", tone: "bg-slate-100 text-slate-700 border-slate-200", emoji: "🏁" },
  cancelled: { label: "Cancelled", tone: "bg-rose-100 text-rose-700 border-rose-200", emoji: "✖️" },
  expired: { label: "Expired", tone: "bg-slate-100 text-slate-700 border-slate-200", emoji: "⚠️" },
  rejected: { label: "Rejected", tone: "bg-rose-100 text-rose-700 border-rose-200", emoji: "✖️" },
};

export default function UserDashboard() {
  const { user } = useAuth();
  const { subscriptions: subs, fetchSubscriptions } = useSubscriptionStore();
  const mySubs = useMemo(() => subs.filter((s) => s.userId === user?.id), [subs, user]);
  const current = mySubs[0];
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-textprimary">
            {greet()}, {user?.name?.split(" ")[0] || "friend"}! 🌅
          </h1>
          <p className="text-sm text-textsecond">{today}</p>
        </div>

        {/* status card */}
        {!current ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border-2 border-dashed border-brand-green bg-brand-greenlight/40 p-8 text-center">
            <div className="text-5xl">🥗</div>
            <h2 className="mt-3 font-display text-2xl font-bold">Start your ProteinBox journey</h2>
            <p className="mt-1 text-textsecond">Build your first box in under 2 minutes.</p>
            <Link to="/subscription/build">
              <Button className="mt-5 bg-brand-green text-white hover:bg-emerald-600">Build my first box →</Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={cn("rounded-3xl border-2 p-6", STATUS_META[current.status]?.tone || "bg-white border-bordersoft")}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider opacity-70">
                  {STATUS_META[current.status]?.emoji} {STATUS_META[current.status]?.label}
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold">{current.plan.emoji} {current.plan.name}</h2>
                <p className="mt-1 text-sm opacity-80">Starts {current.startDate} · Order #{current.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase opacity-70">Monthly</p>
                <p className="font-mono text-2xl font-bold">{formatINR(current.totalPrice)}</p>
              </div>
            </div>
            {current.status === "pending" && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                Our team will call +91 {user?.mobile} within 2–4 hours
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {current.items.map((i) => (
                <span key={i.id} className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold">{i.emoji} {i.name}</span>
              ))}
            </div>
          </motion.div>
        )}

        {/* quick stats */}
        {current && (
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { label: "Daily protein", value: `${current.totalProtein.toFixed(1)}g`, color: "#16A34A" },
              { label: "Daily calories", value: `${Math.round(current.totalCalories)}`, color: "#DC2626" },
              { label: "Monthly cost", value: formatINR(current.totalPrice), color: "#EA580C" },
              { label: "Items", value: `${current.items.length}/6`, color: "#2563EB" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-bordersoft bg-white p-4">
                <p className="text-xs font-semibold text-textsecond">{s.label}</p>
                <p className="mt-1 font-mono text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* history */}
        {mySubs.length > 0 && (
          <div className="rounded-3xl border border-bordersoft bg-white p-6">
            <h3 className="font-display text-lg font-bold">Order timeline</h3>
            <ul className="mt-4 space-y-3">
              {mySubs.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-xl border border-bordersoft p-3">
                  <div>
                    <p className="font-semibold">{s.plan.emoji} {s.plan.name}</p>
                    <p className="text-xs text-textsecond">Submitted {new Date(s.submittedAt).toLocaleString("en-IN")}</p>
                  </div>
                  <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", STATUS_META[s.status]?.tone)}>
                    {STATUS_META[s.status]?.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}