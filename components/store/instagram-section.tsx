import { brand } from "@/data/brand";
import { getInstagramPosts } from "@/lib/instagram";

// lucide-react 1.x dropped brand marks, so the glyph is drawn inline.
function InstagramGlyph() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** "@phoolish" from the handle, the profile URL, or a neutral placeholder. */
function handle(): string {
  if (brand.instagramHandle) {
    return brand.instagramHandle.startsWith("@")
      ? brand.instagramHandle
      : `@${brand.instagramHandle}`;
  }
  const fromUrl = brand.instagram
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean)
    .pop();
  return fromUrl && !fromUrl.includes(".") ? `@${fromUrl}` : "@yourbrand";
}

export async function InstagramSection() {
  const posts = await getInstagramPosts();
  // Nothing uploaded yet: skip the section rather than show an empty grid.
  if (posts.length === 0) return null;

  return (
    <section className="container section instagram-section" id="follow-along">
      <div className="instagram-heading">
        <p className="eyebrow instagram-eyebrow">FOLLOW ALONG</p>
        <h2>
          Work in progress,
          <br />
          mostly <span className="instagram-handle">{handle()}</span>
        </h2>
        <p>
          Half-finished flowers, colour experiments and the occasional finished
          bouquet.
        </p>
      </div>
      <ul className="instagram-grid">
        {posts.map((post) => {
          const href = post.link || brand.instagram;
          const label = post.caption || `Open ${handle()} on Instagram`;
          const tile = (
            <>
              {/* Uploaded photos stream from R2, so next/image is skipped here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={post.caption} loading="lazy" />
              <span className="instagram-glyph" aria-hidden="true">
                <InstagramGlyph />
              </span>
            </>
          );
          return (
            <li key={post.id}>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                >
                  {tile}
                </a>
              ) : (
                <div aria-label={post.caption || undefined}>{tile}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
