"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Code2, Cpu, FileText, Sparkles, Zap, Shield } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(currentRef)

    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, hasStarted])

  return { count, ref }
}

export function HeroSection() {
  const projectsCounter = useCountUp(150, 2500)
  const satisfactionCounter = useCountUp(98, 2500)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleStartProject = () => {
    window.open("https://wa.me/966XXXXXXXXX?text=مرحباً، أريد أن أبدأ مشروعي مع 8BIT", "_blank")
  }

  const handleViewProjects = () => {
    const element = document.getElementById("projects")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <ScrollReveal delay={0}>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-secondary/80 backdrop-blur-sm rounded-full text-sm border border-border/50 hover:border-primary/50 transition-colors cursor-default">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                </span>
                <span className="text-muted-foreground">نقبل مشاريع جديدة الآن</span>
                <Zap className="w-4 h-4 text-accent" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="text-foreground">نحوّل أفكارك إلى</span>
                <br />
                <span className="gradient-text">واقع تقني</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                مكتب تقني متخصص يسد الفجوة بين الدراسة النظرية والتطبيق العملي. نقدم حلولاً رقمية احترافية لطلاب الهندسة
                والشركات الناشئة.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={handleStartProject}
                  className="relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 gap-3 text-lg px-8 py-6 group animate-pulse-glow"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Sparkles className="w-5 h-5" />
                  ابدأ مشروعك الآن
                  <ArrowLeft size={20} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleViewProjects}
                  className="border-border text-foreground hover:bg-secondary bg-transparent gap-2 text-lg px-8 py-6 glow-border"
                >
                  تصفح أعمالنا
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div ref={projectsCounter.ref} className="flex items-center gap-8 pt-6">
                <div className="text-center group cursor-default">
                  <div className="text-4xl font-black gradient-text group-hover:scale-110 transition-transform">
                    +{mounted ? projectsCounter.count : 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">مشروع منجز</div>
                </div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="text-center group cursor-default">
                  <div className="text-4xl font-black gradient-text group-hover:scale-110 transition-transform">
                    {mounted ? satisfactionCounter.count : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">رضا العملاء</div>
                </div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="text-center group cursor-default">
                  <div className="text-4xl font-black gradient-text group-hover:scale-110 transition-transform">
                    24h
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">استجابة سريعة</div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-3xl rounded-full animate-pulse"></div>

            <div className="relative grid grid-cols-2 gap-5">
              <div className="space-y-5">
                <ScrollReveal delay={200} direction="right">
                  <div className="card-hover glow-border bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-7 cursor-pointer">
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                        <Code2 className="text-primary" size={28} />
                      </div>
                      <h3 className="font-bold text-foreground text-lg mb-2">برمجة متقدمة</h3>
                      <p className="text-sm text-muted-foreground">Arduino, Python, Web Development</p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={400} direction="right">
                  <div className="card-hover glow-border bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-7 cursor-pointer">
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mb-5">
                        <FileText className="text-accent" size={28} />
                      </div>
                      <h3 className="font-bold text-foreground text-lg mb-2">بحوث أكاديمية</h3>
                      <p className="text-sm text-muted-foreground">تقارير وأبحاث بأسلوب علمي</p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              <div className="space-y-5 pt-10">
                <ScrollReveal delay={300} direction="left">
                  <div className="card-hover glow-border bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-7 cursor-pointer">
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-5">
                        <Cpu className="text-primary" size={28} />
                      </div>
                      <h3 className="font-bold text-foreground text-lg mb-2">تصميم 3D</h3>
                      <p className="text-sm text-muted-foreground">نماذج للطباعة والمشاريع</p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={500} direction="left">
                  <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-2xl p-7 cursor-pointer group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-5 h-5 text-accent" />
                        <span className="text-sm text-accent font-medium">آخر مشروع</span>
                      </div>
                      <div className="text-foreground font-bold text-lg mb-3">نظام مراقبة طبي IoT</div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1.5 bg-primary/30 text-primary text-xs rounded-full font-medium">
                          Arduino
                        </span>
                        <span className="px-3 py-1.5 bg-accent/30 text-accent text-xs rounded-full font-medium">
                          3D Print
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
