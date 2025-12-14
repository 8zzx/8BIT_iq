import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Tajawal } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "8BIT | مكتب الحلول التقنية والهندسية",
  description:
    "مكتب تقني متخصص يسد الفجوة بين الدراسة النظرية والتطبيق العملي. نقدم خدمات تصميم ثلاثي الأبعاد، برمجة Arduino و Python، كتابة البحوث الأكاديمية، وتنفيذ مشاريع التخرج للطلاب والشركات الناشئة.",
  keywords: [
    "مكتب تقني",
    "مشاريع تخرج",
    "تصميم 3D",
    "برمجة Arduino",
    "بحوث أكاديمية",
    "هندسة طبية",
    "MVP",
    "شركات ناشئة",
    "8BIT",
  ],
  authors: [{ name: "8BIT" }],
  creator: "8BIT",
  openGraph: {
    title: "8BIT | مكتب الحلول التقنية والهندسية",
    description: "نحوّل أفكارك إلى واقع تقني - مشاريع تخرج، تصميم 3D، برمجة، بحوث أكاديمية",
    type: "website",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "8BIT | مكتب الحلول التقنية والهندسية",
    description: "نحوّل أفكارك إلى واقع تقني",
  },
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0f1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
