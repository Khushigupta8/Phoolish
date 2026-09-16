import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container page-space empty-state">
      <p className="eyebrow">404 · A LITTLE LOST</p>
      <h1>This little thing wandered off.</h1>
      <p>Let’s find something lovely in the shop.</p>
      <Link className="button" href="/shop">
        Back to the shop
      </Link>
    </main>
  );
}
