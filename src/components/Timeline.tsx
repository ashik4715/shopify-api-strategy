import { SectionHeading } from "./SectionHeading";

const weekA = [
  { n: "Week 1", title: "Foundation + design", items: ["Hosting, domain, SSL, WP install", "Shopify store configured", "Figma: 6 templates sign-off"] },
  { n: "Week 2", title: "Theme + integration", items: ["Gutenberg theme build", "ShopWP buy-buttons styled native", "Cart drawer sync"] },
  { n: "Week 3", title: "Payments + content", items: ["COD, bKash/Nagad, SSLCommerz-ready", "15 products with variants", "Pixel, GA4, SEO"] },
  { n: "Week 4", title: "QA + revision + launch", items: ["Cross-device QA, caching pass", "**4-day revision round**", "Training videos + handover"] },
];

const weekB = [
  { n: "Days 1–12", title: "Discovery + design system", items: ["Catalog model, quiz logic, content plan", "Design system first, then 8 templates", "Figma sign-off checkpoint"] },
  { n: "Days 13–30", title: "Storefront + admin dashboard", items: ["Next.js pages, cart, search, filters", "**Admin dashboard panel**", "Editorial blog + quiz flow"] },
  { n: "Days 31–35", title: "API wiring + payments + QA", items: ["Checkout handoff, webhooks", "COD express → draft orders", "Pixel/CAPI, JSON-LD, Vitals pass"] },
  { n: "Days 36–40", title: "Revision + launch", items: ["**5-day revision round**", "Live test order, docs, admin videos", "Go-live + 30-day bugfix window"] },
];

export default function Timeline() {
  return (
    <section id="timeline" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:py-24">
      <SectionHeading
        eyebrow="05 · Delivery plan"
        title="Revision round inside the schedule — both options"
        intro={'No open-ended "small tweaks for 3 weeks". One consolidated change-list per option, then launch and handover. Option A: 4 weeks. Option B: 5–6 weeks.'}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-moss-deep">
              Option B ★ — 5–6 weeks
            </h3>
            <span className="rounded-full bg-moss-tint px-3 py-1 text-xs font-bold uppercase tracking-wider text-moss-deep">
              Recommended
            </span>
          </div>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {weekB.map((w, i) => (
              <li
                key={w.n}
                className="rise rounded-2xl border border-moss/25 bg-surface p-4 shadow-sm"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-moss font-display text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-moss">{w.n}</p>
                    <p className="font-display text-sm font-bold text-ink">{w.title}</p>
                  </div>
                </div>
                <ul className="mt-2.5 space-y-1">
                  {w.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-xs text-ink-soft">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-moss" />
                      <span>
                        {it.split("**").map((part, pi) =>
                          pi % 2 === 1 ? (
                            <strong key={pi} className="font-semibold text-moss-deep">{part}</strong>
                          ) : (
                            <span key={pi}>{part}</span>
                          )
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink-soft">Option A — 4 weeks</h3>
            <span className="rounded-full bg-amber-tint px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber">
              Maintenance-heavy
            </span>
          </div>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {weekA.map((w, i) => (
              <li
                key={w.n}
                className="rise rounded-2xl border border-line bg-surface p-4 shadow-sm"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-soft font-display text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">{w.n}</p>
                    <p className="font-display text-sm font-bold text-ink">{w.title}</p>
                  </div>
                </div>
                <ul className="mt-2.5 space-y-1">
                  {w.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-xs text-ink-soft">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-soft" />
                      <span>
                        {it.split("**").map((part, pi) =>
                          pi % 2 === 1 ? (
                            <strong key={pi} className="font-semibold text-moss-deep">{part}</strong>
                          ) : (
                            <span key={pi}>{part}</span>
                          )
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
