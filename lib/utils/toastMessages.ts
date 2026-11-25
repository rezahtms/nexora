export function extractResponseMessage(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null) return undefined;
  if (!("message" in data)) return undefined;
  if (typeof data.message !== "string") return undefined;
  const trimmed = data.message.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getDefaultSuccessMessage(statusCode: number, method?: string): string {
  const normalizedMethod = (method ?? "").toLowerCase();
  if (statusCode === 201) return "Created successfully";
  if ((statusCode === 200 || statusCode === 204) && normalizedMethod === "delete") {
    return "Deleted successfully";
  }
  if (statusCode === 200 && (normalizedMethod === "put" || normalizedMethod === "patch")) {
    return "Updated successfully";
  }
  return "Done successfully";
}

export function getDefaultErrorMessage(statusCode: number, code?: string): string {
  if (code === "ECONNABORTED") return "Request timed out. Please try again.";
  if (statusCode === 0 || code === "ERR_NETWORK") {
    return "Network error. Please check your connection.";
  }
  if (statusCode === 400) return "Invalid request.";
  if (statusCode === 401) return "Your session has expired.";
  if (statusCode === 403) return "You do not have permission to do this.";
  if (statusCode === 404) return "Resource not found.";
  if (statusCode === 408) return "Request timed out.";
  if (statusCode === 429) return "Too many requests. Please slow down.";
  if (statusCode >= 500 && statusCode < 600) return "Server error. Please try again later.";
  return "Something went wrong.";
}

export function getSuccessToastId(statusCode: number, method?: string): string {
  const normalizedMethod = (method ?? "request").toLowerCase();
  return `api-success-${normalizedMethod}-${statusCode}`;
}

export function getErrorToastId(statusCode: number, code?: string): string {
  if (code === "ECONNABORTED") return "api-error-timeout";
  if (statusCode === 0 || code === "ERR_NETWORK") return "api-error-network";
  if (statusCode >= 500 && statusCode < 600) return "api-error-5xx";
  return `api-error-${statusCode}`;
}
