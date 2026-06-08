/** Safe enum/string display — never call .replace on undefined. */
export function formatEnum(
  value?: string | null,
  fallback = "Unknown"
): string {
  if (!value || typeof value !== "string") return fallback;
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function titleCase(value?: string | null, fallback = "Unknown"): string {
  return formatEnum(value, fallback);
}
