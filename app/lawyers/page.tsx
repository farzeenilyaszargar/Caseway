"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../components/AppShell";
import { categories, cities, lawyers as fallbackLawyers, type Lawyer } from "../data";

export default function LawyersPage() {
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All cities");
  const [budget, setBudget] = useState(2000);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<number | null>(null);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>(fallbackLawyers);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState("Loaded from /api/lawyers");
  const [bookingStatus, setBookingStatus] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      city,
      category,
      maxPrice: String(budget),
      urgentOnly: String(urgentOnly),
    });

    async function loadLawyers() {
      setIsLoading(true);
      setApiStatus("Calling /api/lawyers...");
      try {
        const response = await fetch(`/api/lawyers?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as { results?: Lawyer[]; error?: string };
        if (!response.ok || !data.results) {
          throw new Error(data.error || "Lawyer search failed.");
        }
        setFilteredLawyers(data.results);
        setApiStatus("Results served by /api/lawyers");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setFilteredLawyers([]);
          setApiStatus("Search API error");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadLawyers();
    return () => controller.abort();
  }, [budget, category, city, urgentOnly]);

  async function bookConsultation(lawyer: Lawyer) {
    setSelectedLawyer(lawyer.id);
    setBookingStatus("Creating consultation via /api/consultations...");

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lawyerId: lawyer.id,
          issueSummary: `${lawyer.specialty} consultation request from marketplace.`,
          preferredSlot: lawyer.availability,
          contactMode: "video",
        }),
      });
      const data = (await response.json()) as { id?: string; status?: string; error?: string };
      if (!response.ok || !data.id) {
        throw new Error(data.error || "Consultation booking failed.");
      }

      const paymentResponse = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId: data.id,
          amount: lawyer.price,
          method: "upi",
        }),
      });
      const payment = (await paymentResponse.json()) as { id?: string; status?: string };
      setBookingStatus(
        `Consultation ${data.status}: ${data.id}. Payment ${payment.status}: ${payment.id}`,
      );
    } catch {
      setBookingStatus("Could not create consultation. Please try again.");
    }
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0f766e]">
            Vakil Connect
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-normal">Find consultation</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Browse placeholder Indian advocates by city, court proximity, specialty, language,
                price, and availability.
              </p>
            </div>
            <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
              {isLoading ? "Searching..." : `${filteredLawyers.length} matches`}
            </span>
          </div>
          <p className="mt-4 rounded-md bg-teal-50 px-3 py-2 text-xs font-semibold text-[#0f766e]">
            {apiStatus}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 sm:px-6 lg:grid-cols-[310px_minmax(0,1fr)] lg:px-8">
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Filters</h2>
          <div className="mt-4 space-y-4">
            <label className="block text-xs font-semibold text-slate-600">
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
            <label className="block text-xs font-semibold text-slate-600">
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
            <label className="block text-xs font-semibold text-slate-600">
              Max consultation fee: ₹{budget}
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
        </aside>

        <div>
          {filteredLawyers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
              No placeholder lawyers match these filters. Increase the budget or broaden the location.
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredLawyers.map((lawyer) => (
                <article key={lawyer.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold">{lawyer.name}</h2>
                      <p className="text-sm text-slate-600">
                        {lawyer.specialty} law • {lawyer.city}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{lawyer.court}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">₹{lawyer.price}</p>
                      <p className="text-xs text-slate-500">30 min</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                    <span className="rounded bg-slate-50 px-2 py-2 font-semibold">★ {lawyer.rating}</span>
                    <span className="rounded bg-slate-50 px-2 py-2 font-semibold">{lawyer.experience} yrs</span>
                    <span className="rounded bg-slate-50 px-2 py-2 font-semibold">{lawyer.response}</span>
                    <span className="rounded bg-slate-50 px-2 py-2 font-semibold">{lawyer.availability}</span>
                  </div>
                  <p className="mt-4 text-xs leading-5 text-slate-600">
                    Languages: {lawyer.languages.join(", ")} • {lawyer.matters} matters handled
                  </p>
                  <button
                    onClick={() => void bookConsultation(lawyer)}
                    className={`mt-4 w-full rounded-md px-4 py-3 text-sm font-semibold ${
                      selectedLawyer === lawyer.id
                        ? "bg-[#0f766e] text-white"
                        : "bg-slate-950 text-white hover:bg-slate-800"
                    }`}
                  >
                    {selectedLawyer === lawyer.id
                      ? "Consult selected / सलाह चुनी गई"
                      : "Book consultation"}
                  </button>
                  {selectedLawyer === lawyer.id && bookingStatus ? (
                    <p className="mt-3 rounded-md bg-teal-50 px-3 py-2 text-xs font-semibold text-[#0f766e]">
                      {bookingStatus}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
