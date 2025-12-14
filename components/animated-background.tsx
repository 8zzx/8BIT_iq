"use client"

import { useEffect, useRef, useState } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particles = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 20000)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.2,
        })
      }
    }

    const drawGrid = () => {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.05)"
      ctx.lineWidth = 1

      const gridSize = 80
      const offset = (Date.now() / 150) % gridSize

      for (let x = -gridSize + offset; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = -gridSize + offset; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    const drawParticles = () => {
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`
        ctx.fill()

        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
      })
    }

    const connectParticles = () => {
      const maxDistance = 120
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15
            ctx.beginPath()
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawGrid()
      drawParticles()
      connectParticles()
      animationFrameId = requestAnimationFrame(animate)
    }

    resize()
    createParticles()
    animate()

    const handleResize = () => {
      resize()
      createParticles()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [isClient])

  if (!isClient) return null

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.7 }} />
}
