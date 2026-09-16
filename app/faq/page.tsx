import { FAQList } from "@/components/store/information-pages";
export const metadata = { title: "FAQs | Phoolish" };
export default function Page() {
  return (
    <main id="main" className="container page-space">
      <div className="page-heading">
        <p className="eyebrow">A FEW LITTLE ANSWERS</p>
        <h1>Good things to know.</h1>
      </div>
      <FAQList />
    </main>
  );
}
