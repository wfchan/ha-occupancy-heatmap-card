import { OccupancyHeatmapCard } from "./card";
import { OccupancyHeatmapCardEditor } from "./editor";

export { OccupancyHeatmapCard, OccupancyHeatmapCardEditor };

if (!customElements.get("occupancy-heatmap-card-editor")) {
  customElements.define("occupancy-heatmap-card-editor", OccupancyHeatmapCardEditor);
}

if (!customElements.get("occupancy-heatmap-card")) {
  customElements.define("occupancy-heatmap-card", OccupancyHeatmapCard);
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === "occupancy-heatmap-card")) {
  window.customCards.push({
    type: "occupancy-heatmap-card",
    name: "Occupancy Heatmap Card",
    description: "Duration-based numeric and categorical history heatmaps.",
    preview: true,
    documentationURL: "https://github.com/wfchan/ha-occupancy-heatmap-card",
  });
}
