<template>
    <NuxtLayout name="dashboard">
        <!-- Centre particle canvas — outside bg div so it's never covered -->
        <div class="fixed inset-0 pointer-events-none" style="z-index: 1">
            <canvas ref="particleCanvas" class="w-full h-full"></canvas>
        </div>

        <div class="font-sans relative w-full min-h-full transition-all duration-300"
            style="z-index: 2"
            :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

            <div class="mx-auto max-w-full lg:px-8 md:px-6 px-4 py-8 relative z-10">
                
                <AppointmentHeader class="mb-8" />

                <AppointmentStats />

                <AppointmentBanner />

                <AppointmentViewSwitcher />

                <div class="flex flex-col min-h-[500px] mb-12">
                    <template v-if="appointments.length === 0">
                        <AppointmentEmptyState @schedule="isModalOpen = true" />
                    </template>
                    <template v-else>
                        <AppointmentCalendarView v-if="activeView === 'calendar'" :data="appointments" />
                        <AppointmentTable v-else :data="appointments" />
                    </template>
                </div>

                <!-- Schedule Modal -->
                <AppointmentScheduleModal v-model="isModalOpen" @confirm="addAppointment" />

               

            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const isModalOpen = useState('isScheduleModalOpen', () => false)
const activeView = useState('appointment_active_view', () => 'calendar')

const { appointments: dynamicAppointments, loading, error } = useAppointmentsPage()
const appointments = useState('appointments_list', () => [])

// Initialize state from dynamic data when ready
watchEffect(() => {
  if (dynamicAppointments.value?.length > 0 && appointments.value.length === 0) {
    appointments.value = [...dynamicAppointments.value]
  }
})

const addAppointment = (newApp) => {
  appointments.value.push(newApp)
}

useHead({
  title: 'Appointments | Taxaid.AI',
  meta: [
    { name: 'description', content: 'Manage your appointments and consultation hours with Taxaid.AI' }
  ]
})

/** Particle engine — same as onboarding page */
const particleCanvas = ref(null)
let rafs = []

function initParticles(canvas, count, color, speed = 1) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let w, h, pts = []

  const res = () => {
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = w * 2
    canvas.height = h * 2
    ctx.scale(2, 2)
  }
  res()
  window.addEventListener('resize', res)

  const cX = w / 2, cY = h / 2
  const maxD = Math.min(w, h) * 0.5

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * maxD * 0.8
    pts.push({
      x: cX + Math.cos(angle) * distance,
      y: cY + Math.sin(angle) * distance,
      vx: (Math.random() - 0.5) * speed * 0.4,
      vy: (Math.random() - 0.5) * speed * 0.4,
      r: Math.random() * 2.5 + 1,
      a: Math.random() * 0.5 + 0.2,
      t: Math.random() * 10,
      angle,
      dist: distance
    })
  }

  const anim = () => {
    ctx.clearRect(0, 0, w, h)

    // Subtle radial glow in centre
    const grad = ctx.createRadialGradient(cX, cY, 0, cX, cY, maxD)
    grad.addColorStop(0, `rgba(${color}, 0.15)`)
    grad.addColorStop(0.5, `rgba(${color}, 0.05)`)
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.t += 0.02
      const dx = p.x - cX, dy = p.y - cY, d = Math.sqrt(dx * dx + dy * dy)
      if (d > maxD) {
        const ang = Math.atan2(dy, dx)
        p.vx -= Math.cos(ang) * 0.015
        p.vy -= Math.sin(ang) * 0.015
      }
      p.vx *= 0.995; p.vy *= 0.995
      p.vx += (Math.random() - 0.5) * 0.01
      p.vy += (Math.random() - 0.5) * 0.01

      ctx.beginPath()
      ctx.fillStyle = `rgba(${color}, ${p.a * (0.4 + Math.sin(p.t) * 0.3)})`
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
    })
    rafs.push(requestAnimationFrame(anim))
  }
  anim()
}

onMounted(() => {
  // Use a darker teal in light mode so particles are visible on white bg
  const color = isDark.value ? '49, 224, 200' : '0, 150, 120'
  const opacity = isDark.value ? 0.4 : 0.7
  initParticles(particleCanvas.value, 250, color, opacity)
})

onBeforeUnmount(() => {
  rafs.forEach(cancelAnimationFrame)
})
</script>

<style scoped>
/* Page transition or local styles */
</style>
