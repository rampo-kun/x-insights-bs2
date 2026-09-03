"use client";

import { RefObject } from "react";
import { motion } from "framer-motion";
import {
  RefreshCcw,
  TrendingUp,
  Sparkles,
  Stethoscope,
  ShieldAlert,
} from "lucide-react";
import { Answers, ScoreResult, AiPrescription, UserProfile } from "@/lib/types";
import { SECTOR_BENCHMARKS } from "@/lib/personas";
import ScoreGauge from "./ScoreGauge";
import PillarRadar from "./PillarRadar";
import PersonaBadge from "./PersonaBadge";
import DownloadPdfButton from "./DownloadPdfButton";

export default function ResultsView({
  profile,
  answers,
  score,
  prescription,
  captureRef,
  onRetake,
}: {
  profile: UserProfile;
  answers: Answers;
  score: ScoreResult;
  prescription: AiPrescription | null;
  captureRef: RefObject<HTMLDivElement>;
  onRetake: () => void;
}) {
  const { archetype } = score;
  const sector = answers.q2_sector ?? "IT & Services";
  const benchmark = SECTOR_BENCHMARKS[sector] ?? SECTOR_BENCHMARKS["IT & Services"];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        ref={captureRef}
        id="pdf-capture-root"
        className="glass rounded-2xl p-6 sm:p-8 shadow-card"
        style={{
          backgroundColor: "#12182B",
        }}
      >
        {/* Report header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-white/10 pb-4 mb-6 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center">
              <Stethoscope className="w-4.5 h-4.5 text-ink" />
            </div>
            <div>
              <p className="font-display font-semibold text-sm text-white">
                AI BUSINESS DOCTOR
              </p>
              <p className="text-[10px] text-white/40 font-mono tracking-widest">
                X-INSIGHTS DIAGNOSTIC REPORT
              </p>
            </div>
          </div>

          {/* User Profile Information */}
          <div className="text-left sm:text-right">
            <p className="text-sm font-semibold text-white">{profile?.companyName}</p>
            <p className="text-xs text-white/60">
              {profile?.name} <span className="opacity-50 mx-1">|</span> {profile?.email}
            </p>
            <p className="text-[10px] font-mono text-white/30 mt-1">
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Persona hero */}
        <div className="text-center mb-6">
          <span className="text-5xl">{archetype.emoji}</span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mt-2 text-gradient">
            {archetype.name}
          </h1>
          <p className="text-white/60 text-sm mt-1 italic">
            &ldquo;{archetype.tagline}&rdquo;
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <PersonaBadge archetype={archetype} />
            <span className="text-[11px] font-mono tracking-wide px-2.5 py-1 rounded-full border border-white/15 text-white/50">
              {answers.q1_msme_type?.toUpperCase()} · {sector.toUpperCase()} · {answers.q3_employees} EMPLOYEES
            </span>
          </div>
        </div>

        {/* Gauge + Radar */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 flex flex-col items-center">
            <p className="text-xs font-mono text-white/40 tracking-widest mb-1">
              BUSINESS HEALTH SCORE
            </p>
            <ScoreGauge
              score={score.totalScore}
              maxScore={score.maxScore}
              colorFrom={archetype.colorFrom}
              colorTo={archetype.colorTo}
            />
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
            <p className="text-xs font-mono text-white/40 tracking-widest mb-1 text-center">
              5-PILLAR BREAKDOWN
            </p>
            <PillarRadar pillars={score.pillars} />
          </div>
        </div>

        {/* Persona description */}
        <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 mb-4">
          <p className="text-sm text-white/70 leading-relaxed">
            {archetype.description}
          </p>
        </div>

        {/* AI Prescription */}
        <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 to-accent2/5 p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent2" />
            <p className="font-display font-semibold text-sm text-white">
              AI Copilot Diagnosis
            </p>
            {prescription?.source === "fallback" && (
              <span className="text-[9px] font-mono text-white/30 ml-auto">
                OFFLINE MODE
              </span>
            )}
          </div>

          {prescription ? (
            <div className="space-y-3">
              <p className="text-sm text-white/85 leading-relaxed">
                {prescription.executive_summary}
              </p>
              <div className="flex items-start gap-2 text-xs text-white/60 bg-black/20 rounded-lg p-3">
                <TrendingUp className="w-3.5 h-3.5 text-accent2 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-white/80">
                    {sector} sector benchmark ({benchmark.cagr} CAGR):
                  </strong>{" "}
                  {prescription.competitor_insight}
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-white/70 bg-black/20 rounded-lg p-3">
                <ShieldAlert className="w-3.5 h-3.5 text-warn mt-0.5 shrink-0" />
                <span>
                  <strong className="text-white/80">
                    Fix for &ldquo;{answers.q9_challenge}&rdquo;:
                  </strong>{" "}
                  {prescription.ai_prescription}
                </span>
              </div>
              <p className="text-[11px] text-white/40 text-center pt-1">
                Internal pressure: <span className="text-white/60">{answers.q11_time_consuming}</span>
                {"  ·  "}
                External pressure: <span className="text-white/60">{answers.q12_external_factor}</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-white/50">Generating prescription...</p>
          )}
        </div>

        <p className="text-center text-[10px] text-white/25 font-mono">
          Generated by AI Business Doctor · X-Insights © {new Date().getFullYear()} · Not financial advice
        </p>
      </motion.div>

      {/* Actions (outside capture area, not part of PDF) */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <DownloadPdfButton
          targetRef={captureRef}
          filename={`X-Insights-${profile?.companyName ? profile.companyName.replace(/\s+/g, "-") + "-" : ""}${archetype.name.replace(/\s+/g, "-")}-Report.pdf`}
        />
        <button
          onClick={onRetake}
          className="flex items-center gap-2 rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-medium text-sm px-5 py-3 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Retake Diagnosis
        </button>
      </div>
    </div>
  );
}