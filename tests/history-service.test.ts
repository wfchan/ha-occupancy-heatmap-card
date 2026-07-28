import { describe, expect, it, vi } from "vitest";

import { HistoryService } from "../src/history-service";
import type { HistoryStates, HomeAssistant } from "../src/types";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, reject, resolve };
}

function createHass(
  callWS: (message: Record<string, unknown>) => Promise<HistoryStates>
): HomeAssistant {
  return {
    states: {},
    config: { time_zone: "Asia/Hong_Kong" },
    locale: { language: "en" },
    callWS: <T>(message: Record<string, unknown>) => callWS(message) as Promise<T>,
  };
}

describe("HistoryService", () => {
  it("requests compact history for only the configured entity", async () => {
    const callWS = vi.fn().mockResolvedValue({ "sensor.room": [{ s: "1", lu: 100 }] });
    const service = new HistoryService();
    const start = new Date("2026-07-21T00:00:00+08:00");
    const end = new Date("2026-07-28T12:00:00+08:00");

    const result = await service.load(createHass(callWS), "sensor.room", start, end);

    expect(callWS).toHaveBeenCalledWith({
      type: "history/history_during_period",
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      entity_ids: ["sensor.room"],
      minimal_response: true,
      no_attributes: true,
    });
    expect(result).toEqual({ states: [{ s: "1", lu: 100 }], stale: false });
  });

  it("deduplicates an equivalent request while it is pending", async () => {
    const pending = deferred<HistoryStates>();
    const callWS = vi.fn(() => pending.promise);
    const service = new HistoryService();
    const hass = createHass(callWS);
    const start = new Date("2026-07-21T00:00:00Z");
    const end = new Date("2026-07-28T00:00:00Z");

    const first = service.load(hass, "sensor.room", start, end);
    const second = service.load(hass, "sensor.room", start, end);
    pending.resolve({ "sensor.room": [] });

    expect(first).toBe(second);
    await expect(first).resolves.toEqual({ states: [], stale: false });
    expect(callWS).toHaveBeenCalledTimes(1);
  });

  it("marks an older response stale after a newer request begins", async () => {
    const older = deferred<HistoryStates>();
    const newer = deferred<HistoryStates>();
    const callWS = vi
      .fn()
      .mockReturnValueOnce(older.promise)
      .mockReturnValueOnce(newer.promise);
    const service = new HistoryService();
    const hass = createHass(callWS);
    const end = new Date("2026-07-28T00:00:00Z");

    const first = service.load(
      hass,
      "sensor.room",
      new Date("2026-07-21T00:00:00Z"),
      end
    );
    const second = service.load(
      hass,
      "sensor.other",
      new Date("2026-07-21T00:00:00Z"),
      end
    );
    newer.resolve({ "sensor.other": [{ s: "Kitchen", lu: 2 }] });
    older.resolve({ "sensor.room": [{ s: "1", lu: 1 }] });

    await expect(second).resolves.toEqual({
      states: [{ s: "Kitchen", lu: 2 }],
      stale: false,
    });
    await expect(first).resolves.toEqual({ states: [{ s: "1", lu: 1 }], stale: true });
  });

  it("marks an older rejected request stale after a newer request succeeds", async () => {
    const older = deferred<HistoryStates>();
    const newer = deferred<HistoryStates>();
    const callWS = vi
      .fn()
      .mockReturnValueOnce(older.promise)
      .mockReturnValueOnce(newer.promise);
    const service = new HistoryService();
    const hass = createHass(callWS);
    const end = new Date("2026-07-28T00:00:00Z");

    const first = service.load(
      hass,
      "sensor.room",
      new Date("2026-07-21T00:00:00Z"),
      end
    );
    const second = service.load(
      hass,
      "sensor.other",
      new Date("2026-07-21T00:00:00Z"),
      end
    );
    newer.resolve({ "sensor.other": [{ s: "Kitchen", lu: 2 }] });
    await expect(second).resolves.toEqual({
      states: [{ s: "Kitchen", lu: 2 }],
      stale: false,
    });
    older.reject(new Error("Old recorder failure"));

    await expect(first).resolves.toEqual({ states: [], stale: true });
  });
});
