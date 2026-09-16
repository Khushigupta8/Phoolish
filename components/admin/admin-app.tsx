"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { money, type Product } from "@/data/products";
import { LoginForm } from "./login-form";
import { ProductForm } from "./product-form";
import { InstagramPanel } from "./instagram-panel";

type Session = {
  authenticated: boolean;
  passwordConfigured: boolean;
  storageReady: boolean;
};

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [notice, setNotice] = useState("");
  const [listError, setListError] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [tab, setTab] = useState<"products" | "instagram">("products");

  const loadSession = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/session");
      setSession((await response.json()) as Session);
    } catch {
      setSession({
        authenticated: false,
        passwordConfigured: false,
        storageReady: false,
      });
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoadingList(true);
    setListError("");
    try {
      const response = await fetch("/api/admin/products");
      const data = (await response.json()) as {
        products?: Product[];
        error?: string;
      };
      if (!response.ok) {
        setListError(data.error ?? "Could not load your products.");
        return;
      }
      setProducts(data.products ?? []);
    } catch {
      setListError("Could not reach the server.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    // Deferred so the first paint is not blocked on the session check.
    void (async () => {
      await loadSession();
    })();
  }, [loadSession]);

  const authenticated = session?.authenticated ?? false;
  useEffect(() => {
    if (!authenticated) return;
    void (async () => {
      await loadProducts();
    })();
  }, [authenticated, loadProducts]);

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    setProducts([]);
    setEditing(null);
    setNotice("");
    await loadSession();
  }

  async function remove(product: Product) {
    const confirmed = window.confirm(
      `Remove "${product.name}" from the shop? Its photos are deleted too.`,
    );
    if (!confirmed) return;
    const response = await fetch(
      `/api/admin/products/${encodeURIComponent(product.id)}`,
      { method: "DELETE" },
    );
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setListError(data.error ?? "Could not remove that product.");
      return;
    }
    if (editing?.id === product.id) setEditing(null);
    setNotice(`Removed ${product.name}.`);
    void loadProducts();
  }

  if (!session) {
    return <p className="admin-muted admin-loading">Loading the admin…</p>;
  }

  if (!session.authenticated) {
    return (
      <>
        {!session.passwordConfigured && (
          <p className="admin-warning">
            No <code>ADMIN_PASSWORD</code> is set yet. Add one to{" "}
            <code>.dev.vars</code> (local) or to the Worker&rsquo;s secrets,
            then reload.
          </p>
        )}
        <LoginForm onSignedIn={loadSession} />
      </>
    );
  }

  return (
    <div className="admin-shell">
      <header className="admin-head">
        <div>
          <p className="eyebrow">PHOOLISH</p>
          <h1>Product admin</h1>
        </div>
        <div className="admin-head-actions">
          <Link className="text-link" href="/shop">
            View the shop
          </Link>
          <button type="button" className="button secondary" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      {!session.storageReady && (
        <p className="admin-warning">
          The <code>DB</code> and <code>BUCKET</code> bindings are missing, so
          nothing can be saved. Run the site with <code>pnpm dev</code> or{" "}
          <code>pnpm build &amp;&amp; pnpm start</code>.
        </p>
      )}

      <nav className="admin-tabs" aria-label="Admin sections">
        <button
          type="button"
          className={tab === "products" ? "active" : ""}
          aria-current={tab === "products" ? "page" : undefined}
          onClick={() => setTab("products")}
        >
          Products
        </button>
        <button
          type="button"
          className={tab === "instagram" ? "active" : ""}
          aria-current={tab === "instagram" ? "page" : undefined}
          onClick={() => setTab("instagram")}
        >
          Follow-along grid
        </button>
      </nav>

      {tab === "instagram" ? (
        <InstagramPanel />
      ) : (
        <div className="admin-layout">
          <section className="admin-panel">
            <ProductForm
              key={editing?.id ?? "new"}
              product={editing}
              onSaved={(product) => {
                setNotice(
                  editing
                    ? `Saved changes to ${product.name}.`
                    : `${product.name} is live at /products/${product.id}.`,
                );
                setEditing(null);
                void loadProducts();
              }}
              onCancel={editing ? () => setEditing(null) : undefined}
            />
            <p role="status" className="admin-notice">
              {notice}
            </p>
          </section>

          <section className="admin-panel">
            <h2>Your products ({products.length})</h2>
            <p className="admin-hint">
              The demo products in <code>data/products.ts</code> are not listed
              here — they stay in the code.
            </p>
            {listError && (
              <p role="alert" className="admin-error">
                {listError}
              </p>
            )}
            {loadingList && products.length === 0 ? (
              <p className="admin-muted">Loading…</p>
            ) : products.length === 0 ? (
              <p className="admin-muted">
                Nothing uploaded yet. Add your first product on the left.
              </p>
            ) : (
              <ul className="admin-list">
                {products.map((product) => (
                  <li key={product.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt="" />
                    <div className="admin-list-body">
                      <strong>{product.name}</strong>
                      <span className="admin-muted">
                        {money(product.price)} · {product.category} ·{" "}
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Sold out"}
                      </span>
                      <div className="admin-list-actions">
                        <button
                          type="button"
                          className="text-link"
                          onClick={() => {
                            setEditing(product);
                            setNotice("");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          Edit
                        </button>
                        <Link
                          className="text-link"
                          href={`/products/${product.id}`}
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          className="text-link admin-danger"
                          onClick={() => void remove(product)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
