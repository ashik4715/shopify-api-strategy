import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Assumptions } from "@/components/Assumptions";
import InvestmentSummary from "@/components/InvestmentSummary";
import TechComparison from "@/components/TechComparison";
import Plugins from "@/components/Plugins";
import Recurring from "@/components/Recurring";
import Timeline from "@/components/Timeline";
import Recommendation from "@/components/Recommendation";
import InquiryForm from "@/components/InquiryForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Assumptions />
        <InvestmentSummary />
        <TechComparison />
        <Plugins />
        <Recurring />
        <Timeline />
        <Recommendation />
        <InquiryForm />
      </main>
      <Footer />
    </>
  );
}
