import { env } from "cloudflare:workers";

/**
 * Reads a configuration value. Under the Workers runtime these come from the
 * `vars` block in the Wrangler config or from `.dev.vars` locally; the
 * `process.env` fallback covers the plain Node path.
 */
export function readEnv(name: string): string | undefined {
  const fromWorker = (env as Record<string, unknown>)[name];
  if (typeof fromWorker === "string" && fromWorker.length > 0) return fromWorker;
  const fromNode =
    typeof process !== "undefined" ? process.env?.[name] : undefined;
  return fromNode && fromNode.length > 0 ? fromNode : undefined;
}

/** True when the Cloudflare bindings this feature needs are actually present. */
export function hasStorageBindings(): boolean {
  const bindings = env as Cloudflare.Env;
  return Boolean(bindings.DB && bindings.BUCKET);
}

export function getBucket(): R2Bucket {
  const bucket = (env as Cloudflare.Env).BUCKET;
  if (!bucket) {
    throw new Error(
      "Cloudflare R2 binding `BUCKET` is unavailable. Set the `r2` field in .openai/hosting.json to `BUCKET` and run the site with `pnpm dev` or `pnpm build && pnpm start`."
    );
  }
  return bucket;
}
