import Link from "next/link";

const capabilities = [
  "Filing intake by conversation",
  "Document packet preparation",
  "Advocate review workspace",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f8] text-slate-950">
      <header className="border-b border-slate-200/70 bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center" href="/" aria-label="NyayLink home">
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

      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col justify-between px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-5xl">
          <p className="text-sm font-medium text-slate-500">NyayLink</p>
          <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-slate-950 sm:text-7xl lg:text-8xl">
            Legal filing, shaped like a conversation.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            An AI law agent that gathers details, organizes documents, and helps you move from scattered paperwork to a review-ready filing packet.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/assistant"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Start with AI Law Agent
            </Link>
            <Link
              href="/assistant"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Find lawyers
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-3 border-t border-slate-200 pt-6 md:grid-cols-3">
          {capabilities.map((item) => (
            <div key={item} className="flex items-center justify-between gap-4 py-3">
              <p className="text-base font-medium text-slate-900">{item}</p>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
