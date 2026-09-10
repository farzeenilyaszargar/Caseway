import Link from "next/link";
import { AppShell } from "../components/AppShell";
import { savedDocuments } from "../lib/account/mock";

export default function DocumentsPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Vault</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">Documents</h1>
          </div>
          <Link href="/api/auth/digilocker/login" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-50">
            Connect DigiLocker
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {savedDocuments.map((document) => (
            <div key={document.id} className="grid gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_160px_160px] sm:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-950">{document.name}</p>
                <p className="mt-1 text-xs text-slate-500">{document.type}</p>
              </div>
              <p className="text-sm text-slate-600">{document.status}</p>
              <div className="text-sm text-slate-500">
                <p>{document.source}</p>
                <p className="text-xs text-slate-400">{document.retention}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
