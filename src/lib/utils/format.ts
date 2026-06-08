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

type DecimalLike =
  | { toString: () => string; toNumber?: () => number }
  | number
  | string
  | null
  | undefined;

/** Convert Prisma Decimal / numeric fields to a plain number for display or math. */
export function toNumber(value: DecimalLike): number | null {
  if (value == null) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (typeof value === "object") {
    if ("toNumber" in value && typeof value.toNumber === "function") {
      const parsed = value.toNumber();
      return Number.isFinite(parsed) ? parsed : null;
    }
    const parsed = Number(value.toString());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/** Display-safe string for any Prisma Decimal or numeric field. */
export function formatDecimalDisplay(
  value: DecimalLike,
  fallback = "—"
): string {
  const parsed = toNumber(value);
  return parsed == null ? fallback : String(parsed);
}

/** Format bath count (supports half baths from Decimal). */
export function formatBathsDisplay(
  value: DecimalLike,
  fallback = "—"
): string {
  const parsed = toNumber(value);
  if (parsed == null) return fallback;
  return Number.isInteger(parsed)
    ? String(parsed)
    : parsed.toFixed(1).replace(/\.0$/, "");
}

export function formatIntDisplay(
  value: number | null | undefined,
  fallback = "—"
): string {
  if (value == null) return fallback;
  return String(value);
}

export function formatSqftDisplay(
  value: number | null | undefined,
  fallback = "—"
): string {
  if (value == null) return fallback;
  return value.toLocaleString();
}

export function formatHomeDetails(
  beds: number | null | undefined,
  baths: DecimalLike,
  sqft: number | null | undefined
): string {
  const sqftLabel =
    sqft != null ? `${formatSqftDisplay(sqft)} sqft` : "—";
  return `${formatIntDisplay(beds)} bd · ${formatBathsDisplay(baths)} ba · ${sqftLabel}`;
}

/** Form input defaultValue from Prisma Decimal fields. */
export function decimalToInputValue(value: DecimalLike): string {
  const parsed = toNumber(value);
  return parsed == null ? "" : String(parsed);
}
