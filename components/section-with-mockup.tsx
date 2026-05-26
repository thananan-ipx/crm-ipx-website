"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

interface SectionWithMockupProps {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  /** The hero mockup placed on the main raised card. */
  mockup: React.ReactNode
  /** Optional smaller mockup that sits behind, blurred, as decoration. */
  secondaryMockup?: React.ReactNode
  reverseLayout?: boolean
  className?: string
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
}

export function SectionWithMockup({
  eyebrow,
  title,
  description,
  mockup,
  secondaryMockup,
  reverseLayout = false,
  className,
}: SectionWithMockupProps) {
  const textOrderClass = reverseLayout ? "md:col-start-2" : ""
  const imageOrderClass = reverseLayout ? "md:col-start-1" : ""

  return (
    <section
      className={cn(
        "relative overflow-hidden border-t border-border/40 bg-background py-24 md:py-32",
        className
      )}
    >
      {/* Soft ambient color blobs */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute top-1/4 -left-32 h-[480px] w-[480px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-pink-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1220px] px-6 md:px-10">
        <motion.div
          className={cn(
            "grid w-full grid-cols-1 items-center gap-16 md:gap-12",
            reverseLayout
              ? "md:grid-flow-col-dense md:grid-cols-2"
              : "md:grid-cols-2"
          )}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Text */}
          <motion.div
            className={cn(
              "relative z-20 mx-auto mt-10 flex max-w-[546px] flex-col items-start gap-4 md:mx-0 md:mt-0",
              textOrderClass
            )}
            variants={itemVariants}
          >
            {eyebrow ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/75 px-3.5 py-1.5 text-[11px] tracking-wider text-muted-foreground uppercase shadow-sm backdrop-blur">
                {eyebrow}
              </span>
            ) : null}
            <h2 className="text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground md:text-[40px] md:leading-[1.15]">
              {title}
            </h2>
            <p className="text-[15px] leading-7 text-pretty text-muted-foreground">
              {description}
            </p>
          </motion.div>

          {/* Mockup column */}
          <motion.div
            className={cn(
              "relative mx-auto mt-10 w-full max-w-[300px] md:mt-0 md:max-w-[471px]",
              imageOrderClass
            )}
            variants={itemVariants}
          >
            {/* Decorative secondary card — overflows toward the page edge, never under the text */}
            <motion.div
              aria-hidden
              className="absolute z-0 h-[317px] w-[300px] overflow-hidden rounded-[28px] bg-white shadow-xl ring-1 shadow-indigo-500/10 ring-border/60 md:h-[500px] md:w-[472px] dark:bg-card"
              style={{
                top: reverseLayout ? "auto" : "10%",
                bottom: reverseLayout ? "10%" : "auto",
                left: reverseLayout ? "-20%" : "auto",
                right: reverseLayout ? "auto" : "-20%",
                filter: "blur(2px)",
              }}
              initial={{ y: 0 }}
              whileInView={{ y: reverseLayout ? -20 : -30 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <div className="h-full w-full opacity-70">
                {secondaryMockup ?? mockup}
              </div>
            </motion.div>

            {/* Main mockup card */}
            <motion.div
              className="relative z-10 h-[405px] w-full overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 shadow-indigo-500/15 ring-border/70 md:h-[637px] dark:bg-card dark:shadow-black/40"
              initial={{ y: 0 }}
              whileInView={{ y: reverseLayout ? 20 : 30 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <div className="h-full w-full">{mockup}</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
