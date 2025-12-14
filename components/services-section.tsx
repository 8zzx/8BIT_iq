"use client"

import { Box, Code, FileEdit, Layers, ArrowUpLeft } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

const services = [
  {
    icon: Box,
    title: "تصميم ثلاثي الأبعاد",
    description: "نصمم نماذج 3D احترافية جاهزة للطباعة أو العرض، باستخدام أحدث برامج التصميم الهندسي.",
    tags: ["SolidWorks", "Fusion 360", "Blender"],
    color: "primary",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Code,
    title: "البرمجة والتصحيح",
    description: "نكتب ونصحح الأكواد البرمجية لمشاريع Arduino و Python ومشاريع الويب المتكاملة.",
    tags: ["Arduino", "Python", "JavaScript"],
    color: "accent",
    gradient: "from-teal-500/20 to-emerald-500/20",
  },
  {
    icon: FileEdit,
    title: "البحوث الأكاديمية",
    description: "نكتب البحوث والتقارير الجامعية بأسلوب أكاديمي رصين يلبي أعلى معايير الجودة.",
    tags: ["IEEE", "APA", "Technical Reports"],
    color: "primary",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
  {
    icon: Layers,
    title: "مشاريع التخرج",
    description: "ننفذ مشاريع التخرج المتكاملة من الفكرة حتى التسليم، تجمع بين Hardware و Software.",
    tags: ["IoT", "Embedded Systems", "Full Stack"],
    color: "accent",
    gradient: "from-teal-500/20 to-cyan-500/20",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-28 px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-semibold tracking-wider uppercase rounded-full mb-4">
              خدماتنا
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 text-foreground text-balance">
              حلول تقنية <span className="gradient-text">متكاملة</span>
            </h2>
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg">
              نقدم مجموعة شاملة من الخدمات التقنية المصممة خصيصاً لطلاب الهندسة والشركات الناشئة
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div
                className={`group relative bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 card-hover glow-border overflow-hidden`}
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                        service.color === "primary" ? "bg-primary/10" : "bg-accent/10"
                      }`}
                    >
                      <service.icon
                        className={service.color === "primary" ? "text-primary" : "text-accent"}
                        size={32}
                      />
                    </div>
                    <ArrowUpLeft className="w-6 h-6 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-4">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed text-lg">{service.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`px-4 py-2 text-sm rounded-full font-medium transition-colors ${
                          service.color === "primary"
                            ? "bg-primary/10 text-primary group-hover:bg-primary/20"
                            : "bg-accent/10 text-accent group-hover:bg-accent/20"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
