# Searchable Entity Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the card editor's closed entity dropdown with Home Assistant's searchable native entity picker and publish the change as `v0.1.1`.

**Architecture:** The editor will bind its existing `hass` and configured entity value directly to `ha-entity-picker`. A `value-changed` handler will reuse the existing `config-changed` emission path after the user selects a filtered entity.

**Tech Stack:** TypeScript, Lit 3, Home Assistant frontend custom elements, Vitest, Playwright, Rollup, HACS, GitHub Actions.

---

### Task 1: Searchable entity control

**Files:**

- Modify: `tests/editor.test.ts`
- Modify: `src/editor.ts`

- [ ] **Step 1: Write failing picker rendering and selection tests**

Replace the existing late-`hass` entity option test and entity-control assertion, then add a selection event test:

```ts
type EntityPickerElement = HTMLElement & {
  hass?: HomeAssistant;
  value?: string;
};

it("updates the searchable entity picker when hass is assigned", async () => {
  const editor = document.createElement(
    "occupancy-heatmap-card-editor"
  ) as OccupancyHeatmapCardEditor;
  editor.setConfig({ entity: "sensor.room" });
  document.body.append(editor);
  await editor.updateComplete;

  const picker =
    editor.shadowRoot?.querySelector<EntityPickerElement>("ha-entity-picker");
  expect(picker).toBeTruthy();
  expect(picker?.hass).toBeUndefined();

  editor.hass = hass;
  await editor.updateComplete;

  expect(picker?.hass).toBe(hass);
  expect(picker?.value).toBe("sensor.room");
});

it("emits the entity selected from filtered picker results", async () => {
  const editor = document.createElement(
    "occupancy-heatmap-card-editor"
  ) as OccupancyHeatmapCardEditor;
  editor.hass = hass;
  editor.setConfig({ entity: "sensor.room" });
  document.body.append(editor);
  await editor.updateComplete;
  const listener = vi.fn();
  editor.addEventListener("config-changed", listener);
  const picker = editor.shadowRoot?.querySelector("ha-entity-picker");
  if (!picker) throw new Error("Entity picker missing");

  picker.dispatchEvent(
    new CustomEvent("value-changed", {
      detail: { value: "sensor.kitchen" },
    })
  );

  expect(listener).toHaveBeenCalledOnce();
  expect(listener.mock.calls[0]?.[0].detail.config.entity).toBe("sensor.kitchen");
});
```

In `renders the required configuration controls`, replace:

```ts
expect(editor.shadowRoot?.querySelector("select[name='entity']")).toBeTruthy();
```

with:

```ts
expect(editor.shadowRoot?.querySelector("ha-entity-picker")).toBeTruthy();
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npx vitest run tests/editor.test.ts
```

Expected: the picker tests fail because the editor still renders `select[name="entity"]` and no `ha-entity-picker` exists.

- [ ] **Step 3: Implement the native entity picker**

Add picker sizing to `OccupancyHeatmapCardEditor.styles`:

```css
ha-entity-picker {
  width: 100%;
}
```

Add a guarded selection handler:

```ts
private entityChanged(event: CustomEvent<{ value?: string }>): void {
  const entity = event.detail.value?.trim();
  if (entity) this.emit({ entity });
}
```

Remove the unused sorted `entities` variable from `render()`. Replace the entity `<select>` and all of its `<option>` children with:

```ts
<ha-entity-picker
  .hass=${this.hass}
  .value=${this.config.entity ?? ""}
  @value-changed=${this.entityChanged}
></ha-entity-picker>
```

Do not add `allow-custom-entity`; users must select an entity returned by Home Assistant.

- [ ] **Step 4: Run focused and full checks and verify GREEN**

Run:

```bash
npx vitest run tests/editor.test.ts
npm run format
npm run check
npm run test:e2e
npm audit
```

Expected: all editor tests, 38 total unit/component tests, the build, five applicable browser tests, HACS-related project checks, and the audit pass.

- [ ] **Step 5: Commit the editor change**

```bash
git add src/editor.ts tests/editor.test.ts dist/ha-occupancy-heatmap-card.js dist/ha-occupancy-heatmap-card.js.map
git commit -m "feat: add searchable entity picker"
```

### Task 2: Patch release

**Files:**

- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `CHANGELOG.md`
- Modify: `docs/superpowers/plans/2026-07-28-searchable-entity-picker.md`
- Modify: `dist/ha-occupancy-heatmap-card.js`
- Modify: `dist/ha-occupancy-heatmap-card.js.map`

- [ ] **Step 1: Bump the package version and changelog**

Run:

```bash
npm version 0.1.1 --no-git-tag-version
```

Add above the `0.1.0` section in `CHANGELOG.md`:

```md
## 0.1.1 - 2026-07-28

- Replace the entity dropdown with Home Assistant's searchable entity picker.
```

- [ ] **Step 2: Rebuild and run release verification**

Run:

```bash
npm run format
npm run check
npm run test:e2e
npm audit
npm audit --omit=dev
git diff --check
```

Expected: formatting, lint, strict type checking, 38 unit/component tests, the production build, five applicable browser tests, both audits, and whitespace validation pass.

- [ ] **Step 3: Commit the release preparation**

Mark the completed implementation and local-verification checkboxes in this file as `[x]`, then run:

```bash
git add package.json package-lock.json CHANGELOG.md dist/ha-occupancy-heatmap-card.js dist/ha-occupancy-heatmap-card.js.map docs/superpowers/plans/2026-07-28-searchable-entity-picker.md
git commit -m "chore: prepare v0.1.1"
```

- [ ] **Step 4: Push and validate hosted checks**

Run:

```bash
git push origin main
CI_RUN_ID="$(gh run list --repo wfchan/ha-occupancy-heatmap-card --workflow CI --branch main --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$CI_RUN_ID" --repo wfchan/ha-occupancy-heatmap-card --exit-status
```

Expected: both `verify` and `hacs` jobs pass for the pushed commit.

- [ ] **Step 5: Publish and verify `v0.1.1`**

Run:

```bash
gh release create v0.1.1 --repo wfchan/ha-occupancy-heatmap-card --target main --title "v0.1.1" --notes "Replace the entity dropdown with Home Assistant's searchable entity picker."
RELEASE_RUN_ID="$(gh run list --repo wfchan/ha-occupancy-heatmap-card --workflow Release --limit 1 --json databaseId --jq '.[0].databaseId')"
gh run watch "$RELEASE_RUN_ID" --repo wfchan/ha-occupancy-heatmap-card --exit-status
gh release view v0.1.1 --repo wfchan/ha-occupancy-heatmap-card --json url,assets
```

Expected: the release workflow passes and `ha-occupancy-heatmap-card.js` is attached to the public `v0.1.1` release.

- [ ] **Step 6: Record plan completion**

Mark all remaining checkboxes in this file as `[x]`, then run:

```bash
git add docs/superpowers/plans/2026-07-28-searchable-entity-picker.md
git commit -m "docs: mark searchable picker plan complete"
git push origin main
```
