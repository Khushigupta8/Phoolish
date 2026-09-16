import { z } from "zod";
import { categories } from "@/data/products";

export const CATEGORY_NAMES = categories.map((c) => c.name) as [
  string,
  ...string[],
];

/** Lower-case, dash-separated, URL-safe — this becomes the product's id and slug. */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const listOfStrings = z
  .array(z.string().trim().min(1).max(60))
  .max(12)
  .default([]);

export const productInput = z.object({
  id: z
    .string()
    .trim()
    .min(2, "Slug is too short.")
    .max(60)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lower-case letters, numbers and dashes only."
    ),
  name: z.string().trim().min(2, "Name is required.").max(120),
  price: z
    .number({ invalid_type_error: "Price must be a number." })
    .int("Price must be a whole number of rupees.")
    .min(0)
    .max(1_000_000),
  category: z.enum(CATEGORY_NAMES, {
    errorMap: () => ({ message: "Pick one of the store categories." }),
  }),
  image: z.string().trim().min(1, "Upload a photo first."),
  images: listOfStrings,
  badge: z.string().trim().max(40).optional().or(z.literal("")),
  description: z.string().trim().min(10, "Add a short description.").max(2000),
  material: z.string().trim().min(2, "Materials are required.").max(300),
  size: z.string().trim().min(1, "Size is required.").max(200),
  care: z.string().trim().min(2, "Care notes are required.").max(300),
  variants: listOfStrings,
  stock: z.number().int().min(0).max(100000),
  personalised: z.boolean().default(false),
});

export type ProductInput = z.infer<typeof productInput>;

/** Same shape, every field optional — used by the edit (PATCH) route. */
export const productPatch = productInput.partial().omit({ id: true });
export type ProductPatch = z.infer<typeof productPatch>;
