export type Category =
  | "Flowers"
  | "Charms"
  | "Hair accessories"
  | "DIY kits"
  | "Gifts";
export type Product = {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  images?: string[];
  badge?: string;
  description: string;
  material: string;
  size: string;
  care: string;
  variants: string[];
  stock: number;
  personalised?: boolean;
  createdAt: string;
};
export const products: Product[] = [
  {
    id: "mini-bouquet",
    name: "Mini flower bouquet",
    price: 349,
    category: "Flowers",
    image: "/images/flowers.webp",
    description:
      "A pocket-sized bunch of forever flowers, for the little moments worth celebrating.",
    material: "Chenille stems, paper wrap and ribbon",
    size: "Approx. 18 cm tall",
    care: "Keep dry. Gently dust with a soft brush.",
    variants: ["Pastel mix", "Blush pink"],
    stock: 12,
    createdAt: "2026-08-01",
  },
  {
    id: "daisy-charm",
    name: "Daisy daydream charm",
    price: 199,
    category: "Charms",
    image: "/images/charm.webp",
    description:
      "A cheerful daisy and a little string of colour for your keys or favourite bag.",
    material: "Beads, flower charm and metal clasp",
    size: "Approx. 12 cm long",
    care: "Keep away from water and perfume.",
    variants: ["Butter yellow", "Pastel mix"],
    stock: 18,
    createdAt: "2026-08-02",
  },
  {
    id: "bow-clips",
    name: "The little bow clips",
    price: 249,
    category: "Hair accessories",
    image: "/images/bow.webp",
    description:
      "A pair of soft satin bows to make even your messy-bun days feel special.",
    material: "Satin ribbon and metal clips",
    size: "Approx. 7 cm each; set of 2",
    care: "Spot clean gently; air dry.",
    variants: ["Lavender", "Blush pink"],
    stock: 10,
    createdAt: "2026-08-03",
  },
  {
    id: "flower-kit",
    name: "Make a little joy DIY kit",
    price: 549,
    category: "DIY kits",
    image: "/images/kit.webp",
    badge: "DIY moment",
    description:
      "An unhurried afternoon, a few simple steps, and a little bunch made by you. Beginner-friendly; approximately 45–60 minutes.",
    material:
      "Chenille stems, floral tape, ribbon and printed guide. Scissors not included.",
    size: "Materials for 3 mini flowers",
    care: "Store materials dry. Adult supervision recommended for younger makers.",
    variants: ["Pastel garden"],
    stock: 8,
    createdAt: "2026-08-04",
  },
  {
    id: "pastel-bouquet",
    name: "Pastel daydream bouquet",
    price: 699,
    category: "Flowers",
    image: "/images/flowers.webp",
    badge: "New",
    description:
      "A fuller bunch of pastel flowers for a birthday, a thank-you, or simply because.",
    material: "Chenille stems, paper wrap and ribbon",
    size: "Approx. 25 cm tall",
    care: "Keep dry and out of direct sunlight.",
    variants: ["Pastel mix"],
    stock: 6,
    createdAt: "2026-09-12",
  },
  {
    id: "bag-charm",
    name: "Your-name bag charm",
    price: 299,
    category: "Charms",
    image: "/images/charm.webp",
    badge: "Make it yours",
    description:
      "Your favourite colours, your name, your everyday companion. Add up to 10 letters.",
    material: "Letter beads, decorative beads and metal clasp",
    size: "Approx. 14 cm; varies by name",
    care: "Avoid water and rough handling.",
    variants: ["Pastel mix", "Butter yellow"],
    stock: 9,
    personalised: true,
    createdAt: "2026-09-14",
  },
  {
    id: "bestie-bundle",
    name: "The just-because bundle",
    price: 799,
    category: "Gifts",
    image: "/images/hero.webp",
    badge: "For your bestie",
    description:
      "A mini bouquet, daisy charm and blank note card, brought together for someone who makes life sweeter.",
    material: "Chenille flowers, beads, paper and ribbon",
    size: "One mini bouquet + one charm + note card",
    care: "Keep flowers and charm dry.",
    variants: ["Pastel mix"],
    stock: 7,
    createdAt: "2026-09-15",
  },
  {
    id: "flower-keychain",
    name: "Pocketful of sunshine",
    price: 179,
    category: "Charms",
    image: "/images/charm.webp",
    badge: "New",
    description:
      "A tiny daisy keychain. A happy little reminder to take the scenic route.",
    material: "Decorative beads and metal keyring",
    size: "Approx. 9 cm long",
    care: "Wipe with a dry cloth.",
    variants: ["Butter yellow"],
    stock: 0,
    createdAt: "2026-09-16",
  },
];
export const categories: {
  name: Category;
  slug: string;
  image: string;
  note: string;
}[] = [
  {
    name: "Flowers",
    slug: "handmade-flowers",
    image: "/images/flowers.webp",
    note: "Blooms to keep",
  },
  {
    name: "Charms",
    slug: "charms-keychains",
    image: "/images/charm.webp",
    note: "Tiny happy things",
  },
  {
    name: "Hair accessories",
    slug: "hair-accessories",
    image: "/images/bow.webp",
    note: "A pretty little detail",
  },
  {
    name: "DIY kits",
    slug: "diy-kits",
    image: "/images/kit.webp",
    note: "Made by you",
  },
  {
    name: "Gifts",
    slug: "gifts",
    image: "/images/hero.webp",
    note: "Big little feelings",
  },
];
export const collections = [
  ...categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.note,
    productIds: products.filter((p) => p.category === c.name).map((p) => p.id),
  })),
  {
    slug: "personalized-gifts",
    name: "Personalized gifts",
    description: "A little detail that is entirely theirs.",
    productIds: ["bag-charm"],
  },
  {
    slug: "gift-bundles",
    name: "Gift bundles",
    description: "Thoughtful little things, lovely together.",
    productIds: ["bestie-bundle"],
  },
];
/**
 * Whether a product belongs in a collection. The five category collections are
 * computed from the product's own category, so anything added through /admin
 * lands in the right one without editing this file; the curated collections
 * keep their explicit lists.
 */
export function collectionIncludes(
  collection: { slug: string; productIds: string[] },
  product: Product,
): boolean {
  const category = categories.find((c) => c.slug === collection.slug);
  if (category) return product.category === category.name;
  if (collection.slug === "personalized-gifts" && product.personalised)
    return true;
  return collection.productIds.includes(product.id);
}

export const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
