// Stand-in for the `cloudflare:workers` built-in module so that the plain
// `next dev` / `next build` path still compiles. There are no bindings in that
// runtime, so every binding reads as `undefined` and callers fall back to the
// static catalogue in `data/products.ts`.
export const env: Record<string, unknown> = {};
