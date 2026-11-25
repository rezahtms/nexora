import { ApiError } from "@/lib/utils/api-error";

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.statusCode === 404;
}
