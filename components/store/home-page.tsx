import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Hand,
  Gift,
  Sparkles,
  Flower2,
} from "lucide-react";
import { categories } from "@/data/products";
import { getCatalog } from "@/lib/catalog";
import { ProductCard } from "./product-card";
import { SectionHeading } from "./section-heading";
import { InstagramSection } from "./instagram-section";
import { Newsletter } from "./site-shell";
export async function HomePage() {
  const catalogue = await getCatalog();
  return (
    <main id="main">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> SMALL THINGS. BIG FEELINGS.
          </p>
          <h1>
            Little things,
            <br />
            made with <em>love.</em>
          </h1>
          <p>
            Forever flowers. Tiny charms. Thoughtful little gifts.
            <br className="desktop-break" /> For your favourite people — and
            you, too.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/shop">
              Shop now <ArrowUpRight size={18} />
            </Link>
            <Link className="text-link" href="#gifting">
              Explore gifting <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-footnote">
            <Hand size={21} strokeWidth={1.2} />
            <span>Made by hand. Given from the heart.</span>
          </div>
        </div>
        <div className="hero-image">
          <Image
            unoptimized
            src="/images/hero.webp"
            alt="Pastel handmade chenille flowers wrapped in cream paper and tied with a sage ribbon"
            width="1536"
            height="1024"
            fetchPriority="high"
          />
          <span className="hero-sticker">
            a little
            <br />
            <em>forever</em>
            <Flower2 size={21} strokeWidth={1} />
          </span>
          <div className="hero-caption">
            <span>
              Flowers that stay.
              <br />
              <strong>Just like the feeling.</strong>
            </span>
            <Link
              href="/collections/handmade-flowers"
              className="icon-button"
              aria-label="Explore handmade flowers"
            >
              <ArrowUpRight size={23} />
            </Link>
          </div>
        </div>
      </section>
      <div className="value-ribbon">
        <span>Little gifts, lovely feelings</span>
        <Flower2 />
        <span>Handmade with care</span>
        <Flower2 />
        <span>A little more you</span>
        <Flower2 />
        <span>Made for everyday joy</span>
      </div>
      <section className="container section" id="collections">
        <SectionHeading
          eyebrow="PICK YOUR KIND OF HAPPY"
          title="A little something for everyone."
        />
        <div className="category-grid">
          {categories.map((c) => (
            <Link
              className="category-card"
              key={c.name}
              href={`/collections/${c.slug}`}
            >
              <div>
                <Image
                  unoptimized
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  width="400"
                  height="400"
                />
              </div>
              <h3>
                {c.name} <ArrowUpRight size={16} />
              </h3>
              <p>{c.note}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="container section section-topless">
        <SectionHeading
          eyebrow="THE LITTLE LOVELIES"
          title="Meet your new favourites."
          description="Thoughtful picks for gifting, keeping, and everything in between."
          action="Shop all little things"
        />
        <div className="product-grid">
          {catalogue.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="story-panel container" id="our-story">
        <div className="story-image">
          <Image
            unoptimized
            src="/images/flowers.webp"
            alt="Close-up of soft handmade flower petals and ribbon"
            loading="lazy"
            width="800"
            height="800"
          />
          <span className="image-note">
            a little imperfect.
            <br />a lot of heart.
          </span>
        </div>
        <div className="story-copy">
          <p className="eyebrow">LESS FACTORY. MORE FEELING.</p>
          <h2>
            Made slowly.
            <br />
            Loved a little longer.
          </h2>
          <p>
            There’s something special about a thing made by hand. The tiny
            details. The unexpected colours. The feeling that someone really
            thought about it.
          </p>
          <p>
            That’s the heart of Phoolish. Little creations that turn an
            ordinary day into a lovely one.
          </p>
          <Link href="/shop" className="text-link">
            Find something heartfelt <ArrowUpRight size={18} />
          </Link>
          <div className="story-signature">With love, always.</div>
        </div>
      </section>
      <section className="container section">
        <SectionHeading
          eyebrow="FRESH FROM OUR LITTLE WORLD"
          title="New little crushes."
          action="Explore new arrivals"
          href="/shop?sort=newest"
        />
        <div className="product-grid">
          {catalogue.slice(4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="gifting-section" id="gifting">
        <div className="container section">
          <SectionHeading
            eyebrow="NO BIG OCCASION NEEDED"
            title="For them. For you. Just because."
            description="The best gifts say “I saw this and thought of you.”"
          />
          <div className="gift-grid">
            <Link
              href="/collections/gift-bundles"
              className="gift-card gift-bestie"
            >
              <div>
                <p className="eyebrow">YOUR PERSON, YOUR PICK</p>
                <h3>
                  For your
                  <br />
                  favourite human.
                </h3>
                <span className="text-link">
                  Little gifts, big hugs <ArrowUpRight size={18} />
                </span>
              </div>
              <Image
                unoptimized
                src="/images/charm.webp"
                alt="Daisy charm for a thoughtful friendship gift"
                loading="lazy"
                width="800"
                height="800"
              />
            </Link>
            <Link href="/shop?max=500" className="gift-card gift-budget">
              <p className="eyebrow">THOUGHTFUL DOESN’T MEAN PRICEY</p>
              <h3>
                Little joys.
                <br />
                Under ₹500.
              </h3>
              <p>Small surprises that mean a lot.</p>
              <span className="text-link">
                Find a sweet little gift <ArrowUpRight size={18} />
              </span>
              <Gift size={64} strokeWidth={0.7} aria-hidden="true" />
            </Link>
          </div>
          <div className="occasion-links">
            <span>A little occasion?</span>
            {[
              ["Birthday", "/collections/gifts"],
              ["Anniversary", "/collections/handmade-flowers"],
              ["Friendship", "/collections/gift-bundles"],
              ["For yourself", "/shop"],
              ["Personalised", "/collections/personalized-gifts"],
            ].map(([name, href]) => (
              <Link key={name} href={href}>
                {name}
                <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="diy-panel">
          <div className="diy-copy">
            <p className="eyebrow">LESS SCROLLING. MORE CREATING.</p>
            <h2>
              Your next little
              <br />
              <em>happy project.</em>
            </h2>
            <p>
              Put the phone down. Pick a colour. Make a flower.
              <br />
              Our DIY kits turn a quiet afternoon into something lovely.
            </p>
            <div className="kit-details">
              <span>Beginner-friendly</span>
              <span>45–60 minutes</span>
            </div>
            <Link className="button" href="/collections/diy-kits">
              Make your own joy <ArrowUpRight size={18} />
            </Link>
          </div>
          <Image
            unoptimized
            src="/images/kit.webp"
            alt="Pastel pipe-cleaner stems and flowers arranged for a creative afternoon"
            loading="lazy"
            width="800"
            height="800"
          />
        </div>
      </section>
      <section className="container why-grid" aria-label="Our approach">
        {[
          [
            Hand,
            "Handmade with care",
            "Little details, thoughtfully put together.",
          ],
          [
            Gift,
            "Thoughtful gifting",
            "For the moments that words can’t quite hold.",
          ],
          [
            Flower2,
            "Small-batch creations",
            "A little more personal, a little more special.",
          ],
          [
            Sparkles,
            "Everyday joy",
            "Because ordinary days deserve lovely things.",
          ],
        ].map(([Icon, title, copy]) => {
          const I = Icon as typeof Hand;
          return (
            <div key={title as string}>
              <I size={28} strokeWidth={1.1} />
              <h3>{title as string}</h3>
              <p>{copy as string}</p>
            </div>
          );
        })}
      </section>
      <section className="container section" id="little-moments">
        <SectionHeading
          eyebrow="A PEEK INTO OUR LITTLE WORLD"
          title="Life, with a little more lovely."
          description="Colours, textures, and tiny things that make us smile."
        />
        <div className="social-grid">
          {["bow", "flowers", "charm", "kit"].map((name, i) => (
            <Link
              href={`/collections/${categories[[2, 0, 1, 3][i]].slug}`}
              key={name}
            >
              <Image
                unoptimized
                src={`/images/${name}.webp`}
                alt={
                  [
                    "Lavender bows",
                    "Soft pastel blooms",
                    "Daisy charm details",
                    "A creative afternoon",
                  ][i]
                }
                loading="lazy"
                width="800"
                height="800"
              />
              <span>
                {
                  [
                    "Pretty little details",
                    "Forever kind of flowers",
                    "Take joy with you",
                    "Made by you",
                  ][i]
                }{" "}
                <ArrowUpRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <InstagramSection />
      <Newsletter />
    </main>
  );
}
