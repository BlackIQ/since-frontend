import type { RootState } from "./store";

const KEY = "openhubble_metrics_state";

export const loadState = (): Partial<RootState> | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }
  try {
    const serializedState = localStorage.getItem(KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as Partial<RootState>;
  } catch (error) {
    console.error("Failed to load state from localStorage:", error);
    return undefined;
  }
};

export const saveState = (state: Partial<RootState>) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(KEY, serializedState);
  } catch (error) {
    console.error("Failed to save state to localStorage:", error);
  }
};

export const clearState = () => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.removeItem(KEY);
  } catch (error) {
    console.error("Failed to clear localStorage state:", error);
  }
};
