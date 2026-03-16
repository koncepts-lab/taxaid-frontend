<template>
  <div class="particle-background" :class="{ 'is-dark': isDark }">
    <canvas ref="canvas" class="particle-canvas"></canvas>
    <div class="particle-canvas-overlay"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const { isDark } = useTheme()

const canvas = ref(null)
let ctx = null
let particles = []
let animationId = null

class Particle {
  constructor(canvasWidth, canvasHeight, centerX, centerY) {
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * Math.min(canvasWidth, canvasHeight) * 0.4

    this.x = centerX + Math.cos(angle) * distance
    this.y = centerY + Math.sin(angle) * distance
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.size = Math.random() * 2 + 0.5
    this.opacity = Math.random() * 0.5 + 0.1

    this.centerX = centerX
    this.centerY = centerY
    this.maxDistance = Math.min(canvasWidth, canvasHeight) * 0.5
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    const dx = this.x - this.centerX
    const dy = this.y - this.centerY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > this.maxDistance) {
      const angle = Math.atan2(dy, dx)
      this.vx -= Math.cos(angle) * 0.02
      this.vy -= Math.sin(angle) * 0.02
    }
    this.vx *= 0.99
    this.vy *= 0.99
  }

  draw(ctx, isDark) {
    // Particles should be subtle white in dark mode, teal in light mode
    ctx.fillStyle = isDark
      ? `rgba(255, 255, 255, ${this.opacity * 0.6})`
      : `rgba(0, 183, 148, ${this.opacity * 0.8})`
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

const initCanvas = () => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  resizeCanvas()
  animate()
}

const resizeCanvas = () => {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight

  const centerX = canvas.value.width / 2
  const centerY = canvas.value.height / 2

  particles = []
  for (let i = 0; i < 200; i++) {
    particles.push(new Particle(canvas.value.width, canvas.value.height, centerX, centerY))
  }
}

const animate = () => {
  if (!ctx || !canvas.value) return
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  // We removed the background drawing from JS to let CSS handle it more smoothly
  particles.forEach(particle => {
    particle.update()
    particle.draw(ctx, isDark.value)
  })

  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
.particle-background {
  /* 1. FIXED POSITIONING: Starts at the very top of the viewport */
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
  /* Behind content */

  /* 2. FEATHERED MASK: Softly fades the top 15% to hide the line near the header */
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 15%);

  /* Base background color */
  background-color: #f0fdfa;
  transition: background-color 0.5s ease;
}

.is-dark.particle-background {
  background-color: #001a16;
}

.particle-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.particle-canvas-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle,
      #00B794D1 0%,
      transparent 70%);
  pointer-events: none;
}
</style>