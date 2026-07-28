import { describe, expect, it } from "vitest";

import { detectMode, normalizeConfig } from "../src/config";

describe("normalizeConfig", () => {
  it("applies the public defaults", () => {
    expect(normalizeConfig({ entity: "sensor.room" })).toEqual({
      type: "custom:occupancy-heatmap-card",
      entity: "sensor.room",
      title: undefined,
      days: 7,
      mode: "auto",
      numeric_threshold: 0,
      numeric_color: "#03a9f4",
      state_colors: {},
      excluded_states: ["unknown", "unavailable"],
      show_legend: true,
    });
  });

  it("rejects a missing entity", () => {
    expect(() => normalizeConfig({})).toThrow("Entity is required");
  });

  it.each([0, 1.5, 32])("rejects an invalid day range: %s", (days) => {
    expect(() => normalizeConfig({ entity: "sensor.room", days })).toThrow(
      "Days must be an integer between 1 and 31"
    );
  });

  it("rejects an unsupported mode", () => {
    expect(() =>
      normalizeConfig({ entity: "sensor.room", mode: "continuous" as "auto" })
    ).toThrow("Mode must be auto, numeric, or categorical");
  });

  it("deduplicates and trims excluded states", () => {
    const config = normalizeConfig({
      entity: "sensor.room",
      excluded_states: [" unknown ", "", "unknown", "unavailable"],
    });

    expect(config.excluded_states).toEqual(["unknown", "unavailable"]);
  });
});

describe("detectMode", () => {
  it("detects numeric history when every valid state is finite", () => {
    expect(detectMode(["0", "2.5", "unknown"], ["unknown", "unavailable"])).toBe(
      "numeric"
    );
  });

  it("detects categorical history when a valid state is not numeric", () => {
    expect(
      detectMode(["1", "Living Room", "unavailable"], ["unknown", "unavailable"])
    ).toBe("categorical");
  });

  it("defaults empty valid history to categorical", () => {
    expect(detectMode(["unknown", "unavailable"], ["unknown", "unavailable"])).toBe(
      "categorical"
    );
  });
});
