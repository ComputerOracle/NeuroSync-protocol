"use client";

import { useMemo } from "react";

export interface TelemetryMetrics {
  sleepDuration: number;
  stressLevel: number;
  heartRate: number;
  deepSleep: number; // in percentage, e.g. 14 for 14%
  remSleep: number;  // in percentage
  sleepEfficiency: number; // in percentage
  onsetLatency: number; // in minutes
  hrv: number;
}

export interface Recommendation {
  id: string;
  title: string;
  category: "Circadian" | "Metabolic" | "Autonomic" | "Architecture";
  target: string;
  action: string;
  isActive: boolean;
  ruleDescription: string;
}

export function useNeuroRecommendations(metrics: TelemetryMetrics) {
  const recommendations = useMemo<Recommendation[]>(() => {
    return [
      {
        id: "glymphatic",
        title: "Glymphatic System & Slow-Wave Protocol",
        category: "Architecture",
        target: "Enhances slow-wave delta oscillations and glymphatic clearance of neurotoxic metabolic waste.",
        action: "Perform thermal downregulation (set room temp to 18°C / 65°F and take a warm shower 90 mins before bed to trigger rapid core body cooling and deep sleep delta wave oscillations).",
        isActive: metrics.deepSleep < 15,
        ruleDescription: "Triggers if Deep Sleep < 15%",
      },
      {
        id: "vagal_tone",
        title: "Autonomic Parasympathetic Recovery Protocol",
        category: "Autonomic",
        target: "Shifts nervous system from sympathetic dominance to parasympathetic recovery.",
        action: "Perform 5 minutes of cyclic sighing (two deep nasal inhales followed by a long oral exhalation) prior to sleep onset to activate the vagal nerve brake and shift from sympathetic to parasympathetic recovery.",
        isActive: metrics.heartRate > 65 || metrics.hrv < 50,
        ruleDescription: "Triggers if resting HR > 65 BPM or HRV < 50 ms",
      },
      {
        id: "circadian_anchoring",
        title: "Circadian Anchoring & Phase Response",
        category: "Circadian",
        target: "Aligns suprachiasmatic nucleus (SCN) circadian timer and optimizes nighttime melatonin release.",
        action: "View 10–15 minutes of direct morning outdoor light within 30 minutes of waking (no sunglasses). Avoid bright overhead blue-spectrum light 2 hours prior to sleep.",
        isActive: metrics.sleepEfficiency < 85,
        ruleDescription: "Triggers if Sleep Efficiency < 85%",
      },
      {
        id: "adenosine_receptor",
        title: "Adenosine Receptor Cutoff Protocol",
        category: "Metabolic",
        target: "Prevents competitive binding of caffeine to adenosine receptors during sleep architecture buildup.",
        action: "Enforce a strict 10-hour caffeine cutoff window prior to target bedtime based on CYP1A2 metabolic half-life to prevent competitive binding of caffeine to adenosine receptors.",
        isActive: metrics.onsetLatency > 25,
        ruleDescription: "Triggers if onset latency > 25 mins",
      },
      {
        id: "rem_architecture",
        title: "Memory Consolidation & REM Architecture Protocol",
        category: "Architecture",
        target: "Protects procedural memory consolidation and emotional regulation during late-cycle REM sleep.",
        action: "Eliminate late-evening light exposure and alcohol/THC consumption, which suppress rapid eye movement density and fragment late-cycle REM sleep.",
        isActive: metrics.remSleep < 20,
        ruleDescription: "Triggers if REM < 20%",
      },
    ];
  }, [metrics]);

  return recommendations;
}
