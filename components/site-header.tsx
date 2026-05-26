"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Menu, X } from "lucide-react"

import { AuroraGlow } from "@/components/aurora-glow"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "ฟีเจอร์", href: "#features" },
  { name: "ขั้นตอน", href: "#flow" },
  { name: "ทำไมต้องเรา", href: "#why" },
  { name: "เริ่มต้น", href: "#cta" },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header>
      <nav
        data-state={menuOpen ? "active" : undefined}
        className="group fixed inset-x-0 top-0 z-40 w-full px-3"
      >
        <div
          className={cn(
            "mx-auto mt-3 max-w-6xl px-5 transition-all duration-300 lg:px-8",
            scrolled &&
              "max-w-5xl rounded-[1.75rem] border border-white/55 bg-white/72 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-background/60 dark:shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* Logo + mobile toggle */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center gap-3"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              >
                <Image
                  src="/IProgressX.png"
                  alt="I Progress X Logo"
                  width={120}
                  height={40}
                  priority
                  className="h-10 w-auto"
                />
                <div className="hidden sm:block">
                  <p className="text-foreground text-sm font-semibold tracking-[0.18em] uppercase">
                    IProgressX
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    CRM สำหรับสำนักงานบัญชี
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen((s) => !s)}
                aria-label={menuOpen ? "Close Menu" : "Open Menu"}
                aria-expanded={menuOpen}
                className="relative z-20 block cursor-pointer rounded-full border border-white/70 bg-white/75 p-2.5 shadow-sm backdrop-blur lg:hidden dark:border-white/10 dark:bg-background/70"
              >
                {menuOpen ? (
                  <X className="m-auto size-5" />
                ) : (
                  <Menu className="m-auto size-5" />
                )}
              </button>
            </div>

            {/* Desktop nav */}
            <ul className="text-muted-foreground absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 text-sm lg:flex">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="hover:bg-muted/60 hover:text-foreground rounded-full px-3.5 py-2 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right cluster + mobile collapsing panel */}
            <div
              className={cn(
                "hidden w-full flex-wrap items-center justify-end space-y-6 rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl shadow-slate-300/20 backdrop-blur-xl transition-all dark:border-white/10 dark:bg-background/80 lg:m-0 lg:flex lg:w-fit lg:gap-3 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none dark:lg:border-transparent dark:lg:bg-transparent",
                menuOpen && "mt-3 mb-2 block"
              )}
            >
              {/* Mobile-only links */}
              <ul className="space-y-5 text-base lg:hidden">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground block transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-fit">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden rounded-full px-4 sm:inline-flex"
                >
                  <a href="#cta">ติดต่อขาย</a>
                </Button>
                <AuroraGlow radiusClassName="rounded-full" insetClassName="-inset-0.5" noPulse>
                  <Button asChild size="sm" className="rounded-full px-4">
                    <a href="/crm/index.html" target="_blank" rel="noreferrer">
                      ทดลองใช้ Demo
                      <ArrowRight />
                    </a>
                  </Button>
                </AuroraGlow>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
