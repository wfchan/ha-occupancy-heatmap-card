# Occupancy Heatmap Card

A Home Assistant dashboard card that turns recorder history into a day-by-hour occupancy heatmap. Numeric sensors can scale one color by occupied time or sensor value; categorical sensors use stable colors for their dominant state.

![Dark dashboard preview](docs/images/preview-dark.png)

## Install with HACS

[![Open your Home Assistant instance and add this repository to HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=wfchan&repository=ha-occupancy-heatmap-card&category=plugin)

1. Open HACS and select **Dashboard**.
2. Open the menu, choose **Custom repositories**, and add:

   ```text
   https://github.com/wfchan/ha-occupancy-heatmap-card
   ```

3. Select the **Dashboard** category, install **Occupancy Heatmap Card**, and refresh Home Assistant.
4. Add the card through the dashboard editor or YAML using `custom:occupancy-heatmap-card`.

## Numeric sensor: occupied time

Values strictly above `numeric_threshold` count as occupied. With the default `numeric_intensity: duration`, cell intensity represents the fraction of the hourly slot spent above the threshold.

```yaml
type: custom:occupancy-heatmap-card
entity: sensor.living_room_people
title: Living room activity
days: 7
mode: numeric
numeric_threshold: 0
numeric_intensity: duration
numeric_color: "#52a9e8"
```

## Numeric sensor: sensor value

With `numeric_intensity: value`, each cell uses the time-weighted sensor value while occupied. The card scales all occupied hourly values against the minimum and maximum found across the selected days, so a count of 3 is more intense than a count of 1.

```yaml
type: custom:occupancy-heatmap-card
entity: sensor.living_room_people
title: Living room person count
days: 7
mode: numeric
numeric_threshold: 0
numeric_intensity: value
numeric_color: "#52a9e8"
```

### Numeric intensity calculations

The card first clips recorder state intervals to each local hourly slot. Only finite numeric values strictly greater than `numeric_threshold` are occupied. Empty states, `excluded_states`, non-numeric states, values at or below the threshold, time outside the slot, and future time do not contribute.

For each cell:

```text
occupied_seconds = sum(duration where value > numeric_threshold)

duration_intensity = occupied_seconds / actual_slot_duration

weighted_value =
  sum(value * occupied_interval_duration) / occupied_seconds
```

`weighted_value` exists only when `occupied_seconds` is greater than zero. It divides by occupied time, not the full slot, so value intensity remains independent from duration intensity.

For `numeric_intensity: value`, the card finds `range_min` and `range_max` from the occupied hourly `weighted_value` results across all selected days. It then calculates:

```text
value_intensity =
  1                                             if range_min = range_max
  (weighted_value - range_min)
    / (range_max - range_min)                   otherwise
```

The minimum maps to the faintest visible occupied color and the maximum maps to full color. If every occupied hourly value is equal, every occupied cell uses full color. Empty and future cells do not affect the range.

Calculations keep full numeric precision. Rounding is applied only to displayed details. The current hour is clipped at the current time, and daylight-saving slots use their actual elapsed duration, including zero-hour and two-hour transitions.

Worked examples:

- A sensor reporting `1` for 45 minutes and `3` for 15 minutes produces `(1 * 45 + 3 * 15) / 60 = 1.5`.
- With a threshold of `0`, a sensor reporting `0` for 30 minutes and `2` for 30 minutes produces a weighted occupied value of `2` and an occupied duration of 30 minutes. The below-threshold period does not dilute the weighted value.

## Categorical sensor

The longest-duration state supplies each cell's color. Its duration supplies the intensity. Equal durations use the state active most recently.

```yaml
type: custom:occupancy-heatmap-card
entity: sensor.rocky_location
title: Rocky location
days: 7
mode: categorical
state_colors:
  Living Room: "#ea63a5"
  Master Bedroom: "#6eb7ef"
  Kitchen: "#62c78a"
  Away: "#667785"
show_legend: true
```

`mode: auto` is the default. It selects numeric mode only when every valid recorded state is a finite number.

## Options

| Option              | Type        | Default                  | Description                                           |
| ------------------- | ----------- | ------------------------ | ----------------------------------------------------- |
| `entity`            | string      | required                 | Entity whose recorder history is displayed.           |
| `title`             | string      | entity name              | Card heading.                                         |
| `days`              | integer     | `7`                      | Number of local calendar days, from 1 through 31.     |
| `mode`              | string      | `auto`                   | `auto`, `numeric`, or `categorical`.                  |
| `numeric_threshold` | number      | `0`                      | Numeric states strictly above this count as occupied. |
| `numeric_intensity` | string      | `duration`               | `duration` or `value` color scaling.                  |
| `numeric_color`     | CSS color   | `#03a9f4`                | Numeric heatmap color.                                |
| `state_colors`      | map         | `{}`                     | Optional categorical state-to-color overrides.        |
| `excluded_states`   | string list | `unknown`, `unavailable` | States ignored during aggregation.                    |
| `show_legend`       | boolean     | `true`                   | Show categorical state colors above the grid.         |

The visual editor exposes the same options. Dates use Home Assistant's configured timezone and locale. Future hours remain empty, and daylight-saving hours use their actual elapsed duration.

## Manual installation

Download `ha-occupancy-heatmap-card.js` from the latest release, copy it to `config/www`, and add `/local/ha-occupancy-heatmap-card.js` as a JavaScript module dashboard resource.

## Development

```bash
npm install
npm test
npm run build
npm run test:e2e
```

Run `npm run dev` to open the mocked Home Assistant preview. Design and implementation records live in [`docs/superpowers`](docs/superpowers).

## License

[MIT](LICENSE)
