"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AppShell, LegalDisclaimer } from "../components/AppShell";
import { prompts } from "../data";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Namaste. I am the Legal Desk for Indian procedures. Tell me your issue, or choose a prompt, and I will organize the next steps before you consult an advocate.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [backendStatus, setBackendStatus] = useState("Ready");

  async function sendMessage(text = input) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    setInput("");
    setIsSending(true);
    setBackendStatus("Preparing guidance...");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = (await response.json()) as {
        reply?: string;
        matterType?: string;
        confidence?: number;
        nextSteps?: string[];
        recommendedTools?: string[];
        error?: string;
      };

      if (!response.ok || !data.reply) {
        throw new Error(data.error || "Chat request failed.");
      }

      const details = [
        `Matter type: ${data.matterType}`,
        `Confidence: ${Math.round((data.confidence || 0) * 100)}%`,
        data.nextSteps?.length ? `Next steps: ${data.nextSteps.join(" ")}` : "",
        data.recommendedTools?.length ? `Recommended tools: ${data.recommendedTools.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      setMessages((current) => [
        ...current,
        { role: "assistant", text: `${data.reply}\n\n${details}` },
      ]);
      setBackendStatus("Guidance prepared");
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "I could not prepare guidance right now. Please try again in a moment.",
        },
      ]);
      setBackendStatus("Connection issue");
    } finally {
      setIsSending(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <AppShell>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:h-[calc(100vh-73px)] lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <div className="premium-card flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="paper-surface shrink-0 border-b border-slate-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0f766e]">
                  Legal Desk
                </p>
                <h1 className="text-xl font-bold">Indian legal desk</h1>
                <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-600">
                  Ask about notices, consumer complaints, tax responses, property documents, tenancy,
                  and procedural next steps.
                </p>
              </div>
              <span className="rounded-md bg-teal-50 px-3 py-1 text-xs font-semibold text-[#0f766e]">
                {backendStatus}
              </span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => void sendMessage(prompt)}
                  className="min-h-11 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold leading-4 text-slate-700 hover:border-teal-500 hover:bg-teal-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[260px] flex-1 overflow-y-auto bg-white/78 p-4 lg:min-h-0">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] whitespace-pre-line rounded-lg px-4 py-3 text-sm leading-6 ${
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

          <form onSubmit={onSubmit} className="shrink-0 border-t border-slate-200 p-4">
            <label className="sr-only" htmlFor="legal-query">
              Ask Legal Desk
            </label>
            <div className="flex gap-2">
              <input
                id="legal-query"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Describe your legal issue..."
                className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-teal-100"
              />
              <button className="rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>

        <div className="min-h-0 space-y-4 lg:overflow-y-auto">
          <LegalDisclaimer />
          <div className="premium-card rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-bold">After legal intake</h2>
            <p className="mt-2 text-sm leading-5 text-slate-600">
              Once the issue is structured, route the user to a relevant lawyer, document workflow,
              or procedure checklist.
            </p>
            <div className="mt-3 grid gap-2">
              <Link className="rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white" href="/lawyers">
                Find matching advocate
              </Link>
              <Link className="rounded-md border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800" href="/tools">
                Open workflow tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
