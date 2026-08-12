<template>
  <!--
    Full-bleed "finished / waiting" screen shown on /onboarding for verify / pending_review /
    implementation / post-wizard-submit states. Content sits directly on the full-screen
    gradient — no boxed card.
  -->
  <div v-if="modelValue" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden bg-[#002B23]">
    <div class="absolute inset-0 pointer-events-none">
      <canvas ref="canvasEl" class="w-full h-full"></canvas>
    </div>

    <div class="relative z-10 flex flex-col items-center text-center px-8 sm:px-12" :class="{ 'content-in': boxIn }">
      <div class="relative mb-8 md:mb-12 flex items-center justify-center">
        <div class="absolute w-[200px] h-[200px] md:w-[380px] md:h-[380px] bg-[#00B794D1] rounded-full blur-[70px] md:blur-[90px] animate-pulse-slow"></div>
        <img src="/images/icon.png" class="relative z-10 w-28 h-28 md:w-44 md:h-44 object-contain drop-shadow-[0_0_30px_rgba(4,193,143,0.5)]" alt="" />
      </div>

      <h2 class="text-white text-lg md:text-2xl font-light leading-relaxed max-w-2xl mb-10 md:mb-14 px-4">
        {{ title }}
      </h2>

      <button class="finish-btn" @click="$emit('action')">
        {{ buttonLabel }}
        <span class="font-bold mx-1" v-if="!rtl">→</span>
        <span class="font-bold mx-1" v-if="rtl">←</span>
      </button>

      <button v-if="showResend" class="mt-4 text-white/60 hover:text-white text-sm underline" :disabled="resending" @click="$emit('resend')">
        {{ resending ? '…' : resendLabel }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  buttonLabel: { type: String, default: '' },
  showResend: { type: Boolean, default: false },
  resending: { type: Boolean, default: false },
  resendLabel: { type: String, default: '' },
  rtl: { type: Boolean, default: false },
})
defineEmits(['action', 'resend'])

const canvasEl = ref(null)
const boxIn = ref(false)
let stopParticles = null
let rafId = null

function startParticles(canvas) {
  const ctx = canvas.getContext('2d')
  const DPR = Math.min(window.devicePixelRatio || 1, 2)
  let w = 0, h = 0, particles = []

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    w = rect.width; h = rect.height
    canvas.width = w * DPR; canvas.height = h * DPR
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
  }
  const makeParticles = () => {
    particles = Array.from({ length: 220 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 0.7 + Math.random() * 1.5,
      a: 0.1 + Math.random() * 0.35,
      t: Math.random() * 6.28,
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

watch(() => props.modelValue, async (v) => {
  if (v) {
    await nextTick()
    boxIn.value = true
    await nextTick()
    if (canvasEl.value) stopParticles = startParticles(canvasEl.value)
  } else {
    boxIn.value = false
    stopParticles?.()
  }
}, { immediate: true })

onBeforeUnmount(() => stopParticles?.())
</script>

<style scoped>
.content-in { animation: fadeIn 1s ease forwards; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-pulse-slow { animation: pulse-slow 4s infinite; }
@keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } }

.finish-btn {
  width: 100%;
  max-width: 320px;
  height: 54px;
  border-radius: 999px;
  color: white;
  font-weight: 500;
  font-size: 18px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #00C79F 0%, #0A6B59 57.14%, #175C50 100%);
  background-size: 200% auto;
  background-position: 0% 0%;
  cursor: pointer;
  transition: background-position 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease;
}
.finish-btn:hover {
  background-position: 100% 0%;
  transform: translateY(-2px);
}
</style>
