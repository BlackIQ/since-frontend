import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { loadState, saveState } from "./loadstore";
import tokenReducer from "@/redux/slices/token.slice";
import userReducer from "@/redux/slices/user.slice";

const rootReducer = combineReducers({
  token: tokenReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState() as Partial<RootState> | undefined,
});

store.subscribe(() => {
  saveState({
    token: store.getState().token,
    user: store.getState().user,
  });
});

export type AppDispatch = typeof store.dispatch;
