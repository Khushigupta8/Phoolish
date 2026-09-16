import { requireAdmin } from "@/lib/admin-auth";
import { productInput } from "@/lib/product-schema";
import {
  createProduct,
  getAdminProduct,
  listAdminProducts,
} from "@/lib/product-store";
import { products as seedProducts } from "@/data/products";

export const dynamic = "force-dynamic";

function failed(error: unknown, fallback: string) {
  console.error(fallback, error);
  const message = error instanceof Error ? error.message : fallback;
  return Response.json({ error: message }, { status: 500 });
}

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    return Response.json({ products: await listAdminProducts() });
  } catch (error) {
    return failed(error, "Could not read the product list.");
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const parsed = productInput.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Please check the form.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { id } = parsed.data;
  try {
    if (seedProducts.some((p) => p.id === id)) {
      return Response.json(
        { error: `"${id}" is used by a demo product. Pick another slug.` },
        { status: 409 }
      );
    }
    if (await getAdminProduct(id)) {
      return Response.json(
        { error: `"${id}" already exists. Edit it instead, or pick another slug.` },
        { status: 409 }
      );
    }
    return Response.json({ product: await createProduct(parsed.data) }, { status: 201 });
  } catch (error) {
    return failed(error, "Could not save the product.");
  }
}
