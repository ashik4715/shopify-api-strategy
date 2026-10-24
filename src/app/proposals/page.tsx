import { readFile } from "fs/promises";
import path from "path";
import type { Metadata } from "next";
import ProposalLibrary, { type ProposalDoc } from "@/components/ProposalLibrary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Proposal Library — Option B recommended (.md + .pdf downloads)",
  description:
    "Download both client proposals as markdown or PDF: Next.js headless + Shopify API + admin dashboard (৳65,000, recommended) and WordPress + Shopify plugin (৳58,000, maintenance-heavy).",
};

const DOCS = [
  {
    slug: "option-b-react-shopify-api",
    option: "Option B",
    verdict: "recommended" as const,
    title: "Next.js Headless + Shopify API + Admin Dashboard",
    stack: "Next.js (SSR/ISR) + Storefront API + your own admin panel",
    reference: "fleurandbee.com",
    referenceUrl: "https://fleurandbee.com/",
    investment: "৳65,000",
    timeline: "5–6 weeks",
    ongoing: "≈৳4,800/mo",
  },
  {
    slug: "option-a-wordpress-shopify",
    option: "Option A",
    verdict: "discouraged" as const,
    title: "WordPress + Shopify Plugin",
    stack: "WordPress (Gutenberg theme) + ShopWP plugin + Shopify backend",
    reference: "holofootwearinc.com",
    referenceUrl: "https://holofootwearinc.com/",
    investment: "৳58,000",
    timeline: "4 weeks",
    ongoing: "≈৳8,800/mo",
  },
] as const;

export default async function ProposalsPage() {
  const proposals: ProposalDoc[] = await Promise.all(
    DOCS.map(async (d) => ({
      ...d,
      markdown: await readFile(path.join(process.cwd(), "proposals", `${d.slug}.md`), "utf8"),
    }))
  );

  return (
    <>
      <Navbar />
      <main>
        <ProposalLibrary proposals={proposals} />
      </main>
      <Footer />
    </>
  );
}
