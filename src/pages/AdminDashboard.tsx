import { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useAuth } from "@/contexts/AuthContext";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900",
  approved: "bg-blue-100 text-blue-900",
  active: "bg-emerald-100 text-emerald-900",
  rejected: "bg-rose-100 text-rose-700",
  expired: "bg-slate-100 text-slate-700",
};

export default function AdminDashboard() {
  const { subscriptions: subs, fetchSubscriptions, approve, reject } = useSubscriptionStore();
  const { changeAdminPassword } = useAuth();
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChanging(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsChanging(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const stats = useMemo(() => {
    const pending = subs.filter((s) => s.status === "pending").length;
    const active = subs.filter((s) => s.status === "active").length;
    const revenue = subs.filter((s) => s.status === "active").reduce((sum, s) => sum + s.totalPrice, 0);
    const customers = new Set(subs.map((s) => s.userId)).size;
    return { pending, active, revenue, customers };
  }, [subs]);

  const pendingSubs = subs.filter((s) => s.status === "pending");

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-3xl font-bold">Admin dashboard 🛡️</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowPasswordModal(true)} className="border-slate-300 text-slate-700 hover:bg-slate-100">🔐 Change Password</Button>
            <Link to="/admin/plans"><Button variant="outline" className="border-brand-orange text-brand-orange hover:bg-brand-orange/10">📝 Manage Plans</Button></Link>
            <Link to="/admin/inventory"><Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green/10">📦 Manage Inventory</Button></Link>
            <Link to="/admin/orders"><Button variant="outline">View all orders →</Button></Link>
          </div>
        </div>

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="font-display text-2xl font-bold">Change Password</h2>
              <p className="mt-1 text-sm text-textsecond">Update your admin account password below.</p>
              <form onSubmit={handlePasswordChange} className="mt-5 space-y-4">
                <div>
                  <label className="text-sm font-semibold">Current Password</label>
                  <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-bordersoft p-3" />
                </div>
                <div>
                  <label className="text-sm font-semibold">New Password</label>
                  <input type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-bordersoft p-3" />
                </div>
                <div className="mt-6 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
                  <Button type="submit" disabled={isChanging} className="flex-1 bg-brand-green text-white hover:bg-emerald-600">
                    {isChanging ? "Saving..." : "Change Password"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* stats */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Pending requests", value: stats.pending, color: "#D97706", emoji: "📋" },
            { label: "Active subscriptions", value: stats.active, color: "#16A34A", emoji: "✅" },
            { label: "Monthly revenue", value: formatINR(stats.revenue), color: "#7C3AED", emoji: "💰" },
            { label: "Total customers", value: stats.customers, color: "#0891B2", emoji: "👥" },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-bordersoft bg-white p-5">
              <div className="text-2xl">{s.emoji}</div>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-textsecond">{s.label}</p>
              <p className="mt-1 font-mono text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* pending approvals */}
        <div>
          <h2 className="font-display text-xl font-bold">Pending approvals</h2>
          {pendingSubs.length === 0 ? (
            <div className="mt-3 rounded-2xl border border-dashed border-bordersoft bg-white p-10 text-center text-textsecond">
              All caught up 🎉
            </div>
          ) : (
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              {pendingSubs.map((s) => (
                <motion.div key={s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="rounded-2xl border border-bordersoft bg-white p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display font-bold">{s.userName}</p>
                      <p className="text-sm text-textsecond">+91 {s.userMobile} · {s.plan.emoji} {s.plan.name}</p>
                    </div>
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_TONE[s.status])}>pending</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.items.map((i) => (
                      <span key={i.id} className="rounded-full bg-surface px-2 py-1 text-xs font-semibold">{i.emoji} {i.name}</span>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div><span className="text-textsecond">Protein</span><p className="font-mono font-bold text-brand-green">{s.totalProtein.toFixed(1)}g</p></div>
                    <div><span className="text-textsecond">Calories</span><p className="font-mono font-bold">{Math.round(s.totalCalories)}</p></div>
                    <div><span className="text-textsecond">Monthly</span><p className="font-mono font-bold text-brand-orange">{formatINR(s.totalPrice)}</p></div>
                  </div>
                  <p className="mt-2 text-xs text-textsecond">📍 {s.address}</p>
                  {s.notes && (
                    <div className="mt-2 rounded-md bg-amber-50 p-2 text-xs text-amber-900 border border-amber-200">
                      <strong>Notes:</strong> {s.notes}
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => { approve(s.id); toast.success("Approved — customer notified"); }}
                      className="flex-1 bg-brand-green text-white hover:bg-emerald-600">Approve</Button>
                    <Button onClick={() => { reject(s.id); toast.info("Order rejected"); }}
                      variant="outline" className="flex-1 border-rose-300 text-rose-600 hover:bg-rose-50">Reject</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* recent */}
        <div className="rounded-3xl border border-bordersoft bg-white p-6">
          <h2 className="font-display text-xl font-bold">All orders</h2>
          {subs.length === 0 ? (
            <p className="mt-3 text-sm text-textsecond">No orders yet — share the app with users.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-textsecond">
                  <tr><th className="py-2">Customer</th><th>Plan</th><th>Items</th><th>Amount</th><th>Status</th><th>Submitted</th></tr>
                </thead>
                <tbody>
                  {subs.slice(0, 12).map((s) => (
                    <tr key={s.id} className="border-t border-bordersoft">
                      <td className="py-2"><b>{s.userName}</b><br /><span className="text-xs text-textsecond">+91 {s.userMobile}</span></td>
                      <td>{s.plan.emoji} {s.plan.name}</td>
                      <td>{s.items.length}</td>
                      <td className="font-mono font-semibold">{formatINR(s.totalPrice)}</td>
                      <td><span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", STATUS_TONE[s.status])}>{s.status}</span></td>
                      <td className="text-xs text-textsecond">{new Date(s.submittedAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}