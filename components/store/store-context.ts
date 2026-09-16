"use client";
import { createContext, useContext } from "react";
import { StoreState, totals } from "@/lib/cart";
import type { Product } from "@/data/products";
export type Store = StoreState & {
  ready: boolean;
  /** Seed products plus anything added through /admin. */
  catalogue: Product[];
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  add: (id: string, variant: string, qty: number, name?: string) => boolean;
  update: (key: string, qty: number) => void;
  remove: (key: string) => void;
  toggleWish: (id: string) => void;
  applyCoupon: (code: string) => boolean;
  clear: () => void;
  summary: ReturnType<typeof totals>;
};
export const StoreContext = createContext<Store | null>(null);
export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("StoreProvider is required");
  return value;
}
