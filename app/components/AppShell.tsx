"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";

const profileActions = [
  {
    label: "Profile page",
    helper: "Manage account details",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 21a8 8 0 0 0-16 0" strokeLinecap="round" />
        <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      </svg>
    ),
  },
  {
    label: "Saved filings",
    helper: "Drafts and submissions",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 3h9l3 3v15H6z" />
        <path d="M14 3v4h4M9 13h6M9 17h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Settings",
    helper: "Privacy and notifications",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2.1 2.1 0 1 1-2.97 2.97l-.04-.04A1.8 1.8 0 0 0 14.8 19.6a1.8 1.8 0 0 0-1.8 1.8V21.5a2.1 2.1 0 0 1-4.2 0v-.06A1.8 1.8 0 0 0 7 19.64a1.8 1.8 0 0 0-1.98.36l-.04.04a2.1 2.1 0 0 1-2.97-2.97l.04-.04A1.8 1.8 0 0 0 2.4 15a1.8 1.8 0 0 0-1.8-1.8H.5a2.1 2.1 0 0 1 0-4.2h.06A1.8 1.8 0 0 0 2.36 7a1.8 1.8 0 0 0-.36-1.98l-.04-.04a2.1 2.1 0 1 1 2.97-2.97l.04.04A1.8 1.8 0 0 0 7 2.4a1.8 1.8 0 0 0 1.8-1.8V.5a2.1 2.1 0 0 1 4.2 0v.06A1.8 1.8 0 0 0 15 2.36a1.8 1.8 0 0 0 1.98-.36l.04-.04a2.1 2.1 0 1 1 2.97 2.97l-.04.04A1.8 1.8 0 0 0 19.6 7a1.8 1.8 0 0 0 1.8 1.8h.1a2.1 2.1 0 0 1 0 4.2h-.06A1.8 1.8 0 0 0 19.4 15Z" />
      </svg>
    ),
  },
  {
    label: "Log out",
    helper: "End this demo session",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10 17 15 12l-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 4h3a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-3" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function AppShell({ children, headerAction }: Readonly<{ children: ReactNode; headerAction?: ReactNode }>) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <main className="app-canvas flex h-screen flex-col overflow-hidden text-slate-950">
      <header className="z-20 shrink-0 border-b border-slate-200/70 bg-white/88 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[1fr_auto_1fr] sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3 justify-self-start" href="/">
            <span
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-[13px] font-semibold tracking-normal text-white"
            >
              NL
            </span>
            <p className="text-base font-semibold leading-tight tracking-normal text-slate-950">NyayLink</p>
          </Link>
          {headerAction ? (
            <div className="col-span-2 row-start-2 w-full justify-self-center sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:w-auto">
              {headerAction}
            </div>
          ) : null}
          <div
            className="relative justify-self-end"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setProfileOpen(false);
            }}
          >
            <button
              type="button"
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              title="Profile"
              onClick={() => setProfileOpen((open) => !open)}
              className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <span
                aria-hidden="true"
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: "url('https://api.dicebear.com/9.x/notionists/svg?seed=NyayLink%20User&backgroundColor=f1f5f9')" }}
              />
            </button>
            {profileOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 rounded-[1.35rem] border border-slate-200 bg-white p-2 ring-1 ring-slate-950/5"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-3">
                  <span
                    aria-hidden="true"
                    className="h-10 w-10 rounded-full border border-slate-200 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://api.dicebear.com/9.x/notionists/svg?seed=NyayLink%20User&backgroundColor=f1f5f9')" }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">Farzeen Ilyas</p>
                    <p className="truncate text-xs font-medium text-slate-500">Demo account</p>
                  </div>
                </div>
                <div className="mt-1 space-y-1">
                  {profileActions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      role="menuitem"
                      onMouseDown={(event) => event.preventDefault()}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
                        action.label === "Log out"
                          ? "text-red-600 hover:bg-red-50"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-current">
                        {action.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{action.label}</span>
                        <span className="block truncate text-xs text-slate-400">{action.helper}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
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
