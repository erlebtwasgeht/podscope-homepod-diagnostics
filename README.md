# PodScope — HomePod (2nd gen) Clinical Diagnostics

Signal-based diagnostic workup for **Apple HomePod (2nd generation)**. Maps LED patterns, timings, touch, audio, power, and Home app state into ranked diagnoses — so you treat the real defect instead of looping factory resets and wishful rest periods.

## Features

- **Intake** — chief complaint with hard contraindications (no premature 10s reset, no “rest and hope”)
- **Vitals exam** — structured observations for power, ring, touch, audio, duration, events, Home app, thermal
- **Boot timeline** — expected power → MCU → firmware → network → ready sequence vs your case
- **Differential diagnosis** — scored hypotheses with mechanism, signals, and confidence
- **Treatment protocol** — ordered care; **factory reset stays gated** until non-destructive steps complete
- **Case report** — copyable summary for Apple Support notes

## Stack

- React 19 + TypeScript
- TanStack Start / Router
- Vite 8
- Tailwind CSS v4
- Zustand (case persistence)
- Radix / shadcn-style UI primitives

## Development

```bash
npm install
npm run dev        # http://0.0.0.0:8080
npm run typecheck
npm run build
```

## Disclaimer

PodScope is an independent diagnostic guide — **not affiliated with Apple Inc.** It is not a substitute for authorized service or official support.

## License

Private project unless otherwise stated.
