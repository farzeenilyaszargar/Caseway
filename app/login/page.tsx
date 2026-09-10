"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "../components/AppShell";

export default function LoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Choose how you want to continue.");

  async function loginWithDemo() {
    setStatus("Signing you in...");
    const response = await fetch("/api/auth/mock/login", { method: "POST" }).catch(() => null);
    if (!response?.ok) {
      setStatus("Could not start the demo session. Please try again.");
      return;
    }
    router.push("/profile");
  }

  return (
    <AppShell>
      <section className="mx-auto flex min-h-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-8">
            <p className="text-sm font-medium text-slate-500">Caseway account</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">Log in</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">{status}</p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => void loginWithDemo()}
              className="flex w-full items-center justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Continue with demo account
            </button>
            <Link
              href="/api/auth/digilocker/login"
              className="flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Connect DigiLocker
            </Link>
          </div>

          <p className="mt-6 text-xs leading-5 text-slate-400">
            DigiLocker requires official requester credentials. The demo account uses the same encrypted session system without live government data.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
