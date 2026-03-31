"use client";

import Link from "next/link";
import { 
  ShieldCheck, UserCheck, CheckCircle2, Navigation, ChevronDown, 
  UploadCloud, BrainCircuit, Zap, Globe, Lock, ShieldAlert, 
  FileText, Activity, Building, TrendingUp, Users, Smartphone,
  Database, Cpu, Share2, ArrowRight, Info, MapPin, Search
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import HeroSystemPreview from "../components/HeroSystemPreview";


const AnimatedCounter = ({ value, duration = 2 }: { value: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * value));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [value, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

export default function Home() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const issues = [
    { 
      type: "Garbage Dump", 
      image: "/images/garbage.jpg", 
      confidence: 98.4, 
      location: "Sector 12, Area B", 
      status: "Analyzing Context...",
      model: "Vision-R4",
      accuracy: "98.4%",
      latency: "142ms"
    },
    { 
      type: "Pothole", 
      image: "/images/pothole.jpg", 
      confidence: 94.2, 
      location: "Main Road, Ward 4", 
      status: "Evaluating Severity...",
      model: "Vision-R4",
      accuracy: "94.2%",
      latency: "118ms"
    },
    { 
      type: "Sewage Overflow", 
      image: "/images/sewage.jpg", 
      confidence: 96.1, 
      location: "East Lane, Ward 7", 
      status: "Mapping Authorities...",
      model: "Vision-R4",
      accuracy: "96.1%",
      latency: "156ms"
    },
  ];

  const [activeIssueIndex, setActiveIssueIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIssueIndex((prev) => (prev + 1) % issues.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-white overflow-hidden font-sans selection:bg-accent/30 selection:text-white">
      {/* Background Layers */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0F172A]/50 via-transparent to-[#0A0F1C]/80 pointer-events-none z-0" />
      
      {/* Radial Glow Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse-glow delay-1000 z-0" />



      <main className="relative z-10">


        {/* 1. HERO SECTION */}
        <section className="relative w-full pt-32 pb-20 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0B1F3A] to-transparent z-0 opacity-50" />
          <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-start gap-12">
            <motion.div 
              className="flex-1 text-left space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 rounded-full glass px-4 py-1.5 border-white/5 text-[10px] font-black tracking-[0.2em] uppercase text-accent">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                Digital Public Infrastructure v4.2
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-white">
                The Future of <br />
                <span className="text-gradient">Civic Pulse.</span>
              </h1>
              
              <p className="text-lg text-white/50 max-w-lg font-medium leading-relaxed">
                Empowering smart cities with a hyper-dense AI reporting network. Instantly detect, categorize, and deploy municipal resources with automated precision.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link 
                  href="/report" 
                  className="w-full sm:w-auto h-14 inline-flex items-center justify-center rounded-xl bg-accent px-10 text-base font-black text-white shadow-[0_0_40px_rgba(255,122,0,0.3)] transition-all hover:scale-105 active:scale-95 group"
                >
                  File Report <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/track" 
                  className="w-full sm:w-auto h-14 inline-flex items-center justify-center rounded-xl glass px-10 text-base font-black text-white hover:bg-white/10 transition-all active:scale-95 border-white/10"
                >
                  Track Report
                </Link>
              </div>

              {/* Micro-indicators */}
              <div className="flex items-center gap-8 pt-6 border-t border-white/5 opacity-50">
                 <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Core</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Synced</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure</span>
                 </div>
              </div>
            </motion.div>

            <motion.div 
              className="flex-1 w-full relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="absolute -inset-10 bg-accent/20 blur-[120px] rounded-full pointer-events-none animate-pulse-glow" />
              <HeroSystemPreview />
              

            </motion.div>
          </div>
        </section>

        <div className="section-divider" />

        {/* 2. WHY THIS MATTERS */}
        <section className="relative w-full py-20 bg-white/[0.01]">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="space-y-4"
            >
              <div className="text-[10px] font-black tracking-[0.5em] text-accent uppercase">System Rationale</div>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] text-white">
                Millions of signals <br />
                <span className="text-white/20">hidden in plain sight.</span>
              </h2>
              <div className="h-1 w-24 bg-accent mx-auto rounded-full shadow-[0_0_20px_#FF7A00]" />
              <p className="max-w-2xl mx-auto text-lg text-white/40 font-bold leading-relaxed">
                Disconnected reporting and manual verification cause 70% of infrastructure failures. We bridge the gap with ubiquitous intelligence.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="section-divider" />

        {/* 3. LIVE SYSTEM PANEL */}
        <section className="w-full py-20 relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
               <h3 className="text-[10px] font-black tracking-[0.4em] text-accent uppercase mb-2">Live Analysis Pipeline</h3>
               <h2 className="text-4xl font-black tracking-tighter">Hyper-Spatial Detection</h2>
            </div>
            
            <motion.div 
              className="glass rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.6)] border-white/10 relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent z-40"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[400px] lg:h-[600px] bg-black overflow-hidden group">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIssueIndex}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0"
                    >
                      <img src={issues[activeIssueIndex].image} alt="Scan" className="w-full h-full object-cover grayscale opacity-50" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    </motion.div>
                  </AnimatePresence>
                  
                  <div className="absolute inset-x-0 top-0 h-1 z-30 bg-accent shadow-[0_0_30px_#FF7A00] animate-[scan_6s_linear_infinite]"></div>
                  
                  {/* Metadata Overlay */}
                  <div className="absolute top-6 left-6 flex gap-2 z-20">
                    <div className="glass px-3 py-1 rounded-lg border-white/20 text-[10px] font-black uppercase tracking-widest text-white/70">
                      Sensor: 0X-2BA
                    </div>
                    <div className="glass px-3 py-1 rounded-lg border-white/20 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                      Status: Active
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <motion.div 
                      key={`metrics-${activeIssueIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass rounded-2xl p-6 backdrop-blur-2xl border-white/20 space-y-4"
                    >
                      <div className="grid grid-cols-3 gap-4 border-b border-white/10 pb-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Model</span>
                          <div className="text-xs font-black">{issues[activeIssueIndex].model}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Accuracy</span>
                          <div className="text-xs font-black text-emerald-400">{issues[activeIssueIndex].accuracy}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Latency</span>
                          <div className="text-xs font-black">{issues[activeIssueIndex].latency}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-accent">Confidence Matrix</span>
                          <span className="text-xs font-mono font-black">{(issues[activeIssueIndex].confidence).toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${issues[activeIssueIndex].confidence}%` }}
                            className="h-full bg-gradient-to-r from-accent/50 to-accent"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="p-8 lg:p-16 flex flex-col justify-center space-y-8 bg-[#0F172A]/80 backdrop-blur-md">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-accent shadow-lg">
                        <BrainCircuit className="w-7 h-7" />
                      </div>
                      <h3 className="text-3xl font-extrabold tracking-tight">Autonomous Infrastructure</h3>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-sm p-4 rounded-xl bg-white/[0.03] border border-white/5">
                          <span className="text-white/40 font-black uppercase text-[10px] flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> Location</span>
                          <span className="font-black tracking-tight">{issues[activeIssueIndex].location}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm p-4 rounded-xl bg-white/[0.03] border border-white/5">
                          <span className="text-white/40 font-black uppercase text-[10px] flex items-center gap-2"><Zap className="w-4 h-4 text-accent" /> Detected Issue</span>
                          <span className="font-black tracking-tight text-accent italic">{issues[activeIssueIndex].type}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm p-4 rounded-xl bg-white/[0.03] border border-white/5">
                          <span className="text-white/40 font-black uppercase text-[10px] flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-400" /> Neural Status</span>
                          <span className="text-emerald-400 font-mono font-black animate-pulse">{issues[activeIssueIndex].status}</span>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                      <span>Neural Diagnostic Logs</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-accent animate-ping" />
                        <div className="w-1 h-1 rounded-full bg-accent" />
                      </div>
                    </div>
                    <div className="font-mono text-[11px] p-6 glass rounded-2xl border-white/5 space-y-3">
                      <p className="text-accent/80 leading-relaxed italic line-clamp-1">{`[${new Date().toLocaleTimeString()}] >> INT: INIT Vision_v4 Engine...`}</p>
                      <p className="text-white/40 leading-relaxed line-clamp-1">{`[${new Date().toLocaleTimeString()}] >> MAP: Geo-spatial sync complete.`}</p>
                      <p className="text-white/40 leading-relaxed line-clamp-1">{`[${new Date().toLocaleTimeString()}] >> CLS: Severity Matrix v2.1 applied.`}</p>
                      <p className="text-emerald-500/80 leading-relaxed font-black line-clamp-1">{`[${new Date().toLocaleTimeString()}] >> OUT: Dispatch authorized.`}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="section-divider" />

        {/* 4. CITIZENS vs GOVERNMENT - RICH DENSITY */}
        <section className="relative w-full py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="glass p-12 rounded-[3.5rem] relative overflow-hidden group hover:glass-glow transition-all duration-700"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-accent/10 transition-colors" />
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-inner">
                    <Users className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black tracking-[0.4em] text-accent uppercase mb-1">User Segment</div>
                    <h3 className="text-4xl font-black tracking-tighter capitalize underline decoration-accent/30 underline-offset-8">For Citizens</h3>
                  </div>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                  {[
                    "AI image generation for report accuracy",
                    "End-to-end encrypted identity shielding",
                    "Real-time node-based tracking system",
                    "Direct priority ward official mapping",
                    "Voice-to-Report automation for accessibility"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-accent/30 hover:bg-white/[0.04] transition-all group/item">
                      <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 border border-accent/20 text-accent group-hover/item:scale-125 transition-transform">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-lg font-bold text-white/50 group-hover/item:text-white transition-colors leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="glass p-12 rounded-[3.5rem] relative overflow-hidden group hover:glass-glow transition-all duration-700"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shadow-inner">
                    <Building className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase mb-1">Bureaucracy Hub</div>
                    <h3 className="text-4xl font-black tracking-tighter capitalize underline decoration-blue-500/30 underline-offset-8">For Government</h3>
                  </div>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                  {[
                    "Automated high-frequency task triaging",
                    "Geospatial heatmaps for failure density",
                    "SLA-driven official accountability metrics",
                    "Open Data API for inter-dept compliance",
                    "Historical predictive data for maintenance"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all group/item">
                      <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover/item:scale-125 transition-transform">
                        <Building className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-lg font-bold text-white/50 group-hover/item:text-white transition-colors leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* 5. PLATFORM INTELLIGENCE - DENSE CARDS */}
        <section className="w-full py-24 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <div className="text-[10px] font-black tracking-[1em] text-accent uppercase">Core Assets</div>
              <h2 className="text-5xl font-black tracking-tighter">Hyper-Scale Intelligence</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: "AI Detection", 
                  desc: "Neural networks optimized for high-density municipal corporations.", 
                  icon: <Smartphone className="w-10 h-10"/>,
                  glow: "group-hover:shadow-[0_0_50px_rgba(255,122,0,0.25)]",
                  meta: { model: "Vision-G", acc: "98.2%", lat: "120ms" }
                },
                { 
                  title: "Smart Routing", 
                  desc: "GPS coordinate mapping to accountable departments with zero latency.", 
                  icon: <Share2 className="w-10 h-10"/>,
                  glow: "group-hover:shadow-[0_0_50px_rgba(59,130,246,0.25)]",
                  meta: { model: "Graph-v1", acc: "99.9%", lat: "45ms" }
                },
                { 
                  title: "Immutable Logs", 
                  desc: "Distributed ledger logging for every report lifecycle, ensuring data trust.", 
                  icon: <Database className="w-10 h-10"/>,
                  glow: "group-hover:shadow-[0_0_50px_rgba(16,185,129,0.25)]",
                  meta: { model: "Sync-X", acc: "100%", lat: "2ms" }
                }
              ].map((card, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`glass p-10 rounded-[2.5rem] group transition-all duration-700 hover:-translate-y-4 hover:glass-glow border-white/5 ${card.glow}`}
                >
                  <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-10 text-accent group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-700 shadow-inner">
                    <div className="group-hover:animate-pulse">{card.icon}</div>
                  </div>
                  
                  <div className="space-y-4 mb-10">
                    <h4 className="text-3xl font-black tracking-tighter">{card.title}</h4>
                    <p className="text-white/40 font-bold leading-relaxed">{card.desc}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
                    <div className="space-y-1">
                      <div className="text-[8px] font-black uppercase text-white/20 tracking-widest">Model</div>
                      <div className="text-[10px] font-black text-white/60">{card.meta.model}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[8px] font-black uppercase text-white/20 tracking-widest">Acc</div>
                      <div className="text-[10px] font-black text-emerald-400">{card.meta.acc}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[8px] font-black uppercase text-white/20 tracking-widest">Lat</div>
                      <div className="text-[10px] font-black text-white/60">{card.meta.lat}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WORKFLOW SECTION - WITH CONNECTIVITY */}
        <section className="relative w-full py-24 overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-[80%] bg-accent/5 -translate-y-1/2 blur-[150px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6">
             <div className="text-center mb-24 relative z-10">
                <div className="text-[10px] font-black tracking-[1em] text-accent uppercase mb-4">Pipeline Architecture</div>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter">The Pulse Engine</h2>
             </div>

             <div className="relative space-y-24">
                {/* Connecting Line */}
                <div className="absolute left-1/2 top-40 bottom-40 w-px bg-gradient-to-b from-accent/0 via-accent/40 to-accent/0 hidden lg:block" />

                {[
                  { 
                    num: "01",
                    tag: "Collection",
                    title: "Instant Capture",
                    desc: "One photograph captures high-fidelity evidence and precise geo-coordinates instantly.",
                    image: "/images/garbage.jpg",
                    reverse: false,
                    meta: "4K Raw Data Capture"
                  },
                  { 
                    num: "02",
                    tag: "Processing",
                    title: "AI Analysis",
                    desc: "Vision transformers classify 18+ municipal failure patterns with sub-second latency.",
                    image: "/images/pothole.jpg",
                    reverse: true,
                    meta: "Neural-Link v2"
                  },
                  { 
                    num: "03",
                    tag: "Dispatch",
                    title: "Smart Routing",
                    desc: "Proprietary algorithms bridge the gap between detection and accountable officials.",
                    image: "/images/sewage.jpg",
                    reverse: false,
                    meta: "Auto-Dispatch"
                  }
                ].map((step, i) => (
                  <div key={i} className={`flex flex-col ${step.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 relative z-10`}>
                     {/* Step Indicator Dot */}
                     <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-accent shadow-[0_0_20px_#FF7A00] hidden lg:block z-50">
                        <div className="w-full h-full rounded-full animate-ping bg-accent opacity-75" />
                     </div>

                     <motion.div 
                      initial={{ opacity: 0, x: step.reverse ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex-1 space-y-6"
                     >
                        <div className="flex items-center gap-4">
                          <span className="text-8xl font-black text-white/5 font-mono leading-none">{step.num}</span>
                          <div className="glass px-3 py-1 rounded-lg border-white/5 text-[10px] font-black uppercase text-accent tracking-widest">{step.tag}</div>
                        </div>
                        <h3 className="text-5xl font-black tracking-tighter">{step.title}</h3>
                        <p className="text-xl text-white/40 font-bold leading-relaxed">{step.desc}</p>
                        <div className="flex items-center gap-2 text-xs font-black text-white/60">
                           <Activity className="w-4 h-4 text-accent" />
                           {step.meta}
                        </div>
                     </motion.div>
                     <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="flex-1 w-full"
                     >
                        <div className="glass aspect-[16/10] rounded-[3rem] overflow-hidden border-white/5 relative group p-4 bg-white/5">
                           <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                            <img src={step.image} alt={step.title} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
                            <div className="absolute top-4 left-4 glass px-3 py-1 rounded-lg border-white/20 text-[10px] font-black uppercase tracking-widest text-white/70">
                              Real-Time Node
                            </div>
                           </div>
                        </div>
                     </motion.div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* METRICS SECTION - DENSE */}
        <section className="relative w-full py-24 bg-white/[0.01] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
              {[
                { val: 1420, dur: 2.5, lab: "Ward Officers", accent: "text-accent" },
                { val: 89, dur: 2, lab: "Optimization Rate", accent: "text-blue-400", suffix: "%" },
                { val: 99, dur: 3, lab: "Uptime SLA", accent: "text-emerald-400", suffix: ".9" }
              ].map((m, i) => (
                <div key={i} className={`space-y-2 relative ${i !== 2 ? 'md:border-r md:border-white/5 md:pr-12' : ''}`}>
                   <h4 className={`text-7xl md:text-8xl font-black tracking-tighter ${m.accent} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
                    <AnimatedCounter value={m.val} duration={m.dur} />{m.suffix}
                   </h4>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{m.lab}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST SECTION - MICRO ELEMENTS */}
        <section className="w-full py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { icon: <Lock className="w-10 h-10" />, title: "Secure", desc: "Military-grade encryption for all citizen data flow.", color: "text-accent" },
                { icon: <Globe className="w-10 h-10" />, title: "Transparent", desc: "Public immutable logs for trust and accountability.", color: "text-blue-400" },
                { icon: <Cpu className="w-10 h-10" />, title: "Scalable", desc: "Designed for multi-million node urban sensor nets.", color: "text-emerald-400" }
              ].map((t, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-6 group">
                   <div className={`w-24 h-24 rounded-[2rem] glass border-white/10 flex items-center justify-center ${t.color} group-hover:glass-glow group-hover:scale-110 transition-all duration-700 shadow-inner rotate-3 group-hover:rotate-0`}>
                     {t.icon}
                   </div>
                   <div className="space-y-3">
                    <h3 className="text-2xl font-black tracking-tight underline decoration-white/10 underline-offset-8">{t.title}</h3>
                    <p className="text-white/40 font-bold text-base group-hover:text-white/70 transition-colors leading-relaxed">{t.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA - IMMERSIVE */}
        <section className="relative w-full py-40 overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[150%] bg-accent/20 rounded-full blur-[150px] pointer-events-none" />
          
          <div className="max-w-5xl mx-auto px-6 text-center space-y-12 relative z-10">
             <div className="space-y-4">
              <div className="text-[10px] font-black tracking-[0.5em] text-accent uppercase">Deployment Ready</div>
              <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] text-white">
                Ready to sync <br /> 
                <span className="text-gradient underline decoration-accent/30 underline-offset-8">your city?</span>
              </h2>
             </div>
             
             <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
               <Link 
                 href="/report" 
                 className="w-full sm:w-auto h-20 inline-flex items-center justify-center rounded-2xl bg-accent px-16 text-xl font-black text-white shadow-[0_0_60px_rgba(255,122,0,0.5)] transition-all hover:scale-110 active:scale-95 group"
               >
                 Launch Protocol <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
               </Link>
               <Link 
                 href="/admin" 
                 className="w-full sm:w-auto h-20 inline-flex items-center justify-center rounded-2xl glass px-16 text-xl font-black text-white hover:bg-white/10 transition-all active:scale-95 border-white/20"
               >
                 Admin Portal
               </Link>
             </div>

             <div className="pt-20 flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                <div className="text-[12px] font-black uppercase tracking-[0.4em]">Smart City AI</div>
                <div className="text-[12px] font-black uppercase tracking-[0.4em]">Gov Tech v4</div>
                <div className="text-[12px] font-black uppercase tracking-[0.4em]">Open Data.Org</div>
                <div className="text-[12px] font-black uppercase tracking-[0.4em]">Next-Gen India</div>
             </div>
          </div>
        </section>

      </main>
    </div>
  );
}
