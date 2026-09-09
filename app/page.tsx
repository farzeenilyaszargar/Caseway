import Link from "next/link";

const capabilities = [
  "Filing intake by conversation",
  "Document packet preparation",
  "Advocate review workspace",
];

export default function Home() {
  return (
    <main className="h-screen overflow-hidden bg-white text-slate-950">
      <header className="bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center" href="/" aria-label="Caseway home">
            <span
              aria-hidden="true"
              className="h-6 w-[52px] shrink-0 bg-contain bg-left bg-no-repeat"
              style={{ backgroundImage: "url('/nyaylink-logo.png')" }}
            />
          </Link>
          <Link
            href="/assistant"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Open app
          </Link>
        </div>
      </header>

      <section className="mx-auto grid h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="max-w-2xl">
          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
            Legal filing, shaped like a conversation.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            An AI law agent that gathers details, organizes documents, and helps you move from scattered paperwork to a review-ready filing packet.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/assistant"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Start with AI Legal Assistance
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/assistant?mode=lawyers"
              className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Find lawyers
            </Link>
          </div>

          <div className="mt-12 grid gap-3 border-t border-slate-200 pt-5">
            {capabilities.map((item) => (
              <div key={item} className="flex items-center justify-between gap-4 py-2">
                <p className="text-sm font-medium text-slate-900">{item}</p>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden min-h-[520px] justify-end overflow-hidden lg:flex">
          <div
            aria-hidden="true"
            className="h-[calc(100vh-120px)] max-h-[760px] min-h-[520px] w-full bg-contain bg-right-bottom bg-no-repeat"
            style={{ backgroundImage: "url('/lady-justice-hero.png')" }}
          />
        </div>
      </section>
    </main>
  );
}
