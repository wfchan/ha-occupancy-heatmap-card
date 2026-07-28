import { detectMode } from "./config";
import { createHourlySlots } from "./time-slots";
import type {
  HistoryState,
  NormalizedOccupancyHeatmapCardConfig,
  ResolvedHeatmapMode,
} from "./types";

export interface HeatmapCell {
  hour: number;
  start: Date;
  end: Date;
  durationSeconds: number;
  occupiedSeconds: number;
  intensity: number;
  state?: string;
  future: boolean;
}

export interface HeatmapDay {
  dateKey: string;
  date: Date;
  isToday: boolean;
  cells: HeatmapCell[];
}

export interface HeatmapData {
  mode: ResolvedHeatmapMode;
  days: HeatmapDay[];
  totalSeconds: number;
  legendStates: string[];
}

interface AggregateOptions {
  history: HistoryState[];
  config: NormalizedOccupancyHeatmapCardConfig;
  timeZone: string;
  now: Date;
}

interface StateInterval {
  state: string;
  start: number;
  end: number;
}

function createIntervals(history: HistoryState[], endTime: number): StateInterval[] {
  const ordered = [...history].sort((left, right) => left.lu - right.lu);
  return ordered.map((item, index) => ({
    state: item.s,
    start: item.lu * 1000,
    end: Math.min((ordered[index + 1]?.lu ?? endTime / 1000) * 1000, endTime),
  }));
}

function overlapSeconds(
  interval: StateInterval,
  slotStart: number,
  slotEnd: number
): number {
  return (
    Math.max(0, Math.min(interval.end, slotEnd) - Math.max(interval.start, slotStart)) /
    1000
  );
}

export function aggregateHistory({
  history,
  config,
  timeZone,
  now,
}: AggregateOptions): HeatmapData {
  const slots = createHourlySlots(config.days, now, timeZone);
  const mode =
    config.mode === "auto"
      ? detectMode(
          history.map((item) => item.s),
          config.excluded_states
        )
      : config.mode;
  const excluded = new Set(config.excluded_states);
  const intervals = createIntervals(history, now.getTime());
  const legendStates: string[] = [];
  const seenStates = new Set<string>();
  let totalSeconds = 0;

  const days = slots.map<HeatmapDay>((day) => ({
    ...day,
    cells: day.cells.map<HeatmapCell>((slot) => {
      const slotStart = slot.start.getTime();
      const slotEnd = slot.end.getTime();
      const effectiveEnd = Math.min(slotEnd, now.getTime());
      const future = slotStart >= now.getTime();

      if (future || slot.durationSeconds === 0) {
        return { ...slot, occupiedSeconds: 0, intensity: 0, future };
      }

      if (mode === "numeric") {
        let occupiedSeconds = 0;
        for (const interval of intervals) {
          if (
            excluded.has(interval.state) ||
            Number(interval.state) <= config.numeric_threshold
          ) {
            continue;
          }
          if (!Number.isFinite(Number(interval.state))) {
            continue;
          }
          occupiedSeconds += overlapSeconds(interval, slotStart, effectiveEnd);
        }
        totalSeconds += occupiedSeconds;
        return {
          ...slot,
          occupiedSeconds,
          intensity: Math.min(1, occupiedSeconds / slot.durationSeconds),
          future,
        };
      }

      const durations = new Map<string, { seconds: number; latestStart: number }>();
      let validSeconds = 0;
      for (const interval of intervals) {
        if (!interval.state.trim() || excluded.has(interval.state)) {
          continue;
        }
        const seconds = overlapSeconds(interval, slotStart, effectiveEnd);
        if (seconds <= 0) {
          continue;
        }
        validSeconds += seconds;
        if (!seenStates.has(interval.state)) {
          seenStates.add(interval.state);
          legendStates.push(interval.state);
        }
        const current = durations.get(interval.state) ?? { seconds: 0, latestStart: 0 };
        durations.set(interval.state, {
          seconds: current.seconds + seconds,
          latestStart: Math.max(current.latestStart, interval.start),
        });
      }
      totalSeconds += validSeconds;

      const winner = [...durations.entries()].sort((left, right) => {
        return (
          right[1].seconds - left[1].seconds || right[1].latestStart - left[1].latestStart
        );
      })[0];
      const occupiedSeconds = winner?.[1].seconds ?? 0;

      return {
        ...slot,
        occupiedSeconds,
        intensity: Math.min(1, occupiedSeconds / slot.durationSeconds),
        state: winner?.[0],
        future,
      };
    }),
  }));

  return { mode, days, totalSeconds, legendStates };
}
