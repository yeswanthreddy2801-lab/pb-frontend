import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useInventoryStore } from "@/store/inventoryStore";
import type { FoodItem, FoodCategory, PlanType } from "@/types/food.types";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";
import { motion } from "framer-motion";

const CATEGORIES: FoodCategory[] = ['egg', 'dairy', 'grain', 'legume', 'fruit', 'nut', 'meat', 'supplement', 'vegetable'];
const PLAN_TYPES: PlanType[] = ['veg', 'nonveg', 'both'];

export default function AdminInventory() {
  const { items, fetchItems, addItem, updateItem, deleteItem } = useInventoryStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState<Partial<FoodItem>>({
    name: "", category: "dairy", planType: "veg", protein: 0, calories: 0, price: 0, emoji: "🧀", color: "#FFF7ED", description: "", isActive: true, isAvailable: true
  });

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleEdit = (item: FoodItem) => {
    setFormData(item);
    setEditingId(item.id);
    setShowAddForm(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.emoji) {
      toast.error("Name and emoji are required");
      return;
    }

    try {
      if (editingId) {
        await updateItem(editingId, formData);
        toast.success("Item updated");
      } else {
        await addItem(formData as Omit<FoodItem, "id">);
        toast.success("Item added");
      }
      
      setEditingId(null);
      setShowAddForm(false);
      setFormData({ name: "", category: "dairy", planType: "veg", protein: 0, calories: 0, price: 0, emoji: "🧀", color: "#FFF7ED", description: "", isActive: true, isAvailable: true });
    } catch (e: any) {
      toast.error(e.message || "Failed to save item");
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin"><Button variant="outline">← Back</Button></Link>
            <h1 className="font-display text-3xl font-bold">Inventory Management 📦</h1>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-brand-green text-white hover:bg-emerald-600">
            {showAddForm ? "Cancel" : "Add New Item"}
          </Button>
        </div>

        {showAddForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-bordersoft bg-white p-6">
            <h2 className="font-display text-xl font-bold mb-4">{editingId ? "Edit Item" : "Add New Item"}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-xs font-semibold uppercase text-textsecond">Name</label>
                <input type="text" className="mt-1 w-full rounded-lg border border-bordersoft p-2 text-sm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-textsecond">Emoji</label>
                <input type="text" className="mt-1 w-full rounded-lg border border-bordersoft p-2 text-sm" value={formData.emoji} onChange={(e) => setFormData({ ...formData, emoji: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-textsecond">Category</label>
                <select className="mt-1 w-full rounded-lg border border-bordersoft p-2 text-sm" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as FoodCategory })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-textsecond">Plan Type</label>
                <select className="mt-1 w-full rounded-lg border border-bordersoft p-2 text-sm" value={formData.planType} onChange={(e) => setFormData({ ...formData, planType: e.target.value as PlanType })}>
                  {PLAN_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-textsecond">Protein (g)</label>
                <input type="number" step="0.1" className="mt-1 w-full rounded-lg border border-bordersoft p-2 text-sm" value={formData.protein} onChange={(e) => setFormData({ ...formData, protein: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-textsecond">Calories</label>
                <input type="number" className="mt-1 w-full rounded-lg border border-bordersoft p-2 text-sm" value={formData.calories} onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-textsecond">Price (₹)</label>
                <input type="number" className="mt-1 w-full rounded-lg border border-bordersoft p-2 text-sm" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} />
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
                  <input type="checkbox" checked={formData.isAvailable} onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })} />
                  In Stock / Available
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                  Active (Visible to Users)
                </label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSave} className="bg-brand-green text-white hover:bg-emerald-600">Save Item</Button>
            </div>
          </motion.div>
        )}

        <div className="rounded-3xl border border-bordersoft bg-white p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-textsecond">
                <tr><th className="py-2">Item</th><th>Category</th><th>Macros</th><th>Price</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t border-bordersoft">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <b className="font-display">{item.name}</b>
                          <p className="text-xs text-textsecond">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="rounded-full bg-surface px-2 py-0.5 text-xs capitalize">{item.category}</span></td>
                    <td>
                      <div className="text-xs"><span className="text-brand-green font-bold">{item.protein}g</span> P</div>
                      <div className="text-xs text-textsecond">{item.calories} kcal</div>
                    </td>
                    <td className="font-mono font-semibold">{formatINR(item.price)}</td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block w-fit ${item.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block w-fit ${item.isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                          {item.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                        <Button variant="outline" size="sm" className="border-rose-300 text-rose-600 hover:bg-rose-50" 
                          onClick={async () => {
                            if (window.confirm("Are you sure you want to delete this item?")) {
                              try {
                                await deleteItem(item.id);
                                toast.success("Item deleted");
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
