<template>
  <div class="particles-container">
    <!-- Center Glow Effect -->
    <div class="center-glow"></div>
    <canvas ref="particleCanvas" class="w-full h-full pointer-events-none"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  count: { type: Number, default: 450 }, 
  color: { type: String, default: '4, 193, 143' }, // Hex #04C18F
  speedMult: { type: Number, default: 2.8 }, // Faster spreading speed
  opacity: { type: Number, default: 0.9 }
})

const particleCanvas = ref(null)
let animFrameId = null

function startParticles(canvas) {
  if (!canvas) return null
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  
  let W = 0, H = 0

  function resize() {
    if (!canvas) return
    W = canvas.width = canvas.offsetWidth
    H = canvas.height = canvas.offsetHeight
  }

  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  function createParticle(immediate = false) {
    const angle = Math.random() * Math.PI * 2
    
    // Cluster focus: keep most particles near the center
    const isEdge = Math.random() < 0.2 
    const maxDist = isEdge
      ? Math.hypot(W, H) * (0.6 + Math.random() * 0.4) 
      : Math.hypot(W, H) * (0.15 + Math.random() * 0.25) 

    // Floating, subtle movement
    const speed = (0.05 + Math.random() * 0.15) * props.speedMult
    const size = 0.5 + Math.random() * 1.5
    const life = maxDist / speed
    const delay = immediate ? 0 : Math.random() * 150

    return {
      x: W / 2, y: H / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size,
      life,
      maxLife: life,
      delay,
      age: -delay
    }
  }

  let particles = Array.from({ length: props.count }, (_, index) => createParticle(index < props.count * 0.8)) 

  function draw() {
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, W, H)

    particles.forEach((p, i) => {
      p.age++
      if (p.age < 0) return

      if (p.age > p.maxLife) {
        particles[i] = createParticle(true)
        return
      }

      p.x += p.vx
      p.y += p.vy

      const progress = p.age / p.maxLife
      const alpha = progress < 0.2 ? progress / 0.2 // Soft fade in
        : progress > 0.6 ? (1 - progress) / 0.4 // Soft fade out
          : 1

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${props.color}, ${alpha * props.opacity})`
      ctx.fill()
    })

    animFrameId = requestAnimationFrame(draw)
  }

  draw()
  return () => {
    ro.disconnect()
    cancelAnimationFrame(animFrameId)
  }
}

let stopParticles = null

onMounted(async () => {
  await nextTick()
  if (particleCanvas.value) {
    stopParticles = startParticles(particleCanvas.value)
  }
})

onUnmounted(() => {
  if (stopParticles) stopParticles()
})
</script>

<style scoped>
.particles-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

canvas {
  display: block;
  z-index: 2;
}

.center-glow {
  position: absolute;
  width: 50vw;
  height: 50vw;
  max-width: 600px;
  max-height: 600px;
  background: radial-gradient(circle, rgba(4, 193, 143, 0.4) 0%, transparent 70%);
  filter: blur(40px);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}
</style>
