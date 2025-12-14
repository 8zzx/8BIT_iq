"use client"

import { useState, useEffect } from "react"
import { Quote, Star, ChevronRight, ChevronLeft } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

const testimonials = [
  {
    name: "أحمد الشمري",
    role: "طالب هندسة طبية - جامعة الملك سعود",
    content:
      "ساعدني فريق 8BIT في إنجاز مشروع تخرجي في الوقت المحدد وبجودة عالية جداً. الدعم الفني كان ممتازاً والتواصل سريع ومهني.",
    rating: 5,
    project: "نظام مراقبة المريض IoT",
  },
  {
    name: "سارة العتيبي",
    role: "طالبة هندسة حاسب - جامعة الأميرة نورة",
    content:
      "أفضل مكتب تعاملت معه! فهموا متطلبات المشروع بسرعة ونفذوه بطريقة احترافية. أنصح كل طالب هندسة بالتعامل معهم.",
    rating: 5,
    project: "تطبيق ويب لإدارة المهام",
  },
  {
    name: "محمد القحطاني",
    role: "مؤسس شركة ناشئة - TechStart",
    content: "نفذوا لنا النموذج الأولي MVP لتطبيقنا بسرعة وكفاءة عالية. الجودة فاقت توقعاتنا والسعر كان معقولاً جداً.",
    rating: 5,
    project: "تطبيق IoT للزراعة الذكية",
  },
  {
    name: "نورة الدوسري",
    role: "طالبة ماجستير - جامعة الملك عبدالعزيز",
    content: "كتبوا لي بحثاً أكاديمياً بجودة ممتازة وبأسلوب علمي رصين. التزموا بالموعد وكانوا متعاونين جداً في التعديلات.",
    rating: 5,
    project: "بحث الذكاء الاصطناعي في الطب",
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handlePrev = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-28 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-transparent" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent text-sm font-semibold tracking-wider uppercase rounded-full mb-4">
              آراء العملاء
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground text-balance">
              ماذا يقول <span className="gradient-text">عملاؤنا</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          <ScrollReveal delay={100}>
            <div className="relative">
              {/* Main testimonial card */}
              <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-10 md:p-12 noise-overlay overflow-hidden">
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote size={80} className="text-primary" />
                </div>

                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-accent text-accent" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 font-medium">
                    "{testimonials[activeIndex].content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-foreground">{testimonials[activeIndex].name}</h4>
                      <p className="text-muted-foreground">{testimonials[activeIndex].role}</p>
                    </div>
                    <div className="px-4 py-2 bg-primary/10 rounded-full">
                      <span className="text-primary text-sm font-medium">{testimonials[activeIndex].project}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 bg-secondary hover:bg-secondary/80 rounded-full flex items-center justify-center text-foreground transition-colors"
                >
                  <ChevronRight size={24} />
                </button>

                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setIsAutoPlaying(false)
                        setActiveIndex(i)
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        i === activeIndex ? "bg-primary w-8" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="w-12 h-12 bg-secondary hover:bg-secondary/80 rounded-full flex items-center justify-center text-foreground transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
