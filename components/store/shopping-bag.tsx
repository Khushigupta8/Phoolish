"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Trash2, ArrowLeft, Tag } from "lucide-react";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { money } from "@/data/products";
import { useStore } from "./store-provider";
import { QuantitySelector } from "./quantity-selector";
export function CartContents({ compact = false }: { compact?: boolean }) {
  const s = useStore();
  const { catalogue } = s;
  if (!s.ready)
    return (
      <div aria-label="Loading shopping bag">
        <Skeleton className="h-32 w-full" />
      </div>
    );
  if (!s.cart.length)
    return (
      <Empty className="empty-state">
        <ShoppingBag size={36} strokeWidth={1} />
        <EmptyTitle>Your bag is waiting for a little joy.</EmptyTitle>
        <EmptyDescription>
          Something thoughtful is just around the corner.
        </EmptyDescription>
        <Link
          className="button"
          href="/shop"
          onClick={() => s.setCartOpen(false)}
        >
          Find your little thing
        </Link>
      </Empty>
    );
  return (
    <div className={`cart-items ${compact ? "compact" : ""}`}>
      {s.cart.map((l) => {
        const p = catalogue.find((p) => p.id === l.productId)!;
        const others = s.cart
          .filter((i) => i.productId === p.id && i.key !== l.key)
          .reduce((n, i) => n + i.quantity, 0);
        return (
          <article className="cart-item" key={l.key}>
            <Link
              href={`/products/${p.id}`}
              onClick={() => s.setCartOpen(false)}
            >
              <Image
                unoptimized
                src={p.image}
                alt={p.name}
                width="120"
                height="120"
              />
            </Link>
            <div className="cart-item-copy">
              <Link
                href={`/products/${p.id}`}
                onClick={() => s.setCartOpen(false)}
              >
                {p.name}
              </Link>
              <p>
                {l.variant}
                {l.personalization && ` · ${l.personalization}`}
              </p>
              <p>{money(p.price)} each</p>
              <QuantitySelector
                value={l.quantity}
                max={p.stock - others}
                label={`Quantity for ${p.name}`}
                onChange={(q) => s.update(l.key, q)}
              />
            </div>
            <div className="cart-item-end">
              <strong>{money(p.price * l.quantity)}</strong>
              <button
                className="icon-button"
                aria-label={`Remove ${p.name} from bag`}
                onClick={() => s.remove(l.key)}
              >
                <Trash2 size={17} />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
export function OrderSummary({
  compact = false,
  checkout = false,
}: {
  compact?: boolean;
  checkout?: boolean;
}) {
  const s = useStore();
  const [code, setCode] = useState(s.coupon);
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState(false);
  return (
    <div className={`order-summary ${compact ? "compact" : ""}`}>
      <h2>{compact ? "A little round-up" : "Order summary"}</h2>
      <div className="summary-row">
        <span>Subtotal</span>
        <span>{money(s.summary.subtotal)}</span>
      </div>
      {s.coupon && (
        <div className="summary-row discount">
          <span>
            JOY10 · demo discount{" "}
            <button
              onClick={() => {
                s.applyCoupon("");
                setCode("");
                setMessage("Discount removed.");
                setInvalid(false);
              }}
            >
              Remove
            </button>
          </span>
          <span>−{money(s.summary.discount)}</span>
        </div>
      )}
      <div className="summary-row">
        <span>Shipping</span>
        <span>Not calculated</span>
      </div>
      <div className="summary-row total">
        <span>{s.coupon ? "After discount" : "Items total"}</span>
        <span>{money(s.summary.total)}</span>
      </div>
      <p className="small">
        Excludes shipping. Prices and discounts are illustrative.
      </p>
      {!compact && (
        <form
          className="coupon-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!code.trim()) {
              setMessage("Enter a discount code.");
              setInvalid(true);
              return;
            }
            const ok = s.applyCoupon(code);
            setInvalid(!ok);
            setMessage(
              ok
                ? "Demo discount applied: 10% off items."
                : "Code not recognised. Try JOY10 for this demo.",
            );
          }}
        >
          <label htmlFor="discount-code">
            <Tag size={15} /> Have a little code?
          </label>
          <div className="field-row">
            <input
              id="discount-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Discount code"
              aria-invalid={invalid}
              aria-describedby="coupon-message"
            />
            <button type="submit" className="button secondary">
              Apply
            </button>
          </div>
          <p
            className={`small ${invalid ? "error-text" : ""}`}
            id="coupon-message"
            role="status"
          >
            {message || "Try JOY10 — a demo-only 10% discount."}
          </p>
        </form>
      )}
      {!compact && !checkout && s.cart.length > 0 && (
        <Link className="button full" href="/checkout">
          Continue to demo checkout
        </Link>
      )}
    </div>
  );
}
export function CartPage() {
  const s = useStore();
  return (
    <main id="main" className="container page-space">
      <Link href="/shop" className="text-link">
        <ArrowLeft size={16} /> Continue shopping
      </Link>
      <div className="page-heading">
        <p className="eyebrow">YOUR LITTLE FINDS</p>
        <h1>A bag full of happy.</h1>
        <p>
          {s.summary.count}{" "}
          {s.summary.count === 1 ? "little thing" : "little things"}, chosen by
          you.
        </p>
      </div>
      <div className={s.cart.length ? "cart-layout" : ""}>
        <CartContents />
        {s.cart.length > 0 && <OrderSummary />}
      </div>
    </main>
  );
}
