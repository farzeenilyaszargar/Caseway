import Link from "next/link";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="app-canvas min-h-screen text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/86 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-slate-950 text-sm font-bold text-white shadow-sm">
              न
            </div>
            <div>
              <p className="text-base font-semibold leading-tight">NyayLink</p>
              <p className="text-xs text-slate-500">File by chat</p>
            </div>
          </Link>
          <p className="hidden text-sm font-medium text-slate-500 sm:block">
            AI filing and advocate matching
          </p>
        </div>
      </header>
      {children}
    </main>
  );
}

export function LegalDisclaimer() {
  return (
    <aside className="premium-card rounded-lg border border-amber-200 bg-[#fff8eb] p-4 text-sm leading-6 text-amber-950">
      <p className="font-semibold">Important legal notice</p>
      <p className="mt-1">
        NyayLink provides general legal information and workflow assistance. For filings,
        deadlines, notices, and court strategy, consult an enrolled advocate.
      </p>
    </aside>
  );
}
