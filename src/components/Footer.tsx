export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-moss-tint">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-bold text-white">
            ShopCraft<span className="text-moss">.</span>
          </p>
          <p className="mt-1 text-sm text-moss-tint/70">
            Proposal prepared February 2026 · Prices in BDT, valid 30 days
          </p>
        </div>
        <p className="text-sm text-moss-tint/70">
          Ready when you are —{" "}
          <a href="/proposals" className="font-semibold text-white underline-offset-4 hover:underline">
            download both proposals (.md + .pdf)
          </a>{" "}
          or{" "}
          <a href="#quote" className="font-semibold text-white underline-offset-4 hover:underline">
            request the scoped quote
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
