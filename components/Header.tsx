"use client";

import { Stethoscope } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between w-full max-w-5xl mx-auto px-4 pt-6 pb-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center shadow-glow">
          <Stethoscope className="w-5 h-5 text-ink" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className="font-display font-semibold text-sm tracking-wide text-white">
            AI BUSINESS DOCTOR
          </p>
          <p className="text-[11px] text-white/50 font-mono tracking-widest">
            X-INSIGHTS · MSME SUMMIT
          </p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-xs text-white/40 font-mono">
        <span className="w-2 h-2 rounded-full bg-good animate-pulseGlow" />
        60-SECOND DIAGNOSTIC
      </div>
    </header>
  );
}
