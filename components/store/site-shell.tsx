"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  ArrowUpRight,
  Flower2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { brand } from "@/data/brand";
import { money, collections } from "@/data/products";
import { useStore } from "./store-provider";
import { CartContents, OrderSummary } from "./shopping-bag";
const links = [
  ["Shop", "/shop"],
  ["Collections", "/#collections"],
  ["DIY kits", "/diy-kits"],
  ["Gifting", "/gifting"],
  ["About", "/about"],
  ["Contact", "/contact"],
];
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label={`${brand.name} home`}>
      {brand.logo ? (
        <Image
          unoptimized
          src={brand.logo}
          width={180}
          height={44}
          alt={brand.name}
        />
      ) : (
        <>
          <Flower2 aria-hidden="true" size={28} strokeWidth={1.2} />
          {brand.name}
          <span className="logo-dot">.</span>
        </>
      )}
    </Link>
  );
}
export function SiteHeader() {
  const [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false),
    [query, setQuery] = useState("");
  const store = useStore();
  const { catalogue } = store;
  const path = usePathname();

  const results = catalogue.filter((p) =>
    `${p.name} ${p.category}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="announcement">
        <span>HANDMADE, HEARTFELT & A LITTLE PLAYFUL</span>
        <span>
          {brand.announcement} <Heart size={12} />
        </span>
        <span>THOUGHTFUL GIFTS · EVERYDAY JOY</span>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMenu(true)}
          >
            <Menu size={23} />
          </button>
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map(([title, url]) => (
              <Link
                key={title}
                href={url}
                aria-current={path === url ? "page" : undefined}
              >
                {title}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="Search products"
              onClick={() => setSearch(true)}
            >
              <Search size={21} />
            </button>
            <Link
              className="icon-button header-wishlist"
              aria-label={`Wishlist, ${store.wishlist.length} items`}
              href="/wishlist"
            >
              <Heart size={21} />
              {store.wishlist.length > 0 && (
                <span className="count">{store.wishlist.length}</span>
              )}
            </Link>
            <button
              className="icon-button"
              aria-label={`Open shopping bag, ${store.summary.count} items`}
              onClick={() => store.setCartOpen(true)}
            >
              <ShoppingBag size={21} />
              {store.summary.count > 0 && (
                <span className="count">{store.summary.count}</span>
              )}
            </button>
          </div>
        </div>
      </header>
      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="store-sheet">
          <SheetTitle>Find your little joy</SheetTitle>
          <SheetDescription>Explore Phoolish</SheetDescription>
          <nav className="mobile-links">
            {links.map(([title, url]) => (
              <Link key={title} href={url} onClick={() => setMenu(false)}>
                {title}
                <ArrowUpRight size={18} />
              </Link>
            ))}
            <Link href="/wishlist" onClick={() => setMenu(false)}>
              Wishlist <Heart size={18} />
            </Link>
          </nav>
          <p className="eyebrow">SHOP BY COLLECTION</p>
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              onClick={() => setMenu(false)}
            >
              {c.name}
            </Link>
          ))}
        </SheetContent>
      </Sheet>
      <Dialog open={search} onOpenChange={setSearch}>
        <DialogContent className="search-dialog">
          <DialogTitle>Find a little something</DialogTitle>
          <DialogDescription>
            Search flowers, charms, gifts and more.
          </DialogDescription>
          <label className="sr-only" htmlFor="global-search">
            Search products
          </label>
          <input
            id="global-search"
            type="search"
            autoFocus
            placeholder="Try “flower” or “charm”"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="search-results">
            {results.length ? (
              results.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  onClick={() => setSearch(false)}
                >
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
                      {money(p.price)}
                      {p.stock === 0 ? " · Sold out" : ""}
                    </small>
                  </span>
                  <ArrowUpRight size={18} />
                </Link>
              ))
            ) : (
              <p>No little joys found. Try another search.</p>
            )}
          </div>
          <Link
            className="text-link"
            href={`/shop?q=${encodeURIComponent(query)}`}
            onClick={() => setSearch(false)}
          >
            See all results <ArrowUpRight size={18} />
          </Link>
        </DialogContent>
      </Dialog>
      <Sheet open={store.cartOpen} onOpenChange={store.setCartOpen}>
        <SheetContent className="store-sheet cart-sheet">
          <SheetTitle>Your bag ({store.summary.count})</SheetTitle>
          <SheetDescription>
            A few little things to make your day.
          </SheetDescription>
          <CartContents compact />
          {store.cart.length > 0 && (
            <>
              <OrderSummary compact />
              <Link
                className="button secondary"
                href="/cart"
                onClick={() => store.setCartOpen(false)}
              >
                View your bag
              </Link>
              <Link
                className="button"
                href="/checkout"
                onClick={() => store.setCartOpen(false)}
              >
                Continue to demo checkout
              </Link>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
export function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  return (
    <section className="newsletter" id="newsletter">
      <div className="container newsletter-inner">
        <div>
          <p className="eyebrow">LET’S BE PEN PALS</p>
          <h2>A little joy in your inbox.</h2>
          <p>New little things, creative ideas, and notes from our studio.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStatus("loading");
            window.setTimeout(() => setStatus("done"), 400);
          }}
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <div className="newsletter-field">
            <input
              id="newsletter-email"
              type="email"
              required
              autoComplete="email"
              placeholder="Your email address"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              aria-label="Join the newsletter demo"
              disabled={status === "loading"}
            >
              <ArrowUpRight size={22} />
            </button>
          </div>
          <p className="small" role="status">
            {status === "done"
              ? "Demo complete — your email was not sent or saved."
              : status === "loading"
                ? "Checking your email format…"
                : "Demo signup only. No emails are collected yet."}
          </p>
        </form>
      </div>
    </section>
  );
}
export function SiteFooter() {
  const [policy, setPolicy] = useState<string | null>(null);
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo />
            <p>
              Small things. Big feelings.
              <br />
              Handmade happiness, every day.
            </p>
            <span className="footer-note">Made with a little extra heart.</span>
          </div>
          <div>
            <h3>Find your joy</h3>
            {collections.slice(0, 5).map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`}>
                {c.name}
              </Link>
            ))}
          </div>
          <div>
            <h3>Here to help</h3>
            <Link href="/cart">Your bag</Link>
            <button onClick={() => setPolicy("Delivery & returns")}>
              Delivery & returns
            </button>
            <Link href="/faq">FAQs</Link>
            <Link href="/contact">Contact the studio</Link>
          </div>
          <div>
            <h3>Say a little hello</h3>
            <p>Questions, gift ideas, or just a hello?</p>
            {brand.email ? (
              <a href={`mailto:${brand.email}`}>{brand.email}</a>
            ) : (
              <button onClick={() => setPolicy("Contact the studio")}>
                Contact details coming soon <ArrowUpRight size={14} />
              </button>
            )}
            {brand.instagram ? (
              <a href={brand.instagram} target="_blank" rel="noreferrer">
                Find us on Instagram <ArrowUpRight size={14} />
              </a>
            ) : (
              <Link href="/#little-moments">
                Explore our moodboard <ArrowUpRight size={14} />
              </Link>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {brand.name}. A handmade kind of
            happy.
          </span>
          <div>
            <button onClick={() => setPolicy("Privacy")}>Privacy</button>
            <button onClick={() => setPolicy("Terms")}>Terms</button>
            <span>INR ₹ · India</span>
          </div>
        </div>
        <p className="demo-note">
          Demo storefront. Sample products, prices and AI-created product
          imagery are illustrative. Cart and wishlist are stored on this device.
          No real payments or orders.
        </p>
      </div>
      <Dialog
        open={!!policy}
        onOpenChange={(v) => {
          if (!v) setPolicy(null);
        }}
      >
        <DialogContent>
          <DialogTitle>{policy}</DialogTitle>
          <DialogDescription>
            {policy === "Frequently asked questions"
              ? "Can I place an order? This is a frontend demo. Can I customise a charm? Yes, try the name field on the personalised charm. Do flowers need water? No — these sample flowers use chenille stems."
              : policy === "Contact the studio"
                ? "Our real support email and social links have not been configured yet. This demo cannot receive messages."
                : policy === "Privacy"
                  ? "This demo stores your bag and wishlist in your browser. Newsletter and checkout details are not transmitted or stored. Replace this notice with your approved privacy policy before launch."
                  : policy === "Terms"
                    ? "This is a demonstration storefront, not an offer to sell. Prices and availability are sample data. Add your approved business terms before launch."
                    : "Shipping rates, dispatch times, delivery coverage and return conditions will be confirmed before launch. No shipping charge is calculated in this demo."}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
