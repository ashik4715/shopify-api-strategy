"use client";

import { useState } from "react";
import type { jsPDF } from "jspdf";

export type ProposalDoc = {
  slug: string;
  title: string;
  option: string;
  verdict: "recommended" | "discouraged";
  stack: string;
  reference: string;
  referenceUrl: string;
  investment: string;
  timeline: string;
  ongoing: string;
  markdown: string;
};

/* ------------------- preprocess (YAML, <style>, <div> breaks) ------------- */

function preprocess(src: string): string[] {
  let lines = src.split("\n");

  // strip YAML front matter
  if (lines[0]?.trim() === "---") {
    const end = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
    if (end !== -1) lines = lines.slice(end + 1);
  }

  const out: string[] = [];
  let inStyle = false;
  for (const raw of lines) {
    const l = raw.trim();
    if (/^<style/i.test(l)) { inStyle = true; continue; }
    if (inStyle) { if (/^<\/style>/i.test(l)) inStyle = false; continue; }
    if (/^<div\b/i.test(l)) { out.push("---"); continue; } // page-break → visual rule in preview
    if (/^<\/?html|^<meta|^<head/i.test(l)) continue;
    out.push(raw);
  }
  return out;
}

const stripHtml = (s: string) => s.replace(/<[^>]+>/g, "");

const stripInline = (s: string) =>
  stripHtml(s)
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");

const tableCells = (line: string) =>
  stripHtml(line).trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

const isSeparatorRow = (cells: string[]) => cells.every((c) => /^:?-{2,}:?$/.test(c));

const NORM = (n: number) => Math.min(255, Math.max(0, Math.round(n)));

/* --------------------------- markdown → React ----------------------------- */

type Inline = { s: string; b?: boolean; c?: boolean; a?: string };

function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ s: text.slice(last, m.index) });
    const tok = m[0];
    if (tok.startsWith("**")) out.push({ s: tok.slice(2, -2), b: true });
    else if (tok.startsWith("`")) out.push({ s: tok.slice(1, -1), c: true });
    else {
      const lm = tok.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (lm) out.push({ s: lm[1], a: lm[2] });
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push({ s: text.slice(last) });
  return out;
}

function InlineText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((p, i) =>
        p.a ? (
          <a key={i} href={p.a} className="text-moss underline underline-offset-2" target="_blank" rel="noreferrer">
            {p.s}
          </a>
        ) : p.b ? (
          <strong key={i} className="font-semibold text-ink">{p.s}</strong>
        ) : p.c ? (
          <code key={i} className="rounded bg-moss-tint px-1.5 py-0.5 font-mono text-[0.85em] text-moss-deep">{p.s}</code>
        ) : (
          <span key={i}>{p.s}</span>
        )
      )}
    </>
  );
}

function Markdown({ src }: { src: string }) {
  const lines = preprocess(src);
  const blocks: React.ReactNode[] = [];
  let i = 0;
  const key = () => `b${blocks.length}-${i}`;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (/^---+\s*$/.test(line)) {
      blocks.push(<hr key={key()} className="my-6 border-line" />);
      i++; continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      const txt = h[2];
      if (lvl === 1)
        blocks.push(
          <h2 key={key()} className="mt-8 border-b-2 border-moss pb-2 font-display text-2xl font-bold text-moss first:mt-0">
            {txt}
          </h2>
        );
      else if (lvl === 2)
        blocks.push(<h3 key={key()} className="mt-7 font-display text-xl font-bold" style={{ color: "#002347" }}>{txt}</h3>);
      else if (lvl === 3)
        blocks.push(<h4 key={key()} className="mt-5 font-display text-base font-bold text-moss-deep">{txt}</h4>);
      else blocks.push(<h5 key={key()} className="mt-4 text-sm font-bold uppercase tracking-wider text-ink-soft">{txt}</h5>);
      i++; continue;
    }

    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(tableCells(lines[i]));
        i++;
      }
      const body = rows.filter((r) => !isSeparatorRow(r));
      const [head, ...rest] = body;
      blocks.push(
        <div key={key()} className="my-5 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr style={{ backgroundColor: "#f4f6f8" }}>
                {head?.map((c, ci) => (
                  <th key={ci} className="border border-line px-4 py-2.5 font-semibold" style={{ color: "#002347" }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rest.map((r, ri) => (
                <tr key={ri} className="align-top">
                  {r.map((c, ci) => (
                    <td key={ci} className="border border-line px-4 py-2.5" style={{ color: "#333333" }}>
                      <InlineText text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key()} className="my-3 space-y-1.5">
          {items.map((it, ii) => (
            <li key={ii} className="flex gap-2.5 text-[15px] leading-relaxed" style={{ color: "#333333" }}>
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
              <span><InlineText text={it} /></span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={key()} className="my-3 list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed" style={{ color: "#333333" }}>
          {items.map((it, ii) => (
            <li key={ii}><InlineText text={it} /></li>
          ))}
        </ol>
      );
      continue;
    }

    if (line.startsWith(">")) {
      const parts: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        parts.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote key={key()} className="my-5 border-l-4 border-moss bg-moss-tint/60 px-5 py-4 text-[15px] leading-relaxed text-ink">
          <InlineText text={parts.join(" ")} />
        </blockquote>
      );
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4}\s|\||[-*]\s|\d+\.\s|>|---+$)/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={key()} className="my-3 text-[15px] leading-relaxed" style={{ color: "#333333" }}>
        <InlineText text={para.join(" ")} />
      </p>
    );
  }

  return <div className="space-y-1">{blocks}</div>;
}

/* ---------------------------- markdown → jsPDF ---------------------------- */

async function buildPdf(p: ProposalDoc): Promise<jsPDF> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const M = 54;
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const right = W - M;
  let y = M;

  const GREEN: [number, number, number] = [16, 138, 0];   // #108a00
  const NAVY: [number, number, number] = [0, 35, 71];     // #002347
  const BODY: [number, number, number] = [51, 51, 51];    // #333333
  const BORDER: [number, number, number] = [224, 224, 224]; // #e0e0e0
  const THBG: [number, number, number] = [244, 246, 248]; // #f4f6f8

  const ensure = (need: number) => {
    if (y + need > H - M) {
      doc.addPage();
      y = M;
    }
  };

  const write = (
    text: string,
    opts: {
      font?: "helvetica" | "courier";
      style?: "normal" | "bold" | "italic";
      size?: number;
      color?: [number, number, number];
      indent?: number;
      prefix?: string;
    } = {}
  ) => {
    const {
      font = "helvetica",
      style = "normal",
      size = 10.5,
      color = BODY,
      indent = 0,
      prefix = "",
    } = opts;
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const wrapped = doc.splitTextToSize(stripInline(prefix + text), right - M - indent) as string[];
    const leading = size * 1.5;
    for (const l of wrapped) {
      ensure(leading);
      doc.text(l, M + indent, y);
      y += leading;
    }
  };

  const drawTable = (rows: string[][]) => {
    const cols = rows.reduce((mx, r) => Math.max(mx, r.length), 0);
    const norm = rows.map((r) => Array.from({ length: cols }, (_, ci) => r[ci] ?? ""));
    const weights = Array.from({ length: cols }, (_, c) =>
      Math.min(70, Math.max(14, Math.max(...norm.map((r) => r[c].length)) * 0.85))
    );
    const sum = weights.reduce((a, b) => a + b, 0);
    const widths = weights.map((w) => (w / sum) * (right - M));
    const pad = 6;
    const fs = 9;
    const lead = 12;

    norm.forEach((row, ri) => {
      const cellLines = row.map((c, ci) =>
        doc.splitTextToSize(stripInline(c), widths[ci] - 2 * pad) as string[]
      );
      const h = Math.max(1, Math.max(...cellLines.map((l) => l.length))) * lead + 2 * pad;
      ensure(h);

      let x = M;
      cellLines.forEach((ls, ci) => {
        const w = widths[ci];
        if (ri === 0) {
          doc.setFillColor(THBG[0], THBG[1], THBG[2]);
          doc.rect(x, y, w, h, "F");
        }
        doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
        doc.setLineWidth(0.5);
        doc.rect(x, y, w, h);
        doc.setFont("helvetica", ri === 0 ? "bold" : "normal");
        doc.setFontSize(fs);
        doc.setTextColor(ri === 0 ? NAVY[0] : BODY[0], ri === 0 ? NAVY[1] : BODY[1], ri === 0 ? NAVY[2] : BODY[2]);
        ls.forEach((l, li) => doc.text(l, x + pad, y + pad + lead * 0.8 + li * lead));
        x += w;
      });
      y += h;
    });
    y += 14;
  };

  const lines = preprocess(p.markdown);
  let i = 0;
  let firstH1 = true;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { y += 4; i++; continue; }

    if (/^---+\s*$/.test(line)) {
      ensure(18);
      doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2]);
      doc.setLineWidth(0.75);
      doc.line(M, y, right, y);
      y += 14;
      i++; continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      const sizes: Record<number, number> = { 1: 17, 2: 14, 3: 12, 4: 11 };
      y += lvl >= 2 ? 10 : 0;
      write(h[2], {
        style: "bold",
        size: sizes[lvl],
        color: lvl === 1 ? GREEN : lvl === 2 ? NAVY : BODY,
      });
      if (lvl === 1) {
        ensure(10);
        if (firstH1) {
          doc.setDrawColor(GREEN[0], GREEN[1], GREEN[2]);
          doc.setLineWidth(2);
          doc.line(M, y, right, y);
          firstH1 = false;
        } else {
          doc.setDrawColor(GREEN[0], GREEN[1], GREEN[2]);
          doc.setLineWidth(1);
          doc.line(M, y, right, y);
        }
        y += 14;
      }
      y += 4;
      i++; continue;
    }

    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(tableCells(lines[i]));
        i++;
      }
      drawTable(rows.filter((r) => !isSeparatorRow(r)));
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        const item = lines[i].replace(/^[-*]\s+/, "");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10.5);
        const wrapped = doc.splitTextToSize(stripInline(item), right - M - 24) as string[];
        wrapped.forEach((l, li) => {
          ensure(15);
          doc.setTextColor(BODY[0], BODY[1], BODY[2]);
          if (li === 0) doc.text("\u2022", M + 8, y);
          doc.text(l, M + 24, y);
          y += 15;
        });
        i++;
      }
      y += 4;
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        const m2 = lines[i].match(/^(\d+\.)\s+(.*)$/)!;
        write(m2[2], { indent: 16, prefix: m2[1] + " " });
        i++;
      }
      y += 4;
      continue;
    }

    if (line.startsWith(">")) {
      const parts: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        parts.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      write(parts.join(" "), { style: "italic", color: [8, 84, 61], indent: 14, prefix: "\u201C" });
      y += 4;
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4}\s|\||[-*]\s|\d+\.\s|>|---+$)/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    write(para.join(" "));
    y += 5;
  }

  return doc;
}

/* ------------------------------ component --------------------------------- */

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ProposalLibrary({ proposals }: { proposals: ProposalDoc[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const getMd = (p: ProposalDoc) =>
    downloadBlob(new Blob([p.markdown], { type: "text/markdown;charset=utf-8" }), `${p.slug}.md`);

  const getPdf = async (p: ProposalDoc) => {
    setBusy(p.slug);
    try {
      const doc = await buildPdf(p);
      doc.save(`${p.slug}.pdf`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-moss">Proposal library</p>
      <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
        Two options. One clear recommendation. Download as{" "}
        <span className="text-moss">.md</span> or <span className="text-moss">.pdf</span>.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        Option B (Next.js headless + admin dashboard) is the recommended route — cheaper to run, faster,
        no WordPress to patch. Option A is included for comparison only. Markdown feeds your agent;
        the PDF follows the exact client template.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {proposals.map((p) => (
          <article
            key={p.slug}
            className={`flex flex-col rounded-2xl border bg-surface shadow-sm ${
              p.verdict === "recommended" ? "border-moss/40 ring-1 ring-moss/15" : "border-line opacity-95"
            }`}
          >
            <div className={`border-b border-line p-6 ${p.verdict === "recommended" ? "bg-moss-tint/60" : "bg-paper"}`}>
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ${
                    p.verdict === "recommended" ? "bg-moss" : "bg-ink-soft"
                  }`}
                >
                  {p.option}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    p.verdict === "recommended" ? "bg-moss text-white" : "bg-amber-tint text-amber"
                  }`}
                >
                  {p.verdict === "recommended" ? "Recommended" : "Maintenance-heavy"}
                </span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold text-ink">{p.title}</h2>
              <p className="mt-1 text-sm text-ink-soft">{p.stack}</p>
              <a
                href={p.referenceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs font-medium text-moss-deep underline underline-offset-4"
              >
                Benchmark: {p.reference}
              </a>
              <dl className="mt-5 grid grid-cols-3 gap-3">
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-ink-soft">Build</dt>
                  <dd className="font-display text-lg font-bold text-moss-deep">{p.investment}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-ink-soft">Timeline</dt>
                  <dd className="font-display text-lg font-bold text-ink">{p.timeline}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-ink-soft">Maintenance</dt>
                  <dd className="pt-1 font-display text-sm font-bold text-ink">{p.ongoing}</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-wrap gap-3 p-6">
              <button
                onClick={() => getMd(p)}
                className="inline-flex items-center gap-2 rounded-xl bg-moss px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-moss-deep"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
                </svg>
                Download .md
              </button>
              <button
                onClick={() => getPdf(p)}
                disabled={busy === p.slug}
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-moss/40 hover:text-moss-deep disabled:opacity-60"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
                </svg>
                {busy === p.slug ? "Generating…" : "Download .pdf"}
              </button>
              <button
                onClick={() => setOpen(open === p.slug ? null : p.slug)}
                className="ml-auto rounded-xl px-4 py-2.5 text-sm font-semibold text-moss-deep hover:bg-moss-tint"
              >
                {open === p.slug ? "Hide preview" : "Preview"}
              </button>
            </div>

            {open === p.slug && (
              <div className="max-h-[34rem] overflow-y-auto border-t border-line bg-paper px-6 py-5">
                <Markdown src={p.markdown} />
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
