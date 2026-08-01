import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VITAL_QUESTIONS } from "@/lib/diagnostic/knowledge";
import { useDiagnosticStore } from "@/lib/diagnostic/store";
import { cn } from "@/lib/utils";

export function VitalsStep() {
  const answers = useDiagnosticStore((s) => s.answers);
  const setAnswer = useDiagnosticStore((s) => s.setAnswer);
  const toggleMulti = useDiagnosticStore((s) => s.toggleMulti);
  const setStep = useDiagnosticStore((s) => s.setStep);
  const vitalsComplete = useDiagnosticStore((s) => s.vitalsComplete);
  const complete = vitalsComplete();

  const answered = VITAL_QUESTIONS.filter((q) => {
    const v = answers[q.id];
    if (v == null || v === "") return false;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  }).length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Badge variant="outline">Vitals exam</Badge>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Observe before you intervene
          </h1>
          <p className="max-w-xl text-sm text-[var(--color-fg-muted)] leading-relaxed">
            Answer from what you see and hear right now. Guessing reduces diagnostic confidence.
          </p>
        </div>
        <p className="text-sm text-[var(--color-fg-subtle)] tabular">
          <span className="text-[var(--color-fg)] font-medium">{answered}</span> / {VITAL_QUESTIONS.length}{" "}
          captured
        </p>
      </section>

      <div className="space-y-4">
        {VITAL_QUESTIONS.map((q, i) => {
          const val = answers[q.id];
          const has =
            val != null && val !== "" && (!Array.isArray(val) || val.length > 0);

          return (
            <Card key={q.id} className={cn(has && "border-[var(--color-accent)]/20")}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                        V{String(i + 1).padStart(2, "0")}
                      </span>
                      {q.required && <Badge variant="default">Required</Badge>}
                      {has && (
                        <span className="inline-flex items-center gap-1 text-[var(--color-ok)]">
                          <Check className="size-3.5" />
                          <span className="text-[10px] font-medium uppercase tracking-wide">Logged</span>
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-base">{q.label}</CardTitle>
                    <CardDescription className="mt-1">{q.help}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {q.kind === "multi" ? (
                  <div className="flex flex-wrap gap-2">
                    {q.options?.map((opt) => {
                      const selected = Array.isArray(val) && val.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleMulti(q.id, opt.value)}
                          className={cn(
                            "rounded-full border px-3 py-2 text-left text-xs transition-colors duration-150 min-h-11",
                            selected
                              ? "border-[var(--color-accent)]/40 bg-[var(--color-info-dim)] text-[var(--color-fg)]"
                              : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)]",
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {q.options?.map((opt) => {
                      const selected = val === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setAnswer(q.id, opt.value)}
                          className={cn(
                            "rounded-[var(--radius-md)] border px-3 py-3 text-left text-sm transition-colors duration-150 min-h-11",
                            selected
                              ? "border-[var(--color-accent)]/40 bg-[var(--color-info-dim)] text-[var(--color-fg)]"
                              : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]",
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={() => setStep("intake")}>
          <ChevronLeft className="size-4" />
          Intake
        </Button>
        <Button size="lg" disabled={!complete} onClick={() => setStep("timeline")}>
          Map to boot timeline
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
