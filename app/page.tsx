import Image from "next/image"
import {
  ArrowRight,
  Magnet,
  Briefcase,
  PhoneCall,
  FileSignature,
  Building2,
  Wrench,
  LayoutGrid,
  ShieldCheck,
  Zap,
  TrendingUp,
  Workflow,
  CircleCheck,
  PlayCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AuroraGlow } from "@/components/aurora-glow"
import { PipelineMockup } from "@/components/mockups/pipeline-mockup"
import { ProposalMockup } from "@/components/mockups/proposal-mockup"
import { SectionWithMockup } from "@/components/section-with-mockup"
import { SiteHeader } from "@/components/site-header"

const features = [
  {
    icon: LayoutGrid,
    title: "Dashboard สำนักงาน",
    desc: "ภาพรวมจำนวนลูกค้า รายได้รายเดือน งานยื่นภาษีที่ค้าง และ KPI ของทีมบัญชี ในหน้าจอเดียว",
    accent: "from-sky-500/20 to-sky-500/0 text-sky-600",
  },
  {
    icon: Magnet,
    title: "เก็บลูกค้าใหม่",
    desc: "รวมลูกค้าที่สนใจจากเว็บ Line OA และรับการแนะนำ คัดตามขนาดธุรกิจ ประเภทนิติบุคคล",
    accent: "from-pink-500/20 to-pink-500/0 text-pink-600",
  },
  {
    icon: Briefcase,
    title: "Pipeline รับลูกค้า",
    desc: "บริหารกระบวนการรับลูกค้าใหม่แบบ Kanban — ปรึกษา → เสนอราคา → ทำสัญญา → เริ่มงาน",
    accent: "from-amber-500/20 to-amber-500/0 text-amber-600",
  },
  {
    icon: PhoneCall,
    title: "ติดตามลูกค้าเก่า",
    desc: "ตามนัดให้คำปรึกษา นัดประชุมก่อนปิดงบ ทวงเอกสาร พร้อมบันทึกประวัติการพูดคุยทุกครั้ง",
    accent: "from-emerald-500/20 to-emerald-500/0 text-emerald-600",
  },
  {
    icon: FileSignature,
    title: "ใบเสนอราคาบริการบัญชี",
    desc: "เลือกจากเทมเพลตบริการบัญชี ภาษี ตรวจสอบ สร้างใบเสนอราคา และติดตามสถานะอนุมัติ",
    accent: "from-violet-500/20 to-violet-500/0 text-violet-600",
  },
  {
    icon: Building2,
    title: "ทะเบียนลูกค้า",
    desc: "เก็บข้อมูลครบ — เลขผู้เสียภาษี ประเภทนิติบุคคล รอบบัญชี ผู้ติดต่อ และเอกสารทั้งหมด",
    accent: "from-indigo-500/20 to-indigo-500/0 text-indigo-600",
  },
  {
    icon: Wrench,
    title: "บริหารงานยื่น/ปิดงบ",
    desc: "รับงาน — มอบหมาย — ปิดงาน แนบเอกสาร ติดตาม Deadline ภาษี และ SLA ของสำนักงาน",
    accent: "from-rose-500/20 to-rose-500/0 text-rose-600",
  },
  {
    icon: Workflow,
    title: "เตือนล่วงหน้าอัตโนมัติ",
    desc: "ตั้งเตือนก่อน Deadline ภาษี ทวงเอกสารลูกค้า สร้างใบแจ้งหนี้รายเดือนแบบอัตโนมัติ",
    accent: "from-teal-500/20 to-teal-500/0 text-teal-600",
  },
]

const stats = [
  { value: "3x", label: "เสนอราคาเร็วขึ้น" },
  { value: "100%", label: "ติดตามลูกค้าได้ครบ" },
  { value: "<30s", label: "สร้างใบเสนอราคาบริการบัญชี" },
  { value: "0", label: "ลืม Deadline ภาษี" },
]

const flowSteps = [
  { title: "รับเรื่อง", desc: "ลูกค้าใหม่จากทุกช่องทาง" },
  { title: "มอบหมาย", desc: "ส่งต่อ AE / บัญชี อัตโนมัติ" },
  { title: "เสนอราคา", desc: "เทมเพลตบริการบัญชี" },
  { title: "ทำสัญญา", desc: "บันทึกขั้นตอนและเอกสารในที่เดียว" },
  { title: "บริการต่อเนื่อง", desc: "ยื่นภาษี ปิดงบ ตาม Deadline" },
]

const benefits = [
  "ออกแบบโดยทีมที่เข้าใจสำนักงานบัญชีไทย ไม่ใช่ CRM ทั่วไป",
  "เก็บรอบบัญชี/Deadline ภาษีของลูกค้าแต่ละราย แจ้งเตือนล่วงหน้าอัตโนมัติ",
  "ปรับแต่งสถานะ Pipeline และฟิลด์ลูกค้าตามวิธีทำงานของสำนักงาน",
  "ระบบสิทธิ์ละเอียดระดับฟิลด์ — แยก partner / staff / ลูกค้าได้",
  "ข้อมูลโฮสต์ในไทย ปลอดภัยตาม PDPA",
  "Roadmap: เตรียมเชื่อมต่อ PEAK และ FlowAccount เพื่อต่อยอดสู่งานบัญชี",
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "IProgressX CRM แตกต่างจาก CRM ทั่วไปอย่างไร?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "IProgressX CRM ออกแบบมาเฉพาะสำหรับสำนักงานบัญชีไทย เข้าใจวงจรงานตั้งแต่รับลูกค้าใหม่ เสนอราคาบริการบัญชี ติดตาม Deadline ภาษี ไปจนถึงปิดงบประจำปี ไม่ใช่ CRM ทั่วไปที่ต้องปรับแต่งเอง",
      },
    },
    {
      "@type": "Question",
      name: "ทดลองใช้ได้ฟรีหรือไม่?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ทดลองใช้ Demo ได้ฟรีทันที ไม่ต้องสมัครและไม่ต้องผูกบัตรเครดิต ลองได้ครบทุกฟีเจอร์ในเบราว์เซอร์",
      },
    },
    {
      "@type": "Question",
      name: "ระบบรองรับ PDPA หรือไม่?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "รองรับ PDPA เต็มรูปแบบ ข้อมูลโฮสต์ในประเทศไทย เข้ารหัสทุกชั้น พร้อมระบบสิทธิ์ละเอียดระดับฟิลด์",
      },
    },
    {
      "@type": "Question",
      name: "เชื่อมต่อกับ PEAK หรือ FlowAccount ได้หรือไม่?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "อยู่ใน Roadmap เตรียมเชื่อมต่อ PEAK และ FlowAccount เพื่อต่อยอดจากใบเสนอราคาที่ปิดแล้วไปออกใบแจ้งหนี้-ใบกำกับภาษีโดยไม่ต้องคีย์ซ้ำ",
      },
    },
  ],
}

export default function Page() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-background [background-image:linear-gradient(to_bottom,rgba(99,102,241,0.06),transparent_520px)] text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-indigo-500/30 via-sky-500/20 to-transparent blur-3xl" />
        <div className="absolute top-40 -right-32 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-pink-500/25 via-violet-500/15 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-gradient-to-br from-emerald-500/20 to-transparent blur-3xl" />
      </div>

      <SiteHeader />

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.08)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_68%)] bg-[size:72px_72px] opacity-30" />
        <div className="mx-auto max-w-6xl px-6 pt-28 pb-16 sm:pt-36 sm:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/75 px-3.5 py-1.5 text-xs text-muted-foreground shadow-sm shadow-border/20 backdrop-blur">
              <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
              สำหรับสำนักงานบัญชีโดยเฉพาะ · ทดลองฟรี ไม่ต้องผูกบัตร
            </div>
            <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
              CRM สำหรับ{" "}
              <span className="bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                สำนักงานบัญชี
              </span>{" "}
              โดยเฉพาะ
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
              บริหารลูกค้า เสนอราคาบริการบัญชี ติดตาม Deadline ภาษี และปิดงบ —
              <br className="hidden sm:block" />
              ครบในระบบเดียวที่ออกแบบมาเข้าใจวงจรงานของสำนักงานบัญชีไทย
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground/80 sm:text-base">
              IProgressX CRM (IPX CRM) — the all-in-one accounting CRM built for
              Thai accounting firms.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <AuroraGlow>
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-xl px-6 text-base shadow-lg shadow-indigo-500/25 transition-transform hover:-translate-y-0.5"
                >
                  <a href="/crm/index.html" target="_blank" rel="noreferrer">
                    <PlayCircle className="size-5" />
                    ทดลองใช้ Demo
                    <ArrowRight />
                  </a>
                </Button>
              </AuroraGlow>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 bg-background/60 px-6 text-base shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5"
              >
                <a href="#features">ดูฟีเจอร์ทั้งหมด</a>
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/65 px-3 py-1.5 backdrop-blur">
                <CircleCheck className="size-3.5 text-emerald-500" />{" "}
                เข้าใจงานสำนักงานบัญชี
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/65 px-3 py-1.5 backdrop-blur">
                <CircleCheck className="size-3.5 text-emerald-500" /> ใช้ภาษาไทย
                100%
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/65 px-3 py-1.5 backdrop-blur">
                <CircleCheck className="size-3.5 text-emerald-500" /> รองรับ
                PDPA
              </span>
            </div>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="absolute -inset-x-10 -top-10 -bottom-10 -z-10 bg-gradient-to-tr from-indigo-500/20 via-pink-500/10 to-transparent blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] bg-card/80 shadow-2xl ring-1 shadow-indigo-500/10 ring-border/60 backdrop-blur">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
              <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/35 px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-rose-400/70" />
                <span className="size-2.5 rounded-full bg-amber-400/70" />
                <span className="size-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-3 text-xs text-muted-foreground">
                  app.iprogressx.com/crm
                </span>
              </div>
              <div className="grid gap-0 sm:grid-cols-[200px_1fr]">
                {/* Mock sidebar */}
                <div className="hidden flex-col gap-1 bg-muted/30 p-3 text-xs sm:flex">
                  <div className="px-2 py-1.5 text-[10px] font-medium text-muted-foreground uppercase">
                    CRM
                  </div>
                  {[
                    { icon: LayoutGrid, label: "Dashboard", active: true },
                    { icon: Magnet, label: "ลูกค้าใหม่" },
                    { icon: Briefcase, label: "Pipeline รับลูกค้า" },
                    { icon: PhoneCall, label: "ติดตามลูกค้า" },
                    { icon: FileSignature, label: "ใบเสนอราคา" },
                    { icon: Building2, label: "ทะเบียนลูกค้า" },
                    { icon: Wrench, label: "งานยื่น/ปิดงบ" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                        item.active
                          ? "bg-background font-medium text-foreground shadow-xs"
                          : "text-muted-foreground"
                      }`}
                    >
                      <item.icon className="size-3.5" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Mock dashboard */}
                <div className="p-5">
                  <div className="mb-4 flex items-end justify-between">
                    <div>
                      <div className="text-lg font-semibold">
                        ภาพรวมสำนักงาน
                      </div>
                      <div className="text-xs text-muted-foreground">
                        วันนี้ · 26 พ.ค. 2569
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      อัปเดตล่าสุด 2 นาทีที่แล้ว
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: "ลูกค้าใหม่", value: "128", trend: "+12%" },
                      {
                        label: "ใบเสนอราคา (รออนุมัติ)",
                        value: "47",
                        trend: "+5%",
                      },
                      {
                        label: "รายได้บริการ (เดือนนี้)",
                        value: "฿1.2M",
                        trend: "+18%",
                      },
                      { label: "งานยื่นค้าง", value: "9", trend: "-3" },
                    ].map((kpi) => (
                      <div
                        key={kpi.label}
                        className="rounded-lg bg-background p-3 ring-1 ring-border/60"
                      >
                        <div className="text-[11px] text-muted-foreground">
                          {kpi.label}
                        </div>
                        <div className="mt-1 text-lg font-semibold">
                          {kpi.value}
                        </div>
                        <div className="text-[10px] text-emerald-600">
                          {kpi.trend}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-lg bg-background p-4 ring-1 ring-border/60">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-sm font-medium">
                        Pipeline รับลูกค้าใหม่
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        ฿4.8M รวม
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: "ปรึกษา", pct: 25, color: "bg-pink-400" },
                        { name: "ประเมินงาน", pct: 60, color: "bg-amber-400" },
                        { name: "เสนอราคา", pct: 45, color: "bg-violet-400" },
                        { name: "ทำสัญญา", pct: 80, color: "bg-emerald-400" },
                      ].map((row) => (
                        <div key={row.name} className="flex items-center gap-3">
                          <div className="w-20 text-[11px] text-muted-foreground">
                            {row.name}
                          </div>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full ${row.color}`}
                              style={{ width: `${row.pct}%` }}
                            />
                          </div>
                          <div className="w-8 text-right text-[11px] tabular-nums">
                            {row.pct}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border/60 bg-card/75 px-5 py-5 text-center shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
                  {s.value}
                </div>
                <div className="mt-1 text-xs leading-5 text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/40 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs tracking-wider text-muted-foreground uppercase">
              ฟีเจอร์
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              ทุกอย่างที่สำนักงานบัญชีต้องใช้ ในที่เดียว
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              ตั้งแต่รับลูกค้าใหม่ ไปจนถึงยื่นภาษีและปิดงบประจำปี —
              ครบในระบบเดียว
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card
                key={f.title}
                className="group relative min-h-[218px] gap-3 overflow-hidden border-white/70 bg-white/75 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200/70 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-card/70"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500/0 via-violet-500/50 to-pink-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="space-y-3">
                  <div
                    className={`inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm transition-transform group-hover:scale-105 ${f.accent}`}
                  >
                    <f.icon className="size-5" />
                  </div>
                  <div className="text-base font-semibold text-foreground">
                    {f.title}
                  </div>
                  <div className="text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="flow" className="relative border-t border-border/40">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-muted/40 to-transparent" />
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs tracking-wider text-muted-foreground uppercase">
              ขั้นตอน
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              ครบวงจรตั้งแต่รับลูกค้าใหม่จนยื่นภาษี
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              ไม่ต้องสลับหลายโปรแกรม ทุกขั้นตอนของสำนักงานบัญชีทำได้ในระบบเดียว
            </p>
          </div>

          <div className="relative mt-14">
            <div className="absolute top-6 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-indigo-300/70 to-transparent md:block" />
            <div className="grid gap-4 md:grid-cols-5">
              {flowSteps.map((step, i) => (
                <div
                  key={step.title}
                  className="relative rounded-xl border border-border/60 bg-background/75 px-4 py-5 text-center shadow-sm backdrop-blur transition-transform hover:-translate-y-1 hover:shadow-md md:border-transparent md:bg-transparent md:shadow-none"
                >
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full border-2 border-indigo-500 bg-background text-sm font-semibold text-indigo-600 shadow-sm shadow-indigo-500/20">
                    {i + 1}
                  </div>
                  <div className="mt-3 text-sm font-semibold">{step.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product showcase — alternating mockup rows */}
      <SectionWithMockup
        eyebrow="Pipeline รับลูกค้าใหม่"
        title={
          <>
            เห็นทุกผู้สนใจใช้บริการ <br className="hidden md:inline" />
            ตั้งแต่ปรึกษาจนเริ่มงาน
          </>
        }
        description={
          <>
            จัดการกระบวนการรับลูกค้าใหม่แบบ Kanban — ปรึกษา → ประเมิน → เสนอราคา
            → ทำสัญญา ลาก-วางเปลี่ยนสถานะได้ทันที
            พร้อมเห็นมูลค่าบริการต่อเดือนที่กำลังจะปิด — ไม่ต้องเปิด Excel
            หลายไฟล์อีกต่อไป
          </>
        }
        mockup={<PipelineMockup />}
        secondaryMockup={<PipelineMockup />}
      />

      <SectionWithMockup
        reverseLayout
        eyebrow="ใบเสนอราคาบริการบัญชี"
        title={
          <>
            ใบเสนอราคา <br className="hidden md:inline" />
            สร้างและส่งให้ลูกค้าพิจารณาได้รวดเร็ว
          </>
        }
        description={
          <>
            เลือกจากเทมเพลตบริการ — บัญชี ภาษี ตรวจสอบ ยื่นประกันสังคม —
            สร้างใบเสนอราคา ส่งให้ลูกค้าพิจารณา และติดตามสถานะรออนุมัติในระบบ
            พร้อมต่อยอดสู่ระบบบัญชี (PEAK / FlowAccount) ในแผนพัฒนาช่วงถัดไป
          </>
        }
        mockup={<ProposalMockup />}
        secondaryMockup={<ProposalMockup />}
      />

      {/* Why us */}
      <section id="why" className="border-t border-border/40 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="text-xs tracking-wider text-muted-foreground uppercase">
                ทำไมต้อง IProgressX CRM
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                สร้างมาเพื่อสำนักงานบัญชี <br /> ไม่ใช่ CRM ทั่วไป
              </h2>
              <p className="mt-4 text-sm text-muted-foreground sm:text-base">
                เราออกแบบทุกฟีเจอร์โดยเข้าใจวงจรงานของสำนักงานบัญชี —
                ตั้งแต่การรับลูกค้าใหม่ ใบเสนอราคาบริการ การติดตามด้วย Line OA
                ไปจนถึงการยื่นภาษีและปิดงบประจำปี
              </p>
              <p className="mt-2 text-xs text-muted-foreground/80 sm:text-sm">
                A purpose-built CRM for accounting firms — not a generic CRM
                forced to fit. Designed for Thai accounting workflows, with full
                PDPA compliance.
              </p>

              <ul className="mt-7 space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                      <CircleCheck className="size-3.5" />
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-white/70 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-white/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:to-card/70">
                <CardContent className="space-y-2">
                  <Zap className="size-6 text-indigo-500" />
                  <div className="text-base font-semibold">
                    เสนอราคาเร็วขึ้น 3 เท่า
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ลดการสลับโปรแกรม
                    รวมข้อมูลลูกค้าและเทมเพลตบริการบัญชีไว้ในที่เดียว
                  </div>
                </CardContent>
              </Card>
              <Card className="border-white/70 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:mt-8 dark:border-white/10 dark:to-card/70">
                <CardContent className="space-y-2">
                  <TrendingUp className="size-6 text-emerald-500" />
                  <div className="text-base font-semibold">
                    เห็นภาพรวมสำนักงานแบบเรียลไทม์
                  </div>
                  <div className="text-sm text-muted-foreground">
                    รายได้บริการ งานยื่นค้าง Deadline ภาษีของทุกลูกค้า
                    เห็นในหน้าจอเดียว
                  </div>
                </CardContent>
              </Card>
              <Card className="border-white/70 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:to-card/70">
                <CardContent className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Workflow className="size-6 text-amber-500" />
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-amber-700 uppercase">
                      Roadmap
                    </span>
                  </div>
                  <div className="text-base font-semibold">
                    เชื่อมต่อระบบบัญชี (เร็วๆ นี้)
                  </div>
                  <div className="text-sm text-muted-foreground">
                    เตรียมเชื่อม{" "}
                    <span className="font-medium text-emerald-600">PEAK</span>{" "}
                    และ{" "}
                    <span className="font-medium text-sky-600">
                      FlowAccount
                    </span>{" "}
                    เพื่อส่งใบเสนอราคาที่ปิดแล้วต่อไปออกใบแจ้งหนี้-ใบกำกับภาษีโดยไม่ต้องคีย์ซ้ำ
                  </div>
                </CardContent>
              </Card>
              <Card className="border-white/70 bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-white/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:mt-8 dark:border-white/10 dark:to-card/70">
                <CardContent className="space-y-2">
                  <ShieldCheck className="size-6 text-pink-500" />
                  <div className="text-base font-semibold">ปลอดภัยตาม PDPA</div>
                  <div className="text-sm text-muted-foreground">
                    ข้อมูลโฮสต์ในไทย เข้ารหัสทุกชั้น พร้อมระบบสิทธิ์ละเอียด
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="border-t border-border/40">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 px-8 py-14 text-center text-white shadow-2xl ring-1 shadow-violet-500/20 ring-white/20 sm:px-12 sm:py-20">
            <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_60%)]" />
            <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="absolute inset-0 -z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
            <div className="relative">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                พร้อมยกระดับสำนักงานบัญชีของคุณแล้วใช่ไหม?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 sm:text-base">
                กดทดลองใช้ Demo ได้เลย ไม่ต้องสมัคร ไม่ต้องผูกบัตร —
                ลองทุกฟีเจอร์ที่ออกแบบมาเพื่อสำนักงานบัญชีเต็มรูปแบบในเบราว์เซอร์ของคุณ
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 bg-white px-6 text-base text-indigo-700 shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5 hover:bg-white/90"
                >
                  <a href="/crm/index.html" target="_blank" rel="noreferrer">
                    <PlayCircle className="size-5" />
                    ทดลองใช้ Demo
                    <ArrowRight />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/40 bg-white/0 px-6 text-base text-white backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                >
                  <a href="mailto:thananan.th@iprogressx.co.th">คุยกับทีมขาย</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/IProgressX.png"
              alt="I Progress X Logo"
              width={120}
              height={40}
              className="h-6 w-auto object-contain"
            />
            <span>
              © {new Date().getFullYear()} IProgressX CRM. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="transition-colors hover:text-foreground">
              นโยบายความเป็นส่วนตัว
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              เงื่อนไขการใช้งาน
            </a>
            <a
              href="/crm/index.html"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Demo
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
