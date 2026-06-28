import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    address: user?.address || "",
    pincode: user?.pincode || "",
    city: user?.city || "",
    state: user?.state || "",
    email: user?.email || "",
  });

  if (!user) return <Navigate to="/login" replace />;

  const valid = form.name.length >= 2 && form.address.length >= 10 && /^\d{6}$/.test(form.pincode) && form.city && form.state;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) { toast.error("Please complete all required fields"); return; }
    updateProfile(form);
    toast.success("Profile saved 🎉");
    navigate("/dashboard");
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl border border-bordersoft bg-white p-8 shadow-xl"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">Step 2 of 2 — Profile</p>
        <h1 className="mt-2 font-display text-2xl font-bold">Tell us where to deliver</h1>
        <p className="mt-1 text-sm text-textsecond">No OTP, no password — just your details.</p>

        <form onSubmit={onSubmit} className="mt-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-sm font-semibold">Full name *</label>
            <Input className="mt-1" value={form.name} onChange={set("name")} placeholder="Priya Sharma" />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-semibold">Mobile</label>
            <Input className="mt-1 bg-surface" value={`+91 ${user.mobile}`} readOnly />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-semibold">Email (optional)</label>
            <Input className="mt-1" value={form.email} onChange={set("email")} placeholder="you@example.com" />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-semibold">Delivery address *</label>
            <Textarea className="mt-1" rows={3} value={form.address} onChange={set("address")} placeholder="Flat / building / street" />
          </div>
          <div>
            <label className="text-sm font-semibold">Pincode *</label>
            <Input className="mt-1" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} />
          </div>
          <div>
            <label className="text-sm font-semibold">City *</label>
            <Input className="mt-1" value={form.city} onChange={set("city")} />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-semibold">State *</label>
            <Input className="mt-1" value={form.state} onChange={set("state")} />
          </div>
          <Button type="submit" className="col-span-2 mt-2 w-full bg-brand-green text-white hover:bg-emerald-600">
            Complete profile 🥗
          </Button>
        </form>
      </motion.div>
    </div>
  );
}