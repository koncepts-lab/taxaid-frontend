<template>
  <footer class="p-[15px] lg:pt-8 lg:pb-8 lg:px-8 transition-colors duration-300"
    :class="[isDark ? 'text-white/30' : 'text-[#666666]/60']">
    <div class="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-[12px] font-normal px-2">
      <div>
        {{ currentLang === 'ar' ? 'جميع الحقوق محفوظة @2025' : 'Copyright Reserved @2025' }}
      </div>
      <div>
        {{ currentLang === 'ar' ? 'آخر مزامنة: ' : 'Last Sync: ' }}{{ lastSync }}
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

const currentLang = useState('currentLang')
const { isDark } = useTheme()
const displayFormatCookie = useCookie('display_format')

const nowInZone = ref(readCurrentTime())
let timer = null

function readCurrentTime() {
  try {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
      timeZone: orgZone(),
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date()).map(p => [p.type, p.value]))

    if (parts.year && parts.month && parts.day && parts.hour && parts.minute) {
      return {
        date: `${parts.year}-${parts.month}-${parts.day}`,
        time: `${parts.hour}:${parts.minute}`,
      }
    }
  } catch {}

  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  }
}

onMounted(() => {
  nowInZone.value = readCurrentTime()
  timer = setInterval(() => {
    nowInZone.value = readCurrentTime()
  }, 15000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const timezoneCookie = useCookie('timezone')

const lastSync = computed(() => {
  try {
    void displayFormatCookie?.value
    void timezoneCookie?.value
    const d = formatDisplayDate(nowInZone.value?.date)
    const t = formatDisplayTime(nowInZone.value?.time)
    const zone = orgZone()
    const tzLabel = zoneOffsetLabel(zone)
    const suffix = tzLabel ? ` ${tzLabel}` : ''

    if (d && t) return `${d}, ${t}${suffix}`
    if (d) return `${d}${suffix}`
  } catch {}

  return new Date().toLocaleString()
})
</script>
