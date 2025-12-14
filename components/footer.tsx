"use client"

import type React from "react"
import Link from "next/link"
import { Twitter, Instagram, Linkedin, Github, Heart } from "lucide-react"

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/8bit_sa", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/8bit_sa", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/8bit-sa", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/8bit-sa", label: "GitHub" },
]

export function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const targetId = href.replace("#", "")
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  return (
    <footer className="relative bg-card/50 border-t border-border py-16 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <span className="text-4xl font-black gradient-text">8BIT</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              مكتب تقني متخصص في تقديم الحلول الرقمية لطلاب الهندسة والشركات الناشئة
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground text-lg mb-5">الخدمات</h4>
            <ul className="space-y-3">
              {["تصميم 3D", "البرمجة", "البحوث الأكاديمية", "مشاريع التخرج"].map((item) => (
                <li key={item}>
                  <a
                    href="#services"
                    onClick={(e) => handleNavClick(e, "#services")}
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground text-lg mb-5">روابط سريعة</h4>
            <ul className="space-y-3">
              {[
                { label: "من نحن", href: "#about" },
                { label: "أعمالنا", href: "#projects" },
                { label: "آراء العملاء", href: "#testimonials" },
                { label: "تواصل معنا", href: "#contact" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground text-lg mb-5">تابعنا</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all hover:scale-110"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground flex items-center gap-2">
            2025 8BIT.  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              سياسة الخصوصية
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
