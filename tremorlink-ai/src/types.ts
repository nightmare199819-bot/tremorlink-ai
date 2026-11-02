export type Scenario =
  | "normal"
  | "isolated"
  | "corroborated"
  | "interruption"
  | "duplicate";

export type Page =
  | "overview"
  | "sensors"
  | "ai"
  | "mesh"
  | "verification"
  | "community";

export interface CommunityReport {
  id: number;
  area: string;
  message: string;
  time: string;
  status: "New" | "Reviewed";
}
