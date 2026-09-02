import Link from "next/link";
import { AppShell } from "./components/AppShell";

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
      <section className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden bg-slate-950 px-4 py-16 text-center text-white sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-48"
          style={{ backgroundImage: "url('/courtroom-bg.png')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_6_4/0.58),rgb(7_6_4/0.82)),radial-gradient(circle_at_50%_42%,rgb(217_119_6/0.20),transparent_34rem)]" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
            Indian legal help desk
          </p>
          <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-normal text-white sm:text-6xl">
            Legal help that moves from facts to action.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-stone-200">
            NyayLink gives citizens a structured path through intake, document review, advocate
            discovery, consultation booking, and matter tracking.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className="rounded-md bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-black/25 transition hover:bg-amber-400" href="/intake">
              Start guided intake
            </Link>
            <Link className="rounded-md border border-white/35 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/18" href="/lawyers">
              Find consultation
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-x-8 gap-y-7 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-8">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="border-t border-stone-300 pt-4 text-left transition hover:border-[#8b5a2b]"
          >
            <h2 className="text-base font-bold">{section.title}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">{section.hindi}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{section.description}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="border-t border-stone-300 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b5a2b]">
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
      </section>
    </AppShell>
  );
}
