import { ArrowRight, Building2, Calendar, GripVertical, User } from "lucide-react"

const columns = [
  {
    title: "Qualified",
    accent: "bg-amber-400",
    count: 4,
    deals: [
      { company: "บริษัท สยามเทค จำกัด", owner: "ฟาง", amount: "฿180,000", days: "2 วัน" },
      { company: "Green Coffee Co.", owner: "เอก", amount: "฿85,000", days: "5 วัน" },
    ],
  },
  {
    title: "Proposal",
    accent: "bg-violet-500",
    count: 3,
    deals: [
      { company: "ห้างนวพัฒน์ 2024", owner: "นัท", amount: "฿420,000", days: "วันนี้" },
      { company: "เดอะกรีนเบเกอรี่", owner: "ฟาง", amount: "฿65,000", days: "1 วัน" },
    ],
  },
  {
    title: "Won",
    accent: "bg-emerald-500",
    count: 7,
    deals: [
      { company: "AirVision Travel", owner: "เอก", amount: "฿1.1M", days: "ปิดแล้ว" },
    ],
  },
]

export function PipelineMockup() {
  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[11px] tracking-wide text-slate-500 uppercase">AE Pipeline</div>
          <div className="text-base font-semibold text-slate-900">Q2 / 2026</div>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-600 shadow-xs">
          ทั้งหมด <span className="font-semibold text-slate-900">฿4.8M</span>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid flex-1 grid-cols-3 gap-2.5 overflow-hidden">
        {columns.map((col) => (
          <div
            key={col.title}
            className="flex min-h-0 flex-col rounded-2xl border border-slate-200/70 bg-slate-50/60 p-2.5"
          >
            <div className="mb-2.5 flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className={`size-1.5 rounded-full ${col.accent}`} />
                <span className="text-[11px] font-medium text-slate-700">{col.title}</span>
              </div>
              <span className="rounded-full bg-white px-1.5 py-px text-[10px] text-slate-500 ring-1 ring-slate-200">
                {col.count}
              </span>
            </div>

            <div className="flex flex-col gap-2 overflow-hidden">
              {col.deals.map((deal) => (
                <div
                  key={deal.company}
                  className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-800">
                      <Building2 className="size-3 text-slate-400" />
                      <span className="truncate font-medium">{deal.company}</span>
                    </div>
                    <GripVertical className="size-3 shrink-0 text-slate-300" />
                  </div>
                  <div className="mt-2 text-base font-semibold text-slate-900">{deal.amount}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <User className="size-2.5" />
                      {deal.owner}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-2.5" />
                      {deal.days}
                    </span>
                  </div>
                </div>
              ))}

              {/* Add card placeholder */}
              <button
                type="button"
                className="rounded-xl border border-dashed border-slate-300 px-2.5 py-2 text-[11px] text-slate-400"
              >
                + เพิ่มดีล
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating activity toast */}
      <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span>นัทย้ายดีล “ห้างนวพัฒน์” → Proposal</span>
        </div>
        <ArrowRight className="size-3 text-slate-400" />
      </div>
    </div>
  )
}
