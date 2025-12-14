"use client"

import { useState } from "react"
import { Send } from "lucide-react"

export function TelegramButton() {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    window.open("https://t.me/bit_iq8", "_blank")
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="absolute inset-0 w-16 h-16 bg-[#0088cc] rounded-full animate-ping opacity-20" />
      <div className="absolute inset-0 w-16 h-16 bg-[#0088cc] rounded-full animate-pulse opacity-30" />

      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-16 h-16 bg-gradient-to-br from-[#0088cc] to-[#0066aa] hover:from-[#00a0e6] hover:to-[#0077bb] text-white rounded-full shadow-2xl shadow-[#0088cc]/30 hover:shadow-[#0088cc]/50 transition-all duration-500 flex items-center justify-center group hover:scale-110"
        aria-label="تواصل عبر تليغرام"
      >
        <Send size={28} className={`transition-all duration-300 ${isHovered ? "scale-110 rotate-12" : ""}`} />
      </button>

      <div
        className={`absolute left-full bottom-1/2 translate-y-1/2 mr-4 transition-all duration-300 ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 bg-card/95 backdrop-blur-sm text-foreground rounded-xl shadow-2xl border border-border whitespace-nowrap">
          <p className="font-semibold text-sm">تواصل معنا الآن</p>
          <p className="text-xs text-muted-foreground">@bit_iq8</p>
        </div>
      </div>
    </div>
  )
}
