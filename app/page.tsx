import Link from "next/link";
import { AppShell, LegalDisclaimer } from "./components/AppShell";

const sections = [
  {
    title: "Guided Intake",
    hindi: "कानूनी ब्रीफ",
    href: "/intake",
    description:
      "Collect matter type, urgency, city, budget, and facts to generate a structured brief.",
  },
  {
    title: "Legal Desk",
    hindi: "कानूनी सहायक",
    href: "/assistant",
    description:
      "Ask Indian-law questions, get procedure checklists, and prepare a concise advocate brief.",
  },
  {
    title: "Find Lawyers",
    hindi: "वकील खोजें",
    href: "/lawyers",
    description:
      "Browse advocates by city, practice area, consultation price, rating, and urgency.",
  },
  {
    title: "Case Tracker",
    hindi: "मामला डैशबोर्ड",
    href: "/cases",
    description:
      "Show active matters, deadlines, document lists, timeline status, and case progress.",
  },
  {
    title: "Workflow Tools",
    hindi: "प्रक्रिया टूल्स",
    href: "/tools",
    description:
      "Explore OCR, document scanning, legal notices, income tax filing, and court-step workflows.",
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
      <section className="home-minimal mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b45309]">
          Indian legal help desk
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-normal text-slate-950 sm:text-6xl">
            Legal help that moves from facts to action.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
          NyayLink gives citizens a structured path through intake, document review, advocate
          discovery, consultation booking, and matter tracking.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link className="rounded-md bg-[#0f766e] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/15 transition hover:bg-[#0b625c]" href="/intake">
            Start guided intake
          </Link>
          <Link className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-500" href="/lawyers">
            Find consultation
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-x-8 gap-y-7 px-4 pb-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-8">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="border-t border-slate-300 pt-4 text-left transition hover:border-[#0f766e]"
          >
            <h2 className="text-base font-bold">{section.title}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">{section.hindi}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{section.description}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="border-t border-slate-300 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0f766e]">
            Platform services
          </p>
          <h2 className="mt-2 text-2xl font-bold">Operational service layer</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Built-in services support guided chat, lawyer search, consultation booking,
            payment orders, legal intake, case tracking, workflow modules, document review,
            and system health.
          </p>
          <p className="mt-5 text-sm font-semibold text-slate-700">
            {platformCapabilities.join(" · ")}
          </p>
        </div>
        <LegalDisclaimer />
      </section>
    </AppShell>
  );
}
