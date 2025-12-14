"use client"

import { Target, Lightbulb, Users, Rocket, Award, Clock, Headphones } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

const features = [
  { icon: Award, text: "فريق متخصص من المهندسين والمبرمجين" },
  { icon: Rocket, text: "خبرة واسعة في المشاريع الأكاديمية" },
  { icon: Headphones, text: "دعم فني مستمر حتى بعد التسليم" },
  { icon: Clock, text: "أسعار تنافسية مناسبة للطلاب" },
]

const stats = [
  { icon: Target, title: "رؤيتنا", desc: "أن نكون الخيار الأول لكل طالب هندسة" },
  { icon: Lightbulb, title: "مهمتنا", desc: "تحويل الأفكار إلى مشاريع حقيقية" },
  { icon: Users, title: "فريقنا", desc: "مهندسون ومبرمجون محترفون" },
]

export function AboutSection() {
  return (
    <section id="about" className="py-28 px-6 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <ScrollReveal>
              <div>
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-semibold tracking-wider uppercase rounded-full mb-4">
                  من نحن
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-foreground text-balance leading-tight">
                  نسد الفجوة بين <span className="gradient-text">النظرية والتطبيق</span>
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <p className="text-muted-foreground leading-relaxed text-xl">
                مكتب 8BIT هو مكتب تقني متخصص يهدف إلى مساعدة طلاب الكليات الهندسية، خاصة هندسة الأجهزة الطبية والحاسوب،
                في تحويل أفكارهم ومشاريعهم إلى واقع ملموس.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="text-muted-foreground leading-relaxed text-lg">
                كما نقدم خدماتنا للشركات الناشئة التي تحتاج إلى نماذج أولية (MVP) بجودة عالية وسرعة في التنفيذ.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <ul className="space-y-5">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <feature.icon className="text-accent" size={22} />
                    </div>
                    <span className="text-foreground text-lg">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {stats.map((stat, index) => (
              <ScrollReveal key={index} delay={index * 100} direction={index % 2 === 0 ? "left" : "right"}>
                <div
                  className={`card-hover glow-border bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-8 text-center noise-overlay ${index === 1 || index === 3 ? "mt-10" : ""}`}
                >
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <stat.icon className="text-primary" size={32} />
                    </div>
                    <h3 className="font-bold text-foreground text-xl mb-3">{stat.title}</h3>
                    <p className="text-muted-foreground">{stat.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}

            <ScrollReveal delay={400} direction="up">
              <div className="col-span-2 relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/30 rounded-3xl p-8 text-center group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="text-6xl font-black gradient-text mb-3">8BIT</div>
                  <p className="text-muted-foreground text-lg">حيث تلتقي الأفكار بالتنفيذ</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
