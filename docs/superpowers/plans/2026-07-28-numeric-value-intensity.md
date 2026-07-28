# Numeric Sensor Value Intensity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a backward-compatible numeric heatmap option that scales hourly cell color by a globally normalized, time-weighted sensor value and document every calculation in the README.

**Architecture:** Extend the normalized configuration with a `duration | value` intensity strategy. Numeric aggregation first computes duration and weighted values per hourly cell, then performs a second pass to normalize occupied cells against the global range of hourly weighted values; the editor and card remain consumers of this typed result.

**Tech Stack:** TypeScript 5.9, Lit 3, date-fns timezone slots, Vitest, happy-dom, Playwright, Rollup, HACS, GitHub Actions.

---

## File Structure

- `src/types.ts`: public and normalized configuration contract plus Home Assistant entity attributes.
- `src/config.ts`: defaulting and validation for `numeric_intensity`.
- `src/aggregation.ts`: per-cell weighted numeric values and selected-range normalization.
- `src/editor.ts`: numeric intensity selector in the visual editor.
- `src/card.ts`: localized value/unit text in accessible hourly details.
- `tests/config.test.ts`: configuration default, accepted values, and rejection behavior.
- `tests/aggregation.test.ts`: weighted arithmetic, threshold/exclusion rules, range normalization, and regression coverage.
- `tests/editor.test.ts`: conditional selector rendering and config event behavior.
- `tests/card.test.ts`: rendered detail text and backward compatibility.
- `demo/main.ts`: mock numeric history and a value-intensity preview.
- `tests/e2e/heatmap.spec.ts`: browser assertions for details and layout.
- `README.md`: complete public formulas, rules, examples, and option reference.
- `CHANGELOG.md`: release-facing feature summary.
- `package.json`, `package-lock.json`: `v0.2.0` version.
- `dist/ha-occupancy-heatmap-card.js`, `dist/ha-occupancy-heatmap-card.js.map`: committed HACS asset.

### Task 1: Configuration contract

**Files:**

- Modify: `tests/config.test.ts`
- Modify: `tests/aggregation.test.ts`
- Modify: `src/types.ts`
- Modify: `src/config.ts`

- [ ] **Step 1: Write failing configuration tests**

In `tests/config.test.ts`, add the default to the existing full-object assertion and add accepted/rejected value tests:

```ts
expect(normalizeConfig({ entity: "sensor.room" })).toEqual({
  type: "custom:occupancy-heatmap-card",
  entity: "sensor.room",
  title: undefined,
  days: 7,
  mode: "auto",
  numeric_threshold: 0,
  numeric_color: "#03a9f4",
  numeric_intensity: "duration",
  state_colors: {},
  excluded_states: ["unknown", "unavailable"],
  show_legend: true,
});

it("accepts sensor value intensity", () => {
  expect(
    normalizeConfig({ entity: "sensor.room", numeric_intensity: "value" })
      .numeric_intensity
  ).toBe("value");
});

it("rejects an unsupported numeric intensity", () => {
  expect(() =>
    normalizeConfig({
      entity: "sensor.room",
      numeric_intensity: "maximum" as "duration",
    })
  ).toThrow("Numeric intensity must be duration or value");
});
```

Add `numeric_intensity: "duration"` to `baseConfig` in `tests/aggregation.test.ts` so its explicit normalized fixture stays type-correct.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
npx vitest run tests/config.test.ts tests/aggregation.test.ts
```

Expected: FAIL because `numeric_intensity` is not part of the config types or normalized output.

- [ ] **Step 3: Implement the typed option and validation**

In `src/types.ts`, add the type beside `HeatmapMode`, add the optional property after `numeric_color` in `OccupancyHeatmapCardConfig`, and add the required property after `numeric_color` in `NormalizedOccupancyHeatmapCardConfig`:

```ts
export type NumericIntensity = "duration" | "value";

numeric_intensity?: NumericIntensity;

numeric_intensity: NumericIntensity;
```

In `src/config.ts`, import `NumericIntensity`, validate with a set, and return the default:

```ts
const NUMERIC_INTENSITIES = new Set<NumericIntensity>(["duration", "value"]);

const numericIntensity = config.numeric_intensity ?? "duration";
if (!NUMERIC_INTENSITIES.has(numericIntensity)) {
  throw new Error("Numeric intensity must be duration or value");
}

return {
  // existing normalized fields
  numeric_intensity: numericIntensity,
};
```

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```bash
npx vitest run tests/config.test.ts tests/aggregation.test.ts
```

Expected: PASS with the duration default and value validation covered.

- [ ] **Step 5: Commit the configuration contract**

```bash
git add src/types.ts src/config.ts tests/config.test.ts tests/aggregation.test.ts
git commit -m "feat: add numeric intensity configuration"
```

### Task 2: Weighted value aggregation and global range

**Files:**

- Modify: `tests/aggregation.test.ts`
- Modify: `src/aggregation.ts`

- [ ] **Step 1: Write failing weighted-value tests**

Add focused tests using `{ ...baseConfig, numeric_intensity: "value" as const }`:

```ts
it("calculates a time-weighted occupied value", () => {
  const data = aggregateHistory({
    history: [history("1", "2026-07-27T16:00:00Z"), history("3", "2026-07-27T16:45:00Z")],
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
    history: [history("0", "2026-07-27T16:00:00Z"), history("2", "2026-07-27T16:30:00Z")],
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
```

Add a global range case containing three occupied hours with weighted values `1`, `2`, and `3`; assert cell intensities `0`, `0.5`, and `1` and `numericRange: { min: 1, max: 3 }`. Include an excluded/non-numeric transition inside an hour and assert it contributes neither duration nor weighted numerator. Assert future cells have no `numericValue` and do not change the range.

- [ ] **Step 2: Run the aggregation test and verify RED**

Run:

```bash
npx vitest run tests/aggregation.test.ts
```

Expected: FAIL because cells do not expose `numericValue`, heatmap data has no `numericRange`, and intensity still uses occupied duration.

- [ ] **Step 3: Compute occupied weighted values in the first pass**

In `src/aggregation.ts`, add `numericValue` after `state` in `HeatmapCell` and `numericRange` after `legendStates` in `HeatmapData`:

```ts
numericValue?: number;

numericRange?: { min: number; max: number };
```

Within the numeric branch, accumulate both occupied duration and the duration-weighted numerator:

```ts
let occupiedSeconds = 0;
let weightedTotal = 0;

// for each valid interval above threshold
const seconds = overlapSeconds(interval, slotStart, effectiveEnd);
if (seconds <= 0) continue;
const value = Number(interval.state);
occupiedSeconds += seconds;
weightedTotal += value * seconds;

const numericValue = occupiedSeconds > 0 ? weightedTotal / occupiedSeconds : undefined;

return {
  ...slot,
  occupiedSeconds,
  numericValue,
  intensity: Math.min(1, occupiedSeconds / slot.durationSeconds),
  future,
};
```

Keep duration intensity in the first pass so `numeric_intensity: duration` is unchanged.

- [ ] **Step 4: Normalize value intensity in a second pass**

After constructing `days`, collect occupied numeric values only when the resolved mode is numeric and the configured strategy is `value`:

```ts
const numericValues =
  mode === "numeric" && config.numeric_intensity === "value"
    ? days.flatMap((day) =>
        day.cells.flatMap((cell) =>
          !cell.future && cell.occupiedSeconds > 0 && cell.numericValue !== undefined
            ? [cell.numericValue]
            : []
        )
      )
    : [];
const numericRange = numericValues.length
  ? { min: Math.min(...numericValues), max: Math.max(...numericValues) }
  : undefined;

if (mode === "numeric" && config.numeric_intensity === "value" && numericRange) {
  const span = numericRange.max - numericRange.min;
  for (const day of days) {
    for (const cell of day.cells) {
      if (cell.numericValue === undefined || cell.occupiedSeconds === 0) continue;
      cell.intensity = span === 0 ? 1 : (cell.numericValue - numericRange.min) / span;
    }
  }
}

return { mode, days, totalSeconds, legendStates, numericRange };
```

Return `numericRange` only for numeric value mode so the public result does not imply a scale in duration or categorical mode.

- [ ] **Step 5: Run aggregation and full unit tests and verify GREEN**

Run:

```bash
npx vitest run tests/aggregation.test.ts
npm test
```

Expected: all weighted-value, constant-range, exclusion, future, existing duration, categorical, boundary, and DST tests pass.

- [ ] **Step 6: Commit aggregation**

```bash
git add src/aggregation.ts tests/aggregation.test.ts
git commit -m "feat: scale numeric cells by weighted value"
```

### Task 3: Visual editor selector

**Files:**

- Modify: `tests/editor.test.ts`
- Modify: `src/editor.ts`

- [ ] **Step 1: Write failing editor tests**

Extend the required-controls test and add conditional/event tests:

```ts
expect(editor.shadowRoot?.querySelector("select[name='numeric_intensity']")).toBeTruthy();

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

  expect(listener.mock.calls[0]?.[0].detail.config.numeric_intensity).toBe("value");
});

it("hides numeric intensity in categorical mode", async () => {
  const editor = document.createElement(
    "occupancy-heatmap-card-editor"
  ) as OccupancyHeatmapCardEditor;
  editor.setConfig({ entity: "sensor.room", mode: "categorical" });
  document.body.append(editor);
  await editor.updateComplete;

  expect(editor.shadowRoot?.querySelector("select[name='numeric_intensity']")).toBeNull();
});
```

- [ ] **Step 2: Run the editor test and verify RED**

Run:

```bash
npx vitest run tests/editor.test.ts
```

Expected: FAIL because the new select does not exist.

- [ ] **Step 3: Render and bind the numeric intensity control**

Import `NumericIntensity` in `src/editor.ts`. In the `Numeric occupancy` section, place the selector before threshold and color:

```ts
<label>
  Color intensity
  <select
    name="numeric_intensity"
    .value=${this.config.numeric_intensity ?? "duration"}
    @change=${(event: Event) =>
      this.emit({ numeric_intensity: this.value(event) as NumericIntensity })}
  >
    <option value="duration">Occupied time</option>
    <option value="value">Sensor value</option>
  </select>
</label>
```

Keep the surrounding `mode !== "categorical"` condition, so automatic and numeric modes show the control while categorical mode does not.

- [ ] **Step 4: Run editor and full unit tests and verify GREEN**

Run:

```bash
npx vitest run tests/editor.test.ts
npm test
```

Expected: the selector renders, emits `value`, remains visible in automatic mode, and is absent in categorical mode.

- [ ] **Step 5: Commit the editor**

```bash
git add src/editor.ts tests/editor.test.ts
git commit -m "feat: configure numeric color intensity"
```

### Task 4: Value and unit details

**Files:**

- Modify: `tests/card.test.ts`
- Modify: `src/card.ts`
- Modify: `src/types.ts`

- [ ] **Step 1: Write a failing card detail test**

Allow the card-test `hass` helper to accept an optional unit and add it to entity attributes. Add a value-mode test with a full hour split between `1` and `3`, then focus the first occupied cell:

```ts
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
  expect(card.shadowRoot?.querySelector(".details")?.textContent).toContain("1.5 people");
  expect(card.shadowRoot?.querySelector(".details")?.textContent).toContain("60 min");
});
```

Keep the existing duration-mode test without `numeric_intensity` to prove backward compatibility.

- [ ] **Step 2: Run the card test and verify RED**

Run:

```bash
npx vitest run tests/card.test.ts
```

Expected: FAIL because details do not include weighted values or units.

- [ ] **Step 3: Add unit typing and localized value formatting**

In `src/types.ts`, explicitly add this property to `HassEntity.attributes` after `friendly_name`:

```ts
unit_of_measurement?: string;
```

In `src/card.ts`, add a formatter that does not alter aggregation precision:

```ts
private numericValueLabel(cell: HeatmapCell): string | undefined {
  if (
    this.data?.mode !== "numeric" ||
    this.config?.numeric_intensity !== "value" ||
    cell.numericValue === undefined
  ) {
    return undefined;
  }
  const locale = this._hass?.locale.language || "en";
  const value = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(
    cell.numericValue
  );
  const unit = this._hass?.states[this.config.entity]?.attributes.unit_of_measurement;
  return unit ? `${value} ${unit}` : value;
}
```

Split the existing detail formatting so accessible labels contain all information while the selected row does not repeat the value:

```ts
private cellTimeDetail(cell: HeatmapCell): string {
  const locale = this._hass?.locale.language || "en";
  const date = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    timeZone: this._hass?.config.time_zone,
  }).format(cell.start);
  return `${date}, ${String(cell.hour).padStart(2, "0")}:00, ${Math.round(
    cell.occupiedSeconds / 60
  )} min`;
}

private cellDetail(cell: HeatmapCell): string {
  const state = cell.state;
  const numericValue = this.numericValueLabel(cell);
  const prefix = numericValue ?? state;
  return prefix ? `${prefix}, ${this.cellTimeDetail(cell)}` : this.cellTimeDetail(cell);
}
```

In the selected details row, use `this.numericValueLabel(this.selected)`, then `this.selected.state`, then `summaryKind` as the `<strong>` fallback. Render `this.cellTimeDetail(this.selected)` in the adjacent `<span>`. The cell title and aria label continue using `cellDetail`, so both include the weighted value and occupied duration.

- [ ] **Step 4: Run card and full unit tests and verify GREEN**

Run:

```bash
npx vitest run tests/card.test.ts
npm test
```

Expected: value mode exposes localized weighted values in title, aria label, and details while duration mode remains unchanged.

- [ ] **Step 5: Commit details rendering**

```bash
git add src/card.ts src/types.ts tests/card.test.ts
git commit -m "feat: show weighted values in cell details"
```

### Task 5: README formulas, demo, and browser verification

**Files:**

- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `demo/main.ts`
- Modify: `tests/e2e/heatmap.spec.ts`
- Modify: `docs/images/preview-dark.png`

- [ ] **Step 1: Write the failing browser assertion**

Configure the mock numeric card with `numeric_intensity: "value"`. In the existing theme test, click a filled numeric cell and assert the details include a numeric value and occupied minutes:

```ts
const numericCard = page.locator("occupancy-heatmap-card#numeric-card");
const numericCell = numericCard.locator("button.cell.filled:not(:disabled)").first();
await numericCell.click();
await expect(numericCard.locator(".details")).toContainText(/\d+(\.\d+)? people/);
await expect(numericCard.locator(".details")).toContainText(/\d+ min/);
```

- [ ] **Step 2: Run the focused browser test and verify RED**

Run:

```bash
npx playwright test tests/e2e/heatmap.spec.ts --project=desktop --grep="dark dashboard"
```

Expected: FAIL because the demo is still configured for duration intensity and has no `people` unit.

- [ ] **Step 3: Update the mock preview data**

In `demo/main.ts`, give `sensor.living_room_activity` a `unit_of_measurement: "people"` attribute and configure the numeric card with:

```ts
numeric_intensity: "value",
```

Keep varied numeric states in the mock history so the screenshot visibly demonstrates global value scaling.

- [ ] **Step 4: Document the complete calculation in README and changelog**

Replace the numeric section with separate duration and sensor-value examples. Add a `Numeric intensity calculations` subsection containing these formulas verbatim:

```text
occupied_seconds = sum(duration where value > numeric_threshold)

duration_intensity = occupied_seconds / actual_slot_duration

weighted_value =
  sum(value * occupied_interval_duration) / occupied_seconds

value_intensity =
  1                                             if range_min = range_max
  (weighted_value - range_min)
    / (range_max - range_min)                   otherwise
```

Explain that `range_min` and `range_max` are the minimum and maximum occupied hourly weighted values across all selected days; empty, excluded, non-numeric, at/below-threshold, and future periods are omitted. State that the current hour is clipped at now, DST uses actual slot duration, and arithmetic is full precision with rounding only for display.

Include both worked examples:

```text
(1 * 45 minutes + 3 * 15 minutes) / 60 minutes = 1.5
```

and: `0` for 30 minutes followed by `2` for 30 minutes at threshold `0` yields a weighted occupied value of `2` and 30 occupied minutes.

Add this row to the options table:

```md
| `numeric_intensity` | string | `duration` | `duration` or `value` color scaling. |
```

Add an unreleased `0.2.0` changelog section describing selectable duration/value intensity, global time-weighted scaling, detail values, and calculation documentation.

- [ ] **Step 5: Run browser coverage and update the tracked preview**

Run:

```bash
npm run format
npm run test:e2e
```

Expected: both themes pass on desktop and mobile, body overflow remains absent, mobile matrix scrolling remains present, value details render, and `docs/images/preview-dark.png` is refreshed by the dark desktop test.

- [ ] **Step 6: Commit docs and browser harness**

```bash
git add README.md CHANGELOG.md demo/main.ts tests/e2e/heatmap.spec.ts docs/images/preview-dark.png
git commit -m "docs: explain numeric intensity calculations"
```

### Task 6: Build, verify, publish `v0.2.0`, and close the plan

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `dist/ha-occupancy-heatmap-card.js`
- Modify: `dist/ha-occupancy-heatmap-card.js.map`
- Modify: `docs/superpowers/plans/2026-07-28-numeric-value-intensity.md`

- [ ] **Step 1: Bump the package version**

Run:

```bash
npm version 0.2.0 --no-git-tag-version
```

Expected: `package.json` and `package-lock.json` report `0.2.0` without creating a tag or commit.

- [ ] **Step 2: Run full local verification and rebuild the HACS asset**

Run:

```bash
npm run format
npm run check
npm run test:e2e
npm audit
npm audit --omit=dev
git diff --check
```

Expected: formatting, ESLint, strict TypeScript, all Vitest tests, production Rollup build, all Playwright projects, both audits, and whitespace validation pass. The build refreshes both committed files in `dist/`.

- [ ] **Step 3: Commit release preparation**

Mark Tasks 1-5 and local release Steps 1-2 complete in this plan, then run:

```bash
git add package.json package-lock.json dist/ha-occupancy-heatmap-card.js dist/ha-occupancy-heatmap-card.js.map docs/superpowers/plans/2026-07-28-numeric-value-intensity.md
git commit -m "chore: prepare v0.2.0"
```

- [ ] **Step 4: Push and verify CI**

Run:

```bash
git push origin main
CI_RUN_ID="$(gh run list --repo wfchan/ha-occupancy-heatmap-card --workflow CI --branch main --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$CI_RUN_ID" --repo wfchan/ha-occupancy-heatmap-card --exit-status
```

Expected: CI `verify` and `hacs` jobs pass for the pushed `v0.2.0` preparation commit.

- [ ] **Step 5: Publish and verify the GitHub release**

Run:

```bash
gh release create v0.2.0 --repo wfchan/ha-occupancy-heatmap-card --target main --title "v0.2.0" --notes "Add selectable duration-based or time-weighted sensor-value color intensity for numeric heatmaps, with global selected-range scaling and documented calculations."
RELEASE_RUN_ID="$(gh run list --repo wfchan/ha-occupancy-heatmap-card --workflow Release --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$RELEASE_RUN_ID" --repo wfchan/ha-occupancy-heatmap-card --exit-status
gh release view v0.2.0 --repo wfchan/ha-occupancy-heatmap-card --json url,assets
```

Expected: the release workflow passes and `ha-occupancy-heatmap-card.js` is attached to the public `v0.2.0` release so HACS can discover the update.

- [ ] **Step 6: Record plan completion**

Mark every remaining checkbox in this file `[x]`, then run:

```bash
git add docs/superpowers/plans/2026-07-28-numeric-value-intensity.md
git commit -m "docs: mark numeric intensity plan complete"
git push origin main
git status --short --branch
```

Expected: `main` is synchronized with `origin/main` and the worktree is clean.
