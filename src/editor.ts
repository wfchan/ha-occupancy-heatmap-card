import { css, html, LitElement, nothing } from "lit";

import type { HeatmapMode, HomeAssistant, OccupancyHeatmapCardConfig } from "./types";

export class OccupancyHeatmapCardEditor extends LitElement {
  static override styles = css`
    :host {
      display: block;
      color: var(--primary-text-color, #17212b);
    }

    .editor {
      display: grid;
      gap: 18px;
    }

    .section {
      display: grid;
      gap: 12px;
      padding-top: 4px;
    }

    .section + .section {
      border-top: 1px solid var(--divider-color, #d9dde3);
      padding-top: 18px;
    }

    h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 650;
      letter-spacing: 0;
    }

    label {
      display: grid;
      gap: 6px;
      color: var(--secondary-text-color, #68717e);
      font-size: 12px;
      font-weight: 600;
    }

    input,
    select,
    button {
      box-sizing: border-box;
      min-height: 40px;
      border: 1px solid var(--divider-color, #b9c0c9);
      border-radius: 6px;
      color: var(--primary-text-color, #17212b);
      background: var(--card-background-color, #fff);
      font: inherit;
    }

    input,
    select {
      width: 100%;
      padding: 8px 10px;
    }

    input:focus-visible,
    select:focus-visible,
    button:focus-visible {
      border-color: var(--primary-color, #03a9f4);
      outline: 2px solid
        color-mix(in srgb, var(--primary-color, #03a9f4) 28%, transparent);
      outline-offset: 1px;
    }

    .two-column {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 12px;
    }

    .color-control {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 48px;
      gap: 8px;
    }

    input[type="color"] {
      padding: 4px;
    }

    .toggle {
      display: flex;
      min-height: 40px;
      align-items: center;
      gap: 10px;
      color: var(--primary-text-color, #17212b);
      font-size: 13px;
    }

    .toggle input {
      width: 18px;
      min-height: 18px;
      accent-color: var(--primary-color, #03a9f4);
    }

    .state-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 48px 40px;
      gap: 8px;
      align-items: end;
    }

    .icon-button {
      width: 40px;
      padding: 0;
      cursor: pointer;
      color: var(--error-color, #d64545);
      font-size: 20px;
    }

    .add-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px;
    }

    .add-row button {
      padding: 0 14px;
      cursor: pointer;
      border-color: var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
    }

    .helper {
      margin: -4px 0 0;
      color: var(--secondary-text-color, #68717e);
      font-size: 11px;
      font-weight: 400;
      line-height: 1.4;
    }

    @media (max-width: 480px) {
      .two-column {
        grid-template-columns: 1fr;
      }
    }
  `;

  hass?: HomeAssistant;
  private config: OccupancyHeatmapCardConfig = {};
  private draftState = "";

  setConfig(config: OccupancyHeatmapCardConfig): void {
    this.config = { ...config };
    this.requestUpdate();
  }

  private emit(patch: Partial<OccupancyHeatmapCardConfig>): void {
    this.config = { ...this.config, ...patch };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.config },
        bubbles: true,
        composed: true,
      })
    );
    this.requestUpdate();
  }

  private value(event: Event): string {
    return (event.currentTarget as HTMLInputElement | HTMLSelectElement).value;
  }

  private renameState(oldState: string, newState: string): void {
    const trimmed = newState.trim();
    if (!trimmed || trimmed === oldState) return;
    const colors = { ...(this.config.state_colors ?? {}) };
    colors[trimmed] = colors[oldState] ?? "#03a9f4";
    delete colors[oldState];
    this.emit({ state_colors: colors });
  }

  private setStateColor(state: string, color: string): void {
    this.emit({
      state_colors: { ...(this.config.state_colors ?? {}), [state]: color },
    });
  }

  private removeState(state: string): void {
    const colors = { ...(this.config.state_colors ?? {}) };
    delete colors[state];
    this.emit({ state_colors: colors });
  }

  private addState(): void {
    const state = this.draftState.trim();
    if (!state) return;
    this.setStateColor(state, "#03a9f4");
    this.draftState = "";
  }

  override render() {
    const mode: HeatmapMode = this.config.mode ?? "auto";
    const entities = Object.values(this.hass?.states ?? {}).sort((left, right) =>
      left.entity_id.localeCompare(right.entity_id)
    );
    const stateColors = Object.entries(this.config.state_colors ?? {});

    return html`<div class="editor">
      <section class="section">
        <h3>Source</h3>
        <label>
          Entity
          <select
            name="entity"
            .value=${this.config.entity ?? ""}
            @change=${(event: Event) => this.emit({ entity: this.value(event) })}
          >
            <option value="" disabled>Select an entity</option>
            ${entities.map(
              (entity) =>
                html`<option value=${entity.entity_id}>
                  ${entity.attributes.friendly_name || entity.entity_id}
                </option>`
            )}
          </select>
        </label>
        <label>
          Title
          <input
            name="title"
            type="text"
            .value=${this.config.title ?? ""}
            placeholder="Use entity name"
            @change=${(event: Event) => this.emit({ title: this.value(event) || undefined })}
          />
        </label>
        <div class="two-column">
          <label>
            Days
            <input
              name="days"
              type="number"
              min="1"
              max="31"
              step="1"
              .value=${String(this.config.days ?? 7)}
              @change=${(event: Event) => this.emit({ days: Number(this.value(event)) })}
            />
          </label>
          <label>
            Data mode
            <select
              name="mode"
              .value=${mode}
              @change=${(event: Event) => this.emit({ mode: this.value(event) as HeatmapMode })}
            >
              <option value="auto">Automatic</option>
              <option value="numeric">Numeric</option>
              <option value="categorical">Categorical</option>
            </select>
          </label>
        </div>
      </section>

      ${
        mode !== "categorical"
          ? html`<section class="section">
              <h3>Numeric occupancy</h3>
              <div class="two-column">
                <label>
                  Above threshold
                  <input
                    name="numeric_threshold"
                    type="number"
                    step="any"
                    .value=${String(this.config.numeric_threshold ?? 0)}
                    @change=${(event: Event) =>
                      this.emit({ numeric_threshold: Number(this.value(event)) })}
                  />
                </label>
                <label>
                  Color
                  <input
                    name="numeric_color"
                    type="color"
                    .value=${this.config.numeric_color ?? "#03a9f4"}
                    @change=${(event: Event) => this.emit({ numeric_color: this.value(event) })}
                  />
                </label>
              </div>
            </section>`
          : nothing
      }
      ${
        mode !== "numeric"
          ? html`<section class="section">
              <h3>Categorical colors</h3>
              <p class="helper">
                States receive stable automatic colors until you add an override.
              </p>
              ${stateColors.map(
                ([state, color]) =>
                  html`<div class="state-row" data-state-color=${state}>
                    <label>
                      State
                      <input
                        type="text"
                        .value=${state}
                        @change=${(event: Event) => this.renameState(state, this.value(event))}
                      />
                    </label>
                    <input
                      aria-label=${`Color for ${state}`}
                      type="color"
                      .value=${color}
                      @change=${(event: Event) => this.setStateColor(state, this.value(event))}
                    />
                    <button
                      class="icon-button"
                      type="button"
                      title=${`Remove ${state}`}
                      aria-label=${`Remove ${state}`}
                      @click=${() => this.removeState(state)}
                    >
                      &times;
                    </button>
                  </div>`
              )}
              <div class="add-row">
                <input
                  type="text"
                  placeholder="State name"
                  .value=${this.draftState}
                  @input=${(event: Event) => {
                    this.draftState = this.value(event);
                  }}
                />
                <button
                  data-action="add-state"
                  type="button"
                  @click=${() => this.addState()}
                >
                  Add state
                </button>
              </div>
              <label class="toggle">
                <input
                  name="show_legend"
                  type="checkbox"
                  .checked=${this.config.show_legend ?? true}
                  @change=${(event: Event) =>
                    this.emit({
                      show_legend: (event.currentTarget as HTMLInputElement).checked,
                    })}
                />
                Show state legend
              </label>
            </section>`
          : nothing
      }

      <section class="section">
        <h3>Data quality</h3>
        <label>
          Excluded states
          <input
            name="excluded_states"
            type="text"
            .value=${(this.config.excluded_states ?? ["unknown", "unavailable"]).join(", ")}
            @change=${(event: Event) =>
              this.emit({
                excluded_states: this.value(event)
                  .split(",")
                  .map((state) => state.trim())
                  .filter(Boolean),
              })}
          />
          <span class="helper"
            >Comma-separated recorder states that should not count.</span
          >
        </label>
      </section>
    </div>`;
  }
}
