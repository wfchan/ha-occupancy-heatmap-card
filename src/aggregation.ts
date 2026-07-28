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
  numericValue?: number;
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
  numericRange?: { min: number; max: number };
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
  const slots = createHourlySlots(
    config.days,
    now,
    timeZone,
    config.start_hour,
    config.end_hour
  );
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
  let firstIntervalIndex = 0;
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

      while (
        firstIntervalIndex < intervals.length &&
        intervals[firstIntervalIndex]!.end <= slotStart
      ) {
        firstIntervalIndex += 1;
      }

      if (mode === "numeric") {
        let occupiedSeconds = 0;
        let weightedTotal = 0;
        for (let index = firstIntervalIndex; index < intervals.length; index += 1) {
          const interval = intervals[index]!;
          if (interval.start >= effectiveEnd) break;
          const value = Number(interval.state);
          if (
            !interval.state.trim() ||
            excluded.has(interval.state) ||
            !Number.isFinite(value) ||
            value <= config.numeric_threshold
          ) {
            continue;
          }
          const seconds = overlapSeconds(interval, slotStart, effectiveEnd);
          if (seconds <= 0) {
            continue;
          }
          occupiedSeconds += seconds;
          weightedTotal += value * seconds;
        }
        totalSeconds += occupiedSeconds;
        return {
          ...slot,
          occupiedSeconds,
          numericValue: occupiedSeconds > 0 ? weightedTotal / occupiedSeconds : undefined,
          intensity: Math.min(1, occupiedSeconds / slot.durationSeconds),
          future,
        };
      }

      const durations = new Map<string, { seconds: number; latestStart: number }>();
      let validSeconds = 0;
      for (let index = firstIntervalIndex; index < intervals.length; index += 1) {
        const interval = intervals[index]!;
        if (interval.start >= effectiveEnd) break;
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

  const numericValues =
    mode === "numeric" && config.numeric_intensity === "value"
      ? days.flatMap((day) =>
          day.cells.flatMap((cell) =>
            !cell.future && cell.occupiedSeconds > 0 && cell.numericValue !== undefined
              ? [cell.numericValue]
              : []
          )
        )
      : [];
  const numericRange = numericValues.length
    ? { min: Math.min(...numericValues), max: Math.max(...numericValues) }
    : undefined;

  if (numericRange) {
    const span = numericRange.max - numericRange.min;
    for (const day of days) {
      for (const cell of day.cells) {
        if (cell.numericValue === undefined || cell.occupiedSeconds === 0) {
          continue;
        }
        cell.intensity = span === 0 ? 1 : (cell.numericValue - numericRange.min) / span;
      }
    }
  }

  return { mode, days, totalSeconds, legendStates, numericRange };
}
