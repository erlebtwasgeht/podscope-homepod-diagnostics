import { ChevronLeft, ChevronRight, CircleDashed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BOOT_TIMELINE } from "@/lib/diagnostic/knowledge";
import { useDiagnosticStore } from "@/lib/diagnostic/store";
import { cn } from "@/lib/utils";

const STATUS_META = {
  pass: { label: "Within band", variant: "ok" as const, bar: "bg-[var(--color-ok)]" },
  warn: { label: "Borderline", variant: "warn" as const, bar: "bg-[var(--color-warn)]" },
  fail: { label: "Out of band", variant: "critical" as const, bar: "bg-[var(--color-critical)]" },
  pending: { label: "Insufficient data", variant: "default" as const, bar: "bg-[var(--color-fg-subtle)]" },
};

export function TimelineStep() {
  const setStep = useDiagnosticStore((s) => s.setStep);
  const getPhaseStatuses = useDiagnosticStore((s) => s.getPhaseStatuses);
  const answers = useDiagnosticStore((s) => s.answers);
  const statuses = getPhaseStatuses();

  const ledLabel =
    typeof answers.led_state === "string"
      ? String(answers.led_state).replace(/_/g, " ")
      : "not logged";

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <Badge variant="outline">Signal timeline</Badge>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Expected boot vs your observation
        </h1>
        <p className="max-w-2xl text-sm text-[var(--color-fg-muted)] leading-relaxed">
          Healthy HomePod 2nd gen follows a predictable power → MCU → firmware → network → ready
          sequence. Your logged LED state:{" "}
          <span className="text-[var(--color-fg)] font-medium">{ledLabel}</span>.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Boot sequence strip</CardTitle>
          <CardDescription>
            Each phase has a normal time window. Failures here decide which treatment is ethical next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex h-2 overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
            {BOOT_TIMELINE.map((phase) => {
              const st = statuses[phase.statusKey] ?? "pending";
              return (
                <div
                  key={phase.id}
                  className={cn("h-full flex-1 border-r border-[var(--color-bg)] last:border-0", STATUS_META[st].bar)}
                  title={phase.name}
                />
              );
            })}
          </div>

          <ol className="space-y-3">
            {BOOT_TIMELINE.map((phase, i) => {
              const st = statuses[phase.statusKey] ?? "pending";
              const meta = STATUS_META[st];
              return (
                <li
                  key={phase.id}
                  className="grid gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 sm:grid-cols-[auto_1fr_auto] sm:items-start"
                >
                  <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-1">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] font-mono text-xs text-[var(--color-fg-muted)]">
                      {i}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--color-fg-subtle)] sm:hidden">
                      {phase.window}
                    </span>
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-sm">{phase.name}</p>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                    </div>
                    <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">{phase.expected}</p>
                    <p className="flex items-start gap-1.5 text-xs text-[var(--color-fg-subtle)]">
                      <CircleDashed className="mt-0.5 size-3 shrink-0" />
                      {phase.signal}
                    </p>
                  </div>
                  <p className="hidden font-mono text-xs text-[var(--color-fg-subtle)] sm:block">
                    {phase.window}
                  </p>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      <Card className="border-[var(--color-border-strong)]">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-medium">Interpretation rule</p>
            <p className="mt-1 text-xs text-[var(--color-fg-muted)] leading-relaxed max-w-lg">
              White spin inside the update window is not a defect by itself. Dark LED after known-good
              power is. Chronic hang after hours is. Match the phase before reaching for a 10-second
              reset.
            </p>
          </div>
          <Badge variant="warn" className="w-fit">
            Timing is diagnosis
          </Badge>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={() => setStep("vitals")}>
          <ChevronLeft className="size-4" />
          Vitals
        </Button>
        <Button size="lg" onClick={() => setStep("differential")}>
          Rank differentials
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
