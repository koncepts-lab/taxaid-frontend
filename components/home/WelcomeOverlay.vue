<template>
  <div v-if="modelValue" class="fixed inset-0 z-[9999] overflow-hidden">
    <!-- Background: Slides Right to Left -->
    <div 
      class="absolute inset-0 z-0 bg-gradient-to-br from-[#003228] via-[#0A5A54] to-[#0E6B60] transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      :style="{ transform: gradientIn ? 'translateX(0)' : 'translateX(100%)' }"
    />

    <div class="welcome-box" :class="[boxIn ? 'welcome-box-in' : '', exitLeft ? 'welcome-box-exit-left' : '']">
      <!-- Particles: Layered behind content (z-0) -->
      <div class="welcome-box-particles z-0 pointer-events-none">
        <canvas ref="boxCanvas" class="particle-canvas"></canvas>
      </div>

      <!-- Content Slot: Layered in front (z-20) and clickable -->
      <div class="relative z-20 w-full" :class="boxIn ? 'pointer-events-auto' : 'pointer-events-none'">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  start: { type: Boolean, default: false },
  particleCount: { type: Number, default: 220 },
  exit: { type: Boolean, default: false }
})

const gradientIn = ref(false)
const boxIn = ref(false)
const exitLeft = ref(false)
const boxCanvas = ref(null)
let stop = null
let rafId = null

function startParticles(canvasEl, count) {
  if (!canvasEl) return () => {}
  const ctx = canvasEl.getContext('2d')
  const DPR = Math.min(window.devicePixelRatio || 1, 2)
  let w = 0, h = 0, particles = []

  const resize = () => {
    const rect = canvasEl.getBoundingClientRect()
    w = rect.width; h = rect.height
    canvasEl.width = w * DPR; canvasEl.height = h * DPR
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
  }

  const makeParticles = () => {
    particles = Array.from({ length: count }).map(() => ({
      x: w / 2 + (Math.random() - 0.5) * (w * 0.7),
      y: h / 2 + (Math.random() - 0.5) * (h * 0.6),
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: 0.7 + Math.random() * 1.5,
      a: 0.1 + Math.random() * 0.35,
      t: Math.random() * 6.28
    }))
  }

  const draw = () => {
    ctx.clearRect(0, 0, w, h)
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
      p.t += 0.04
      ctx.beginPath()
      ctx.fillStyle = `rgba(49,224,200,${p.a * (0.5 + Math.sin(p.t) * 0.5)})`
      ctx.arc(p.x, p.y, p.r, 0, 6.28)
      ctx.fill()
    })
    rafId = requestAnimationFrame(draw)
  }
  resize(); makeParticles(); draw()
  return () => { if (rafId) cancelAnimationFrame(rafId) }
}

watch(() => props.start, async (v) => {
  if (v) {
    gradientIn.value = true
    setTimeout(async () => {
      boxIn.value = true
      await nextTick()
      stop = startParticles(boxCanvas.value, props.particleCount)
    }, 400)
  } else {
    gradientIn.value = false
    boxIn.value = false
    stop?.()
  }
})

watch(() => props.exit, (v) => {
  if (v) {
    exitLeft.value = true
  }
})

onBeforeUnmount(() => stop?.())
</script>

<style scoped>
.welcome-box {
  position: absolute; 
  inset: 0; 
  display: grid; 
  place-items: center;
  opacity: 0; 
  transform: translateX(140px);
  z-index: 20;
  transition: opacity 380ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
}
.welcome-box-in {
  opacity: 1; 
  transform: translateX(0);
}
.welcome-box-exit-left {
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 500ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
}
.welcome-box::before {
  content: ""; 
  position: absolute;
  width: min(720px, calc(100vw - 40px)); 
  height: min(600px, calc(100vh - 60px));
  border-radius: 90px;
  background: radial-gradient(circle at center, rgba(12, 91, 85, 0.35) 0%, rgba(1, 26, 23, 0.95) 100%);
  border: 1px solid rgba(49, 224, 200, 0.15);
  box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(25px); 
  -webkit-backdrop-filter: blur(25px);
  pointer-events: none;
}
.welcome-box-particles {
  position: absolute; 
  width: min(720px, calc(100vw - 40px)); 
  height: min(600px, calc(100vh - 60px));
  border-radius: 90px; 
  overflow: hidden;
}
.particle-canvas { 
  width: 100%; 
  height: 100%; 
  opacity: 0.5; 
}
</style>