import { Suspense } from "react";
import { Catalog } from "@/components/store/catalog";
export const metadata = { title: "Your wishlist | Phoolish" };
export default function Page() {
  return (
    <Suspense
      fallback={
        <main id="main" className="container page-space">
          Loading your wishlist…
        </main>
      }
    >
      <Catalog wishlistOnly />
    </Suspense>
  );
}
