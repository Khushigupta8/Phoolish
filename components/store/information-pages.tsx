import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Flower2,
  Hand,
  Heart,
  Scissors,
  Clock,
  Gift,
} from "lucide-react";
import { brand } from "@/data/brand";
import { products } from "@/data/products";
import { getCatalog } from "@/lib/catalog";
import { ProductCard } from "./product-card";
import { SectionHeading } from "./section-heading";
export const faqs = [
  [
    "Can I place a real order here?",
    "Not yet. This is a working frontend demo. You can explore products and try checkout, but no real order or payment is created.",
  ],
  [
    "Are the flowers real?",
    "Our sample flower products are made from chenille stems, also called pipe cleaners. They do not need water.",
  ],
  [
    "Can I personalise a gift?",
    "The Your-name bag charm includes a name field for up to 10 characters. Your choice stays with the item in your demo bag.",
  ],
  [
    "What is included in the DIY kit?",
    "The sample kit contains chenille stems, floral tape, ribbon, and a printed guide for three mini flowers. Scissors are not included.",
  ],
  [
    "Is the kit suitable for beginners?",
    "Yes. The sample project is beginner-friendly and takes approximately 45–60 minutes. Younger makers should have adult supervision when using scissors or small parts.",
  ],
  [
    "When will my order arrive?",
    "Actual dispatch times, delivery coverage, shipping rates, and return terms must be added before launch. No delivery estimate is promised in this demo.",
  ],
];
export function FAQList({ items = faqs }: { items?: string[][] }) {
  return (
    <div className="faq-list">
      {items.map(([q, a]) => (
        <details key={q} className="detail-accordion">
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
export function AboutPage() {
  return (
    <main id="main" className="container page-space">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Our story</span>
      </nav>
      <section className="editorial-page">
        <div>
          <p className="eyebrow">A HANDMADE KIND OF HAPPY</p>
          <h1>
            Small things.
            <br />A whole lot of heart.
          </h1>
          <p>
            We believe an ordinary day can hold something lovely. A flower that
            stays. A charm that feels like you. A tiny gift that says exactly
            what you mean.
          </p>
          <p>
            {brand.name} is a space for handmade creativity and thoughtful
            little details. Our world is soft colours, playful shapes, and
            creations that feel personal.
          </p>
          <p>
            For a best friend, a big day, or no particular reason at all —
            there’s room for a little more joy.
          </p>
          <Link className="button" href="/shop">
            Find your little joy <ArrowUpRight size={18} />
          </Link>
        </div>
        <Image
          unoptimized
          src="/images/flowers.webp"
          alt="Pastel handmade chenille flower bouquet"
          width="800"
          height="800"
        />
      </section>
      <section className="section">
        <SectionHeading
          eyebrow="WHAT MATTERS TO US"
          title="Thoughtful, down to the tiny details."
        />
        <div className="about-values">
          {[
            [
              Hand,
              "The joy of making",
              "Taking time with shapes, colours and little finishing touches.",
            ],
            [
              Heart,
              "The feeling of giving",
              "A simple reminder that someone is thinking of you.",
            ],
            [
              Flower2,
              "The beauty in everyday",
              "Small creations that make familiar moments feel special.",
            ],
          ].map(([Icon, title, text]) => {
            const I = Icon as typeof Hand;
            return (
              <div key={title as string}>
                <I size={28} strokeWidth={1} />
                <h3>{title as string}</h3>
                <p>{text as string}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
export async function DIYPage() {
  const catalogue = await getCatalog();
  return (
    <main id="main" className="container page-space">
      <section className="editorial-page diy-editorial">
        <div>
          <p className="eyebrow">AN AFTERNOON, JUST FOR YOU</p>
          <h1>
            Make a little
            <br />
            <em>happy.</em>
          </h1>
          <p>
            A few colours, a little patience, and something lovely made by you.
            Our flower kit is a gentle place to start.
          </p>
          <div className="kit-details">
            <span>
              <Scissors size={16} /> Beginner-friendly
            </span>
            <span>
              <Clock size={16} /> 45–60 minutes
            </span>
          </div>
          <Link href="#kit-products" className="button">
            Explore DIY kits <ArrowUpRight size={18} />
          </Link>
        </div>
        <Image
          unoptimized
          src="/images/kit.webp"
          alt="DIY flower materials arranged on a sage surface"
          width="800"
          height="800"
        />
      </section>
      <section className="section">
        <SectionHeading
          eyebrow="OPEN. MAKE. ENJOY."
          title="A little creativity, all in one kit."
        />
        <div className="about-values">
          {[
            [
              "01",
              "What’s inside",
              "Chenille stems, floral tape, ribbon and a printed guide. Materials for three mini flowers; bring your own scissors.",
            ],
            [
              "02",
              "Who it’s for",
              "First-time makers, a creative catch-up with a friend, or a quiet afternoon. Adult supervision for younger makers.",
            ],
            [
              "03",
              "Why make something?",
              "Slow down, try a new skill, and enjoy the simple satisfaction of making a gift with your own hands.",
            ],
          ].map(([n, title, text]) => (
            <div key={n}>
              <span className="step-number">{n}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="kit-products" className="section section-topless">
        <SectionHeading
          eyebrow="YOUR NEXT HAPPY PROJECT"
          title="Start with a little flower."
        />
        <div className="product-grid">
          {catalogue
            .filter((p) => p.category === "DIY kits")
            .map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
        </div>
      </section>
      <section className="section section-topless">
        <SectionHeading
          eyebrow="A FEW LITTLE ANSWERS"
          title="Before you begin."
        />
        <FAQList items={faqs.slice(3)} />
      </section>
    </main>
  );
}
export function GiftingPage() {
  const occasions = [
    ["Birthday gifts", "A little birthday magic.", "/collections/gifts"],
    [
      "Anniversary gifts",
      "For your forever person.",
      "/collections/handmade-flowers",
    ],
    [
      "Friendship gifts",
      "The “this is so you” kind.",
      "/collections/gift-bundles",
    ],
    ["Self-gifting", "You deserve little lovely things.", "/shop"],
    [
      "College bestie gifts",
      "Small surprises for your everyday person.",
      "/collections/charms-keychains",
    ],
    ["Cute surprises", "No occasion necessary.", "/collections/gifts"],
    [
      "Personalised gifts",
      "Add their name. Make it theirs.",
      "/collections/personalized-gifts",
    ],
    ["Gifts under ₹500", "Thoughtful, at a little price.", "/shop?max=500"],
  ];
  return (
    <main id="main" className="container page-space">
      <div className="gifting-title">
        <p className="eyebrow">FOR THE PEOPLE WHO MAKE LIFE LOVELY</p>
        <h1>
          A little gift.
          <br />A big little feeling.
        </h1>
        <p>
          For a birthday, a bestie, or a perfectly ordinary Tuesday.
          <br />
          Find something that says “I thought of you.”
        </p>
      </div>
      <div className="gift-guide-grid">
        {occasions.map(([name, desc, href], i) => (
          <Link key={name} href={href}>
            <span className="eyebrow">0{i + 1}</span>
            <Gift size={25} strokeWidth={1} />
            <h2>{name}</h2>
            <p>{desc}</p>
            <span className="text-link">
              Find a little something <ArrowUpRight size={16} />
            </span>
          </Link>
        ))}
      </div>
      <section className="section">
        <SectionHeading
          eyebrow="WRAPPED UP IN A LITTLE JOY"
          title="Lovely together."
          action="Explore gift bundles"
          href="/collections/gift-bundles"
        />
        <div className="product-grid">
          {products
            .filter((p) =>
              [
                "bestie-bundle",
                "bag-charm",
                "mini-bouquet",
                "bow-clips",
              ].includes(p.id),
            )
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </main>
  );
}
