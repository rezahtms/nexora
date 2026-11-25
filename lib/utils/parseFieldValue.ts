export function parseFieldValue(
  value: string,
  valueType: "string" | "number",
): string | number {
  if (valueType === "number") {
    if (value === "") {
      return 0;
    }
    return Number(value);
  }
  return value;
}
