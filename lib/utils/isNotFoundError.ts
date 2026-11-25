import { ApiError } from "@/lib/utils/apiError";

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.statusCode === 404;
}
