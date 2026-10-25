"use client";

import { useMemo, useRef, useState } from "react";

// Proposal Studio — ported from the standalone Proposal Studio tool.
// Reusable proposals for any client. Three built-in X Limited approaches,
// all capped at 45,000 BDT, 4-6 weeks. Saved proposals live in the browser
// (localStorage); PDF download uses jsPDF client-side, like ProposalLibrary.
// This route does not touch the existing home or /proposals pages.

type Fields = Record<string, string>;

const APPROACH: Record<string, { label: string; platform: string; deposit: string; payment: string; blurb: string }> = {
  A: { label: "Option A — WordPress", platform: "WordPress + WooCommerce / Shopify-style · cPanel or shared hosting · Familiar admin", deposit: "50", payment: "50% start\n30% after core build\n20% after testing, deployment and handover", blurb: "Recommended for a standard launch. Faster to build, familiar administration and lower initial investment." },
  B: { label: "Option B — Laravel + React", platform: "Laravel API + React storefront · VPS or cloud · Custom admin and business logic", deposit: "40", payment: "40% start\n30% after core build\n20% after review\n10% final handover", blurb: "Recommended when you want deeper customization, stronger control over business logic and a platform for future integrations." },
  C: { label: "Option C — Next.js / NestJS", platform: "Next.js storefront / NestJS API · Vercel or VPS · Flat fee · Strongest potential for faster interaction", deposit: "50", payment: "50% start\n30% after core build\n20% handover", blurb: "Recommended for the fastest-feeling storefront, with very high customization in code and a flat fee." },
};

const BASE: Fields = {
  freelancer: "Md. Shahriar Haque", freelancerTitle: "Freelance Web Developer", freelancerEmail: "", freelancerPhone: "01723757103",
  clientCompany: "X Limited", clientContact: "", projectTitle: "X Limited — E-Commerce Website Proposal",
  summary: "X Limited, a modern denim brand, requires a professional, responsive, conversion-focused e-commerce web platform with a dedicated management dashboard for day-to-day independent store operations.",
  scope: "Storefront — Modern responsive layout for desktop, tablet and mobile\nCatalogue — Categories, sizes, colors and item variations\nCheckout flow — Shopping cart, secure checkout workflow and order management\nCustomer management — Accounts, purchase history and profile tracking\nPromotions — Coupons, discounts and basic promotional controls\nOperations — Shipping config, store settings, SEO, analytics and Meta Pixel, performance\nHandover — Deployment, configuration, testing and official handover",
  deliverables: "Live, tested e-commerce website\nAdmin dashboard for products, orders, stock, customers, promotions and settings\nConfigured site, admin access and operational guidance\nTesting, cross-device checks, client review, fixes, deployment and training",
  timeline: "4–6 weeks",
  milestones: "Week 1: Requirements gathering, sitemap, design direction, key UI/UX planning\nWeek 2: Core storefront, responsive layouts, product/category structure\nWeek 3: Cart, checkout, variations, order workflows, dashboard\nWeek 4: Payment + shipping setup, analytics, Meta Pixel, SEO basics\nWeek 5: Testing, cross-device checks, client review, fixes, deployment, training, handover",
  currency: "BDT", price: "45000", validity: "14",
  notes: "Fees are development only. Domains, hosting, premium plugins, gateways, SMS and courier APIs are separate unless bundled.\nScope is fixed at sign-off; major changes after sign-off cost extra and shift the timeline.\nThird-party charges (domain renewal, hosting, gateway fees, SMS, courier API, transactional email) are separate.\nIf the client wishes to use Shopify Starter, budget about ৳600/month, ~৳7,200/year (USD 5/month, billed separately).",
};

const PRESETS: Record<string, Fields> = {
  "X Limited — Option A (WordPress)": { ...BASE, approach: "A", platform: APPROACH.A.platform, deposit: "50", paymentLines: APPROACH.A.payment },
  "X Limited — Option B (Laravel + React)": { ...BASE, approach: "B", platform: APPROACH.B.platform, deposit: "40", paymentLines: APPROACH.B.payment },
  "X Limited — Option C (Next.js / NestJS)": { ...BASE, approach: "C", platform: APPROACH.C.platform, deposit: "50", paymentLines: APPROACH.C.payment },
};

const INITIAL: Fields = { ...PRESETS["X Limited — Option B (Laravel + React)"], saveName: "X Limited — Option B (Laravel + React)", savedList: "X Limited — Option B (Laravel + React)" };

function lines(v: string) { return v.split("\n").map((s) => s.trim()).filter(Boolean); }
function slugify(v: string) { return (v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "proposal"); }

export default function ProposalStudio() {
  const [f, setF] = useState<Fields>(INITIAL);
  const [notice, setNotice] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);
  const set = (k: string) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));
  const symbols: Record<string, string> = { BDT: "৳", USD: "$", EUR: "€", GBP: "£" };
  const money = (n: number) => `${symbols[f.currency] || ""}${n.toLocaleString("en-US")}`;
  const price = Number(f.price || 0);
  const savedNames = useMemo(() => {
    if (typeof window === "undefined") return [];
    try { return Object.keys(JSON.parse(localStorage.getItem("proposalStudio") || "{}")); } catch { return []; }
  }, [f.saveName, notice]);

  function applyPreset(key: "A" | "B" | "C") {
    const name = key === "A" ? "X Limited — Option A (WordPress)" : key === "B" ? "X Limited — Option B (Laravel + React)" : "X Limited — Option C (Next.js / NestJS)";
    setF({ ...PRESETS[name], saveName: name, savedList: name });
  }
  function applyApproach(val?: string) {
    const a = APPROACH[val || f.approach]; if (!a) return;
    setF((p) => ({ ...p, platform: a.platform, deposit: a.deposit, paymentLines: a.payment }));
  }
  function loadSaved() {
    const name = f.savedList; if (!name) return;
    if (PRESETS[name]) { setF({ ...PRESETS[name], saveName: name, savedList: name }); return; }
    try {
      const all = JSON.parse(localStorage.getItem("proposalStudio") || "{}");
      if (all[name]) setF({ ...all[name], saveName: name, savedList: name });
    } catch { /* keep current */ }
  }
  function saveProposal() {
    const name = f.saveName.trim(); if (!name) { setNotice("Give the saved proposal a name first."); return; }
    try {
      const all = JSON.parse(localStorage.getItem("proposalStudio") || "{}");
      all[name] = f; localStorage.setItem("proposalStudio", JSON.stringify(all)); setNotice(`Saved: ${name}`);
    } catch { setNotice("Could not save in this browser."); }
  }
  function downloadBlob(content: string, filename: string, type: string) {
    const b = new Blob([content], { type }); const a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = filename; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function downloadMd() {
    const md = `# ${f.projectTitle}\n\nPrepared for: ${f.clientCompany}\nPrepared by: ${f.freelancer} ${f.freelancerPhone}\nTimeline: ${f.timeline}\nPlatform: ${f.platform}\nFee: ${money(price)}\n\n## Summary\n${f.summary}\n\n## Scope\n${lines(f.scope).map((x) => `- ${x}`).join("\n")}\n\n## Deliverables\n${lines(f.deliverables).map((x) => `- ${x}`).join("\n")}\n\n## Timeline\n${lines(f.milestones).map((x) => `- ${x}`).join("\n")}\n\n## Payment\n${lines(f.paymentLines).map((x) => `- ${x}`).join("\n")}\n\n## Notes\n${lines(f.notes).map((x) => `- ${x}`).join("\n")}\n`;
    downloadBlob(md, `${slugify(f.clientCompany)}-proposal.md`, "text/markdown");
  }
  async function downloadPdf() {
    try {
      const { jsPDF } = await import("jspdf");
      type RGB = [number, number, number];
      const TEAL: RGB = [17, 62, 63];
      const GOLD: RGB = [229, 169, 59];
      const CREAM: RGB = [247, 245, 240];
      const CHAR: RGB = [44, 62, 80];
      const MUTED: RGB = [102, 102, 102];
      const WHITE: RGB = [255, 255, 255];
      const LINE: RGB = [222, 226, 226];
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      const M = 42;
      const CW = W - M * 2;
      let y = 0;
      const clean = (s: string) => s.replace(/[—–]/g, "-").replace(/৳/g, "BDT ");
      const moneyPdf = (n: number) => (f.currency === "USD" ? `$${n.toLocaleString("en-US")}` : `${f.currency} ${n.toLocaleString("en-US")}`);
      const fill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
      const stroke = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
      const txtColor = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
      const newPage = () => { doc.addPage(); y = 42; };
      const ensure = (need: number) => { if (y + need > H - 42) newPage(); };
      const para = (text: string, size = 10.5, bold = false, color: RGB = CHAR, x: number = M, width: number = CW, leadMul = 1.45) => {
        doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(size); txtColor(color);
        const lead = size * leadMul;
        (doc.splitTextToSize(clean(text), width) as string[]).forEach((l) => { ensure(lead); doc.text(l, x, y); y += lead; });
      };
      const gap = (n: number) => { y += n; };
      const section = (num: string, title: string) => {
        ensure(56);
        doc.setFont("helvetica", "bold"); doc.setFontSize(11); txtColor(TEAL);
        doc.text(`${num}  -  ${title.toUpperCase()}`, M, y); y += 8;
        fill(GOLD); doc.rect(M, y, 44, 2.5, "F"); y += 16;
      };
      const bullet = (text: string) => {
        const lead = 15;
        doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); txtColor(CHAR);
        const wrapped = doc.splitTextToSize(clean(text), CW - 18) as string[];
        wrapped.forEach((l, i) => {
          ensure(lead);
          if (i === 0) { fill(GOLD); doc.circle(M + 4, y - 3.5, 3, "F"); }
          doc.text(l, M + 18, y); y += lead;
        });
        y += 2;
      };
      const drawTable = (headers: string[], rows: string[][], widths: number[]) => {
        const headerH = 26;
        const drawHeader = () => {
          fill(CREAM); doc.rect(M, y, CW, headerH, "F");
          stroke(LINE); doc.setLineWidth(0.5); doc.rect(M, y, CW, headerH);
          doc.setFont("helvetica", "bold"); doc.setFontSize(9); txtColor(TEAL);
          let x = M;
          headers.forEach((h, ci) => { doc.text(clean(h), x + 7, y + 17); x += widths[ci]; });
          y += headerH;
        };
        ensure(headerH + 20); drawHeader();
        rows.forEach((row) => {
          doc.setFont("helvetica", "normal"); doc.setFontSize(9); txtColor(CHAR);
          const cellLines = row.map((c, ci) => doc.splitTextToSize(clean(c), widths[ci] - 14) as string[]);
          const h = Math.max(...cellLines.map((l) => l.length)) * 12 + 12;
          if (y + h > H - 42) { newPage(); drawHeader(); }
          stroke(LINE); doc.setLineWidth(0.5); doc.rect(M, y, CW, h);
          let x = M;
          cellLines.forEach((ls, ci) => {
            doc.setFont("helvetica", ci === 0 ? "bold" : "normal"); doc.setFontSize(9); txtColor(CHAR);
            ls.forEach((l, li) => doc.text(l, x + 7, y + 16 + li * 12));
            x += widths[ci];
          });
          y += h;
        });
        y += 10;
      };
      // ---------- COVER ----------
      fill(TEAL); doc.rect(0, 0, W, H, "F");
      y = 52;
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); txtColor(GOLD);
      doc.text(clean(f.clientCompany).toUpperCase(), M, y); y += 34;
      doc.setFont("helvetica", "bold"); doc.setFontSize(34); txtColor(WHITE);
      (doc.splitTextToSize("E-Commerce Website Proposal", CW) as string[]).forEach((l) => { doc.text(l, M, y); y += 38; });
      y += 4;
      doc.setFont("helvetica", "normal"); doc.setFontSize(12); txtColor(WHITE);
      (doc.splitTextToSize("A premium, conversion-focused online store for a modern denim brand.", CW) as string[]).forEach((l) => { doc.text(l, M, y); y += 17; });
      y += 10; fill(GOLD); doc.rect(M, y, 56, 3, "F"); y += 26;
      // tags
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); txtColor(WHITE);
      let tx = M;
      ["Design", "Development", "E-commerce", "Admin Dashboard", "Deployment"].forEach((tag) => {
        const tw = doc.getTextWidth(tag) + 18;
        if (tx + tw > W - M) { tx = M; y += 26; }
        stroke(WHITE); doc.setLineWidth(0.6); doc.roundedRect(tx, y - 11, tw, 20, 10, 10, "S");
        doc.text(tag, tx + 9, y + 3); tx += tw + 8;
      });
      // cover info table at bottom
      const infoY = H - 150;
      stroke(GOLD); doc.setLineWidth(0.6); doc.line(M, infoY - 14, W - M, infoY - 14);
      const cols = [
        ["PREPARED FOR", clean(f.clientCompany)],
        ["PREPARED BY", clean(f.freelancer)],
        ["DELIVERY TARGET", `Approx. ${clean(f.timeline)}`],
        ["CONTACT", clean(f.freelancerPhone)],
      ];
      const colW = CW / 4;
      cols.forEach((c, i) => {
        const x = M + i * colW;
        doc.setFont("helvetica", "bold"); doc.setFontSize(8); txtColor(GOLD); doc.text(c[0], x, infoY);
        doc.setFont("helvetica", "bold"); doc.setFontSize(10); txtColor(WHITE);
        (doc.splitTextToSize(c[1], colW - 10) as string[]).forEach((l, li) => doc.text(l, x, infoY + 16 + li * 14));
      });
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); txtColor(WHITE);
      doc.text("CONFIDENTIAL  -  CLIENT PROPOSAL", M, H - 52);
      fill(GOLD); doc.rect(0, H - 8, W, 8, "F");
      // ---------- 01 PROJECT OVERVIEW ----------
      newPage();
      section("01", "Project Overview");
      para(f.summary, 11, false, CHAR); gap(8);
      para("What the Client Will Receive", 12, true, TEAL); gap(4);
      lines(f.scope).forEach((s) => bullet(s));
      gap(6);
      para("Dedicated Management Dashboard - a key part of the solution, a clean, easy-to-use admin dashboard. Staff will be able to manage products, categories, variations, inventory, orders, customers, coupons, shipping and agreed store settings without depending on the developer for routine operations.", 10.5, false, CHAR);
      gap(10);
      para("Dashboard Capabilities", 12, true, TEAL); gap(6);
      const caps: [string, string][] = [
        ["Products", "Add, edit, organize and publish products."],
        ["Inventory", "Track stock and variation-level availability."],
        ["Orders", "Review orders and update order status."],
        ["Customers", "Customer profiles and purchase history."],
        ["Promotions", "Coupons and discount rules."],
        ["Settings & Reports", "Shipping, store settings and basic overview."],
      ];
      const cardW = (CW - 16) / 3; const cardH = 72;
      for (let r = 0; r < 2; r++) {
        ensure(cardH + 8);
        for (let c = 0; c < 3; c++) {
          const cap = caps[r * 3 + c]; const x = M + c * (cardW + 8);
          fill(CREAM); doc.roundedRect(x, y, cardW, cardH, 6, 6, "F");
          stroke(LINE); doc.setLineWidth(0.5); doc.roundedRect(x, y, cardW, cardH, 6, 6, "S");
          doc.setFont("helvetica", "bold"); doc.setFontSize(10); txtColor(TEAL); doc.text(cap[0], x + 10, y + 20);
          doc.setFont("helvetica", "normal"); doc.setFontSize(9); txtColor(CHAR);
          (doc.splitTextToSize(cap[1], cardW - 20) as string[]).forEach((l, li) => doc.text(l, x + 10, y + 36 + li * 12));
        }
        y += cardH + 8;
      }
      // ---------- 02 PRICING ----------
      newPage();
      section("02", "Pricing & Technology");
      para("All three paths are capped at the same development fee. Fees are development only. Domains, hosting, premium plugins, gateways, SMS and courier APIs are separate unless bundled.", 10.5, false, CHAR); gap(10);
      const priceCardW = (CW - 16) / 3; const priceCardH = 196;
      ensure(priceCardH + 8);
      (["A", "B", "C"] as const).forEach((k, i) => {
        const x = M + i * (priceCardW + 8);
        const selected = f.approach === k;
        fill(CREAM); doc.roundedRect(x, y, priceCardW, priceCardH, 6, 6, "F");
        stroke(selected ? GOLD : LINE); doc.setLineWidth(selected ? 1.5 : 0.5); doc.roundedRect(x, y, priceCardW, priceCardH, 6, 6, "S");
        let cy = y + 20;
        doc.setFont("helvetica", "bold"); doc.setFontSize(8); txtColor(MUTED); doc.text(`PATH ${i + 1}`, x + 10, cy); cy += 16;
        doc.setFont("helvetica", "bold"); doc.setFontSize(10); txtColor(TEAL);
        (doc.splitTextToSize(APPROACH[k].label, priceCardW - 20) as string[]).forEach((l) => { doc.text(l, x + 10, cy); cy += 13; });
        cy += 4; doc.setFont("helvetica", "bold"); doc.setFontSize(17); txtColor(TEAL); doc.text(moneyPdf(45000), x + 10, cy); cy += 16;
        doc.setFont("helvetica", "normal"); doc.setFontSize(8); txtColor(MUTED);
        (doc.splitTextToSize(clean(APPROACH[k].platform), priceCardW - 20) as string[]).forEach((l) => { doc.text(l, x + 10, cy); cy += 11; });
        cy += 6; doc.setFont("helvetica", "normal"); doc.setFontSize(9); txtColor(CHAR);
        (doc.splitTextToSize(clean(APPROACH[k].blurb), priceCardW - 20) as string[]).forEach((l) => { doc.text(l, x + 10, cy); cy += 12; });
      });
      y += priceCardH + 14;
      para(`Selected path: ${APPROACH[f.approach] ? APPROACH[f.approach].label : "Custom"}  -  Fee: ${moneyPdf(price)}  -  Delivery target: ${clean(f.timeline)}`, 10.5, true, TEAL);
      gap(10);
      // ---------- 03 COMPARISON ----------
      section("03", "Platform Comparison");
      drawTable(
        ["Area", "WordPress", "Laravel + React", "Next.js / NestJS"],
        [
          ["Development fee", moneyPdf(45000), moneyPdf(45000), `${moneyPdf(45000)} flat`],
          ["Development speed", "Faster", "Moderate", "Moderate"],
          ["Customization", "Plugin / theme based", "Very high", "Very high, in code"],
          ["Plugin dependency", "Higher", "Lower", "Lowest"],
          ["Infrastructure", "cPanel / shared", "VPS / cloud", "Vercel or VPS"],
          ["Interaction speed", "Theme bound", "React can feel quick", "Fastest potential"],
        ],
        [110, 130, 135, 136]
      );
      para("Choose WordPress when you want the fastest, most familiar launch. Choose Laravel when you want deeper customization and business logic. Choose Next.js / NestJS when you want the fastest-feeling storefront and a platform built for future integrations.", 10.5, false, CHAR);
      // ---------- 04 TIMELINE ----------
      newPage();
      section("04", "Timeline & Terms");
      lines(f.milestones).forEach((ms) => {
        const parts = ms.split(/:\s(.+)/); const week = parts[0] || ms; const desc = parts[1] || "";
        ensure(28);
        fill(TEAL); doc.roundedRect(M, y - 11, 78, 20, 4, 4, "F");
        doc.setFont("helvetica", "bold"); doc.setFontSize(9); txtColor(WHITE); doc.text(clean(week), M + 8, y + 3);
        doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); txtColor(CHAR);
        (doc.splitTextToSize(clean(desc || ms), CW - 92) as string[]).forEach((l) => { doc.text(l, M + 92, y); y += 15; });
        y += 6;
      });
      gap(4);
      para("Hosting: WordPress on cPanel or shared hosting. Laravel on VPS or cloud. Next.js / NestJS on Vercel or VPS. Hosting, domain and third-party charges are the client's responsibility unless bundled in writing.", 10.5, false, CHAR);
      gap(8);
      para("Payment Schedule", 12, true, TEAL); gap(4);
      const payRowsPdf = lines(f.paymentLines).map((l) => {
        const m = l.match(/^(\d+(?:\.\d+)?)\s*%?\s*(.*)$/); const pct = m ? Number(m[1]) : 0; const what = m ? m[2] : l;
        return [what, `${pct}%`, moneyPdf(price * pct / 100)];
      });
      drawTable(["Milestone", "Share", "Amount"], payRowsPdf, [CW - 170, 70, 100]);
      para(`Total project fee: ${moneyPdf(price)}  -  Deposit to start: ${f.deposit}%  -  Valid for: ${f.validity} days`, 10.5, true, TEAL);
      // ---------- 05 SCOPE / APPROVAL ----------
      newPage();
      section("05", "Scope, Support & Approval");
      para("Deliverables", 12, true, TEAL); gap(4);
      lines(f.deliverables).forEach((d) => bullet(d));
      gap(4);
      para("Scope & Change Requests", 12, true, TEAL); gap(4);
      para("Scope is fixed at sign-off. Major changes after sign-off cost extra and shift the timeline. Third-party charges (domain renewal, hosting, gateway fees, SMS, courier API, transactional email) are separate.", 10.5, false, CHAR); gap(4);
      lines(f.notes).forEach((n) => bullet(n));
      gap(8);
      para("Client Handover", 12, true, TEAL); gap(4);
      para("Deployment, configuration, testing and official handover, with configured site, admin access and operational guidance.", 10.5, false, CHAR);
      gap(10);
      para("Client Approval", 12, true, TEAL); gap(6);
      (["A", "B", "C"] as const).forEach((k) => {
        ensure(20);
        stroke(TEAL); doc.setLineWidth(0.8); doc.rect(M, y - 11, 11, 11);
        if (f.approach === k) { doc.setFont("helvetica", "bold"); doc.setFontSize(11); txtColor(TEAL); doc.text("x", M + 3, y - 2); }
        doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); txtColor(CHAR); doc.text(clean(APPROACH[k].label), M + 18, y); y += 20;
      });
      gap(12);
      const sig = (label: string) => {
        ensure(36);
        doc.setFont("helvetica", "normal"); doc.setFontSize(10); txtColor(MUTED); doc.text(label, M, y);
        stroke(CHAR); doc.setLineWidth(0.6); doc.line(M + 130, y, W - M, y); y += 26;
      };
      sig("Authorized Person"); sig("Date"); sig("Signature");
      gap(8);
      para(`Prepared by - ${clean(f.freelancer)}  ${clean(f.freelancerPhone)}`, 10.5, true, TEAL);
      gap(6);
      doc.setFont("helvetica", "bold"); doc.setFontSize(12); txtColor(TEAL);
      doc.text(`Thank you for considering this proposal for ${clean(f.clientCompany)}.`, M, y);
      // footers on body pages
      const total = doc.getNumberOfPages();
      for (let i = 2; i <= total; i++) {
        doc.setPage(i);
        stroke(LINE); doc.setLineWidth(0.5); doc.line(M, H - 36, W - M, H - 36);
        doc.setFont("helvetica", "normal"); doc.setFontSize(8); txtColor(MUTED);
        doc.text(`${clean(f.clientCompany).toUpperCase()}  -  E-COMMERCE WEBSITE PROPOSAL`, M, H - 24);
        doc.text(`PAGE ${i} OF ${total}`, W - M - 70, H - 24);
      }
      doc.save(`${slugify(f.clientCompany)}-proposal.pdf`);
    } catch {
      setNotice("PDF download was blocked here. Try opening this page in a normal browser tab, not a chat preview, then Download PDF again.");
    }
  }
  function printProposal() {
    // On a real deployed site window.print() works. In a sandboxed preview it may not,
    // so Download PDF (jsPDF) is the primary path; print is kept as a fallback.
    window.print();
  }

  const ap = f.approach;
  const payRows = lines(f.paymentLines).map((l) => {
    const m = l.match(/^(\d+(?:\.\d+)?)\s*%?\s*(.*)$/); const pct = m ? Number(m[1]) : 0; const what = m ? m[2] : l;
    return { what, pct, amount: money(price * pct / 100) };
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <style>{`@media print { .no-print { display: none !important; } @page { size: A4; margin: 12mm; } }`}</style>
      <div className="no-print mb-6 flex flex-wrap gap-2">
        <button onClick={() => applyPreset("A")} className="rounded-xl bg-amber px-4 py-2 text-sm font-semibold">Option A · WordPress</button>
        <button onClick={() => applyPreset("B")} className="rounded-xl bg-amber px-4 py-2 text-sm font-semibold">Option B · Laravel + React</button>
        <button onClick={() => applyPreset("C")} className="rounded-xl bg-amber px-4 py-2 text-sm font-semibold">Option C · Next.js / NestJS</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="no-print rounded-2xl border border-line bg-surface p-5">
          <h2 className="text-lg font-bold">Saved proposals &amp; approach</h2>
          <label className="mt-4 block text-sm font-semibold">Saved proposals</label>
          <select value={f.savedList} onChange={set("savedList")} className="mt-1 w-full rounded-lg border border-line px-3 py-2">
            <option value="">— choose a saved proposal —</option>
            <optgroup label="Built-in X Limited approaches">
              {Object.keys(PRESETS).map((k) => <option key={k}>{k}</option>)}
            </optgroup>
            <optgroup label="Your saved proposals">
              {savedNames.map((k) => <option key={k}>{k}</option>)}
            </optgroup>
          </select>
          <div className="mt-3 flex gap-2">
            <button onClick={loadSaved} className="rounded-xl bg-moss px-4 py-2 text-sm font-semibold text-white">Load selected proposal</button>
            <button onClick={() => setF({ ...INITIAL, saveName: "", savedList: "" })} className="rounded-xl border border-line px-4 py-2 text-sm">New blank</button>
          </div>
          <p className="mt-3 text-sm text-ink-soft">Pick a built-in approach and every field changes automatically. Then change the client name for a new client and save it under a new name.</p>

          <label className="mt-4 block text-sm font-semibold">Approach</label>
          <select value={f.approach} onChange={(e) => { set("approach")(e); applyApproach(e.target.value); }} className="mt-1 w-full rounded-lg border border-line px-3 py-2">
            <option value="A">Option A — WordPress + WooCommerce</option>
            <option value="B">Option B — Laravel API + React storefront</option>
            <option value="C">Option C — Next.js storefront / NestJS API</option>
            <option value="custom">Custom — no preset approach</option>
          </select>
          <label className="mt-4 block text-sm font-semibold">Platform detail</label>
          <input value={f.platform} onChange={set("platform")} className="mt-1 w-full rounded-lg border border-line px-3 py-2" />

          <h2 className="mt-6 text-lg font-bold">Who &amp; what</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-semibold">Your name<input value={f.freelancer} onChange={set("freelancer")} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
            <label className="text-sm font-semibold">Your title<input value={f.freelancerTitle} onChange={set("freelancerTitle")} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
            <label className="text-sm font-semibold">Your email<input value={f.freelancerEmail} onChange={set("freelancerEmail")} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
            <label className="text-sm font-semibold">Your phone<input value={f.freelancerPhone} onChange={set("freelancerPhone")} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
            <label className="text-sm font-semibold">Client company<input value={f.clientCompany} onChange={set("clientCompany")} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
            <label className="text-sm font-semibold">Client contact<input value={f.clientContact} onChange={set("clientContact")} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
          </div>
          <label className="mt-4 block text-sm font-semibold">Project title<input value={f.projectTitle} onChange={set("projectTitle")} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
          <label className="mt-4 block text-sm font-semibold">Project summary<textarea value={f.summary} onChange={set("summary")} rows={3} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
          <label className="mt-4 block text-sm font-semibold">Scope — one per line<textarea value={f.scope} onChange={set("scope")} rows={7} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
          <label className="mt-4 block text-sm font-semibold">Deliverables — one per line<textarea value={f.deliverables} onChange={set("deliverables")} rows={4} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>

          <h2 className="mt-6 text-lg font-bold">Timeline &amp; price</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-semibold">Timeline<input value={f.timeline} onChange={set("timeline")} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
            <label className="text-sm font-semibold">Currency
              <select value={f.currency} onChange={set("currency")} className="mt-1 w-full rounded-lg border border-line px-3 py-2">
                <option value="BDT">BDT (৳)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option>
              </select>
            </label>
            <label className="text-sm font-semibold">Total fee<input type="number" value={f.price} onChange={set("price")} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
            <label className="text-sm font-semibold">Deposit %<input type="number" value={f.deposit} onChange={set("deposit")} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
          </div>
          <label className="mt-4 block text-sm font-semibold">Milestones — one per line<textarea value={f.milestones} onChange={set("milestones")} rows={5} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
          <label className="mt-4 block text-sm font-semibold">Payment milestones — one per line, starting with %<textarea value={f.paymentLines} onChange={set("paymentLines")} rows={4} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
          <label className="mt-4 block text-sm font-semibold">Notes / terms — one per line<textarea value={f.notes} onChange={set("notes")} rows={5} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>

          <label className="mt-4 block text-sm font-semibold">Saved proposal name<input value={f.saveName} onChange={set("saveName")} className="mt-1 w-full rounded-lg border border-line px-3 py-2" /></label>
          <div className="mt-3 flex gap-2">
            <button onClick={saveProposal} className="rounded-xl bg-moss px-4 py-2 text-sm font-semibold text-white">Save in this browser</button>
            <button onClick={downloadMd} className="rounded-xl border border-line px-4 py-2 text-sm">Download .md</button>
          </div>
          {notice && <p className="mt-3 text-sm">{notice}</p>}
          <p className="mt-3 text-sm text-ink-soft">Saved proposals live in this browser (localStorage). The JSON-file store in main (data/inquiries.json) is a server-side, local-deployment pattern — it does not persist on Vercel serverless, so it is not used as the primary save here.</p>
        </section>

        <section>
          <div className="no-print mb-4 flex flex-wrap gap-2">
            <button onClick={downloadPdf} className="rounded-xl bg-moss px-4 py-2 text-sm font-semibold text-white">Download PDF</button>
            <button onClick={printProposal} className="rounded-xl border border-line px-4 py-2 text-sm">Print / Save as PDF</button>
          </div>
          <div ref={previewRef} style={{ background: "#F7F5F0", color: "#2C3E50", borderRadius: 14, overflow: "hidden", border: "1px solid #e7e9e3" }}>
            <div style={{ background: "#113E3F", color: "#fff", padding: 28 }}>
              <div style={{ letterSpacing: ".28em", textTransform: "uppercase", fontSize: 13, fontWeight: 800 }}>{f.clientCompany.toUpperCase()}</div>
              <h1 style={{ fontSize: 32, margin: "12px 0 6px" }}>E-Commerce Website Proposal</h1>
              <p style={{ color: "#dbe7e6" }}>A premium, conversion-focused online store for a modern denim brand.</p>
              <p><span style={{ background: "#E5A93B", color: "#1f2937", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>Design</span> <span style={{ background: "#E5A93B", color: "#1f2937", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>Development</span> <span style={{ background: "#E5A93B", color: "#1f2937", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>E-commerce</span> <span style={{ background: "#E5A93B", color: "#1f2937", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>Admin Dashboard</span> <span style={{ background: "#E5A93B", color: "#1f2937", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>Deployment</span></p>
              <table style={{ width: "100%", marginTop: 18 }}><tbody><tr><th style={{ fontSize: 10, letterSpacing: ".14em", color: "#E5A93B", textAlign: "left" }}>PREPARED FOR</th><th style={{ fontSize: 10, letterSpacing: ".14em", color: "#E5A93B", textAlign: "left" }}>PREPARED BY</th><th style={{ fontSize: 10, letterSpacing: ".14em", color: "#E5A93B", textAlign: "left" }}>DELIVERY TARGET</th><th style={{ fontSize: 10, letterSpacing: ".14em", color: "#E5A93B", textAlign: "left" }}>CONTACT</th></tr><tr><td style={{ fontWeight: 700 }}>{f.clientCompany}</td><td style={{ fontWeight: 700 }}>{f.freelancer}</td><td style={{ fontWeight: 700 }}>Approx. {f.timeline}</td><td style={{ fontWeight: 700 }}>{f.freelancerPhone}</td></tr></tbody></table>
              <p style={{ marginTop: 16, fontSize: 11, letterSpacing: ".14em" }}>CONFIDENTIAL • CLIENT PROPOSAL</p>
            </div>
            <div style={{ padding: "24px 28px 28px" }}>
              <h3 style={{ color: "#113E3F", borderBottom: "2px solid #E5A93B", paddingBottom: 6 }}>01 · Project Overview</h3>
              <p>{f.summary}</p>
              <ul>{lines(f.scope).map((x, i) => <li key={i}>✓ {x}</li>)}</ul>
              <p><strong>Dedicated Management Dashboard —</strong> staff can manage products, categories, variations, inventory, orders, customers, coupons, shipping and agreed store settings without depending on the developer for routine operations.</p>
              <h3 style={{ color: "#113E3F", borderBottom: "2px solid #E5A93B", paddingBottom: 6 }}>02 · Pricing &amp; Technology</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {(["A", "B", "C"] as const).map((k) => (
                  <div key={k} style={{ border: ap === k ? "2px solid #E5A93B" : "1px solid #dbe3e3", borderRadius: 12, padding: 14, background: "#fff" }}>
                    <strong>{APPROACH[k].label}</strong><div style={{ fontSize: 22, fontWeight: 800, color: "#113E3F" }}>{money(45000)}</div><p>{APPROACH[k].blurb}</p><p style={{ fontSize: 12, color: "#666" }}>{APPROACH[k].platform}</p>
                  </div>
                ))}
              </div>
              <p><strong>Selected platform:</strong> {f.platform} · <strong>Fee:</strong> {money(price)}</p>
              <h3 style={{ color: "#113E3F", borderBottom: "2px solid #E5A93B", paddingBottom: 6 }}>03 · Platform Comparison</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}><tbody>
                <tr><th style={{ textAlign: "left" }}>Area</th><th style={{ textAlign: "left" }}>WordPress</th><th style={{ textAlign: "left" }}>Laravel + React</th><th style={{ textAlign: "left" }}>Next.js / NestJS</th></tr>
                <tr><td>Development fee</td><td>৳45,000</td><td>৳45,000</td><td>৳45,000 flat</td></tr>
                <tr><td>Development speed</td><td>Faster</td><td>Moderate</td><td>Moderate</td></tr>
                <tr><td>Customization</td><td>Plugin / theme based</td><td>Very high</td><td>Very high, in code</td></tr>
                <tr><td>Plugin dependency</td><td>Higher</td><td>Lower</td><td>Lowest</td></tr>
                <tr><td>Infrastructure</td><td>cPanel / shared</td><td>VPS / cloud</td><td>Vercel or VPS</td></tr>
                <tr><td>Interaction speed</td><td>Theme bound</td><td>React can feel quick</td><td>Fastest potential</td></tr>
              </tbody></table>
              <h3 style={{ color: "#113E3F", borderBottom: "2px solid #E5A93B", paddingBottom: 6 }}>04 · Timeline &amp; Terms</h3>
              {lines(f.milestones).map((x, i) => <p key={i}>{x}</p>)}
              <table style={{ width: "100%", borderCollapse: "collapse" }}><tbody><tr><th style={{ textAlign: "left" }}>Milestone</th><th style={{ textAlign: "left" }}>Share</th><th style={{ textAlign: "left" }}>Amount</th></tr>{payRows.map((r, i) => <tr key={i}><td>{r.what}</td><td>{r.pct}%</td><td>{r.amount}</td></tr>)}</tbody></table>
              <h3 style={{ color: "#113E3F", borderBottom: "2px solid #E5A93B", paddingBottom: 6 }}>05 · Scope, Support &amp; Approval</h3>
              <ul>{lines(f.deliverables).map((x, i) => <li key={i}>{x}</li>)}</ul>
              <ul>{lines(f.notes).map((x, i) => <li key={i}>{x}</li>)}</ul>
              <p><strong>Client Approval</strong> — {ap === "A" ? "☑" : "☐"} WordPress + WooCommerce &nbsp; {ap === "B" ? "☑" : "☐"} Laravel + React &nbsp; {ap === "C" ? "☑" : "☐"} Next.js / NestJS</p>
              <table style={{ width: "100%" }}><tbody><tr><td>Authorized Person</td><td>_________________________</td></tr><tr><td>Date</td><td>_________________________</td></tr></tbody></table>
              <p>Signature of authorized person:</p><div style={{ borderTop: "1px solid #2C3E50", marginTop: 28, paddingTop: 6 }}>&nbsp;</div>
              <p><strong>Prepared by</strong> — {f.freelancer} {f.freelancerPhone}</p>
              <p>Thank you for considering this proposal for {f.clientCompany}.</p>
              <p style={{ fontSize: 12, color: "#666" }}>{f.clientCompany} • E-commerce Website Proposal</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
