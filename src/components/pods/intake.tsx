import { AlertTriangle, ChevronRight, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CHIEF_COMPLAINTS, CONTRAINDICATIONS_GLOBAL, DEVICE } from "@/lib/diagnostic/knowledge";
import { useDiagnosticStore } from "@/lib/diagnostic/store";
import { cn } from "@/lib/utils";

export function IntakeStep() {
  const chiefComplaint = useDiagnosticStore((s) => s.chiefComplaint);
  const setChiefComplaint = useDiagnosticStore((s) => s.setChiefComplaint);
  const setStep = useDiagnosticStore((s) => s.setStep);

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <Badge variant="outline">Case intake</Badge>
        <h1 className="font-display max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Translate HomePod signals into a clinical picture
        </h1>
        <p className="max-w-2xl text-base text-[var(--color-fg-muted)] leading-relaxed">
          PodScope maps timings, LED patterns, touch, and Home app state the way a workup maps vitals —
          so you treat the real defect instead of looping factory resets and wishful rest periods.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <div className="mb-1 flex items-center gap-2 text-[var(--color-accent)]">
              <Stethoscope className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Device under exam</span>
            </div>
            <CardTitle>{DEVICE.name}</CardTitle>
            <CardDescription>
              {DEVICE.codename} · {DEVICE.year} · {DEVICE.touch}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm font-medium text-[var(--color-fg)]">Chief complaint</p>
            <div className="grid gap-2">
              {CHIEF_COMPLAINTS.map((c) => {
                const selected = chiefComplaint === c.id;
                const locked = c.id !== "no-startup";
                return (
                  <button
                    key={c.id}
                    type="button"
                    disabled={locked}
                    onClick={() => !locked && setChiefComplaint(c.id)}
                    className={cn(
                      "rounded-[var(--radius-lg)] border p-4 text-left transition-[border-color,background-color] duration-150",
                      selected
                        ? "border-[var(--color-accent)]/50 bg-[var(--color-info-dim)]"
                        : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)]",
                      locked && "cursor-not-allowed opacity-45 hover:border-[var(--color-border)]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{c.title}</p>
                        <p className="mt-1 text-xs text-[var(--color-fg-muted)] leading-relaxed">
                          {c.description}
                        </p>
                      </div>
                      {c.recommended ? (
                        <Badge variant="accent">Start here</Badge>
                      ) : (
                        <Badge variant="default">Soon</Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <Button
              className="mt-2 w-full sm:w-auto"
              size="lg"
              disabled={!chiefComplaint}
              onClick={() => setStep("vitals")}
            >
              Begin vitals exam
              <ChevronRight className="size-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-[var(--color-warn)]/20 bg-[color-mix(in_oklab,var(--color-warn-dim)_55%,var(--color-card))]">
            <CardHeader>
              <div className="mb-1 flex items-center gap-2 text-[var(--color-warn)]">
                <AlertTriangle className="size-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Hold these</span>
              </div>
              <CardTitle className="text-base">Contraindications before diagnosis</CardTitle>
              <CardDescription>
                These “treatments” often leave a darker, more confusing case.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {CONTRAINDICATIONS_GLOBAL.map((c) => (
                <div
                  key={c.id}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]/50 p-3"
                >
                  <p className="text-sm font-medium text-[var(--color-fg)]">{c.title}</p>
                  <p className="mt-1 text-xs text-[var(--color-fg-muted)] leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How this workup runs</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm text-[var(--color-fg-muted)]">
                <li className="flex gap-3">
                  <span className="tabular font-mono text-xs text-[var(--color-accent)]">01</span>
                  Capture LED, touch, audio, power, and Home app vitals.
                </li>
                <li className="flex gap-3">
                  <span className="tabular font-mono text-xs text-[var(--color-accent)]">02</span>
                  Overlay observations on the normal boot timeline.
                </li>
                <li className="flex gap-3">
                  <span className="tabular font-mono text-xs text-[var(--color-accent)]">03</span>
                  Rank differentials with confidence and mechanism.
                </li>
                <li className="flex gap-3">
                  <span className="tabular font-mono text-xs text-[var(--color-accent)]">04</span>
                  Unlock ordered protocol — factory reset stays gated.
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
