import { SectionHeading } from "./SectionHeading";

const rows: { criterion: string; wp: string; custom: string }[] = [
  { criterion: "Build price (fixed, under ৳70K cap)", wp: "৳58,000", custom: "৳65,000" },
  { criterion: "Monthly maintenance (separate)", wp: "≈ ৳8,760", custom: "≈ ৳4,760 (Vercel free tier)" },
  { criterion: "Year-1 total (build + maintenance)", wp: "≈ ৳163,120", custom: "≈ ৳122,120 — ৳41K cheaper" },
  { criterion: "Time to launch (incl. 1 revision + handover)", wp: "4 weeks", custom: "5–6 weeks" },
  { criterion: "Admin panel for the client team", wp: "WP admin + Shopify admin (two logins)", custom: "**One custom admin dashboard**" },
  { criterion: "Performance ceiling", wp: "75–85 Lighthouse (plugin cap)", custom: "90+ Lighthouse, SSR/ISR" },
  { criterion: "Maintenance burden", wp: "Two update cycles forever + security patches", custom: "Nothing to patch — Shopify hosts the brain" },
  { criterion: "Design freedom", wp: "Bounded by theme & plugins", custom: "Unlimited — designed from scratch" },
  { criterion: "Shopify integration", wp: "ShopWP plugin (3rd-party, edge-case bugs)", custom: "Official Storefront API + webhooks" },
  { criterion: "Security surface", wp: "PHP + plugins — Wordfence + update discipline", custom: "Small auditable codebase, scoped tokens, hosted checkout" },
  { criterion: "Who edits content after handover", wp: "Client, themselves", custom: "Via admin dashboard (small retainer beyond it)" },
  { criterion: "Delivery risk", wp: "Medium–High — plugin roulette", custom: "Low–Medium — one codebase you control" },
];

export default function TechComparison() {
  return (
    <section id="compare" className="scroll-mt-24 border-y border-line bg-moss-tint/40">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <SectionHeading
          eyebrow="02 · WordPress vs headless"
          title="The cheaper-looking option costs more by month two"
          intro="Option A saves ৳7,000 upfront and then charges ৳4,000 more every month while capping your speed and handing you WordPress to patch. Option B is the recommendation — and it lands in the strongest delivery stack."
        />

        <div className="mt-10 overflow-x-auto rounded-2xl border border-line bg-surface shadow-sm">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Criterion
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  A · WordPress + Shopify plugin
                </th>
                <th className="bg-moss/5 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-moss-deep">
                  B · Next.js + API + admin ★
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.criterion} className="transition-colors hover:bg-paper">
                  <td className="px-6 py-4 font-medium text-ink">{r.criterion}</td>
                  <td className="px-6 py-4 text-sm text-ink-soft">{r.wp}</td>
                  <td className="bg-moss/5 px-6 py-4 text-sm text-ink-soft">
                    {r.custom.split("**").map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className="font-semibold text-moss-deep">{part}</strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-6 opacity-95">
            <h3 className="font-display text-lg font-bold text-ink-soft">Option A — why it's discouraged</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Two bills and two update cycles forever, a 75–85 Lighthouse speed ceiling, buy-buttons
              that are never 100% native, and WordPress security as your permanent responsibility (or a
              retainer you keep paying). It's the right answer only for a client who insists on editing
              every page themselves and accepts the patching burden in writing.
            </p>
          </div>
          <div className="rounded-2xl border border-moss/40 bg-moss-tint/60 p-6 ring-1 ring-moss/15">
            <h3 className="font-display text-lg font-bold text-moss-deep">Option B — the recommendation ★</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              One codebase you fully control, zero Liquid and zero WordPress patching, 90+ Lighthouse,
              an admin dashboard so your team never touches code — and the lowest year-1 total of the
              two. It's built in React/Next, the strongest delivery stack, so delivery risk is Low–Medium
              instead of plugin roulette.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
