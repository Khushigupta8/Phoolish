"use client";
import Image from "next/image";
import { FormEvent, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Check, LockKeyhole } from "lucide-react";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { money } from "@/data/products";
import { useStore } from "./store-provider";
import { OrderSummary } from "./shopping-bag";
const fields = [
  ["name", "Full name", "text", "name"],
  ["email", "Email address", "email", "email"],
  ["phone", "Mobile number", "tel", "tel-national"],
  ["address", "Address", "text", "street-address"],
  ["city", "City", "text", "address-level2"],
  ["state", "State / Union territory", "text", "address-level1"],
  ["pincode", "PIN code", "text", "postal-code"],
];
export function Checkout() {
  const s = useStore();
  const { catalogue } = s;
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{
    count: number;
    total: number;
  } | null>(null);
  const guard = useRef(false);
  function next(e: FormEvent) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(form.phone?.trim() ?? "")) {
      setError(
        "Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9.",
      );
      return;
    }
    if (!/^[1-9]\d{5}$/.test(form.pincode?.trim() ?? "")) {
      setError("Enter a valid six-digit PIN code.");
      return;
    }
    if (fields.some(([key]) => !form[key]?.trim())) {
      setError("Please complete every address field.");
      return;
    }
    setError("");
    setStep(2);
  }
  function complete() {
    if (guard.current || !s.cart.length) return;
    guard.current = true;
    setBusy(true);
    const snapshot = { count: s.summary.count, total: s.summary.total };
    window.setTimeout(() => {
      setReceipt(snapshot);
      setForm({});
      s.clear();
      setStep(3);
      setBusy(false);
    }, 500);
  }
  if (!s.ready)
    return (
      <main id="main" className="container page-space">
        <Skeleton className="h-80 w-full" />
      </main>
    );
  if (step === 3 && receipt)
    return (
      <main id="main" className="container page-space">
        <Empty className="checkout-complete">
          <span className="success-circle">
            <Check size={32} />
          </span>
          <p className="eyebrow">DEMO COMPLETE</p>
          <h1>A little practice, all done.</h1>
          <EmptyDescription>
            You explored checkout with {receipt.count} items totalling{" "}
            {money(receipt.total)} before shipping. No payment was taken, no
            order was placed, and your address was not saved or sent. Your demo
            bag has been cleared.
          </EmptyDescription>
          <Link className="button" href="/shop">
            Back to the little things
          </Link>
        </Empty>
      </main>
    );
  if (!s.cart.length)
    return (
      <main id="main" className="container page-space">
        <Empty>
          <EmptyTitle>Your bag is empty.</EmptyTitle>
          <EmptyDescription>
            Add a little something before trying demo checkout.
          </EmptyDescription>
          <Link className="button" href="/shop">
            Explore the shop
          </Link>
        </Empty>
      </main>
    );
  return (
    <main id="main" className="container page-space">
      <Link href="/cart" className="text-link">
        <ArrowLeft size={16} /> Back to your bag
      </Link>
      <div className="page-heading">
        <p className="eyebrow">A LITTLE CLOSER TO HAPPY</p>
        <h1>Demo checkout.</h1>
        <p>No real payments or orders. Use sample details to try the flow.</p>
      </div>
      <ol className="checkout-steps">
        <li aria-current={step === 1 ? "step" : undefined}>1. Your details</li>
        <li aria-current={step === 2 ? "step" : undefined}>
          2. Review & demo payment
        </li>
        <li>3. Complete</li>
      </ol>
      <div className="cart-layout">
        <div className="checkout-panel">
          {step === 1 ? (
            <form onSubmit={next}>
              <h2>Where would your little joys go?</h2>
              <p className="small">
                India only for this demo. Details stay in memory and are cleared
                on completion.
              </p>
              <div className="checkout-fields">
                {fields.map(([key, label, type, autoComplete]) => (
                  <label key={key} className={key === "address" ? "wide" : ""}>
                    {label}
                    <input
                      type={type}
                      value={form[key] ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      required
                      autoComplete={autoComplete}
                      inputMode={
                        key === "pincode" || key === "phone"
                          ? "numeric"
                          : undefined
                      }
                      maxLength={
                        key === "phone" ? 10 : key === "pincode" ? 6 : 160
                      }
                    />
                  </label>
                ))}
              </div>
              <p className="error-text" role="alert">
                {error}
              </p>
              <button className="button full" type="submit">
                Review demo order
              </button>
            </form>
          ) : (
            <div>
              <h2>One last little look.</h2>
              <div className="address-review">
                <strong>{form.name}</strong>
                <p>
                  {form.address}, {form.city}, {form.state} — {form.pincode}
                </p>
                <p>
                  {form.email} · {form.phone}
                </p>
                <button
                  className="text-link"
                  onClick={() => setStep(1)}
                  disabled={busy}
                >
                  Edit details
                </button>
              </div>
              <div className="checkout-lines">
                {s.cart.map((l) => {
                  const p = catalogue.find((p) => p.id === l.productId)!;
                  return (
                    <div key={l.key}>
                      <Image
                        unoptimized
                        src={p.image}
                        alt=""
                        width="64"
                        height="64"
                      />
                      <span>
                        {p.name}
                        <small>
                          {l.variant}
                          {l.personalization ? ` · ${l.personalization}` : ""} ·
                          Qty {l.quantity}
                        </small>
                      </span>
                      <strong>{money(p.price * l.quantity)}</strong>
                    </div>
                  );
                })}
              </div>
              <div className="demo-payment">
                <LockKeyhole size={22} />
                <div>
                  <strong>Demo payment only</strong>
                  <p>
                    No card, UPI, or bank details required. Shipping is not
                    calculated. This action will not create a real order.
                  </p>
                </div>
              </div>
              <button
                className="button full"
                disabled={busy}
                onClick={complete}
              >
                {busy ? "Completing demo…" : "Complete demo · no payment"}
              </button>
            </div>
          )}
        </div>
        <OrderSummary checkout />
      </div>
    </main>
  );
}
