import { requireAdmin } from "@/lib/admin-auth";
import { productPatch } from "@/lib/product-schema";
import { deleteProduct, updateProduct } from "@/lib/product-store";
import { uploadedImageUrl } from "@/lib/image-constants";
import { deleteImage } from "@/lib/images";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const parsed = productPatch.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Please check the form.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const updated = await updateProduct(id, parsed.data);
    if (!updated) {
      return Response.json({ error: "No such product." }, { status: 404 });
    }
    return Response.json({ product: updated });
  } catch (error) {
    console.error("Could not update the product.", error);
    return Response.json({ error: "Could not update the product." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;

  try {
    const removed = await deleteProduct(id);
    if (!removed) {
      return Response.json({ error: "No such product." }, { status: 404 });
    }
    // Clean up the uploaded photos this product owned; seed images are shared
    // with the demo catalogue and must stay.
    const urls = [removed.image, ...(removed.images ?? [])]
      .map(uploadedImageUrl)
      .filter((url): url is string => Boolean(url));
    await Promise.all(
      [...new Set(urls)].map((url) =>
        deleteImage(url).catch((error) =>
          console.error(`Left an orphaned image in Blob storage: ${url}`, error)
        )
      )
    );
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Could not delete the product.", error);
    return Response.json({ error: "Could not delete the product." }, { status: 500 });
  }
}
