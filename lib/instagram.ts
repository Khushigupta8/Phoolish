import { hasStorageConfigured } from "./env";
import type { InstagramPost } from "./instagram-schema";
import { listInstagramPosts } from "./instagram-store";

/**
 * Photos for the homepage "follow along" grid. Returns an empty list whenever
 * the database is unavailable, and the section hides itself rather than
 * rendering an empty shell.
 */
export async function getInstagramPosts(): Promise<InstagramPost[]> {
  if (!hasStorageConfigured()) return [];
  try {
    return await listInstagramPosts();
  } catch (error) {
    console.error("Could not read the Instagram grid:", error);
    return [];
  }
}
