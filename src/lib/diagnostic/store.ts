import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AnswerValue, Diagnosis, StepId } from "./types";
import {
  answersToSignals,
  evaluateDiagnoses,
  phaseStatuses,
  VITAL_QUESTIONS,
} from "./knowledge";

interface DiagnosticState {
  step: StepId;
  chiefComplaint: string | null;
  answers: Record<string, AnswerValue>;
  startedAt: string | null;
  completedVitals: boolean;
  setStep: (step: StepId) => void;
  setChiefComplaint: (id: string) => void;
  setAnswer: (id: string, value: AnswerValue) => void;
  toggleMulti: (id: string, value: string) => void;
  vitalsComplete: () => boolean;
  getSignals: () => Set<string>;
  getDiagnoses: () => Diagnosis[];
  getPrimary: () => Diagnosis | null;
  getPhaseStatuses: () => Record<string, "pass" | "fail" | "warn" | "pending">;
  resetCase: () => void;
}

export const useDiagnosticStore = create<DiagnosticState>()(
  persist(
    (set, get) => ({
      step: "intake",
      chiefComplaint: null,
      answers: {},
      startedAt: null,
      completedVitals: false,

      setStep: (step) => set({ step }),

      setChiefComplaint: (id) =>
        set({
          chiefComplaint: id,
          startedAt: get().startedAt ?? new Date().toISOString(),
        }),

      setAnswer: (id, value) =>
        set((s) => ({
          answers: { ...s.answers, [id]: value },
        })),

      toggleMulti: (id, value) =>
        set((s) => {
          const cur = Array.isArray(s.answers[id]) ? ([...(s.answers[id] as string[])] as string[]) : [];
          const noneId = "none";
          let next: string[];
          if (value === noneId) {
            next = cur.includes(noneId) ? [] : [noneId];
          } else {
            next = cur.filter((v) => v !== noneId);
            if (next.includes(value)) next = next.filter((v) => v !== value);
            else next = [...next, value];
          }
          return { answers: { ...s.answers, [id]: next } };
        }),

      vitalsComplete: () => {
        const { answers } = get();
        return VITAL_QUESTIONS.filter((q) => q.required).every((q) => {
          const v = answers[q.id];
          if (v == null || v === "") return false;
          if (Array.isArray(v)) return v.length > 0;
          return true;
        });
      },

      getSignals: () => answersToSignals(get().answers),

      getDiagnoses: () => {
        const signals = answersToSignals(get().answers);
        return evaluateDiagnoses(signals, get().answers);
      },

      getPrimary: () => {
        const list = get().getDiagnoses();
        return list[0] ?? null;
      },

      getPhaseStatuses: () => {
        const signals = answersToSignals(get().answers);
        return phaseStatuses(signals, get().answers);
      },

      resetCase: () =>
        set({
          step: "intake",
          chiefComplaint: null,
          answers: {},
          startedAt: null,
          completedVitals: false,
        }),
    }),
    {
      name: "podscope-case-v1",
      partialize: (s) => ({
        step: s.step,
        chiefComplaint: s.chiefComplaint,
        answers: s.answers,
        startedAt: s.startedAt,
        completedVitals: s.completedVitals,
      }),
    },
  ),
);
