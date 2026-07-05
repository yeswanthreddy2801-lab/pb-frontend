import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ContainerBuilder } from "@/components/builder/ContainerBuilder";
import { MapPicker } from "@/components/map/MapPicker";
import { useBuilderStore, builderTotals } from "@/store/builderStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

const STEPS = ["Build box", "Delivery", "Review"];

export default function SubscriptionBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedItems, clearAll } = useBuilderStore();
  const create = useSubscriptionStore((s) => s.create);

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState(user?.address || "");
  const [position, setPosition] = useState<{lat: number, lng: number} | null>(null);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10);
  });
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  // Scroll to top when page opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totals = builderTotals(selectedItems);

  const next = () => {
    if (step === 0 && selectedItems.length === 0) { toast.error("Add at least one item"); return; }
    if (step === 1 && (!address || address.length < 10)) { toast.error("Add a delivery address"); return; }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const submit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await create({
        userId: user.id,
        userMobile: user.mobile,
        userName: user.name || "Customer",
        items: selectedItems,
        totalPrice: totals.price * 30,
        totalProtein: totals.protein,
        totalCalories: totals.calories,
        address,
        position,
        notes,
        startDate,
      });
      setDone(crypto.randomUUID().slice(0, 8).toUpperCase());
      clearAll();
    } catch (e: any) {
      toast.error(e.message || "Failed to submit subscription");
    } finally {
      setSubmitting(false);
    }
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
          <ContainerBuilder />
        )}

        {step === 1 && (
          <div className="mx-auto max-w-2xl space-y-4 rounded-3xl border border-bordersoft bg-white p-6">
            <h2 className="font-display text-xl font-bold">Delivery details</h2>
            <div>
              <label className="text-sm font-semibold">Delivery address *</label>
              <MapPicker address={address} onChangeAddress={setAddress} onChangePosition={setPosition} />
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

        {step === 2 && (
          <div className="mx-auto max-w-2xl space-y-5">
            <div className="rounded-3xl border border-bordersoft bg-white p-6">
              <h2 className="font-display text-xl font-bold">Review your order</h2>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
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

        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => step === 0 ? navigate(-1) : setStep((s) => s - 1)}>
            ← Back
          </Button>
          {step < STEPS.length - 1 && (
            <Button onClick={next} className="bg-textprimary text-white hover:bg-black">
              Next Step →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}