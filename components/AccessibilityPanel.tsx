
"use client";

import { useState, useRef, useEffect } from "react";
import { Eye, Focus, X, CheckCircle2, RotateCcw, Moon, Sun, Type } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessibility } from "../contexts/AccessibilityContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "next-themes";

export default function AccessibilityPanel() {
  const { fontSize, setFontSize, highContrast, setHighContrast, focusMode, setFocusMode } = useAccessibility();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const resetAll = () => {
    setFontSize('normal');
    setHighContrast(false);
    setFocusMode(false);
  };

  const isAnyActive = highContrast || focusMode || fontSize !== 'normal';

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end" ref={panelRef}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mb-4 w-80 bg-[#0A0F1C]/95 backdrop-blur-xl border border-[#1C2433] shadow-2xl rounded-2xl overflow-hidden origin-bottom-right"
            >
    
              <div className="bg-[#121826]/80 px-5 py-4 border-b border-[#1C2433] flex justify-between items-center">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-400" />
                  Accessibility Tools
                </h3>
                <div className="flex items-center gap-2">
                  {isAnyActive && (
                    <button
                      onClick={resetAll}
                      className="p-1.5 text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors flex items-center gap-1"
                      title="Reset to default"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                  )}
                  <div className="w-px h-4 bg-gray-700 mx-1"></div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-md transition-colors p-1"
                    aria-label="Close accessibility panel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
    
              <div className="p-5 space-y-6 text-gray-200">
    
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold flex items-center gap-2">
                    {theme === "dark" ? <Moon className="w-4 h-4 text-gray-400" /> : <Sun className="w-4 h-4 text-gray-400" />}
                    Theme Preference
                  </span>
                  <div className="flex bg-[#0A0F1C] rounded-lg p-1 border border-[#1C2433]">
                    <button
                      onClick={() => setTheme("light")}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${theme === "light" ? "bg-white text-[#0A0F1C] shadow-sm" : "text-gray-400 hover:text-white"}`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${theme === "dark" ? "bg-[#1C2433] text-white shadow-sm border border-gray-600/30" : "text-gray-400 hover:text-white"}`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
    
                <div className="h-px w-full bg-[#1C2433]"></div>
    
                {/* Font Size Toggle */}
                <div className="space-y-3">
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <Type className="w-4 h-4 text-gray-400" />
                    {t('fontSize') || 'Text Size'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFontSize('normal')}
                      className={`flex items-center justify-center py-2.5 rounded-xl text-sm border transition-all ${fontSize === 'normal' ? 'border-gray-500 bg-[#1C2433] text-gray-200 font-semibold shadow-inner' : 'border-[#1C2433] bg-[#0A0F1C] text-gray-400 hover:border-gray-600 hover:text-gray-300'}`}
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => setFontSize('large')}
                      className={`flex items-center justify-center py-2.5 rounded-xl text-lg font-medium border transition-all ${fontSize === 'large' ? 'border-gray-500 bg-[#1C2433] text-gray-200 font-bold shadow-inner' : 'border-[#1C2433] bg-[#0A0F1C] text-gray-400 hover:border-gray-600 hover:text-gray-300'}`}
                    >
                      Large
                    </button>
                  </div>
                </div>
    
                <div className="h-px w-full bg-[#1C2433]"></div>
    
                {/* Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between group">
                    <span className="text-sm font-semibold">{t('highContrast') || 'High Contrast'}</span>
                    <button
                      onClick={() => setHighContrast(!highContrast)}
                      className={`w-12 h-6 rounded-full transition-all relative focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2 focus:ring-offset-[#121826] ${highContrast ? 'bg-[#FF7A00]' : 'bg-[#1C2433] hover:bg-gray-700'}`}
                      aria-pressed={highContrast}
                      aria-label="Toggle high contrast"
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 shadow-sm ${highContrast ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
    
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <Focus className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold">Keyboard Focus</span>
                    </div>
                    <button
                      onClick={() => setFocusMode(!focusMode)}
                      className={`w-12 h-6 rounded-full transition-all relative focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2 focus:ring-offset-[#121826] ${focusMode ? 'bg-[#FF7A00]' : 'bg-[#1C2433] hover:bg-gray-700'}`}
                      aria-pressed={focusMode}
                      aria-label="Toggle keyboard focus outlines"
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 shadow-sm ${focusMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    
        {/* Official Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-[#121826] text-white shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-gray-500/30 relative border border-[#1C2433]"
          aria-label="Accessibility options"
          aria-expanded={isOpen}
        >
          <Eye className="w-6 h-6 text-gray-300" />
          {isAnyActive && !isOpen && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#FF7A00] border-2 border-[#121826] rounded-full"></span>
          )}
        </button>
    </div>
  );
}
