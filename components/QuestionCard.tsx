"use client";

import { motion } from "framer-motion";
import {
  Building2,
  LineChart,
  Boxes,
  Users,
  BrainCircuit,
  AlertTriangle,
  Factory,
  Globe2,
  Users2,
  Cpu,
  Sparkles,
  Clock,
  Globe,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Question, Option } from "@/lib/questions";

const ICONS: Record<string, LucideIcon> = {
  Building2,
  LineChart,
  Boxes,
  Users,
  BrainCircuit,
  AlertTriangle,
  Factory,
  Globe2,
  Users2,
  Cpu,
  Sparkles,
  Clock,
  Globe,
};

export default function QuestionCard({
  question,
  selectedValue,
  onSelect,
}: {
  question: Question;
  selectedValue: string | number | null;
  onSelect: (value: string | number) => void;
}) {
  const Icon = ICONS[question.icon] ?? Building2;

  return (
    <motion.div
      key={question.key}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="glass rounded-2xl p-6 sm:p-8 shadow-card w-full"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent2" />
        </div>
        <div>
          <h2 className="font-display text-lg sm:text-xl font-semibold text-white leading-snug">
            {question.title}
          </h2>
          <p className="text-sm text-white/50 mt-1">{question.subtitle}</p>
        </div>
      </div>

      <div className="grid gap-3">
        {question.options.map((opt: Option, i) => {
          const isSelected = selectedValue === opt.value;
          return (
            <motion.button
              key={String(opt.value) + i}
              onClick={() => onSelect(opt.value)}
              whileTap={{ scale: 0.98 }}
              className={`group relative flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-colors ${
                isSelected
                  ? "border-accent bg-accent/10"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20"
              }`}
            >
              <div>
                <p
                  className={`text-sm sm:text-base font-medium ${
                    isSelected ? "text-white" : "text-white/85"
                  }`}
                >
                  {opt.label}
                </p>
                {opt.sublabel && (
                  <p className="text-xs text-white/40 mt-0.5">{opt.sublabel}</p>
                )}
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                  isSelected
                    ? "border-accent bg-accent"
                    : "border-white/20"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-ink" strokeWidth={3} />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
