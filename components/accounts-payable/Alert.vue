<template>
  <div v-if="show"
    class="flex items-center justify-between lg:px-6 px-4 py-4 rounded-xl mb-6 transition-all duration-300"
    :style="isDark ? 'background: #00141080; border: 0.8px solid #F9AF4D80' : ''"
    :class="isDark ? '' : 'bg-[#FFF4E5] border border-[#FF990022]'">
    <div class="flex items-center gap-3">
      <div class="lg:w-10 lg:h-10 w-8 h-8 rounded-full flex items-center justify-center"
        :class="isDark ? '' : 'bg-[#FF990011]'">
        <svg width="30" height="" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 9V11M12 15H12.01M5.07001 19H18.93C20.47 19 21.43 17.33 20.66 16L13.73 4C12.96 2.67 11.04 2.67 10.27 4L3.34001 16C2.57001 17.33 3.53001 19 5.07001 19Z"
            :stroke="isDark ? '#D08700' : '#FF9900'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div>
        <h4 class="lg:text-base text-sm font-normal" :class="isDark ? 'text-[#FFCD9D]' : 'text-[#BB4D00]'">
          {{ currentLang === 'ar' ? 'تنبيه بعدم تطابق البيانات' : 'Data Mismatch Alert' }}
        </h4>
        <p class="lg:text-sm text-xs font-normal" :class="isDark ? 'text-[#D08700]' : 'text-[#BB4D00]'">
          {{ currentLang === 'ar' ?
            'إجمالي حسابات الدفع لا يتطابق مع رصيد الأستاذ العام - يرجى تصحيحه في نظام تخطيط موارد المؤسسات الخاص بك.' :
            'AP total doesn\'t match ledger balance — please correct it in your ERP.' }}
        </p>
      </div>
    </div>
    <button @click="dismiss" class="p-2 transition-opacity hover:opacity-100 opacity-60">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { apActiveDate } from '~/composables/cards/useAccountsPayable'
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

// Shown only when the backend AP-vs-ledger check reports a real mismatch.
// POST /verify/sundry-creditors answers 200 on match and 422 on mismatch,
// so the mismatch case lands in the catch block.
const show = ref(false)
const dismissed = ref(false)

const runCheck = async (date) => {
  if (!date) return
  try {
    await useApi('/verify/sundry-creditors', { method: 'POST', body: { date } })
    show.value = false
  } catch (err) {
    show.value = !dismissed.value && err?.data?.status === 'mismatch'
  }
}

watch(apActiveDate, (d) => { dismissed.value = false; runCheck(d) }, { immediate: true })

const dismiss = () => { dismissed.value = true; show.value = false }
</script>
