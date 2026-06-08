const PLACEHOLDER_PATTERN = /\[ref\]|\[password\]|\[region\]|\[YOUR-|\[INSERT/i;

export function getDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL?.trim();
  if (!url || PLACEHOLDER_PATTERN.test(url)) {
    return undefined;
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
      return undefined;
    }
    return url;
  } catch {
    return undefined;
  }
}

export function isDatabaseConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}
