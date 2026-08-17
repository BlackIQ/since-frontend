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
