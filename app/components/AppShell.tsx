"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/intake", label: "Intake" },
  { href: "/assistant", label: "Nyay AI" },
  { href: "/lawyers", label: "Find Lawyers" },
  { href: "/cases", label: "Cases" },
  { href: "/tools", label: "Tools" },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-[#fbfaf7]/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-sm font-bold text-white">
              न
            </div>
            <div>
              <p className="text-base font-semibold leading-tight">NyayLink</p>
              <p className="text-xs text-slate-500">AI law guide + Vakil Connect</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 rounded-md border border-slate-200 bg-white p-1 text-sm font-medium text-slate-600 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className={`rounded px-3 py-2 ${
                  pathname === item.href ? "bg-slate-950 text-white" : "hover:bg-slate-100"
                }`}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            className="rounded-md bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-900/10"
            href="/lawyers"
          >
            Consult / सलाह लें
          </Link>
        </div>
        <nav className="flex gap-2 overflow-x-auto border-t border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={`shrink-0 rounded-md px-3 py-2 ${
                pathname === item.href ? "bg-slate-950 text-white" : "bg-white"
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
    <aside className="rounded-lg border border-amber-200 bg-[#fff8eb] p-4 text-sm leading-6 text-amber-950">
      <p className="font-semibold">Legal information only</p>
      <p className="mt-1">
        Nyay AI is a prototype and does not replace advice from an enrolled advocate. Deadlines,
        court rules, and facts matter. Please verify before filing or replying.
      </p>
    </aside>
  );
}
