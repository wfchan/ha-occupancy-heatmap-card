# Display Hour Range Design

## Goal

Let users limit each heatmap row to an inclusive same-day range of whole hours while preserving the current 24-hour display by default.

## Public Configuration

Add two optional properties:

```yaml
start_hour: 9
end_hour: 23
```

- `start_hour` defaults to `0`.
- `end_hour` defaults to `23`.
- Both values must be whole integers from `0` through `23`.
- `start_hour` must be less than or equal to `end_hour`.
- Both endpoints are inclusive. The range `9-23` displays 15 cells per day, starting with `09:00-09:59` and ending with `23:00-23:59`.
- A one-hour range such as `9-9` is valid and displays one cell per day.
- Overnight ranges such as `22-6` are invalid. Every row continues to represent one local calendar date.

Invalid YAML configuration produces a clear configuration error. Existing configurations receive `0-23` and retain their current behavior.

## Slot Generation And Data Scope

Extend hourly slot generation to accept the normalized start and end hours. Generate cells only for the inclusive selected range instead of generating all 24 hours and filtering later.

This makes the selected slots the single source of truth for:

- Numeric occupied duration and total occupied hours.
- Numeric time-weighted values and selected-range minimum/maximum normalization.
- Categorical duration, dominant-state selection, and recorded-hour summaries.
- Future cells and DST elapsed duration.
- Rendered cells, column headers, keyboard focus, and accessible details.

Hidden hours do not contribute to any calculation or summary. The history request begins at the first selected slot on the oldest displayed date, using Home Assistant's existing boundary-state behavior so a state already active at `start_hour` carries into the first cell.

Changing either hour changes normalized configuration, clears stale card data, and reloads recorder history through the existing request generation and stale-response protections.

## Rendering

Remove the hard-coded 24-column assumptions from the card. Set the grid column count from `end_hour - start_hour + 1` and derive header values from the selected hours.

The first displayed hour receives a label. Additional labels appear every three displayed columns, preserving predictable spacing for ranges that do not begin on a multiple of three. For `9-23`, labels are `9`, `12`, `15`, `18`, and `21`.

The existing horizontal scroll behavior remains responsive to the resulting grid width. Narrow ranges may fit without scrolling; wider ranges retain horizontal scrolling on mobile. Row labels, today highlighting, selected-cell details, focus rings, and future-cell styling do not change.

## Visual Editor

Add `Start hour` and `End hour` dropdowns to the source section near `Days`. Each dropdown contains the whole hours `0` through `23`.

The start dropdown disables values later than the current end hour. The end dropdown disables values earlier than the current start hour. This prevents the editor from emitting an invalid same-day combination. Each valid selection emits the standard `config-changed` event with a numeric hour.

## Documentation And Community Link

Update the README with:

- `start_hour` and `end_hour` in the options table.
- A YAML example using `9-23`.
- Inclusive endpoint, integer-only, one-hour, same-day, and default behavior.
- A statement that hidden hours do not affect summaries or intensity calculations.
- A `Community` section containing `[Telegram Group](https://t.me/smarthomehk)`.

Update the changelog for `v0.3.0`, the mocked dashboard, and the tracked preview image.

## Testing

Implementation follows test-driven development. Coverage includes:

- Defaults normalize to `0` and `23`.
- Valid inclusive values and one-hour ranges are accepted.
- Values outside `0-23`, decimals, and `start_hour > end_hour` are rejected with clear errors.
- Slot generation returns 24 cells for `0-23`, 15 cells for `9-23`, and one cell for `9-9`.
- Selected slots retain local-time and DST duration behavior.
- Hidden hours do not affect numeric occupied totals, numeric value normalization, categorical totals, or dominant states.
- History requests start at the oldest date's selected start hour.
- Card rows and headers render the dynamic column count and correct labels.
- The editor renders both dropdowns, disables invalid choices, emits numeric values, and retains the full-day default.
- Existing configurations without the new options continue to render 24 cells per day.
- Browser tests cover a narrowed range on desktop and mobile in light and dark themes, including expected overflow behavior, focus/tap details, and non-overlapping text.

## Release

Publish the backward-compatible feature as `v0.3.0` after format, lint, strict type, unit/component, production build, browser, audit, GitHub CI, and HACS validation checks pass. Attach the built `ha-occupancy-heatmap-card.js` release asset so HACS can offer the update.
