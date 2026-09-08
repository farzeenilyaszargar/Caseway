"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
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

type AttachedDocument = {
  id: string;
  name: string;
  size: number;
};

type DropdownKey = "workflow" | "city" | "category" | null;

type FloatingOption = {
  value: string;
  label: string;
  helper?: string;
};

const starterPrompts = ["File my income tax return", "Create a consumer complaint", "Prepare court filing packet"];

const lawyerAccentClasses = [
  "from-emerald-50 via-white to-slate-50",
  "from-sky-50 via-white to-slate-50",
  "from-rose-50 via-white to-slate-50",
  "from-amber-50 via-white to-slate-50",
  "from-cyan-50 via-white to-slate-50",
  "from-lime-50 via-white to-slate-50",
  "from-yellow-50 via-white to-slate-50",
  "from-teal-50 via-white to-slate-50",
  "from-violet-50 via-white to-slate-50",
  "from-red-50 via-white to-slate-50",
];

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function FloatingSelect({
  label,
  value,
  options,
  searchable = false,
  isOpen,
  onOpen,
  onClose,
  onSelect,
}: {
  label: string;
  value: string;
  options: FloatingOption[];
  searchable?: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const selected = options.find((option) => option.value === value) || options[0];
  const visibleOptions = searchable
    ? options.filter((option) => {
        const haystack = `${option.label} ${option.helper || ""}`.toLowerCase();
        return haystack.includes(query.trim().toLowerCase());
      })
    : options;

  function closeMenu() {
    setQuery("");
    onClose();
  }

  return (
    <div
      className="relative min-w-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? closeMenu() : onOpen())}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-800 outline-none transition hover:border-slate-300 hover:bg-slate-50 focus:border-slate-950"
      >
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</span>
          <span className="mt-0.5 block truncate">{selected?.label || "Select"}</span>
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`h-4 w-4 shrink-0 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen ? (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-xl border border-slate-200 bg-white p-1.5 ring-1 ring-slate-950/5"
        >
          {searchable ? (
            <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-2 py-2">
              <label className="flex items-center gap-2 text-slate-500">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="m21 21-4.3-4.3" strokeLinecap="round" />
                  <path d="M10.8 18a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4Z" />
                </svg>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="min-w-0 flex-1 bg-transparent py-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  autoFocus
                />
              </label>
            </div>
          ) : null}
          <div className="max-h-60 overflow-y-auto pt-1">
            {visibleOptions.length > 0 ? (
              visibleOptions.map((option) => {
                const selectedOption = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={selectedOption}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      onSelect(option.value);
                      closeMenu();
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                      selectedOption ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{option.label}</span>
                      {option.helper ? (
                        <span className={`mt-0.5 block truncate text-xs ${selectedOption ? "text-slate-300" : "text-slate-400"}`}>
                          {option.helper}
                        </span>
                      ) : null}
                    </span>
                    {selectedOption ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : null}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-6 text-center">
                <p className="text-sm font-semibold text-slate-900">No matches found</p>
                <p className="mt-1 text-xs text-slate-400">Try another city.</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function AssistantPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [mode, setMode] = useState<Mode>("agent");
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<Workflow["id"]>("income_tax_return");
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<Integration["id"]>("income_tax_eri");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [collected, setCollected] = useState<Record<string, string>>({});
  const [agentTurn, setAgentTurn] = useState<AgentTurn | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [submission, setSubmission] = useState<string | null>(null);
  const [attachedDocuments, setAttachedDocuments] = useState<AttachedDocument[]>([]);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);

  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All cities");
  const [budget, setBudget] = useState(2000);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>(fallbackLawyers);
  const [lawyerStatus, setLawyerStatus] = useState("Listings ready");
  const [selectedLawyerId, setSelectedLawyerId] = useState<number | null>(null);
  const [reviewRequest, setReviewRequest] = useState<{
    lawyerName: string;
    consultationId: string;
    paymentId: string;
    status: string;
  } | null>(null);
  const selectedLawyer = useMemo(
    () => fallbackLawyers.find((lawyer) => lawyer.id === selectedLawyerId) || null,
    [selectedLawyerId],
  );

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
  const workflowOptions = useMemo(
    () =>
      workflows.map((workflow) => ({
        value: workflow.id,
        label: workflow.name,
        helper: workflow.forum,
      })),
    [workflows],
  );
  const cityOptions = useMemo(
    () => cities.map((item) => ({ value: item, label: item, helper: item === "All cities" ? "Across India" : "Local advocates" })),
    [],
  );
  const categoryOptions = useMemo(
    () => categories.map((item) => ({ value: item, label: item, helper: item === "All" ? "Every practice area" : "Specialist profiles" })),
    [],
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
    if ((!trimmed && attachedDocuments.length === 0) || isSending) return;
    const documentSummary =
      attachedDocuments.length > 0
        ? `\n\nAttached documents: ${attachedDocuments.map((file) => `${file.name} (${formatFileSize(file.size)})`).join(", ")}`
        : "";
    const userText = `${trimmed || "Please review the attached documents."}${documentSummary}`;

    setMessages((current) => [...current, { role: "user", text: userText }]);
    setInput("");
    setAttachedDocuments([]);
    setIsSending(true);
    setSubmission(null);
    setStatus("Thinking");

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
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
    setMessages([]);
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

  function attachDocuments(files: FileList | null) {
    if (!files?.length) return;
    const selected = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      name: file.name,
      size: file.size,
    }));
    setAttachedDocuments((current) => {
      const seen = new Set(current.map((file) => file.id));
      return [...current, ...selected.filter((file) => !seen.has(file.id))].slice(0, 6);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeDocument(id: string) {
    setAttachedDocuments((current) => current.filter((file) => file.id !== id));
  }

  async function requestReview(lawyer: Lawyer) {
    setSelectedLawyerId(lawyer.id);
    setReviewRequest(null);
    setLawyerStatus("Creating review request");

    try {
      const consultationResponse = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lawyerId: lawyer.id,
          issueSummary: agentTurn?.draftPacket
            ? `${agentTurn.draftPacket.title} review requested.`
            : `${lawyer.specialty} legal review requested from lawyer finder.`,
          preferredSlot: lawyer.availability,
          contactMode: "video",
        }),
      });
      const consultation = (await consultationResponse.json()) as { id?: string; error?: string };
      if (!consultationResponse.ok || !consultation.id) {
        throw new Error(consultation.error || "Consultation failed.");
      }

      const paymentResponse = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId: consultation.id,
          amount: lawyer.price,
          method: "upi",
        }),
      });
      const payment = (await paymentResponse.json()) as { id?: string; status?: string };
      if (!paymentResponse.ok || !payment.id || !payment.status) {
        throw new Error("Payment order failed.");
      }

      setReviewRequest({
        lawyerName: lawyer.name,
        consultationId: consultation.id,
        paymentId: payment.id,
        status: payment.status,
      });
      setLawyerStatus("Review request ready");
    } catch {
      setLawyerStatus("Request failed");
    }
  }

  const headerToggle = (
    <div className="grid w-full grid-cols-2 rounded-full border border-slate-200/80 bg-white/92 p-0.5 sm:w-[320px]">
      {[
        ["agent", "AI Law Agent"],
        ["lawyers", "Find Lawyers"],
      ].map(([value, label]) => (
        <button
          key={value}
          onClick={() => setMode(value as Mode)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
            mode === value
              ? "bg-slate-950 text-white"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
  const canSend = input.trim().length > 0 || attachedDocuments.length > 0;
  const noChatStarted = messages.length === 0;

  return (
    <AppShell headerAction={headerToggle}>
      <section
        className={`mx-auto flex h-full max-w-7xl flex-col px-3 py-4 sm:px-5 lg:px-8 ${
          mode === "agent" ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        {mode === "agent" ? (
          <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-4">
            <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/75">
              <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
                <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="sr-only">AI Law Agent</h1>
                    <p className="truncate text-sm text-slate-500">
                      {activeWorkflow?.name || "Choose a filing type"}
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                    {status} · {agentTurn?.completion || 0}%
                  </span>
                </div>

                <div className="mx-auto mt-4 max-w-3xl">
                  <FloatingSelect
                    label="Filing type"
                    value={selectedWorkflowId}
                    options={workflowOptions}
                    isOpen={openDropdown === "workflow"}
                    onOpen={() => setOpenDropdown("workflow")}
                    onClose={() => setOpenDropdown(null)}
                    onSelect={(nextValue) => switchWorkflow(nextValue as Workflow["id"])}
                  />
                </div>
              </div>

              <div className="relative min-h-0 flex-1 overflow-y-auto bg-white px-3 py-6 sm:px-6">
                {noChatStarted ? (
                  <div className="pointer-events-none absolute inset-0 grid place-items-center px-6">
                    <div className="flex flex-col items-center">
                      <span
                        aria-hidden="true"
                        className="h-12 w-28 bg-contain bg-center bg-no-repeat opacity-[0.12]"
                        style={{ backgroundImage: "url('/nyaylink-logo.png')" }}
                      />
                      <p className="mt-5 text-center text-3xl font-semibold tracking-normal text-slate-300 sm:text-4xl">
                        How Can I Help You Today?
                      </p>
                    </div>
                  </div>
                ) : null}
                <div className="relative z-10 mx-auto max-w-3xl space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`group flex items-start gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role !== "user" ? (
                        <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-950 text-[11px] font-semibold text-white">
                          न
                        </div>
                      ) : null}
                      <div
                        className={`max-w-[84%] whitespace-pre-line px-4 py-3 text-[15px] leading-6 ${
                          message.role === "user"
                            ? "rounded-xl bg-slate-950 text-white"
                            : message.role === "system"
                              ? "rounded-xl border border-slate-200 bg-slate-50 text-slate-600"
                              : "rounded-xl bg-[#f4f4f4] text-slate-900"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white px-3 pb-5 sm:px-6">
                <div className="mx-auto mb-3 flex max-w-3xl gap-2 overflow-x-auto">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => void sendMessage(prompt)}
                      className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <form onSubmit={onSubmit} className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-2">
                  <label className="sr-only" htmlFor="agent-answer">
                    Message NyayLink filing agent
                  </label>
                  {attachedDocuments.length > 0 ? (
                    <div className="mb-2 flex flex-wrap gap-2 px-1">
                      {attachedDocuments.map((file) => (
                        <span
                          key={file.id}
                          className="inline-flex max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                        >
                          <span className="truncate">{file.name}</span>
                          <span className="shrink-0 text-slate-400">{formatFileSize(file.size)}</span>
                          <button
                            type="button"
                            onClick={() => removeDocument(file.id)}
                            aria-label={`Remove ${file.name}`}
                            className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-950"
                          >
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex items-end gap-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      onChange={(event) => attachDocuments(event.target.files)}
                      className="sr-only"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Attach documents"
                      title="Attach documents"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                    </button>
                    <input
                      id="agent-answer"
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      placeholder={agentTurn?.missingFields[0]?.placeholder || "Message NyayLink..."}
                      className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-[15px] outline-none"
                    />
                    <button
                      type="submit"
                      aria-label={isSending ? "Sending message" : "Send message"}
                      title="Send message"
                      disabled={!canSend || isSending}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-950 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {isSending ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      ) : (
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <aside className="hidden min-h-0 space-y-3 overflow-y-auto lg:block">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                <h2 className="text-sm font-semibold text-slate-950">Review packet</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  The assistant collects details and prepares a reviewable packet before any filing handoff.
                </p>
                <div className="mt-4 space-y-2">
                  {agentTurn?.workflow.fields.map((field) => (
                    <div key={field.id} className="rounded-xl border border-transparent bg-slate-50 p-3">
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

              <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
                <h2 className="text-sm font-semibold text-slate-950">Submit</h2>
                {agentTurn?.draftPacket ? (
                  <div className="mt-3 space-y-3">
                    <label className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-700">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                        className="mt-1 h-4 w-4 accent-slate-950"
                      />
                      I reviewed this packet and authorize NyayLink to queue the selected route.
                    </label>
                    <button
                      onClick={() => void submitPacket()}
                      disabled={!consent || isSubmitting}
                      className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
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
          <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-4 ring-1 ring-slate-200/75 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">Find lawyers</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Match your prepared packet with a demo advocate profile.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                  Demo profiles
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                  {lawyerStatus} · {filteredLawyers.length} matches
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-2 md:grid-cols-[1fr_1fr_1fr_auto]">
              <FloatingSelect
                label="City"
                value={city}
                options={cityOptions}
                searchable
                isOpen={openDropdown === "city"}
                onOpen={() => setOpenDropdown("city")}
                onClose={() => setOpenDropdown(null)}
                onSelect={setCity}
              />
              <FloatingSelect
                label="Practice"
                value={category}
                options={categoryOptions}
                isOpen={openDropdown === "category"}
                onOpen={() => setOpenDropdown("category")}
                onClose={() => setOpenDropdown(null)}
                onSelect={setCategory}
              />
              <label className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 hover:border-slate-300">
                Fee up to Rs {budget}
                <input
                  type="range"
                  min="700"
                  max="2200"
                  step="100"
                  value={budget}
                  onChange={(event) => setBudget(Number(event.target.value))}
                  className="mt-1 w-full accent-slate-950"
                />
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={urgentOnly}
                  onChange={(event) => setUrgentOnly(event.target.checked)}
                  className="h-4 w-4 accent-slate-950"
                />
                Today
              </label>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {filteredLawyers.map((lawyer) => (
                <article
                  key={lawyer.id}
                  className={`overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${lawyerAccentClasses[(lawyer.id - 1) % lawyerAccentClasses.length]} p-4 transition hover:-translate-y-0.5 hover:border-slate-300`}
                >
                  <div className="flex gap-4">
                    <div
                      role="img"
                      aria-label={`Demo profile portrait for ${lawyer.name}`}
                      className="h-20 w-20 shrink-0 rounded-xl border border-white/80 bg-white bg-cover bg-center"
                      style={{ backgroundImage: `url(${lawyer.profileImage})` }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="truncate font-semibold text-slate-950">{lawyer.name}</h2>
                          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" />
                              <path d="M12 10.5h.01" strokeLinecap="round" />
                            </svg>
                            <span className="truncate">{lawyer.city} · {lawyer.court}</span>
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-right">
                          <p className="text-sm font-semibold text-slate-950">Rs {lawyer.price}</p>
                          <p className="text-[11px] font-medium text-slate-400">30 min</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-slate-950 px-2.5 py-1 text-white">{lawyer.specialty}</span>
                        <span className="rounded-full border border-white/80 bg-white/75 px-2.5 py-1 text-slate-700">
                          Rating {lawyer.rating}
                        </span>
                        <span className="rounded-full border border-white/80 bg-white/75 px-2.5 py-1 text-slate-700">
                          {lawyer.experience} yrs
                        </span>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">
                          {lawyer.availability}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-xl border border-white/80 bg-white/70 p-3">
                      <p className="font-semibold text-slate-950">{lawyer.response}</p>
                      <p className="mt-0.5 text-slate-500">response</p>
                    </div>
                    <div className="rounded-xl border border-white/80 bg-white/70 p-3">
                      <p className="font-semibold text-slate-950">{lawyer.matters}</p>
                      <p className="mt-0.5 text-slate-500">matters</p>
                    </div>
                    <div className="rounded-xl border border-white/80 bg-white/70 p-3">
                      <p className="font-semibold text-slate-950">{lawyer.languages.length}</p>
                      <p className="mt-0.5 text-slate-500">languages</p>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-1 text-xs leading-5 text-slate-600">
                    Speaks {lawyer.languages.join(", ")}
                  </p>
                  <button
                    onClick={() => setSelectedLawyerId(lawyer.id)}
                    className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white ${
                      selectedLawyerId === lawyer.id ? "bg-zinc-700" : "bg-slate-950 hover:bg-slate-800"
                    }`}
                  >
                    {selectedLawyerId === lawyer.id ? "Profile open" : "View lawyer"}
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}
        {selectedLawyer ? (
          <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/20 px-4 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 ring-1 ring-slate-950/5 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    role="img"
                    aria-label={`Demo profile portrait for ${selectedLawyer.name}`}
                    className="h-20 w-20 shrink-0 rounded-xl border border-slate-200 bg-slate-50 bg-cover bg-center"
                    style={{ backgroundImage: `url(${selectedLawyer.profileImage})` }}
                  />
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-semibold tracking-normal text-slate-950">{selectedLawyer.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedLawyer.specialty} · {selectedLawyer.city}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-400">{selectedLawyer.court}</p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close lawyer details"
                  onClick={() => {
                    setSelectedLawyerId(null);
                    setReviewRequest(null);
                  }}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                >
                  x
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ["Rating", selectedLawyer.rating],
                  ["Experience", `${selectedLawyer.experience} yrs`],
                  ["Response", selectedLawyer.response],
                  ["Matters", selectedLawyer.matters],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-950">{value}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                <p>
                  Available {selectedLawyer.availability.toLowerCase()} for a 30 minute review at Rs {selectedLawyer.price}.
                </p>
                <p>Languages: {selectedLawyer.languages.join(", ")}</p>
                <p>Good fit for document review, filing readiness, and next-step planning.</p>
              </div>

              {reviewRequest ? (
                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-800">
                  <p className="font-semibold">{reviewRequest.lawyerName} review request is ready.</p>
                  <p>Consultation: {reviewRequest.consultationId}</p>
                  <p>Payment order: {reviewRequest.status} · {reviewRequest.paymentId}</p>
                </div>
              ) : null}

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => void requestReview(selectedLawyer)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                >
                  Check availability
                </button>
                <Link
                  href={`/lawyers/${selectedLawyer.id}`}
                  className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Choose lawyer
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </AppShell>
  );
}
