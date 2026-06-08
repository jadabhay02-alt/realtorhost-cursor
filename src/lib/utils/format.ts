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

/** Prisma Decimal and other numeric DB values safe for JSX display. */
export type DecimalLike =
  | { toString: () => string; toNumber?: () => number }
  | number
  | string
  | bigint
  | null
  | undefined;

/** Convert Prisma Decimal / numeric fields to a plain number for display or math. */
export function toNumber(value: DecimalLike): number | null {
  if (value == null) return null;
  if (typeof value === "bigint") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
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

/** Always returns a string — safe to render directly in JSX. */
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
  value: DecimalLike,
  fallback = "—"
): string {
  const parsed = toNumber(value);
  return parsed == null ? fallback : String(Math.trunc(parsed));
}

export function formatSqftDisplay(
  value: DecimalLike,
  fallback = "—"
): string {
  const parsed = toNumber(value);
  if (parsed == null) return fallback;
  return Math.trunc(parsed).toLocaleString();
}

/** e.g. "3 bd · 2.5 ba · 1,850 sqft" — always a string for JSX. */
export function formatHomeDetails(
  beds: DecimalLike,
  baths: DecimalLike,
  sqft: DecimalLike
): string {
  const sqftLabel =
    toNumber(sqft) != null
      ? `${formatSqftDisplay(sqft)} sqft`
      : "—";
  return `${formatIntDisplay(beds)} bd · ${formatBathsDisplay(baths)} ba · ${sqftLabel}`;
}

/** Form input defaultValue from Prisma Decimal fields. */
export function decimalToInputValue(value: DecimalLike): string {
  return formatDecimalDisplay(value, "");
}
