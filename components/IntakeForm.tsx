"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ArrowRight, Sparkles } from "lucide-react";
import { QUESTIONS } from "@/lib/questions";
import { Answers } from "@/lib/types";
import { INITIAL_ANSWERS, isComplete } from "@/lib/scoring";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";

export default function IntakeForm({
  onComplete,
}: {
  onComplete: (answers: Answers) => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const currentValue = (answers as any)[question.key];

  function handleSelect(value: string | number) {
    const next = { ...answers, [question.key]: value };
    setAnswers(next);
    // Auto-advance after a short beat for a snappy feel.
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep((s) => s + 1);
      }
    }, 220);
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  function handleSubmit() {
    if (isComplete(answers)) onComplete(answers);
  }

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <ProgressBar current={step} total={QUESTIONS.length} />

      <div className="w-full max-w-xl px-4">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={question.key}
            question={question}
            selectedValue={currentValue ?? null}
            onSelect={handleSelect}
          />
        </AnimatePresence>

        <div className="flex items-center justify-between mt-5">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-1 text-sm text-white/50 hover:text-white/80 disabled:opacity-0 transition-colors px-2 py-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {isLast && (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: currentValue ? 1 : 0.4, y: 0 }}
              onClick={handleSubmit}
              disabled={!currentValue}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent2 text-ink font-semibold text-sm px-5 py-3 shadow-glow disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              Run Diagnosis
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
