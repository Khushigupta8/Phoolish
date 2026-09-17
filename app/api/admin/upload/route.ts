import { requireAdmin } from "@/lib/admin-auth";
import { MAX_IMAGE_BYTES } from "@/lib/image-constants";
import { putImage } from "@/lib/images";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  let file: File | null = null;
  try {
    const form = await request.formData();
    const value = form.get("file");
    if (value instanceof File) file = value;
  } catch {
    return Response.json(
      { error: "Expected a multipart form with a `file` field." },
      { status: 400 }
    );
  }

  if (!file || file.size === 0) {
    return Response.json({ error: "Choose an image to upload." }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return Response.json({ error: "That image is larger than 5 MB." }, { status: 413 });
  }

  try {
    // `path` is the public Blob URL; the admin form stores it on the product.
    const path = await putImage(file);
    return Response.json({ key: path, path }, { status: 201 });
  } catch (error) {
    console.error("Image upload failed.", error);
    const message = error instanceof Error ? error.message : "Image upload failed.";
    return Response.json({ error: message }, { status: 500 });
  }
}
