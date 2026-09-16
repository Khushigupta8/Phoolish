import { products as seedProducts, type Product } from "@/data/products";

/**
 * The catalogue every cart rule is checked against. It starts as the demo seed
 * so this module stays pure for `scripts/test-cart.mjs`; the store provider
 * swaps in the live catalogue (seed + anything added through /admin) once it
 * has loaded.
 */
let catalogue: Product[] = seedProducts;

export function setCartCatalogue(list: Product[]): void {
  catalogue = list.length > 0 ? list : seedProducts;
}

function findProduct(id: string): Product | undefined {
  return catalogue.find((p) => p.id === id);
}

export type CartLine = {
  key: string;
  productId: string;
  variant: string;
  personalization: string;
  quantity: number;
};
export type StoreState = {
  cart: CartLine[];
  wishlist: string[];
  coupon: string;
};
export const initialState: StoreState = { cart: [], wishlist: [], coupon: "" };
export function lineKey(
  productId: string,
  variant: string,
  personalization: string,
) {
  return JSON.stringify([productId, variant, personalization.trim()]);
}
export function sanitizeState(value: unknown): StoreState {
  if (!value || typeof value !== "object") return initialState;
  const raw = value as Partial<StoreState>;
  const cart: CartLine[] = [];
  for (const line of Array.isArray(raw.cart) ? raw.cart : []) {
    if (!line || typeof line !== "object") continue;
    const p = findProduct(line.productId);
    if (!p || p.stock < 1 || !p.variants.includes(line.variant)) continue;
    const name =
      typeof line.personalization === "string"
        ? line.personalization.trim().slice(0, 10)
        : "";
    if (p.personalised && !name) continue;
    const used = cart
      .filter((i) => i.productId === p.id)
      .reduce((n, i) => n + i.quantity, 0);
    const quantity = Math.min(
      p.stock - used,
      Math.max(0, Math.floor(Number(line.quantity) || 0)),
    );
    if (!quantity) continue;
    const key = lineKey(p.id, line.variant, name);
    const existing = cart.find((i) => i.key === key);
    if (existing) existing.quantity += quantity;
    else
      cart.push({
        key,
        productId: p.id,
        variant: line.variant,
        personalization: name,
        quantity,
      });
  }
  return {
    cart,
    wishlist: Array.from(
      new Set(
        (Array.isArray(raw.wishlist) ? raw.wishlist : []).filter((id) =>
          catalogue.some((p) => p.id === id),
        ),
      ),
    ),
    coupon: raw.coupon === "JOY10" ? "JOY10" : "",
  };
}
export function totals(state: StoreState) {
  const subtotal = state.cart.reduce(
    (n, l) =>
      n + (findProduct(l.productId)?.price ?? 0) * l.quantity,
    0,
  );
  const discount = state.coupon === "JOY10" ? Math.round(subtotal * 0.1) : 0;
  return {
    subtotal,
    discount,
    total: subtotal - discount,
    count: state.cart.reduce((n, l) => n + l.quantity, 0),
  };
}
export function addLine(
  state: StoreState,
  productId: string,
  variant: string,
  quantity: number,
  personalization = "",
): StoreState {
  const p = findProduct(productId);
  const name = personalization.trim();
  if (
    !p ||
    !p.variants.includes(variant) ||
    !Number.isInteger(quantity) ||
    quantity < 1
  )
    throw new Error("Choose a valid product, option and quantity.");
  if (p.personalised && (!name || name.length > 10))
    throw new Error("Add a name of 1–10 characters.");
  const used = state.cart
    .filter((l) => l.productId === productId)
    .reduce((n, l) => n + l.quantity, 0);
  if (used + quantity > p.stock)
    throw new Error("That quantity is not available. Please check your bag.");
  const key = lineKey(productId, variant, name);
  const existing = state.cart.find((l) => l.key === key);
  return {
    ...state,
    cart: existing
      ? state.cart.map((l) =>
          l.key === key ? { ...l, quantity: l.quantity + quantity } : l,
        )
      : [
          ...state.cart,
          { key, productId, variant, quantity, personalization: name },
        ],
  };
}
export function updateLine(
  state: StoreState,
  key: string,
  quantity: number,
): StoreState {
  if (!Number.isInteger(quantity) || quantity < 1) return state;
  const line = state.cart.find((l) => l.key === key);
  if (!line) return state;
  const p = findProduct(line.productId)!;
  const others = state.cart
    .filter((l) => l.productId === line.productId && l.key !== key)
    .reduce((n, l) => n + l.quantity, 0);
  return {
    ...state,
    cart: state.cart.map((l) =>
      l.key === key
        ? { ...l, quantity: Math.min(quantity, p.stock - others) }
        : l,
    ),
  };
}
