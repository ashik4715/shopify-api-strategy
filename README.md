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

- **Home** — Hero, assumptions strip, two-option investment summary (৳58,000 / ৳65,000), WordPress-vs-headless comparison, plugin stack, **separate maintenance tables**, timelines with revision rounds, recommendation, quote form (appended to a local JSON file).
- **/proposals** — the Proposal Library: two markdown proposals with **Download .md** (blob) and **Download .pdf** (generated in-browser with jsPDF from the same markdown, styled per the client template: green `#108a00` h1, navy `#002347` h2, `#f4f6f8` table headers, page-break divs honored) plus a rendered preview.
- **API** — `POST /api/inquiry` (validates + appends to the JSON store), `GET /api/health`.

---

## 3. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, TypeScript) |
| Styling | Tailwind CSS v4 (`@theme` tokens in `globals.css`) |
| Fonts | `next/font/google` — Sora (display) + Inter (body) |
| Storage | JSON file — write-only append log (`data/inquiries.json`), no DB server |
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
│   └── lib/
│       └── inquiries-json.ts             # JSON file store (read + append, atomic write)
├── data/inquiries.json                   # write-only inquiry store (gitignored)
├── .env                                  # optional INQUIRIES_FILE override (never commit)
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

# 2. run — no database, no env vars required
npm run dev        # http://localhost:3000

# 3. verify
npm run typecheck
npm run lint
npm run build
```

### Inquiry store (`src/lib/inquiries-json.ts`)

Inquiries are appended to `data/inquiries.json` — a write-only JSON file that is
gitignored and created on the first submission. No database server, no migrations.

```json
[
  {
    "id": "9f1c2c9e-5e1a-4a0e-9f3e-2f0b6d2a7c11",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": null,
    "option": "custom",
    "message": "We sell handmade ceramics.",
    "createdAt": "2026-10-25T04:12:33.120Z"
  }
]
```

- Writes are serialized and atomic (temp file + rename), so concurrent submissions cannot corrupt or drop rows.
- `GET /api/health` returns `{"ok":true,"count":N}` — the number of stored inquiries.
- Set `INQUIRIES_FILE=/absolute/path/inquiries.json` to move the store (e.g. a mounted volume).
- The file is the source of truth for inquiries: back it up, and never commit it.

---

## 6. How the downloads work

- **`.md` download** — `src/app/proposals/page.tsx` (server) reads `proposals/*.md` with `fs/promises` at build time and passes the text to `ProposalLibrary`. The button creates a `Blob` → `URL.createObjectURL` → `<a download>`. No API round-trip.
- **`.pdf` download** — `buildPdf()` in `ProposalLibrary.tsx` dynamically imports `jspdf` and renders the same markdown: strips YAML front matter and `<style>`, converts `<div page-break>` to `addPage()`, draws headings in brand colors, and renders tables as real grids (filled `#f4f6f8` header, `#e0e0e0` borders) with content-weighted column widths.
- **Edit content = edit the `.md` files.** The preview and PDF can never drift from the markdown.
- **Storage-independent** — the download path never touches the inquiry store, so `.md` and `.pdf` exports are byte-for-byte identical to the PostgreSQL version of this site.

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
   Before pushing: create `.gitignore` containing `.env`, `.next/`, `node_modules/` and `data/inquiries.json`. **Never commit `.env` or the inquiry file.**

2. **Import the repo** — vercel.com → *Add New Project* → import the repo.
   - Framework preset: **Next.js** (auto-detected, no build overrides needed)
   - Build command: `next build` (default) · Output: `.next` (default)

3. **Environment variables** (Project → Settings → Environment Variables):
   ```
   INQUIRIES_FILE = /tmp/inquiries.json   # optional; only meaningful on a writable volume
   ```
   Add `SHOPIFY_*` vars later if you wire real Shopify data — server-side only unless prefixed `NEXT_PUBLIC_`.

4. **Deploy** — *Deploy*. First build takes ~1–2 min. Verify:
   - `/api/health` → `{"ok":true,"count":0}`
   - `/proposals` → both cards with Download .md / .pdf
   - submit the quote form → the inquiry is appended to the store file

   > **Serverless caveat:** Vercel functions have an ephemeral, read-only bundle filesystem, so the JSON store does not persist there. Deploy to a host with a persistent writable volume (VPS, Docker, Fly.io with a volume) or keep a hosted database for production; the JSON store is intended for local development and single-server deployments.

5. **Every push to `main` redeploys**; PRs get preview URLs.

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
| Form destination | `src/app/api/inquiry/route.ts` (currently JSON file append; swap for email/Slack webhook) |
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
