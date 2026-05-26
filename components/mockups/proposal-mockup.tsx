import Image from "next/image"
import { CheckCircle2, FileSignature } from "lucide-react"

const lineItems = [
  { name: "จดทะเบียนจัดตั้งบริษัทจำกัด", qty: 1, total: "฿15,000" },
  { name: "จดทะเบียนภาษีมูลค่าเพิ่ม (VAT)", qty: 1, total: "฿8,000" },
  { name: "ทำบัญชี + ยื่นภาษี (รายเดือน)", qty: 12, total: "฿48,000" },
  { name: "ปิดงบ + ยื่น ภ.ง.ด.50", qty: 1, total: "฿18,000" },
]

export function ProposalMockup() {
  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[11px] tracking-wide text-slate-500 uppercase">Proposal</div>
          <div className="text-base font-semibold text-slate-900">PROP-2026-0421</div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          ลูกค้าเปิดอ่านแล้ว
        </span>
      </div>

      {/* Document paper */}
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
        <div className="flex h-full flex-col p-4">
          {/* Letterhead */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <Image
                  src="/IProgressX.png"
                  alt="I Progress X Logo"
                  width={120}
                  height={40}
                  className="size-5 object-contain"
                />
                <span className="text-[11px] font-semibold tracking-wider text-slate-700 uppercase">
                  IProgressX
                </span>
              </div>
              <div className="mt-1.5 text-[10px] text-slate-500">
                บริษัท ไอโปรเกรสซ์ จำกัด · 0105566012345
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-500">
              <div>เลขที่: PROP-2026-0421</div>
              <div>วันที่: 26 พ.ค. 2569</div>
            </div>
          </div>

          {/* To */}
          <div className="mt-3 text-[11px]">
            <div className="text-[10px] tracking-wider text-slate-400 uppercase">เสนอแก่</div>
            <div className="font-semibold text-slate-800">คุณวิภา จันทร์งาม</div>
            <div className="text-slate-500">ผู้ก่อตั้ง · บริษัท สยามเทค (กำลังจดทะเบียน)</div>
          </div>

          {/* Table */}
          <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
            <div className="grid grid-cols-[1fr_42px_72px] bg-slate-100 px-2.5 py-1.5 text-[10px] font-medium tracking-wide text-slate-500 uppercase">
              <span>รายการ</span>
              <span className="text-center">จำนวน</span>
              <span className="text-right">รวม</span>
            </div>
            {lineItems.map((item) => (
              <div
                key={item.name}
                className="grid grid-cols-[1fr_42px_72px] items-center border-t border-slate-100 px-2.5 py-2 text-[11px]"
              >
                <span className="truncate text-slate-700">{item.name}</span>
                <span className="text-center tabular-nums text-slate-500">{item.qty}</span>
                <span className="text-right font-medium tabular-nums text-slate-800">
                  {item.total}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-3 ml-auto w-44 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-500">
              <span>มูลค่าก่อนภาษี</span>
              <span className="tabular-nums">฿89,000</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>VAT 7%</span>
              <span className="tabular-nums">฿6,230</span>
            </div>
            <div className="flex justify-between rounded-md bg-slate-900 px-2 py-1.5 font-semibold text-white">
              <span>ยอดสุทธิ</span>
              <span className="tabular-nums">฿95,230</span>
            </div>
          </div>

          {/* Signature pad */}
          <div className="mt-auto pt-4">
            <div className="text-[10px] tracking-wider text-slate-400 uppercase">
              สถานะการอนุมัติ
            </div>
            <div className="mt-1.5 flex items-end justify-between gap-3">
              <div className="flex-1">
                <svg
                  viewBox="0 0 200 36"
                  className="h-9 w-full text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M4 24 Q 16 4 28 18 T 60 18 Q 76 30 96 12 T 140 16 Q 160 26 184 10" />
                </svg>
                <div className="mt-1 h-px bg-slate-300" />
                <div className="mt-1 text-[10px] text-slate-500">ผู้อนุมัติ: วิภา จันทร์งาม · 26/5/2569</div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                <CheckCircle2 className="size-3" />
                อนุมัติแล้ว
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status strip */}
      <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600 shadow-sm">
        <div className="flex items-center gap-2">
          <FileSignature className="size-3.5 text-violet-600" />
          <span>อัปเดตสถานะใบเสนอราคา — บันทึกในทะเบียนลูกค้าให้ทันที</span>
        </div>
      </div>
    </div>
  )
}
