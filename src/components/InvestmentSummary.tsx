import { SectionHeading } from "./SectionHeading";

const options = [
  {
    tag: "Option B",
    verdict: "Recommended",
    title: "Next.js Headless + Shopify API + Admin Dashboard",
    ref: "fleurandbee.com",
    refUrl: "https://fleurandbee.com/",
    investment: "৳65,000",
    timeline: "5–6 weeks · 1 revision round + handover",
    ongoing: "≈ ৳4,800 / mo",
    includes: [
      "UX/UI design system · 8 templates, quiz flow prototyped",
      "Next.js storefront — SSR/ISR, cart, search, filters, blog, 90+ Lighthouse",
      "**Admin dashboard** — orders, products, content & inquiries, one panel",
      "Shopify Storefront API + webhooks, COD express → draft orders",
      "Up to 20 products / 8 collections, payments + Pixel/CAPI/GA4",
      "Full technical SEO (JSON-LD, sitemaps, OG images)",
      "QA + Core Web Vitals pass, 1 revision round, 30-day bugfix",
    ],
    note: "One codebase, zero WordPress to patch. Year-1 total ≈ ৳122,000 — the cheaper option overall.",
    accent: "moss" as const,
  },
  {
    tag: "Option A",
    verdict: "Discouraged · maintenance-heavy",
    title: "WordPress + Shopify Plugin",
    ref: "holofootwearinc.com",
    refUrl: "https://holofootwearinc.com/",
    investment: "৳58,000",
    timeline: "4 weeks · 1 revision round + handover",
    ongoing: "≈ ৳8,800 / mo",
    includes: [
      "Figma design · 6 templates (home, collection, PDP, lookbook, cart, contact)",
      "Gutenberg theme + ShopWP buy-buttons styled native",
      "Up to 15 products / 5 collections, cart drawer → Shopify checkout",
      "COD + bKash/Nagad manual + SSLCommerz-ready",
      "Reviews, IG feed, blog, search, Pixel + GA4 + basic SEO",
      "Hosting year 1 + domain included in build price",
      "QA + 1 revision round, 14-day bugfix, training videos",
    ],
    note: "Cheapest upfront — but two bills and two update cycles forever, 75–85 Lighthouse ceiling, plugin security burden.",
    accent: "amber" as const,
  },
];

export default function InvestmentSummary() {
  return (
    <section id="invest" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:py-24">
      <SectionHeading
        eyebrow="01 · The numbers"
        title="One build price. Maintenance shown separately."
        intro="Both build prices stay under the ৳60–70K cap and include design, development, store setup, testing, one revision round and handover. Monthly maintenance is a separate table — paid direct to Shopify/hosting providers, no markup."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {options.map((o) => (
          <article
            key={o.tag}
            className={`flex flex-col rounded-2xl border bg-surface p-6 shadow-sm sm:p-8 ${
              o.accent === "moss" ? "border-moss/40 ring-1 ring-moss/15" : "border-line"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${
                  o.accent === "moss" ? "bg-moss" : "bg-ink-soft"
                }`}
              >
                {o.tag}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  o.accent === "moss" ? "bg-moss-tint text-moss-deep" : "bg-amber-tint text-amber"
                }`}
              >
                {o.verdict}
              </span>
              <a
                href={o.refUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-moss-deep underline underline-offset-4"
              >
                Benchmark: {o.ref}
              </a>
            </div>

            <h3 className="mt-4 font-display text-2xl font-bold text-ink">{o.title}</h3>

            <div className="mt-4 grid gap-4 rounded-xl bg-paper p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Build price (fixed)
                </p>
                <p
                  className={`font-display text-4xl font-bold ${
                    o.accent === "moss" ? "text-moss-deep" : "text-ink"
                  }`}
                >
                  {o.investment}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{o.timeline}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Monthly maintenance (separate)
                </p>
                <p className="font-display text-3xl font-bold text-amber">{o.ongoing}</p>
                <p className="mt-1 text-sm text-ink-soft">Paid direct to providers</p>
              </div>
            </div>

            <ul className="mt-5 space-y-2">
              {o.includes.map((i) => {
                const parts = i.split("**");
                return (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-moss" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.1 3.1 6.8-6.8a1 1 0 011.4 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {parts[0]}
                      {parts.length > 1 && <strong className="font-semibold text-ink">{parts[1]}</strong>}
                      {parts.slice(2).join("**")}
                    </span>
                  </li>
                );
              })}
            </ul>

            <p
              className={`mt-5 rounded-xl px-4 py-3 text-sm ${
                o.accent === "moss" ? "bg-moss-tint text-moss-deep" : "bg-amber-tint text-amber"
              }`}
            >
              {o.note}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h3 className="font-display text-lg font-bold text-ink">Payment milestones (both options)</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            ["30%", "Deposit on signing — initiates discovery"],
            ["40%", "On staging deployment sign-off"],
            ["30%", "On production launch + handover"],
          ].map(([p, d]) => (
            <div key={p} className="rounded-xl bg-paper p-4">
              <p className="font-display text-2xl font-bold text-moss">{p}</p>
              <p className="mt-1 text-sm text-ink-soft">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          <strong className="font-semibold text-ink">Optional growth costs not included:</strong> paid
          Shopify apps, paid email/SMS tools, advertising spend, product photography, logo/brand
          identity, multilingual, Shopify Plus checkout customisation — each quoted per scope.
        </p>
      </div>
    </section>
  );
}
