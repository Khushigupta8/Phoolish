// Shared by the browser form and the server routes, so it must not touch any
// storage client.
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/avif": "avif",
};

export const ACCEPTED_IMAGE_TYPES = Object.keys(IMAGE_EXTENSIONS);

/**
 * Uploaded photos are stored as the absolute Blob URL that serves them, so the
 * storefront renders the stored value directly. Seed art lives under `/images/`
 * in `public/` and must never be handed to the Blob client for deletion.
 */
export function uploadedImageUrl(path: string): string | null {
  return /^https?:\/\//.test(path.trim()) ? path.trim() : null;
}
