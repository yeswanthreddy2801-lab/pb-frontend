import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ContainerBuilder } from "@/components/builder/ContainerBuilder";
import { PLANS } from "@/mock/data/foodItems.data";
import { useBuilderStore, builderTotals } from "@/store/builderStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

const STEPS = ["Plan", "Build box", "Delivery", "Review"];

export default function SubscriptionBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedPlan, setPlan, selectedItems, clearAll } = useBuilderStore();
  const create = useSubscriptionStore((s) => s.create);

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState(user?.address || "");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10);
  });
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const totals = builderTotals(selectedItems);

  const next = () => {
    if (step === 0 && !selectedPlan) { toast.error("Pick a plan to continue"); return; }
    if (step === 1 && selectedItems.length === 0) { toast.error("Add at least one item"); return; }
    if (step === 2 && (!address || address.length < 10)) { toast.error("Add a delivery address"); return; }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const submit = () => {
    if (!user || !selectedPlan) return;
    setSubmitting(true);
    setTimeout(() => {
      const sub = create({
        userId: user.id,
        userMobile: user.mobile,
        userName: user.name || "Customer",
        plan: selectedPlan,
        items: selectedItems,
        totalPrice: totals.price * 30,
        totalProtein: totals.protein,
        totalCalories: totals.calories,
        address,
        startDate,
      });
      setSubmitting(false);
      setDone(sub.id);
      clearAll();
    }, 700);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-green text-white">
            <Check className="h-10 w-10" strokeWidth={3} />
          </motion.div>
          <h1 className="mt-6 font-display text-3xl font-bold">Request submitted! 🎉</h1>
          <p className="mt-2 text-textsecond">We'll call you within 2–4 hours on +91 {user?.mobile} to confirm and collect payment.</p>
          <p className="mt-3 font-mono text-sm text-textsecond">Order ID: <b className="text-textprimary">{done.slice(0, 8).toUpperCase()}</b></p>
          <Button onClick={() => navigate("/dashboard")} className="mt-6 bg-brand-green text-white hover:bg-emerald-600">
            Track your request →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* stepper */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm font-bold transition-colors",
                i <= step ? "bg-brand-green text-white" : "bg-white text-textsecond border border-bordersoft",
              )}>{i + 1}</div>
              <span className={cn("text-sm font-semibold", i === step ? "text-textprimary" : "text-textsecond")}>{label}</span>
              {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-textsecond" />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="grid gap-5 md:grid-cols-3">
            {PLANS.map((p) => {
              const active = selectedPlan?.id === p.id;
              return (
                <button key={p.id} onClick={() => setPlan(p)}
                  className={cn(
                    "rounded-3xl border-2 bg-white p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg",
                    active ? "border-brand-green ring-4 ring-brand-green/20" : "border-bordersoft",
                  )}>
                  <div className="flex items-start justify-between">
                    <div className="text-5xl">{p.emoji}</div>
                    {active && <span className="rounded-full bg-brand-green p-1 text-white"><Check className="h-4 w-4" /></span>}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold">{p.name}</h3>
                  <p className="mt-1 text-sm text-textsecond">{p.description}</p>
                  <div className="mt-3 font-mono text-2xl font-bold" style={{ color: p.color }}>{formatINR(p.basePrice)}<span className="text-sm font-medium text-textsecond">/mo</span></div>
                  <ul className="mt-3 space-y-1 text-sm text-textsecond">
                    <li>✓ Up to {p.maxItems} items</li>
                    <li>✓ Customise daily</li>
                    <li>✓ Cancel anytime</li>
                  </ul>
                </button>
              );
            })}
          </div>
        )}

        {step === 1 && selectedPlan && (
          <ContainerBuilder planType={selectedPlan.slug === "veg" ? "veg" : selectedPlan.slug === "nonveg" ? "nonveg" : "both"} />
        )}

        {step === 2 && (
          <div className="mx-auto max-w-2xl space-y-4 rounded-3xl border border-bordersoft bg-white p-6">
            <h2 className="font-display text-xl font-bold">Delivery details</h2>
            <div>
              <label className="text-sm font-semibold">Delivery address *</label>
              <Textarea rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-semibold">Preferred start date *</label>
              <Input type="date" value={startDate} min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)} onChange={(e) => setStartDate(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-semibold">Special instructions</label>
              <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" placeholder="Any allergies, delivery time preference, etc." />
            </div>
          </div>
        )}

        {step === 3 && selectedPlan && (
          <div className="mx-auto max-w-2xl space-y-5">
            <div className="rounded-3xl border border-bordersoft bg-white p-6">
              <h2 className="font-display text-xl font-bold">Review your order</h2>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <dt className="text-textsecond">Plan</dt><dd className="font-semibold">{selectedPlan.emoji} {selectedPlan.name}</dd>
                <dt className="text-textsecond">Items</dt><dd className="font-semibold">{selectedItems.length}</dd>
                <dt className="text-textsecond">Daily protein</dt><dd className="font-mono font-bold text-brand-green">{totals.protein.toFixed(1)}g</dd>
                <dt className="text-textsecond">Daily calories</dt><dd className="font-mono font-bold">{Math.round(totals.calories)}</dd>
                <dt className="text-textsecond">Start date</dt><dd className="font-semibold">{startDate}</dd>
                <dt className="text-textsecond">Address</dt><dd className="font-semibold">{address}</dd>
                <dt className="text-textsecond">Monthly total</dt><dd className="font-mono text-lg font-bold text-brand-orange">{formatINR(totals.price * 30)}</dd>
              </dl>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {selectedItems.map((i) => (
                  <span key={i.id} className="rounded-full bg-surface px-2 py-1 text-xs font-semibold">{i.emoji} {i.name}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              💡 No online payment required. Our team will contact you on <b>+91 {user?.mobile}</b> within 2–4 hours to confirm and collect payment (cash / UPI / bank transfer).
            </div>
            <Button onClick={submit} disabled={submitting} className="w-full bg-gradient-to-r from-brand-green to-emerald-600 py-6 text-base font-bold text-white shadow-lg hover:opacity-95">
              {submitting ? "Sending request..." : "Submit my ProteinBox request 🥗"}
            </Button>
          </div>
        )}

        {/* nav */}
        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => step === 0 ? navigate(-1) : setStep((s) => s - 1)}>
            ← Back
          </Button>
          {step < 3 && (
            <Button onClick={next} className="bg-brand-green text-white hover:bg-emerald-600">Continue →</Button>
          )}
        </div>
      </div>
    </div>
  );
}