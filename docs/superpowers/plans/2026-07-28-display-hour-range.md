# Display Hour Range Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an inclusive same-day whole-hour display range that scopes heatmap cells and calculations, defaults to `0-23`, and publish it with the Telegram community link as `v0.3.0`.

**Architecture:** Normalize `start_hour` and `end_hour` into every card configuration, then generate only the selected hourly slots so aggregation, summaries, history boundaries, and rendering share one source of truth. The card derives its CSS grid and headers from those slots, while the visual editor prevents invalid same-day combinations.

**Tech Stack:** TypeScript 5.9, Lit 3, date-fns timezone slots, Vitest, happy-dom, Playwright, Rollup, HACS, GitHub Actions.

---

## File Structure

- `src/types.ts`: public and normalized `start_hour`/`end_hour` fields.
- `src/config.ts`: defaults and whole-hour same-day validation.
- `src/time-slots.ts`: inclusive selected-hour slot generation.
- `src/aggregation.ts`: passes the normalized range into slot generation.
- `src/card.ts`: selected history boundary, dynamic grid columns, and dynamic hour headers.
- `src/editor.ts`: constrained start/end hour dropdowns.
- `tests/config.test.ts`: default, boundary, integer, and ordering validation.
- `tests/aggregation.test.ts`: slot counts, DST, and hidden-hour calculation scope.
- `tests/card.test.ts`: dynamic cells/headers and recorder request boundary.
- `tests/editor.test.ts`: dropdown values, disabled options, and emitted config.
- `demo/main.ts`: narrowed-range preview configuration.
- `tests/e2e/heatmap.spec.ts`: responsive narrowed-range browser assertions.
- `README.md`: hour-range options, behavior, example, and Telegram group.
- `CHANGELOG.md`: `v0.3.0` release notes.
- `package.json`, `package-lock.json`: `v0.3.0` metadata.
- `dist/ha-occupancy-heatmap-card.js`, `dist/ha-occupancy-heatmap-card.js.map`: committed HACS asset.

### Task 1: Hour range configuration contract

**Files:**

- Modify: `tests/config.test.ts`
- Modify: `tests/aggregation.test.ts`
- Modify: `src/types.ts`
- Modify: `src/config.ts`

- [x] **Step 1: Write failing configuration tests**

Add `start_hour: 0` and `end_hour: 23` to the existing public-default object in `tests/config.test.ts`. Add these cases:

```ts
it("accepts an inclusive one-hour display range", () => {
  expect(
    normalizeConfig({ entity: "sensor.room", start_hour: 9, end_hour: 9 })
  ).toMatchObject({ start_hour: 9, end_hour: 9 });
});

it.each([
  ["start_hour", -1],
  ["start_hour", 24],
  ["start_hour", 9.5],
  ["end_hour", -1],
  ["end_hour", 24],
  ["end_hour", 22.5],
] as const)("rejects invalid %s value %s", (field, value) => {
  expect(() => normalizeConfig({ entity: "sensor.room", [field]: value })).toThrow(
    `${field === "start_hour" ? "Start" : "End"} hour must be a whole number between 0 and 23`
  );
});

it("rejects an overnight display range", () => {
  expect(() =>
    normalizeConfig({ entity: "sensor.room", start_hour: 22, end_hour: 6 })
  ).toThrow("Start hour must be less than or equal to end hour");
});
```

Add `start_hour: 0` and `end_hour: 23` to the explicit normalized `baseConfig` fixture in `tests/aggregation.test.ts`.

- [x] **Step 2: Run focused tests and verify RED**

Run:

```bash
npx vitest run tests/config.test.ts tests/aggregation.test.ts
```

Expected: FAIL because the types and normalized defaults do not contain the new properties and invalid ranges are accepted.

- [x] **Step 3: Add typed fields and validation**

In `src/types.ts`, add these properties after `days` in the public interface:

```ts
start_hour?: number;
end_hour?: number;
```

Add required normalized fields after `days`:

```ts
start_hour: number;
end_hour: number;
```

In `src/config.ts`, add a focused helper above `normalizeConfig`:

```ts
function normalizeHour(
  value: number | undefined,
  fallback: number,
  label: string
): number {
  const hour = value ?? fallback;
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new Error(`${label} hour must be a whole number between 0 and 23`);
  }
  return hour;
}
```

Normalize and order-check the values after `days` validation:

```ts
const startHour = normalizeHour(config.start_hour, 0, "Start");
const endHour = normalizeHour(config.end_hour, 23, "End");
if (startHour > endHour) {
  throw new Error("Start hour must be less than or equal to end hour");
}
```

Return them after `days`:

```ts
start_hour: startHour,
end_hour: endHour,
```

- [x] **Step 4: Run focused and full tests and verify GREEN**

Run:

```bash
npx vitest run tests/config.test.ts tests/aggregation.test.ts
npm test
npm run typecheck
```

Expected: all config cases, existing aggregation tests, the full suite, and strict typing pass.

- [x] **Step 5: Commit the configuration contract**

```bash
git add src/types.ts src/config.ts tests/config.test.ts tests/aggregation.test.ts
git commit -m "feat: add display hour configuration"
```

### Task 2: Selected slot generation and calculation scope

**Files:**

- Modify: `tests/aggregation.test.ts`
- Modify: `src/time-slots.ts`
- Modify: `src/aggregation.ts`

- [x] **Step 1: Write failing selected-slot tests**

Extend `createHourlySlots` coverage in `tests/aggregation.test.ts`:

```ts
it.each([
  [0, 23, 24],
  [9, 23, 15],
  [9, 9, 1],
] as const)("creates %s-%s as %s inclusive slots", (startHour, endHour, count) => {
  const result = createHourlySlots(
    1,
    new Date("2026-07-28T12:30:00+08:00"),
    "Asia/Hong_Kong",
    startHour,
    endHour
  );

  expect(result[0]?.cells).toHaveLength(count);
  expect(result[0]?.cells[0]?.hour).toBe(startHour);
  expect(result[0]?.cells.at(-1)?.hour).toBe(endHour);
});

it("keeps actual DST duration for a selected fall-back hour", () => {
  const result = createHourlySlots(
    1,
    new Date("2026-11-01T18:00:00-05:00"),
    "America/New_York",
    1,
    1
  );

  expect(result[0]?.cells).toHaveLength(1);
  expect(result[0]?.cells[0]).toMatchObject({ hour: 1, durationSeconds: 7200 });
});
```

- [x] **Step 2: Write failing aggregation-scope tests**

Add numeric duration, value range, and categorical cases:

```ts
it("excludes hidden hours from numeric duration totals", () => {
  const data = aggregateHistory({
    history: [
      history("1", "2026-07-28T00:00:00Z"),
      history("0", "2026-07-28T01:30:00Z"),
      history("1", "2026-07-28T02:00:00Z"),
    ],
    config: { ...baseConfig, start_hour: 9, end_hour: 9 },
    timeZone: "Asia/Hong_Kong",
    now: new Date("2026-07-28T12:00:00+08:00"),
  });

  expect(data.days[0]?.cells).toHaveLength(1);
  expect(data.days[0]?.cells[0]).toMatchObject({ hour: 9, occupiedSeconds: 1800 });
  expect(data.totalSeconds).toBe(1800);
});

it("excludes hidden values from numeric normalization", () => {
  const data = aggregateHistory({
    history: [
      history("2", "2026-07-28T00:00:00Z"),
      history("10", "2026-07-28T02:00:00Z"),
    ],
    config: {
      ...baseConfig,
      start_hour: 9,
      end_hour: 9,
      numeric_intensity: "value",
    },
    timeZone: "Asia/Hong_Kong",
    now: new Date("2026-07-28T12:00:00+08:00"),
  });

  expect(data.numericRange).toEqual({ min: 2, max: 2 });
  expect(data.days[0]?.cells[0]).toMatchObject({ numericValue: 2, intensity: 1 });
});

it("excludes hidden categorical states from winners and totals", () => {
  const data = aggregateHistory({
    history: [
      history("Kitchen", "2026-07-28T00:00:00Z"),
      history("Living Room", "2026-07-28T01:45:00Z"),
      history("Away", "2026-07-28T02:00:00Z"),
    ],
    config: {
      ...baseConfig,
      mode: "categorical",
      start_hour: 9,
      end_hour: 9,
    },
    timeZone: "Asia/Hong_Kong",
    now: new Date("2026-07-28T12:00:00+08:00"),
  });

  expect(data.days[0]?.cells[0]).toMatchObject({
    hour: 9,
    state: "Kitchen",
    occupiedSeconds: 2700,
  });
  expect(data.totalSeconds).toBe(3600);
  expect(data.legendStates).toEqual(["Kitchen", "Living Room"]);
});
```

- [x] **Step 3: Run aggregation tests and verify RED**

Run:

```bash
npx vitest run tests/aggregation.test.ts
```

Expected: FAIL because slot generation still returns all 24 hours and aggregation does not pass the selected range.

- [x] **Step 4: Generate only inclusive selected hours**

Change the `createHourlySlots` signature in `src/time-slots.ts`:

```ts
export function createHourlySlots(
  days: number,
  now: Date,
  timeZone: string,
  startHour = 0,
  endHour = 23
): DaySlots[] {
```

Change its hour loop to:

```ts
for (let hour = startHour; hour <= endHour; hour += 1) {
```

In `src/aggregation.ts`, pass the normalized range:

```ts
const slots = createHourlySlots(
  config.days,
  now,
  timeZone,
  config.start_hour,
  config.end_hour
);
```

- [x] **Step 5: Run focused/full tests and verify GREEN**

Run:

```bash
npx vitest run tests/aggregation.test.ts
npm test
npm run typecheck
```

Expected: slot counts, DST, numeric scope, categorical scope, existing behavior, and strict typing pass.

- [x] **Step 6: Commit selected-slot aggregation**

```bash
git add src/time-slots.ts src/aggregation.ts tests/aggregation.test.ts
git commit -m "feat: scope heatmaps to selected hours"
```

### Task 3: Dynamic card grid and recorder boundary

**Files:**

- Modify: `tests/card.test.ts`
- Modify: `src/card.ts`

- [x] **Step 1: Write failing dynamic-grid tests**

Add a narrowed-range rendering test while keeping the existing 24-cell default regression:

```ts
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
```

- [x] **Step 2: Write a failing selected-boundary request test**

Add:

```ts
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
```

- [x] **Step 3: Run card tests and verify RED**

Run:

```bash
npx vitest run tests/card.test.ts
```

Expected: FAIL because the card requests midnight, renders 24 headers/cells, and hard-codes 24 CSS columns.

- [x] **Step 4: Use selected hours for history loading**

In `loadHistory`, call:

```ts
const daySlots = createHourlySlots(
  this.config.days,
  now,
  this._hass.config.time_zone,
  this.config.start_hour,
  this.config.end_hour
);
```

The existing `daySlots[0]?.cells[0]?.start` lookup then becomes the selected start boundary.

- [x] **Step 5: Render dynamic columns and labels**

Change the CSS repeat count:

```css
grid-template-columns: var(--heatmap-label-width) repeat(
    var(--heatmap-column-count),
    var(--heatmap-cell-size)
  );
```

Before the template return in `render`, derive:

```ts
const displayedCells = this.data.days[0]?.cells ?? [];
const columnCount = displayedCells.length;
```

Set the inherited variable on `.matrix`:

```ts
<div
  class="matrix"
  role="grid"
  style=${styleMap({ "--heatmap-column-count": String(columnCount) })}
>
```

Replace the fixed header loop with:

```ts
${displayedCells.map((cell, index) =>
  index % 3 === 0
    ? html`<span class="hour-label" role="columnheader">${cell.hour}</span>`
    : html`<span class="hour-label" aria-hidden="true"></span>`
)}
```

- [x] **Step 6: Run card/full tests and verify GREEN**

Run:

```bash
npx vitest run tests/card.test.ts
npm test
npm run typecheck
```

Expected: selected and default cell counts, header labels, history boundary, all existing card states, and typing pass.

- [x] **Step 7: Commit dynamic card rendering**

```bash
git add src/card.ts tests/card.test.ts
git commit -m "feat: render selected heatmap hours"
```

### Task 4: Constrained visual-editor controls

**Files:**

- Modify: `tests/editor.test.ts`
- Modify: `src/editor.ts`

- [x] **Step 1: Write failing editor rendering tests**

Extend the required-controls test to assert:

```ts
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
```

Add disabled-combination coverage:

```ts
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
```

- [x] **Step 2: Write failing editor event tests**

Add:

```ts
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
```

- [x] **Step 3: Run editor tests and verify RED**

Run:

```bash
npx vitest run tests/editor.test.ts
```

Expected: FAIL because neither hour dropdown exists.

- [x] **Step 4: Render constrained whole-hour dropdowns**

At the start of `render`, derive:

```ts
const startHour = this.config.start_hour ?? 0;
const endHour = this.config.end_hour ?? 23;
const hours = Array.from({ length: 24 }, (_, hour) => hour);
```

Add a second `.two-column` block directly after the Days/Data mode block:

```ts
<div class="two-column">
  <label>
    Start hour
    <select
      name="start_hour"
      .value=${String(startHour)}
      @change=${(event: Event) =>
        this.emit({ start_hour: Number(this.value(event)) })}
    >
      ${hours.map(
        (hour) =>
          html`<option value=${hour} ?disabled=${hour > endHour}>${hour}</option>`
      )}
    </select>
  </label>
  <label>
    End hour
    <select
      name="end_hour"
      .value=${String(endHour)}
      @change=${(event: Event) =>
        this.emit({ end_hour: Number(this.value(event)) })}
    >
      ${hours.map(
        (hour) =>
          html`<option value=${hour} ?disabled=${hour < startHour}>${hour}</option>`
      )}
    </select>
  </label>
</div>
```

- [x] **Step 5: Run editor/full tests and verify GREEN**

Run:

```bash
npx vitest run tests/editor.test.ts
npm test
npm run typecheck
```

Expected: dropdown defaults, disabled options, numeric events, all existing editor behavior, full tests, and typing pass.

- [x] **Step 6: Commit editor controls**

```bash
git add src/editor.ts tests/editor.test.ts
git commit -m "feat: configure displayed hours"
```

### Task 5: README, Telegram group, demo, and browser coverage

**Files:**

- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `demo/main.ts`
- Modify: `tests/e2e/heatmap.spec.ts`
- Modify: `docs/images/preview-dark.png`

- [x] **Step 1: Write failing narrowed-range browser assertions**

In the existing theme test, scope the value-intensity card and assert its narrowed count and headers:

```ts
const numericCard = page.locator("occupancy-heatmap-card#numeric-value-card");
await expect(numericCard.locator("button.cell")).toHaveCount(105);
await expect(numericCard.locator(".hour-label[role='columnheader']")).toHaveText([
  "9",
  "12",
  "15",
  "18",
  "21",
]);
```

Update the all-card count from `504` to `441`: 105 narrowed numeric-value cells plus 168 full-day duration cells plus 168 categorical cells.

In the mobile-only assertion, keep the narrowed value card as the selected card and assert its matrix still scrolls horizontally at the Pixel 7 viewport.

- [x] **Step 2: Run the focused browser test and verify RED**

Run:

```bash
npx playwright test tests/e2e/heatmap.spec.ts --project=desktop --grep="dark dashboard"
```

Expected: FAIL because the mock numeric-value card still renders all 168 cells and its headers begin at 0.

- [x] **Step 3: Configure the mocked narrowed range**

Add to `numericValueCard.setConfig` in `demo/main.ts`:

```ts
start_hour: 9,
end_hour: 23,
```

Leave the duration and categorical preview cards at their default `0-23` ranges to demonstrate backward compatibility.

- [x] **Step 4: Document hour-range configuration and Telegram community**

Add this to the numeric YAML examples in `README.md`:

```yaml
start_hour: 9
end_hour: 23
```

Add a `Display hour range` section stating:

```md
## Display hour range

`start_hour` and `end_hour` select an inclusive same-day range of whole hours. Both default to the full day (`0-23`) and accept integers from `0` through `23`. The start must be less than or equal to the end, so overnight ranges are not supported. A range such as `9-23` displays 15 cells per day; `9-9` displays one.

Hidden hours do not affect occupied or recorded summaries, categorical winners, or numeric value normalization.
```

Add these options-table rows:

```md
| `start_hour` | integer | `0` | First displayed hour, inclusive. |
| `end_hour` | integer | `23` | Last displayed hour, inclusive. |
```

Add near the end of the README:

```md
## Community

[Telegram Group](https://t.me/smarthomehk)
```

Add a `0.3.0 - 2026-07-28` changelog section covering selected display hours, calculation scoping, dynamic grid/editor controls, and the community link.

- [x] **Step 5: Run browser coverage and refresh preview**

Run:

```bash
npm run format
npm run test:e2e
```

Expected: desktop/mobile light/dark scenarios pass; the narrowed value card has 105 cells, correct headers, usable details, no page overflow, and mobile matrix scrolling; `docs/images/preview-dark.png` is refreshed.

- [x] **Step 6: Commit docs and browser harness**

```bash
git add README.md CHANGELOG.md demo/main.ts tests/e2e/heatmap.spec.ts docs/images/preview-dark.png
git commit -m "docs: explain display hour ranges"
```

### Task 6: Build, verify, publish `v0.3.0`, and close the plan

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `dist/ha-occupancy-heatmap-card.js`
- Modify: `dist/ha-occupancy-heatmap-card.js.map`
- Modify: `docs/superpowers/plans/2026-07-28-display-hour-range.md`

- [x] **Step 1: Bump package metadata**

Run:

```bash
npm version 0.3.0 --no-git-tag-version
```

Expected: package and lockfile versions become `0.3.0` without creating a commit or tag.

- [x] **Step 2: Run the complete local release gate**

Run:

```bash
npm run format
npm run check
npm run test:e2e
npm audit
npm audit --omit=dev
git diff --check
```

Expected: formatting, lint, strict typing, all Vitest tests, the Rollup production build, all applicable Playwright scenarios, both audits, and whitespace validation pass. The build refreshes the committed files under `dist/`.

- [x] **Step 3: Commit release preparation**

Mark Tasks 1-5 and local release Steps 1-2 complete in this plan, then run:

```bash
git add package.json package-lock.json dist/ha-occupancy-heatmap-card.js dist/ha-occupancy-heatmap-card.js.map docs/superpowers/plans/2026-07-28-display-hour-range.md
git commit -m "chore: prepare v0.3.0"
```

- [x] **Step 4: Push and verify hosted CI**

Run:

```bash
git push origin main
CI_RUN_ID="$(gh run list --repo wfchan/ha-occupancy-heatmap-card --workflow CI --branch main --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$CI_RUN_ID" --repo wfchan/ha-occupancy-heatmap-card --exit-status
```

Expected: the hosted `verify` and `hacs` jobs pass for the `v0.3.0` preparation commit.

- [x] **Step 5: Publish and verify the release**

Run:

```bash
gh release create v0.3.0 --repo wfchan/ha-occupancy-heatmap-card --target main --title "v0.3.0" --notes "Add inclusive same-day display hour ranges with dynamically scoped heatmap calculations and editor controls."
RELEASE_RUN_ID="$(gh run list --repo wfchan/ha-occupancy-heatmap-card --workflow Release --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$RELEASE_RUN_ID" --repo wfchan/ha-occupancy-heatmap-card --exit-status
gh release view v0.3.0 --repo wfchan/ha-occupancy-heatmap-card --json url,assets
```

Expected: the release workflow passes and attaches `ha-occupancy-heatmap-card.js` to public `v0.3.0` so HACS can offer the update.

- [x] **Step 6: Record completion**

Mark every remaining checkbox in this file `[x]`, then run:

```bash
git add docs/superpowers/plans/2026-07-28-display-hour-range.md
git commit -m "docs: mark display hour plan complete"
git push origin main
git status --short --branch
```

Expected: `main` matches `origin/main`, the worktree is clean, and the final hosted CI run passes.
