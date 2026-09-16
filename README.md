# Phoolish — handmade gifting storefront

A complete responsive demo storefront built with Next.js App Router, React, TypeScript and Tailwind CSS. The hosted preview uses a Next-compatible Vinext adapter; the included `dev:next`, `build:next` and `start:next` scripts run standard Next.js directly.

## Start on your computer

1. Extract the ZIP to a folder named `phoolish`.
2. Open that folder in VS Code. Open its terminal; `package.json` must be in the current directory.
3. Install Node.js 22.13 or later and the pnpm version specified by `packageManager` in `package.json`.
4. Run `pnpm install --frozen-lockfile`.
5. Run `pnpm dev:next`.
6. Open the localhost URL printed in the terminal (normally http://localhost:3000).
7. For a production Next build, run `pnpm build:next`, then `pnpm start:next`.

Do not open TSX files directly in your browser. Keep the complete directory structure. No API keys, database, gateway or backend are needed for this demo.

## Exactly where files go

All paths below are relative to the project root (the folder containing package.json). The ZIP already has the correct paths — extract it as a whole.

| File / folder | Purpose |
|---|---|
| `app/layout.tsx` | Shared document, metadata, header, footer, store provider |
| `app/page.tsx` | Homepage route |
| `app/globals.css` | Design tokens, typography, responsive layouts and motion |
| `app/shop/page.tsx` | Shop route |
| `app/collections/[slug]/page.tsx` | Seven collection routes generated from collection data |
| `app/products/[slug]/page.tsx` | Product pages and per-product metadata |
| `app/wishlist/page.tsx` | Saved products |
| `app/cart/page.tsx` | Shopping bag page |
| `app/checkout/page.tsx` | Demo checkout |
| `app/about/page.tsx`, `app/diy-kits/page.tsx`, `app/gifting/page.tsx` | Editorial pages |
| `app/contact/page.tsx`, `app/faq/page.tsx` | Contact demo and frequently asked questions |
| `app/error.tsx`, `app/loading.tsx`, `app/not-found.tsx` | Route error, loading and 404 states |
| `components/store/home-page.tsx` | Homepage sections |
| `components/store/catalog.tsx` | Shared shop/collection/wishlist catalog, filters and sort |
| `components/store/product-card.tsx` | Reusable product card |
| `components/store/product-detail.tsx` | Product gallery, options, personalization and related products |
| `components/store/quantity-selector.tsx` | Accessible quantity control |
| `components/store/shopping-bag.tsx` | Shared cart items, discount form and totals |
| `components/store/checkout.tsx` | Address → review → demo completion flow |
| `components/store/site-shell.tsx` | Header, mobile navigation, search, cart drawer, newsletter and footer |
| `components/store/information-pages.tsx` | About, DIY, gifting and FAQ content |
| `components/store/contact-form.tsx` | Contact form with honest demo feedback |
| `components/store/section-heading.tsx` | Reusable section heading |
| `components/store/store-context.ts` | Shared store types and context hook |
| `components/store/store-provider.tsx` | Hydration-safe local persistence and cross-tab synchronization |
| `components/ui/` | Accessible shared primitives; preserve this folder and dependencies |
| `data/brand.ts` | Brand name, logo path, support email, social URL and announcement |
| `data/products.ts` | Product types, sample products, categories, collections and INR formatting |
| `lib/cart.ts` | Pure cart validation, quantity limits, restoration and totals |
| `lib/utils.ts` | Shared class-name utility used by UI components |
| `public/images/` | Local WebP product and editorial photos |
| `public/fonts/` | Self-hosted DM Sans and DM Serif Display, with OFL licence |
| `public/favicon.svg` | Small brand favicon |
| `scripts/build-storefront.mjs` | Hosting build wrapper; removes temporary audit-only HTML from output |
| `scripts/test-cart.mjs` | 23 repeatable cart edge-case tests |
| `package.json`, `pnpm-lock.yaml` | Commands and reproducible dependencies |
| `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `eslint.config.mjs` | Next, Tailwind, TypeScript and lint configuration |
| `vite.config.ts`, `scripts/` | Hosting adapter support; not needed when using `*:next` commands |

## Replace the brand information

Edit `data/brand.ts`:
- `name`: wordmark and primary brand name.
- `logo`: leave blank to use the text wordmark; otherwise add a file to `public/images/` and use `/images/your-logo.svg`.
- `email`: actual support email; leave blank until confirmed.
- `instagram`: full verified Instagram profile URL; no fake social profile is supplied.
- `announcement`: announcement bar text.

Also update brand wording in `app/layout.tsx` and page metadata, and the editorial sentence in `components/store/home-page.tsx`. This deliberately keeps marketing copy editable in plain TSX rather than requiring a CMS.

## Replace images

Existing assets: `hero.webp`, `flowers.webp`, `charm.webp`, `bow.webp`, `kit.webp` in `public/images/`. Replace them at the same paths, or change `image` in `data/products.ts`. All sample photos are AI-created original illustrative assets, not another store's product photography. Some sample products share imagery; replace with product-specific photographs before selling.

For multiple product photos, add `images: ['/images/front.webp', '/images/side.webp']` to the product record and include the primary `image` in that array. Thumbnails appear automatically when more than one photo exists. Colour and personalization choices do not fabricate alternate photos.

Images use `next/image` with pre-compressed local WebP files and explicit dimensions. `unoptimized` keeps the same frontend compatible with both hosting adapters; a real image service/CDN can replace this after deployment selection.

## Replace product data

Edit only `data/products.ts` for names, prices, image paths, categories, descriptions, materials, dimensions, care, variants, aggregate stock and dates. `personalised: true` enables the name field. The `id` is the product URL slug. Collection `productIds` map to those IDs; category collections derive from product categories. Adding an `images` array enables the image gallery.

Prices are integer rupees. No fake discounts, reviews or bestseller claims are used. `JOY10` is a clearly labelled demo-only discount: 10% off the subtotal, rounded to the nearest whole rupee. Change coupon behaviour in `lib/cart.ts` and validation in `store-provider.tsx` together.

Stock is aggregate per product across colours and personalised lines. A production store will normally use inventory per SKU/variant, reserved and validated by the backend.

Standard Next output is isolated in `.next-standard/`. The hosting adapter generates its own temporary types in `.next/` and assets in `dist/`. These generated folders are not part of the source package.

## How state works

One store provider wraps every page. Identical product + variant + personalization lines merge. Different options remain separate. Additions and quantity updates cannot exceed sample stock. Sold-out products cannot be purchased. Cart and wishlist persist in `localStorage` under `petal-loop-v1`; storage events synchronize open tabs. Invalid saved data is sanitized on restoration. If storage is unavailable, the current session still works in memory.

Checkout details are held only in React memory, never sent, and cleared when the demo completes. Reloading the address form intentionally clears address inputs. Demo completion clears the bag and coupon, preserves the wishlist, and displays no real order number.

## Frontend-only boundaries

- No payment gateway, real orders, real inventory reservation or authentication.
- Shipping, tax configuration and delivery estimates require your actual policies and backend.
- Contact and newsletter forms validate and display demo feedback; they do not submit or save data.
- Review UI has an honest empty state. No fake reviews.
- Privacy, terms, delivery and return text are editable demo notices, not completed business policies.
- About contains no invented founder name, address or achievements.

## Connect commerce later

Use secure server endpoints to fetch authoritative products/prices, validate inventory and promotions, calculate shipping, and create checkout sessions. Connect your selected payment provider using server-held credentials. Confirm paid orders only from verified webhooks and handle retries idempotently. Store orders and customer data in a database; use an established authentication provider if accounts are needed. Connect a shipping provider after collecting your pickup address, serviceable regions and shipping rules. Add an email backend for contact and newsletter forms. Do not trust client prices or localStorage as transaction evidence.

## Verification commands

```bash
pnpm typecheck
pnpm exec eslint app components/store data lib/cart.ts
pnpm test:cart
pnpm build:next
```

See `TESTING-CHECKLIST.md` for the audit results, fixed issues and remaining launch checks.

## Product admin (`/admin`)

A password-protected back office for adding products and the homepage
follow-along grid without touching code. Products live in Cloudflare D1, photos
in R2; the demo catalogue in `data/products.ts` stays as a read-only seed and is
merged underneath whatever you upload.

### One-time setup

1. `cp .dev.vars.example .dev.vars`
2. Put a real password in `ADMIN_PASSWORD`. `.dev.vars` is git-ignored.
3. Run the site on the Workers runtime — `pnpm dev`, or `pnpm build` then
   `pnpm start`. The bindings come from `.openai/hosting.json` (`d1: DB`,
   `r2: BUCKET`).
4. Open `/admin` and sign in.

The tables are created on first use, so local development needs no migration
step. For a real D1 database, apply `drizzle/*.sql`
(`wrangler d1 migrations apply`) and set `ADMIN_PASSWORD` as a Worker secret
(`wrangler secret put ADMIN_PASSWORD`).

### What it does

| Area | Behaviour |
|---|---|
| Products tab | Add, edit and remove products; upload a main photo plus gallery shots (WebP/JPEG/PNG/AVIF, 5 MB each) |
| Follow-along tab | Up to 12 photos for the homepage Instagram grid, each with a caption and optional post link, reorderable |
| Web address | The slug becomes `/products/<slug>`; it is fixed once a product exists, and demo slugs are refused |
| Removing | Deletes the row and the photos it owns from R2; seed images are never touched |

### How uploads reach the storefront

- `lib/catalog.ts` merges the seed with the D1 rows. `/api/catalog` serves that
  to the browser, and `StoreProvider` hands it to the cart, search, catalogue
  and product pages, so uploaded products can be filtered, wishlisted and
  bought like any other.
- Uploaded photos are served from R2 through `/api/images/<key>`.
- `/products/[slug]` renders per request so edits appear without a rebuild.
- The follow-along section (`components/store/instagram-section.tsx`) hides
  itself while its grid is empty. Set `instagram` and `instagramHandle` in
  `data/brand.ts` to replace the `@yourbrand` placeholder and link the tiles.

### Runtime notes

- `pnpm dev:next` / `build:next` run plain Next.js, which has no Cloudflare
  bindings. `next.config.ts` aliases `cloudflare:workers` to a stub for those
  scripts only, so the storefront still runs off the seed catalogue and `/admin`
  reports that storage is unavailable. Use `pnpm dev` for admin work.
- Wrangler reads `.dev.vars` from beside its config, so `scripts/build-storefront.mjs`
  copies the project-root file into `dist/server/` after a build.
