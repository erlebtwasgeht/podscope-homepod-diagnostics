import { ChevronLeft, ChevronRight, Crosshair, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDiagnosticStore } from "@/lib/diagnostic/store";
import type { Confidence, Severity } from "@/lib/diagnostic/types";
import { cn } from "@/lib/utils";

function severityVariant(s: Severity) {
  if (s === "stable") return "ok" as const;
  if (s === "caution") return "warn" as const;
  if (s === "critical") return "critical" as const;
  return "default" as const;
}

function confidenceLabel(c: Confidence) {
  return c.replace("-", " ");
}

export function DifferentialStep() {
  const setStep = useDiagnosticStore((s) => s.setStep);
  const getDiagnoses = useDiagnosticStore((s) => s.getDiagnoses);
  const diagnoses = getDiagnoses();
  const primary = diagnoses[0];
  const rest = diagnoses.slice(1, 5);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <Badge variant="outline">Differential diagnosis</Badge>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Ranked hypotheses from your vitals
        </h1>
        <p className="max-w-2xl text-sm text-[var(--color-fg-muted)] leading-relaxed">
          Scores combine LED, power, duration, Home app, and recent events. Treat the top match first —
          not the most dramatic myth online.
        </p>
      </section>

      {primary && (
        <Card className="border-[var(--color-accent)]/30 overflow-hidden">
          <div className="h-1 bg-[var(--color-accent)]" />
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">Primary</Badge>
              <Badge variant={severityVariant(primary.severity)}>{primary.severity}</Badge>
              <Badge variant="outline">Confidence {confidenceLabel(primary.confidence)}</Badge>
            </div>
            <CardTitle className="mt-2 text-xl">{primary.title}</CardTitle>
            <CardDescription className="text-sm">{primary.short}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-[var(--color-fg-subtle)]">
                <span>Match score</span>
                <span className="tabular font-mono text-[var(--color-fg)]">{primary.score}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
                <div
                  className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-500"
                  style={{ width: `${primary.score}%` }}
                />
              </div>
            </div>

            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
              <p className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--color-fg-subtle)]">
                <Crosshair className="size-3.5" />
                Mechanism
              </p>
              <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">{primary.mechanism}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--color-fg-subtle)]">
                  Supporting signals
                </p>
                <ul className="space-y-1.5">
                  {(primary.signals.length ? primary.signals : ["Pattern match on history / absence"]).map(
                    (s) => (
                      <li
                        key={s}
                        className="rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--color-accent)]"
                      >
                        {s}
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--color-fg-subtle)]">
                  Contraindications
                </p>
                <ul className="space-y-2">
                  {primary.contraindications.map((c) => (
                    <li key={c} className="flex gap-2 text-xs text-[var(--color-fg-muted)] leading-relaxed">
                      <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-[var(--color-warn)]" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-xs text-[var(--color-fg-subtle)]">
              <span className="font-medium text-[var(--color-fg-muted)]">Escalate when: </span>
              {primary.whenToEscalate}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-[var(--color-fg-muted)]">Also consider</h2>
        <div className="grid gap-3">
          {rest.map((d, i) => (
            <Card key={d.id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">
                      #{i + 2}
                    </span>
                    <p className="text-sm font-medium">{d.title}</p>
                    <Badge variant={severityVariant(d.severity)}>{d.severity}</Badge>
                  </div>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">{d.short}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-20">
                    <div className="mb-1 text-right font-mono text-[10px] tabular text-[var(--color-fg-subtle)]">
                      {d.score}
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
                      <div
                        className={cn("h-full rounded-full", d.score >= 40 ? "bg-[var(--color-warn)]" : "bg-[var(--color-fg-subtle)]")}
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={() => setStep("timeline")}>
          <ChevronLeft className="size-4" />
          Timeline
        </Button>
        <Button size="lg" onClick={() => setStep("protocol")}>
          Open treatment protocol
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
