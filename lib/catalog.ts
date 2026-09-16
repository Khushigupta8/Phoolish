import { products as seedProducts, type Product } from "@/data/products";
import { hasStorageBindings } from "./bindings";
import { listAdminProducts } from "./product-store";

/**
 * The catalogue the storefront renders: the demo seed in `data/products.ts`
 * plus anything added through /admin. An uploaded product that reuses a seed
 * id replaces it, so the admin page can also correct a demo entry.
 *
 * Falls back to the seed alone whenever the database is unavailable — that is
 * the normal state under plain `next dev`, and it keeps the shop rendering if
 * D1 is briefly unreachable in production.
 */
export async function getCatalog(): Promise<Product[]> {
  if (!hasStorageBindings()) return seedProducts;
  let uploaded: Product[] = [];
  try {
    uploaded = await listAdminProducts();
  } catch (error) {
    console.error("Falling back to the seed catalogue:", error);
    return seedProducts;
  }
  const byId = new Map(seedProducts.map((p) => [p.id, p]));
  for (const product of uploaded) byId.set(product.id, product);
  return [...byId.values()].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function getCatalogProduct(id: string): Promise<Product | null> {
  return (await getCatalog()).find((p) => p.id === id) ?? null;
}
