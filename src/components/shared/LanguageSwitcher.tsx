"use client";

import React, { useEffect, useState, useRef } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<"en" | "es">("es");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect existing google translation cookie if set
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/i);
      if (match && match[1]) {
        const lang = match[1].toLowerCase();
        if (lang === "en") {
          setCurrentLang("en");
        } else {
          setCurrentLang("es");
        }
      }
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (lang: "en" | "es") => {
    setCurrentLang(lang);
    setOpen(false);
    if (typeof window !== "undefined" && window.__applyTranslate) {
      window.__applyTranslate(lang);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200 text-slate-800 font-semibold text-xs transition-all cursor-pointer shadow-xs shrink-0"
        title="Switch Language / Cambiar idioma"
      >
        <Globe className="w-4 h-4 text-[#2E5089]" />
        <span className="font-bold tracking-wide">
          {currentLang === "en" ? "EN" : "ES"}
        </span>
        <span className="hidden sm:inline-block text-[11px] text-slate-500 font-normal border-l border-slate-300 pl-2 ml-0.5">
          {currentLang === "en" ? "English" : "Español"}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in-50 slide-in-from-top-2">
          <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Select Language
          </div>

          <button
            onClick={() => handleLanguageChange("en")}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
              currentLang === "en"
                ? "bg-[#2E5089]/10 text-[#2E5089] font-bold"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base leading-none">🇺🇸</span>
              <span>English (EN)</span>
            </div>
            {currentLang === "en" && <Check className="w-4 h-4 text-[#2E5089]" />}
          </button>

          <button
            onClick={() => handleLanguageChange("es")}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
              currentLang === "es"
                ? "bg-[#2E5089]/10 text-[#2E5089] font-bold"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base leading-none">🇪🇸</span>
              <span>Español (ES)</span>
            </div>
            {currentLang === "es" && <Check className="w-4 h-4 text-[#2E5089]" />}
          </button>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
