# Phoolish — audit and testing checklist

Audit date: 16 September 2026. Scope: the complete demo storefront and source package.

## Fixed during this audit

1. **Incorrect font weight:** the downloaded sans-serif file was a 900-weight face used for all text. Replaced it with explicit 400/500/600 font files and correct TrueType declarations. Headings keep their serif contrast; body text is now lighter and easier to read.
2. **Mobile hero overflow:** the combination of minimum height and aspect ratio forced the image grid wider than the phone. Set a shrinkable grid track and removed the conflicting minimum height. Confirmed the hero and page widths match at mobile size.
3. **Filter focus loss:** an inline filter component was remounted on state changes. Extracted a stable component so checkbox and slider interactions retain their identity.
4. **Filter reset/render churn:** replaced effect-driven URL resets with a keyed catalog view. Query and collection changes initialize a fresh view without cascading effect updates.
5. **Quantity mismatch:** product submission now uses the same stock-clamped quantity displayed in the selector after cart changes.
6. **Cart hydration:** replaced effect-driven restoration with a stable external-store subscription and deterministic server snapshot. No server-global customer state.
7. **Cross-tab consistency:** cart and wishlist listen to storage events and update other open tabs.
8. **Development context identity:** separated context and provider to avoid stale context identities during component refresh.
9. **Control readability:** increased undersized metadata, adjusted touch targets, made selected checkbox/radio boundaries explicit and restored the sort control border after the shared button reset.
10. **Client routing:** replaced the remaining internal raw anchor with a Next Link.
11. **Images:** moved images to Next Image with explicit dimensions and local compressed assets. No runtime dependency on third-party image URLs.
12. **Demo clarity:** checkout, newsletter, contact, shipping, policy notices and illustrative imagery state their actual limitations.
13. **Test portability:** corrected the cart-test import rewrite so it works after source formatting changes quote style.
14. **Build isolation:** gave standard Next.js a separate `.next-standard` output directory so the hosting adapter cannot overwrite its generated route types.
15. **Artifact cleanup:** added a production-build cleanup step that excludes temporary responsive-test HTML even if the supervised preview mirror retains it.
16. **Code quality:** formatted custom source, removed unused imports and resolved all custom-source lint errors/warnings.

## Verification results

| Check | Result / evidence |
|---|---|
| TypeScript strict check | Passed `tsc --noEmit` |
| Custom application lint | Passed with no errors or warnings |
| Cart model tests | All 23 automated cases passed |
| Standard Next.js production build | Passed; 27 generated pages |
| Hosted adapter production build | Passed before publication |
| Static image/font references | No missing referenced local assets |
| Homepage rendering | Checked in desktop and phone-width browser views |
| Phone layouts | Checked 390px and 320px iframe viewport harnesses; mobile hero clipping fixed |
| Tablet catalog | Checked at 768px; no page-level horizontal overflow |
| Mobile menu | Opens with labelled dialog and working navigation links |
| Mobile filters | Category selection changes results; apply closes drawer and exposes matching products |
| Price range | Keyboard arrow changed maximum from ₹1,000 to ₹990 |
| Ascending-price sorting | Browser verified ₹179, ₹199, ₹249, ₹299, ₹349, ₹549, ₹699, ₹799 |
| Category filtering | Flowers returns the two flower products |
| Search no-results | No-results state appears; Clear filters restores catalog |
| Product selection | Product page loads from catalog link |
| Variants and personalization | Butter yellow + Asha added correctly as selected options |
| Quantity and totals | 2 × ₹299 = ₹598; increasing to 3 gives ₹897 |
| Discount error | Invalid code displays useful error; existing state is preserved |
| Demo discount | JOY10 on ₹897 gives ₹90 rounded discount and ₹807 items total |
| Persistence | Reload preserved bag and wishlist |
| Mobile bag | At 320px, items, quantity controls, totals and CTA remain usable |
| Removal | Removing the final item produces the empty-bag state |
| Empty checkout | No items means a return-to-shop state, not a payment form |
| Checkout validation | Invalid Indian mobile number rejected with visible feedback |
| Checkout completion | Demo confirmed 3 items / ₹807; explicitly no payment or order; bag cleared |
| Unknown product | Custom not-found UI verified |
| App console after clean reload | No new application errors observed in the final mobile cart flow; browser-extension metadata errors and an extension-injected HTML-attribute hydration warning were excluded |
| Reduced motion | CSS disables transitions/animation and smooth scrolling when requested; source checked |
| WebMCP | Read-only cart tool feature-detected; runtime validation unavailable because this browser does not expose modelContext |

Browser checks were performed against the live development preview. An intermediate hot-refresh context error occurred while replacing the provider; context separation and a clean reload resolved it. The audit does not claim cross-browser certification or a complete assistive-technology audit.

## Repeatable technical checks

Run from the folder containing package.json:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm exec eslint app components/store data lib/cart.ts
pnpm test:cart
pnpm build:next
```

### Automated cart cases (all passed)

- [x] Empty cart has zero totals.
- [x] Adding two ₹349 bouquets gives ₹698.
- [x] Identical options merge into one line.
- [x] Merged quantities remain correct.
- [x] Different variants stay separate.
- [x] Aggregate stock is enforced across variants.
- [x] Unknown products are rejected.
- [x] Unknown variants are rejected.
- [x] Sold-out products are rejected.
- [x] Negative, zero, fractional, infinite and NaN quantities are rejected.
- [x] Personalized products require nonblank text.
- [x] Personalization respects its length limit.
- [x] Different personalized names stay separate.
- [x] Whitespace is trimmed from personalization.
- [x] Quantity updates clamp to remaining stock.
- [x] Quantity updates cannot create zero-quantity lines.
- [x] Demo percentage discount rounds correctly.
- [x] Unknown coupons do not reduce totals.
- [x] Valid saved state survives a JSON round trip.
- [x] Corrupted saved data recovers safely.
- [x] Wishlist restoration deduplicates and validates IDs.
- [x] Restored quantities respect current stock.
- [x] Restored sold-out products are removed.

## Full manual regression checklist

Use this when changing products, styling, routes or integrations. These boxes are intentionally unmarked so the next release can be checked afresh; they are not a claim that all devices or failure modes were tested here.

### Navigation and routes

- [ ] Logo returns to Home from every page.
- [ ] Desktop navigation and mobile navigation reach every destination.
- [ ] All seven collection URLs contain only appropriate products.
- [ ] All product IDs have a valid product page and appropriate metadata.
- [ ] Unknown product, collection and page URLs return an appropriate 404.
- [ ] Refresh and browser back/forward preserve useful navigation state.
- [ ] No dead `href="#"` controls or unused CTA placeholders.

### Catalog and wishlist

- [ ] Search handles case differences and surrounding spaces.
- [ ] Category and price filters combine correctly.
- [ ] Minimum/maximum price boundaries include expected products.
- [ ] Featured, newest, ascending and descending price sorts are correct.
- [ ] Clear filters restores the entire current collection.
- [ ] Empty results offer a useful recovery action.
- [ ] Wishlist toggles work on cards and product pages.
- [ ] Wishlist persists after refresh and synchronizes across tabs.
- [ ] Empty wishlist offers a shop link.

### Product and bag

- [ ] Gallery switches between supplied images; a single image has no redundant thumbnails.
- [ ] Variant radio controls work by keyboard and touch.
- [ ] Required personalization rejects blank and overlong names.
- [ ] Quantity boundaries and sold-out state are correct.
- [ ] Repeated add merges only identical option combinations.
- [ ] Personalization and variants remain visible in drawer, bag and checkout.
- [ ] Increment, decrement and remove update both bag surfaces immediately.
- [ ] Products cannot exceed aggregate sample stock across separate lines.
- [ ] Subtotal, coupon and items total update after every cart change.
- [ ] Invalid coupon feedback is accessible and clear.
- [ ] Clearing the last line gives a helpful empty state.
- [ ] Corrupted or unavailable localStorage does not crash the storefront.

### Demo checkout and forms

- [ ] Empty cart cannot proceed to checkout.
- [ ] Required fields and email format use visible validation.
- [ ] Phone and PIN code validation reject invalid Indian formats.
- [ ] Review shows the exact current products, options, quantities and totals.
- [ ] Edit details returns without losing the form state.
- [ ] Demo completion is guarded against double-click submission.
- [ ] No payment details are requested and no network order is created.
- [ ] Completion clears bag/coupon but preserves wishlist.
- [ ] Contact and newsletter clearly state that submissions are not sent or saved.
- [ ] Demo success messages never claim an email, subscription, payment or real order was created.

### Responsive and visual QA

- [ ] Review 320, 360, 390, 430, 768, 1024, 1280 and 1440px widths.
- [ ] No page-wide horizontal scrolling; intentional category scroller is contained.
- [ ] Headlines, labels and prices never overlap.
- [ ] Cards keep consistent image framing and readable names.
- [ ] Touch controls remain visible without hover.
- [ ] Drawers and dialogs fit short landscape viewports and can scroll.
- [ ] Sticky header does not cover anchor targets.
- [ ] Keyboard-open mobile viewport does not hide the active field/submit action.
- [ ] All product photographs match the final actual products and variants.

### Accessibility

- [ ] Keyboard-only navigation reaches all actions in sensible order.
- [ ] Focus remains visible; dialogs trap focus, close on Escape and restore focus.
- [ ] Every icon button has an accessible name.
- [ ] Inputs have persistent labels and errors are announced.
- [ ] Product images have meaningful alt text; decorative images do not duplicate essential text unnecessarily.
- [ ] Selected options are communicated by more than color.
- [ ] Text remains usable at 200% zoom and with increased browser font size.
- [ ] Check real screen readers (VoiceOver and NVDA) before public launch.
- [ ] Check color contrast with an automated tool and manually on final imagery.
- [ ] Confirm reduced-motion and high-contrast preferences on a real device.

### Performance and launch gates

- [ ] Test Chrome, Firefox, Safari, iOS Safari and Android Chrome; only the available Chrome environment was checked here.
- [ ] Run Lighthouse/Web Vitals on the chosen production host; no score is claimed here.
- [ ] Check all images/fonts return successfully with cache disabled.
- [ ] Recheck console after a clean reload and all main flows.
- [ ] Replace brand name, photos, support email, Instagram URL and policy placeholders.
- [ ] Confirm real dispatch times, shipping rates, tax display and return terms.
- [ ] Connect real payments only through secure backend sessions and verified webhooks.
- [ ] Revalidate prices, stock, discounts, orders and personal data handling on the server.
- [ ] Add order confirmation, email delivery, inventory reservation and failure/refund handling before accepting real orders.

## Known intentional limitations

This is a frontend demo. There is no payment gateway, order database, authentication, shipping calculation, tax engine, real review source, contact delivery or newsletter subscription backend. Stock is per product, not per variant SKU. Imagery and products are illustrative samples. Cart/wishlist persist on this browser only, not across devices. No actual legal policy or founder information has been invented.
