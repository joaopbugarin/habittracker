'use client'

import { useEffect, useRef } from 'react'

class Sparkle {
private x: number = 0
private y: number = 0
private size: number = 0
private speed: number = 0
private opacity: number = 0
private maxOpacity: number = 0
private displayWidth: number

constructor(x: number, displayWidth: number) {
  this.displayWidth = displayWidth
  this.reset(x)
}

reset(x: number): void {
  this.x = x
  this.y = 96 - Math.random() * 50 // Use fixed height instead of canvas height
  this.size = 1 + Math.random() * 1.5
  this.speed = 0.5 + Math.random() * 0.8
  this.maxOpacity = 0.6 + Math.random() * 0.4
  this.opacity = this.maxOpacity
}

update(displayHeight: number): void {
  this.y -= this.speed
  this.opacity -= 0.004
  if (this.opacity <= 0) this.reset(Math.random() * this.displayWidth)
}

draw(ctx: CanvasRenderingContext2D): void {
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
private x: number
private height: number
private width: number
private controlPoints: { x: number; y: number }[]
private swayOffset: number
private swaySpeed: number
private color: string
private darkColor: string
private displayWidth: number

constructor(x: number, displayWidth: number) {
  this.displayWidth = displayWidth
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

draw(ctx: CanvasRenderingContext2D, time: number, displayHeight: number): void {
  const sway = Math.sin(time * this.swaySpeed + this.swayOffset) * 12
  
  ctx.beginPath()
  ctx.moveTo(this.x, displayHeight)
  
  this.controlPoints.forEach((point, i) => {
    point.x = this.x + sway * (i / this.controlPoints.length)
  })

  ctx.bezierCurveTo(
    this.controlPoints[1].x, displayHeight - this.height * 0.3,
    this.controlPoints[2].x, displayHeight - this.height * 0.6,
    this.controlPoints[3].x, displayHeight - this.height
  )

  const gradient = ctx.createLinearGradient(
    this.x, displayHeight,
    this.x + sway, displayHeight - this.height
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

    // Get display size
    const displayWidth = window.innerWidth
    const displayHeight = 96

    // Set size with device pixel ratio
    const dpr = window.devicePixelRatio || 1
    canvas.width = displayWidth * dpr
    canvas.height = displayHeight * dpr

    // Scale back down with CSS
    canvas.style.width = `${displayWidth}px`
    canvas.style.height = `${displayHeight}px`

    // Scale context
    ctx.scale(dpr, dpr)

    // Clear and recreate elements
    bladesRef.current = []
    sparklesRef.current = []
    
    // Use displayWidth for calculations
    const numBlades = Math.floor(displayWidth / 2)
    for (let i = 0; i < numBlades; i++) {
      bladesRef.current.push(new GrassBlade(i * 2, displayWidth))
    }

    const numSparkles = Math.floor(displayWidth / 15)
    for (let i = 0; i < numSparkles; i++) {
      sparklesRef.current.push(new Sparkle(Math.random() * displayWidth, displayWidth))
    }
  }

  setCanvasSize()
  window.addEventListener('resize', setCanvasSize)

  let time = 0
  let animationFrameId: number

  const animate = () => {
    if (!ctx || !canvas) return
    
    const displayWidth = window.innerWidth
    const displayHeight = 96
    
    time += 0.01
    ctx.clearRect(0, 0, displayWidth, displayHeight)

    const gradient = ctx.createLinearGradient(0, 0, 0, displayHeight)
    gradient.addColorStop(0, 'rgba(243, 244, 246, 0)')
    gradient.addColorStop(1, 'rgba(243, 244, 246, 0.1)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, displayWidth, displayHeight)

    bladesRef.current.forEach(blade => blade.draw(ctx, time, displayHeight))
    sparklesRef.current.forEach(sparkle => {
      sparkle.update(displayHeight)
      sparkle.draw(ctx)
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
  <div className="sticky -bottom-24 top-[calc(100vh-6rem)] z-10">
    <canvas
      ref={canvasRef}
      className="w-full h-24 pointer-events-none"
    />
  </div>
)
}