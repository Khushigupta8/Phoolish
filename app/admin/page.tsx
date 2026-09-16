import { AdminApp } from "@/components/admin/admin-app";

// The session lives in a cookie the API routes verify, so this page is never
// prerendered with a signed-in view.
export const dynamic = "force-dynamic";

export default function Page() {
  return <AdminApp />;
}
