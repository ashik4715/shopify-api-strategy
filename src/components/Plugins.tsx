import { SectionHeading } from "./SectionHeading";

type Plugin = {
  name: string;
  price: string;
  tag: "Essential" | "Recommended" | "Optional";
  why: string;
};

const plugins: Plugin[] = [
  {
    name: "WP Shopify",
    price: "৳12,000 / yr",
    tag: "Essential",
    why: "Syncs your Shopify catalog into WordPress with cart & checkout — the bridge that makes this whole stack work.",
  },
  {
    name: "Rank Math SEO",
    price: "Free (Pro ৳1,500/yr)",
    tag: "Essential",
    why: "On-page SEO, schema markup, XML sitemaps, and 404 monitoring. Free tier is enough to start.",
  },
  {
    name: "Wordfence Security",
    price: "Free",
    tag: "Essential",
    why: "Web-application firewall and malware scanner — non-negotiable for any WordPress site.",
  },
  {
    name: "UpdraftPlus",
    price: "Free (backup add-on paid)",
    tag: "Essential",
    why: "Scheduled backups to Google Drive with one-click restore. Your safety net before updates.",
  },
  {
    name: "WP Rocket",
    price: "৳7,000 / yr",
    tag: "Recommended",
    why: "Caching + lazy-load + minification. Biggest single speed win on WordPress; LiteSpeed Cache is the free fallback.",
  },
  {
    name: "ShortPixel",
    price: "Free (1,000/mo)",
    tag: "Recommended",
    why: "Automatically compresses and converts images to WebP — critical for product-heavy stores.",
  },
  {
    name: "WPForms Lite",
    price: "Free",
    tag: "Recommended",
    why: "Contact and inquiry forms with spam protection. Your storefront needs a reliable contact channel.",
  },
  {
    name: "Redirection",
    price: "Free",
    tag: "Optional",
    why: "Manages 301 redirects when products or pages change — protects SEO during catalog edits.",
  },
];

const tagStyles: Record<Plugin["tag"], string> = {
  Essential: "bg-moss-tint text-moss-deep",
  Recommended: "bg-amber-tint text-amber",
  Optional: "bg-paper text-ink-soft",
};

export default function Plugins() {
  return (
    <section id="plugins" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:py-24">
      <SectionHeading
        eyebrow="03 · Plugin stack"
        title="The exact plugins I recommend"
        intro="A lean stack — no plugin bloat. Every plugin below earns its place in your WordPress route, with prices in BDT."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plugins.map((p) => (
          <article
            key={p.name}
            className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-base font-bold leading-snug text-ink">{p.name}</h3>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tagStyles[p.tag]}`}
              >
                {p.tag}
              </span>
            </div>
            <p className="mt-2 font-display text-sm font-semibold text-moss">{p.price}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{p.why}</p>
          </article>
        ))}
      </div>

      <p className="mt-6 text-sm text-ink-soft">
        One note: the WP Shopify plugin requires an active Shopify subscription (Shopify Basic,
        $39/mo annual billing ≈ ৳4,500–৳4,700/mo) for your products and checkout — paid directly to
        Shopify and included in the monthly operating cost, not in the Project Investment.
      </p>
    </section>
  );
}
