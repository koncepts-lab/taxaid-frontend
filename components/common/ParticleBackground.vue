<template>
  <div class="particle-background" :class="{ 'is-dark': isDark }">
    <!-- Center Glow Overlay -->
    <div class="center-glow-overlay"></div>
    <canvas ref="canvas" class="particle-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  delay: { type: Number, default: 0 }
})

const { isDark } = useTheme()

const canvas = ref(null)
let ctx = null
let animationId = null
let timeoutId = null
let particles = []

class SpreadingParticle {
  constructor(W, H) {
    this.W = W
    this.H = H
    this.reset(true)
  }

  reset(immediate = false) {
    this.x = Math.random() * this.W
    this.y = Math.random() * this.H
    
    // Smooth random drifting velocity
    this.vx = (Math.random() - 0.5) * 1.5
    this.vy = (Math.random() - 0.5) * 1.5
    
    this.size = 0.8 + Math.random() * 1.5
    this.maxLife = 200 + Math.random() * 300
    this.age = immediate ? Math.random() * this.maxLife : 0
  }

  update() {
    this.age++
    if (this.age > this.maxLife) {
      this.reset()
      return
    }

    this.x += this.vx
    this.y += this.vy

    // Wrap around screen boundaries for continuous effect
    if (this.x < 0) this.x = this.W
    if (this.x > this.W) this.x = 0
    if (this.y < 0) this.y = this.H
    if (this.y > this.H) this.y = 0
  }

  draw(ctx, isDark) {
    if (this.age < 0) return

    const progress = this.age / this.maxLife
    const alpha = progress < 0.1 ? progress / 0.1
      : progress > 0.7 ? (1 - progress) / 0.3
        : 1

    // Use #04C18F (4, 193, 143)
    ctx.fillStyle = isDark
      ? `rgba(255, 255, 255, ${alpha * 0.4})` // Subtle white in dark mode
      : `rgba(4, 193, 143, ${alpha * 0.7})`
      
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

  particles = []
  const count = 100 // Reduced density for a cleaner look
  for (let i = 0; i < count; i++) {
    const p = new SpreadingParticle(canvas.value.width, canvas.value.height)
    // Randomize initial age to fill the screen immediately
    p.age = Math.random() * p.maxLife
    particles.push(p)
  }
}

const animate = () => {
  if (!ctx || !canvas.value) return
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  particles.forEach(p => {
    p.update()
    p.draw(ctx, isDark.value)
  })

  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  if (props.delay > 0) {
    timeoutId = setTimeout(() => {
      initCanvas()
    }, props.delay)
  } else {
    initCanvas()
  }
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
.particle-background {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  background: transparent;
}

.particle-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.center-glow-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120vw;
  height: 120vw;
  max-width: 1200px;
  max-height: 1200px;
  background: radial-gradient(circle, rgba(4, 193, 143, 0.12) 0%, transparent 75%);
  filter: blur(80px);
  pointer-events: none;
  z-index: -1;
}
</style>