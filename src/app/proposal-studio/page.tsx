import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProposalStudio from "@/components/ProposalStudio";

export const metadata: Metadata = {
  title: "Proposal Studio — Reusable Client Proposals",
  description: "Build a client proposal for any client: pick a saved X Limited approach (WordPress, Laravel + React, or Next.js / NestJS, all ৳45,000), edit it, and download it as .md or .pdf.",
};

export default function ProposalStudioPage() {
  return (
    <>
      <Navbar />
      <main>
        <ProposalStudio />
      </main>
      <Footer />
    </>
  );
}
