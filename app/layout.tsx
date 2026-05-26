import type { Metadata } from "next"
import { Geist_Mono, Inter, Noto_Sans_Thai } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-thai",
  weight: ["400", "500", "600", "700"],
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "IProgressX CRM — CRM สำหรับสำนักงานบัญชีโดยเฉพาะ",
  description:
    "CRM สำหรับสำนักงานบัญชีไทย — บริหารลูกค้า เสนอราคาบริการบัญชี ติดตาม Deadline ภาษี และปิดงบ ครบในระบบเดียว",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable,
        notoThai.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
