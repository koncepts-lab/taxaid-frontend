<template>
  <div class="mt-6 rounded-2xl border p-6"
       :class="isDark ? 'bg-[#11111180] border-[#535353]' : 'bg-white border-[#E9F3F0]'">
    <h3 class="text-[16px] font-medium mb-1" :class="isDark ? 'text-white' : 'text-[#013E32]'">
      {{ currentLang === 'ar' ? 'تنسيق التاريخ والوقت' : 'Date & time format' }}
    </h3>
    <p class="text-sm mb-4" :class="isDark ? 'text-white/60' : 'text-black/50'">
      {{ currentLang === 'ar' ? 'يظهر هذا التنسيق في جميع الصفحات لحسابك فقط.' : 'How dates and times are shown across the app, for your account only.' }}
    </p>

    <div class="flex flex-wrap items-end gap-6">
      <div>
        <label class="block text-[13px] font-medium mb-1" :class="isDark ? 'text-white/80' : 'text-[#111]'">{{ currentLang === 'ar' ? 'التاريخ' : 'Date' }}</label>
        <CommonSelectDropdown mode="select" v-model="dateStyle" :options="dateOptions" @update:modelValue="save" />
      </div>
      <div>
        <label class="block text-[13px] font-medium mb-1" :class="isDark ? 'text-white/80' : 'text-[#111]'">{{ currentLang === 'ar' ? 'الوقت' : 'Time' }}</label>
        <div class="flex rounded-full border border-[#04C18F33] overflow-hidden text-sm">
          <button v-for="h in [12, 24]" :key="h" type="button" @click="setHours(h)"
                  class="px-4 py-1.5 transition-colors cursor-pointer"
                  :class="hours === h ? 'bg-[#82FFE0] text-[#0A0A0A]' : (isDark ? 'text-white/70' : 'text-gray-500')">{{ h }}h</button>
        </div>
      </div>
      <p class="text-sm pb-1.5" :class="isDark ? 'text-[#6FDBBF]' : 'text-[#00896F]'">
        {{ preview }}
      </p>
    </div>
    <p v-if="error" class="text-sm text-red-500 mt-3">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const cookie = useCookie('display_format')
const error = ref('')

const dateStyle = ref(displayFormat().date)
const hours = ref<12 | 24>(displayFormat().hours)

const nowInZone = ref(readNow())
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => { timer = setInterval(() => { nowInZone.value = readNow() }, 15000) })
onBeforeUnmount(() => { if (timer) clearInterval(timer) })

function readNow() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: orgZone(), year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date()).map(p => [p.type, p.value]))

  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` }
}

const dateOptions = computed(() => DISPLAY_DATE_FORMATS.map(f => ({ value: f, label: formatDisplayDate(nowInZone.value.date, f) })))

const preview = computed(() => {
  void cookie.value
  return `${formatDisplayDate(nowInZone.value.date)} · ${formatDisplayTime(nowInZone.value.time)}`
})

async function persist(value: string) {
  const previous = cookie.value
  cookie.value = value
  error.value = ''

  try {
    await useApi('/profile/display-format', { method: 'PUT', body: { display_format: value } })
  } catch {
    cookie.value = previous
    error.value = currentLang.value === 'ar' ? 'تعذر حفظ التنسيق.' : 'Could not save the format.'
  }
}

const save = () => persist(`${dateStyle.value}/${hours.value}`)

function setHours(h: 12 | 24) {
  hours.value = h
  persist(`${dateStyle.value}/${h}`)
}
</script>
