import type {
  HeatmapMode,
  NormalizedOccupancyHeatmapCardConfig,
  OccupancyHeatmapCardConfig,
  ResolvedHeatmapMode,
} from "./types";

const MODES = new Set<HeatmapMode>(["auto", "numeric", "categorical"]);

export function normalizeConfig(
  config: OccupancyHeatmapCardConfig
): NormalizedOccupancyHeatmapCardConfig {
  const entity = config.entity?.trim();
  if (!entity) {
    throw new Error("Entity is required");
  }

  const days = config.days ?? 7;
  if (!Number.isInteger(days) || days < 1 || days > 31) {
    throw new Error("Days must be an integer between 1 and 31");
  }

  const mode = config.mode ?? "auto";
  if (!MODES.has(mode)) {
    throw new Error("Mode must be auto, numeric, or categorical");
  }

  const threshold = config.numeric_threshold ?? 0;
  if (!Number.isFinite(threshold)) {
    throw new Error("Numeric threshold must be a finite number");
  }

  const excludedStates = Array.from(
    new Set(
      (config.excluded_states ?? ["unknown", "unavailable"])
        .map((state) => state.trim())
        .filter(Boolean)
    )
  );

  return {
    type: "custom:occupancy-heatmap-card",
    entity,
    title: config.title?.trim() || undefined,
    days,
    mode,
    numeric_threshold: threshold,
    numeric_color: config.numeric_color?.trim() || "#03a9f4",
    state_colors: { ...(config.state_colors ?? {}) },
    excluded_states: excludedStates,
    show_legend: config.show_legend ?? true,
  };
}

export function detectMode(
  states: string[],
  excludedStates: string[]
): ResolvedHeatmapMode {
  const excluded = new Set(excludedStates);
  const validStates = states.filter((state) => state.trim() && !excluded.has(state));

  if (validStates.length === 0) {
    return "categorical";
  }

  return validStates.every((state) => Number.isFinite(Number(state)))
    ? "numeric"
    : "categorical";
}
