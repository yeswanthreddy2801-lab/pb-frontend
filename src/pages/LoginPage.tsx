import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, checkUser } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validMobile = /^[6-9]\d{9}$/.test(mobile);
  const validName = name.trim().length > 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validMobile) { setErr("Enter a valid 10-digit Indian mobile"); return; }
    
    setLoading(true);
    setErr(null);

    try {
      if (step === 1) {
        // Step 1: Check if user exists
        const exists = await checkUser(mobile);
        if (exists) {
          // Existing user -> login directly
          await loginUser(mobile);
          toast.success("Welcome back 🥗");
          navigate((location.state as { from?: string })?.from || "/dashboard");
        } else {
          // New user -> ask for name
          setStep(2);
        }
      } else {
        // Step 2: New user enters name
        if (!validName) { setErr("Enter your name"); setLoading(false); return; }
        await loginUser(mobile, name);
        toast.success("Account created! 🥗");
        navigate((location.state as { from?: string })?.from || "/dashboard");
      }
    } catch (err: any) {
      setErr(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-bordersoft bg-white p-8 shadow-xl"
      >
        <Link to="/" className="flex items-center justify-center gap-2 font-display text-2xl font-bold">
          <span className="text-3xl">🥗</span> ProteinBox
        </Link>
        <h1 className="mt-6 text-center font-display text-2xl font-bold">
          {step === 1 ? "Welcome 👋" : "Create Account"}
        </h1>
        <p className="mt-1 text-center text-sm text-textsecond">
          {step === 1 ? "Enter your mobile number to continue" : "What should we call you?"}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {step === 1 && (
            <div>
              <label className="text-sm font-semibold text-textprimary">Mobile number</label>
              <div className="mt-1 flex overflow-hidden rounded-xl border border-bordersoft focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/30">
                <span className="flex items-center bg-surface px-3 text-sm font-semibold text-textsecond">+91</span>
                <Input
                  value={mobile}
                  onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setErr(null); }}
                  placeholder="9876543210"
                  className="border-0 focus-visible:ring-0"
                  inputMode="numeric"
                  disabled={loading}
                />
              </div>
              {err && <p className="mt-1 text-xs font-semibold text-rose-500">{err}</p>}
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="text-sm font-semibold text-textprimary">Name</label>
              <div className="mt-1 flex overflow-hidden rounded-xl border border-bordersoft focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/30">
                <Input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErr(null); }}
                  placeholder="John Doe"
                  className="border-0 focus-visible:ring-0"
                  autoFocus
                  disabled={loading}
                />
              </div>
              {err && <p className="mt-1 text-xs font-semibold text-rose-500">{err}</p>}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading || (step === 1 ? !validMobile : !validName)} 
            className="w-full bg-brand-green text-white hover:bg-emerald-600"
          >
            {loading ? "Please wait..." : "Continue"}
          </Button>
        </form>

        <div className="mt-5 space-y-1 text-center text-xs text-textsecond">
          <p>Admin? <Link to="/admin/login" className="font-semibold text-brand-green">Sign in here</Link></p>
        </div>
      </motion.div>
    </div>
  );
}