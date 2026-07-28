# Occupancy Heatmap Card Design

## Product goal

Build a Home Assistant dashboard card that shows how long one entity occupied each hour over the last 1 to 31 days. The default view is seven days by 24 hourly cells and follows the supplied dark, compact heatmap references while inheriting Home Assistant theme colors.

## Card behavior

- Numeric entities use one configurable color. A state is occupied while its numeric value is greater than a configurable threshold (default `0`), and cell intensity is occupied duration divided by slot duration.
- Categorical entities assign stable colors to state strings. The state with the longest duration wins each slot; equal durations are resolved in favor of the state active most recently. Intensity is the winning duration divided by slot duration.
- `unknown`, `unavailable`, and empty states are excluded by default. Users can edit this list.
- Auto mode selects numeric only when every valid sampled state is numeric. Users can force either mode.
- History is clipped into local hourly slots using the Home Assistant configured timezone. The state active at the beginning of the requested period is carried forward. Future slots are empty, and daylight-saving slots normalize against their actual elapsed duration.

## Interface

The card header contains the entity friendly name or configured title, a duration summary, and a categorical legend. Rows run oldest day to today. Columns represent hours `0` through `23`, with labels every three hours. Date labels use the Home Assistant locale, today receives an accent treatment, and details are available by hover, keyboard focus, or tap.

On narrow screens, the grid scrolls horizontally while labels remain readable. The card supports Home Assistant light and dark themes and exposes visible focus states without introducing a separate visual theme.

The visual editor controls the entity, title, 1-31 day range, mode, numeric threshold and color, categorical color overrides, excluded states, and legend visibility.

## Architecture

Use a Lit 3 custom element bundled by Rollup into `dist/ha-occupancy-heatmap-card.js`. Keep configuration validation, Home Assistant history retrieval, hourly aggregation, palette selection, rendering, and editor behavior in focused modules. The aggregation layer is framework-independent and receives explicit timezone, period, mode, and state history inputs.

History loads through `history/history_during_period`. The card reloads after relevant entity state transitions, deduplicates equivalent requests, discards stale responses, and advances the current-hour display on a minute timer.

## Failure states

Invalid configuration throws an actionable configuration error. A missing entity, unavailable recorder/history API, empty history, and request failure render distinct in-card states. Earlier asynchronous responses cannot overwrite data for newer configuration.

## Distribution

Publish an MIT-licensed public repository at `wfchan/ha-occupancy-heatmap-card`. The default branch includes a built distribution file for immediate custom-repository installation. GitHub Actions verifies formatting, linting, types, tests, production output, and HACS metadata. Release `v0.1.0` only after the full verification suite passes.

