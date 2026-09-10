import Link from "next/link";
import { AppShell } from "../components/AppShell";
import { getCasewaySession, publicSession } from "../lib/auth/session";
import { mockUser, savedDocuments, savedFilings } from "../lib/account/mock";

export default async function ProfilePage() {
  const session = publicSession(await getCasewaySession());
  const isAuthenticated = session.authenticated;

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Account</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">Profile</h1>
          </div>
          {!isAuthenticated ? (
            <Link className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white" href="/login">
              Log in
            </Link>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-16 w-16 rounded-full border border-slate-200 bg-cover bg-center"
                style={{ backgroundImage: `url('https://api.dicebear.com/9.x/notionists/svg?seed=${mockUser.avatarSeed}&backgroundColor=f1f5f9')` }}
              />
              <div>
                <h2 className="text-xl font-semibold text-slate-950">{isAuthenticated ? session.name || mockUser.name : mockUser.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{isAuthenticated ? session.email || mockUser.email : mockUser.email}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ["Phone", mockUser.phone],
                ["City", mockUser.city],
                ["Provider", isAuthenticated ? session.provider : mockUser.provider],
                ["Joined", mockUser.joined],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-950">Workspace summary</p>
            <div className="mt-5 space-y-3">
              <Link href="/filings" className="block rounded-lg border border-slate-200 px-4 py-3 transition hover:bg-slate-50">
                <p className="text-2xl font-semibold text-slate-950">{savedFilings.length}</p>
                <p className="text-sm text-slate-500">Saved filings</p>
              </Link>
              <Link href="/documents" className="block rounded-lg border border-slate-200 px-4 py-3 transition hover:bg-slate-50">
                <p className="text-2xl font-semibold text-slate-950">{savedDocuments.length}</p>
                <p className="text-sm text-slate-500">Saved documents</p>
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}
