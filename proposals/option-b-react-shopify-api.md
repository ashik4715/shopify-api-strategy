---
geometry: margin=1in
fontsize: 11pt
fontfamily: sans
---

<style>
body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #333333; line-height: 1.5; }
h1 { color: #108a00; border-bottom: 2px solid #108a00; padding-bottom: 5px; margin-top: 20px; }
h2 { color: #002347; margin-top: 15px; margin-bottom: 8px; }
th { background-color: #f4f6f8; color: #002347; text-align: left; }
table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
th, td { padding: 8px; border: 1px solid #e0e0e0; font-size: 10.5pt; }
</style>

# PROJECT PROPOSAL: SHOPIFY STOREFRONT — OPTION B (NEXT.JS HEADLESS + ADMIN DASHBOARD)

**Prepared for:** [Client Name / Company]
**Prepared by:** [Your Name / Agency]
**Date:** February 2026

---

## 1. Executive Summary

* **The Problem:** A theme-and-plugin storefront caps your speed, your design freedom and your control — and hands you a monthly maintenance burden you did not sign up for.
* **The Solution:** A **Next.js headless storefront wired to the Shopify API, with your own admin dashboard** — Shopify's brain (catalog, inventory, orders, checkout) behind a front end we fully control, plus a single panel where your team manages orders, products, content and inquiries.
* **The Goal:** A conversion-grade store benchmarked against **fleurandbee.com** — quiz-driven discovery, editorial storytelling, COD express checkout — live in **5–6 weeks** at a fixed **৳65,000**, running at only **≈৳4,800/month**.
* **Why This Is The Recommended Option:** lowest month-1 running cost of the two, **90+ Lighthouse**, zero WordPress to patch, and **year-1 total ≈৳122,600 vs ≈৳163,120 for Option A** — the expensive-looking option is the cheap one by month two.

## 2. Project Scope & Deliverables

Delivery is organized in three tight, sequential phases:

* **Phase 1 — Discovery & Design System (Days 1–12):** Catalog model, quiz logic, content plan; design system first, then 8 templates in Figma (home, collection, PDP, lookbook, quiz, cart drawer, blog, contact).
* **Phase 2 — Storefront + Admin Dashboard (Days 13–30):** Next.js build — SSR/ISR pages, cart drawer, smart search, filters, mega-menu, editorial blog; **admin dashboard** (orders, product overview, content/inquiry management) talking to the Shopify Storefront + Admin API; COD express form → draft orders.
* **Phase 3 — Integration, QA & Launch (Days 31–40):** Checkout handoff, webhooks, Pixel/CAPI + GA4, JSON-LD SEO, device-lab QA, Core Web Vitals pass, one consolidated revision round, training and handover.

**Included in the quote:** Up to 20 products with variants · 8 collections · admin dashboard for orders/content/inquiries · cart drawer + Shopify secure checkout · COD express (20-second order) · reviews, blog, smart search · Pixel + CAPI + GA4 + full technical SEO · ONE revision round + 30-day bug-fix window.
**Explicitly excluded:** Logo/brand identity design · product photography · native mobile app · multi-currency markets (phase 2) · Shopify Plus checkout customisation.

<div style="page-break-before: always;"></div>

## 3. Project Timeline & Milestones

| Milestone / Deliverable | Duration | Target |
| :--- | :--- | :--- |
| **01: Architecture + design system sign-off** | Weeks 1–2 | Day 12 from kickoff |
| **02: Next.js storefront + admin dashboard** | Weeks 3–4 | Day 30 from kickoff |
| **03: Shopify API wiring, payments, content, QA** | Week 5 | Day 35 from kickoff |
| **04: Revision round (5 days) + launch + training** | Weeks 5–6 | Day 40 from kickoff |

Timeline: **5–6 weeks**, including one 5-day consolidated revision round inside the schedule (days 36–40). One change-list, then go-live.

## 4. Financial Investment

Fixed-price model tied to verifiable milestones.

| Line Item | Scope | Price |
| :--- | :--- | :--- |
| UX/UI design + design system | 8 templates + reusable components, quiz flow prototyped | ৳14,000 |
| Next.js storefront build | SSR/ISR, cart, search, filters, mega-menu, blog, 90+ Lighthouse target | ৳20,000 |
| Shopify API + **admin dashboard** | Storefront API, webhooks, orders/products/content panel, COD → draft orders | ৳16,000 |
| Payments + analytics | COD express, SSLCommerz-ready, Pixel/CAPI, GA4 | ৳6,000 |
| QA + perf + 1 revision + handover | Device lab, Vitals pass, docs, admin videos, deploy pipeline, 30-day bugfix | ৳6,000 |
| Domain + SSL (year 1) | .com registration + DNS | ৳1,500 |
| Contingency | Scope buffer inside agreed scope | ৳1,500 |
| **Total build price** | **Incl. 1 revision + handover** | **৳65,000** |

**Milestones:** 30% deposit on signing (initiates discovery) · 40% on staging deployment sign-off · 30% on production launch and handover.

## 5. Monthly Maintenance (separate from build price)

| Item | Detail | Cost |
| :--- | :--- | :--- |
| Shopify Basic | $39/mo — products, checkout, discounts, analytics | ৳4,563/mo |
| Vercel hosting | Free tier first; Pro ≈$20/mo only when traffic demands it | ৳0/mo |
| Domain + monitoring | Amortised yearly; uptime + status on free tier | ৳200/mo |
| **Run-rate total** | **Paid direct to providers, no markup from us** | **≈ ৳4,760/mo** |

Year-1 total cost of ownership: **৳65,000 + ≈৳57,120 = ≈৳122,120** — about **৳41,000 cheaper than Option A in year one**, with no WordPress updates, no plugin patching and no security surface to babysit.

## 6. Why Clients Pick Option B / Honest Trade-offs

**Why:** fastest, cheapest to run · one codebase you fully control, zero Liquid and zero WordPress patching · 90+ Lighthouse · admin dashboard means your team never touches code · quiz + COD express are proven AOV levers.
**Trade-offs:** content edits beyond the dashboard need a developer (small retainer) · higher one-time build price than Option A · Shopify checkout UI is shared (custom checkout needs Shopify Plus).

<div style="page-break-before: always;"></div>

## 7. Next Steps to Begin

1. **Review and approve** the scope, milestones and maintenance costs outlined above.
2. **Secure the initial milestone** via your preferred contract management or Upwork portal.
3. **Attend the 45-minute kickoff session** to grant Shopify API, domain and analytics access.
4. **Choose your payment flow** — COD express, bKash/Nagad manual, or SSLCommerz — and we configure it in Phase 2.

---

## Appendix — INTERNAL ONLY (do not send to client)

**Labor allocation (not client-facing):** design system ৳14,000 + storefront ৳20,000 + API/admin dashboard ৳16,000 + payments/analytics ৳6,000 + QA/revision/handover ৳6,000 = **৳62,000 labor** (≥৳40,000 floor ✓) · infra ৳1,500 · contingency ৳1,500 → ৳65,000.
**Effort:** ~95 hrs ≈ ৳653/hr effective — home-turf build (React/Next is your strongest stack); estimates should beat actuals, so margin comes in on speed. Delivery risk: **Low–Medium**.
**Sales posture:** lead with this option; frame Option A honestly as the cheaper-upfront-but-heavier-maintenance alternative so the client chooses B themselves.
