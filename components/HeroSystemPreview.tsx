"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, BrainCircuit, FileSignature, Send, Building2, MapPin, CheckCircle, Clock, Activity } from "lucide-react";

const steps = [
  { id: 1, title: "Upload", icon: UploadCloud },
  { id: 2, title: "AI Detects", icon: BrainCircuit },
  { id: 3, title: "Review", icon: FileSignature },
  { id: 4, title: "Submit", icon: Send },
  { id: 5, title: "Authority", icon: Building2 },
];

export default function HeroSystemPreview() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-card border border-border shadow-xl overflow-hidden relative backdrop-blur-sm h-[480px] flex flex-col">
      
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>

      {/* 🔴 SECTION 1 — LIVE FLOW (TOP) */}
      <div className="p-6 border-b border-border relative">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 mb-6 flex items-center justify-between">
          <span>Live Detection Pipeline</span>
          <span className="flex items-center gap-1.5 normal-case font-medium text-accent">
             <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            System Active
          </span>
        </h3>
        
        <div className="relative flex justify-between items-start">
          {/* Connector Line */}
          <div className="absolute top-5 left-6 right-6 h-[2px] bg-muted z-0 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-accent shadow-[0_0_10px_rgba(255,122,0,0.5)]"
              initial={{ width: "0%" }}
              animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            const isPast = index <= activeStep;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <motion.div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 bg-background
                    ${isActive ? "border-accent text-accent shadow-[0_0_15px_rgba(255,122,0,0.3)]" 
                    : isPast ? "border-accent/40 text-accent/60 bg-accent/5" 
                    : "border-border text-muted-foreground/40"}`}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    opacity: isPast ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.div>
                <motion.span
                  className={`text-[10px] font-semibold text-center mt-1 
                    ${isActive ? "text-foreground" : isPast ? "text-muted-foreground" : "text-muted-foreground/40"}`}
                  animate={{ opacity: isPast ? 1 : 0.4 }}
                >
                  {step.title}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔴 SECTION 2 — AI REPORT PREVIEW (CENTER) */}
      <div className="p-6 bg-muted/20">
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex gap-4"
            >
              <div className="w-16 h-16 rounded-lg bg-muted border border-border flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-accent/5"></div>
                {activeStep >= 1 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="w-full h-full bg-[url('/images/pothole.jpg')] bg-cover bg-center grayscale opacity-80"
                  />
                ) : (
                  <UploadCloud className="w-6 h-6 text-muted-foreground" />
                )}
                {activeStep === 1 && (
                  <motion.div 
                    className="absolute inset-x-1 top-0 h-1 bg-accent z-20"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-foreground leading-none">
                      {activeStep >= 1 ? "Road Infrastructure Damage" : "Awaiting Image"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activeStep >= 1 ? "Detected: Severe Pothole" : "Upload an image to start analysis"}
                    </p>
                  </div>
                  {activeStep >= 1 && (
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-medium text-green-600 border border-green-500/20">
                      94% Match
                    </span>
                  )}
                </div>

                {activeStep >= 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" /> Andheri West, Ward K/W
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 🔴 SECTION 3 — STATUS / SYSTEM FEEDBACK (BOTTOM) */}
      <div className="px-6 py-4 bg-background border-t border-border flex items-center justify-between text-xs font-semibold">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 5 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-foreground"
          >
            {activeStep === 0 && <><Clock className="w-3.5 h-3.5 text-accent" /> System Idle - Waiting for Input...</>}
            {activeStep === 1 && <><Activity className="w-3.5 h-3.5 text-orange-500" /> Running LLaMA Zero-Shot Vision Model...</>}
            {activeStep === 2 && <><CheckCircle className="w-3.5 h-3.5 text-accent" /> Draft Report Generated - Awaiting Citizen Review.</>}
            {activeStep === 3 && <><UploadCloud className="w-3.5 h-3.5 text-yellow-600" /> Submitting Encrypted Report to Municipal DB...</>}
            {activeStep === 4 && <><Building2 className="w-3.5 h-3.5 text-green-600" /> Assigned to Official. Expected SLA: 48 hours.</>}
          </motion.div>
        </AnimatePresence>
      </div>
      
    </div>
  );
}
