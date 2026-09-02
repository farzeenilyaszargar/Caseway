"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/intake", label: "Intake" },
  { href: "/assistant", label: "Legal Desk" },
  { href: "/lawyers", label: "Find Lawyers" },
  { href: "/cases", label: "Cases" },
  { href: "/tools", label: "Tools" },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main className="app-canvas min-h-screen text-slate-950">
      <header
        className={`sticky top-0 z-20 border-b backdrop-blur-xl ${
          isHome ? "border-white/10 bg-[#100b07]/92 text-white" : "topbar border-slate-200/80"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <div
              className={`grid h-10 w-10 place-items-center rounded-md text-sm font-bold shadow-lg ${
                isHome ? "bg-amber-500 text-slate-950 shadow-black/20" : "bg-slate-950 text-white shadow-slate-950/15"
              }`}
            >
              न
            </div>
            <div>
              <p className="text-base font-semibold leading-tight">NyayLink</p>
              <p className={`text-xs ${isHome ? "text-stone-300" : "text-slate-500"}`}>
                Legal guidance + Vakil Connect
              </p>
            </div>
          </Link>
          <nav
            className={`hidden items-center gap-1 rounded-md border p-1 text-sm font-medium shadow-sm md:flex ${
              isHome ? "border-white/12 bg-white/8 text-stone-300" : "border-slate-200 bg-white/88 text-slate-600"
            }`}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                className={`rounded px-3 py-2 ${
                  pathname === item.href
                    ? isHome
                      ? "bg-white text-slate-950"
                      : "bg-slate-950 text-white"
                    : isHome
                      ? "hover:bg-white/10 hover:text-white"
                      : "hover:bg-slate-100"
                }`}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            className={`rounded-md px-4 py-2 text-sm font-semibold shadow-lg transition ${
              isHome
                ? "bg-amber-500 text-slate-950 shadow-black/20 hover:bg-amber-400"
                : "bg-[#0f766e] text-white shadow-teal-900/15 hover:bg-[#0b625c]"
            }`}
            href="/lawyers"
          >
            Consult / सलाह लें
          </Link>
        </div>
        <nav
          className={`flex gap-2 overflow-x-auto border-t px-4 py-2 text-sm font-semibold md:hidden ${
            isHome ? "border-white/10 text-stone-300" : "border-slate-200 text-slate-600"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={`shrink-0 rounded-md px-3 py-2 ${
                pathname === item.href
                  ? isHome
                    ? "bg-white text-slate-950"
                    : "bg-slate-950 text-white"
                  : isHome
                    ? "bg-white/8 text-stone-200"
                    : "bg-white"
              }`}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
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
