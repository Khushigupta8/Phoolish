"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { Product, money } from "@/data/products";
import { useStore } from "./store-provider";
export function ProductCard({ product: p }: { product: Product }) {
  const { wishlist, toggleWish } = useStore();
  const saved = wishlist.includes(p.id);
  return (
    <article className="product-card">
      <div className="product-image">
        <Link
          className="image-link"
          href={`/products/${p.id}`}
          aria-label={`View ${p.name}`}
        >
          <Image
            unoptimized
            src={p.image}
            alt={p.name}
            loading="lazy"
            width="800"
            height="800"
          />
        </Link>
        {p.badge && <span className="badge">{p.badge}</span>}
        <button
          className={`icon-button save-button ${saved ? "saved" : ""}`}
          onClick={() => toggleWish(p.id)}
          aria-label={`${saved ? "Remove" : "Save"} ${p.name} ${saved ? "from" : "to"} wishlist`}
          aria-pressed={saved}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
        <Link className="quick-view" href={`/products/${p.id}`}>
          Take a closer look <Plus size={15} />
        </Link>
      </div>
      <div className="product-copy">
        <p className="product-category">{p.category}</p>
        <h3>
          <Link href={`/products/${p.id}`}>{p.name}</Link>
        </h3>
        <div className="product-bottom">
          <span>{money(p.price)}</span>
          <Link
            className="icon-button add-button"
            aria-label={`Choose options for ${p.name}`}
            href={`/products/${p.id}`}
          >
            <Plus size={18} />
          </Link>
        </div>
        {p.stock === 0 && <p className="stock-label">Sold out</p>}
      </div>
    </article>
  );
}
