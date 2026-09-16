import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { instagramPosts, type InstagramPostRow } from "@/db/schema";
import type {
  InstagramInput,
  InstagramPatch,
  InstagramPost,
} from "./instagram-schema";

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  schemaReady ??= (async () => {
    await getDb().run(sql`
      CREATE TABLE IF NOT EXISTS instagram_posts (
        id TEXT PRIMARY KEY NOT NULL,
        image TEXT NOT NULL,
        caption TEXT,
        link TEXT,
        position INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      )
    `);
  })().catch((error) => {
    schemaReady = null;
    throw error;
  });
  return schemaReady;
}

function rowToPost(row: InstagramPostRow): InstagramPost {
  return {
    id: row.id,
    image: row.image,
    caption: row.caption ?? "",
    link: row.link ?? "",
    position: row.position,
  };
}

export async function listInstagramPosts(): Promise<InstagramPost[]> {
  await ensureSchema();
  const rows = await getDb()
    .select()
    .from(instagramPosts)
    .orderBy(asc(instagramPosts.position), asc(instagramPosts.createdAt));
  return rows.map(rowToPost);
}

export async function createInstagramPost(
  input: InstagramInput
): Promise<InstagramPost> {
  await ensureSchema();
  const existing = await listInstagramPosts();
  const id = crypto.randomUUID();
  const row = {
    id,
    image: input.image,
    caption: input.caption ? input.caption : null,
    link: input.link ? input.link : null,
    // New photos go to the end of the grid.
    position: existing.length,
    createdAt: new Date().toISOString(),
  };
  await getDb().insert(instagramPosts).values(row);
  return rowToPost(row as InstagramPostRow);
}

export async function updateInstagramPost(
  id: string,
  patch: InstagramPatch
): Promise<InstagramPost | null> {
  await ensureSchema();
  const values: Partial<InstagramPostRow> = {};
  if (patch.caption !== undefined) values.caption = patch.caption || null;
  if (patch.link !== undefined) values.link = patch.link || null;
  if (patch.position !== undefined) values.position = patch.position;
  if (Object.keys(values).length > 0) {
    await getDb()
      .update(instagramPosts)
      .set(values)
      .where(eq(instagramPosts.id, id));
  }
  const rows = await getDb()
    .select()
    .from(instagramPosts)
    .where(eq(instagramPosts.id, id))
    .limit(1);
  return rows[0] ? rowToPost(rows[0]) : null;
}

export async function deleteInstagramPost(
  id: string
): Promise<InstagramPost | null> {
  await ensureSchema();
  const rows = await getDb()
    .select()
    .from(instagramPosts)
    .where(eq(instagramPosts.id, id))
    .limit(1);
  if (!rows[0]) return null;
  await getDb().delete(instagramPosts).where(eq(instagramPosts.id, id));
  return rowToPost(rows[0]);
}
