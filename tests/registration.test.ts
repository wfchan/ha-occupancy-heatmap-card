import { describe, expect, it } from "vitest";

describe("occupancy heatmap card registration", () => {
  it("registers the card and editor custom elements", async () => {
    await import("../src/ha-occupancy-heatmap-card");

    expect(customElements.get("occupancy-heatmap-card")).toBeDefined();
    expect(customElements.get("occupancy-heatmap-card-editor")).toBeDefined();
  });

  it("creates a loadable Home Assistant card shell", async () => {
    await import("../src/ha-occupancy-heatmap-card");

    const card = document.createElement("occupancy-heatmap-card") as HTMLElement & {
      setConfig(config: { entity: string }): void;
      updateComplete: Promise<boolean>;
    };
    card.setConfig({ entity: "sensor.room" });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.textContent).toContain("Occupancy Heatmap Card");
  });
});
