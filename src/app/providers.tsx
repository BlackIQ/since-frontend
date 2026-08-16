"use client";

import type { ReactNode } from "react";

import { Provider } from "react-redux";

import { CssBaseline, ThemeProvider } from "@mui/material";

import { store } from "@/redux/store";
import { theme } from "@/theme";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
