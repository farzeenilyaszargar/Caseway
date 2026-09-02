"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../components/AppShell";

type CaseFile = {
  id: string;
  title: string;
  court: string;
  matterType: string;
  status: string;
  nextHearing: string;
  progress: number;
  owner: string;
  timeline: string[];
  documents: string[];
};

export default function CasesPage() {
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [summary, setSummary] = useState({ count: 0, openCases: 0, nextDeadline: "Loading" });
  const [status, setStatus] = useState("Loading case dashboard...");

  useEffect(() => {
    async function loadCases() {
      try {
        const response = await fetch("/api/cases");
        const data = (await response.json()) as {
          count?: number;
          openCases?: number;
          nextDeadline?: string;
          cases?: CaseFile[];
        };
        if (!response.ok || !data.cases) throw new Error("Cases failed.");
        setCases(data.cases);
        setSummary({
          count: data.count || 0,
          openCases: data.openCases || 0,
          nextDeadline: data.nextDeadline || "None",
        });
        setStatus("Case dashboard ready");
      } catch {
        setStatus("Could not load case dashboard.");
      }
    }
    void loadCases();
  }, []);

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="premium-card paper-surface rounded-lg border border-slate-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0f766e]">Case tracker</p>
          <h1 className="mt-1 text-3xl font-bold">Matter dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Track active matters, documents, workflow stage, next deadlines, and consultation status.
          </p>
          <p className="mt-4 rounded-md bg-teal-50 px-3 py-2 text-xs font-semibold text-[#0f766e]">{status}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-5 sm:px-6 md:grid-cols-3 lg:px-8">
        {[["Total matters", summary.count], ["Open cases", summary.openCases], ["Next deadline", summary.nextDeadline]].map(([label, value]) => (
          <div key={label} className="premium-card rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        {cases.map((caseFile) => (
          <article key={caseFile.id} className="premium-card rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">{caseFile.title}</h2>
                <p className="text-sm text-slate-600">{caseFile.court}</p>
              </div>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                {caseFile.matterType}
              </span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>{caseFile.status}</span>
                <span>{caseFile.progress}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-[#0f766e]" style={{ width: `${caseFile.progress}%` }} />
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold">Next: {caseFile.nextHearing}</p>
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Timeline</p>
              <ol className="mt-2 space-y-2 text-sm leading-5 text-slate-700">
                {caseFile.timeline.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ol>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {caseFile.documents.map((doc) => (
                <span key={doc} className="rounded bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                  {doc}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
