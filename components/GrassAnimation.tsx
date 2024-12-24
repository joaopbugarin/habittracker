'use client'

import { useEffect, useRef } from 'react'

// Move classes outside of the effect
class Sparkle {
private x: number = 0
private y: number = 0
private size: number = 0
private speed: number = 0
private opacity: number = 0
private maxOpacity: number = 0
private canvas: HTMLCanvasElement | null = null

constructor(x: number, canvas: HTMLCanvasElement) {
  this.canvas = canvas
  this.reset(x)
}

reset(x: number): void {
  if (!this.canvas) return
  this.x = x
  this.y = this.canvas.height - Math.random() * 50
  this.size = 1 + Math.random() * 1.5
  this.speed = 0.5 + Math.random() * 0.8
  this.maxOpacity = 0.6 + Math.random() * 0.4
  this.opacity = this.maxOpacity
}

update(): void {
  if (!this.canvas) return
  this.y -= this.speed
  this.opacity -= 0.004
  if (this.opacity <= 0) this.reset(Math.random() * this.canvas.width)
}

draw(ctx: CanvasRenderingContext2D): void {
  if (!this.canvas) return
  ctx.beginPath()
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
  
  const glow = ctx.createRadialGradient(
    this.x, this.y, 0,
    this.x, this.y, this.size * 2
  )
  glow.addColorStop(0, `rgba(255, 255, 220, ${this.opacity})`)
  glow.addColorStop(1, 'rgba(255, 255, 220, 0)')
  
  ctx.fillStyle = glow
  ctx.fill()
}
}

class GrassBlade {
private x: number = 0
private height: number = 0
private width: number = 0
private controlPoints: { x: number; y: number }[] = []
private swayOffset: number = 0
private swaySpeed: number = 0
private color: string = ''
private darkColor: string = ''
private canvas: HTMLCanvasElement | null = null

constructor(x: number, canvas: HTMLCanvasElement) {
  this.canvas = canvas
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
  
  const isLightBlade = Math.random() > 0.7
  const hue = 115 + Math.random() * 10
  const saturation = isLightBlade ? 40 + Math.random() * 20 : 30 + Math.random() * 20
  const lightness = isLightBlade ? 45 + Math.random() * 15 : 25 + Math.random() * 15
  this.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`
  this.darkColor = `hsl(${hue}, ${saturation}%, ${lightness - 10}%)`
}

draw(ctx: CanvasRenderingContext2D, time: number): void {
  if (!this.canvas) return
  const sway = Math.sin(time * this.swaySpeed + this.swayOffset) * 12
  
  ctx.beginPath()
  ctx.moveTo(this.x, this.canvas.height)
  
  this.controlPoints.forEach((point, i) => {
    point.x = this.x + sway * (i / this.controlPoints.length)
  })

  ctx.bezierCurveTo(
    this.controlPoints[1].x, this.canvas.height - this.height * 0.3,
    this.controlPoints[2].x, this.canvas.height - this.height * 0.6,
    this.controlPoints[3].x, this.canvas.height - this.height
  )

  const gradient = ctx.createLinearGradient(
    this.x, this.canvas.height,
    this.x + sway, this.canvas.height - this.height
  )
  gradient.addColorStop(0, this.darkColor)
  gradient.addColorStop(1, this.color)

  ctx.lineWidth = this.width
  ctx.strokeStyle = gradient
  ctx.lineCap = 'round'
  ctx.stroke()
}
}

export function GrassAnimation() {
const canvasRef = useRef<HTMLCanvasElement>(null)
const bladesRef = useRef<GrassBlade[]>([])
const sparklesRef = useRef<Sparkle[]>([])

useEffect(() => {
  const canvas = canvasRef.current
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const setCanvasSize = () => {
    if (!canvas) return
    
    // Get device pixel ratio
    const dpr = window.devicePixelRatio || 1
    
    // Get display size
    const displayWidth = window.innerWidth
    const displayHeight = 96
    
    // Set canvas size accounting for DPR
    canvas.width = displayWidth * dpr
    canvas.height = displayHeight * dpr
    
    // Scale canvas back down with CSS
    canvas.style.width = `${displayWidth}px`
    canvas.style.height = `${displayHeight}px`
    
    // Scale the context to account for DPR
    if (ctx) {
      ctx.scale(dpr, dpr)
    }
    
    // Recalculate elements
    bladesRef.current = []
    sparklesRef.current = []
    
    const numBlades = Math.floor(displayWidth / 2) // Use display width, not canvas width
    for (let i = 0; i < numBlades; i++) {
      bladesRef.current.push(new GrassBlade(i * 2, canvas))
    }
    
    const numSparkles = Math.floor(displayWidth / 15)
    for (let i = 0; i < numSparkles; i++) {
      sparklesRef.current.push(new Sparkle(Math.random() * displayWidth, canvas))
    }
    }

  setCanvasSize()
  window.addEventListener('resize', setCanvasSize)

  let time = 0

  const animate = () => {
    if (!ctx || !canvas) return
    time += 0.01
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, 'rgba(243, 244, 246, 0)')
    gradient.addColorStop(1, 'rgba(243, 244, 246, 0.1)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    bladesRef.current.forEach(blade => blade.draw(ctx, time))
    
    sparklesRef.current.forEach(sparkle => {
      sparkle.update()
      sparkle.draw(ctx)
    })

    requestAnimationFrame(animate)
  }

  animate()

  return () => {
    window.removeEventListener('resize', setCanvasSize)
  }
}, [])

return (
  <div className="sticky -bottom-24 top-[calc(100vh-6rem)] z-10">
    <canvas
    ref={canvasRef}
    className="w-full h-24 pointer-events-none"
    style={{ 
      imageRendering: '-webkit-optimize-contrast', // Use only one of these
    }}
    />
  </div>
  )
}