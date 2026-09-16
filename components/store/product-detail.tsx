"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Hand, Gift, ArrowUpRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Product, money, categories } from "@/data/products";
import { useStore } from "./store-provider";
import { QuantitySelector } from "./quantity-selector";
import { ProductCard } from "./product-card";
import { SectionHeading } from "./section-heading";
export function ProductDetail({ product: p }: { product: Product }) {
  const [variant, setVariant] = useState(p.variants[0]);
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [image, setImage] = useState(p.image);
  const s = useStore();
  const { catalogue } = s;
  const router = useRouter();
  const available =
    p.stock -
    s.cart
      .filter((l) => l.productId === p.id)
      .reduce((n, l) => n + l.quantity, 0);
  const images = p.images?.length ? p.images : [p.image];
  const category = categories.find((c) => c.name === p.category);
  const related = [
    ...catalogue.filter((i) => i.category === p.category && i.id !== p.id),
    ...catalogue.filter((i) => i.category !== p.category && i.id !== p.id),
  ].slice(0, 4);
  function add(buy = false) {
    if (s.add(p.id, variant, Math.min(qty, Math.max(1, available)), name)) {
      if (buy) router.push("/checkout");
      else s.setCartOpen(true);
    }
  }
  return (
    <main id="main" className="container page-space">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href={`/collections/${category?.slug}`}>{p.category}</Link>
        <span>/</span>
        <span>{p.name}</span>
      </nav>
      <div className="product-detail">
        <div className="gallery">
          <div className="detail-image">
            <Image
              unoptimized
              src={image}
              alt={p.name}
              width="800"
              height="800"
              fetchPriority="high"
            />
            {p.badge && <span className="badge">{p.badge}</span>}
          </div>
          {images.length > 1 && (
            <div className="thumbnails">
              {images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setImage(src)}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={image === src}
                >
                  <Image
                    unoptimized
                    src={src}
                    alt={`${p.name}, view ${i + 1}`}
                    width="80"
                    height="80"
                  />
                </button>
              ))}
            </div>
          )}
          <p className="small image-disclaimer">
            Illustrative sample image. Colour and personalised options are not
            photographed separately.
          </p>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">
            A LITTLE {p.category === "DIY kits" ? "CREATIVITY" : "HAPPINESS"},
            MADE BY HAND
          </p>
          <h1>{p.name}</h1>
          <p className="detail-price">{money(p.price)}</p>
          <p>{p.description}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              add();
            }}
          >
            <fieldset className="variant-field">
              <legend>
                Colour <span>— {variant}</span>
              </legend>
              <RadioGroup
                className="variant-options"
                value={variant}
                onValueChange={setVariant}
                aria-label="Colour"
              >
                {p.variants.map((v) => (
                  <label key={v} className={variant === v ? "selected" : ""}>
                    <RadioGroupItem value={v} aria-label={v} />
                    {v}
                  </label>
                ))}
              </RadioGroup>
            </fieldset>
            {p.personalised && (
              <label className="personalization">
                Make it yours{" "}
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={10}
                  required
                  placeholder="Name or initials"
                  aria-describedby="name-help"
                />
                <small id="name-help">
                  Up to 10 characters. {name.length}/10
                </small>
              </label>
            )}
            <div className="purchase-row">
              <QuantitySelector
                value={Math.min(qty, Math.max(1, available))}
                max={available}
                onChange={setQty}
              />
              <button
                className="button"
                disabled={!s.ready || available < 1}
                type="submit"
              >
                {p.stock === 0
                  ? "Sold out"
                  : available < 1
                    ? "All available items in bag"
                    : "Add to bag"}{" "}
                <ArrowUpRight size={18} />
              </button>
              <button
                className="icon-button detail-save"
                type="button"
                aria-label={
                  s.wishlist.includes(p.id)
                    ? "Remove from wishlist"
                    : "Save to wishlist"
                }
                aria-pressed={s.wishlist.includes(p.id)}
                onClick={() => s.toggleWish(p.id)}
              >
                <Heart
                  size={21}
                  fill={s.wishlist.includes(p.id) ? "currentColor" : "none"}
                />
              </button>
            </div>
            <button
              className="button secondary full"
              type="button"
              disabled={
                !s.ready || available < 1 || (!!p.personalised && !name.trim())
              }
              onClick={() => add(true)}
            >
              Buy now · demo checkout
            </button>
          </form>
          <div className="detail-values">
            <span>
              <Hand size={18} /> Handmade with care
            </span>
            <span>
              <Gift size={18} /> A thoughtful little gift
            </span>
          </div>
          <p className="delivery-note">
            Delivery rates and dispatch times will be confirmed before launch.
            This demo does not place real orders.
          </p>
          {[
            [
              "The little details",
              `${p.size}. Each handmade piece may vary slightly.`,
            ],
            ["Materials", p.material],
            ["Care for your little thing", p.care],
          ].map(([title, copy]) => (
            <details key={title} className="detail-accordion">
              <summary>{title}</summary>
              <p>{copy}</p>
            </details>
          ))}
        </div>
      </div>
      <section className="review-empty">
        <h2>Little notes of love.</h2>
        <p>
          No reviews yet. Real customer reviews will appear here when available.
        </p>
      </section>
      <section className="section">
        <SectionHeading
          eyebrow="LOVELY LITTLE COMPANIONS"
          title="A little more to love."
          action="Explore the shop"
        />
        <div className="product-grid">
          {related.map((i) => (
            <ProductCard key={i.id} product={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
