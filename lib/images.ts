import { del, put } from "@vercel/blob";
import { blobToken } from "./env";
import { IMAGE_EXTENSIONS, MAX_IMAGE_BYTES } from "./image-constants";

function token(): string {
  const value = blobToken();
  if (!value) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Add a Blob store to the Vercel project (Storage -> Blob), which sets it automatically, then redeploy."
    );
  }
  return value;
}

/** Uploads a photo and returns its public Blob URL, which is what gets stored. */
export async function putImage(file: File): Promise<string> {
  const extension = IMAGE_EXTENSIONS[file.type];
  if (!extension) {
    throw new Error("Use a WebP, JPEG, PNG or AVIF image.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("That image is larger than 5 MB.");
  }
  const pathname = `products/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
  // The pathname is already unique, and a stable one keeps the stored URL
  // predictable; Blob would otherwise append a random suffix of its own.
  const { url } = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type,
    cacheControlMaxAge: 31536000,
    token: token(),
  });
  return url;
}

export async function deleteImage(url: string): Promise<void> {
  await del(url, { token: token() });
}
