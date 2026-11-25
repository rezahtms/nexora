import axios from "axios";

export function isCanceledError(error: unknown): boolean {
  if (axios.isCancel(error)) return true;
  if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") return true;
  if (error instanceof Error && (error.name === "AbortError" || error.name === "CanceledError")) {
    return true;
  }
  return false;
}
