import type { HistoryState, HistoryStates, HomeAssistant } from "./types";

export interface HistoryLoadResult {
  states: HistoryState[];
  stale: boolean;
}

export class HistoryService {
  private generation = 0;
  private readonly pending = new Map<string, Promise<HistoryLoadResult>>();

  load(
    hass: HomeAssistant,
    entityId: string,
    startTime: Date,
    endTime: Date
  ): Promise<HistoryLoadResult> {
    const key = [entityId, startTime.toISOString(), endTime.toISOString()].join("|");
    const existing = this.pending.get(key);
    if (existing) {
      return existing;
    }

    const requestGeneration = ++this.generation;
    const request = hass
      .callWS<HistoryStates>({
        type: "history/history_during_period",
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        entity_ids: [entityId],
        minimal_response: true,
        no_attributes: true,
      })
      .then((history) => ({
        states: history[entityId] ?? [],
        stale: requestGeneration !== this.generation,
      }))
      .finally(() => {
        if (this.pending.get(key) === request) {
          this.pending.delete(key);
        }
      });

    this.pending.set(key, request);
    return request;
  }
}
