"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Clock, User, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "./scroll-reveal"
import { type Project, defaultProjects } from "@/lib/projects-data"

const categories = ["الكل", "مشاريع تخرج", "برمجة", "تصميم 3D", "بحوث"]

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("الكل")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        const data = await response.json()
        if (data.success && data.projects.length > 0) {
          setProjects(data.projects)
        }
      } catch (error) {
        // استخدم البيانات الافتراضية في حالة الخطأ
        console.error("Failed to fetch projects:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const filteredProjects = activeCategory === "الكل" ? projects : projects.filter((p) => p.category === activeCategory)

  const handleRequestSimilar = (projectTitle: string) => {
    window.open(`https://t.me/bit_iq8?text=مرحباً، أريد مشروع مشابه لـ: ${encodeURIComponent(projectTitle)}`, "_blank")
    setSelectedProject(null)
  }

  return (
    <section id="projects" className="py-28 px-6 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent text-sm font-semibold tracking-wider uppercase rounded-full mb-4">
              أعمالنا
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground text-balance">
              مشاريع <span className="gradient-text">أنجزناها</span>
            </h2>
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg">
              نماذج من المشاريع التي نفذناها لعملائنا من الطلاب والشركات الناشئة
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <ScrollReveal key={project.id || index} delay={index * 100}>
                <div className="group card-hover glow-border bg-card/80 backdrop-blur-sm border border-border rounded-3xl overflow-hidden">
                  <div className="aspect-video bg-secondary relative overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg?height=400&width=600&query=project"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-full flex items-center gap-2 hover:bg-primary/90 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 font-medium"
                      >
                        عرض التفاصيل
                        <ExternalLink size={18} />
                      </button>
                    </div>
                    {project.status && (
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            project.status === "مكتمل"
                              ? "bg-green-500/90 text-white"
                              : project.status === "قيد التنفيذ"
                                ? "bg-yellow-500/90 text-black"
                                : "bg-blue-500/90 text-white"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
                      {project.category}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{project.title}</h3>
                    <p className="text-muted-foreground mb-6">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1.5 bg-secondary text-muted-foreground text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground text-2xl">{selectedProject?.title}</DialogTitle>
              <DialogDescription className="text-primary font-medium">{selectedProject?.category}</DialogDescription>
            </DialogHeader>

            {selectedProject && (
              <div className="space-y-6">
                <img
                  src={selectedProject.image || "/placeholder.svg?height=400&width=600&query=project"}
                  alt={selectedProject.title}
                  className="w-full aspect-video object-cover rounded-2xl"
                />

                <p className="text-muted-foreground leading-relaxed text-lg">
                  {selectedProject.fullDescription || selectedProject.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary p-5 rounded-2xl flex items-center gap-4">
                    <Clock className="text-primary" size={24} />
                    <div>
                      <div className="text-sm text-muted-foreground">مدة التنفيذ</div>
                      <div className="text-foreground font-semibold">{selectedProject.duration}</div>
                    </div>
                  </div>
                  <div className="bg-secondary p-5 rounded-2xl flex items-center gap-4">
                    <User className="text-accent" size={24} />
                    <div>
                      <div className="text-sm text-muted-foreground">العميل</div>
                      <div className="text-foreground font-semibold">{selectedProject.client}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, i) => (
                    <span key={i} className="px-4 py-2 bg-primary/20 text-primary font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <Button
                  onClick={() => handleRequestSimilar(selectedProject.title)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-semibold"
                >
                  اطلب مشروعاً مشابهاً
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
