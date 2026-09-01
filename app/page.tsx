"use client";

import { FormEvent, useMemo, useState } from "react";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

type Lawyer = {
  id: number;
  name: string;
  city: string;
  court: string;
  specialty: string;
  price: number;
  rating: number;
  experience: number;
  languages: string[];
  response: string;
  availability: "Today" | "Tomorrow" | "This week";
  matters: number;
};

const lawyers: Lawyer[] = [
  {
    id: 1,
    name: "Adv. Aditi Menon",
    city: "Bengaluru",
    court: "Karnataka High Court",
    specialty: "Property",
    price: 1499,
    rating: 4.9,
    experience: 12,
    languages: ["English", "Hindi", "Kannada"],
    response: "12 min",
    availability: "Today",
    matters: 438,
  },
  {
    id: 2,
    name: "Adv. Rohan Batra",
    city: "Delhi",
    court: "Patiala House Courts",
    specialty: "Criminal",
    price: 999,
    rating: 4.8,
    experience: 9,
    languages: ["English", "Hindi", "Punjabi"],
    response: "18 min",
    availability: "Today",
    matters: 512,
  },
  {
    id: 3,
    name: "Adv. Meera Iyer",
    city: "Mumbai",
    court: "Bombay High Court",
    specialty: "Family",
    price: 1299,
    rating: 4.7,
    experience: 14,
    languages: ["English", "Hindi", "Marathi", "Tamil"],
    response: "25 min",
    availability: "Tomorrow",
    matters: 366,
  },
  {
    id: 4,
    name: "Adv. Kabir Sethi",
    city: "Gurugram",
    court: "District Court Gurugram",
    specialty: "Tax",
    price: 1899,
    rating: 4.9,
    experience: 11,
    languages: ["English", "Hindi"],
    response: "10 min",
    availability: "Today",
    matters: 291,
  },
  {
    id: 5,
    name: "Adv. Nandini Rao",
    city: "Hyderabad",
    court: "City Civil Court",
    specialty: "Consumer",
    price: 799,
    rating: 4.6,
    experience: 7,
    languages: ["English", "Hindi", "Telugu"],
    response: "35 min",
    availability: "This week",
    matters: 224,
  },
  {
    id: 6,
    name: "Adv. Arjun Chatterjee",
    city: "Kolkata",
    court: "Calcutta High Court",
    specialty: "Labour",
    price: 1199,
    rating: 4.8,
    experience: 10,
    languages: ["English", "Hindi", "Bengali"],
    response: "22 min",
    availability: "Tomorrow",
    matters: 317,
  },
];

const prompts = [
  "I received a legal notice from my landlord. What should I check first?",
  "Guide me through filing a consumer complaint in India.",
  "What documents are needed for an income tax notice response?",
  "Can you summarize a property agreement after OCR scan?",
];

const services = [
  { name: "Document Scan", hindi: "दस्तावेज़ स्कैन", detail: "OCR intake and issue spotting" },
  { name: "Legal Notice", hindi: "नोटिस ड्राफ्ट", detail: "Draft reply and timeline" },
  { name: "Tax Filing", hindi: "आयकर सहायता", detail: "ITR and notice checklist" },
  { name: "Court Steps", hindi: "प्रक्रिया गाइड", detail: "Procedure map by matter" },
];

const categories = ["All", "Property", "Criminal", "Family", "Tax", "Consumer", "Labour"];
const cities = ["All cities", "Bengaluru", "Delhi", "Mumbai", "Gurugram", "Hyderabad", "Kolkata"];

function makeReply(input: string) {
  const lower = input.toLowerCase();
  if (lower.includes("consumer")) {
    return "For a consumer complaint in India, start with invoices, warranty records, messages, and a written demand to the seller. If unresolved, the route usually moves to the District Consumer Commission based on claim value and location. I can prepare a filing checklist and then suggest consumer-law advocates nearby.";
  }
  if (lower.includes("tax") || lower.includes("income")) {
    return "For an income tax notice, first identify the section, assessment year, response deadline, and mismatch reason. Keep Form 26AS, AIS/TIS, bank statements, salary/business records, and prior ITR ready. This prototype can map the checklist, but a CA or tax advocate should review before filing.";
  }
  if (lower.includes("property") || lower.includes("agreement")) {
    return "For property documents, scan the title chain, sale deed, encumbrance certificate, khata or municipal records, tax receipts, and possession clauses. I would flag missing signatures, dispute clauses, stamp duty details, and registration references before lawyer review.";
  }
  if (lower.includes("landlord") || lower.includes("notice") || lower.includes("rent")) {
    return "For a landlord or tenancy notice, check the notice date, lease clause relied on, cure period, rent dues, security deposit terms, and jurisdiction. Do not ignore the deadline. A short reply preserving your rights is often the first step before negotiation or filing.";
  }
  return "I can help structure the issue under Indian law, identify documents, draft a checklist, and suggest whether this looks like property, family, consumer, tax, criminal, or labour counsel. This is general information only; an advocate should review facts before you act.";
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Namaste. I am Nyay AI, a prototype legal guide for Indian procedures. Tell me your issue, or choose a prompt, and I will organize the next steps before you consult an advocate.",
    },
  ]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All cities");
  const [budget, setBudget] = useState(2000);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [activeService, setActiveService] = useState("Document Scan");
  const [selectedLawyer, setSelectedLawyer] = useState<number | null>(null);

  const filteredLawyers = useMemo(() => {
    return lawyers.filter((lawyer) => {
      const matchesCategory = category === "All" || lawyer.specialty === category;
      const matchesCity = city === "All cities" || lawyer.city === city;
      const matchesBudget = lawyer.price <= budget;
      const matchesUrgent = !urgentOnly || lawyer.availability === "Today";
      return matchesCategory && matchesCity && matchesBudget && matchesUrgent;
    });
  }, [budget, category, city, urgentOnly]);

  function sendMessage(text = input) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "assistant", text: makeReply(trimmed) },
    ]);
    setInput("");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-[#fbfaf7]/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-sm font-bold text-white">
              न
            </div>
            <div>
              <p className="text-base font-semibold leading-tight">NyayLink</p>
              <p className="text-xs text-slate-500">AI law guide + Vakil Connect</p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 rounded-md border border-slate-200 bg-white p-1 text-sm font-medium text-slate-600 md:flex">
            <a className="rounded px-3 py-2 text-slate-950" href="#assistant">Nyay AI</a>
            <a className="rounded px-3 py-2 hover:bg-slate-100" href="#lawyers">Find Lawyers</a>
            <a className="rounded px-3 py-2 hover:bg-slate-100" href="#tools">Tools</a>
          </nav>
          <button className="rounded-md bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-900/10">
            Consult / सलाह लें
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#b45309]">
                Indian legal help desk
              </p>
              <h1 className="mt-2 max-w-2xl text-3xl font-bold leading-tight tracking-normal sm:text-4xl">
                Resolve legal questions, prepare documents, and reach the right advocate.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                A frontend prototype for Indian citizens: AI-guided intake, procedure checklists, OCR-ready document review, and nearby consultation discovery in one practical workspace.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-md bg-[#0f172a] p-3 text-white lg:grid-cols-1">
              <div>
                <p className="text-2xl font-bold">24x7</p>
                <p className="text-xs text-slate-300">AI intake</p>
              </div>
              <div>
                <p className="text-2xl font-bold">₹799+</p>
                <p className="text-xs text-slate-300">consults</p>
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-slate-300">practice areas</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-amber-200 bg-[#fff8eb] p-4 text-sm leading-6 text-amber-950">
          <p className="font-semibold">Legal information only</p>
          <p className="mt-1">
            Nyay AI is a prototype and does not replace advice from an enrolled advocate. Deadlines, court rules, and facts matter. Please verify before filing or replying.
          </p>
        </aside>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(390px,0.9fr)] lg:px-8">
        <div id="assistant" className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0f766e]">Nyay AI</p>
                <h2 className="text-xl font-bold">Indian law assistant</h2>
              </div>
              <span className="rounded-md bg-teal-50 px-3 py-1 text-xs font-semibold text-[#0f766e]">
                Mock chat
              </span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="min-h-14 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-medium leading-5 text-slate-700 hover:border-teal-500 hover:bg-teal-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[430px] overflow-y-auto p-4 sm:p-5">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-lg px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-[#0f766e] text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={onSubmit} className="border-t border-slate-200 p-4 sm:p-5">
            <label className="sr-only" htmlFor="legal-query">Ask Nyay AI</label>
            <div className="flex gap-2">
              <input
                id="legal-query"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Describe your legal issue..."
                className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-teal-100"
              />
              <button className="rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
                Send
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-5">
          <section id="tools" className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#b45309]">Procedure tools</p>
                <h2 className="text-xl font-bold">Legal workflow shortcuts</h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">Prototype</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {services.map((service) => (
                <button
                  key={service.name}
                  onClick={() => setActiveService(service.name)}
                  className={`min-h-24 rounded-md border p-3 text-left ${
                    activeService === service.name
                      ? "border-[#0f766e] bg-teal-50"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <span className="block text-sm font-bold">{service.name}</span>
                  <span className="block text-xs font-medium text-slate-500">{service.hindi}</span>
                  <span className="mt-2 block text-xs leading-5 text-slate-600">{service.detail}</span>
                </button>
              ))}
            </div>
          </section>

          <section id="lawyers" className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0f766e]">Vakil Connect</p>
                  <h2 className="text-xl font-bold">Find consultation</h2>
                </div>
                <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {filteredLawyers.length} matches
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-semibold text-slate-600">
                  City
                  <select
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  >
                    {cities.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-semibold text-slate-600">
                  Practice area
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                  >
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <label className="min-w-[220px] flex-1 text-xs font-semibold text-slate-600">
                  Max fee: ₹{budget}
                  <input
                    type="range"
                    min="700"
                    max="2200"
                    step="100"
                    value={budget}
                    onChange={(event) => setBudget(Number(event.target.value))}
                    className="mt-2 w-full accent-[#0f766e]"
                  />
                </label>
                <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={urgentOnly}
                    onChange={(event) => setUrgentOnly(event.target.checked)}
                    className="h-4 w-4 accent-[#0f766e]"
                  />
                  Available today
                </label>
              </div>
            </div>

            <div className="max-h-[522px] overflow-y-auto p-4 sm:p-5">
              {filteredLawyers.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
                  No placeholder lawyers match these filters. Increase the budget or broaden the location.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLawyers.map((lawyer) => (
                    <article key={lawyer.id} className="rounded-md border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold">{lawyer.name}</h3>
                          <p className="text-sm text-slate-600">{lawyer.specialty} law • {lawyer.city}</p>
                          <p className="mt-1 text-xs text-slate-500">{lawyer.court}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{lawyer.price}</p>
                          <p className="text-xs text-slate-500">30 min</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                        <span className="rounded bg-slate-50 px-2 py-2 font-semibold">★ {lawyer.rating}</span>
                        <span className="rounded bg-slate-50 px-2 py-2 font-semibold">{lawyer.experience} yrs</span>
                        <span className="rounded bg-slate-50 px-2 py-2 font-semibold">{lawyer.response}</span>
                        <span className="rounded bg-slate-50 px-2 py-2 font-semibold">{lawyer.availability}</span>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-slate-600">
                        Languages: {lawyer.languages.join(", ")} • {lawyer.matters} matters handled
                      </p>
                      <button
                        onClick={() => setSelectedLawyer(lawyer.id)}
                        className={`mt-3 w-full rounded-md px-4 py-2 text-sm font-semibold ${
                          selectedLawyer === lawyer.id
                            ? "bg-[#0f766e] text-white"
                            : "bg-slate-950 text-white hover:bg-slate-800"
                        }`}
                      >
                        {selectedLawyer === lawyer.id ? "Consult selected / सलाह चुनी गई" : "Book consultation"}
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
