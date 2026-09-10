import { AppShell } from "../components/AppShell";
import { accountSettings } from "../lib/account/mock";

export default function SettingsPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">Account</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">Settings</h1>
        </div>

        <div className="grid gap-3">
          {accountSettings.map((setting) => (
            <div key={setting.label} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4">
              <p className="text-sm font-semibold text-slate-950">{setting.label}</p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {setting.value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
