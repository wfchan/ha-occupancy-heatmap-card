import { css, html, LitElement } from "lit";

class OccupancyHeatmapCardEditor extends LitElement {
  override render() {
    return html`<p>Occupancy Heatmap Card editor</p>`;
  }
}

class OccupancyHeatmapCard extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    ha-card {
      padding: 20px;
    }

    h2 {
      margin: 0 0 8px;
      font-size: 18px;
    }
  `;

  setConfig(_config: { entity: string }): void {
    this.requestUpdate();
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("occupancy-heatmap-card-editor");
  }

  static getStubConfig(): Record<string, string> {
    return { entity: "" };
  }

  override render() {
    return html`<ha-card>
      <h2>Occupancy Heatmap Card</h2>
      <div>Ready to configure.</div>
    </ha-card>`;
  }
}

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
window.customCards.push({
  type: "occupancy-heatmap-card",
  name: "Occupancy Heatmap Card",
  description: "Duration-based numeric and categorical history heatmaps.",
  preview: true,
});
