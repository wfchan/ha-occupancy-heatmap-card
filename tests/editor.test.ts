import { describe, expect, it, vi } from "vitest";

import "../src/ha-occupancy-heatmap-card";
import { OccupancyHeatmapCardEditor } from "../src/editor";
import type { HomeAssistant } from "../src/types";

const hass: HomeAssistant = {
  states: {
    "sensor.room": {
      entity_id: "sensor.room",
      state: "Living Room",
      last_changed: "2026-07-28T00:00:00Z",
      attributes: { friendly_name: "Location" },
    },
  },
  config: { time_zone: "Asia/Hong_Kong" },
  locale: { language: "en" },
  callWS: vi.fn(),
};

describe("OccupancyHeatmapCardEditor", () => {
  it("renders the required configuration controls", async () => {
    const editor = document.createElement(
      "occupancy-heatmap-card-editor"
    ) as OccupancyHeatmapCardEditor;
    editor.hass = hass;
    editor.setConfig({ entity: "sensor.room" });
    document.body.append(editor);
    await editor.updateComplete;

    expect(editor.shadowRoot?.querySelector("select[name='entity']")).toBeTruthy();
    expect(editor.shadowRoot?.querySelector("input[name='days']")).toBeTruthy();
    expect(editor.shadowRoot?.querySelector("select[name='mode']")).toBeTruthy();
    expect(
      editor.shadowRoot?.querySelector("input[name='numeric_threshold']")
    ).toBeTruthy();
    expect(editor.shadowRoot?.querySelector("input[name='numeric_color']")).toBeTruthy();
  });

  it("emits config-changed with normalized numeric controls", async () => {
    const editor = document.createElement(
      "occupancy-heatmap-card-editor"
    ) as OccupancyHeatmapCardEditor;
    editor.hass = hass;
    editor.setConfig({ entity: "sensor.room" });
    document.body.append(editor);
    await editor.updateComplete;
    const listener = vi.fn();
    editor.addEventListener("config-changed", listener);

    const days = editor.shadowRoot?.querySelector<HTMLInputElement>("input[name='days']");
    if (!days) throw new Error("Days input missing");
    days.value = "14";
    days.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0]?.[0].detail.config.days).toBe(14);
  });

  it("shows state color mappings in categorical mode", async () => {
    const editor = document.createElement(
      "occupancy-heatmap-card-editor"
    ) as OccupancyHeatmapCardEditor;
    editor.hass = hass;
    editor.setConfig({
      entity: "sensor.room",
      mode: "categorical",
      state_colors: { Kitchen: "#57b881" },
    });
    document.body.append(editor);
    await editor.updateComplete;

    expect(editor.shadowRoot?.querySelector("[data-state-color='Kitchen']")).toBeTruthy();
    expect(
      editor.shadowRoot?.querySelector("button[data-action='add-state']")
    ).toBeTruthy();
  });
});
