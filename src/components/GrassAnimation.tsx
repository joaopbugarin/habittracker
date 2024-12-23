'use client'

import { useEffect, useRef } from 'react'

export function GrassAnimation() {
const canvasRef = useRef<HTMLCanvasElement>(null)

useEffect(() => {
  const canvas = canvasRef.current
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const setCanvasSize = () => {
    canvas.width = window.innerWidth
    canvas.height = 120 // Increased height for fluffier grass
  }

  setCanvasSize()
  window.addEventListener('resize', setCanvasSize)

  // Sparkle class for the rising light effects
  class Sparkle {
    x: number
    y: number
    size: number
    speed: number
    opacity: number
    maxOpacity: number
  
    constructor(x: number) {
      this.reset(x)
    }
  
    reset(x: number) {
      this.x = x
      this.y = canvas.height - Math.random() * 50
      this.size = 1 + Math.random() * 1.5 // Bigger sparkles
      this.speed = 0.5 + Math.random() * 0.8 // Faster movement
      this.maxOpacity = 0.6 + Math.random() * 0.4 // Higher max opacity
      this.opacity = this.maxOpacity
    }
  
    update() {
      this.y -= this.speed
      this.opacity -= 0.004 // Slower fade
      if (this.opacity <= 0) this.reset(Math.random() * canvas.width)
    }
  
    draw() {
      if (!ctx) return
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      
      // Add glow effect
      const glow = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size * 2
      );
      glow.addColorStop(0, `rgba(255, 255, 220, ${this.opacity})`);
      glow.addColorStop(1, 'rgba(255, 255, 220, 0)');
      
      ctx.fillStyle = glow;
      ctx.fill();
    }
  }

  
  // Grass blade class with updated properties
  class GrassBlade {
    x: number
    height: number
    width: number
    controlPoints: { x: number; y: number }[]
    swayOffset: number
    swaySpeed: number
    color: string
    darkColor: string

    constructor(x: number) {
        this.x = x
        this.height = 40 + Math.random() * 50
        this.width = 1.5 + Math.random() * 2.5
        this.controlPoints = [
          { x: 0, y: 0 },
          { x: 0, y: this.height * 0.3 },
          { x: 0, y: this.height * 0.6 },
          { x: 0, y: this.height }
        ]
        this.swayOffset = Math.random() * Math.PI * 2
        this.swaySpeed = 0.2 + Math.random() * 0.4
        
        // Lighter, more varied greens
        const isLightBlade = Math.random() > 0.7; // 30% chance of being a light blade
        const hue = 115 + Math.random() * 10;
        const saturation = isLightBlade ? 40 + Math.random() * 20 : 30 + Math.random() * 20;
        const lightness = isLightBlade ? 45 + Math.random() * 15 : 25 + Math.random() * 15;
        this.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`
        this.darkColor = `hsl(${hue}, ${saturation}%, ${lightness - 10}%)`
    }

    draw(time: number) {
      if (!ctx) return

      const sway = Math.sin(time * this.swaySpeed + this.swayOffset) * 12
      
      ctx.beginPath()
      ctx.moveTo(this.x, canvas.height)
      
      // Create multiple curve points for more natural movement
      this.controlPoints.forEach((point, i) => {
        point.x = this.x + sway * (i / this.controlPoints.length)
      })

      // Draw main blade
      ctx.bezierCurveTo(
        this.controlPoints[1].x, canvas.height - this.height * 0.3,
        this.controlPoints[2].x, canvas.height - this.height * 0.6,
        this.controlPoints[3].x, canvas.height - this.height
      )

      // Create gradient for each blade
      const gradient = ctx.createLinearGradient(
        this.x, canvas.height,
        this.x + sway, canvas.height - this.height
      )
      gradient.addColorStop(0, this.darkColor)
      gradient.addColorStop(1, this.color)

      ctx.lineWidth = this.width
      ctx.strokeStyle = gradient
      ctx.lineCap = 'round'
      ctx.stroke()
    }
  }

  // Create grass blades (more densely packed)
  const blades: GrassBlade[] = []
  const numBlades = Math.floor(canvas.width / 2) // One blade every 2 pixels
  
  for (let i = 0; i < numBlades; i++) {
    blades.push(new GrassBlade(i * 2))
  }

  // Create sparkles
const sparkles: Sparkle[] = []
const numSparkles = 75 // Increased number of sparkles

for (let i = 0; i < numSparkles; i++) {
  sparkles.push(new Sparkle(Math.random() * canvas.width))
}
  
  for (let i = 0; i < numSparkles; i++) {
    sparkles.push(new Sparkle(Math.random() * canvas.width))
  }

  let animationFrameId: number
  let time = 0

  const animate = () => {
    time += 0.01
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background gradient matching page background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, 'rgba(243, 244, 246, 0)') // Matches bg-gray-100
    gradient.addColorStop(1, 'rgba(243, 244, 246, 0.1)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grass (back to front for better layering)
    blades.forEach(blade => blade.draw(time))
    
    // Draw sparkles
    sparkles.forEach(sparkle => {
      sparkle.update()
      sparkle.draw()
    })

    animationFrameId = requestAnimationFrame(animate)
  }

  animate()

  return () => {
    window.removeEventListener('resize', setCanvasSize)
    cancelAnimationFrame(animationFrameId)
  }
}, [])

return (
  <canvas
    ref={canvasRef}
    className="fixed bottom-0 left-0 w-full pointer-events-none"
    style={{ zIndex: 10 }}
  />
)
}