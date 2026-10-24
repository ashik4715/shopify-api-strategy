import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShopCraft — Shopify Store Proposals · Download .md / .pdf",
  description:
    "Two costed routes for a Shopify-powered store: WordPress + WP Shopify (৳165,000, 6 weeks) and Next.js + Shopify API (৳385,000, 10 weeks). Download both proposals as markdown or PDF.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
