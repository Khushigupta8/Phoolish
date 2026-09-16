import { requireAdmin } from "@/lib/admin-auth";
import {
  MAX_INSTAGRAM_POSTS,
  instagramInput,
} from "@/lib/instagram-schema";
import {
  createInstagramPost,
  listInstagramPosts,
} from "@/lib/instagram-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    return Response.json({ posts: await listInstagramPosts() });
  } catch (error) {
    console.error("Could not read the Instagram grid.", error);
    return Response.json(
      { error: "Could not read the Instagram grid." },
      { status: 500 }
    );
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

  const parsed = instagramInput.safeParse(body);
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
    const existing = await listInstagramPosts();
    if (existing.length >= MAX_INSTAGRAM_POSTS) {
      return Response.json(
        {
          error: `The grid holds ${MAX_INSTAGRAM_POSTS} photos. Remove one first.`,
        },
        { status: 409 }
      );
    }
    return Response.json(
      { post: await createInstagramPost(parsed.data) },
      { status: 201 }
    );
  } catch (error) {
    console.error("Could not save the photo.", error);
    return Response.json({ error: "Could not save the photo." }, { status: 500 });
  }
}
