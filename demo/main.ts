import "../src/ha-occupancy-heatmap-card";

import type { OccupancyHeatmapCard } from "../src/card";
import type { HistoryState, HistoryStates, HomeAssistant } from "../src/types";

const theme =
  new URLSearchParams(location.search).get("theme") === "dark" ? "dark" : "light";
document.documentElement.dataset.theme = theme;

const HOUR = 60 * 60 * 1000;
const now = Date.now();
const historyStart = now - 8 * 24 * HOUR;

function numericHistory(): HistoryState[] {
  const states: HistoryState[] = [];
  for (let time = historyStart; time < now; time += HOUR) {
    const date = new Date(time);
    const hour = date.getHours();
    const day = date.getDay();
    const active = hour >= 6 && hour <= 21 && !(day === 0 && hour < 10);
    const occupiedMinutes = active ? 15 + ((hour * 11 + day * 7) % 45) : 0;
    states.push({ s: "0", lu: time / 1000 });
    if (occupiedMinutes > 0) {
      const offset = (60 - occupiedMinutes) * 60 * 1000;
      states.push({ s: String(1 + ((hour + day) % 3)), lu: (time + offset) / 1000 });
    }
  }
  return states;
}

function roomFor(hour: number, day: number): string {
  if (hour < 6) return "Master Bedroom";
  if (hour < 8 || hour === 18) return "Kitchen";
  if (hour < 17 && day > 0 && day < 6) return "Away";
  if (hour < 22) return "Living Room";
  return "Master Bedroom";
}

function categoricalHistory(): HistoryState[] {
  const states: HistoryState[] = [];
  for (let time = historyStart; time < now; time += HOUR) {
    const date = new Date(time);
    const hour = date.getHours();
    const day = date.getDay();
    const primary = roomFor(hour, day);
    states.push({ s: primary, lu: time / 1000 });
    if ((hour + day) % 4 === 0) {
      const secondary = primary === "Living Room" ? "Kitchen" : "Living Room";
      states.push({ s: secondary, lu: (time + 42 * 60 * 1000) / 1000 });
    }
  }
  return states;
}

const histories: HistoryStates = {
  "sensor.living_room_activity": numericHistory(),
  "sensor.rocky_location": categoricalHistory(),
};

const hass: HomeAssistant = {
  states: {
    "sensor.living_room_activity": {
      entity_id: "sensor.living_room_activity",
      state: "2",
      last_changed: new Date(now - 20 * 60 * 1000).toISOString(),
      attributes: { friendly_name: "Living room activity" },
    },
    "sensor.rocky_location": {
      entity_id: "sensor.rocky_location",
      state: "Living Room",
      last_changed: new Date(now - 14 * 60 * 1000).toISOString(),
      attributes: { friendly_name: "Rocky location" },
    },
  },
  config: { time_zone: "Asia/Hong_Kong" },
  locale: { language: "en" },
  callWS: async <T>(message: Record<string, unknown>) => {
    const entityIds = message.entity_ids as string[] | undefined;
    const result = Object.fromEntries(
      (entityIds ?? Object.keys(histories)).map((entityId) => [
        entityId,
        histories[entityId] ?? [],
      ])
    );
    return result as T;
  },
};

const numericCard = document.querySelector("#numeric-card") as OccupancyHeatmapCard;
numericCard.setConfig({
  entity: "sensor.living_room_activity",
  title: "Living room activity",
  days: 7,
  mode: "numeric",
  numeric_threshold: 0,
  numeric_color: "#52a9e8",
});
numericCard.hass = hass;

const categoricalCard = document.querySelector(
  "#categorical-card"
) as OccupancyHeatmapCard;
categoricalCard.setConfig({
  entity: "sensor.rocky_location",
  title: "Rocky location",
  days: 7,
  mode: "categorical",
  state_colors: {
    "Living Room": "#ea63a5",
    "Master Bedroom": "#6eb7ef",
    Kitchen: "#62c78a",
    Away: "#667785",
  },
});
categoricalCard.hass = hass;
