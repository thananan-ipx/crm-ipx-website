import type { Metadata, Viewport } from "next"
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

const SITE_URL = "https://iprogressx.co.th"
const SITE_NAME = "I Progress X CRM"
const TITLE = "I Progress X CRM — CRM สำหรับสำนักงานบัญชีโดยเฉพาะ"
const DESCRIPTION =
  "CRM สำหรับสำนักงานบัญชีไทย — บริหารลูกค้า เสนอราคาบริการบัญชี ติดตาม Deadline ภาษี ยื่นภาษี และปิดงบประจำปี ครบในระบบเดียว ออกแบบมาเข้าใจวงจรงานของสำนักงานบัญชีโดยเฉพาะ รองรับ PDPA"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | I Progress X CRM",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js",
  keywords: [
    "crm",
    "CRM",
    "crm for accounting",
    "CRM for accounting",
    "account crm",
    "accounting crm",
    "crm สำนักงานบัญชี",
    "crm สำหรับสำนักงานบัญชี",
    "CRM สำนักงานบัญชี",
    "CRM สำหรับสำนักงานบัญชี",
    "CRM บัญชี",
    "โปรแกรม CRM สำหรับนักบัญชี",
    "ระบบบริหารลูกค้าสำนักงานบัญชี",
    "ใบเสนอราคาบริการบัญชี",
    "ติดตาม Deadline ภาษี",
    "ระบบยื่นภาษี",
    "ปิดงบประจำปี",
    "PEAK",
    "FlowAccount",
    "IProgressX",
    "iprogressx",
    "I Progress X",
    "i progress x",
    "IPX",
    "IPX CRM",
    "ipx",
    "ipx crm",
    "IProgressX CRM",
    "iprogressx crm",
    "CRM ไทย",
    "PDPA CRM",
    "Accounting CRM Thailand",
  ],
  authors: [{ name: "IProgressX", url: SITE_URL }],
  creator: "IProgressX",
  publisher: "IProgressX",
  category: "Business Software",
  classification: "CRM, Accounting Software, SaaS",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "th-TH": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/IProgressX.png",
        width: 1200,
        height: 630,
        alt: "IProgressX CRM — CRM สำหรับสำนักงานบัญชี",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/IProgressX.png"],
    creator: "@iprogressx",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/IProgressX.png", type: "image/png" },
    ],
    apple: "/IProgressX.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  verification: {
    // เพิ่มค่าจริงเมื่อ verify เสร็จ
    // google: "google-site-verification-code",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "IProgressX",
      alternateName: ["IPX", "I Progress X", "IPX CRM", "IProgressX CRM"],
      legalName: "IProgressX Co., Ltd.",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/IProgressX.png`,
        width: 512,
        height: 512,
      },
      email: "thananan.th@iprogressx.co.th",
      areaServed: "TH",
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DESCRIPTION,
      inLanguage: "th-TH",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: SITE_NAME,
      alternateName: ["IPX CRM", "IPX", "IProgressX"],
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "CRM",
      operatingSystem: "Web",
      url: SITE_URL,
      description: DESCRIPTION,
      inLanguage: "th-TH",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "THB",
        availability: "https://schema.org/InStock",
        description: "ทดลองใช้ฟรี ไม่ต้องผูกบัตร",
      },
      featureList: [
        "Dashboard สำนักงานบัญชี",
        "Pipeline รับลูกค้าใหม่",
        "ใบเสนอราคาบริการบัญชี",
        "ติดตาม Deadline ภาษี",
        "ทะเบียนลูกค้า",
        "บริหารงานยื่นภาษีและปิดงบ",
        "เตือนล่วงหน้าอัตโนมัติ",
        "รองรับ PDPA",
      ],
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
