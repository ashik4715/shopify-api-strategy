import { SectionHeading } from "./SectionHeading";

export function Assumptions() {
  const items = [
    "Build prices stay under the ৳60–70K cap: Option A ৳58,000 · Option B ৳65,000",
    "Monthly maintenance shown SEPARATELY for each option — paid direct to providers",
    "Shopify Basic at $39/mo (annual billing) ≈ ৳4,563/mo — confirm BD pricing before sending",
    "Domain ৳1,500–৳2,500/yr; Vercel free tier for headless (Pro only when traffic demands)",
    "Benchmarks: fleurandbee.com (Option B, recommended) · holofootwearinc.com (Option A)",
    "Each timeline includes exactly 1 consolidated revision round, then handover",
    "Client provides brand assets and product data; copywriting quoted separately · valid 30 days",
  ];

  return (
    <section className="border-y border-line bg-moss-tint/50">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <p className="text-sm font-semibold text-moss-deep">What this proposal assumes</p>
        <ul className="mt-4 grid gap-x-8 gap-y-2.5 text-sm text-ink-soft sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <li key={i} className="flex items-start gap-2.5">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-moss" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.1 3.1 6.8-6.8a1 1 0 011.4 0z"
                  clipRule="evenodd"
                />
              </svg>
              {i}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
