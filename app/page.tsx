"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Stethoscope, ArrowRight } from "lucide-react";
import { Answers, ScoreResult, AiPrescription } from "@/lib/types";
import { computeScore } from "@/lib/scoring";
import Header from "@/components/Header";
import IntakeForm from "@/components/IntakeForm";
import LoadingAnalysis from "@/components/LoadingAnalysis";
import ResultsView from "@/components/ResultsView";

type Stage = "intro" | "intake" | "loading" | "results";

export default function Home() {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [prescription, setPrescription] = useState<AiPrescription | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  async function handleIntakeComplete(finalAnswers: Answers) {
    const result = computeScore(finalAnswers);
    setAnswers(finalAnswers);
    setScore(result);
    setStage("loading");

    try {
      const res = await fetch("/api/prescribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers, score: result }),
      });
      const data: AiPrescription = await res.json();
      setPrescription(data);
    } catch (err) {
      console.error("Prescription fetch failed:", err);
      setPrescription({
        executive_summary:
          "Your diagnostic is complete — here's your business health snapshot.",
        competitor_insight:
          "Top performers in your sector are increasingly data-driven.",
        ai_prescription:
          "1) Start logging your core metrics daily. 2) Review them weekly to spot trends early.",
        source: "fallback",
      });
    } finally {
      setStage("results");
    }
  }

  function handleRetake() {
    setAnswers(null);
    setScore(null);
    setPrescription(null);
    setStage("intro");
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col justify-center py-8">
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center px-4 py-16 gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center shadow-glow">
                <Stethoscope className="w-8 h-8 text-ink" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-white max-w-xl">
                  What&apos;s your{" "}
                  <span className="text-gradient">Business Archetype?</span>
                </h1>
                <p className="text-white/50 mt-3 max-w-md mx-auto text-sm sm:text-base">
                  Answer 6 quick questions. Get a deterministic health score,
                  a witty persona, and an AI-generated prescription for your
                  #1 bottleneck — in under 60 seconds.
                </p>
              </div>
              <button
                onClick={() => setStage("intake")}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent2 text-ink font-semibold px-6 py-3.5 shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Start Diagnosis
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-6 text-white/30 text-xs font-mono mt-2">
                <span>6 QUESTIONS</span>
                <span>·</span>
                <span>60 SECONDS</span>
                <span>·</span>
                <span>FREE</span>
              </div>
            </motion.div>
          )}

          {stage === "intake" && (
            <motion.div
              key="intake"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <IntakeForm onComplete={handleIntakeComplete} />
            </motion.div>
          )}

          {stage === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingAnalysis />
            </motion.div>
          )}

          {stage === "results" && answers && score && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultsView
                answers={answers}
                score={score}
                prescription={prescription}
                captureRef={captureRef}
                onRetake={handleRetake}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
