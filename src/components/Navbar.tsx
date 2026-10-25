"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const links = [
  { href: "/proposals", label: "Downloads" },
  { href: "#invest", label: "The Numbers" },
  { href: "#compare", label: "WordPress vs Custom" },
  { href: "#plugins", label: "Plugin Stack" },
  { href: "#timeline", label: "Timeline" },
  { href: "#quote", label: "Get a Quote" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled ? "border-line bg-paper/90 backdrop-blur" : "border-transparent bg-paper/70"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-moss font-display text-base font-bold text-white">
            S
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            ShopCraft<span className="text-moss">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-moss-tint hover:text-moss-deep"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/proposals"
            className="ml-2 rounded-xl bg-moss px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-moss-deep"
          >
            Download .md / .pdf
          </a>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-surface px-5 pb-5 pt-2 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm font-medium text-ink-soft hover:bg-moss-tint hover:text-moss-deep"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
