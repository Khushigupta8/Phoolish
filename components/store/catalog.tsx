"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, Heart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import {
  categories,
  collections,
  collectionIncludes,
  money,
  type Product,
} from "@/data/products";
import { ProductCard } from "./product-card";
import { useStore } from "./store-provider";
function CatalogFilters({
  prefix,
  selected,
  setSelected,
  range,
  setRange,
  reset,
  collection,
  items,
}: {
  prefix: string;
  selected: string[];
  setSelected: (v: string[]) => void;
  range: number[];
  setRange: (v: number[]) => void;
  reset: () => void;
  collection?: (typeof collections)[number];
  items: Product[];
}) {
  return (
    <div className="filter-content">
      <div className="filter-title">
        <h3>Filter your finds</h3>
        <button className="text-link" onClick={reset}>
          Clear all
        </button>
      </div>
      <fieldset>
        <legend>Category</legend>
        {categories.map((c) => (
          <label
            className="check-label"
            htmlFor={`${prefix}-${c.slug}`}
            key={c.slug}
          >
            <Checkbox
              id={`${prefix}-${c.slug}`}
              checked={selected.includes(c.name)}
              onCheckedChange={(v) =>
                setSelected(
                  v
                    ? [...selected, c.name]
                    : selected.filter((s) => s !== c.name),
                )
              }
            />
            {c.name}
            <span>
              {
                items.filter(
                  (p) =>
                    p.category === c.name &&
                    (!collection || collectionIncludes(collection, p)),
                ).length
              }
            </span>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Price range</legend>
        <div className="range-labels">
          <span>{money(range[0])}</span>
          <span>{money(range[1])}</span>
        </div>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={range}
          onValueChange={setRange}
          aria-label="Price range in rupees"
        />
        <p className="small">Use arrow keys to adjust the selected price.</p>
      </fieldset>
      <div className="filter-note">
        <Heart size={20} strokeWidth={1} />
        <p>
          Something small.
          <br />A whole lot of feeling.
        </p>
      </div>
    </div>
  );
}
export function Catalog({
  collectionSlug,
  wishlistOnly = false,
}: {
  collectionSlug?: string;
  wishlistOnly?: boolean;
}) {
  const params = useSearchParams();
  return (
    <CatalogView
      key={`${collectionSlug ?? "shop"}:${wishlistOnly}:${params.toString()}`}
      collectionSlug={collectionSlug}
      wishlistOnly={wishlistOnly}
    />
  );
}
function CatalogView({
  collectionSlug,
  wishlistOnly = false,
}: {
  collectionSlug?: string;
  wishlistOnly?: boolean;
}) {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState(
    params.get("sort") === "newest" ? "newest" : "featured",
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [range, setRange] = useState([
    0,
    Math.min(1000, Math.max(0, Number(params.get("max") ?? 1000) || 1000)),
  ]);
  const [open, setOpen] = useState(false);
  const { wishlist, catalogue } = useStore();
  const collection = collections.find((c) => c.slug === collectionSlug);

  const list = catalogue
    .filter(
      (p) =>
        (!collection || collectionIncludes(collection, p)) &&
        (!wishlistOnly || wishlist.includes(p.id)) &&
        (!selected.length || selected.includes(p.category)) &&
        `${p.name} ${p.category} ${p.description}`
          .toLowerCase()
          .includes(q.trim().toLowerCase()) &&
        p.price >= range[0] &&
        p.price <= range[1],
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : sort === "newest"
            ? b.createdAt.localeCompare(a.createdAt)
            : 0,
    );
  function reset() {
    setQ("");
    setSelected([]);
    setRange([0, 1000]);
    setSort("featured");
  }

  return (
    <main id="main" className="container page-space">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>{wishlistOnly ? "Wishlist" : (collection?.name ?? "Shop")}</span>
      </nav>
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">
            {wishlistOnly
              ? "SAVED FOR A LITTLE LATER"
              : "SMALL THINGS. BIG FEELINGS."}
          </p>
          <h1>
            {wishlistOnly
              ? "Your little wish list."
              : collection
                ? `${collection.name}.`
                : "Find your little happy."}
          </h1>
          <p>
            {wishlistOnly
              ? "All the little things you love, in one place."
              : (collection?.description ??
                "Handmade flowers, tiny charms, and thoughtful things to give or keep.")}
          </p>
        </div>
        <span className="catalog-flower" aria-hidden="true">
          ✳
        </span>
      </div>
      <div className="catalog-toolbar">
        <label className="catalog-search">
          <Search size={18} />
          <span className="sr-only">Search this collection</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search little things…"
          />
        </label>
        <button
          className="button secondary filter-toggle"
          onClick={() => setOpen(true)}
        >
          <SlidersHorizontal size={17} /> Filters
        </button>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="sort-select" aria-label="Sort products">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="low">Price: low to high</SelectItem>
            <SelectItem value="high">Price: high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="catalog-layout">
        <aside className="desktop-filters">
          <CatalogFilters
            prefix="desktop"
            selected={selected}
            setSelected={setSelected}
            range={range}
            setRange={setRange}
            reset={reset}
            collection={collection}
            items={catalogue}
          />
        </aside>
        <div>
          <div className="result-count" aria-live="polite">
            {list.length} {list.length === 1 ? "little find" : "little finds"}
            {(q || selected.length > 0 || range[0] > 0 || range[1] < 1000) && (
              <button onClick={reset}>
                Reset filters <X size={14} />
              </button>
            )}
          </div>
          {list.length ? (
            <div className="product-grid catalog-grid">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <Empty className="empty-state">
              <Heart size={36} strokeWidth={1} />
              <EmptyTitle>
                {wishlistOnly && !wishlist.length
                  ? "Save the little things you love."
                  : "No little things found."}
              </EmptyTitle>
              <EmptyDescription>
                {wishlistOnly && !wishlist.length
                  ? "Tap a heart on any product to keep it here."
                  : "Try a different search, category, or price range."}
              </EmptyDescription>
              {wishlistOnly && !wishlist.length ? (
                <Link href="/shop" className="button">
                  Explore the shop
                </Link>
              ) : (
                <button className="button" onClick={reset}>
                  Clear filters
                </button>
              )}
            </Empty>
          )}
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="store-sheet">
          <SheetTitle>Find your little thing</SheetTitle>
          <SheetDescription>
            Choose categories and a price range.
          </SheetDescription>
          <CatalogFilters
            prefix="mobile"
            selected={selected}
            setSelected={setSelected}
            range={range}
            setRange={setRange}
            reset={reset}
            collection={collection}
            items={catalogue}
          />
          <button className="button full" onClick={() => setOpen(false)}>
            Show {list.length} results
          </button>
        </SheetContent>
      </Sheet>
    </main>
  );
}
