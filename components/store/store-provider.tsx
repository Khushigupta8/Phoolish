"use client";
import {
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
  ReactNode,
} from "react";
import { toast, Toaster } from "sonner";
import { products as seedProducts, type Product } from "@/data/products";
import {
  initialState,
  sanitizeState,
  addLine,
  updateLine,
  setCartCatalogue,
  totals,
} from "@/lib/cart";
import { Store, StoreContext as Context } from "./store-context";
import type { StoreState } from "@/lib/cart";
export { useStore } from "./store-context";
const storageKey = "petal-loop-v1";
/** One store per provider: no server-global shopping state. Stable snapshots prevent hydration loops. */
function createLocalStore() {
  const serverSnapshot = { state: initialState, ready: false };
  let snapshot = serverSnapshot;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((fn) => fn());
  const read = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? sanitizeState(JSON.parse(raw)) : initialState;
    } catch {
      return initialState;
    }
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) {
      snapshot = { state: read(), ready: true };
      emit();
    }
  };
  return {
    getSnapshot: () => snapshot,
    getServerSnapshot: () => serverSnapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      if (!snapshot.ready) {
        snapshot = { state: read(), ready: true };
      }
      if (listeners.size === 1) window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        if (!listeners.size) window.removeEventListener("storage", onStorage);
      };
    },
    /** Re-validate the saved bag, e.g. after the live catalogue arrives. */
    refresh: () => {
      snapshot = { state: read(), ready: true };
      emit();
    },
    commit: (state: StoreState) => {
      snapshot = { state, ready: true };
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        /* In-memory shopping remains available when storage is blocked. */
      }
      emit();
    },
  };
}
export function StoreProvider({ children }: { children: ReactNode }) {
  const [local] = useState(createLocalStore);
  const { state, ready } = useSyncExternalStore(
    local.subscribe,
    local.getSnapshot,
    local.getServerSnapshot,
  );
  const [cartOpen, setCartOpen] = useState(false);
  // The seed renders immediately; products added through /admin arrive after.
  const [catalogue, setCatalogue] = useState<Product[]>(seedProducts);
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/catalog");
        if (!response.ok) return;
        const data = (await response.json()) as { products?: Product[] };
        if (cancelled || !data.products?.length) return;
        setCartCatalogue(data.products);
        setCatalogue(data.products);
        // A bag saved before an upload was sanitised against the seed alone.
        local.refresh();
      } catch {
        /* The seed catalogue stays in place when the request fails. */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [local]);
  const add = useCallback(
    (id: string, variant: string, qty: number, name = "") => {
      try {
        local.commit(
          addLine(local.getSnapshot().state, id, variant, qty, name),
        );
        toast.success("A little joy, added to your bag");
        return true;
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : "Could not add this item.",
        );
        return false;
      }
    },
    [local],
  );
  const value: Store = {
    ...state,
    ready,
    catalogue,
    cartOpen,
    setCartOpen,
    add,
    summary: totals(state),
    update: (key, qty) =>
      local.commit(updateLine(local.getSnapshot().state, key, qty)),
    remove: (key) => {
      const current = local.getSnapshot().state;
      local.commit({
        ...current,
        cart: current.cart.filter((l) => l.key !== key),
      });
      toast("Item removed");
    },
    toggleWish: (id) => {
      if (!catalogue.some((p) => p.id === id)) return;
      const current = local.getSnapshot().state;
      local.commit({
        ...current,
        wishlist: current.wishlist.includes(id)
          ? current.wishlist.filter((i) => i !== id)
          : [...current.wishlist, id],
      });
    },
    applyCoupon: (code) => {
      const c = code.trim().toUpperCase();
      if (c && c !== "JOY10") return false;
      local.commit({ ...local.getSnapshot().state, coupon: c });
      return true;
    },
    clear: () =>
      local.commit({ ...local.getSnapshot().state, cart: [], coupon: "" }),
  };
  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: unknown,
            options: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!context) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(
        context.registerTool(
          {
            name: "read_shopping_bag",
            description:
              "Read the current device-local shopping bag and INR totals. Does not place an order.",
            inputSchema: {
              type: "object",
              properties: {},
              additionalProperties: false,
            },
            annotations: { readOnlyHint: true },
            execute: (input: unknown) => {
              if (
                !input ||
                typeof input !== "object" ||
                Array.isArray(input) ||
                Object.keys(input).length
              )
                throw new Error("Expected an empty object.");
              const current = local.getSnapshot().state;
              return { items: current.cart, ...totals(current) };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, [local]);
  return (
    <Context.Provider value={value}>
      {children}
      <Toaster position="bottom-center" richColors />
    </Context.Provider>
  );
}
