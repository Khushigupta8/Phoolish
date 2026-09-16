import { Checkout } from "@/components/store/checkout";
export const metadata = {
  title: "Demo checkout | Phoolish",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <Checkout />;
}
