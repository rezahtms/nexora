import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { axiosInstance } from "@/lib/configs/axios-instance";
import type { HttpMethod, RequestOptions } from "@/lib/types/api.types";
import { ApiError } from "@/lib/utils/api-error";
import { isCanceledError } from "@/lib/utils/is-canceled-error";

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

  try {
    const response = await methodExecutors[options.method]<TResponse, TBody, TParams>(
      options.url,
      config,
      options.body,
    );
    return response.data;
  } catch (error: unknown) {
    if (isCanceledError(error) || error instanceof ApiError) {
      throw error;
    }
    const message = error instanceof Error && error.message ? error.message : "Something went wrong.";
    throw new ApiError(message, 0, null);
  }
}
