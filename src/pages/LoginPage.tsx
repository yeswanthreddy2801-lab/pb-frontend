import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, checkUser } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userStatus, setUserStatus] = useState<{ isAdmin?: boolean; exists: boolean; hasPassword: boolean } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validMobile = /^[6-9]\d{9}$/.test(mobile);
  const validName = name.trim().length > 0;
  const validPassword = password.length >= 6;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setErr(null);

    try {
      if (step === 1) {
        if (!validMobile) { setErr("Enter a valid 10-digit Indian mobile"); setLoading(false); return; }
        // Step 1: Check if user exists
        const status = await checkUser(mobile);
        if (status.isAdmin) {
          toast("Admin detected. Redirecting...", { icon: '🛡️' });
          navigate("/admin/login", { state: { mobile } });
          return;
        }
        setUserStatus(status);
        setStep(2);
      } else {
        // Step 2: Login or Create Account or Set Password
        if (!validPassword) { setErr("Password must be at least 6 characters"); setLoading(false); return; }
        if (!userStatus?.exists && !validName) { setErr("Enter your name"); setLoading(false); return; }
        
        await loginUser(mobile, userStatus?.exists ? undefined : name, password);
        toast.success(userStatus?.exists ? "Welcome back 🥗" : "Account created! 🥗");
        navigate((location.state as { from?: string })?.from || "/dashboard");
      }
    } catch (err: any) {
      setErr(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const getStep2Title = () => {
    if (!userStatus?.exists) return "Create Account";
    if (!userStatus?.hasPassword) return "Set Password";
    return "Welcome Back 👋";
  };

  const getStep2Subtitle = () => {
    if (!userStatus?.exists) return "Let's get you set up";
    if (!userStatus?.hasPassword) return "Please set a password for your account";
    return "Enter your password to continue";
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
          {step === 1 ? "Welcome 👋" : getStep2Title()}
        </h1>
        <p className="mt-1 text-center text-sm text-textsecond">
          {step === 1 ? "Enter your mobile number to continue" : getStep2Subtitle()}
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
                  autoFocus
                />
              </div>
              {err && <p className="mt-1 text-xs font-semibold text-rose-500">{err}</p>}
            </div>
          )}

          {step === 2 && (
            <>
              {!userStatus?.exists && (
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
                </div>
              )}
              
              <div>
                <label className="text-sm font-semibold text-textprimary">Password</label>
                <div className="mt-1 flex overflow-hidden rounded-xl border border-bordersoft focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/30 relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErr(null); }}
                    placeholder="Enter 6+ characters"
                    className="border-0 focus-visible:ring-0 pr-10"
                    autoFocus={userStatus?.exists}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textsecond hover:text-textprimary"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {err && <p className="mt-1 text-xs font-semibold text-rose-500">{err}</p>}
              </div>
            </>
          )}

          <Button 
            type="submit" 
            disabled={loading || (step === 1 ? !validMobile : (!validPassword || (!userStatus?.exists && !validName)))} 
            className="w-full bg-brand-green text-white hover:bg-emerald-600"
          >
            {loading ? "Please wait..." : "Continue"}
          </Button>
          
          {step === 2 && (
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => { setStep(1); setErr(null); setPassword(""); }}
              className="w-full text-textsecond"
              disabled={loading}
            >
              Back
            </Button>
          )}
        </form>

      </motion.div>
    </div>
  );
}