<template>
  <div class="min-h-screen" :class="isDark ? 'bg-[#00141080]' : 'bg-white'" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <div class="sticky top-0 z-20 border-b" :class="isDark ? 'border-white/10 bg-[#00141080]' : 'border-gray-100 bg-white'">
      <div class="max-w-[600px] mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        <NuxtLink to="/home">
          <img :src="isDark ? '/images/logo-white.png' : '/images/logo.png'" alt="TaxAid" class="h-9 w-auto" />
        </NuxtLink>
        <NuxtLink to="/home" class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style="background-color: #00896F; color: #fff;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ currentLang === 'ar' ? 'الرئيسية' : 'Home' }}
        </NuxtLink>
      </div>
    </div>

    <div class="max-w-[600px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
      <h1 class="text-[22px] font-medium mb-2 text-center" :class="isDark ? 'text-white' : 'text-[#013E32]'">
        {{ currentLang === 'ar' ? 'حذف حسابك' : 'Delete your account' }}
      </h1>

      <!-- STEP 1: request the confirmation link (no ?token) -->
      <template v-if="!token">
      <div class="rounded-2xl border py-8 px-5 sm:py-10 sm:px-8" :class="cardClass">
        <p class="text-sm mb-8" :class="isDark ? 'text-white/70' : 'text-gray-600'">
          {{ currentLang === 'ar' ? 'إزالة حسابك وكل بياناته المرتبطة نهائيًا.' : 'Permanently remove your account and all associated data.' }}
        </p>

        <h2 class="text-[15px] font-semibold mb-3" :class="isDark ? 'text-white' : 'text-[#013E32]'">
          {{ currentLang === 'ar' ? 'كيف تعمل العملية' : 'How it works' }}
        </h2>
        <div class="space-y-4 mb-8">
          <div v-for="(s, i) in howItWorks" :key="i" class="flex gap-3">
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0" :class="isDark ? 'bg-white/10 text-white' : 'bg-[#E6FFF9] text-[#00896F]'">{{ i + 1 }}</div>
            <div>
              <p class="text-sm font-medium" :class="isDark ? 'text-white' : 'text-[#013E32]'">{{ s.title }}</p>
              <p class="text-sm" :class="isDark ? 'text-white/70' : 'text-gray-600'">{{ s.desc }}</p>
            </div>
          </div>
        </div>

        <h2 class="text-[15px] font-semibold mb-3" :class="isDark ? 'text-white' : 'text-[#013E32]'">
          {{ currentLang === 'ar' ? 'قبل أن تتابع' : 'Before you continue' }}
        </h2>
        <ul class="space-y-2 text-sm mb-8" :class="isDark ? 'text-white/70' : 'text-gray-600'">
          <li v-for="(b, i) in beforeYouContinue" :key="i" class="flex gap-2">
            <span>•</span><span>{{ b }}</span>
          </li>
        </ul>

        <div v-if="requestSent" class="p-4 rounded-xl text-sm border mb-4" :class="isDark ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300' : 'bg-emerald-50 border-emerald-100 text-emerald-800'">
          {{ currentLang === 'ar' ? 'إذا كان هناك حساب بهذا البريد، فقد تم إرسال رابط تأكيد.' : 'If an account exists with this email, a confirmation link has been sent.' }}
        </div>

        <form v-else @submit.prevent="submitEmail" class="space-y-4 max-w-sm">
          <input v-model="email" type="email" required :placeholder="currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email address'"
            class="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all"
            :class="isDark ? 'bg-[#00251E] border-teal-900 focus:border-[#00B68D] focus:ring-[#00B68D] text-white' : 'bg-white border-gray-200 text-gray-900 focus:border-[#00896F] focus:ring-[#00896F]'" />

          <div class="flex justify-center">
            <button type="submit" :disabled="sending"
              class="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50"
              style="background-color: #00896F;">
              {{ currentLang === 'ar' ? 'متابعة' : 'Continue' }}
            </button>
          </div>
        </form>

        <p class="text-sm mt-6" :class="isDark ? 'text-white/50' : 'text-gray-400'">
          {{ currentLang === 'ar'
            ? 'لن يحدث شيء لحسابك حتى تفتح رابط التأكيد وتوافق على الحذف.'
            : 'Nothing will happen to your account until you open the confirmation link and approve the deletion.' }}
        </p>
      </div>
      </template>

      <!-- STEP 2: confirm, same step wizard as the in-app Delete Account modal -->
      <template v-else>
        <div v-if="validatingToken" class="rounded-2xl border py-8 px-5 sm:py-10 sm:px-8" :class="cardClass">
          <div class="w-12 h-12 rounded-xl mb-4 mx-auto animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div>
          <div class="h-5 w-40 rounded mx-auto mb-6 animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div>
          <div class="space-y-3">
            <div v-for="n in 3" :key="n" class="h-4 rounded animate-pulse" :class="[isDark ? 'bg-white/10' : 'bg-gray-100', n === 3 ? 'w-2/3' : 'w-full']"></div>
          </div>
        </div>

        <!-- Expired/used/invalid link — shown briefly, then falls back to the default page automatically -->
        <div v-else-if="!tokenValid" class="rounded-2xl border py-10 px-5 sm:py-16 sm:px-10 flex flex-col items-center text-center" :class="cardClass">
          <div class="p-4 rounded-xl text-sm border" :class="isDark ? 'bg-red-950/20 border-red-900/50 text-red-300' : 'bg-red-50 border-red-100 text-red-800'">
            {{ tokenError || (currentLang === 'ar' ? 'هذا الرابط غير صالح أو منتهي الصلاحية.' : 'This link is invalid or has expired.') }}
          </div>
        </div>

        <div v-else-if="confirmed" class="rounded-2xl border py-10 px-5 sm:py-16 sm:px-10 flex flex-col items-center text-center" :class="cardClass">
          <div class="p-4 rounded-xl text-sm border mb-6" :class="isDark ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300' : 'bg-emerald-50 border-emerald-100 text-emerald-800'">
            {{ currentLang === 'ar' ? 'تم استلام طلب حذف حسابك.' : 'Your account deletion request has been received.' }}
          </div>
          <NuxtLink to="/home" class="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all" style="background-color: #00896F;">
            {{ currentLang === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home' }}
          </NuxtLink>
        </div>

        <div v-else class="rounded-2xl border max-w-lg w-full flex flex-col min-h-[520px]" :class="cardClass">

          <div class="p-6 flex-1">
            <AccountDeletionStepWarning v-if="wizardStep === -1" :is-dark="isDark" :current-lang="currentLang" @continue="wizardStep = 0" />
            <AccountDeletionStepReason v-else-if="wizardStep === 0" :is-dark="isDark" :current-lang="currentLang" :question="reasonQuestion" :answers="answers" />
            <AccountDeletionStepImprove v-else-if="wizardStep === 1" :is-dark="isDark" :current-lang="currentLang" :question="improveQuestion" :answers="answers" />
            <AccountDeletionStepGeneral v-else-if="wizardStep === 2" :is-dark="isDark" :current-lang="currentLang" :question="generalQuestion" :answers="answers" />
            <AccountDeletionStepConfirm v-else :is-dark="isDark" :current-lang="currentLang" v-model="confirmText" />
          </div>

          <div v-if="errorMessage" class="px-6 pb-2 flex-shrink-0">
            <div class="p-3.5 rounded-xl text-sm border" :class="isDark ? 'bg-red-950/20 border-red-900/50 text-red-300' : 'bg-red-50 border-red-100 text-red-800'">
              {{ errorMessage }}
            </div>
          </div>

          <div v-if="wizardStep >= 0 && wizardStep < 3" class="flex items-center justify-between px-6 py-4 border-t flex-shrink-0" :class="isDark ? 'border-white/10' : 'border-gray-100'">
            <button v-if="wizardStep > 0" @click="wizardStep--" class="text-sm font-medium opacity-70 hover:opacity-100" :class="isDark ? 'text-white' : 'text-gray-600'">
              {{ currentLang === 'ar' ? 'رجوع' : 'Back' }}
            </button>
            <span v-else></span>

            <div class="flex items-center gap-3">
              <button @click="wizardStep++" class="text-sm font-medium opacity-70 hover:opacity-100" :class="isDark ? 'text-white' : 'text-gray-600'">
                {{ currentLang === 'ar' ? 'تخطي' : 'Skip' }}
              </button>
              <button @click="wizardStep++" class="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all" style="background-color: #00896F;">
                {{ currentLang === 'ar' ? 'التالي' : 'Next' }}
              </button>
            </div>
          </div>

          <!-- Final step: Back stays left, Confirm centered -->
          <div v-else-if="wizardStep === 3" class="relative flex items-center justify-center px-6 py-4 border-t flex-shrink-0" :class="isDark ? 'border-white/10' : 'border-gray-100'">
            <button @click="wizardStep--" class="absolute left-6 text-sm font-medium opacity-70 hover:opacity-100" :class="isDark ? 'text-white' : 'text-gray-600'">
              {{ currentLang === 'ar' ? 'رجوع' : 'Back' }}
            </button>
            <button @click="submitConfirm" :disabled="confirming || confirmText !== 'DELETE'"
              class="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed" style="background-color: #DC2626;">
              {{ confirming
                ? (currentLang === 'ar' ? 'جارٍ التأكيد...' : 'Confirming...')
                : (currentLang === 'ar' ? 'تأكيد حذف الحساب' : 'Confirm Account Deletion') }}
            </button>
          </div>
        </div>
      </template>
    </div>

    <NuxtLink to="/support-help" class="fixed bottom-6 text-[13px] transition-colors" :class="[isDark ? 'text-white/50 hover:text-white/80' : 'text-[#00000066] hover:text-[#000000B2]', currentLang === 'ar' ? 'right-6' : 'left-6']">
      {{ currentLang === 'ar' ? 'الدعم والمساعدة' : 'Support & Help' }}
    </NuxtLink>
  </div>
</template>

<script setup>
useHead({ title: 'Delete Account' })

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const route = useRoute()

const token = computed(() => route.query.token || null)

// One shared card look for every state container on this page — a light shade, not flat white/black.
const cardClass = computed(() => isDark.value ? 'border-white/10 bg-white/[0.03]' : 'border-gray-100 bg-[#FAFAFA]')

const howItWorks = computed(() => currentLang.value === 'ar' ? [
  { title: 'أدخل بريدك الإلكتروني', desc: 'أدخل البريد الإلكتروني المرتبط بحسابك.' },
  { title: 'تحقق من بريدك الإلكتروني', desc: 'سنرسل لك رابط تأكيد. يبقى الرابط صالحًا لمدة 10 دقائق.' },
  { title: 'أكّد الحذف', desc: 'افتح الرابط وأكّد رغبتك في حذف حسابك.' },
] : [
  { title: 'Enter your email', desc: 'Enter the email address associated with your account.' },
  { title: 'Check your email', desc: "We'll send you a confirmation link. The link will remain valid for 10 minutes." },
  { title: 'Confirm deletion', desc: 'Open the link and confirm that you want to delete your account.' },
])

const beforeYouContinue = computed(() => currentLang.value === 'ar' ? [
  'سيتم حذف حسابك نهائيًا بعد التأكيد.',
  'ستتم إزالة جميع بياناتك المرتبطة نهائيًا.',
  'سيتم تسجيل خروجك من حسابك على جميع الأجهزة.',
  'لا يمكن التراجع عن هذا الإجراء بعد اكتماله.',
] : [
  'Your account will be permanently deleted after confirmation.',
  'All associated data will be permanently removed.',
  "You'll be logged out of your account on all devices.",
  'This action cannot be undone once completed.',
])

// Step 1
const email = ref('')
const sending = ref(false)
const requestSent = ref(false)

const submitEmail = async () => {
  if (sending.value) return
  sending.value = true
  try {
    await useApi('/public/account-deletion', { method: 'POST', body: { email: email.value } })
    requestSent.value = true
  } catch {
    requestSent.value = true // same generic response either way
  } finally {
    sending.value = false
  }
}

// Step 2 — same step wizard + shared step components as CommonDeleteAccountModal
const reasons = ref([])
const wizardStep = ref(-1)
const answers = reactive({ reason: [], reason_other: '', improve_points: [], improve_freetext: '', general_freetext: '' })
const confirming = ref(false)
const confirmText = ref('')
const confirmed = ref(false)
const errorMessage = ref('')

const reasonQuestion = computed(() => reasons.value.find(r => r.key === 'reason'))
const improveQuestion = computed(() => reasons.value.find(r => r.key === 'improve_freetext'))
const generalQuestion = computed(() => reasons.value.find(r => r.key === 'general_freetext'))

const fetchReasons = async () => {
  try {
    const res = await useApi('/public/account-deletion/reasons')
    reasons.value = res?.data ?? []
  } catch {}
}

// Checked upfront so an expired/already-used link errors immediately instead of only failing
// after someone fills in the whole wizard and hits confirm.
const validatingToken = ref(false)
const tokenValid = ref(false)
const tokenError = ref('')

const validateToken = async () => {
  validatingToken.value = true
  try {
    await useApi(`/public/account-deletion/validate?token=${encodeURIComponent(token.value)}`)
    tokenValid.value = true
    fetchReasons()
  } catch (err) {
    tokenValid.value = false
    tokenError.value = err?.data?.message || ''
    // Shown briefly, then falls back to the normal request-a-link page — no dead end.
    setTimeout(() => navigateTo('/account-deletion'), 3000)
  } finally {
    validatingToken.value = false
  }
}

if (token.value) validateToken()

const submitConfirm = async () => {
  if (confirming.value) return
  confirming.value = true
  errorMessage.value = ''

  try {
    await useApi('/public/account-deletion/confirm', {
      method: 'POST',
      body: { token: token.value, answers: { ...answers } },
    })
    confirmed.value = true
  } catch (err) {
    errorMessage.value = err?.data?.message
      || (currentLang.value === 'ar' ? 'حدث خطأ ما، يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.')
  } finally {
    confirming.value = false
  }
}
</script>
