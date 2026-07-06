import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PlansSection } from "@/components/PlansSection";
import { useEffect } from "react";

export default function PlansPage() {
  // Scroll to top when page opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="py-8">
        <PlansSection />
      </main>
      <Footer />
    </div>
  );
}
