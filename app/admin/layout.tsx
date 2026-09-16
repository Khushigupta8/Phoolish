import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product admin | Phoolish",
  // Keep the shopkeeper's tools out of search results.
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // `.admin-root` also hides the storefront chrome from the root layout; see
  // the admin block in app/globals.css.
  return (
    <main id="main" className="admin-root">
      {children}
    </main>
  );
}
