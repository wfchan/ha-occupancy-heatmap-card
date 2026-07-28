# Numeric Sensor Value Intensity Design

## Goal

Let numeric heatmaps choose whether cell color intensity represents occupied duration or the sensor's numeric value. Preserve duration intensity as the default so existing card configurations do not change.

## Public Configuration

Add one option to the card configuration:

```yaml
numeric_intensity: duration
```

Accepted values are:

- `duration`: the existing behavior. Intensity represents the fraction of the hourly slot spent above `numeric_threshold`.
- `value`: intensity represents the time-weighted numeric value while the sensor is above `numeric_threshold`, normalized across the selected date range.

The option defaults to `duration`. Invalid values produce a configuration error. It applies only when the resolved data mode is numeric; categorical aggregation ignores it.

## Hourly Calculation

The existing interval construction, boundary carry-forward, exclusions, timezone handling, and hourly clipping remain unchanged. For a numeric cell, only finite numeric intervals with values strictly greater than `numeric_threshold` count as occupied.

For each non-future hourly slot:

```text
occupied_seconds = sum(occupied interval duration)

duration_intensity =
  occupied_seconds / actual_slot_duration

weighted_value =
  sum(value * occupied interval duration) / occupied_seconds
```

`weighted_value` is absent when `occupied_seconds` is zero. Intervals that are empty, excluded, non-numeric, at or below the threshold, or outside the effective slot boundary do not contribute to either the numerator or denominator. The current hour is clipped at the current time. DST slots continue to use their actual elapsed duration.

The weighted average deliberately uses occupied time as its denominator. This keeps sensor-value intensity independent from occupied-duration intensity. For example, if a sensor reports `0` for 30 minutes and `2` for 30 minutes with a threshold of `0`, the cell's weighted value is `2`, while its occupied duration remains 30 minutes.

## Global Value Range

Value mode uses a second aggregation pass. After all cells have weighted values, determine `range_min` and `range_max` from all occupied, non-future hourly cells across the complete selected 1-31 day range.

For each occupied cell:

```text
value_intensity =
  1                                           when range_min = range_max
  (weighted_value - range_min)
    / (range_max - range_min)                 otherwise
```

This produces a normalized intensity from `0` through `1`. The existing renderer maps that normalized value to its visible color-strength range, so the minimum remains visibly occupied and the maximum uses full color. When every occupied cell has the same weighted value, all occupied cells use full color.

The range is based on hourly weighted values rather than raw recorder samples. Brief spikes therefore affect only the hourly average in which they occur and do not flatten contrast across the entire heatmap. A single global range preserves comparisons between different days.

Calculations retain full numeric precision. Rounding is used only in user-facing detail text.

## Data Model And Rendering

Add `numeric_intensity` to the public and normalized config types. Numeric heatmap cells gain an optional weighted numeric value. Heatmap data may expose the resolved numeric range for rendering and tests.

`occupiedSeconds` and `totalSeconds` retain their current meanings in both intensity modes. The header continues to summarize occupied hours rather than sensor values.

In value mode, hover, focus, and tap details show both the weighted value and occupied duration. When the entity provides a `unit_of_measurement`, the displayed value includes that unit. Duration mode retains its existing detail format.

Filled and future cell rules do not change. A cell is filled only when `occupiedSeconds` is greater than zero. Future and zero-duration DST cells remain disabled and empty.

## Visual Editor

Add a `Color intensity` select control to the existing `Numeric occupancy` section. It offers:

- `Occupied time`, stored as `duration`.
- `Sensor value`, stored as `value`.

The control appears whenever numeric controls currently appear: numeric mode and automatic mode. It is hidden in categorical mode. Changes emit the standard `config-changed` event.

## Documentation

Update the README so the full calculation is available without reading source code. It must include:

- The `numeric_intensity` configuration option, accepted values, and default.
- Separate YAML examples for duration and sensor-value intensity.
- The occupied-seconds, duration-intensity, weighted-value, and value-normalization formulas.
- The strict threshold rule (`value > numeric_threshold`).
- Which states and cells are excluded from calculations.
- The global selected-range minimum and maximum rule.
- The equal-range behavior.
- Full-precision calculation and display-only rounding.
- DST and current-hour clipping behavior.
- A worked example where `1` for 45 minutes and `3` for 15 minutes produces a weighted value of `1.5`.
- A worked example showing that below-threshold time does not dilute the occupied weighted value.

Update the changelog and mocked development demo to show the new value-intensity option.

## Testing

Follow test-driven development for implementation. Coverage includes:

- Config defaults to `duration`, accepts `value`, and rejects unsupported values.
- Existing duration-based aggregation remains unchanged.
- A cell with `1` for 45 minutes and `3` for 15 minutes has a weighted value of `1.5`.
- Below-threshold, excluded, and non-numeric intervals do not contribute to a weighted value.
- Global minimum and maximum use occupied hourly weighted values across all displayed days.
- Minimum, intermediate, and maximum values normalize correctly.
- A constant occupied range produces full intensity for every occupied cell.
- Empty and future cells remain unfilled and do not affect the range.
- Current-hour and DST clipping retain correct duration arithmetic.
- The editor renders the selector in numeric and automatic modes, hides it in categorical mode, and emits the selected value.
- Card details display weighted value, unit, and occupied duration in value mode.
- Existing configurations without `numeric_intensity` render with duration-based intensity.
- The mocked browser harness demonstrates both numeric intensity choices without overlap at supported desktop and mobile widths.

## Compatibility And Scope

This is an additive option with a backward-compatible default. History retrieval and request caching do not change. Categorical winner selection, categorical colors, legend behavior, date range behavior, and HACS packaging remain outside this change.
