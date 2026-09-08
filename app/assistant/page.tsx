"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppShell } from "../components/AppShell";
import { categories, cities, lawyers as fallbackLawyers, type Lawyer } from "../data";

type Mode = "agent" | "lawyers";

type Integration = {
  id:
    | "income_tax_eri"
    | "gstn_gsp"
    | "digilocker_apisetu"
    | "ecourts_services"
    | "ecourts_efiling"
    | "ecourts_epay"
    | "edaakhil_ejagriti";
  name: string;
  status: "implementable" | "requires-registration" | "requires-human-portal-step";
};

type Field = {
  id: string;
  label: string;
  question: string;
  required: boolean;
  sensitive?: boolean;
  placeholder?: string;
};

type Workflow = {
  id: "income_tax_return" | "consumer_complaint" | "legal_notice_reply" | "court_filing";
  name: string;
  forum: string;
  estimatedTime: string;
  integrations?: Integration[];
  fields?: Field[];
};

type AgentTurn = {
  workflow: Workflow & { fields: Field[] };
  integration: Integration;
  collected: Record<string, string>;
  missingFields: Field[];
  nextQuestion: string;
  completion: number;
  readyToReview: boolean;
  draftPacket: {
    title: string;
    forum: string;
  } | null;
};

type ChatMessage = {
  role: "assistant" | "user" | "system";
  text: string;
};

const starterPrompts = ["File my income tax return", "Create a consumer complaint", "Prepare court filing packet"];

export default function AssistantPage() {
  const [mode, setMode] = useState<Mode>("agent");
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<Workflow["id"]>("income_tax_return");
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<Integration["id"]>("income_tax_eri");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Tell me what you want to file. I will ask the missing questions, prepare the packet, and wait for your consent before any submission handoff.",
    },
  ]);
  const [input, setInput] = useState("");
  const [collected, setCollected] = useState<Record<string, string>>({});
  const [agentTurn, setAgentTurn] = useState<AgentTurn | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [submission, setSubmission] = useState<string | null>(null);

  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All cities");
  const [budget, setBudget] = useState(2000);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>(fallbackLawyers);
  const [lawyerStatus, setLawyerStatus] = useState("Listings ready");

  const activeWorkflow = useMemo(
    () => agentTurn?.workflow || workflows.find((workflow) => workflow.id === selectedWorkflowId),
    [agentTurn?.workflow, selectedWorkflowId, workflows],
  );
  const integrationOptions = useMemo(
    () => activeWorkflow?.integrations || [],
    [activeWorkflow?.integrations],
  );
  const activeIntegration = useMemo(
    () => agentTurn?.integration || integrationOptions.find((integration) => integration.id === selectedIntegrationId),
    [agentTurn?.integration, integrationOptions, selectedIntegrationId],
  );

  useEffect(() => {
    async function loadWorkflows() {
      try {
        const response = await fetch("/api/agent");
        const data = (await response.json()) as { workflows?: Workflow[] };
        if (!response.ok || !data.workflows?.length) throw new Error("Workflow load failed.");
        setWorkflows(data.workflows);
        setSelectedIntegrationId(data.workflows[0].integrations?.[0]?.id || "income_tax_eri");
      } catch {
        setStatus("Workflow registry unavailable");
      }
    }

    void loadWorkflows();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      city,
      category,
      maxPrice: String(budget),
      urgentOnly: String(urgentOnly),
    });

    async function loadLawyers() {
      setLawyerStatus("Searching");
      try {
        const response = await fetch(`/api/lawyers?${params.toString()}`, { signal: controller.signal });
        const data = (await response.json()) as { results?: Lawyer[] };
        if (!response.ok || !data.results) throw new Error("Lawyer search failed.");
        setFilteredLawyers(data.results);
        setLawyerStatus("Listings ready");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setFilteredLawyers([]);
          setLawyerStatus("Search unavailable");
        }
      }
    }

    void loadLawyers();
    return () => controller.abort();
  }, [budget, category, city, urgentOnly]);

  async function sendMessage(text = input) {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    setInput("");
    setIsSending(true);
    setSubmission(null);
    setStatus("Thinking");

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          workflowId: selectedWorkflowId,
          integrationId: selectedIntegrationId,
          collected,
        }),
      });
      const data = (await response.json()) as AgentTurn & { error?: string };
      if (!response.ok || !data.workflow) throw new Error(data.error || "Agent failed.");

      setSelectedWorkflowId(data.workflow.id);
      setSelectedIntegrationId(data.integration.id);
      setCollected(data.collected);
      setAgentTurn(data);
      setConsent(false);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: data.readyToReview
            ? "Your packet is ready. Review the details on the right and confirm consent only if everything looks correct."
            : data.nextQuestion,
        },
      ]);
      setStatus(data.readyToReview ? "Review ready" : "Collecting");
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: "I could not process that. Try again with the missing detail." }]);
      setStatus("Needs attention");
    } finally {
      setIsSending(false);
    }
  }

  function switchWorkflow(workflowId: Workflow["id"]) {
    const workflow = workflows.find((item) => item.id === workflowId);
    setSelectedWorkflowId(workflowId);
    setSelectedIntegrationId(workflow?.integrations?.[0]?.id || "income_tax_eri");
    setCollected({});
    setAgentTurn(null);
    setConsent(false);
    setSubmission(null);
    setMessages([
      {
        role: "assistant",
        text: workflow
          ? `Starting ${workflow.name}. Tell me what you already know, or type start and I will ask the first question.`
          : "Tell me what you want to file.",
      },
    ]);
  }

  async function submitPacket() {
    if (!agentTurn?.readyToReview || !consent || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/filings/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: agentTurn.workflow.id,
          integrationId: activeIntegration?.id || agentTurn.integration.id,
          collected,
          consent,
        }),
      });
      const data = (await response.json()) as { status?: string; forum?: string; nextStep?: string; error?: string };
      if (!response.ok || !data.status || !data.forum || !data.nextStep) {
        throw new Error(data.error || "Submission failed.");
      }
      setSubmission(data.nextStep);
      setMessages((current) => [
        ...current,
        { role: "system", text: `Queued for ${data.forum}. Live filing still needs credentials, signature, payment, and review.` },
      ]);
      setStatus("Queued");
    } catch {
      setStatus("Submission blocked");
    } finally {
      setIsSubmitting(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  return (
    <AppShell>
      <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-md grid-cols-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {[
            ["agent", "AI Agent"],
            ["lawyers", "Find Lawyers"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setMode(value as Mode)}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                mode === value ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "agent" ? (
          <div className="mt-4 grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_310px]">
            <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-semibold text-slate-950">How can I help you file today?</h1>
                    <p className="mt-1 text-sm text-slate-500">
                      {activeWorkflow?.name || "Choose a filing type"} via {activeIntegration?.name || "selected route"}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    {status} · {agentTurn?.completion || 0}%
                  </span>
                </div>

                <div className="mt-4 grid gap-2 md:grid-cols-2">
                  <select
                    aria-label="Filing type"
                    value={selectedWorkflowId}
                    onChange={(event) => switchWorkflow(event.target.value as Workflow["id"])}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-[#10a37f]"
                  >
                    {workflows.map((workflow) => (
                      <option key={workflow.id} value={workflow.id}>
                        {workflow.name}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Integration route"
                    value={selectedIntegrationId}
                    onChange={(event) => {
                      setSelectedIntegrationId(event.target.value as Integration["id"]);
                      setAgentTurn(null);
                      setConsent(false);
                      setSubmission(null);
                    }}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-[#10a37f]"
                  >
                    {integrationOptions.map((integration) => (
                      <option key={integration.id} value={integration.id}>
                        {integration.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="min-h-[360px] flex-1 overflow-y-auto p-4">
                <div className="mx-auto max-w-3xl space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                          message.role === "user"
                            ? "bg-[#10a37f] text-white"
                            : message.role === "system"
                              ? "border border-slate-200 bg-slate-100 text-slate-700"
                              : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 p-4">
                <div className="mx-auto mb-3 flex max-w-3xl gap-2 overflow-x-auto">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => void sendMessage(prompt)}
                      className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <form onSubmit={onSubmit} className="mx-auto flex max-w-3xl rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                  <label className="sr-only" htmlFor="agent-answer">
                    Message NyayLink filing agent
                  </label>
                  <input
                    id="agent-answer"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={agentTurn?.missingFields[0]?.placeholder || "Message NyayLink..."}
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                  />
                  <button className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                    {isSending ? "..." : "Send"}
                  </button>
                </form>
              </div>
            </div>

            <aside className="min-h-0 space-y-3 overflow-y-auto">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-950">Review packet</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {activeIntegration
                    ? `${activeIntegration.name} · ${activeIntegration.status.replaceAll("-", " ")}`
                    : "Start the chat to choose a route."}
                </p>
                <div className="mt-4 space-y-2">
                  {agentTurn?.workflow.fields.map((field) => (
                    <div key={field.id} className="rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-500">{field.label}</p>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {collected[field.id] ? "Done" : "Missing"}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-800">
                        {collected[field.id]
                          ? field.sensitive
                            ? "Masked sensitive value"
                            : collected[field.id]
                          : field.question}
                      </p>
                    </div>
                  )) || <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">No packet yet.</p>}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-950">Submit</h2>
                {agentTurn?.draftPacket ? (
                  <div className="mt-3 space-y-3">
                    <label className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-700">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                        className="mt-1 h-4 w-4 accent-[#10a37f]"
                      />
                      I reviewed this packet and authorize NyayLink to queue the selected route.
                    </label>
                    <button
                      onClick={() => void submitPacket()}
                      disabled={!consent || isSubmitting}
                      className="w-full rounded-xl bg-[#10a37f] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {isSubmitting ? "Queueing..." : "Queue filing"}
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
                    The chat will unlock submission after all required details are captured.
                  </p>
                )}
                {submission ? <p className="mt-3 text-xs leading-5 text-slate-500">{submission}</p> : null}
              </div>
            </aside>
          </div>
        ) : (
          <div className="mx-auto mt-4 w-full max-w-5xl flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-xl font-semibold text-slate-950">Find lawyers</h1>
                <p className="mt-1 text-sm text-slate-500">Match your prepared packet with an advocate for review.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {lawyerStatus} · {filteredLawyers.length} matches
              </span>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
              <select
                aria-label="City"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium outline-none focus:border-[#10a37f]"
              >
                {cities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select
                aria-label="Practice area"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium outline-none focus:border-[#10a37f]"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <label className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
                Fee up to Rs {budget}
                <input
                  type="range"
                  min="700"
                  max="2200"
                  step="100"
                  value={budget}
                  onChange={(event) => setBudget(Number(event.target.value))}
                  className="mt-1 w-full accent-[#10a37f]"
                />
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={urgentOnly}
                  onChange={(event) => setUrgentOnly(event.target.checked)}
                  className="h-4 w-4 accent-[#10a37f]"
                />
                Today
              </label>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {filteredLawyers.map((lawyer) => (
                <article key={lawyer.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-slate-950">{lawyer.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {lawyer.specialty} · {lawyer.city}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{lawyer.court}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-950">Rs {lawyer.price}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">Rating {lawyer.rating}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">{lawyer.experience} yrs</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">{lawyer.availability}</span>
                  </div>
                  <button className="mt-4 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
                    Request review
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
