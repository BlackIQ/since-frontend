import axios, { AxiosInstance } from "axios";
import { store } from "@/redux/store";
import { clearToken } from "@/redux/slices/token.slice";
import { clearUser } from "@/redux/slices/user.slice";

export const API: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://since.amirhossein.info",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = store.getState().token.token?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearToken());
      store.dispatch(clearUser());
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/auth"
      ) {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  },
);
