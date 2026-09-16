import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <main id="main" className="container page-space" aria-label="Loading">
      <Skeleton className="h-20 w-2/3 mb-10" />
      <div className="product-grid">
        {[1, 2, 3, 4].map((n) => (
          <Skeleton key={n} className="h-80 w-full" />
        ))}
      </div>
    </main>
  );
}
