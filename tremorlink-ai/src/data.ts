import type { Scenario } from "./types";

export const scenarios: { id: Scenario; label: string; detail: string }[] = [
  { id: "normal", label: "Normal activity", detail: "Everyday movement across the network" },
  { id: "isolated", label: "Isolated impact", detail: "One device observes an unusual local signal" },
  { id: "corroborated", label: "Corroborated event", detail: "Independent origins report a matching event" },
  { id: "interruption", label: "Network interruption", detail: "Some devices lose their simulated connection" },
  { id: "duplicate", label: "Duplicate packet", detail: "Repeated delivery is rejected by deduplication" }
];

export const baseWave = Array.from({ length: 48 }, (_, i) => ({
  t: i,
  x: Math.sin(i * 0.58) * 0.14 + Math.sin(i * 1.7) * 0.05 + Math.cos(i * 0.21) * 0.04
}));

export const devicePositions = [
  { id: "TL-01", x: 50, y: 12, label: "North relay", state: "online" },
  { id: "TL-02", x: 18, y: 36, label: "West sensor", state: "online" },
  { id: "TL-03", x: 78, y: 34, label: "East sensor", state: "online" },
  { id: "TL-04", x: 34, y: 70, label: "South relay", state: "online" },
  { id: "TL-05", x: 68, y: 76, label: "Community node", state: "online" },
  { id: "TL-06", x: 50, y: 47, label: "Local hub", state: "online" },
  { id: "TL-07", x: 88, y: 66, label: "Edge device", state: "online" }
];
