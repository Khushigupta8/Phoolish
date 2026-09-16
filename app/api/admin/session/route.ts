import { adminPasswordConfigured, isAuthenticated } from "@/lib/admin-auth";
import { hasStorageBindings } from "@/lib/bindings";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return Response.json({
    authenticated: await isAuthenticated(request),
    passwordConfigured: adminPasswordConfigured(),
    storageReady: hasStorageBindings(),
  });
}
