"use client";

import Link from "next/link";
import {
  Menu, X, Globe,
  Activity, ArrowRight, Shield, BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Report", href: "/report" },
    { name: "Track", href: "/track" },
    { name: "My Pulse", href: "/dashboard" },
    { name: "Public Data", href: "/public" },
    { name: "Admin", href: "/admin" },
    { name: "Roadmap", href: "/future" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass rounded-2xl flex items-center justify-between px-6 py-3 transition-all duration-500 ${
          scrolled ? "bg-black/60 backdrop-blur-2xl border-white/10" : "bg-white/5 border-white/5"
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,122,0,0.3)] group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              CIVIC<span className="text-accent not-italic">PULSE</span>
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                    link.name === "Admin" ? "text-amber-400/60 hover:text-amber-400" : "text-white/40 hover:text-white"
                  }`}
                >
                  {link.name === "Admin" && <Shield className="w-3 h-3" />}
                  {link.name === "Public Data" && <BarChart3 className="w-3 h-3" />}
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:bg-white/10 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-accent" />
              {language === 'en' ? 'हिन्दी' : 'English'}
            </button>

            {/* CTA */}
            <Link
              href="/report"
              className="h-10 px-5 rounded-xl bg-accent text-white text-sm font-bold shadow-[0_0_20px_rgba(255,122,0,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              Report <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 right-6 z-[110] md:hidden"
          >
            <div className="glass rounded-[2rem] p-8 space-y-6">
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-xl font-bold text-white/70 hover:text-accent transition-colors block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="pt-6 border-t border-white/5">
                <button
                  onClick={() => {
                    setLanguage(language === 'en' ? 'hi' : 'en');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 glass px-4 py-4 rounded-2xl text-lg font-bold text-white"
                >
                  <Globe className="w-5 h-5 text-accent" />
                  {language === 'en' ? 'Switch to हिन्दी' : 'Switch to English'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
