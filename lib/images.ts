import { getBucket } from "./bindings";
import { IMAGE_EXTENSIONS, MAX_IMAGE_BYTES } from "./image-constants";

export async function putImage(file: File): Promise<string> {
  const extension = IMAGE_EXTENSIONS[file.type];
  if (!extension) {
    throw new Error("Use a WebP, JPEG, PNG or AVIF image.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("That image is larger than 5 MB.");
  }
  const key = `products/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
  await getBucket().put(key, await file.arrayBuffer(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
  return key;
}

export async function deleteImage(key: string): Promise<void> {
  await getBucket().delete(key);
}
