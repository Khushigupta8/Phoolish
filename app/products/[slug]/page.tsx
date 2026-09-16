import { notFound } from "next/navigation";
import { getCatalogProduct } from "@/lib/catalog";
import { ProductDetail } from "@/components/store/product-detail";

// Rendered per request: products added or edited through /admin have to show up
// without a rebuild, so this route is no longer prerendered from the seed.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getCatalogProduct(slug);
  return {
    title: `${p?.name ?? "Product"} | Phoolish`,
    description: p?.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) notFound();
  return <ProductDetail key={product.id} product={product} />;
}
