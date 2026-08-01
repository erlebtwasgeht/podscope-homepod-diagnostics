export type Severity = "stable" | "caution" | "critical" | "unknown";
export type Confidence = "low" | "moderate" | "high" | "very-high";
export type StepId = "intake" | "vitals" | "timeline" | "differential" | "protocol";

export type AnswerValue = string | string[] | boolean | number | null;

export interface VitalQuestion {
  id: string;
  label: string;
  help: string;
  kind: "single" | "multi" | "boolean";
  options?: { value: string; label: string; signal?: string }[];
  required?: boolean;
}

export interface BootPhase {
  id: string;
  name: string;
  window: string;
  expected: string;
  signal: string;
  statusKey: string;
}

export interface Diagnosis {
  id: string;
  title: string;
  short: string;
  severity: Severity;
  confidence: Confidence;
  score: number;
  mechanism: string;
  signals: string[];
  ruledIn: string[];
  ruledOut: string[];
  treatmentOrder: TreatmentStep[];
  contraindications: string[];
  whenToEscalate: string;
}

export interface TreatmentStep {
  id: string;
  title: string;
  detail: string;
  duration: string;
  risk: "none" | "low" | "medium" | "high";
  destructive?: boolean;
  gated?: boolean;
  gateReason?: string;
}

export interface CaseReport {
  device: string;
  chiefComplaint: string;
  startedAt: string;
  answers: Record<string, AnswerValue>;
  primary: Diagnosis | null;
  differentials: Diagnosis[];
  vitalsSummary: { label: string; value: string; status: Severity }[];
}
