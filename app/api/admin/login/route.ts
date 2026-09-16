import {
  adminPasswordConfigured,
  checkPassword,
  createSessionCookie,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!adminPasswordConfigured()) {
    return Response.json(
      {
        error:
          "ADMIN_PASSWORD is not set. Add it to `.dev.vars` locally, or to the Worker's secrets once deployed.",
      },
      { status: 503 }
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  if (!checkPassword(password)) {
    // A small, constant pause blunts password guessing without a rate-limit store.
    await new Promise((resolve) => setTimeout(resolve, 400));
    return Response.json({ error: "That password did not match." }, { status: 401 });
  }

  return Response.json(
    { ok: true },
    { headers: { "set-cookie": await createSessionCookie() } }
  );
}
