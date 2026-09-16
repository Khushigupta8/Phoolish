import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Products added through the admin page. The demo catalogue in `data/products.ts`
// stays as the read-only seed; these rows are merged on top of it at read time.
export const adminProducts = sqliteTable("admin_products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  images: text("images").notNull().default("[]"),
  badge: text("badge"),
  description: text("description").notNull(),
  material: text("material").notNull(),
  size: text("size").notNull(),
  care: text("care").notNull(),
  variants: text("variants").notNull().default("[]"),
  stock: integer("stock").notNull().default(0),
  personalised: integer("personalised").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export type AdminProductRow = typeof adminProducts.$inferSelect;

// Photos for the "follow along" grid on the homepage. Uploaded through /admin;
// `link` points at the real Instagram post when there is one.
export const instagramPosts = sqliteTable("instagram_posts", {
  id: text("id").primaryKey(),
  image: text("image").notNull(),
  caption: text("caption"),
  link: text("link"),
  position: integer("position").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export type InstagramPostRow = typeof instagramPosts.$inferSelect;
