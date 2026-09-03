"use client";

import { motion } from "framer-motion";
import { Activity, Cpu, FileSearch } from "lucide-react";
import { useEffect, useState } from "react";

const STEPS = [
  { icon: Activity, label: "Computing business health score..." },
  { icon: FileSearch, label: "Benchmarking against industry data..." },
  { icon: Cpu, label: "Generating AI prescription..." },
];

export default function LoadingAnalysis() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % STEPS.length);
    }, 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 px-4">
      <div className="relative w-20 h-20">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-accent/30"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-t-2 border-accent2"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-accent2 text-sm">
          AI
        </div>
      </div>

      <div className="text-center">
        <p className="font-display text-lg font-semibold text-white">
          Diagnosing your business...
        </p>
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-white/50 mt-2 font-mono"
        >
          {STEPS[idx].label}
        </motion.p>
      </div>
    </div>
  );
}
