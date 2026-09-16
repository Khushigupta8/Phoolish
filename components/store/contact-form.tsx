"use client";
import { useState } from "react";
import Link from "next/link";
import { brand } from "@/data/brand";
export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <main id="main" className="container page-space">
      <div className="page-heading">
        <p className="eyebrow">A LITTLE HELLO GOES A LONG WAY</p>
        <h1>Let’s talk little things.</h1>
        <p>Questions, gift ideas, or a detail you’d like to make your own?</p>
      </div>
      <div className="contact-layout">
        <div>
          <h2>Say hello.</h2>
          {brand.email ? (
            <a href={`mailto:${brand.email}`} className="text-link">
              {brand.email}
            </a>
          ) : (
            <p>Support email coming soon.</p>
          )}
          {brand.instagram && (
            <p>
              <a
                className="text-link"
                href={brand.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Find us on Instagram
              </a>
            </p>
          )}
          <p className="contact-note">
            Looking for a quick answer? Our FAQs cover the demo, personalised
            gifts, and DIY kits.
          </p>
          <Link className="text-link" href="/faq">
            Read the FAQs
          </Link>
        </div>
        <form
          className="contact-form"
          onSubmit={(e) => {
            e.preventDefault();
            setBusy(true);
            setTimeout(() => {
              setBusy(false);
              setSent(true);
            }, 400);
          }}
        >
          <p className="demo-form-note">
            Demo form — messages are not sent or saved.
          </p>
          <div className="checkout-fields">
            <label>
              Name
              <input name="name" autoComplete="name" required maxLength={100} />
            </label>
            <label>
              Email
              <input type="email" name="email" autoComplete="email" required />
            </label>
            <label className="wide">
              Order number <span>(optional)</span>
              <input name="order" maxLength={60} />
            </label>
            <label className="wide">
              Your message
              <textarea name="message" rows={5} required maxLength={2000} />
            </label>
          </div>
          <button className="button" disabled={busy}>
            {busy ? "Checking your message…" : "Try the contact form"}
          </button>
          <p role="status" className="small">
            {sent
              ? "Demo complete. No message was sent. Add a contact backend before launch."
              : ""}
          </p>
        </form>
      </div>
    </main>
  );
}
