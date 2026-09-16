import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { adminProducts, type AdminProductRow } from "@/db/schema";
import type { Category, Product } from "@/data/products";
import type { ProductInput, ProductPatch } from "./product-schema";

let schemaReady: Promise<void> | null = null;

/**
 * Creates the table on first use. D1 has no migration step in local dev, and a
 * single-table `IF NOT EXISTS` keeps `pnpm dev` working with no setup. The
 * generated migration in `drizzle/` is what you apply to a real database.
 */
function ensureSchema(): Promise<void> {
  schemaReady ??= (async () => {
    await getDb().run(sql`
      CREATE TABLE IF NOT EXISTS admin_products (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL,
        images TEXT NOT NULL DEFAULT '[]',
        badge TEXT,
        description TEXT NOT NULL,
        material TEXT NOT NULL,
        size TEXT NOT NULL,
        care TEXT NOT NULL,
        variants TEXT NOT NULL DEFAULT '[]',
        stock INTEGER NOT NULL DEFAULT 0,
        personalised INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
  })().catch((error) => {
    // Never cache a failed attempt; the next request should try again.
    schemaReady = null;
    throw error;
  });
  return schemaReady;
}

function parseList(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function rowToProduct(row: AdminProductRow): Product {
  const images = parseList(row.images);
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    category: row.category as Category,
    image: row.image,
    ...(images.length > 0 ? { images } : {}),
    ...(row.badge ? { badge: row.badge } : {}),
    description: row.description,
    material: row.material,
    size: row.size,
    care: row.care,
    variants: parseList(row.variants),
    stock: row.stock,
    ...(row.personalised ? { personalised: true } : {}),
    createdAt: row.createdAt.slice(0, 10),
  };
}

export async function listAdminProducts(): Promise<Product[]> {
  await ensureSchema();
  const rows = await getDb()
    .select()
    .from(adminProducts)
    .orderBy(desc(adminProducts.createdAt));
  return rows.map(rowToProduct);
}

export async function getAdminProduct(id: string): Promise<Product | null> {
  await ensureSchema();
  const rows = await getDb()
    .select()
    .from(adminProducts)
    .where(eq(adminProducts.id, id))
    .limit(1);
  return rows[0] ? rowToProduct(rows[0]) : null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  await ensureSchema();
  const now = new Date().toISOString();
  await getDb()
    .insert(adminProducts)
    .values({
      id: input.id,
      name: input.name,
      price: input.price,
      category: input.category,
      image: input.image,
      images: JSON.stringify(input.images ?? []),
      badge: input.badge ? input.badge : null,
      description: input.description,
      material: input.material,
      size: input.size,
      care: input.care,
      variants: JSON.stringify(input.variants ?? []),
      stock: input.stock,
      personalised: input.personalised ? 1 : 0,
      createdAt: now,
      updatedAt: now,
    });
  const created = await getAdminProduct(input.id);
  if (!created) throw new Error("The product was not saved.");
  return created;
}

export async function updateProduct(
  id: string,
  patch: ProductPatch
): Promise<Product | null> {
  await ensureSchema();
  const existing = await getAdminProduct(id);
  if (!existing) return null;

  const values: Partial<AdminProductRow> = { updatedAt: new Date().toISOString() };
  if (patch.name !== undefined) values.name = patch.name;
  if (patch.price !== undefined) values.price = patch.price;
  if (patch.category !== undefined) values.category = patch.category;
  if (patch.image !== undefined) values.image = patch.image;
  if (patch.images !== undefined) values.images = JSON.stringify(patch.images);
  if (patch.badge !== undefined) values.badge = patch.badge ? patch.badge : null;
  if (patch.description !== undefined) values.description = patch.description;
  if (patch.material !== undefined) values.material = patch.material;
  if (patch.size !== undefined) values.size = patch.size;
  if (patch.care !== undefined) values.care = patch.care;
  if (patch.variants !== undefined) values.variants = JSON.stringify(patch.variants);
  if (patch.stock !== undefined) values.stock = patch.stock;
  if (patch.personalised !== undefined) {
    values.personalised = patch.personalised ? 1 : 0;
  }

  await getDb().update(adminProducts).set(values).where(eq(adminProducts.id, id));
  return getAdminProduct(id);
}

export async function deleteProduct(id: string): Promise<Product | null> {
  await ensureSchema();
  const existing = await getAdminProduct(id);
  if (!existing) return null;
  await getDb().delete(adminProducts).where(eq(adminProducts.id, id));
  return existing;
}
