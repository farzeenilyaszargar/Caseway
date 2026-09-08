"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "../components/AppShell";

type Question = {
  id: string;
  label: string;
  options: string[];
};

type IntakeResult = {
  id: string;
  matterType: string;
  urgency: string;
  city: string;
  budget: string;
  triageScore: string;
  requiredDocuments: string[];
  recommendedLawyers: { id: number; name: string; specialty: string; price: number; city: string }[];
};

export default function IntakePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [form, setForm] = useState({
    matterType: "Property",
    urgency: "This week",
    city: "Bengaluru",
    budget: "₹1,000 - ₹1,500",
    summary: "",
  });
  const [result, setResult] = useState<IntakeResult | null>(null);
  const [status, setStatus] = useState("Loading intake form...");

  useEffect(() => {
    async function loadSchema() {
      try {
        const response = await fetch("/api/intake");
        const data = (await response.json()) as { questions?: Question[] };
        if (!response.ok || !data.questions) throw new Error("Schema failed.");
        setQuestions(data.questions);
        setStatus("Intake form ready");
      } catch {
        setStatus("Could not load intake schema.");
      }
    }
    void loadSchema();
  }, []);

  async function submitIntake(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Reviewing intake...");
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as IntakeResult & { error?: string };
      if (!response.ok || !data.id) throw new Error(data.error || "Intake failed.");
      setResult(data);
      setStatus("Intake triage created");
    } catch {
      setStatus("Please add an issue summary before submitting.");
    }
  }

  return (
    <AppShell>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-8">
        <form onSubmit={submitIntake} className="premium-card paper-surface rounded-lg border border-slate-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0f766e]">Guided intake</p>
          <h1 className="mt-1 text-3xl font-bold">Create a legal brief</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Turn a citizen issue into a matter type, urgency score, document checklist, and lawyer shortlist.
          </p>
          <p className="mt-4 rounded-md bg-teal-50 px-3 py-2 text-xs font-semibold text-[#0f766e]">{status}</p>

          <div className="mt-5 space-y-4">
            {questions.map((question) => (
              <label key={question.id} className="block text-xs font-semibold text-slate-600">
                {question.label}
                <select
                  value={form[question.id as keyof typeof form]}
                  onChange={(event) => setForm((current) => ({ ...current, [question.id]: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                >
                  {question.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            ))}
            <label className="block text-xs font-semibold text-slate-600">
              Issue summary
              <textarea
                value={form.summary}
                onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
                rows={6}
                placeholder="Example: My landlord sent a notice asking me to vacate in 30 days..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-teal-100"
              />
            </label>
            <button className="w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
              Generate brief
            </button>
          </div>
        </form>

        <div className="premium-card rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#b45309]">Triage output</p>
          {result ? (
            <div className="mt-4 space-y-5">
              <div className="grid gap-3 sm:grid-cols-4">
                {[["Matter", result.matterType], ["Urgency", result.urgency], ["City", result.city], ["Score", result.triageScore]].map(([label, value]) => (
                  <div key={label} className="rounded-md bg-slate-50 p-4">
                    <p className="text-xs font-bold text-slate-500">{label}</p>
                    <p className="mt-1 font-bold">{value}</p>
                  </div>
                ))}
              </div>
              <div>
                <h2 className="font-bold">Required documents</h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {result.requiredDocuments.map((doc) => (
                    <span key={doc} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-bold">Recommended advocates</h2>
                <div className="mt-3 grid gap-3">
                  {result.recommendedLawyers.map((lawyer) => (
                    <div key={lawyer.id} className="flex items-center justify-between rounded-md border border-slate-200 p-3">
                      <div>
                        <p className="font-bold">{lawyer.name}</p>
                        <p className="text-xs text-slate-500">{lawyer.specialty} • {lawyer.city}</p>
                      </div>
                      <p className="font-bold">₹{lawyer.price}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/assistant" className="rounded-md bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white">Continue in Legal Desk</Link>
                <Link href="/lawyers" className="rounded-md border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800">Book consultation</Link>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-sm leading-6 text-slate-600">
              Submit the intake form to generate a legal brief, document checklist, and advocate shortlist.
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
