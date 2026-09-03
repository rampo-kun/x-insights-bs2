"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ArrowRight, Sparkles } from "lucide-react";
import { QUESTIONS } from "@/lib/questions";
import { Answers, UserProfile } from "@/lib/types";
import { INITIAL_ANSWERS, isComplete } from "@/lib/scoring";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";

export default function IntakeForm({
  onComplete,
}: {
  onComplete: (answers: Answers, profile: UserProfile) => void;
}) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    email: "",
    companyName: "",
  });

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const currentValue = (answers as any)[question?.key];

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.name && formData.email && formData.companyName) {
      setProfile(formData);
    }
  }

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
    if (step > 0) {
      setStep((s) => s - 1);
    } else if (step === 0) {
      // Allow going back from the first question to the profile form
      setProfile(null);
    }
  }

  function handleSubmit() {
    if (isComplete(answers) && profile) {
      onComplete(answers, profile);
    }
  }

  // Pre-quiz Profile Intake Step
  if (!profile) {
    return (
      <div className="w-full flex flex-col items-center gap-6">
        <div className="w-full max-w-xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">Your Details</h2>
              <p className="text-white/60 text-sm">Please fill this out before starting the diagnosis.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Work Email</label>
                <input
                  type="email"
                  required
                  className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  placeholder="jane@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Company Name</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  placeholder="Acme Corp"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent2 text-ink font-semibold text-sm px-5 py-3 shadow-glow hover:opacity-90 transition-opacity"
              >
                Start Quiz
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // Active Quiz Step
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
            className="flex items-center gap-1 text-sm text-white/50 hover:text-white/80 transition-colors px-2 py-2"
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