import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "../src/ha-occupancy-heatmap-card";
import { OccupancyHeatmapCard } from "../src/card";
import type { HistoryStates, HomeAssistant } from "../src/types";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function hass(
  history: Promise<HistoryStates>,
  state = "1",
  name = "Room occupancy",
  unit?: string
): HomeAssistant {
  return {
    states: {
      "sensor.room": {
        entity_id: "sensor.room",
        state,
        last_changed: "2026-07-28T00:00:00Z",
        attributes: {
          friendly_name: name,
          ...(unit ? { unit_of_measurement: unit } : {}),
        },
      },
    },
    config: { time_zone: "Asia/Hong_Kong" },
    locale: { language: "en" },
    callWS: <T>() => history as Promise<T>,
  };
}

async function settle(card: OccupancyHeatmapCard): Promise<void> {
  for (let index = 0; index < 6; index += 1) {
    await Promise.resolve();
    await card.updateComplete;
  }
}

describe("OccupancyHeatmapCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-28T01:00:00+08:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders a loading state while history is pending", async () => {
    const pending = deferred<HistoryStates>();
    const card = document.createElement("occupancy-heatmap-card") as OccupancyHeatmapCard;
    card.setConfig({ entity: "sensor.room" });
    card.hass = hass(pending.promise);
    document.body.append(card);
    await card.updateComplete;

    expect(
      card.shadowRoot?.querySelector("[data-state='loading']")?.textContent
    ).toContain("Loading history");
  });

  it("does not reissue a pending history request when the entity is unchanged", async () => {
    const pending = deferred<HistoryStates>();
    const homeAssistant = hass(pending.promise);
    const callWS = vi.spyOn(homeAssistant, "callWS");
    const card = document.createElement("occupancy-heatmap-card") as OccupancyHeatmapCard;
    card.setConfig({ entity: "sensor.room" });
    card.hass = homeAssistant;
    document.body.append(card);
    await card.updateComplete;

    vi.setSystemTime(new Date("2026-07-28T01:00:01+08:00"));
    card.hass = homeAssistant;
    await card.updateComplete;

    expect(callWS).toHaveBeenCalledTimes(1);
  });

  it("selects a suggested entity for stub configuration", () => {
    expect(
      OccupancyHeatmapCard.getStubConfig(hass(Promise.resolve({})), ["sensor.room"])
    ).toMatchObject({ entity: "sensor.room", days: 7, mode: "auto" });
  });

  it("renders 24 numeric cells per day and an occupied summary", async () => {
    const history = Promise.resolve({
      "sensor.room": [
        { s: "0", lu: Date.parse("2026-07-27T16:00:00Z") / 1000 },
        { s: "1", lu: Date.parse("2026-07-27T16:30:00Z") / 1000 },
      ],
    });
    const card = document.createElement("occupancy-heatmap-card") as OccupancyHeatmapCard;
    card.setConfig({ entity: "sensor.room", mode: "numeric", days: 1 });
    card.hass = hass(history);
    document.body.append(card);
    await settle(card);

    expect(card.shadowRoot?.querySelectorAll("button.cell")).toHaveLength(24);
    expect(card.shadowRoot?.textContent).toContain("0.5 h occupied");
    expect(card.shadowRoot?.textContent).toContain("Room occupancy");
  });

  it("renders only selected hours with relative three-hour labels", async () => {
    vi.setSystemTime(new Date("2026-07-28T12:00:00+08:00"));
    const recorded = Promise.resolve({
      "sensor.room": [{ s: "1", lu: Date.parse("2026-07-28T01:00:00Z") / 1000 }],
    });
    const card = document.createElement("occupancy-heatmap-card") as OccupancyHeatmapCard;
    card.setConfig({
      entity: "sensor.room",
      mode: "numeric",
      days: 1,
      start_hour: 9,
      end_hour: 23,
    });
    card.hass = hass(recorded);
    document.body.append(card);
    await settle(card);

    expect(card.shadowRoot?.querySelectorAll("button.cell")).toHaveLength(15);
    expect(
      [
        ...(card.shadowRoot?.querySelectorAll(".hour-label[role='columnheader']") ?? []),
      ].map((label) => label.textContent)
    ).toEqual(["9", "12", "15", "18", "21"]);
    expect(
      card.shadowRoot
        ?.querySelector<HTMLElement>(".matrix")
        ?.style.getPropertyValue("--heatmap-column-count")
    ).toBe("15");
  });

  it("requests history from the oldest selected start hour", async () => {
    vi.setSystemTime(new Date("2026-07-28T12:00:00+08:00"));
    const homeAssistant = hass(Promise.resolve({ "sensor.room": [] }));
    const callWS = vi.spyOn(homeAssistant, "callWS");
    const card = document.createElement("occupancy-heatmap-card") as OccupancyHeatmapCard;
    card.setConfig({
      entity: "sensor.room",
      days: 1,
      start_hour: 9,
      end_hour: 23,
    });
    card.hass = homeAssistant;
    document.body.append(card);
    await settle(card);

    expect(callWS).toHaveBeenCalledWith(
      expect.objectContaining({ start_time: "2026-07-28T01:00:00.000Z" })
    );
  });

  it("shows weighted sensor value, unit, and occupied duration", async () => {
    const recorded = Promise.resolve({
      "sensor.room": [
        { s: "1", lu: Date.parse("2026-07-27T16:00:00Z") / 1000 },
        { s: "3", lu: Date.parse("2026-07-27T16:45:00Z") / 1000 },
      ],
    });
    const card = document.createElement("occupancy-heatmap-card") as OccupancyHeatmapCard;
    card.setConfig({
      entity: "sensor.room",
      mode: "numeric",
      days: 1,
      numeric_intensity: "value",
    });
    card.hass = hass(recorded, "3", "Person count", "people");
    document.body.append(card);
    await settle(card);

    const occupied =
      card.shadowRoot?.querySelector<HTMLButtonElement>("button.cell.filled");
    occupied?.focus();
    await card.updateComplete;

    expect(occupied?.getAttribute("aria-label")).toContain("1.5 people");
    expect(card.shadowRoot?.querySelector(".details strong")?.textContent).toBe(
      "1.5 people"
    );
    expect(card.shadowRoot?.querySelector(".details")?.textContent).toContain("60 min");
  });

  it("renders the dominant categorical state and legend", async () => {
    const history = Promise.resolve({
      "sensor.room": [
        { s: "Kitchen", lu: Date.parse("2026-07-27T16:00:00Z") / 1000 },
        { s: "Living Room", lu: Date.parse("2026-07-27T16:20:00Z") / 1000 },
      ],
    });
    const card = document.createElement("occupancy-heatmap-card") as OccupancyHeatmapCard;
    card.setConfig({ entity: "sensor.room", mode: "categorical", days: 1 });
    card.hass = hass(history, "Living Room", "Location");
    document.body.append(card);
    await settle(card);

    expect(
      card.shadowRoot?.querySelector("button.cell")?.getAttribute("aria-label")
    ).toContain("Living Room");
    expect(card.shadowRoot?.querySelector(".legend")?.textContent).toContain("Kitchen");
    expect(card.shadowRoot?.querySelector(".legend")?.textContent).toContain(
      "Living Room"
    );
  });

  it("renders distinct missing entity, empty history, and history error states", async () => {
    const missing = document.createElement(
      "occupancy-heatmap-card"
    ) as OccupancyHeatmapCard;
    missing.setConfig({ entity: "sensor.missing" });
    missing.hass = hass(Promise.resolve({}));
    document.body.append(missing);
    await settle(missing);
    expect(missing.shadowRoot?.querySelector("[data-state='missing']")).toBeTruthy();

    const empty = document.createElement(
      "occupancy-heatmap-card"
    ) as OccupancyHeatmapCard;
    empty.setConfig({ entity: "sensor.room" });
    empty.hass = hass(Promise.resolve({ "sensor.room": [] }));
    document.body.append(empty);
    await settle(empty);
    expect(empty.shadowRoot?.querySelector("[data-state='empty']")).toBeTruthy();

    const failed = document.createElement(
      "occupancy-heatmap-card"
    ) as OccupancyHeatmapCard;
    failed.setConfig({ entity: "sensor.room" });
    failed.hass = hass(Promise.reject(new Error("Recorder unavailable")));
    document.body.append(failed);
    await settle(failed);
    expect(
      failed.shadowRoot?.querySelector("[data-state='error']")?.textContent
    ).toContain("Recorder unavailable");
  });
});
