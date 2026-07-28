export type HeatmapMode = "auto" | "numeric" | "categorical";
export type ResolvedHeatmapMode = Exclude<HeatmapMode, "auto">;

export interface OccupancyHeatmapCardConfig {
  type?: string;
  entity?: string;
  title?: string;
  days?: number;
  mode?: HeatmapMode;
  numeric_threshold?: number;
  numeric_color?: string;
  state_colors?: Record<string, string>;
  excluded_states?: string[];
  show_legend?: boolean;
}

export interface NormalizedOccupancyHeatmapCardConfig {
  type: "custom:occupancy-heatmap-card";
  entity: string;
  title: string | undefined;
  days: number;
  mode: HeatmapMode;
  numeric_threshold: number;
  numeric_color: string;
  state_colors: Record<string, string>;
  excluded_states: string[];
  show_legend: boolean;
}

export interface HistoryState {
  s: string;
  lu: number;
  lc?: number;
  a?: Record<string, unknown>;
}

export type HistoryStates = Record<string, HistoryState[]>;

export interface HassEntity {
  entity_id: string;
  state: string;
  last_changed: string;
  attributes: {
    friendly_name?: string;
    [key: string]: unknown;
  };
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  config: { time_zone: string };
  locale: { language: string };
  callWS<T>(message: Record<string, unknown>): Promise<T>;
}
