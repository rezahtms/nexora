import type { JsonValue } from "@/lib/types/api.types";

export class ApiError extends Error {
  readonly statusCode: number;
  readonly data: JsonValue | null;

  constructor(message: string, statusCode: number, data: JsonValue | null = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

export function toJsonValue(value: unknown): JsonValue | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => toJsonValue(item));
  }
  if (typeof value === "object") {
    const record: { [key: string]: JsonValue } = {};
    Object.entries(value).forEach(([key, entry]) => {
      const serialized = toJsonValue(entry);
      if (serialized !== null || entry === null) {
        record[key] = serialized;
      }
    });
    return record;
  }
  return null;
}
