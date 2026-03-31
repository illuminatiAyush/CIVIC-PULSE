"use client";

import { motion } from "framer-motion";
import { 
  Cpu, Zap, Globe, Database, ShieldCheck, 
  Smartphone, BarChart4, Network, Lightbulb,
  ArrowRight
} from "lucide-react";

export default function FutureScopePage() {
  const roadmap = [
    {
      phase: "Phase 1: Local Deployment",
      status: "Active",
      title: "AI Analysis & Routing",
      desc: "Real-time issue detection using Vision AI and automated routing to municipal departments based on ward boundaries.",
      icon: <Cpu className="w-6 h-6" />,
      color: "border-emerald-500/30 text-emerald-400"
    },
    {
      phase: "Phase 2: Scale",
      status: "Q3 2026",
      title: "Direct Municipal API Sync",
      desc: "Integrating directly with government ERP systems (e.g., SAP, Oracle) for bidirectional status updates and official ticketing.",
      icon: <Network className="w-6 h-6" />,
      color: "border-blue-500/30 text-blue-400"
    },
    {
      phase: "Phase 3: Intelligence",
      status: "Q4 2026",
      title: "Predictive Infrastructure",
      desc: "Using historical data to predict infrastructure failure (e.g., bridge fatigue, pipe leaks) before they occur using IoT sensors.",
      icon: <Zap className="w-6 h-6" />,
      color: "border-amber-500/30 text-amber-400"
    },
    {
      phase: "Phase 4: Ecosystem",
      status: "2027",
      title: "Global Civic Network",
      desc: "Standardizing the CivicPulse protocol for inter-city collaboration and open-source civic governance frameworks.",
      icon: <Globe className="w-6 h-6" />,
      color: "border-accent/30 text-accent"
    }
  ];

  const features = [
    { title: "On-Device AI", desc: "Edge computing for offline reporting in low-connectivity zones.", icon: <Smartphone className="w-5 h-5" /> },
    { title: "Blockchain Ledger", desc: "Immutable trail of every report to prevent corruption or data tampering.", icon: <ShieldCheck className="w-5 h-5" /> },
    { title: "Advanced Analytics", desc: "Heatmaps for urban planning and resource allocation optimization.", icon: <BarChart4 className="w-5 h-5" /> },
    { title: "Citizen Rewards", desc: "Tokenized incentives for verified reports and community-led cleanups.", icon: <Lightbulb className="w-5 h-5" /> },
  ];

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-white font-sans selection:bg-accent selection:text-white">
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Hero */}
        <div className="max-w-3xl mb-20 space-y-6">
          <div className="text-[10px] font-black tracking-[0.5em] text-accent uppercase flex items-center gap-2">
            <Zap className="w-3 h-3 animate-pulse" /> The Next Frontier
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
            Scaling Civic <br /> Intelligence.
          </h1>
          <p className="text-xl text-white/40 font-bold leading-relaxed">
            CivicPulse is not just a reporting tool. It is the operating system for modern, transparent, and responsive cities. Explore our roadmap to a decentralized civic future.
          </p>
        </div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {roadmap.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`glass rounded-[2rem] p-8 border ${item.color.split(' ')[0]} hover:glass-glow transition-all group`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform ${item.color.split(' ')[1]}`}>
                  {item.icon}
                </div>
                <div className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-white/5 border border-white/10">
                  {item.status}
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30">{item.phase}</div>
                <h3 className="text-xl font-black tracking-tight">{item.title}</h3>
                <p className="text-sm font-bold text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Future Tech Stack */}
        <div className="glass rounded-[3rem] p-12 border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
            <div className="max-w-xl space-y-4">
              <h2 className="text-4xl font-black tracking-tight">Tech Stack Evolution</h2>
              <p className="font-bold text-white/40">Integrating cutting-edge technologies to enhance transparency and responsiveness at the city scale.</p>
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] transform rotate-90 origin-bottom-right mb-4">Engineering Preview</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                   {f.icon}
                </div>
                <h4 className="font-black text-lg">{f.title}</h4>
                <p className="text-sm font-bold text-white/30 leading-relaxed">{f.desc}</p>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase text-accent hover:gap-3 transition-all">
                  Learn More <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Call to Action */}
        <div className="mt-20 text-center space-y-8">
           <div className="inline-block glass rounded-full px-6 py-2 border-white/10">
              <p className="text-xs font-bold text-white/60">Ready to build the future of governance? <span className="text-accent underline cursor-pointer">Join our waitlist</span></p>
           </div>
           <div className="flex justify-center gap-4 opacity-10">
              <Database className="w-8 h-8" />
              <Network className="w-8 h-8" />
              <Cpu className="w-8 h-8" />
           </div>
        </div>
      </div>
    </div>
  );
}
