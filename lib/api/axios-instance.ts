import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

export type ApiError = {
  message: string;
  status: number | undefined;
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://dummyjson.com",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const normalizedError: ApiError = {
      message: error.response?.data?.message ?? error.message ?? "The request failed.",
      status: error.response?.status,
    };
    return Promise.reject(normalizedError);
  },
);

export async function customInstance<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config);
  return response.data;
}
