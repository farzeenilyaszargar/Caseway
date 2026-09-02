export function LegalWorkflowGraphic() {
  return (
    <div className="legal-stage premium-card min-h-[360px] rounded-lg border border-slate-800 p-5 text-white">
      <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-100">
              Live matter workspace
            </p>
            <h2 className="mt-2 text-2xl font-bold">Intake to consultation</h2>
          </div>
          <div className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold">
            Operational
          </div>
        </div>

        <div className="mt-8 grid grid-cols-[64px_1fr_64px] items-end gap-4">
          {[72, 108, 86].map((height, index) => (
            <div key={height} className="flex flex-col items-center gap-2">
              <div
                className="legal-column w-8 rounded-t-md"
                style={{ height }}
                aria-hidden="true"
              />
              <div className="h-2 w-12 rounded-full bg-white/30" />
              <p className="text-[10px] font-bold text-teal-50">C{index + 1}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-3">
          {["Issue classified", "Documents reviewed", "Advocate matched"].map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-md border border-white/14 bg-white/10 p-3 backdrop-blur">
              <span className="grid h-8 w-8 place-items-center rounded bg-white text-sm font-black text-slate-950">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{item}</p>
                <div className="mt-2 h-1.5 rounded-full bg-white/18">
                  <div className="h-1.5 rounded-full bg-[#f59e0b]" style={{ width: `${72 + index * 8}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
