"use client";

import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";
import { ShieldAlert, Activity } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="w-full bg-[#060B16] text-gray-200 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tighter text-white uppercase italic">
                CIVIC<span className="text-accent not-italic">PULSE</span>
              </span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed max-w-sm font-bold">
              AI-powered civic issue reporting platform that transforms citizen complaints into structured, actionable reports with intelligent routing.
            </p>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-white/40 hover:text-accent font-bold transition-colors">Home</Link></li>
              <li><Link href="/report" className="text-sm text-white/40 hover:text-accent font-bold transition-colors">Report Issue</Link></li>
              <li><Link href="/track" className="text-sm text-white/40 hover:text-accent font-bold transition-colors">Track Status</Link></li>
              <li><Link href="/dashboard" className="text-sm text-white/40 hover:text-accent font-bold transition-colors">Dashboard</Link></li>
              <li><Link href="/admin" className="text-sm text-white/40 hover:text-accent font-bold transition-colors">Admin Portal</Link></li>
              <li><Link href="/future" className="text-sm text-white/40 hover:text-accent font-bold transition-colors">Future Scope</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-white/40 hover:text-accent font-bold transition-colors">{t('privacy')}</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-accent font-bold transition-colors">{t('terms')}</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-accent font-bold transition-colors">Contact Authority</a></li>
            </ul>
          </div>

        </div>

        <div className="glass rounded-xl p-4 flex items-start gap-4 mb-8 border-white/5">
          <ShieldAlert className="w-6 h-6 text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-white/30 font-bold">
            <strong className="text-white/50">Disclaimer:</strong> This is a prototype civic reporting platform built for demonstration. Reports submitted here are not legally binding and do not replace official emergency services (112, 100, 101).
          </p>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-[10px] text-white/20 font-bold uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} CivicPulse Initiative. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed adhering to UX4G Guidelines.</p>
        </div>
      </div>
    </footer>
  );
}
