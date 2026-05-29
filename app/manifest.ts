import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IProgressX CRM — CRM สำหรับสำนักงานบัญชี",
    short_name: "IProgressX CRM",
    description:
      "CRM สำหรับสำนักงานบัญชีไทย — บริหารลูกค้า เสนอราคา ติดตาม Deadline ภาษี และปิดงบ ครบในระบบเดียว",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6366f1",
    lang: "th-TH",
    dir: "ltr",
    orientation: "portrait-primary",
    categories: ["business", "productivity", "finance"],
    icons: [
      {
        src: "/IProgressX.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  }
}
