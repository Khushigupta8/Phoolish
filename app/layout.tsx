import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/store/store-provider";
import { SiteHeader, SiteFooter } from "@/components/store/site-shell";
export const metadata: Metadata = {
  title: "Phoolish — Little things, made with love",
  description:
    "Explore handmade flowers, tiny charms, DIY kits and thoughtful gifts. A little more joy in the everyday.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <body>
        <StoreProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </StoreProvider>
      </body>
    </html>
  );
}
