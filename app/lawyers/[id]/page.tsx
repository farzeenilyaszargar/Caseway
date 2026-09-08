import Link from "next/link";
import { AppShell } from "../../components/AppShell";
import { lawyers } from "../../data";

const caseDocuments = [
  {
    name: "Filing packet draft.pdf",
    status: "Ready for review",
    detail: "Generated from AI Law Agent intake",
  },
  {
    name: "Identity and address proof.zip",
    status: "Needs advocate check",
    detail: "PAN, Aadhaar, and address record placeholders",
  },
  {
    name: "Evidence bundle.pdf",
    status: "Shared",
    detail: "Invoices, notices, screenshots, and supporting papers",
  },
];

const chatMessages = [
  {
    role: "lawyer",
    text: "I have your filing packet. I will check jurisdiction, limitation, document gaps, and whether anything needs notarization before filing.",
  },
  {
    role: "user",
    text: "Please review the documents and tell me what is missing before submission.",
  },
  {
    role: "lawyer",
    text: "Start by confirming the forum and upload any final payment receipt or notice copy. I will mark the packet ready after that.",
  },
];

export default async function LawyerWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lawyer = lawyers.find((item) => item.id === Number(id)) || lawyers[0];

  return (
    <AppShell>
      <section className="mx-auto grid h-full max-w-7xl gap-4 overflow-y-auto px-4 py-4 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-lg border border-slate-200 bg-white p-4">
          <Link href="/assistant" className="text-sm font-medium text-slate-500 hover:text-slate-950">
            Back to lawyers
          </Link>
          <div className="mt-5 flex items-center gap-4">
            <div
              role="img"
              aria-label={`Demo profile portrait for ${lawyer.name}`}
              className="h-20 w-20 rounded-lg border border-slate-200 bg-slate-50 bg-cover bg-center"
              style={{ backgroundImage: `url(${lawyer.profileImage})` }}
            />
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-normal text-slate-950">{lawyer.name}</h1>
              <p className="mt-1 text-sm text-slate-500">{lawyer.specialty} · {lawyer.city}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="font-semibold text-slate-950">{lawyer.rating}</p>
              <p className="text-xs text-slate-500">Rating</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="font-semibold text-slate-950">{lawyer.experience} yrs</p>
              <p className="text-xs text-slate-500">Experience</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="font-semibold text-slate-950">{lawyer.response}</p>
              <p className="text-xs text-slate-500">Response</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="font-semibold text-slate-950">Rs {lawyer.price}</p>
              <p className="text-xs text-slate-500">Review fee</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">
            {lawyer.court}. Speaks {lawyer.languages.join(", ")}. Available {lawyer.availability.toLowerCase()} for packet review.
          </p>
        </aside>

        <div className="grid min-h-[720px] gap-4 lg:grid-rows-[auto_minmax(0,1fr)]">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Case documents</h2>
                <p className="mt-1 text-sm text-slate-500">Shared packet for advocate review and filing readiness.</p>
              </div>
              <button className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                Upload document
              </button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {caseDocuments.map((document) => (
                <article key={document.name} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="font-semibold text-slate-950">{document.name}</p>
                  <p className="mt-1 text-xs font-medium text-emerald-700">{document.status}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{document.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-4 py-3">
              <h2 className="text-lg font-semibold text-slate-950">Chat with {lawyer.name.replace("Adv. ", "")}</h2>
              <p className="mt-1 text-sm text-slate-500">Demo secure conversation linked to the current filing packet.</p>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <p
                    className={`max-w-[78%] rounded-xl px-4 py-3 text-sm leading-6 ${
                      message.role === "user" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              ))}
            </div>
            <form className="border-t border-slate-100 p-3">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
                <button type="button" className="grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </button>
                <input
                  aria-label="Message lawyer"
                  placeholder={`Message ${lawyer.name.replace("Adv. ", "")}...`}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm outline-none"
                />
                <button type="submit" className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-white hover:bg-slate-800">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
