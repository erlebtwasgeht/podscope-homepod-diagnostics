import { Activity, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDiagnosticStore } from "@/lib/diagnostic/store";
import type { StepId } from "@/lib/diagnostic/types";
import { cn } from "@/lib/utils";

const STEPS: { id: StepId; label: string; n: number }[] = [
  { id: "intake", label: "Intake", n: 1 },
  { id: "vitals", label: "Vitals", n: 2 },
  { id: "timeline", label: "Signals", n: 3 },
  { id: "differential", label: "Differential", n: 4 },
  { id: "protocol", label: "Protocol", n: 5 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const step = useDiagnosticStore((s) => s.step);
  const setStep = useDiagnosticStore((s) => s.setStep);
  const resetCase = useDiagnosticStore((s) => s.resetCase);
  const chiefComplaint = useDiagnosticStore((s) => s.chiefComplaint);
  const vitalsComplete = useDiagnosticStore((s) => s.vitalsComplete);

  const idx = STEPS.findIndex((s) => s.id === step);
  const progress = ((idx + 1) / STEPS.length) * 100;

  function canVisit(target: StepId) {
    const t = STEPS.findIndex((s) => s.id === target);
    if (t <= idx) return true;
    if (target === "vitals" && chiefComplaint) return true;
    if (["timeline", "differential", "protocol"].includes(target) && vitalsComplete()) return true;
    return false;
  }

  return (
    <div className="relative min-h-dvh">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklab,var(--color-accent)_12%,transparent),transparent_70%)]"
        aria-hidden
      />

      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_88%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]">
              <Activity className="size-4 text-[var(--color-accent)]" aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display text-sm font-semibold tracking-tight sm:text-base">PodScope</p>
                <Badge variant="accent" className="hidden sm:inline-flex">
                  Clinical
                </Badge>
              </div>
              <p className="truncate text-xs text-[var(--color-fg-subtle)]">
                HomePod 2nd generation · signal diagnostics
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Reset this case and start intake over?")) resetCase();
            }}
            className="shrink-0"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">New case</span>
          </Button>
        </div>
        <div className="mx-auto max-w-5xl px-4 pb-3 sm:px-6">
          <Progress value={progress} className="mb-3" />
          <nav className="flex gap-1 overflow-x-auto pb-0.5" aria-label="Diagnostic steps">
            {STEPS.map((s) => {
              const active = s.id === step;
              const enabled = canVisit(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={!enabled}
                  onClick={() => enabled && setStep(s.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-[var(--radius-sm)] px-2.5 py-1.5 text-xs transition-colors duration-150",
                    active && "bg-[var(--color-bg-subtle)] text-[var(--color-fg)]",
                    !active && enabled && "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
                    !enabled && "cursor-not-allowed text-[var(--color-fg-subtle)]/50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium tabular",
                      active
                        ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                        : "bg-[var(--color-bg-elevated)] text-[var(--color-fg-subtle)] border border-[var(--color-border)]",
                    )}
                  >
                    {s.n}
                  </span>
                  {s.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>

      <footer className="border-t border-[var(--color-border)] py-6 text-center text-xs text-[var(--color-fg-subtle)]">
        PodScope is an independent diagnostic guide — not affiliated with Apple Inc. Not a substitute for
        authorized service.
      </footer>
    </div>
  );
}
