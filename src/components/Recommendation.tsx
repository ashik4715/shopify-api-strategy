export default function Recommendation() {
  return (
    <section className="border-y border-line bg-moss">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-moss-tint/80">
          06 · Recommendation
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Lead with Option B. Present Option A honestly, let the math do the rest.
        </h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="space-y-4 text-moss-tint">
            <p className="text-lg leading-relaxed">
              <strong className="font-semibold text-white">★ Option B — Next.js headless + Shopify API
              + admin dashboard:</strong> ৳65,000 build, 5–6 weeks, ≈৳4,800/month to run, 90+
              Lighthouse, one panel for orders/content, nothing to patch. Year-1 total ≈৳122,000 —
              <em className="not-italic font-semibold text-white"> ৳41,000 cheaper than Option A</em>,
              and it&apos;s built in the strongest delivery stack.
            </p>
            <p className="text-lg leading-relaxed">
              <strong className="font-semibold text-white">Option A — WordPress + Shopify plugin:</strong>{" "}
              ৳58,000 looks like the budget pick, but ≈৳8,800/month maintenance, two update cycles
              forever, a 75–85 Lighthouse ceiling and plugin roulette on delivery. Show it as the
              comparison — clients usually talk themselves out of it once they see Section 5.
            </p>
            <p className="text-lg leading-relaxed">
              Both proposals are written in your client template (green/navy styling, page-break
              markers, milestone payments 30/40/30) and ready to download below.
            </p>
          </div>

          <div className="rounded-2xl bg-white/95 p-6 shadow-lg">
            <h3 className="font-display text-lg font-bold text-ink">Decision rule</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-line pb-3">
                <dt className="text-ink-soft">Default recommendation</dt>
                <dd className="font-semibold text-moss-deep">Option B · ৳65,000</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-line pb-3">
                <dt className="text-ink-soft">Client insists on self-editing everything</dt>
                <dd className="font-semibold text-amber">Option A · ৳58,000</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-line pb-3">
                <dt className="text-ink-soft">Budget below ৳65K</dt>
                <dd className="font-semibold text-amber">Option A (disclose maintenance)</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Long-term store, brand-led UX</dt>
                <dd className="font-semibold text-moss-deep">Option B only</dd>
              </div>
            </dl>
            <a
              href="/proposals"
              className="mt-6 block rounded-xl bg-moss px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-moss-deep"
            >
              Download both proposals (.md + .pdf)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
