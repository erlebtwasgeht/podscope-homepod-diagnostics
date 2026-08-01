import type { BootPhase, Diagnosis, VitalQuestion } from "./types";

export const DEVICE = {
  name: "HomePod (2nd generation)",
  codename: "AudioAccessory5,1",
  year: 2023,
  power: "USB-C / built-in power cable (region dependent)",
  touch: "Top touch surface + LED status ring",
};

export const CHIEF_COMPLAINTS = [
  {
    id: "no-startup",
    title: "Won’t start up as expected",
    description:
      "Power applied, but no normal boot, no Siri, dead ring, or stuck light pattern.",
    recommended: true,
  },
  {
    id: "audio-only",
    title: "Powers on, audio broken",
    description: "Light responds, but sound is distorted, silent, or one-sided.",
    recommended: false,
  },
  {
    id: "network-siri",
    title: "Online but won’t listen",
    description: "Connected yet Siri ignores, setup loops, or Home app is red.",
    recommended: false,
  },
  {
    id: "intermittent",
    title: "Intermittent dropout",
    description: "Works, then vanishes mid-stream or after sleep.",
    recommended: false,
  },
] as const;

export const VITAL_QUESTIONS: VitalQuestion[] = [
  {
    id: "power_source",
    label: "Power source integrity",
    help: "Confirm energy delivery before software theories. A ‘dead’ pod is often an outlet or cable issue.",
    kind: "single",
    required: true,
    options: [
      { value: "known_good", label: "Known-good outlet + cable, firm seating", signal: "power:ok" },
      { value: "unverified", label: "Same outlet/cable as always — not retested", signal: "power:unverified" },
      { value: "suspect", label: "Loose plug, extension strip, or shared UPS", signal: "power:suspect" },
      { value: "no_power_elsewhere", label: "Other devices also fail on this outlet", signal: "power:dead_circuit" },
    ],
  },
  {
    id: "led_state",
    label: "LED / status ring observation",
    help: "The ring is the HomePod’s vital sign strip. Pattern + color map to firmware state.",
    kind: "single",
    required: true,
    options: [
      { value: "dark", label: "Completely dark — no light at all", signal: "led:dark" },
      { value: "white_spin", label: "White spinning / swirling continuously", signal: "led:white_spin" },
      { value: "white_pulse", label: "White pulse or breathe, no completion", signal: "led:white_pulse" },
      { value: "orange", label: "Solid or flashing orange", signal: "led:orange" },
      { value: "red", label: "Red flash or solid red", signal: "led:red" },
      { value: "green", label: "Green (pairing / ready cue)", signal: "led:green" },
      { value: "normal_idle", label: "Brief light then normal idle (quiet top)", signal: "led:normal" },
      { value: "rainbow", label: "Rainbow / multicolor cycle", signal: "led:rainbow" },
    ],
  },
  {
    id: "touch_response",
    label: "Touch surface response",
    help: "Tap volume + / − and the center. Note latency and whether volume chimes play.",
    kind: "single",
    required: true,
    options: [
      { value: "none", label: "No response to any touch", signal: "touch:none" },
      { value: "partial", label: "Volume responds; Siri/center does not", signal: "touch:partial" },
      { value: "delayed", label: "Responds after long delay (>2s)", signal: "touch:delayed" },
      { value: "normal", label: "Touch feels normal", signal: "touch:ok" },
    ],
  },
  {
    id: "audio_boot",
    label: "Audio at power-on",
    help: "Listen for the startup chime, fan hiss, or crackle in the first 60 seconds.",
    kind: "single",
    required: true,
    options: [
      { value: "silent", label: "Total silence", signal: "audio:silent" },
      { value: "chime_once", label: "Single startup chime, then quiet", signal: "audio:chime" },
      { value: "loop_chime", label: "Chime or tone repeats in a loop", signal: "audio:loop" },
      { value: "noise", label: "Hum, buzz, or crackle", signal: "audio:noise" },
      { value: "plays", label: "Music / Siri audio works", signal: "audio:ok" },
    ],
  },
  {
    id: "duration_stuck",
    label: "How long in this state?",
    help: "Duration separates a long install from a true hang — and stops premature factory resets.",
    kind: "single",
    required: true,
    options: [
      { value: "under_2m", label: "Under 2 minutes", signal: "time:short" },
      { value: "2_15m", label: "2–15 minutes", signal: "time:mid" },
      { value: "15_60m", label: "15–60 minutes", signal: "time:long" },
      { value: "hours_days", label: "Hours to days, unchanged", signal: "time:chronic" },
    ],
  },
  {
    id: "recent_events",
    label: "Recent events (select all that apply)",
    help: "Context is half the diagnosis — power loss, iOS update, move, reset attempts.",
    kind: "multi",
    options: [
      { value: "power_outage", label: "Power outage or unplugged mid-use", signal: "evt:power_loss" },
      { value: "ios_update", label: "iPhone / Home hub software update", signal: "evt:ios" },
      { value: "moved", label: "Moved rooms or Wi‑Fi changed", signal: "evt:network" },
      { value: "factory_tried", label: "Already held top for ~10s factory reset", signal: "evt:factory" },
      { value: "left_alone", label: "Left alone for hours “to recover”", signal: "evt:rest" },
      { value: "heat", label: "Was hot / direct sun / enclosed shelf", signal: "evt:thermal" },
      { value: "none", label: "None of these", signal: "evt:none" },
    ],
  },
  {
    id: "home_app",
    label: "Home app status for this device",
    help: "Phone-side evidence of connectivity and identity.",
    kind: "single",
    required: true,
    options: [
      { value: "missing", label: "Not listed / removed", signal: "home:missing" },
      { value: "updating", label: "Shows Updating… indefinitely", signal: "home:updating" },
      { value: "no_response", label: "No Response", signal: "home:no_response" },
      { value: "setup_new", label: "Appears as new HomePod to set up", signal: "home:setup" },
      { value: "ok", label: "Shows as normal / available", signal: "home:ok" },
      { value: "no_phone", label: "Can’t check Home app right now", signal: "home:unknown" },
    ],
  },
  {
    id: "temperature",
    label: "Enclosure temperature (hand test)",
    help: "Warm is normal under load; hot-to-touch after idle suggests thermal protection.",
    kind: "single",
    required: true,
    options: [
      { value: "cool", label: "Cool / ambient", signal: "temp:cool" },
      { value: "warm", label: "Warm but comfortable", signal: "temp:warm" },
      { value: "hot", label: "Hot — uncomfortable to hold top", signal: "temp:hot" },
      { value: "unknown", label: "Not checked", signal: "temp:unknown" },
    ],
  },
];

/** Canonical boot timeline for HomePod 2 — expected signal sequence */
export const BOOT_TIMELINE: BootPhase[] = [
  {
    id: "t0",
    name: "Power seat",
    window: "0–2 s",
    expected: "Mains present; internal PSU rails rise",
    signal: "Electrical — no LED yet is normal for ~1s",
    statusKey: "power",
  },
  {
    id: "t1",
    name: "MCU wake",
    window: "2–8 s",
    expected: "Controller brings up LED driver",
    signal: "Faint white activity or brief flash acceptable",
    statusKey: "mcu",
  },
  {
    id: "t2",
    name: "Firmware load",
    window: "8–45 s",
    expected: "White swirl while system image mounts",
    signal: "Spinning white = loading, not necessarily broken",
    statusKey: "firmware",
  },
  {
    id: "t3",
    name: "Network stack",
    window: "30–90 s",
    expected: "Wi‑Fi / Thread / Bluetooth come online",
    signal: "May stay quiet until linked to Home hub",
    statusKey: "network",
  },
  {
    id: "t4",
    name: "Service ready",
    window: "1–3 min",
    expected: "Idle, responds to Hey Siri / touch, Home app green",
    signal: "Chime or silence + responsive top = healthy",
    statusKey: "ready",
  },
  {
    id: "t5",
    name: "Post-update settle",
    window: "up to 15–40 min",
    expected: "After major software update only",
    signal: "Long white spin is legitimate — do not factory-reset yet",
    statusKey: "update",
  },
];

export const CONTRAINDICATIONS_GLOBAL = [
  {
    id: "no-10s",
    title: "No 10-second factory reset yet",
    detail:
      "Holding the top until the red swirl completes erases identity and often restarts the same failure with less evidence. Reserve for confirmed software corruption after non-destructive steps.",
  },
  {
    id: "no-love",
    title: "No “love, happiness & recreation time” protocol",
    detail:
      "Leaving a non-booting unit unplugged “to rest,” whispering encouragement, or cycling power randomly for days does not repair firmware or hardware. It only delays a real differential.",
  },
  {
    id: "no-blind-reseat",
    title: "No endless plug-reseat loops",
    detail:
      "More than two controlled power cycles in ten minutes adds heat stress without new signal data. Document each cycle instead.",
  },
];

const treatments = {
  powerAudit: {
    id: "power-audit",
    title: "Power path audit",
    detail:
      "Move to a wall outlet you know works (not a strip). Reseat the plug firmly. Confirm the cable is undamaged. Wait 30 seconds after seating before judging LED.",
    duration: "2 min",
    risk: "none" as const,
  },
  controlledCycle: {
    id: "controlled-cycle",
    title: "Controlled cold boot",
    detail:
      "Unplug 20 full seconds (not 2). Press nothing on the top. Replug and observe LED + audio for 3 minutes without touching. Log the exact pattern.",
    duration: "4 min",
    risk: "low" as const,
  },
  waitUpdate: {
    id: "wait-update",
    title: "Allow update / first-boot window",
    detail:
      "If white spin is continuous and the Home app says Updating, leave power connected 30–40 minutes. Do not factory-reset mid-update.",
    duration: "30–40 min",
    risk: "none" as const,
  },
  coolDown: {
    id: "cool-down",
    title: "Thermal recovery",
    detail:
      "Unplug. Move off soft surfaces and out of sun. Cool to ambient 45–60 minutes. Reboot once. Persistent heat after idle → service.",
    duration: "45–60 min",
    risk: "none" as const,
  },
  homeResetLink: {
    id: "home-relink",
    title: "Home app relink (non-destructive)",
    detail:
      "On iPhone near the unit: open Home → remove accessory only if listed as No Response after cold boot, then set up as new when green light appears. Keep the same Apple ID / home hub.",
    duration: "10 min",
    risk: "low" as const,
  },
  networkIsolate: {
    id: "network-isolate",
    title: "Network isolation test",
    detail:
      "Bring iPhone within 1 m on 2.4/5 GHz known-good Wi‑Fi. Disable VPN. Ensure a Home hub (Apple TV / HomePod) is online. Retry setup only if LED shows readiness (green / setup cue).",
    duration: "10 min",
    risk: "low" as const,
  },
  factoryGate: {
    id: "factory-reset",
    title: "Factory reset (gated)",
    detail:
      "Only after power, thermal, and wait windows fail: unplug 10s, plug in, wait for white light, then touch and hold the top until red swirl finishes (~10s). Reconfigure from scratch.",
    duration: "15 min + setup",
    risk: "high" as const,
    destructive: true,
    gated: true,
    gateReason:
      "Destructive. Unlocks only when non-destructive steps are exhausted and pattern suggests software corruption — not power, thermal, or mid-update.",
  },
  service: {
    id: "apple-service",
    title: "Apple service / hardware path",
    detail:
      "If dark after known-good power, red persistent, or post-reset still dead: capture serial, purchase proof, and book Apple Support / authorized service. Further DIY resets won’t resurrect failed PSU/logic.",
    duration: "support appointment",
    risk: "none" as const,
  },
};

export function evaluateDiagnoses(signals: Set<string>, answers: Record<string, unknown>): Diagnosis[] {
  const multi = (answers.recent_events as string[] | undefined) ?? [];
  const hasFactory = multi.includes("factory_tried") || signals.has("evt:factory");
  const hasRest = multi.includes("left_alone") || signals.has("evt:rest");
  const hasThermal = multi.includes("heat") || signals.has("evt:thermal") || signals.has("temp:hot");
  const hasPowerLoss = multi.includes("power_outage") || signals.has("evt:power_loss");
  const hasIos = multi.includes("ios_update") || signals.has("evt:ios");

  const list: Diagnosis[] = [];

  // 1. Power delivery failure
  {
    let score = 0;
    if (signals.has("led:dark")) score += 35;
    if (signals.has("touch:none")) score += 15;
    if (signals.has("audio:silent")) score += 10;
    if (signals.has("power:suspect") || signals.has("power:dead_circuit")) score += 30;
    if (signals.has("power:unverified")) score += 12;
    if (signals.has("power:ok") && signals.has("led:dark")) score += 8;
    if (signals.has("temp:cool") && signals.has("led:dark")) score += 5;
    list.push({
      id: "power-delivery",
      title: "Power delivery failure",
      short: "Energy never reaches a healthy boot rail — or PSU/logic is dead.",
      severity: signals.has("power:ok") && signals.has("led:dark") ? "critical" : "caution",
      confidence: score >= 55 ? "high" : score >= 35 ? "moderate" : "low",
      score,
      mechanism:
        "Without stable  mains → internal rails, the LED, touch MCU, and audio DSP never leave reset. Looks like a ‘dead soul’ device but is often outlet, cable seating, or failed power stage.",
      signals: pickSignals(signals, ["led:dark", "power:suspect", "power:dead_circuit", "power:unverified", "touch:none", "audio:silent"]),
      ruledIn: ["Dark LED with no touch/audio", "Unverified or suspect power path"],
      ruledOut: ["Active white spin (device is powered and loading)"],
      treatmentOrder: [treatments.powerAudit, treatments.controlledCycle, treatments.service],
      contraindications: [
        "Do not factory-reset a dark unit — reset requires a living LED path.",
        "Do not leave it ‘resting’ unplugged for days as therapy.",
      ],
      whenToEscalate: "Known-good power + still fully dark after two cold boots → hardware service.",
    });
  }

  // 2. Boot hang / firmware load stall
  {
    let score = 0;
    if (signals.has("led:white_spin") || signals.has("led:white_pulse")) score += 30;
    if (signals.has("time:long") || signals.has("time:chronic")) score += 25;
    if (signals.has("time:mid")) score += 10;
    if (signals.has("touch:none") || signals.has("touch:delayed")) score += 10;
    if (signals.has("home:updating")) score += 20;
    if (hasIos) score += 12;
    if (signals.has("audio:silent") || signals.has("audio:loop")) score += 8;
    if (signals.has("time:short")) score -= 15;
    list.push({
      id: "boot-hang",
      title: "Firmware boot hang / long load",
      short: "Alive enough to light the ring, stuck before service-ready.",
      severity: signals.has("time:chronic") ? "critical" : "caution",
      confidence: score >= 60 ? "very-high" : score >= 40 ? "high" : score >= 25 ? "moderate" : "low",
      score,
      mechanism:
        "White continuous activity is the clinical equivalent of ‘patient is breathing but not conscious.’ Firmware may be installing, verifying, or wedged. Premature 10s reset aborts a legitimate update and can worsen the case.",
      signals: pickSignals(signals, ["led:white_spin", "led:white_pulse", "time:long", "time:chronic", "home:updating", "touch:delayed"]),
      ruledIn: ["White spin/pulse beyond normal first-minute window", "Home app Updating"],
      ruledOut: ["Completely dark LED (prefer power path first)"],
      treatmentOrder: [
        treatments.waitUpdate,
        treatments.controlledCycle,
        treatments.homeResetLink,
        treatments.factoryGate,
        treatments.service,
      ],
      contraindications: [
        "Do not hold top for 10s while Home says Updating.",
        "Do not interpret multi-hour white spin as ‘needs love time’ — either wait the update window once, then cold boot, then reassess.",
      ],
      whenToEscalate: "After one full update window + one cold boot + optional factory still spinning → service.",
    });
  }

  // 3. Thermal protection
  {
    let score = 0;
    if (hasThermal || signals.has("temp:hot")) score += 40;
    if (signals.has("led:orange") || signals.has("led:dark")) score += 15;
    if (signals.has("audio:silent")) score += 5;
    if (signals.has("time:mid") || signals.has("time:long")) score += 8;
    list.push({
      id: "thermal",
      title: "Thermal protection / enclosure stress",
      short: "Heat gate shutting down boot or audio stages.",
      severity: signals.has("temp:hot") ? "caution" : "unknown",
      confidence: score >= 45 ? "high" : score >= 25 ? "moderate" : "low",
      score,
      mechanism:
        "HomePod throttles or refuses full boot when internal thermals exceed safe band — soft shelves, sun, and enclosed cabinets are classic precipitants. Feels like sudden ‘depression’ after heavy play.",
      signals: pickSignals(signals, ["temp:hot", "led:orange", "evt:thermal"]),
      ruledIn: ["Hot enclosure", "Recent heavy load in poor ventilation"],
      ruledOut: ["Cool unit with pure software hang"],
      treatmentOrder: [treatments.coolDown, treatments.controlledCycle, treatments.service],
      contraindications: ["Don’t factory-reset a hot unit to ‘fix software’ first."],
      whenToEscalate: "Recurs after cool placement and normal ventilation → service for thermal path.",
    });
  }

  // 4. Software identity / pairing desync
  {
    let score = 0;
    if (signals.has("home:no_response") || signals.has("home:missing") || signals.has("home:setup")) score += 25;
    if (signals.has("led:green") || signals.has("led:normal") || signals.has("led:rainbow")) score += 15;
    if (signals.has("touch:ok") || signals.has("touch:partial")) score += 10;
    if (signals.has("evt:network") || signals.has("evt:ios")) score += 12;
    if (signals.has("audio:ok") || signals.has("audio:chime")) score += 8;
    if (signals.has("led:dark")) score -= 20;
    list.push({
      id: "identity-desync",
      title: "Home identity / pairing desync",
      short: "Hardware boots; the home graph doesn’t trust or see it.",
      severity: "caution",
      confidence: score >= 45 ? "high" : score >= 25 ? "moderate" : "low",
      score,
      mechanism:
        "After network moves, hub updates, or partial resets, the speaker can be electrically fine while HomeKit graph is stale. Users misread this as ‘won’t start’ when the ring is actually idle-ready.",
      signals: pickSignals(signals, ["home:no_response", "home:setup", "home:missing", "led:green", "evt:network"]),
      ruledIn: ["LED shows life; Home app unhappy", "Recent Wi‑Fi or hub change"],
      ruledOut: ["No LED activity at all"],
      treatmentOrder: [treatments.networkIsolate, treatments.homeResetLink, treatments.factoryGate],
      contraindications: ["Don’t factory-reset before trying non-destructive remove/re-add once."],
      whenToEscalate: "Cannot complete setup with green cue on known-good network → support.",
    });
  }

  // 5. Corrupt software / needs reset
  {
    let score = 0;
    if (signals.has("led:red") || signals.has("audio:loop")) score += 25;
    if (signals.has("time:chronic") && (signals.has("led:white_spin") || signals.has("led:white_pulse"))) score += 20;
    if (hasPowerLoss) score += 10;
    if (hasFactory) score += 5; // already tried — may need service instead
    if (signals.has("home:updating") && signals.has("time:chronic")) score += 15;
    if (signals.has("touch:none") && !signals.has("led:dark")) score += 10;
    list.push({
      id: "software-corrupt",
      title: "Software image corruption",
      short: "Bootloader loops or error LED; non-destructive steps won’t reimage.",
      severity: "critical",
      confidence: score >= 50 ? "high" : score >= 30 ? "moderate" : "low",
      score,
      mechanism:
        "Interrupted updates or unclean power loss can leave a non-bootable image. Factory reset is then indicated — but only after power and thermal differentials are cleared.",
      signals: pickSignals(signals, ["led:red", "audio:loop", "time:chronic", "evt:power_loss"]),
      ruledIn: ["Red status", "Chronic hang after power loss", "Looping boot tones"],
      ruledOut: ["First 15 minutes of a known update"],
      treatmentOrder: [treatments.controlledCycle, treatments.factoryGate, treatments.service],
      contraindications: [
        "If you already factory-reset twice with identical result, stop — escalate hardware.",
        "Never reset mid-orange/red without noting the exact pattern first.",
      ],
      whenToEscalate: "Factory reset completes but symptoms identical → logic board / service.",
    });
  }

  // 6. Iatrogenic — failed home remedies
  {
    let score = 0;
    if (hasFactory) score += 25;
    if (hasRest) score += 20;
    if (signals.has("time:chronic")) score += 10;
    if (hasFactory && hasRest) score += 15;
    list.push({
      id: "iatrogenic",
      title: "Iatrogenic stall (harmful self-treatment)",
      short: "Prior ‘cures’ erased evidence or delayed real care.",
      severity: "caution",
      confidence: score >= 40 ? "high" : score >= 25 ? "moderate" : "low",
      score,
      mechanism:
        "The classic path: 10-second handoff reset without diagnosis, then days of hoping the box ‘feels better.’ Result: a dark, depressed-looking unit with wiped pairing history and no clearer root cause.",
      signals: pickSignals(signals, ["evt:factory", "evt:rest", "time:chronic"]),
      ruledIn: ["Factory already attempted", "Long rest without structured observation"],
      ruledOut: [],
      treatmentOrder: [
        treatments.powerAudit,
        treatments.controlledCycle,
        treatments.waitUpdate,
        treatments.service,
      ],
      contraindications: [
        "Stop further emotional or ritual resets.",
        "One structured protocol only from here — no more improvised holds.",
      ],
      whenToEscalate: "If structured protocol fails once end-to-end → Apple service, not reset #4.",
    });
  }

  // 7. Healthy / user misread
  {
    let score = 0;
    if (signals.has("led:normal") || signals.has("audio:ok")) score += 30;
    if (signals.has("touch:ok")) score += 20;
    if (signals.has("home:ok")) score += 25;
    if (signals.has("time:short")) score += 10;
    if (signals.has("led:dark") || signals.has("time:chronic")) score -= 30;
    list.push({
      id: "likely-healthy",
      title: "Likely healthy — perception lag",
      short: "Vitals look service-ready; expectation mismatch.",
      severity: "stable",
      confidence: score >= 50 ? "high" : score >= 30 ? "moderate" : "low",
      score: Math.max(0, score),
      mechanism:
        "Quiet idle after a normal boot is correct behavior. No light does not always mean death once boot completed. Confirm with touch and Home app before invasive steps.",
      signals: pickSignals(signals, ["led:normal", "touch:ok", "home:ok", "audio:ok"]),
      ruledIn: ["Responsive touch", "Home available", "Audio works"],
      ruledOut: ["Chronic dark or red states"],
      treatmentOrder: [treatments.networkIsolate],
      contraindications: ["Do not factory-reset a working unit to ‘feel proactive.’"],
      whenToEscalate: "Only if new hard symptoms appear.",
    });
  }

  return list
    .map((d) => ({ ...d, score: Math.min(100, Math.max(0, d.score)) }))
    .sort((a, b) => b.score - a.score);
}

function pickSignals(set: Set<string>, keys: string[]) {
  return keys.filter((k) => set.has(k));
}

export function answersToSignals(answers: Record<string, unknown>): Set<string> {
  const signals = new Set<string>();
  for (const q of VITAL_QUESTIONS) {
    const val = answers[q.id];
    if (val == null || val === "") continue;
    if (q.kind === "multi" && Array.isArray(val)) {
      for (const v of val) {
        const opt = q.options?.find((o) => o.value === v);
        if (opt?.signal) signals.add(opt.signal);
      }
    } else if (typeof val === "string") {
      const opt = q.options?.find((o) => o.value === val);
      if (opt?.signal) signals.add(opt.signal);
    }
  }
  return signals;
}

export function phaseStatuses(
  signals: Set<string>,
  answers: Record<string, unknown>,
): Record<string, "pass" | "fail" | "warn" | "pending"> {
  const duration = answers.duration_stuck as string | undefined;
  const led = answers.led_state as string | undefined;
  const power = answers.power_source as string | undefined;

  const out: Record<string, "pass" | "fail" | "warn" | "pending"> = {
    power: "pending",
    mcu: "pending",
    firmware: "pending",
    network: "pending",
    ready: "pending",
    update: "pending",
  };

  if (power === "known_good") out.power = "pass";
  else if (power === "suspect" || power === "no_power_elsewhere") out.power = "fail";
  else if (power === "unverified") out.power = "warn";

  if (led === "dark") {
    out.mcu = "fail";
    out.firmware = "fail";
  } else if (led === "white_spin" || led === "white_pulse") {
    out.mcu = "pass";
    out.firmware = duration === "under_2m" || duration === "2_15m" ? "warn" : "fail";
  } else if (led === "green" || led === "normal_idle" || led === "rainbow") {
    out.mcu = "pass";
    out.firmware = "pass";
  } else if (led === "orange" || led === "red") {
    out.mcu = "pass";
    out.firmware = "fail";
  }

  if (signals.has("home:ok") || signals.has("home:setup")) out.network = "pass";
  else if (signals.has("home:no_response") || signals.has("home:updating")) out.network = "warn";
  else if (signals.has("home:missing")) out.network = "fail";

  if (signals.has("touch:ok") && (signals.has("audio:ok") || signals.has("audio:chime"))) out.ready = "pass";
  else if (signals.has("touch:none") || signals.has("led:dark")) out.ready = "fail";
  else out.ready = "warn";

  if (signals.has("home:updating") || (duration === "15_60m" && (led === "white_spin" || led === "white_pulse"))) {
    out.update = "warn";
  } else if (duration === "hours_days" && (led === "white_spin" || led === "white_pulse")) {
    out.update = "fail";
  } else if (out.firmware === "pass") {
    out.update = "pass";
  }

  return out;
}
