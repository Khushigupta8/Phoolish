import { Suspense } from "react";
import { notFound } from "next/navigation";
import { collections } from "@/data/products";
import { Catalog } from "@/components/store/catalog";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = collections.find((c) => c.slug === slug);
  return {
    title: `${c?.name ?? "Collection"} | Phoolish`,
    description: c?.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!collections.some((c) => c.slug === slug)) notFound();
  return (
    <Suspense
      fallback={
        <main id="main" className="container page-space">
          Loading the collection…
        </main>
      }
    >
      <Catalog collectionSlug={slug} />
    </Suspense>
  );
}
