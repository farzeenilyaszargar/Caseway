import Link from "next/link";
import { AppShell } from "../components/AppShell";
import { savedFilings } from "../lib/account/mock";

export default function FilingsPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Workspace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">Saved filings</h1>
          </div>
          <Link href="/assistant" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            New filing
          </Link>
        </div>

        <div className="grid gap-3">
          {savedFilings.map((filing) => (
            <article key={filing.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">{filing.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{filing.forum}</p>
                </div>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                  {filing.status}
                </span>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-slate-950" style={{ width: `${filing.progress}%` }} />
              </div>
              <p className="mt-3 text-xs font-medium text-slate-400">Updated {filing.updatedAt}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
