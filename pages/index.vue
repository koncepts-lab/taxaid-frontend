<template>
  <div class="relative w-screen h-screen overflow-hidden bg-white">
    <!-- White Screen (initial) -->
    <div
      class="absolute inset-0 bg-white transition-opacity duration-700 z-30"
      :class="whiteFade ? 'opacity-0' : 'opacity-100'"
    />

    <!-- Full Gradient Layer (revealed by bubble animation) -->
    <div
      class="absolute inset-0 z-10 gradient-layer"
      :class="bubbleGrow ? 'gradient-layer--reveal' : ''"
      aria-hidden="true"
    />

    <!-- Logo Video -->
<div
  class="absolute inset-0 flex items-center justify-center transition-opacity duration-700 z-40"
  :class="showLogo ? 'opacity-100' : 'opacity-0'"
>
  <video
    src="/videos/splash-logo.webm"
    class="w-[700px] max-w-full h-auto"
    autoplay
    muted
    playsinline
  />
</div>


  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue'

const whiteFade = ref(false)
const bubbleGrow = ref(false)
const showLogo = ref(false)
const videoRef = ref(null)

const { isAuthenticated } = useAuth()

onMounted(async () => {
  const WHITE_TIME = 600
  const START_BUBBLE_AFTER = 150
  const BUBBLE_DURATION = 6000 // match CSS
  const LOGO_HOLD = 100       // 8 sec

  // Start loading video ASAP (even before showing it)
  queueMicrotask(() => {
    tryPlay()
    attachVideoReady()
  })

  await sleep(WHITE_TIME)
  whiteFade.value = true

  await sleep(START_BUBBLE_AFTER)
  bubbleGrow.value = true

  // show logo as soon as video has first frame
  await waitForVideoReady(2500) // max wait 2.5s (then show anyway)
  showLogo.value = true

  // wait for bubble to finish
  await sleep(BUBBLE_DURATION)

  // keep logo for 8s
  await sleep(LOGO_HOLD)

  if (isAuthenticated.value) {
    navigateTo('/dashboard')
  } else {
    navigateTo('/home')
  }
})

function attachVideoReady() {
  const v = videoRef.value
  if (!v) return
  // If already loaded
  if (v.readyState >= 2) return
  // Ensure event can fire
  v.addEventListener('loadeddata', () => {}, { once: true })
}

function tryPlay() {
  const v = videoRef.value
  if (!v) return
  v.play?.().catch(() => {
    // muted+autoplay generally works; ignore if browser delays
  })
}

function waitForVideoReady(timeoutMs) {
  const v = videoRef.value
  if (!v) return Promise.resolve()

  // readyState 2 = HAVE_CURRENT_DATA (first frame available)
  if (v.readyState >= 2) return Promise.resolve()

  return new Promise((resolve) => {
    const done = () => resolve()
    const t = setTimeout(() => {
      v.removeEventListener('loadeddata', onReady)
      resolve()
    }, timeoutMs)

    const onReady = () => {
      clearTimeout(t)
      resolve()
    }

    v.addEventListener('loadeddata', onReady, { once: true })
  })
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}
</script>



<style scoped>
.gradient-layer {
  background-image: url('/images/splash-gradient.jpg');
  background-size: cover;
  background-position: center;

  clip-path: circle(0% at 50% 100%);
  transition: clip-path 6000ms cubic-bezier(0.15, 0.85, 0.15, 1);
}

.gradient-layer--reveal {
  clip-path: circle(180% at 50% 100%);
}


</style>
