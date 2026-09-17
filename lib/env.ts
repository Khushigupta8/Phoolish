/**
 * Every value the server needs comes from the process environment. On Vercel
 * the storage integrations inject their own variables (`DATABASE_URL` from
 * Neon, `BLOB_READ_WRITE_TOKEN` from Blob); locally they come from `.env.local`.
 */
export function readEnv(name: string): string | undefined {
  const value = typeof process !== "undefined" ? process.env?.[name] : undefined;
  return value && value.length > 0 ? value : undefined;
}

/** Vercel's Neon integration sets `DATABASE_URL`; older Postgres stores set `POSTGRES_URL`. */
export function databaseUrl(): string | undefined {
  return readEnv("DATABASE_URL") ?? readEnv("POSTGRES_URL");
}

export function blobToken(): string | undefined {
  return readEnv("BLOB_READ_WRITE_TOKEN");
}

/** True when both stores are configured, so the admin page can actually save. */
export function hasStorageConfigured(): boolean {
  return Boolean(databaseUrl() && blobToken());
}
