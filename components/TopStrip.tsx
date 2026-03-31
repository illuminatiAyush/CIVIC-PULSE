"use client";

import { useLanguage } from "../contexts/LanguageContext";
import { useAccessibility } from "../contexts/AccessibilityContext";

export default function TopStrip() {
  const { language, setLanguage } = useLanguage();
  const { fontSize, setFontSize } = useAccessibility();

  const handleFontSizeChange = (size: 'small' | 'normal' | 'large') => {
    // We already have 'normal' and 'large' in the context. We'll simulate A- A A+ by just relying on normal and large for now, or extending the context.
    setFontSize(size as any);
  };

  return (
    <div className="bg-[#0B1F3A] text-white py-1.5 px-4 md:px-6 w-full text-xs font-medium flex flex-col sm:flex-row justify-between items-center z-50 relative border-b border-white/10">
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        <span role="img" aria-label="India Flag">🇮🇳</span>
        <span className="opacity-90 tracking-wide">Government of India | CivicPulse Smart Civic Reporting System</span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Accessibility Controls */}
        <div className="flex items-center gap-1 bg-white/10 rounded px-1.5 py-0.5">
          <button 
            onClick={() => handleFontSizeChange('normal')} 
            className={`px-1.5 py-0.5 rounded hover:bg-white/20 transition-colors ${fontSize === 'normal' ? 'bg-white/20 font-bold' : 'opacity-80'}`}
            title="Standard Text Size"
            aria-label="Standard Text Size"
          >
            A
          </button>
          <button 
            onClick={() => handleFontSizeChange('large')} 
            className={`px-1.5 py-0.5 rounded text-sm hover:bg-white/20 transition-colors ${fontSize === 'large' ? 'bg-white/20 font-bold' : 'opacity-80'}`}
            title="Large Text Size"
            aria-label="Large Text Size"
          >
            A+
          </button>
        </div>

        <div className="w-px h-3 bg-white/20" />

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <span className="opacity-80 hidden sm:inline">Language:</span>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en"|"hi"|"mr")}
            className="bg-transparent text-white border-none outline-none cursor-pointer focus:ring-1 focus:ring-white/30 rounded px-1 appearance-none font-semibold"
          >
            <option value="en" className="text-black">English</option>
            <option value="hi" className="text-black">हिन्दी</option>
            <option value="mr" className="text-black">मराठी</option>
          </select>
        </div>
      </div>
    </div>
  );
}
