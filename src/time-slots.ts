import { TZDate } from "@date-fns/tz";

export interface HourlySlot {
  hour: number;
  start: Date;
  end: Date;
  durationSeconds: number;
}

export interface DaySlots {
  dateKey: string;
  date: Date;
  isToday: boolean;
  cells: HourlySlot[];
}

function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createHourlySlots(days: number, now: Date, timeZone: string): DaySlots[] {
  const localNow = TZDate.tz(timeZone, now);
  const year = localNow.getFullYear();
  const month = localNow.getMonth();
  const date = localNow.getDate();
  const todayKey = dateKey(localNow);
  const result: DaySlots[] = [];

  for (let dayOffset = days - 1; dayOffset >= 0; dayOffset -= 1) {
    const dayStart = new TZDate(year, month, date - dayOffset, 0, 0, 0, 0, timeZone);
    const dayYear = dayStart.getFullYear();
    const dayMonth = dayStart.getMonth();
    const dayDate = dayStart.getDate();
    const cells: HourlySlot[] = [];

    for (let hour = 0; hour < 24; hour += 1) {
      const start = new TZDate(dayYear, dayMonth, dayDate, hour, 0, 0, 0, timeZone);
      const end = new TZDate(dayYear, dayMonth, dayDate, hour + 1, 0, 0, 0, timeZone);
      cells.push({
        hour,
        start,
        end,
        durationSeconds: Math.max(0, (end.getTime() - start.getTime()) / 1000),
      });
    }

    const key = dateKey(dayStart);
    result.push({
      dateKey: key,
      date: dayStart,
      isToday: key === todayKey,
      cells,
    });
  }

  return result;
}
