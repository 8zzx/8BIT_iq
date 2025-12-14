"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles, Settings } from "lucide-react"

const navItems = [
  { href: "#services", label: "خدماتنا" },
  { href: "#about", label: "من نحن" },
  { href: "#projects", label: "مشاريعنا" },
  { href: "#testimonials", label: "آراء العملاء" },
  { href: "#contact", label: "تواصل معنا" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const sections = navItems.map((item) => item.href.replace("#", ""))
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace("#", "")
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setIsMenuOpen(false)
  }

  const handleStartProject = () => {
    window.open("https://t.me/bit_iq8", "_blank")
  }

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-2xl shadow-primary/5"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all duration-500" />
              <span className="relative text-3xl font-black gradient-text">8BIT</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg cursor-pointer
                  ${
                    activeSection === item.href.replace("#", "")
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {activeSection === item.href.replace("#", "") && (
                  <span className="absolute inset-0 bg-primary/10 rounded-lg" />
                )}
                <span className="relative">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-border hover:border-primary/50 hover:bg-primary/5 bg-transparent"
              >
                <Settings className="w-4 h-4" />
                <span>إدارة</span>
              </Button>
            </Link>

            <Button
              onClick={handleStartProject}
              className="relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 gap-2 group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-shift" />
              <Sparkles className="relative w-4 h-4" />
              <span className="relative">ابدأ مشروعك</span>
            </Button>
          </div>

          <button
            className="md:hidden text-foreground p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-300">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-muted-foreground hover:text-primary hover:bg-secondary/50 px-4 py-3 rounded-lg transition-all cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/login"
              className="text-muted-foreground hover:text-primary hover:bg-secondary/50 px-4 py-3 rounded-lg transition-all flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              إدارة
            </Link>
            <Button
              onClick={handleStartProject}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full mt-2 gap-2"
            >
              <Sparkles className="w-4 h-4" />
              ابدأ مشروعك
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
