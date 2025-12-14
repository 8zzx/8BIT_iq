"use client"

import { ScrollReveal } from "./scroll-reveal"

const technologies = [
  { name: "Arduino", category: "Hardware" },
  { name: "ESP32", category: "Hardware" },
  { name: "Raspberry Pi", category: "Hardware" },
  { name: "Python", category: "Software" },
  { name: "JavaScript", category: "Software" },
  { name: "React", category: "Software" },
  { name: "Next.js", category: "Software" },
  { name: "Node.js", category: "Software" },
  { name: "SolidWorks", category: "3D" },
  { name: "Fusion 360", category: "3D" },
  { name: "Blender", category: "3D" },
  { name: "AutoCAD", category: "3D" },
]

export function TechStackSection() {
  return (
    <section className="py-20 px-6 overflow-hidden">
      <div className="container mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-semibold tracking-wider uppercase rounded-full mb-4">
              التقنيات
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              أدوات <span className="gradient-text">نتقنها</span>
            </h2>
          </div>
        </ScrollReveal>
      </div>

      {/* Infinite scroll marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-l from-transparent to-background z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-r from-transparent to-background z-10" />

        <div className="flex gap-6 marquee-animation">
          {[...technologies, ...technologies].map((tech, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-8 py-4 bg-card/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/50 transition-colors cursor-default group"
            >
              <span className="text-foreground font-semibold text-lg group-hover:text-primary transition-colors">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
