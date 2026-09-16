// Shared by the browser form and the server routes, so it must not touch any
// Cloudflare binding.
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/avif": "avif",
};

export const ACCEPTED_IMAGE_TYPES = Object.keys(IMAGE_EXTENSIONS);

/** Public path the storefront uses; served back by /api/images/[...key]. */
export function publicImagePath(key: string): string {
  return `/api/images/${key}`;
}

/** Reverses `publicImagePath`; returns null for seed images under /images/. */
export function imageKeyFromPath(path: string): string | null {
  return path.startsWith("/api/images/")
    ? path.slice("/api/images/".length)
    : null;
}
