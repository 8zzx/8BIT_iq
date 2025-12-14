import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { AboutSection } from "@/components/about-section"
import { TechStackSection } from "@/components/tech-stack-section"
import { ProjectsSection } from "@/components/projects-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { TelegramButton } from "@/components/telegram-button"
import { AnimatedBackground } from "@/components/animated-background"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <AnimatedBackground />
      <Header />
      <HeroSection />
      <ServicesSection />
      <TechStackSection />
      <AboutSection />
      <ProjectsSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <TelegramButton />
      <Toaster />
    </main>
  )
}
