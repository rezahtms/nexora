export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type RequestOptions<TBody = undefined, TParams = undefined> = {
  method: HttpMethod;
  url: string;
  params?: TParams;
  body?: TBody;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
};

declare module "axios" {
  interface AxiosRequestConfig {
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    successMessage?: string;
  }
}
