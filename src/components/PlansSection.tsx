import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/format";
import type { SubscriptionPlan } from "@/types/food.types";

export function PlansSection() {
  const navigate = useNavigate();

  const { data: plans = [] as SubscriptionPlan[], isLoading: loading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const res = await api.get("/food-items/plans");
      if (res.success && res.data) {
        return res.data.map((b: any) => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
          description: b.description,
          category: b.category,
          basePrice: b.basePrice,
          maxItems: b.maxItems,
          color: b.color,
          emoji: b.emoji || "📦",
          isActive: b.isActive,
        }));
      }
      return [];
    }
  });

  return (
    <section id="plans" className="py-20 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold tracking-tight text-textprimary">Choose Your Plan 🥗</h2>
          <p className="mt-4 text-lg text-textsecond max-w-2xl mx-auto">
            Select a predefined plan to get started quickly, or choose a custom box to pick every item yourself!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan: SubscriptionPlan) => (
              <div
                key={plan.id}
                className="flex flex-col justify-between rounded-3xl border border-bordersoft bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                style={{ borderTop: `4px solid ${plan.color || '#4ade80'}` }}
              >
                <div>
                  <div className="text-4xl mb-4">{plan.emoji}</div>
                  <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
                  <p className="mt-2 text-textsecond">{plan.description}</p>
                  
                  <div className="mt-6 mb-6">
                    <span className="text-4xl font-bold font-mono">{formatINR(plan.basePrice)}</span>
                    <span className="text-textsecond ml-1">/ month</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-sm">
                      <span className="text-brand-green mr-2">✓</span> {plan.maxItems} items per box
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="text-brand-green mr-2">✓</span> Free daily delivery
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="text-brand-green mr-2">✓</span> High protein meals
                    </li>
                  </ul>
                </div>
                
                <Button 
                  onClick={() => navigate(`/subscription/build?planId=${plan.id}&skipBuilder=true&basePrice=${plan.basePrice}`)}
                  className="w-full bg-brand-green text-white hover:bg-emerald-600 py-6 text-lg rounded-xl"
                >
                  Select Plan
                </Button>
              </div>
            ))}
            
            {/* Custom Box Plan */}
            <div className="group relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
              {/* Dynamic animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950 z-0"></div>
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[gradient_3s_ease_infinite] z-0 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div>
                  <div className="text-4xl mb-4 animate-bounce group-hover:animate-none">🔮</div>
                  <h3 className="font-display text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">The Custom Box</h3>
                  <p className="mt-2 text-slate-400">Want complete control? Build your own unique protein box by handpicking every item. The possibilities are endless!</p>
                  
                  <div className="mt-6 mb-6">
                    <span className="text-2xl font-bold text-white">Pay per item</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-4">
                  <Button 
                    onClick={() => navigate("/subscription/build")}
                    className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white hover:from-fuchsia-500 hover:via-violet-500 hover:to-indigo-500 border-none shadow-lg shadow-purple-900/50 transition-all duration-300 group-hover:scale-[1.02]"
                  >
                    ✨ Customize Container
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
