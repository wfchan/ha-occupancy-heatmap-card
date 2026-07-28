import { css, html, LitElement, nothing } from "lit";
import { styleMap } from "lit/directives/style-map.js";

import { aggregateHistory, type HeatmapCell, type HeatmapData } from "./aggregation";
import { normalizeConfig } from "./config";
import { HistoryService } from "./history-service";
import { getStateColor } from "./palette";
import { createHourlySlots } from "./time-slots";
import type {
  HomeAssistant,
  NormalizedOccupancyHeatmapCardConfig,
  OccupancyHeatmapCardConfig,
} from "./types";

type ViewState = "idle" | "loading" | "ready" | "missing" | "empty" | "error";

export class OccupancyHeatmapCard extends LitElement {
  static override styles = css`
    :host {
      display: block;
      container-type: inline-size;
      --heatmap-cell-size: 18px;
      --heatmap-gap: 3px;
      --heatmap-label-width: 60px;
      --heatmap-empty: color-mix(
        in srgb,
        var(--secondary-text-color, #727b88) 16%,
        transparent
      );
      color: var(--primary-text-color, #17212b);
    }

    ha-card {
      overflow: hidden;
      border-radius: var(--ha-card-border-radius, 8px);
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }

    .content {
      padding: 20px;
    }

    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 18px;
    }

    .identity {
      min-width: 0;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .status-dot,
    .swatch {
      flex: 0 0 auto;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--state-color, var(--primary-color, #03a9f4));
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--state-color) 15%, transparent);
    }

    h2 {
      overflow-wrap: anywhere;
      margin: 0;
      font-size: 18px;
      font-weight: 650;
      line-height: 1.3;
      letter-spacing: 0;
    }

    .summary {
      margin: 5px 0 0 19px;
      color: var(--secondary-text-color, #6d7683);
      font-size: 13px;
      line-height: 1.4;
    }

    .legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px 14px;
      max-width: 55%;
      color: var(--secondary-text-color, #6d7683);
      font-size: 12px;
    }

    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    .legend .swatch {
      width: 8px;
      height: 8px;
      box-shadow: none;
    }

    .scroll {
      overflow-x: auto;
      padding: 1px 0 7px;
      scrollbar-width: thin;
      scrollbar-color: var(--divider-color, #c8cdd4) transparent;
    }

    .matrix {
      display: grid;
      gap: var(--heatmap-gap);
      width: max-content;
      min-width: 100%;
    }

    .matrix-row {
      display: grid;
      grid-template-columns: var(--heatmap-label-width) repeat(
          var(--heatmap-column-count),
          var(--heatmap-cell-size)
        );
      gap: var(--heatmap-gap);
      align-items: center;
      min-width: max-content;
    }

    .row-label,
    .corner {
      position: sticky;
      left: 0;
      z-index: 2;
      box-sizing: border-box;
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }

    .row-label {
      overflow: hidden;
      padding: 3px 8px 3px 3px;
      color: var(--secondary-text-color, #6d7683);
      font-size: 12px;
      font-weight: 600;
      text-align: right;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .row-label.today {
      border: 1px solid color-mix(in srgb, var(--primary-color, #03a9f4) 65%, transparent);
      border-radius: 6px;
      color: var(--primary-color, #03a9f4);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .hour-label {
      height: 17px;
      color: var(--secondary-text-color, #6d7683);
      font-size: 11px;
      text-align: center;
    }

    .cell {
      position: relative;
      box-sizing: border-box;
      width: var(--heatmap-cell-size);
      height: var(--heatmap-cell-size);
      padding: 0;
      border: 1px solid color-mix(in srgb, var(--divider-color, #9aa2ad) 32%, transparent);
      border-radius: 5px;
      background: var(--heatmap-empty);
      cursor: pointer;
      transition:
        transform 120ms ease,
        border-color 120ms ease;
    }

    .cell.filled {
      border-color: color-mix(in srgb, var(--cell-color) 44%, transparent);
      background: color-mix(
        in srgb,
        var(--cell-color) var(--cell-strength),
        var(--heatmap-empty)
      );
    }

    .cell:hover,
    .cell:focus-visible,
    .cell.selected {
      z-index: 3;
      border-color: var(--cell-color, var(--primary-color, #03a9f4));
      outline: none;
      transform: translateY(-1px);
    }

    .cell:focus-visible {
      box-shadow:
        0 0 0 2px var(--ha-card-background, #fff),
        0 0 0 4px var(--primary-color, #03a9f4);
    }

    .cell:disabled {
      cursor: default;
      opacity: 0.35;
      transform: none;
    }

    .details {
      display: flex;
      min-height: 20px;
      align-items: center;
      gap: 8px;
      margin-top: 11px;
      color: var(--secondary-text-color, #6d7683);
      font-size: 12px;
    }

    .details strong {
      color: var(--primary-text-color, #17212b);
      font-weight: 650;
    }

    .state-panel {
      display: grid;
      min-height: 156px;
      place-items: center;
      padding: 24px;
      text-align: center;
    }

    .state-panel strong {
      display: block;
      margin-bottom: 6px;
      font-size: 15px;
    }

    .state-panel span {
      max-width: 420px;
      color: var(--secondary-text-color, #6d7683);
      font-size: 13px;
      line-height: 1.5;
    }

    .loading-mark {
      width: 22px;
      height: 22px;
      margin-bottom: 12px;
      border: 2px solid var(--divider-color, #d3d7dd);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%;
      animation: spin 800ms linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 600px) {
      :host {
        --heatmap-cell-size: 22px;
        --heatmap-gap: 4px;
        --heatmap-label-width: 64px;
      }

      .content {
        padding: 16px;
      }

      .header {
        display: block;
        margin-bottom: 15px;
      }

      .legend {
        justify-content: flex-start;
        max-width: none;
        margin: 12px 0 0 19px;
      }
    }

    @container (min-width: 820px) {
      :host {
        --heatmap-cell-size: 23px;
        --heatmap-gap: 5px;
        --heatmap-label-width: 72px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .cell {
        transition: none;
      }

      .loading-mark {
        animation: none;
      }
    }
  `;

  private _hass?: HomeAssistant;
  private config?: NormalizedOccupancyHeatmapCardConfig;
  private data?: HeatmapData;
  private viewState: ViewState = "idle";
  private errorMessage = "";
  private selected?: HeatmapCell;
  private historyService = new HistoryService();
  private history: Parameters<typeof aggregateHistory>[0]["history"] = [];
  private minuteTimer?: ReturnType<typeof setInterval>;

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  set hass(value: HomeAssistant | undefined) {
    const previous = this._hass;
    const entityId = this.config?.entity;
    const previousChanged = entityId
      ? previous?.states[entityId]?.last_changed
      : undefined;
    const nextChanged = entityId ? value?.states[entityId]?.last_changed : undefined;
    this._hass = value;
    this.requestUpdate("hass", previous);

    if (
      this.config &&
      value &&
      (this.viewState === "idle" || previousChanged !== nextChanged)
    ) {
      void this.loadHistory();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.minuteTimer = setInterval(() => this.recompute(), 60_000);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.minuteTimer) clearInterval(this.minuteTimer);
  }

  setConfig(config: OccupancyHeatmapCardConfig): void {
    const normalized = normalizeConfig(config);
    const changed = JSON.stringify(normalized) !== JSON.stringify(this.config);
    this.config = normalized;
    if (changed) {
      this.data = undefined;
      this.history = [];
      this.selected = undefined;
      this.viewState = "idle";
      if (this._hass) void this.loadHistory();
    }
    this.requestUpdate();
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("occupancy-heatmap-card-editor");
  }

  static getStubConfig(
    hass?: HomeAssistant,
    entities?: string[],
    entitiesFallback?: string[]
  ): OccupancyHeatmapCardConfig {
    const entity =
      entities?.[0] ?? entitiesFallback?.[0] ?? Object.keys(hass?.states ?? {})[0] ?? "";
    return { entity, days: 7, mode: "auto" };
  }

  getCardSize(): number {
    return Math.max(3, Math.min(12, (this.config?.days ?? 7) + 2));
  }

  getGridOptions(): Record<string, number> {
    return { columns: 12, min_columns: 6, rows: this.getCardSize() };
  }

  private async loadHistory(): Promise<void> {
    if (!this.config || !this._hass) return;
    const entity = this._hass.states[this.config.entity];
    if (!entity) {
      this.viewState = "missing";
      this.data = undefined;
      this.requestUpdate();
      return;
    }

    const now = new Date();
    const daySlots = createHourlySlots(
      this.config.days,
      now,
      this._hass.config.time_zone,
      this.config.start_hour,
      this.config.end_hour
    );
    const selectedStart = daySlots[0]?.cells[0]?.start;
    if (!selectedStart) return;
    const start = new Date(selectedStart.getTime());

    this.viewState = this.data ? "ready" : "loading";
    this.errorMessage = "";
    this.requestUpdate();

    try {
      const result = await this.historyService.load(
        this._hass,
        this.config.entity,
        start,
        now
      );
      if (result.stale) return;
      this.history = result.states;
      if (result.states.length === 0) {
        this.data = undefined;
        this.viewState = "empty";
      } else {
        this.recompute(now);
        this.viewState = "ready";
      }
    } catch (error) {
      this.data = undefined;
      this.viewState = "error";
      this.errorMessage =
        error instanceof Error ? error.message : "Unable to load history";
    }
    this.requestUpdate();
  }

  private recompute(now = new Date()): void {
    if (!this.config || !this._hass || this.history.length === 0) return;
    this.data = aggregateHistory({
      history: this.history,
      config: this.config,
      timeZone: this._hass.config.time_zone,
      now,
    });
    this.requestUpdate();
  }

  private renderState(state: Exclude<ViewState, "idle" | "ready">) {
    const content = {
      loading: ["Loading history", "Reading recorder data for this entity."],
      missing: [
        "Entity not found",
        `Home Assistant does not contain ${this.config?.entity}.`,
      ],
      empty: [
        "No recorded history",
        "Recorder has no states in the selected date range.",
      ],
      error: [
        "History unavailable",
        this.errorMessage || "Home Assistant could not load history.",
      ],
    }[state];
    return html`<ha-card>
      <div
        class="state-panel"
        data-state=${state}
        role=${state === "error" ? "alert" : "status"}
      >
        <div>
          ${state === "loading" ? html`<div class="loading-mark"></div>` : nothing}
          <strong>${content[0]}</strong><span>${content[1]}</span>
        </div>
      </div>
    </ha-card>`;
  }

  private stateColor(state?: string): string {
    if (!this.config || !this.data) return "var(--primary-color, #03a9f4)";
    return this.data.mode === "numeric"
      ? this.config.numeric_color
      : getStateColor(state ?? "", this.config.state_colors);
  }

  private dayLabel(date: Date, isToday: boolean): string {
    const locale = this._hass?.locale.language || "en";
    if (isToday)
      return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(0, "day");
    return new Intl.DateTimeFormat(locale, {
      weekday: this.config && this.config.days <= 7 ? "short" : undefined,
      month: this.config && this.config.days > 7 ? "short" : undefined,
      day: this.config && this.config.days > 7 ? "numeric" : undefined,
      timeZone: this._hass?.config.time_zone,
    }).format(date);
  }

  private numericValueLabel(cell: HeatmapCell): string | undefined {
    if (
      this.data?.mode !== "numeric" ||
      this.config?.numeric_intensity !== "value" ||
      cell.numericValue === undefined
    ) {
      return undefined;
    }

    const locale = this._hass?.locale.language || "en";
    const value = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 2,
    }).format(cell.numericValue);
    const unit = this._hass?.states[this.config.entity]?.attributes.unit_of_measurement;
    return unit ? `${value} ${unit}` : value;
  }

  private cellTimeDetail(cell: HeatmapCell): string {
    const locale = this._hass?.locale.language || "en";
    const date = new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      timeZone: this._hass?.config.time_zone,
    }).format(cell.start);
    const minutes = Math.round(cell.occupiedSeconds / 60);
    return `${date}, ${String(cell.hour).padStart(2, "0")}:00, ${minutes} min`;
  }

  private cellDetail(cell: HeatmapCell): string {
    const prefix = this.numericValueLabel(cell) ?? cell.state;
    const timeDetail = this.cellTimeDetail(cell);
    return prefix ? `${prefix}, ${timeDetail}` : timeDetail;
  }

  private renderCell(cell: HeatmapCell) {
    const color = this.stateColor(cell.state);
    const filled = cell.occupiedSeconds > 0;
    const detail = this.cellDetail(cell);
    const selected = this.selected?.start.getTime() === cell.start.getTime();
    return html`<button
      class=${`cell${filled ? " filled" : ""}${selected ? " selected" : ""}`}
      style=${styleMap({
        "--cell-color": color,
        "--cell-strength": `${Math.round(14 + cell.intensity * 86)}%`,
      })}
      aria-label=${detail}
      title=${detail}
      ?disabled=${cell.future || cell.durationSeconds === 0}
      @click=${() => {
        this.selected = cell;
        this.requestUpdate();
      }}
      @focus=${() => {
        this.selected = cell;
        this.requestUpdate();
      }}
    ></button>`;
  }

  override render() {
    if (this.viewState !== "ready") {
      return this.renderState(this.viewState === "idle" ? "loading" : this.viewState);
    }
    if (!this.data || !this.config) return this.renderState("empty");

    const entity = this._hass?.states[this.config.entity];
    const title =
      this.config.title || entity?.attributes.friendly_name || this.config.entity;
    const hours = this.data.totalSeconds / 3600;
    const summaryKind = this.data.mode === "numeric" ? "occupied" : "recorded";
    const currentColor = this.stateColor(entity?.state);
    const displayedCells = this.data.days[0]?.cells ?? [];
    const columnCount = displayedCells.length;

    return html`<ha-card aria-busy="false">
      <div class="content">
        <div class="header">
          <div class="identity">
            <div class="title-row">
              <span
                class="status-dot"
                style=${styleMap({ "--state-color": currentColor })}
              ></span>
              <h2>${title}</h2>
            </div>
            <p class="summary">
              Past ${this.config.days} days &middot; ${hours.toFixed(1)} h ${summaryKind}
            </p>
          </div>
          ${
            this.data.mode === "categorical" && this.config.show_legend
              ? html`<div class="legend" aria-label="State colors">
                  ${this.data.legendStates.map(
                    (state) =>
                      html`<span class="legend-item">
                        <span
                          class="swatch"
                          style=${styleMap({
                            "--state-color": getStateColor(
                              state,
                              this.config!.state_colors
                            ),
                          })}
                        ></span>
                        ${state}
                      </span>`
                  )}
                </div>`
              : nothing
          }
        </div>

        <div class="scroll" aria-label="Hourly occupancy heatmap">
          <div
            class="matrix"
            role="grid"
            style=${styleMap({ "--heatmap-column-count": String(columnCount) })}
          >
            <div class="matrix-row hour-row" role="row">
              <span class="corner"></span>
              ${displayedCells.map((cell, index) =>
                index % 3 === 0
                  ? html`<span class="hour-label" role="columnheader">${cell.hour}</span>`
                  : html`<span class="hour-label" aria-hidden="true"></span>`
              )}
            </div>
            ${this.data.days.map(
              (day) =>
                html`<div class="matrix-row" role="row">
                  <span
                    class=${`row-label${day.isToday ? " today" : ""}`}
                    role="rowheader"
                  >
                    ${this.dayLabel(day.date, day.isToday)}
                  </span>
                  ${day.cells.map((cell) => this.renderCell(cell))}
                </div>`
            )}
          </div>
        </div>

        <div class="details" aria-live="polite">
          ${
            this.selected
              ? html`<strong
                    >${
                      this.numericValueLabel(this.selected) ||
                      this.selected.state ||
                      summaryKind
                    }</strong
                  >
                  <span>${this.cellTimeDetail(this.selected)}</span>`
              : html`<span>Select an hour for details</span>`
          }
        </div>
      </div>
    </ha-card>`;
  }
}
