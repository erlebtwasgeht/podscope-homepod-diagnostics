import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/pods/shell";
import { IntakeStep } from "@/components/pods/intake";
import { VitalsStep } from "@/components/pods/vitals";
import { TimelineStep } from "@/components/pods/timeline";
import { DifferentialStep } from "@/components/pods/differential";
import { ProtocolStep } from "@/components/pods/protocol";
import { useDiagnosticStore } from "@/lib/diagnostic/store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [ready, setReady] = useState(false);
  const step = useDiagnosticStore((s) => s.step);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--color-bg)] text-sm text-[var(--color-fg-muted)]">
        Opening case file…
      </div>
    );
  }

  return (
    <AppShell>
      {step === "intake" && <IntakeStep />}
      {step === "vitals" && <VitalsStep />}
      {step === "timeline" && <TimelineStep />}
      {step === "differential" && <DifferentialStep />}
      {step === "protocol" && <ProtocolStep />}
    </AppShell>
  );
}
