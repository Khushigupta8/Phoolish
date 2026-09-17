import { requireAdmin } from "@/lib/admin-auth";
import { instagramPatch } from "@/lib/instagram-schema";
import {
  deleteInstagramPost,
  updateInstagramPost,
} from "@/lib/instagram-store";
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

  const parsed = instagramPatch.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Please check the form.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  try {
    const post = await updateInstagramPost(id, parsed.data);
    if (!post) return Response.json({ error: "No such photo." }, { status: 404 });
    return Response.json({ post });
  } catch (error) {
    console.error("Could not update the photo.", error);
    return Response.json({ error: "Could not update the photo." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const { id } = await params;

  try {
    const removed = await deleteInstagramPost(id);
    if (!removed) {
      return Response.json({ error: "No such photo." }, { status: 404 });
    }
    const url = uploadedImageUrl(removed.image);
    if (url) {
      await deleteImage(url).catch((error) =>
        console.error(`Left an orphaned image in Blob storage: ${url}`, error)
      );
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Could not remove the photo.", error);
    return Response.json({ error: "Could not remove the photo." }, { status: 500 });
  }
}
