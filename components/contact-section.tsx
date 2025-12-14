"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Send, MessageCircle, Mail, MapPin, Loader2, CheckCircle2, Sparkles } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "بريد إلكتروني غير صالح",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to send message")

      setIsSubmitted(true)
      toast({
        title: "تم إرسال رسالتك بنجاح",
        description: "سنتواصل معك في أقرب وقت ممكن",
      })

      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" })
        setIsSubmitted(false)
      }, 3000)
    } catch (error) {
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTelegram = () => {
    window.open("https://t.me/bit_iq8", "_blank")
  }

  const handleEmail = () => {
    window.location.href = "mailto:info@8bit.sa?subject=استفسار من الموقع"
  }

  return (
    <section id="contact" className="py-28 px-6 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-semibold tracking-wider uppercase rounded-full mb-4">
              تواصل معنا
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground text-balance">
              جاهزون <span className="gradient-text">لمساعدتك</span>
            </h2>
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg">
              تواصل معنا الآن وأخبرنا عن مشروعك، فريقنا جاهز للإجابة على استفساراتك
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <ScrollReveal delay={100}>
              <button
                onClick={handleTelegram}
                className="card-hover glow-border flex items-start gap-5 w-full text-right bg-card/80 backdrop-blur-sm border border-border p-6 rounded-2xl transition-all"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="text-accent" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-1">تليغرام</h3>
                  <p className="text-muted-foreground">@bit_iq8</p>
                  <span className="text-sm text-accent font-medium">اضغط للتواصل مباشرة</span>
                </div>
              </button>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <button
                onClick={handleEmail}
                className="card-hover glow-border flex items-start gap-5 w-full text-right bg-card/80 backdrop-blur-sm border border-border p-6 rounded-2xl transition-all"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Mail className="text-primary" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-1">البريد الإلكتروني</h3>
                  <p className="text-muted-foreground">info@8bit.sa</p>
                  <span className="text-sm text-primary font-medium">اضغط لإرسال بريد</span>
                </div>
              </button>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="flex items-start gap-5 bg-card/80 backdrop-blur-sm border border-border p-6 rounded-2xl">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-accent" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-1">الموقع</h3>
                  <p className="text-muted-foreground">العراق</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-2xl p-6">
                <h3 className="font-bold text-foreground text-lg mb-4">ساعات العمل</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الأحد - الخميس</span>
                    <span className="text-foreground font-semibold">9 ص - 9 م</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الجمعة - السبت</span>
                    <span className="text-foreground font-semibold">2 م - 9 م</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-3">
            <ScrollReveal delay={200}>
              <form
                onSubmit={handleSubmit}
                className="card-hover bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-8 md:p-10 space-y-6 noise-overlay"
              >
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center relative z-10">
                    <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <CheckCircle2 className="text-accent" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">تم إرسال رسالتك</h3>
                    <p className="text-muted-foreground text-lg">سنتواصل معك في أقرب وقت ممكن</p>
                  </div>
                ) : (
                  <div className="relative z-10">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm text-foreground font-medium mb-2 block">الاسم الكامل *</label>
                        <Input
                          placeholder="أدخل اسمك"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-secondary/50 border-border h-12 text-base"
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-foreground font-medium mb-2 block">البريد الإلكتروني *</label>
                        <Input
                          type="email"
                          placeholder="أدخل بريدك الإلكتروني"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-secondary/50 border-border h-12 text-base"
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">الموضوع</label>
                      <Input
                        placeholder="عنوان الرسالة"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="bg-secondary/50 border-border h-12 text-base"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">الرسالة *</label>
                      <Textarea
                        placeholder="اكتب رسالتك هنا... أخبرنا عن مشروعك ومتطلباتك"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-secondary/50 border-border resize-none text-base"
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-3 py-6 text-lg font-semibold relative overflow-hidden group"
                      disabled={isSubmitting}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      {isSubmitting ? (
                        <>
                          <Loader2 size={22} className="animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Sparkles size={22} />
                          إرسال الرسالة
                          <Send size={22} />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
