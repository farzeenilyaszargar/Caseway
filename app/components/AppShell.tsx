import Link from "next/link";
import type { ReactNode } from "react";

export function AppShell({ children, headerAction }: Readonly<{ children: ReactNode; headerAction?: ReactNode }>) {
  return (
    <main className="app-canvas flex h-screen flex-col overflow-hidden text-slate-950">
      <header className="z-20 shrink-0 border-b border-slate-200/70 bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span
              aria-hidden="true"
              className="h-9 w-16 shrink-0 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/nyaylink-logo.png')" }}
            />
            <p className="text-base font-semibold leading-tight tracking-normal text-slate-950">NyayLink</p>
          </Link>
          {headerAction ? <div className="order-3 w-full sm:order-none sm:w-auto">{headerAction}</div> : null}
        </div>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </main>
  );
}

export function LegalDisclaimer() {
  return (
    <aside className="premium-card rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
      <p className="font-semibold">Important legal notice</p>
      <p className="mt-1">
        NyayLink provides general legal information and workflow assistance. For filings,
        deadlines, notices, and court strategy, consult an enrolled advocate.
      </p>
    </aside>
  );
}
