<template>
  <div v-if="data?.can_edit" class="border rounded-[16px] shadow-sm overflow-hidden" :class="isDark ? 'bg-[#002E26] border-teal-950/40' : 'bg-white border-gray-100'"
    :dir="isAr ? 'rtl' : 'ltr'">
    <div class="p-6 pb-2">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 bg-[#E8FCF2] rounded-[10px] flex items-center justify-center text-[#00835D] shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
        </div>
        <h2 class="text-[18px] font-normal" :class="isDark ? 'text-white' : 'text-[#101828]'">{{ isAr ? 'المنطقة الزمنية' : 'Time Zone' }}</h2>
      </div>
    </div>

    <div class="p-6 pt-4">
      <CommonTimezonePanel :data="data" :editable="!!data?.can_edit" :busy="busy" :error="error" @save="onSave" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const isAr = computed(() => currentLang.value === 'ar')

const { errorMessage, getTimezone, setTimezone } = useTimezoneSettings()

const data = ref(null)
const busy = ref(false)
const error = ref('')

const load = async () => {
  try {
    const res = await getTimezone()
    data.value = res?.data ?? null
  } catch (e) {
    error.value = errorMessage(e)
  }
}

const onSave = async (payload) => {
  busy.value = true
  error.value = ''
  try {
    const res = await setTimezone(payload)
    data.value = res?.data ?? data.value

    const mine = data.value?.tenants?.find((tenant) => tenant.is_current)
    if (mine?.effective) useCookie('timezone').value = mine.effective
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    busy.value = false
  }
}

onMounted(load)
</script>
