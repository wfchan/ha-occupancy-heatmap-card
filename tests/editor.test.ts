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
  it("binds the entity picker when hass is assigned after the first render", async () => {
    const editor = document.createElement(
      "occupancy-heatmap-card-editor"
    ) as OccupancyHeatmapCardEditor;
    editor.setConfig({ entity: "sensor.room" });
    document.body.append(editor);
    await editor.updateComplete;

    const picker = editor.shadowRoot?.querySelector<HTMLElement>("ha-entity-picker");
    expect(picker).toBeTruthy();
    expect((picker as HTMLElement & { hass?: HomeAssistant }).hass).toBeUndefined();

    editor.hass = hass;
    await editor.updateComplete;

    expect((picker as HTMLElement & { hass?: HomeAssistant }).hass).toBe(hass);
    expect((picker as HTMLElement & { value?: string }).value).toBe("sensor.room");
  });

  it("emits config-changed when the entity picker value changes", async () => {
    const editor = document.createElement(
      "occupancy-heatmap-card-editor"
    ) as OccupancyHeatmapCardEditor;
    editor.hass = hass;
    editor.setConfig({ entity: "sensor.room" });
    document.body.append(editor);
    await editor.updateComplete;
    const listener = vi.fn();
    editor.addEventListener("config-changed", listener);

    const picker = editor.shadowRoot?.querySelector<HTMLElement>("ha-entity-picker");
    if (!picker) throw new Error("Entity picker missing");
    picker.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: "sensor.kitchen" },
      })
    );

    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0]?.[0].detail.config.entity).toBe("sensor.kitchen");
  });

  it("renders the required configuration controls", async () => {
    const editor = document.createElement(
      "occupancy-heatmap-card-editor"
    ) as OccupancyHeatmapCardEditor;
    editor.hass = hass;
    editor.setConfig({ entity: "sensor.room" });
    document.body.append(editor);
    await editor.updateComplete;

    expect(editor.shadowRoot?.querySelector("ha-entity-picker")).toBeTruthy();
    expect(editor.shadowRoot?.querySelector("input[name='days']")).toBeTruthy();
    expect(editor.shadowRoot?.querySelector("select[name='mode']")).toBeTruthy();
    const startHour = editor.shadowRoot?.querySelector<HTMLSelectElement>(
      "select[name='start_hour']"
    );
    const endHour = editor.shadowRoot?.querySelector<HTMLSelectElement>(
      "select[name='end_hour']"
    );
    expect(startHour?.value).toBe("0");
    expect(endHour?.value).toBe("23");
    expect(startHour?.options).toHaveLength(24);
    expect(endHour?.options).toHaveLength(24);
    expect(
      editor.shadowRoot?.querySelector("input[name='numeric_threshold']")
    ).toBeTruthy();
    expect(
      editor.shadowRoot?.querySelector("select[name='numeric_intensity']")
    ).toBeTruthy();
    expect(editor.shadowRoot?.querySelector("input[name='numeric_color']")).toBeTruthy();
  });

  it("disables hour choices that would create an overnight range", async () => {
    const editor = document.createElement(
      "occupancy-heatmap-card-editor"
    ) as OccupancyHeatmapCardEditor;
    editor.setConfig({ entity: "sensor.room", start_hour: 9, end_hour: 18 });
    document.body.append(editor);
    await editor.updateComplete;

    const start = editor.shadowRoot?.querySelector<HTMLSelectElement>(
      "select[name='start_hour']"
    );
    const end = editor.shadowRoot?.querySelector<HTMLSelectElement>(
      "select[name='end_hour']"
    );
    expect(start?.options[19]?.disabled).toBe(true);
    expect(start?.options[18]?.disabled).toBe(false);
    expect(end?.options[8]?.disabled).toBe(true);
    expect(end?.options[9]?.disabled).toBe(false);
  });

  it.each([
    ["start_hour", "9", 9],
    ["end_hour", "23", 23],
  ] as const)("emits numeric %s changes", async (name, value, expected) => {
    const editor = document.createElement(
      "occupancy-heatmap-card-editor"
    ) as OccupancyHeatmapCardEditor;
    editor.setConfig({ entity: "sensor.room", start_hour: 0, end_hour: 23 });
    document.body.append(editor);
    await editor.updateComplete;
    const listener = vi.fn();
    editor.addEventListener("config-changed", listener);
    const select = editor.shadowRoot?.querySelector<HTMLSelectElement>(
      `select[name='${name}']`
    );
    if (!select) throw new Error(`${name} selector missing`);

    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

    expect(listener.mock.calls[0]?.[0].detail.config[name]).toBe(expected);
  });

  it("emits sensor value intensity changes", async () => {
    const editor = document.createElement(
      "occupancy-heatmap-card-editor"
    ) as OccupancyHeatmapCardEditor;
    editor.hass = hass;
    editor.setConfig({ entity: "sensor.room", mode: "numeric" });
    document.body.append(editor);
    await editor.updateComplete;
    const listener = vi.fn();
    editor.addEventListener("config-changed", listener);
    const select = editor.shadowRoot?.querySelector<HTMLSelectElement>(
      "select[name='numeric_intensity']"
    );
    if (!select) throw new Error("Numeric intensity selector missing");

    select.value = "value";
    select.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0]?.[0].detail.config.numeric_intensity).toBe("value");
  });

  it("hides numeric intensity in categorical mode", async () => {
    const editor = document.createElement(
      "occupancy-heatmap-card-editor"
    ) as OccupancyHeatmapCardEditor;
    editor.setConfig({ entity: "sensor.room", mode: "categorical" });
    document.body.append(editor);
    await editor.updateComplete;

    expect(
      editor.shadowRoot?.querySelector("select[name='numeric_intensity']")
    ).toBeNull();
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
