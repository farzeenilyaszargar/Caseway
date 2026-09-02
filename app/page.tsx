import Link from "next/link";
import { AppShell, LegalDisclaimer } from "./components/AppShell";

const sections = [
  {
    title: "Guided Intake",
    hindi: "कानूनी ब्रीफ",
    href: "/intake",
    description:
      "Collect matter type, urgency, city, budget, and facts to generate a structured brief.",
    stats: "Smart triage",
  },
  {
    title: "Legal Desk",
    hindi: "कानूनी सहायक",
    href: "/assistant",
    description:
      "Ask Indian-law questions, get procedure checklists, and prepare a concise advocate brief.",
    stats: "Guided chat",
  },
  {
    title: "Find Lawyers",
    hindi: "वकील खोजें",
    href: "/lawyers",
    description:
      "Browse advocates by city, practice area, consultation price, rating, and urgency.",
    stats: "₹799+ consults",
  },
  {
    title: "Case Tracker",
    hindi: "मामला डैशबोर्ड",
    href: "/cases",
    description:
      "Show active matters, deadlines, document lists, timeline status, and case progress.",
    stats: "Matter ops",
  },
  {
    title: "Workflow Tools",
    hindi: "प्रक्रिया टूल्स",
    href: "/tools",
    description:
      "Explore OCR, document scanning, legal notices, income tax filing, and court-step workflows.",
    stats: "Platform tools",
  },
];

const platformCapabilities = [
  "Guided legal intake",
  "Advocate discovery",
  "Consultation booking",
  "Payment orders",
  "Case tracking",
  "Document review",
];

export default function Home() {
  return (
    <AppShell>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#b45309]">
            Indian legal help desk
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-normal sm:text-5xl">
            Resolve legal questions, prepare documents, and reach the right advocate.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            NyayLink is a full-stack legal services platform for Indian citizens, split into
            clear sections for guided intake, consultation discovery, case tracking, and legal
            workflow tools.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="rounded-md bg-[#0f766e] px-4 py-3 text-sm font-semibold text-white" href="/intake">
              Start guided intake
            </Link>
            <Link className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800" href="/lawyers">
              Find consultation
            </Link>
          </div>
        </div>
        <LegalDisclaimer />
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">{section.title}</h2>
                <p className="text-sm font-semibold text-slate-500">{section.hindi}</p>
              </div>
              <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {section.stats}
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">{section.description}</p>
            <p className="mt-6 text-sm font-bold text-[#0f766e]">Open section</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-3 rounded-lg border border-slate-200 bg-[#0f172a] p-5 text-white sm:grid-cols-3">
          <div>
            <p className="text-3xl font-bold">24x7</p>
            <p className="text-sm text-slate-300">legal intake desk</p>
          </div>
          <div>
            <p className="text-3xl font-bold">9</p>
            <p className="text-sm text-slate-300">service endpoints</p>
          </div>
          <div>
            <p className="text-3xl font-bold">6</p>
            <p className="text-sm text-slate-300">product sections</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0f766e]">
                Platform services
              </p>
              <h2 className="mt-1 text-2xl font-bold">Operational service layer</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Built-in services support guided chat, lawyer search, consultation booking,
                payment orders, legal intake, case tracking, workflow modules, document review,
                and system health.
              </p>
            </div>
            <span className="rounded-md bg-teal-50 px-3 py-2 text-sm font-semibold text-[#0f766e]">
              Operational
            </span>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {platformCapabilities.map((capability) => (
              <span key={capability} className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                {capability}
              </span>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
