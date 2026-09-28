<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background-color: rgba(0,0,0,0.5);" @click.self="tryClose">
      <div class="w-full max-w-[480px] h-[560px] rounded-2xl flex flex-col overflow-hidden transition-colors"
        :class="isDark ? 'bg-[#00201A] border border-red-950/40' : 'bg-white border border-red-100'">

        <!-- header -->
        <div class="flex items-center justify-between px-6 py-4 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
          <span class="text-sm font-medium" :class="isDark ? 'text-white/70' : 'text-gray-500'">
            {{ stepLabel }}
          </span>
          <button @click="tryClose" class="text-lg leading-none opacity-60 hover:opacity-100" :class="isDark ? 'text-white' : 'text-gray-500'">&times;</button>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-6">
          <AccountDeletionStepWarning v-if="step === 0" :is-dark="isDark" :current-lang="currentLang" @continue="step = 1" />
          <AccountDeletionStepReason v-else-if="step === 1" :is-dark="isDark" :current-lang="currentLang" :question="reasonQuestion" :answers="answers" />
          <AccountDeletionStepImprove v-else-if="step === 2" :is-dark="isDark" :current-lang="currentLang" :question="improveQuestion" :answers="answers" />
          <AccountDeletionStepGeneral v-else-if="step === 3" :is-dark="isDark" :current-lang="currentLang" :question="generalQuestion" :answers="answers" />

          <template v-else-if="step === 4">
            <AccountDeletionStepConfirm :is-dark="isDark" :current-lang="currentLang" v-model="confirmText" />
            <div v-if="errorMessage" class="mt-4 p-3.5 rounded-xl text-sm border" :class="isDark ? 'bg-red-950/20 border-red-900/50 text-red-300' : 'bg-red-50 border-red-100 text-red-800'">
              {{ errorMessage }}
            </div>
          </template>

          <!-- STEP 5: done -->
          <div v-else-if="step === 5" class="flex flex-col items-center text-center pt-8">
            <div class="w-14 h-14 rounded-full flex items-center justify-center mb-4" :class="isDark ? 'bg-emerald-950 text-emerald-300' : 'bg-emerald-50 text-emerald-600'">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 class="text-[18px] font-medium mb-2" :class="isDark ? 'text-white' : 'text-[#013E32]'">
              {{ currentLang === 'ar' ? 'تم استلام طلبك' : 'Request received' }}
            </h2>
            <p class="text-sm" :class="isDark ? 'text-white/60' : 'text-gray-500'">
              {{ currentLang === 'ar' ? 'تم استلام طلب حذف حسابك. تم تسجيل خروجك.' : 'Your account deletion request has been received. You have been logged out.' }}
            </p>
          </div>
        </div>

        <!-- footer nav -->
        <div v-if="step >= 1 && step <= 4" class="flex items-center justify-between px-6 py-4 border-t" :class="isDark ? 'border-white/10' : 'border-gray-100'">
          <button @click="step--" class="text-sm font-medium opacity-70 hover:opacity-100" :class="isDark ? 'text-white' : 'text-gray-600'">
            {{ currentLang === 'ar' ? 'رجوع' : 'Back' }}
          </button>

          <div class="flex items-center gap-3">
            <button v-if="step < 4" @click="step++" class="text-sm font-medium opacity-70 hover:opacity-100" :class="isDark ? 'text-white' : 'text-gray-600'">
              {{ currentLang === 'ar' ? 'تخطي' : 'Skip' }}
            </button>
            <button v-if="step < 4" @click="step++"
              class="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all"
              style="background-color: #00896F;">
              {{ currentLang === 'ar' ? 'التالي' : 'Next' }}
            </button>
            <button v-else @click="submit" :disabled="confirmText !== 'DELETE' || submitting"
              class="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style="background-color: #DC2626;">
              {{ currentLang === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({ open: { type: Boolean, default: false } })
const emit = defineEmits(['close', 'deleted'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const step = ref(0)

const reasons = ref([])
const answers = reactive({ reason: [], reason_other: '', improve_points: [], improve_freetext: '', general_freetext: '' })
const confirmText = ref('')
const submitting = ref(false)
const errorMessage = ref('')

const reasonQuestion = computed(() => reasons.value.find(r => r.key === 'reason'))
const improveQuestion = computed(() => reasons.value.find(r => r.key === 'improve_freetext'))
const generalQuestion = computed(() => reasons.value.find(r => r.key === 'general_freetext'))

const stepLabels = computed(() => currentLang.value === 'ar'
  ? ['تحذير', 'سبب المغادرة', 'التحسين', 'تعليق عام', 'تأكيد', '']
  : ['Warning', 'Reason for leaving', 'Improvements', 'General comment', 'Confirm', ''])
const stepLabel = computed(() => stepLabels.value[step.value] || '')

const reset = () => {
  step.value = 0
  answers.reason = []
  answers.reason_other = ''
  answers.improve_points = []
  answers.improve_freetext = ''
  answers.general_freetext = ''
  confirmText.value = ''
  errorMessage.value = ''
}

watch(() => props.open, async (v) => {
  if (v) {
    reset()
    if (!reasons.value.length) {
      try {
        const res = await useApi('/users/account-deletion/reasons')
        reasons.value = res?.data ?? []
      } catch {}
    }
  }
})

const tryClose = () => emit('close')

const submit = async () => {
  if (confirmText.value !== 'DELETE' || submitting.value) return
  submitting.value = true
  errorMessage.value = ''

  try {
    await useApi('/users/account-deletion', {
      method: 'POST',
      body: {
        confirm: 'DELETE',
        answers: {
          reason: answers.reason,
          reason_other: answers.reason_other,
          improve_points: answers.improve_points,
          improve_freetext: answers.improve_freetext,
          general_freetext: answers.general_freetext,
        },
      },
    })
    step.value = 5
    emit('deleted')
    setTimeout(() => navigateTo('/'), 2500)
  } catch (err) {
    errorMessage.value = err?.data?.message
      || (currentLang.value === 'ar' ? 'حدث خطأ ما، يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>
