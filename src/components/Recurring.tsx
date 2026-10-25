import { SectionHeading } from "./SectionHeading";

const wpRows = [
  { item: "Shopify Basic ($39/mo, annual billing)", cost: "৳4,563 / mo", note: "Paid direct to Shopify" },
  { item: "Managed WP hosting", cost: "৳1,500 / mo", note: "NVMe shared/cloud, SSL, backups" },
  { item: "ShopWP Pro (amortised)", cost: "৳2,500 / mo", note: "$249/yr — real Shopify products in WP" },
  { item: "Domain + SSL + backups", cost: "৳200 / mo", note: "Amortised yearly" },
];

const customRows = [
  { item: "Shopify Basic ($39/mo, annual billing)", cost: "৳4,563 / mo", note: "Paid direct to Shopify" },
  { item: "Vercel hosting", cost: "৳0 / mo", note: "Free tier first; Pro ≈ ৳2,350/mo only when traffic demands" },
  { item: "Domain + monitoring", cost: "৳200 / mo", note: "Amortised yearly; uptime on free tier" },
  { item: "WordPress updates, plugins, patching", cost: "৳0 / mo", note: "There is no WordPress to maintain" },
];

export default function Recurring() {
  return (
    <section className="border-y border-line bg-moss-tint/40">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <SectionHeading
          eyebrow="04 · Maintenance (separate)"
          title="Maintenance cost, shown separately for each option"
          intro="Build price and maintenance never mix. These run-rates are paid directly to the providers — no markup — and the gap between them is where Option B pays itself back."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-amber">Option A · WordPress</h3>
              <span className="rounded-full bg-amber-tint px-3 py-1 text-sm font-semibold text-amber">
                ≈ ৳8,760 / mo
              </span>
            </div>
            <ul className="mt-5 divide-y divide-line">
              {wpRows.map((r) => (
                <li key={r.item} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium text-ink">{r.item}</p>
                    <p className="text-sm text-ink-soft">{r.note}</p>
                  </div>
                  <span className="shrink-0 font-display text-sm font-semibold tabular-nums text-ink">{r.cost}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-amber-tint px-4 py-3 text-sm text-amber">
              ≈ ৳105,120 / yr · plus weekly plugin/theme updates, security patches and two ecosystems to
              renew — or a maintenance retainer on top.
            </p>
          </div>

          <div className="rounded-2xl border border-moss/30 bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-moss-deep">Option B · Next.js headless</h3>
              <span className="rounded-full bg-moss-tint px-3 py-1 text-sm font-semibold text-moss-deep">
                ≈ ৳4,760 / mo
              </span>
            </div>
            <ul className="mt-5 divide-y divide-line">
              {customRows.map((r) => (
                <li key={r.item} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium text-ink">{r.item}</p>
                    <p className="text-sm text-ink-soft">{r.note}</p>
                  </div>
                  <span className="shrink-0 font-display text-sm font-semibold tabular-nums text-ink">{r.cost}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-moss-tint px-4 py-3 text-sm text-moss-deep">
              ≈ ৳57,120 / yr · Option B&apos;s year-1 total (৳65,000 build + maintenance) is about ৳41,000
              cheaper than Option A — and nothing to patch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
