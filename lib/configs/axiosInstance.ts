import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL, API_TIMEOUT_MS } from "@/lib/constants/config";
import "@/lib/types/api.types";
import { ApiError, toJsonValue } from "@/lib/utils/apiError";
import { isCanceledError } from "@/lib/utils/isCanceledError";
import {
  extractResponseMessage,
  getDefaultErrorMessage,
  getDefaultSuccessMessage,
  getErrorToastId,
  getSuccessToastId,
} from "@/lib/utils/toastMessages";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.response.use(
  (response) => {
    const method = (response.config.method ?? "get").toLowerCase();
    const shouldShowSuccessToast = response.config.showSuccessToast ?? method !== "get";
    if (shouldShowSuccessToast && typeof window !== "undefined") {
      const message =
        response.config.successMessage ??
        extractResponseMessage(response.data) ??
        getDefaultSuccessMessage(response.status, method);
      toast.success(message, { id: getSuccessToastId(response.status, method) });
    }
    return response;
  },
  (error: unknown) => {
    if (isCanceledError(error)) {
      return Promise.reject(error);
    }
    if (axios.isAxiosError(error)) {
      const method = (error.config?.method ?? "get").toLowerCase();
      const shouldShowErrorToast = error.config?.showErrorToast ?? method !== "get";
      const statusCode = error.response?.status ?? 0;
      const message =
        extractResponseMessage(error.response?.data) ??
        getDefaultErrorMessage(statusCode, error.code);
      if (shouldShowErrorToast && typeof window !== "undefined") {
        toast.error(message, { id: getErrorToastId(statusCode, error.code) });
      }
      return Promise.reject(new ApiError(message, statusCode, toJsonValue(error.response?.data)));
    }
    const fallbackMessage =
      error instanceof Error && error.message ? error.message : getDefaultErrorMessage(0);
    return Promise.reject(new ApiError(fallbackMessage, 0, null));
  },
);
