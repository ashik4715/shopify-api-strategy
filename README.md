# ShopCraft — Shopify Store Proposal Site

**Rebuild locally and ship to Vercel from GitHub.**

---

## 1. Live links (this deployment)

| Page | URL |
|---|---|
| Home (proposal landing) | `https://3000-ikcwu3nua8mv8h7utk0dj.e2b.app/` |
| **Proposal Library (.md + .pdf downloads)** | `https://3000-ikcwu3nua8mv8h7utk0dj.e2b.app/proposals` |
| Healthcheck API | `https://3000-ikcwu3nua8mv8h7utk0dj.e2b.app/api/health` |

> Preview links rotate when the sandbox redeploys — after you push to your own GitHub/Vercel you get a permanent URL.

---

## 2. What it is

A Next.js (App Router) proposal site for a Shopify storefront business:

- **Home** — Hero, assumptions strip, two-option investment summary (৳58,000 / ৳65,000), WordPress-vs-headless comparison, plugin stack, **separate maintenance tables**, timelines with revision rounds, recommendation, quote form (saved to PostgreSQL).
- **/proposals** — the Proposal Library: two markdown proposals with **Download .md** (blob) and **Download .pdf** (generated in-browser with jsPDF from the same markdown, styled per the client template: green `#108a00` h1, navy `#002347` h2, `#f4f6f8` table headers, page-break divs honored) plus a rendered preview.
- **API** — `POST /api/inquiry` (validates + inserts into Postgres), `GET /api/health`.

---

## 3. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, TypeScript) |
| Styling | Tailwind CSS v4 (`@theme` tokens in `globals.css`) |
| Fonts | `next/font/google` — Sora (display) + Inter (body) |
| Database | PostgreSQL via Drizzle ORM (`node-postgres` pool) |
| PDF | `jspdf` (dynamic import, client-side only) |
| Icons | inline SVG (no icon library) |

---

## 4. Repository file tree

```
.
├── proposals/                          # ★ the two client proposals (source of truth)
│   ├── option-a-wordpress-shopify.md   # Option A · ৳58,000 · maintenance-heavy
│   └── option-b-react-shopify-api.md   # Option B · ৳65,000 · RECOMMENDED
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # fonts, metadata, globals.css
│   │   ├── page.tsx                    # home composition
│   │   ├── globals.css                 # @theme tokens (colors, fonts)
│   │   ├── proposals/page.tsx          # reads proposals/*.md via fs, passes to client
│   │   └── api/
│   │       ├── health/route.ts         # GET  → { ok }
│   │       └── inquiry/route.ts        # POST → validates + inserts inquiries
│   ├── components/
│   │   ├── Navbar.tsx                  # sticky nav, links to /proposals
│   │   ├── Hero.tsx
│   │   ├── Assumptions.tsx
│   │   ├── InvestmentSummary.tsx       # Option A/B cards, milestones, exclusions
│   │   ├── TechComparison.tsx
│   │   ├── Plugins.tsx
│   │   ├── Recurring.tsx               # maintenance cost per option (separate)
│   │   ├── Timeline.tsx
│   │   ├── Recommendation.tsx
│   │   ├── InquiryForm.tsx             # client form → POST /api/inquiry
│   │   ├── ProposalLibrary.tsx         # ★ MD download + jsPDF renderer + preview
│   │   ├── SectionHeading.tsx
│   │   └── Footer.tsx
│   └── db/
│       ├── index.ts                    # pg Pool from process.env.DATABASE_URL
│       └── schema.ts                   # inquiries table
├── drizzle.config.json                 # drizzle-kit push config
├── .env                                # DATABASE_URL (never commit)
├── next.config.ts
├── package.json
├── tsconfig.json
└── REBUILD.md                          # this file
```

---

## 5. Local setup

```bash
# 1. install
npm install

# 2. env
cp .env.example .env
# edit .env:
#   DATABASE_URL=postgresql://USER:PASS@HOST:5432/DBNAME

# 3. create the table
npx drizzle-kit push

# 4. run
npm run dev        # http://localhost:3000

# 5. verify
npm exec tsc -- --noEmit
npm run build
```

Local Postgres options: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=app_db postgres:16`, or any managed Postgres (Neon, Supabase, Vercel Postgres).

### Database schema (`src/db/schema.ts`)

```ts
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const inquiries = pgTable("inquiries", {
  id: varchar("id", { length: 36 }).primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  option: varchar("option", { length: 20 }).notNull().default("undecided"),
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
```

After changing the schema: `npx drizzle-kit push`.

---

## 6. How the downloads work

- **`.md` download** — `src/app/proposals/page.tsx` (server) reads `proposals/*.md` with `fs/promises` at build time and passes the text to `ProposalLibrary`. The button creates a `Blob` → `URL.createObjectURL` → `<a download>`. No API round-trip.
- **`.pdf` download** — `buildPdf()` in `ProposalLibrary.tsx` dynamically imports `jspdf` and renders the same markdown: strips YAML front matter and `<style>`, converts `<div page-break>` to `addPage()`, draws headings in brand colors, and renders tables as real grids (filled `#f4f6f8` header, `#e0e0e0` borders) with content-weighted column widths.
- **Edit content = edit the `.md` files.** The preview and PDF can never drift from the markdown.

---

## 7. Ship to Vercel (GitHub)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "ShopCraft proposal site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USER/shopcraft.git
   git push -u origin main
   ```
   Before pushing: create `.gitignore` containing `.env`, `.next/`, `node_modules/` and an `.env.example` with `DATABASE_URL=` placeholder. **Never commit `.env`.**

2. **Create a Postgres database** — Vercel Dashboard → *Storage* → *Create Database* (Vercel Postgres / Neon), or use an external Neon/Supabase URL.

3. **Import the repo** — vercel.com → *Add New Project* → import the repo.
   - Framework preset: **Next.js** (auto-detected, no build overrides needed)
   - Build command: `next build` (default) · Output: `.next` (default)

4. **Environment variables** (Project → Settings → Environment Variables):
   ```
   DATABASE_URL = <your production postgres URL>   # Production + Preview + Development
   ```
   Add `SHOPIFY_*` vars later if you wire real Shopify data — server-side only unless prefixed `NEXT_PUBLIC_`.

5. **Create the table in production:**
   ```bash
   DATABASE_URL="<production url>" npx drizzle-kit push
   ```
   (or run it locally with the production URL in `.env`, then remove it).

6. **Deploy** — *Deploy*. First build takes ~1–2 min. Verify:
   - `/api/health` → `{"ok":true}`
   - `/proposals` → both cards with Download .md / .pdf
   - submit the quote form → row appears in the `inquiries` table

7. **Every push to `main` redeploys**; PRs get preview URLs.

---

## 8. Customization cheatsheet

| Want to change | Where |
|---|---|
| Colors (moss/amber/paper/ink) | `src/app/globals.css` → `@theme` tokens |
| Fonts | `src/app/layout.tsx` (`next/font/google`) + `--font-display` / `--font-body` |
| Prices, timelines, benchmarks | `proposals/*.md` **and** `src/app/proposals/page.tsx` (card meta) + `InvestmentSummary.tsx` |
| Proposal PDF colors | `<style>` block inside each `.md` + constants `GREEN/NAVY/BORDER/THBG` in `ProposalLibrary.tsx` |
| Payment milestones (30/40/30) | `InvestmentSummary.tsx` + both `.md` files |
| Section order on home | `src/app/page.tsx` |
| Form destination | `src/app/api/inquiry/route.ts` (currently DB insert; swap for email/Slack webhook) |
| Site metadata | `src/app/layout.tsx` |

---

## 9. Validation commands (run before every ship)

```bash
npx next typegen          # route types
npm exec tsc -- --noEmit  # TypeScript
npm run build             # production build
```

All three must pass. Then on Vercel: check `/api/health` returns `{"ok":true}` after deploy.

---

## 10. The two proposals (content inventory)

| | Option A | Option B ★ |
|---|---|---|
| File | `proposals/option-a-wordpress-shopify.md` | `proposals/option-b-react-shopify-api.md` |
| Stack | WordPress (Gutenberg) + ShopWP | Next.js headless + Storefront API + admin dashboard |
| Build price | ৳58,000 | ৳65,000 |
| Timeline | 4 weeks (4-day revision) | 5–6 weeks (5-day revision) |
| Maintenance | ≈৳8,760/mo (separate §5) | ≈৳4,760/mo (separate §5) |
| Year-1 total | ≈৳163,120 | ≈৳122,120 |
| Benchmark | holofootwearinc.com | fleurandbee.com |
| Posture | Present, discourage | **Lead with this** |

Both files follow the client template: YAML front matter → `<style>` block → title/prepared-for → exec summary → 3 phases → page-break → timeline table → financial table + 30/40/30 milestones → maintenance table → why/trade-offs → page-break → next steps → internal appendix (never send to client).
