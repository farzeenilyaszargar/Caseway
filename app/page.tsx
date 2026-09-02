import Link from "next/link";
import { AppShell, LegalDisclaimer } from "./components/AppShell";
import { LegalWorkflowGraphic } from "./components/LegalGraphics";

const sections = [
  {
    title: "Guided Intake",
    hindi: "कानूनी ब्रीफ",
    href: "/intake",
    description:
      "Collect matter type, urgency, city, budget, and facts to generate a structured brief.",
    stats: "Smart triage",
    tone: "bg-[#0f766e]",
  },
  {
    title: "Legal Desk",
    hindi: "कानूनी सहायक",
    href: "/assistant",
    description:
      "Ask Indian-law questions, get procedure checklists, and prepare a concise advocate brief.",
    stats: "Guided chat",
    tone: "bg-[#334155]",
  },
  {
    title: "Find Lawyers",
    hindi: "वकील खोजें",
    href: "/lawyers",
    description:
      "Browse advocates by city, practice area, consultation price, rating, and urgency.",
    stats: "₹799+ consults",
    tone: "bg-[#b45309]",
  },
  {
    title: "Case Tracker",
    hindi: "मामला डैशबोर्ड",
    href: "/cases",
    description:
      "Show active matters, deadlines, document lists, timeline status, and case progress.",
    stats: "Matter ops",
    tone: "bg-[#475569]",
  },
  {
    title: "Workflow Tools",
    hindi: "प्रक्रिया टूल्स",
    href: "/tools",
    description:
      "Explore OCR, document scanning, legal notices, income tax filing, and court-step workflows.",
    stats: "Platform tools",
    tone: "bg-[#0f766e]",
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
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:px-8">
        <div className="premium-card paper-surface rounded-lg border border-slate-200 p-5 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#b45309]">
            <span className="h-2 w-2 rounded-full bg-[#b45309]" />
            Indian legal help desk
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.02] tracking-normal text-slate-950 sm:text-6xl">
            Legal help that moves from facts to action.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
            NyayLink gives citizens a structured path through intake, document review, advocate
            discovery, consultation booking, and matter tracking.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="rounded-md bg-[#0f766e] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/15 transition hover:bg-[#0b625c]" href="/intake">
              Start guided intake
            </Link>
            <Link className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-500" href="/lawyers">
              Find consultation
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["24x7", "legal intake desk"],
              ["9", "service endpoints"],
              ["6", "product sections"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-md border border-slate-200 bg-white/82 p-4">
                <p className="text-3xl font-black text-slate-950">{value}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <LegalWorkflowGraphic />
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-8 sm:px-6 lg:grid-cols-5 lg:px-8">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="route-card premium-card group rounded-lg border border-slate-200 p-5 transition hover:-translate-y-1 hover:border-teal-500"
          >
            <div className={`route-strip mb-5 h-1.5 rounded-full ${section.tone}`} />
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
            <p className="mt-6 text-sm font-black text-[#0f766e]">Open section</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="premium-card rounded-lg border border-slate-200 bg-white p-5">
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
        <LegalDisclaimer />
      </section>
    </AppShell>
  );
}
