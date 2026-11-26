import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { axiosInstance } from "@/lib/configs/axiosInstance";
import type { HttpMethod, RequestOptions } from "@/lib/types/api.types";
import { ApiError } from "@/lib/utils/apiError";
import { isCanceledError } from "@/lib/utils/isCanceledError";

type MethodExecutor = <TResponse, TBody, TParams>(
  url: string,
  config: AxiosRequestConfig<TBody, TParams>,
  body?: TBody,
) => Promise<AxiosResponse<TResponse>>;

const methodExecutors: Record<HttpMethod, MethodExecutor> = {
  get: (url, config) => axiosInstance.get(url, config),
  post: (url, config, body) => axiosInstance.post(url, body, config),
  put: (url, config, body) => axiosInstance.put(url, body, config),
  patch: (url, config, body) => axiosInstance.patch(url, body, config),
  delete: (url, config, body) =>
    axiosInstance.delete(url, body !== undefined ? { ...config, data: body } : config),
};

export async function sendRequest<
  TResponse,
  TBody = undefined,
  TParams = undefined,
>(options: RequestOptions<TBody, TParams>): Promise<TResponse> {
  const isMutation = options.method !== "get";
  const config: AxiosRequestConfig<TBody, TParams> = {
    params: options.params,
    signal: options.signal,
    headers: options.headers,
    showSuccessToast: options.showSuccessToast ?? isMutation,
    showErrorToast: options.showErrorToast ?? isMutation,
    successMessage: options.successMessage,
  };

  const maxAttempts = isMutation ? 1 : 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await methodExecutors[options.method]<TResponse, TBody, TParams>(
        options.url,
        config,
        options.body,
      );
      return response.data;
    } catch (error: unknown) {
      if (isCanceledError(error)) {
        throw error;
      }

      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError(
              error instanceof Error && error.message ? error.message : "Something went wrong.",
              0,
              null,
            );

      const shouldRetry = !isMutation && apiError.statusCode === 0 && attempt < maxAttempts;
      if (shouldRetry) {
        continue;
      }

      throw apiError;
    }
  }

  throw new ApiError("Something went wrong.", 0, null);
}
