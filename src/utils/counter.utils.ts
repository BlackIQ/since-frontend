import { differenceInSeconds } from "date-fns";
import { CounterRead } from "@/types/counter.type";
import { PeriodRead } from "@/types/period.type";

export function getCurrentPeriod(counter: CounterRead): PeriodRead | null {
  if (!counter.periods?.length) return null;

  const open = counter.periods.find((p) => p.ended_at === null);

  if (open) return open;

  return [...counter.periods].sort(
    (a, b) =>
      new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
  )[0];
}

export function getSortedPeriods(counter: CounterRead): PeriodRead[] {
  if (!counter.periods?.length) return [];

  return [...counter.periods].sort(
    (a, b) =>
      new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
  );
}

export function getElapsedTime(startedAt: string, endedAt?: string | null) {
  const start = new Date(startedAt);

  if (!Number.isFinite(start.getTime())) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
    };
  }

  const end = endedAt ? new Date(endedAt) : new Date();

  const totalSeconds = Math.max(0, differenceInSeconds(end, start));

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
  };
}
