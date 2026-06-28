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
  const { loginUser } = useAuth();
  const [mobile, setMobile] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const valid = /^[6-9]\d{9}$/.test(mobile);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) { setErr("Enter a valid 10-digit Indian mobile"); return; }
    const u = loginUser(mobile);
    toast.success("Logged in 🥗");
    if (!u.name) navigate("/register");
    else navigate((location.state as { from?: string })?.from || "/dashboard");
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
        <h1 className="mt-6 text-center font-display text-2xl font-bold">Welcome 👋</h1>
        <p className="mt-1 text-center text-sm text-textsecond">Enter your mobile number to continue</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
              />
            </div>
            {err && <p className="mt-1 text-xs font-semibold text-rose-500">{err}</p>}
          </div>
          <Button type="submit" disabled={!valid} className="w-full bg-brand-green text-white hover:bg-emerald-600">
            Continue
          </Button>
        </form>

        <div className="mt-5 space-y-1 text-center text-xs text-textsecond">
          <p>Admin? <Link to="/admin/login" className="font-semibold text-brand-green">Sign in here</Link></p>
        </div>
      </motion.div>
    </div>
  );
}