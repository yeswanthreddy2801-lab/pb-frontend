import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Truck, Phone, ClipboardList, Target, Zap, Brain, Heart, Moon } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { api } from "@/lib/api";

const STATS = [
  { v: "25+", l: "Items" },
  { v: "30g+", l: "Daily Protein" },
  { v: "₹299", l: "/month" },
  { v: "⭐ 4.9", l: "Rating" },
];

const STEPS = [
  { icon: Target, title: "Build your box", text: "Pick from 25+ protein-rich items" },
  { icon: ClipboardList, title: "Submit request", text: "No payment online — just submit" },
  { icon: Phone, title: "We call you", text: "Our team contacts you within 2–4 hours" },
  { icon: Truck, title: "Daily delivery", text: "Fresh box every morning at your door" },
];

const BENEFITS = [
  { icon: "💪", title: "Muscle Building", text: "Protein fuels strength, repair and recovery." },
  { icon: "⚡", title: "All-Day Energy", text: "Steady protein keeps you energised for hours." },
  { icon: "🎯", title: "Weight Management", text: "Protein keeps you full and reduces cravings." },
  { icon: "🧠", title: "Mental Clarity", text: "Amino acids support sharp focus & mood." },
  { icon: "❤️", title: "Heart Health", text: "Lean protein supports healthy cardiovascular function." },
  { icon: "😴", title: "Better Sleep", text: "Protein promotes restorative sleep and recovery." },
];

const TESTIMONIALS = [
  { name: "Priya S.", city: "Bengaluru", text: "Best decision for my mornings. Saves time and the food is fresh!" },
  { name: "Rahul M.", city: "Mumbai", text: "Hit my protein goals without thinking about it. Love the variety." },
  { name: "Anita K.", city: "Delhi", text: "Healthy and tasty. The Greek yogurt and sprouts are my favourite combo." },
  { name: "Vikram P.", city: "Pune", text: "Affordable and reliable. Team support is genuinely great." },
  { name: "Sneha R.", city: "Hyderabad", text: "Customising my box every month is so satisfying." },
  { name: "Arjun T.", city: "Chennai", text: "Lost 4kg in 2 months. Protein-rich breakfast really works." },
];

const FAQS = [
  ["How does ProteinBox work?", "Build your custom protein box and submit. We call you to confirm and deliver fresh every morning."],
  ["What items are available?", "We offer 25+ fresh Veg and Non-Veg items like Greek Yogurt, Boiled Eggs, Sprouts, and Grilled Chicken."],
  ["How do I pay?", "No online payment. Our team contacts you and collects cash / UPI / bank transfer."],
  ["Can I customise my box?", "Yes — pick up to 6 items per box and change them every month."],
  ["What time is delivery?", "Between 6–10 AM. Choose your preferred slot."],
  ["Can I pause my subscription?", "Yes, contact support to pause anytime."],
  ["What areas do you deliver to?", "Currently Bengaluru, Mumbai and Pune. More cities soon."],
  ["How do I contact support?", "WhatsApp +91 8297364002 or email hello@proteinbox.in."],
];

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand-greenlight blur-3xl opacity-60" />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_1fr] lg:py-28">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-brand-greenlight px-3 py-1 text-xs font-bold text-brand-greendark"
            >
              <Sparkles className="h-3 w-3" /> Fresh Every Morning
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mt-4 font-display text-5xl font-extrabold leading-[1.05] text-textprimary sm:text-6xl"
            >
              Your Daily Protein<br />
              Breakfast Box,<br />
              <span className="text-brand-green">Customized</span><br />
              Just For You
            </motion.h1>
            <p className="mt-5 max-w-xl text-lg text-textsecond">
              Choose from 25+ protein-rich breakfast items. Build your perfect box. We deliver every morning, fresh and healthy.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {STATS.map((s) => (
                <span key={s.l} className="rounded-full border border-bordersoft bg-white px-3 py-1 text-xs font-semibold text-textprimary">
                  <span className="font-mono text-brand-green">{s.v}</span> {s.l}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/subscription/build">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-brand-green to-emerald-600 px-7 text-white shadow-lg hover:opacity-95">
                  Build My Protein Box <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["P", "R", "A", "V", "S"].map((c, i) => (
                  <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-green text-xs font-bold text-white">{c}</div>
                ))}
              </div>
              <p className="text-sm text-textsecond"><b className="text-textprimary">500+</b> happy subscribers this month</p>
            </div>
          </div>

          {/* Floating box illustration */}
          <Link to="/subscription/build">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto flex h-[380px] w-[300px] cursor-pointer items-center justify-center transition-transform hover:scale-105"
            >
              <div className="absolute inset-0 -z-10 rounded-full bg-brand-greenlight/70 blur-2xl" />
              <div className="relative h-[300px] w-[260px] rounded-3xl border-4 border-slate-300 bg-white shadow-2xl">
                <div className="flex h-[55px] items-center justify-center rounded-t-2xl bg-gradient-to-r from-brand-green to-emerald-600 font-display font-bold text-white">
                  ProteinBox 🥗
                </div>
                <div className="grid grid-cols-2 gap-2 p-3">
                  {["🥚", "🧀", "🌾", "🫘", "🍌", "🥤"].map((e, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.2 + i * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                      className="flex aspect-square items-center justify-center rounded-lg text-3xl"
                      style={{ background: ["#FEF9C3", "#FFF7ED", "#FFFBEB", "#FEF9C3", "#FEFCE8", "#EDE9FE"][i] }}
                    >
                      {e}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center font-display text-4xl font-extrabold text-textprimary">How it works</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-bordersoft bg-white p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-green to-emerald-600 font-mono text-lg font-bold text-white">
                  {i + 1}
                </div>
                <s.icon className="mt-4 h-6 w-6 text-brand-green" />
                <h3 className="mt-2 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-textsecond">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center font-display text-4xl font-extrabold text-textprimary">Why daily protein matters</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <motion.div key={b.title} whileHover={{ y: -2 }} className="rounded-2xl border border-bordersoft p-6 transition-colors hover:border-brand-green">
                <div className="text-3xl">{b.icon}</div>
                <h3 className="mt-3 font-display text-lg font-bold">{b.title}</h3>
                <p className="mt-1 text-sm text-textsecond">{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center font-display text-4xl font-extrabold text-textprimary">Loved by hundreds</h2>
          <div className="mt-10 flex gap-5 overflow-x-auto pb-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="w-80 flex-none rounded-2xl border border-bordersoft bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green font-bold text-white">{t.name[0]}</div>
                  <div>
                    <p className="font-display font-bold">{t.name}</p>
                    <p className="text-xs text-textsecond">{t.city}</p>
                  </div>
                </div>
                <p className="mt-3 text-yellow-500">★★★★★</p>
                <p className="mt-2 text-sm text-textsecond">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center font-display text-4xl font-extrabold text-textprimary">FAQ</h2>
          <Accordion type="single" collapsible className="mt-8">
            {FAQS.map(([q, a], i) => (
              <AccordionItem key={i} value={`f${i}`}>
                <AccordionTrigger className="text-left font-semibold">{q}</AccordionTrigger>
                <AccordionContent className="text-textsecond">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-4xl font-extrabold text-textprimary">Talk to us</h2>
          <p className="mt-2 text-textsecond">We typically reply within an hour.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="https://wa.me/918297364002" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white shadow-lg">💬 WhatsApp us</a>
            <a href="tel:+918297364002" className="inline-flex items-center gap-2 rounded-full border border-bordersoft bg-white px-6 py-3 font-semibold text-textprimary">📞 +91 8297364002</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}