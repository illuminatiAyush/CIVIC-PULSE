"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UploadCloud, BrainCircuit, FileSignature, Send, Building2 } from "lucide-react";

const steps = [
  { id: 1, title: "Upload Image", icon: UploadCloud },
  { id: 2, title: "AI Detects Issue", icon: BrainCircuit },
  { id: 3, title: "Review Report", icon: FileSignature },
  { id: 4, title: "Submit Complaint", icon: Send },
  { id: 5, title: "Authority Assigned", icon: Building2 },
];

export default function HeroStepFlow() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-[#112a4f] border border-blue-800/50 rounded-2xl shadow-2xl relative overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a182d] to-transparent z-0"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-0">
        
        {/* Horizontal & Vertical Connector Lines */}
        <div className="absolute hidden sm:block top-6 left-8 right-8 h-0.5 bg-blue-900/50 z-0">
          <motion.div 
            className="h-full bg-blue-400"
            initial={{ width: "0%" }}
            animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        <div className="absolute sm:hidden top-8 bottom-8 left-6 w-0.5 bg-blue-900/50 z-0">
          <motion.div 
            className="w-full bg-blue-400"
            initial={{ height: "0%" }}
            animate={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStep;
          const isPast = index < activeStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-row sm:flex-col items-center gap-4 sm:gap-3 w-full sm:w-auto">
              
              <motion.div
                className={`w-12 h-12 flex items-center justify-center rounded-full border-2 bg-[#0B1F3A] flex-shrink-0
                  ${isActive ? "border-blue-400 text-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]" 
                  : isPast ? "border-blue-600 text-blue-600" 
                  : "border-blue-900/50 text-blue-900"}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: isActive || isPast ? 1 : 0.5,
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.4 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>

              <motion.span
                className={`text-xs sm:text-[10px] md:text-xs font-semibold text-center mt-1 sm:max-w-[4rem] px-2 sm:px-0
                  ${isActive ? "text-blue-200" : isPast ? "text-blue-400/80" : "text-blue-800"}`}
                animate={{
                  opacity: isActive || isPast ? 1 : 0.4,
                }}
              >
                {step.title}
              </motion.span>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}
