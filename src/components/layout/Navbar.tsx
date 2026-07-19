import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/?view=home", label: "Home" },
  { to: "/plans", label: "Plans" },
  { to: "/?view=home#how", label: "How It Works" },
  { to: "/?view=home#benefits", label: "Benefits" },
  { to: "/?view=home#contact", label: "Contact" },
];

export function Navbar() {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-bordersoft bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link 
          to={isAuthenticated ? (isAdmin ? "/admin" : "/dashboard") : "/?view=home"} 
          onClick={() => {
            const path = window.location.pathname;
            if (path === "/" || path === "/admin" || path === "/dashboard") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-2 font-display text-xl font-bold text-textprimary"
        >
          <span className="text-2xl">🥗</span> ProteinBox
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link 
              key={l.to} 
              to={l.to} 
              onClick={() => {
                if (l.label === "Home" && window.location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="text-sm font-medium text-textsecond hover:text-brand-green"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}>
                {isAdmin ? "Admin" : `Hi, ${user?.name?.split(" ")[0] || "you"}`}
              </Button>
              <Button variant="outline" onClick={() => { logout(); navigate("/"); }}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="text-xs" onClick={() => navigate("/delivery/login")}>Delivery Login</Button>
              <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
              <Button className="rounded-full bg-brand-green text-white hover:bg-emerald-600" onClick={() => navigate("/login")}>
                Get Started
              </Button>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div className={cn("border-t border-bordersoft bg-white md:hidden", open ? "block" : "hidden")}>
        <div className="space-y-1 px-4 py-3">
          {LINKS.map((l) => (
            <Link 
              key={l.to} 
              to={l.to} 
              onClick={() => {
                setOpen(false);
                if (l.label === "Home" && window.location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }} 
              className="block py-2 text-sm font-medium text-textsecond"
            >
              {l.label}
            </Link>
          ))}
          {!isAuthenticated ? (
            <div className="flex gap-2">
              <Button className="mt-2 w-full bg-brand-green text-white" onClick={() => { setOpen(false); navigate("/login"); }}>
                Login / Sign up
              </Button>
              <Button className="mt-2 w-full bg-blue-600 text-white" onClick={() => { setOpen(false); navigate("/delivery/login"); }}>
                Delivery Login
              </Button>
            </div>
          ) : (
            <Button className="mt-2 w-full bg-brand-green text-white" onClick={() => { setOpen(false); navigate(isAdmin ? "/admin" : "/dashboard"); }}>
              {isAdmin ? "Admin dashboard" : "My dashboard"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}