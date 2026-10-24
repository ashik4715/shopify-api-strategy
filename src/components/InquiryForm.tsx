"use client";

import { useState } from "react";
import { SectionHeading } from "./SectionHeading";

type Status = "idle" | "submitting" | "success" | "error";

const fieldCls =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-moss focus:ring-2 focus:ring-moss/20";

export default function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    option: "undecided",
    message: "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        return;
      }
      setStatus("success");
      setForm({ name: "", email: "", phone: "", option: "undecided", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="quote" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <SectionHeading
          eyebrow="07 · Next step"
          title="Request the scoped quote"
          intro="Tell me which route you are leaning toward and I will reply within 24 hours with a fixed-price scope and start date. Your details stay private."
        />

        {status === "success" ? (
          <div className="rounded-2xl border border-moss/25 bg-moss-tint p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-moss">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-ink">Request received</h3>
            <p className="mt-2 text-ink-soft">
              Thanks — your inquiry is saved. Expect a scoped quote in your inbox within 24 hours.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 rounded-xl border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink hover:border-moss/40"
            >
              Send another
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-ink">Name *</span>
                <input
                  required
                  className={`mt-1.5 ${fieldCls}`}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink">Email *</span>
                <input
                  required
                  type="email"
                  className={`mt-1.5 ${fieldCls}`}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@company.com"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink">Phone</span>
                <input
                  className={`mt-1.5 ${fieldCls}`}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+880 …"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink">Preferred route</span>
                <select
                  className={`mt-1.5 ${fieldCls}`}
                  value={form.option}
                  onChange={(e) => update("option", e.target.value)}
                >
                  <option value="undecided">Not sure yet</option>
                  <option value="custom">Option B · Next.js + admin (★ recommended)</option>
                  <option value="wordpress">Option A · WordPress (maintenance-heavy)</option>
                </select>
              </label>
            </div>
            <label className="mt-5 block">
              <span className="text-sm font-medium text-ink">Project details</span>
              <textarea
                rows={4}
                className={`mt-1.5 resize-none ${fieldCls}`}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="What are you selling, and any must-haves?"
              />
            </label>

            {status === "error" && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                Something went wrong sending your request. Please try again or email me directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-6 w-full rounded-xl bg-moss px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-moss-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Send request"}
            </button>
            <p className="mt-3 text-center text-xs text-ink-soft">
              Stored securely in the proposal database · no spam, ever
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
