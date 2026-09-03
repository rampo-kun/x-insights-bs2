"use client";

import { motion } from "framer-motion";

export default function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full max-w-xl mx-auto px-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono text-white/40 tracking-widest">
          QUESTION {Math.min(current + 1, total)} / {total}
        </span>
        <span className="text-[11px] font-mono text-accent2 tracking-widest">
          {pct}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent2"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
