"use client";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import { categories, type Product } from "@/data/products";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/image-constants";
import { slugify } from "@/lib/product-schema";

type FieldErrors = Record<string, string[] | undefined>;

function blank() {
  return {
    id: "",
    name: "",
    price: "",
    category: categories[0].name as string,
    image: "",
    images: [] as string[],
    badge: "",
    description: "",
    material: "",
    size: "",
    care: "",
    variants: "",
    stock: "0",
    personalised: false,
  };
}

type FormState = ReturnType<typeof blank>;

function fromProduct(product: Product): FormState {
  return {
    id: product.id,
    name: product.name,
    price: String(product.price),
    category: product.category as string,
    image: product.image,
    images: product.images ?? [],
    badge: product.badge ?? "",
    description: product.description,
    material: product.material,
    size: product.size,
    care: product.care,
    variants: product.variants.join(", "),
    stock: String(product.stock),
    personalised: Boolean(product.personalised),
  };
}

export function ProductForm({
  product,
  onSaved,
  onCancel,
}: {
  product?: Product | null;
  onSaved: (product: Product) => void;
  onCancel?: () => void;
}) {
  const editing = Boolean(product);
  const [form, setForm] = useState<FormState>(() =>
    product ? fromProduct(product) : blank()
  );
  // While editing, the slug is the primary key and cannot change; while
  // creating, it follows the name until the shopkeeper types their own.
  const [slugTouched, setSlugTouched] = useState(editing);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<"cover" | "gallery" | null>(null);
  const [error, setError] = useState("");
  const [issues, setIssues] = useState<FieldErrors>({});
  const coverInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function upload(file: File): Promise<string | null> {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await response.json()) as { path?: string; error?: string };
    if (!response.ok || !data.path) {
      setError(data.error ?? "The image did not upload.");
      return null;
    }
    return data.path;
  }

  async function handleCover(file: File) {
    setUploading("cover");
    setError("");
    const path = await upload(file);
    if (path) set("image", path);
    setUploading(null);
    if (coverInput.current) coverInput.current.value = "";
  }

  async function handleGallery(files: File[]) {
    setUploading("gallery");
    setError("");
    const uploaded: string[] = [];
    for (const file of files) {
      const path = await upload(file);
      if (!path) break;
      uploaded.push(path);
    }
    if (uploaded.length > 0) {
      setForm((current) => ({
        ...current,
        images: [...current.images, ...uploaded].slice(0, 12),
      }));
    }
    setUploading(null);
    if (galleryInput.current) galleryInput.current.value = "";
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setIssues({});

    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category,
      image: form.image,
      images: form.images,
      badge: form.badge.trim(),
      description: form.description.trim(),
      material: form.material.trim(),
      size: form.size.trim(),
      care: form.care.trim(),
      variants: form.variants
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      stock: Number(form.stock),
      personalised: form.personalised,
    };

    try {
      const response = await fetch(
        editing
          ? `/api/admin/products/${encodeURIComponent(payload.id)}`
          : "/api/admin/products",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(
            editing ? { ...payload, id: undefined } : payload
          ),
        }
      );
      const data = (await response.json()) as {
        product?: Product;
        error?: string;
        issues?: FieldErrors;
      };
      if (!response.ok || !data.product) {
        setError(data.error ?? "Could not save the product.");
        setIssues(data.issues ?? {});
        return;
      }
      if (!editing) {
        setForm(blank());
        setSlugTouched(false);
      }
      onSaved(data.product);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  const issue = (field: string) => issues[field]?.[0];

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form-head">
        <h2>{editing ? `Edit ${product?.name}` : "Add a product"}</h2>
        {onCancel && (
          <button type="button" className="button secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      <div className="admin-fields">
        <label className="wide">
          Name
          <input
            value={form.name}
            maxLength={120}
            required
            onChange={(event) => {
              const name = event.target.value;
              setForm((current) => ({
                ...current,
                name,
                id: slugTouched ? current.id : slugify(name),
              }));
            }}
          />
          <span className="admin-issue">{issue("name")}</span>
        </label>

        <label className="wide">
          Web address
          <input
            value={form.id}
            required
            readOnly={editing}
            onChange={(event) => {
              setSlugTouched(true);
              set("id", slugify(event.target.value));
            }}
          />
          <span className="admin-hint">
            {editing
              ? "The address cannot change once a product is live."
              : `Shoppers will see /products/${form.id || "your-product"}`}
          </span>
          <span className="admin-issue">{issue("id")}</span>
        </label>

        <label>
          Price (₹)
          <input
            type="number"
            min={0}
            step={1}
            value={form.price}
            required
            onChange={(event) => set("price", event.target.value)}
          />
          <span className="admin-issue">{issue("price")}</span>
        </label>

        <label>
          In stock
          <input
            type="number"
            min={0}
            step={1}
            value={form.stock}
            required
            onChange={(event) => set("stock", event.target.value)}
          />
          <span className="admin-hint">Zero shows as sold out.</span>
        </label>

        <label>
          Category
          <select
            value={form.category}
            onChange={(event) => set("category", event.target.value)}
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Badge <span>(optional)</span>
          <input
            value={form.badge}
            maxLength={40}
            placeholder="New"
            onChange={(event) => set("badge", event.target.value)}
          />
        </label>

        <label className="wide">
          Description
          <textarea
            rows={4}
            value={form.description}
            required
            maxLength={2000}
            onChange={(event) => set("description", event.target.value)}
          />
          <span className="admin-issue">{issue("description")}</span>
        </label>

        <label>
          Materials
          <input
            value={form.material}
            required
            maxLength={300}
            onChange={(event) => set("material", event.target.value)}
          />
          <span className="admin-issue">{issue("material")}</span>
        </label>

        <label>
          Size
          <input
            value={form.size}
            required
            maxLength={200}
            placeholder="Approx. 18 cm tall"
            onChange={(event) => set("size", event.target.value)}
          />
          <span className="admin-issue">{issue("size")}</span>
        </label>

        <label className="wide">
          Care
          <input
            value={form.care}
            required
            maxLength={300}
            placeholder="Keep dry. Dust gently."
            onChange={(event) => set("care", event.target.value)}
          />
          <span className="admin-issue">{issue("care")}</span>
        </label>

        <label className="wide">
          Colour or variant options
          <input
            value={form.variants}
            placeholder="Pastel mix, Blush pink"
            onChange={(event) => set("variants", event.target.value)}
          />
          <span className="admin-hint">Separate each option with a comma.</span>
        </label>

        <label className="admin-checkbox wide">
          <input
            type="checkbox"
            checked={form.personalised}
            onChange={(event) => set("personalised", event.target.checked)}
          />
          <span>Shoppers can personalise this (adds a message field)</span>
        </label>
      </div>

      <fieldset className="admin-media">
        <legend>Main photo</legend>
        {form.image ? (
          <div className="admin-thumb">
            {/* Uploaded photos stream from R2, so next/image is skipped here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image} alt="" />
            <button
              type="button"
              className="icon-button"
              aria-label="Remove the main photo"
              onClick={() => set("image", "")}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <p className="admin-muted">No photo yet.</p>
        )}
        <input
          ref={coverInput}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleCover(file);
          }}
        />
        <span className="admin-hint">
          {uploading === "cover"
            ? "Uploading…"
            : "WebP, JPEG, PNG or AVIF, up to 5 MB."}
        </span>
        <span className="admin-issue">{issue("image")}</span>
      </fieldset>

      <fieldset className="admin-media">
        <legend>More photos (optional)</legend>
        {form.images.length > 0 && (
          <div className="admin-thumb-row">
            {form.images.map((path) => (
              <div className="admin-thumb" key={path}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={path} alt="" />
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Remove this photo"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      images: current.images.filter((value) => value !== path),
                    }))
                  }
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          ref={galleryInput}
          type="file"
          multiple
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            if (files.length > 0) void handleGallery(files);
          }}
        />
        <span className="admin-hint">
          {uploading === "gallery"
            ? "Uploading…"
            : "Shown in the product gallery."}
        </span>
      </fieldset>

      <div className="admin-form-foot">
        <button className="button" disabled={busy || uploading !== null}>
          {busy ? "Saving…" : editing ? "Save changes" : "Add to the shop"}
        </button>
        <p role="alert" className="admin-error">
          {error}
        </p>
      </div>
    </form>
  );
}
