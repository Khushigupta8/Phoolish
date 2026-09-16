import { getBucket } from "@/lib/bindings";

// Public: this is how uploaded product photos reach shoppers.
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const objectKey = key.join("/");
  if (!objectKey.startsWith("products/")) {
    return new Response("Not found", { status: 404 });
  }

  let object: R2ObjectBody | null = null;
  try {
    object = await getBucket().get(objectKey);
  } catch (error) {
    console.error("Could not read the image bucket.", error);
    return new Response("Image storage is unavailable", { status: 503 });
  }
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}
