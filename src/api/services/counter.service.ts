import { API } from "@/api";
import URLs from "@/api/urls";
import {
  CounterCreate,
  CounterRead,
  CounterUpdate,
  PublicCounterRead,
} from "@/types/counter.type";

const { counter } = URLs;

export const allCounters = async (): Promise<CounterRead[]> => {
  const response = await API.get<CounterRead[]>(counter);
  return response.data;
};

export const getCounter = async (id: string): Promise<CounterRead> => {
  const response = await API.get<CounterRead>(`${counter}/${id}`);
  return response.data;
};

export const createCounter = async (
  data: CounterCreate,
): Promise<CounterRead> => {
  const response = await API.post<CounterRead>(counter, data);
  return response.data;
};

export const updateCounter = async (
  id: string,
  data: CounterUpdate,
): Promise<CounterRead> => {
  const response = await API.patch<CounterRead>(`${counter}/${id}`, data);
  return response.data;
};

export const deleteCounter = async (id: string): Promise<void> => {
  await API.delete(`${counter}/${id}`);
};

export const restartCounter = async (id: string): Promise<CounterRead> => {
  const response = await API.post<CounterRead>(`${counter}/${id}/restart`);

  return response.data;
};

export const completeCounter = async (id: string): Promise<CounterRead> => {
  const response = await API.post<CounterRead>(`${counter}/${id}/complete`);

  return response.data;
};

export const getPublicCounter = async (
  id: string,
): Promise<PublicCounterRead> => {
  const response = await API.get<PublicCounterRead>(`${counter}/${id}/public`);

  return response.data;
};
