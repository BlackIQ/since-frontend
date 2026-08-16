import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Token } from "@/types/common";

export interface TokenState {
  token: Token | null;
}

const initialState: TokenState = {
  token: null,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<Token>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
});

export const { setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
