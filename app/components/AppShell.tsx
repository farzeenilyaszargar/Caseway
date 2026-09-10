"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const profileActions = [
  {
    label: "Profile page",
    helper: "Manage account details",
    href: "/profile",
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
    href: "/filings",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 3h9l3 3v15H6z" />
        <path d="M14 3v4h4M9 13h6M9 17h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Documents",
    helper: "Vault and uploads",
    href: "/documents",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H10l2 2h5.5A2.5 2.5 0 0 1 20 8.5v9A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5z" />
        <path d="M8 12h8M8 16h5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Settings",
    helper: "Privacy and notifications",
    href: "/settings",
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
    logout: true,
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10 17 15 12l-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 4h3a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-3" strokeLinecap="round" />
      </svg>
    ),
  },
];

type PublicSession = {
  authenticated: boolean;
  name?: string;
  email?: string;
  provider?: string;
};

export function AppShell({ children, headerAction }: Readonly<{ children: ReactNode; headerAction?: ReactNode }>) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [session, setSession] = useState<PublicSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    async function loadSession() {
      const response = await fetch("/api/auth/session").catch(() => null);
      const data = response?.ok ? ((await response.json()) as PublicSession) : { authenticated: false };
      if (!ignore) setSession(data);
    }

    void loadSession();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    setSession({ authenticated: false });
    setProfileOpen(false);
    router.push("/login");
  }

  const isAuthenticated = Boolean(session?.authenticated);
  const displayName = session?.name || "Farzeen Ilyas";
  const displayEmail = session?.email || (isAuthenticated ? "Connected account" : "Not signed in");

  return (
    <main className="app-canvas flex h-screen flex-col overflow-hidden text-slate-950">
      <header className="z-20 shrink-0 bg-white/88 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[1fr_auto_1fr] sm:px-6 lg:px-8">
          <Link className="flex items-center justify-self-start" href="/" aria-label="Caseway home">
            <span
              aria-hidden="true"
              className="h-6 w-[52px] shrink-0 bg-contain bg-left bg-no-repeat"
              style={{ backgroundImage: "url('/nyaylink-logo.png')" }}
            />
          </Link>
          {headerAction ? (
            <div className="col-span-2 row-start-2 w-full justify-self-center sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:w-auto">
              {headerAction}
            </div>
          ) : null}
          <div
            className="relative justify-self-end sm:col-start-3"
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
                style={{ backgroundImage: "url('https://api.dicebear.com/9.x/notionists/svg?seed=Caseway%20User&backgroundColor=f1f5f9')" }}
              />
            </button>
            {profileOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 rounded-lg border border-slate-200 bg-white p-2 ring-1 ring-slate-950/5"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-3">
                  <span
                    aria-hidden="true"
                    className="h-10 w-10 rounded-full border border-slate-200 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://api.dicebear.com/9.x/notionists/svg?seed=Caseway%20User&backgroundColor=f1f5f9')" }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">{displayName}</p>
                    <p className="truncate text-xs font-medium text-slate-500">{displayEmail}</p>
                  </div>
                </div>
                <div className="mt-1 space-y-1">
                  {isAuthenticated ? (
                    profileActions.map((action) =>
                      action.logout ? (
                        <button
                          key={action.label}
                          type="button"
                          role="menuitem"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => void handleLogout()}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-red-600 transition hover:bg-red-50"
                        >
                          <span className="grid h-5 w-5 shrink-0 place-items-center text-current">{action.icon}</span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold">{action.label}</span>
                            <span className="block truncate text-xs text-red-300">{action.helper}</span>
                          </span>
                        </button>
                      ) : (
                        <Link
                          key={action.label}
                          href={action.href || "/profile"}
                          role="menuitem"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => setProfileOpen(false)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                        >
                          <span className="grid h-5 w-5 shrink-0 place-items-center text-current">{action.icon}</span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold">{action.label}</span>
                            <span className="block truncate text-xs text-slate-400">{action.helper}</span>
                          </span>
                        </Link>
                      ),
                    )
                  ) : (
                    <Link
                      href="/login"
                      role="menuitem"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center text-current">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M15 7l5 5-5 5M20 12H8" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M10 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h3" strokeLinecap="round" />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">Log in</span>
                        <span className="block truncate text-xs text-slate-400">Open your Caseway account</span>
                      </span>
                    </Link>
                  )}
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
        Caseway provides general legal information and workflow assistance. For filings,
        deadlines, notices, and court strategy, consult an enrolled advocate.
      </p>
    </aside>
  );
}
