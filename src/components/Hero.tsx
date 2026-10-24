export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_80%_-10%,var(--color-moss-tint),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 sm:pb-24 sm:pt-24">
        <div className="max-w-3xl">
          <span className="rise inline-flex items-center gap-2 rounded-full border border-moss/25 bg-moss-tint px-4 py-1.5 text-sm font-medium text-moss-deep">
            <span className="h-2 w-2 rounded-full bg-moss" />
            Shopify store proposals · Option B recommended
          </span>

          <h1 className="rise mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            One codebase you control.{" "}
            <span className="text-moss">Shopify's brain, your front end.</span>
          </h1>

          <p className="rise mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Two routes to a Shopify-powered store — benchmarked against{" "}
            <strong className="font-semibold text-ink">fleurandbee.com</strong> (Next.js headless + admin
            dashboard) and <strong className="font-semibold text-ink">holofootwearinc.com</strong>{" "}
            (WordPress + Shopify plugin). Both under the ৳70K cap, maintenance shown separately, one
            revision round and handover included in every timeline.
          </p>

          <div className="rise mt-9 flex flex-wrap items-center gap-4">
            <a
              href="/proposals"
              className="rounded-xl bg-moss px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-moss-deep"
            >
              Download both proposals (.md + .pdf) →
            </a>
            <a
              href="#invest"
              className="rounded-xl border border-line bg-surface px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-moss/40 hover:text-moss-deep"
            >
              Compare the numbers
            </a>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { k: "৳65,000", v: "Option B · Next.js + admin dashboard · 5–6 wks · RECOMMENDED" },
            { k: "৳58,000", v: "Option A · WordPress + Shopify plugin · 4 wks · maintenance-heavy" },
            { k: "৳4,800", v: "B monthly maintenance (vs ৳8,800 for A) — shown separately" },
            { k: "৳41K less", v: "Option B year-1 total vs Option A (৳122K vs ৳163K)" },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
              <dt className="font-display text-2xl font-bold text-moss sm:text-3xl">{s.k}</dt>
              <dd className="mt-1.5 text-sm leading-snug text-ink-soft">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
