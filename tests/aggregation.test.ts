import { describe, expect, it } from "vitest";

import { aggregateHistory } from "../src/aggregation";
import { createHourlySlots } from "../src/time-slots";
import type { HistoryState, NormalizedOccupancyHeatmapCardConfig } from "../src/types";

const baseConfig: NormalizedOccupancyHeatmapCardConfig = {
  type: "custom:occupancy-heatmap-card",
  entity: "sensor.room",
  title: undefined,
  days: 1,
  mode: "numeric",
  numeric_threshold: 0,
  numeric_intensity: "duration",
  numeric_color: "#03a9f4",
  state_colors: {},
  excluded_states: ["unknown", "unavailable"],
  show_legend: true,
};

function history(state: string, iso: string): HistoryState {
  return { s: state, lu: Date.parse(iso) / 1000 };
}

describe("createHourlySlots", () => {
  it.each([1, 7, 31])("creates 24 slots for each of %s displayed days", (days) => {
    const result = createHourlySlots(
      days,
      new Date("2026-07-28T12:30:00+08:00"),
      "Asia/Hong_Kong"
    );

    expect(result).toHaveLength(days);
    expect(result.every((day) => day.cells.length === 24)).toBe(true);
  });

  it("represents spring-forward and fall-back slots by their actual duration", () => {
    const spring = createHourlySlots(
      1,
      new Date("2026-03-08T18:00:00-04:00"),
      "America/New_York"
    )[0]!;
    const fall = createHourlySlots(
      1,
      new Date("2026-11-01T18:00:00-05:00"),
      "America/New_York"
    )[0]!;

    expect(spring.cells[2]?.durationSeconds).toBe(0);
    expect(fall.cells[1]?.durationSeconds).toBe(7200);
  });
});

describe("aggregateHistory", () => {
  it("uses duration above the numeric threshold for intensity", () => {
    const data = aggregateHistory({
      history: [
        history("0", "2026-07-27T16:00:00Z"),
        history("1", "2026-07-27T16:15:00Z"),
        history("0", "2026-07-27T16:45:00Z"),
      ],
      config: baseConfig,
      timeZone: "Asia/Hong_Kong",
      now: new Date("2026-07-28T02:00:00+08:00"),
    });

    expect(data.mode).toBe("numeric");
    expect(data.days[0]?.cells[0]).toMatchObject({
      occupiedSeconds: 1800,
      intensity: 0.5,
      future: false,
    });
    expect(data.totalSeconds).toBe(1800);
  });

  it("calculates a time-weighted occupied value", () => {
    const data = aggregateHistory({
      history: [
        history("1", "2026-07-27T16:00:00Z"),
        history("3", "2026-07-27T16:45:00Z"),
      ],
      config: { ...baseConfig, numeric_intensity: "value" },
      timeZone: "Asia/Hong_Kong",
      now: new Date("2026-07-28T01:00:00+08:00"),
    });

    expect(data.days[0]?.cells[0]).toMatchObject({
      occupiedSeconds: 3600,
      numericValue: 1.5,
      intensity: 1,
    });
    expect(data.numericRange).toEqual({ min: 1.5, max: 1.5 });
  });

  it("does not let below-threshold time dilute the occupied value", () => {
    const data = aggregateHistory({
      history: [
        history("0", "2026-07-27T16:00:00Z"),
        history("2", "2026-07-27T16:30:00Z"),
      ],
      config: { ...baseConfig, numeric_intensity: "value" },
      timeZone: "Asia/Hong_Kong",
      now: new Date("2026-07-28T01:00:00+08:00"),
    });

    expect(data.days[0]?.cells[0]).toMatchObject({
      occupiedSeconds: 1800,
      numericValue: 2,
      intensity: 1,
    });
  });

  it("normalizes occupied hourly values across the selected range", () => {
    const data = aggregateHistory({
      history: [
        history("1", "2026-07-27T16:00:00Z"),
        history("2", "2026-07-27T17:00:00Z"),
        history("3", "2026-07-27T18:00:00Z"),
      ],
      config: { ...baseConfig, numeric_intensity: "value" },
      timeZone: "Asia/Hong_Kong",
      now: new Date("2026-07-28T03:00:00+08:00"),
    });

    expect(data.numericRange).toEqual({ min: 1, max: 3 });
    expect(data.days[0]?.cells.slice(0, 3).map((cell) => cell.intensity)).toEqual([
      0, 0.5, 1,
    ]);
  });

  it("uses one numeric range across all selected days", () => {
    const data = aggregateHistory({
      history: [
        history("1", "2026-07-26T16:00:00Z"),
        history("3", "2026-07-27T16:00:00Z"),
      ],
      config: { ...baseConfig, days: 2, numeric_intensity: "value" },
      timeZone: "Asia/Hong_Kong",
      now: new Date("2026-07-28T01:00:00+08:00"),
    });

    expect(data.numericRange).toEqual({ min: 1, max: 3 });
    expect(data.days[0]?.cells[0]?.intensity).toBe(0);
    expect(data.days[1]?.cells[0]?.intensity).toBe(1);
  });

  it("omits excluded and non-numeric intervals from weighted values", () => {
    const data = aggregateHistory({
      history: [
        history("1", "2026-07-27T16:00:00Z"),
        history("unknown", "2026-07-27T16:12:00Z"),
        history("3", "2026-07-27T16:24:00Z"),
        history("not-a-number", "2026-07-27T16:36:00Z"),
        history("", "2026-07-27T16:48:00Z"),
      ],
      config: {
        ...baseConfig,
        numeric_intensity: "value",
        numeric_threshold: -1,
      },
      timeZone: "Asia/Hong_Kong",
      now: new Date("2026-07-28T01:00:00+08:00"),
    });

    expect(data.days[0]?.cells[0]).toMatchObject({
      occupiedSeconds: 1440,
      numericValue: 2,
      intensity: 1,
    });
  });

  it("leaves future cells out of the numeric range", () => {
    const data = aggregateHistory({
      history: [history("4", "2026-07-27T16:00:00Z")],
      config: { ...baseConfig, numeric_intensity: "value" },
      timeZone: "Asia/Hong_Kong",
      now: new Date("2026-07-28T00:30:00+08:00"),
    });

    expect(data.numericRange).toEqual({ min: 4, max: 4 });
    expect(data.days[0]?.cells[0]).toMatchObject({
      occupiedSeconds: 1800,
      numericValue: 4,
      intensity: 1,
    });
    expect(data.days[0]?.cells[1]).toMatchObject({
      future: true,
      occupiedSeconds: 0,
      intensity: 0,
    });
    expect(data.days[0]?.cells[1]?.numericValue).toBeUndefined();
  });

  it("weights values over the actual fall-back hour duration", () => {
    const data = aggregateHistory({
      history: [
        history("1", "2026-11-01T05:00:00Z"),
        history("3", "2026-11-01T06:00:00Z"),
        history("0", "2026-11-01T07:00:00Z"),
      ],
      config: { ...baseConfig, numeric_intensity: "value" },
      timeZone: "America/New_York",
      now: new Date("2026-11-01T03:00:00-05:00"),
    });

    expect(data.days[0]?.cells[1]).toMatchObject({
      durationSeconds: 7200,
      occupiedSeconds: 7200,
      numericValue: 2,
      intensity: 1,
    });
  });

  it("carries a state from before the displayed period", () => {
    const data = aggregateHistory({
      history: [history("2", "2026-07-27T15:30:00Z")],
      config: baseConfig,
      timeZone: "Asia/Hong_Kong",
      now: new Date("2026-07-28T01:00:00+08:00"),
    });

    expect(data.days[0]?.cells[0]?.occupiedSeconds).toBe(3600);
  });

  it("uses the longest categorical state and the latest state for ties", () => {
    const config = { ...baseConfig, mode: "categorical" as const };
    const data = aggregateHistory({
      history: [
        history("Kitchen", "2026-07-27T16:00:00Z"),
        history("Living Room", "2026-07-27T16:20:00Z"),
        history("Kitchen", "2026-07-27T17:00:00Z"),
        history("Living Room", "2026-07-27T17:30:00Z"),
      ],
      config,
      timeZone: "Asia/Hong_Kong",
      now: new Date("2026-07-28T02:00:00+08:00"),
    });

    expect(data.days[0]?.cells[0]).toMatchObject({
      state: "Living Room",
      occupiedSeconds: 2400,
      intensity: 2 / 3,
    });
    expect(data.days[0]?.cells[1]).toMatchObject({
      state: "Living Room",
      occupiedSeconds: 1800,
      intensity: 0.5,
    });
    expect(data.totalSeconds).toBe(7200);
    expect(data.legendStates).toEqual(["Kitchen", "Living Room"]);
  });

  it("ignores excluded states and leaves future hours empty", () => {
    const data = aggregateHistory({
      history: [
        history("1", "2026-07-27T16:00:00Z"),
        history("unknown", "2026-07-27T16:15:00Z"),
        history("1", "2026-07-27T16:45:00Z"),
      ],
      config: baseConfig,
      timeZone: "Asia/Hong_Kong",
      now: new Date("2026-07-28T00:30:00+08:00"),
    });

    expect(data.days[0]?.cells[0]).toMatchObject({
      occupiedSeconds: 900,
      intensity: 0.25,
    });
    expect(data.days[0]?.cells[1]).toMatchObject({
      future: true,
      occupiedSeconds: 0,
      intensity: 0,
    });
  });

  it("resolves auto mode from valid history", () => {
    const config = { ...baseConfig, mode: "auto" as const };

    expect(
      aggregateHistory({
        history: [history("Kitchen", "2026-07-27T16:00:00Z")],
        config,
        timeZone: "Asia/Hong_Kong",
        now: new Date("2026-07-28T01:00:00+08:00"),
      }).mode
    ).toBe("categorical");
  });
});
