import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin } = useAuth();
  const [mobile, setMobile] = useState(location.state?.mobile || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [needsPwd, setNeedsPwd] = useState(!!location.state?.mobile);

  useEffect(() => {
    if (location.state?.mobile) {
      setMobile(location.state.mobile);
      setNeedsPwd(true);
    }
  }, [location.state]);

  const onContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) { toast.error("Enter a valid mobile"); return; }
    setNeedsPwd(true);
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAdmin(mobile, password);
    if (success) {
      toast.success("Welcome back, admin");
      navigate("/admin");
    } else {
      toast.error("Incorrect password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-bordersoft bg-white p-8 shadow-xl"
      >
        <Link to="/" className="flex items-center justify-center gap-2 font-display text-2xl font-bold">
          <span className="text-3xl">🛡️</span> Admin
        </Link>
        <h1 className="mt-6 text-center font-display text-2xl font-bold">Admin sign-in</h1>
        <p className="mt-1 text-center text-sm text-textsecond">Mobile + password required for admins only.</p>

        {!needsPwd ? (
          <form onSubmit={onContinue} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold">Mobile</label>
              <div className="mt-1 flex overflow-hidden rounded-xl border border-bordersoft focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/30">
                <span className="flex items-center bg-surface px-3 text-sm font-semibold text-textsecond">+91</span>
                <Input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} className="border-0 focus-visible:ring-0" placeholder="9999999999" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-brand-green text-white hover:bg-emerald-600">Continue</Button>
          </form>
        ) : (
          <form onSubmit={onLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold">Password</label>
              <div className="relative mt-1">
                <Input className="pr-10" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoFocus />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textsecond hover:text-textprimary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-brand-green text-white hover:bg-emerald-600">Sign in</Button>
            <button type="button" className="w-full text-xs text-textsecond hover:underline" onClick={() => setNeedsPwd(false)}>← Use a different number</button>
          </form>
        )}

      </motion.div>
    </div>
  );
}