import { Suspense } from "react";
import { Catalog } from "@/components/store/catalog";
export const metadata = { title: "Shop little things | Phoolish" };
export default function Page() {
  return (
    <Suspense
      fallback={
        <main id="main" className="container page-space">
          Loading your little finds…
        </main>
      }
    >
      <Catalog />
    </Suspense>
  );
}
