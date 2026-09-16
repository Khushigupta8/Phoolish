import { getCatalog } from "@/lib/catalog";

// Public: the storefront reads this to pick up products added through /admin.
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    { products: await getCatalog() },
    { headers: { "cache-control": "no-store" } }
  );
}
