import { PeriodRead } from "@/types/period.type";

export type StatusType = "active" | "completed";
export type VisibilityType = "private" | "public";

export interface CounterCreate {
  title: string;
  description: string;
  started_at: string;
}

export interface CounterUpdate {
  title?: string;
  description?: string;
  status?: StatusType;
  visibility?: VisibilityType;
}

export interface CounterRead {
  id: string;
  title: string;
  description: string;
  status: StatusType;
  visibility: VisibilityType;
  periods: PeriodRead[];
  created_at: string;
  updated_at: string;
}

export interface PublicCounterRead {
  id: string;
  title: string;
  description: string;
  started_at: string;
  ended_at: string | null;
  status: StatusType;
}
