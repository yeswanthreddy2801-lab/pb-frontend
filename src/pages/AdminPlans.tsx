import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { usePlanStore } from "@/store/planStore";
import type { SubscriptionPlan } from "@/types/food.types";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminPlans() {
  const { plans, fetchPlans, createPlan, updatePlan, deletePlan } = usePlanStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState<Partial<SubscriptionPlan>>({
    name: "", slug: "", description: "", category: "veg", basePrice: 0, maxItems: 6, emoji: "🥗", color: "#16A34A", isActive: true
  });

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleEdit = (plan: SubscriptionPlan) => {
    setFormData(plan);
    setEditingId(plan.id);
    setShowAddForm(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug || !formData.emoji) {
      toast.error("Name, slug and emoji are required");
      return;
    }

    try {
      if (editingId) {
        await updatePlan(editingId, formData);
        toast.success("Plan updated");
      } else {
        await createPlan(formData);
        toast.success("Plan created");
      }
      
      setEditingId(null);
      setShowAddForm(false);
      setFormData({ name: "", slug: "", description: "", category: "veg", basePrice: 0, maxItems: 6, emoji: "🥗", color: "#16A34A", isActive: true });
    } catch (e: any) {
      toast.error(e.message || "Failed to save plan");
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin"><Button variant="outline">← Back</Button></Link>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Plans Management 📝</h1>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-brand-green text-white hover:bg-emerald-600">
            {showAddForm ? "Cancel" : "Add New Plan"}
          </Button>
        </div>

        {showAddForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-bordersoft bg-white p-6">
            <h2 className="font-display text-xl font-bold mb-4">{editingId ? "Edit Plan" : "Add New Plan"}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-xs font-semibold uppercase text-textsecond">Name</label>
                <input type="text" className="mt-1 w-full rounded-lg border border-bordersoft p-2 text-sm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-textsecond">Slug (URL safe)</label>
                <input type="text" className="mt-1 w-full rounded-lg border border-bordersoft p-2 text-sm" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-textsecond">Emoji</label>
                <input type="text" className="mt-1 w-full rounded-lg border border-bordersoft p-2 text-sm" value={formData.emoji} onChange={(e) => setFormData({ ...formData, emoji: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-textsecond">Category</label>
                <input type="text" className="mt-1 w-full rounded-lg border border-bordersoft p-2 text-sm" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-textsecond">Base Price (₹)</label>
                <input type="number" className="mt-1 w-full rounded-lg border border-bordersoft p-2 text-sm" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-textsecond">Max Items</label>
                <input type="number" className="mt-1 w-full rounded-lg border border-bordersoft p-2 text-sm" value={formData.maxItems} onChange={(e) => setFormData({ ...formData, maxItems: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-textsecond">Card Color</label>
                <input type="color" className="mt-1 w-full rounded-lg border border-bordersoft p-1 h-10" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="text-xs font-semibold uppercase text-textsecond">Description</label>
                <input type="text" className="mt-1 w-full rounded-lg border border-bordersoft p-2 text-sm" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="sm:col-span-2 lg:col-span-4 flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                  Active (Visible to Users)
                </label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSave} className="bg-brand-green text-white hover:bg-emerald-600">Save Plan</Button>
            </div>
          </motion.div>
        )}

        <div className="rounded-3xl border border-bordersoft bg-white p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-textsecond">
                <tr><th className="py-2">Plan</th><th>Price</th><th>Max Items</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id} className="border-t border-bordersoft">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{plan.emoji}</span>
                        <div>
                          <b className="font-display" style={{ color: plan.color }}>{plan.name}</b>
                          <p className="text-xs text-textsecond">{plan.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono font-semibold">{formatINR(plan.basePrice)}</td>
                    <td className="font-mono">{plan.maxItems}</td>
                    <td>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block w-fit ${plan.isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                        {plan.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>Edit</Button>
                        <Button variant="outline" size="sm" className="border-rose-300 text-rose-600 hover:bg-rose-50" 
                          onClick={async () => {
                            if (window.confirm("Are you sure you want to delete this plan?")) {
                              try {
                                await deletePlan(plan.id);
                                toast.success("Plan deleted");
                              } catch (e: any) {
                                toast.error(e.message || "Failed to delete");
                              }
                            }
                          }}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
