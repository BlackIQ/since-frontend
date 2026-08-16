import { isAxiosError } from "axios";
import toast, { ToastOptions } from "react-hot-toast";

const formatValidationMessage = (detail: unknown): string | null => {
  if (typeof detail === "string" && detail.trim()) {
    return detail.trim();
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item === "string") {
          return item.trim();
        }

        if (item && typeof item === "object") {
          if ("msg" in item && typeof item.msg === "string") {
            return item.msg.replace(/^Value error,\s*/i, "").trim();
          }

          if ("message" in item && typeof item.message === "string") {
            return item.message.trim();
          }
        }

        return null;
      })
      .filter((message): message is string => Boolean(message));

    if (messages.length) {
      return messages.join(" ");
    }
  }

  if (detail && typeof detail === "object") {
    if ("msg" in detail && typeof detail.msg === "string") {
      return detail.msg.replace(/^Value error,\s*/i, "").trim();
    }

    if ("message" in detail && typeof detail.message === "string") {
      return detail.message.trim();
    }
  }

  return null;
};

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: "bottom-right",
  style: {
    borderRadius: "8px",
    background: "#FFFFFF",
    color: "#171717",
    fontSize: "0.875rem",
    boxShadow: "0 4px 16px rgba(23, 23, 23, 0.08)",
    border: "1px solid #E5E2DC",
    padding: "12px 14px",
  },
};

const baseStyle = (accentColor: string) => ({
  ...defaultOptions.style,
  borderLeft: `4px solid ${accentColor}`,
});

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) => {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    const formattedDetail = formatValidationMessage(detail);

    if (formattedDetail) {
      return formattedDetail;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

export const showToast = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, {
      ...defaultOptions,
      style: baseStyle("#4D7C5F"),
      ...options,
    }),

  error: (message: string, options?: ToastOptions) =>
    toast.error(message, {
      ...defaultOptions,
      style: baseStyle("#B85450"),
      ...options,
    }),

  info: (message: string, options?: ToastOptions) =>
    toast(message, {
      ...defaultOptions,
      style: baseStyle("#737373"),
      ...options,
    }),

  warning: (message: string, options?: ToastOptions) =>
    toast(message, {
      ...defaultOptions,
      style: baseStyle("#C9825B"),
      ...options,
    }),

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
  ) =>
    toast.promise(promise, messages, {
      ...defaultOptions,
    }),
};
