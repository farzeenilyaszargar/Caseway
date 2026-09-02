"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell, LegalDisclaimer } from "../components/AppShell";
import { services as fallbackServices } from "../data";

type WorkflowTool = (typeof fallbackServices)[number] & {
  status?: string;
  supportedInputs?: string[];
};

type ScanResult = {
  id: string;
  fileName: string;
  documentType: string;
  status: string;
  extractedText: string;
  flags: string[];
  suggestedMatterType: string;
};

export default function ToolsPage() {
  const [services, setServices] = useState<WorkflowTool[]>(fallbackServices);
  const [activeService, setActiveService] = useState<WorkflowTool>(fallbackServices[0]);
  const [apiStatus, setApiStatus] = useState("Loading workflow modules...");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    async function loadTools() {
      try {
        const response = await fetch("/api/tools");
        const data = (await response.json()) as { tools?: WorkflowTool[] };
        if (!response.ok || !data.tools?.length) {
          throw new Error("Tool API failed.");
        }
        setServices(data.tools);
        setActiveService(data.tools[0]);
        setApiStatus("Workflow modules ready");
      } catch {
        setApiStatus("Workflow modules ready");
      }
    }

    void loadTools();
  }, []);

  async function runPlatformScan() {
    setIsScanning(true);
    setApiStatus("Reviewing document...");
    try {
      const response = await fetch("/api/documents/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: "rental-notice-sample.pdf",
          documentType: activeService.name,
          sampleText:
            "Notice dated 14 August asks tenant to vacate within 30 days and claims unpaid rent with security deposit adjustment.",
        }),
      });
      const data = (await response.json()) as ScanResult;
      if (!response.ok || !data.id) {
        throw new Error("Scan failed.");
      }
      setScanResult(data);
      setApiStatus("Document review ready");
    } catch {
      setApiStatus("Document review temporarily unavailable");
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <AppShell>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#b45309]">
            Workflow tools
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal">Legal procedure workspace</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Dedicated workspace for OCR, document scanning, legal notice preparation, income
            tax notice response, and court process guidance.
          </p>
          <p className="mt-4 rounded-md bg-teal-50 px-3 py-2 text-xs font-semibold text-[#0f766e]">
            {apiStatus}
          </p>
        </div>
        <LegalDisclaimer />
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Modules</h2>
          <div className="mt-4 grid gap-3">
            {services.map((service) => (
              <button
                key={service.name}
                onClick={() => setActiveService(service)}
                className={`rounded-md border p-4 text-left ${
                  activeService.name === service.name
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
        </aside>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0f766e]">
                Selected module
              </p>
              <h2 className="mt-1 text-2xl font-bold">{activeService.name}</h2>
              <p className="text-sm font-semibold text-slate-500">{activeService.hindi}</p>
            </div>
            <span className="rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
              {activeService.status || "Available"}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {activeService.workflow.map((step, index) => (
              <div key={step} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold text-[#0f766e]">Step {index + 1}</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-md border border-dashed border-slate-300 bg-[#fbfaf7] p-5">
            <h3 className="font-bold">Workflow automation</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This workspace supports OCR extraction, scanned document previews, guided intake
              forms, and filing checklists for legal review.
            </p>
            {activeService.supportedInputs?.length ? (
              <p className="mt-3 text-xs font-semibold text-slate-500">
                Supported inputs: {activeService.supportedInputs.join(", ")}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => void runPlatformScan()}
                className="rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
              >
                {isScanning ? "Scanning..." : "Start workflow"}
              </button>
              <Link className="rounded-md border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800" href="/assistant">
                Ask Legal Desk first
              </Link>
            </div>
          </div>

          {scanResult ? (
            <div className="mt-5 rounded-md border border-teal-200 bg-teal-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">
                Document review result
              </p>
              <h3 className="mt-2 font-bold">{scanResult.fileName}</h3>
              <p className="mt-1 text-sm text-slate-700">
                {scanResult.documentType} • {scanResult.status} • Suggested matter:{" "}
                {scanResult.suggestedMatterType}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{scanResult.extractedText}</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {scanResult.flags.map((flag) => (
                  <li key={flag}>• {flag}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}
