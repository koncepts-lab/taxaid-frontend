<template>
  <div class="min-h-screen w-full bg-[#003d35] overflow-x-hidden flex items-center justify-center p-4 lg:p-12 relative font-sans" :dir="isRtl ? 'rtl' : 'ltr'">
    <!-- BACKGROUND LAYERS -->
    <div v-if="!isFinished" class="absolute inset-0 z-0 bg-layer"></div>
    <div v-if="!isFinished" class="absolute inset-0 z-0">
      <canvas ref="bgParticleCanvas" class="w-full h-full opacity-60"></canvas>
    </div>

    <!-- MAIN ONBOARDING INTERFACE -->
    
    <!-- LANGUAGE TOGGLE -->
    <div class="fixed top-4 z-50" :class="isRtl ? 'left-4 md:left-8' : 'right-4 md:right-8'">
       <LanguageToggle v-model="currentLanguage" />
    </div>

    <Transition name="fade-scale" mode="out-in">
      <div
        v-if="!isFinished"
        key="onboarding"
        class="relative z-10 w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center"
        :class="{ 'content-loaded': pageLoaded }"
      >
        <!-- LEFT COLUMN (Visual Preview) -->
        <div class="relative hidden lg:flex items-center justify-center min-h-[600px] left-content">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-[600px] h-[600px] bg-gradient-radial from-[#00B794]/20 to-transparent blur-3xl"></div>
          </div>
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <canvas ref="leftParticleCanvas" class="w-[500px] h-[500px] opacity-70"></canvas>
          </div>
          <video 
  src="/images/left-image.webm" 
  class="relative z-10 w-full max-w-[420px]"
  autoplay 
  loop 
  muted 
  playsinline
>
</video>
        </div>

        <!-- RIGHT COLUMN (Question Box) -->
        <div class="flex justify-center lg:justify-end right-content relative">
          <Transition :name="transitionName" mode="out-in">
            <div :key="step + '-' + currentEntity" class="question-box">
              <div class="flex flex-col h-full">
                
                <!-- TOP BAR -->
                <div class="flex flex-wrap justify-between items-center gap-4 mb-6 lg:mb-10">
                  <img src="/images/logo-white.png" class="w-28 md:w-32 lg:w-36 h-auto" alt="Logo" />
                  <div class="flex items-center gap-2 md:gap-3 text-[#04C18F]/70 select-none">
                    <button class="top-prev-btn text-sm md:text-base" :class="{ disabled: !canGoMainPrevious }" :disabled="!canGoMainPrevious" @click="handleMainPrevious()">
                      <span v-if="!isRtl">‹</span> {{ t.prev }} <span v-if="isRtl">›</span>
                    </button>
                    <span class="opacity-30">|</span>
                    <span class="text-[#04C18F] font-medium text-base md:text-lg">{{ step }}/11</span>
                  </div>
                </div>

                <!-- CONTENT AREA -->
                <div class="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  
                  <!-- Step 1: Entity Registration -->
                  <div v-if="step === 1" class="space-y-8">
                    <h2 class="step-title">{{ t.step1Title }}</h2>
                    <div class="space-y-4 max-w-[400px]">
                      <button v-for="opt in entityOptions" :key="opt.value" @click="selectEntityOption(opt)" class="option-btn" :class="{ active: selectedLabel === opt.value }">{{ opt.label }}</button>
                    </div>
                  </div>

                  <!-- Step 2: Company Details (Image Style) -->
                  <div v-else-if="step === 2" class="space-y-6">
                    <div class="space-y-1">
                      <h2 class="step-title !text-[22px]">{{ t.step2Title }}</h2>
                      <p class="text-white/70 text-[16px]">{{ t.entity }} {{ currentEntity }}</p>
                    </div>

                    <!-- Numbered Progress Bar -->
                    <div class="entity-progress-wrapper py-4">
                        <div v-if="entitiesCount > 1" class="progress-line-bg"></div>
                        <div v-if="entitiesCount > 1" class="progress-line-fill" :style="{ width: entitiesCount > 1 ? ((currentEntity - 1) / (entitiesCount - 1)) * 100 + '%' : '0%' }"></div>
                        <div class="dots-container">
                           <div v-for="n in entitiesCount" :key="n" class="img-dot" :class="{ 'done': n < currentEntity, 'active': n === currentEntity }" @click="jumpToEntity(n)">{{ n }}</div>
                        </div>
                    </div>

                    <div class="space-y-5">
                      <input v-model="entityForms[currentEntity - 1].legalName" class="image-input" :placeholder="t.legalNamePh" />
                      <div>
                        <input v-model="entityForms[currentEntity - 1].nickName" class="image-input" :placeholder="t.nickNamePh" />
                        <p class="text-white/30 text-[13px] mt-2 ml-5">{{ t.nickNameHint }}</p>
                      </div>
                    </div>
                    
                    <button v-if="selectedLabel === 'Multiple Entities' && entitiesCount < 3" class="add-entity-pill mt-4" @click="addAnotherEntity">
                        <span class="text-[20px] leading-none mr-2">+</span> {{ t.addEntity }}
                    </button>

                    <div class="flex items-center justify-between text-white/45 text-[14px] pt-8 mt-4 border-t border-white/5 min-h-[60px]">
                      <button class="nav-text-btn" :class="{ 'invisible': currentEntity <= 1 }" @click="handleSubPrevious()">
                         <span v-if="!isRtl">←</span> {{ t.prev }} <span v-if="isRtl">→</span>
                      </button>
                      <span class="text-white/30">{{ currentEntity }}/{{ entitiesCount }}</span>
                      <button class="nav-text-btn" :class="{ 'invisible': currentEntity >= entitiesCount }" @click="handleSubNext()">
                         {{ t.next }} <span v-if="!isRtl">→</span> <span v-if="isRtl">←</span>
                      </button>
                    </div>
                  </div>

                  <!-- Step 3: Group Nickname -->
                  <div v-else-if="step === 3" class="space-y-10">
                    <h2 class="step-title">{{ t.step3Title }}</h2>
                    <input v-model="commonGroupNickname" class="image-input max-w-[450px]" :placeholder="t.groupNickPh" />
                  </div>

                  <!-- Step 4: Business Type -->
                  <div v-else-if="step === 4" class="space-y-8">
                    <h2 class="step-title">{{ t.step4Title }}</h2>
                    <div class="space-y-4 max-w-[400px]">
                      <div v-for="opt in businessDescriptions" :key="opt.value" class="space-y-3">
                        <button @click="selectedBusiness = opt.value" class="option-btn" :class="{ active: selectedBusiness === opt.value }">{{ opt.label }}</button>
                        <Transition name="panel"><div v-if="opt.value === 'Other' && selectedBusiness === 'Other'" class="pt-1"><input v-model="otherBusinessDescription" class="image-input" :placeholder="t.otherBusinessPh" /></div></Transition>
                      </div>
                    </div>
                  </div>

                  <!-- Step 5: Financial Challenge -->
                  <div v-else-if="step === 5" class="space-y-8">
                    <h2 class="step-title">{{ t.step5Title }}</h2>
                    <div class="space-y-4 max-w-[400px]">
                      <button v-for="opt in challengeOptions" :key="opt.value" @click="selectedChallenge = opt.value" class="option-btn" :class="{ active: selectedChallenge === opt.value }">{{ opt.label }}</button>
                    </div>
                  </div>

                  <!-- Step 6: Improvements -->
                  <div v-else-if="step === 6" class="space-y-8">
                    <h2 class="step-title">{{ t.step6Title }}</h2>
                    <div class="space-y-4 max-w-[400px]"><button v-for="opt in improvementOptions" :key="opt.value" @click="selectedImprovement = opt.value" class="option-btn" :class="{ active: selectedImprovement === opt.value }">{{ opt.label }}</button></div>
                  </div>

                  <!-- Step 7: Frequency -->
                  <div v-else-if="step === 7" class="space-y-8">
                    <h2 class="step-title">{{ t.step7Title }}</h2>
                    <div class="space-y-4 max-w-[400px]"><button v-for="opt in frequencyOptions" :key="opt.value" @click="selectedFrequency = opt.value" class="option-btn" :class="{ active: selectedFrequency === opt.value }">{{ opt.label }}</button></div>
                  </div>

                  <!-- Step 8: ERP -->
                  <div v-else-if="step === 8" class="space-y-8">
                    <h2 class="step-title">{{ t.step8Title }}</h2>
                    <div class="space-y-4 max-w-[400px]">
                      <div v-for="opt in erpOptions" :key="opt.value" class="space-y-3">
                        <button @click="selectedERP = opt.value" class="option-btn" :class="{ active: selectedERP === opt.value }">{{ opt.label }}</button>
                        <Transition name="panel"><div v-if="opt.value === 'Other' && selectedERP === 'Other'" class="pt-1"><input v-model="otherERPDescription" class="image-input" :placeholder="t.otherERPPh" /></div></Transition>
                      </div>
                    </div>
                  </div>

                  <!-- Step 9: Insights -->
                  <div v-else-if="step === 9" class="space-y-8">
                    <h2 class="step-title">{{ t.step9Title }}</h2>
                    <div class="space-y-4 max-w-[400px]"><button v-for="opt in insightOptions" :key="opt.value" @click="selectedInsight = opt.value" class="option-btn" :class="{ active: selectedInsight === opt.value }">{{ opt.label }}</button></div>
                  </div>

                  <!-- Step 10: Compliance -->
                  <div v-else-if="step === 10" class="space-y-8">
                    <h2 class="step-title">{{ t.step10Title }}</h2>
                    <div class="space-y-4 max-w-[400px]">
                        <button @click="selectedCompliance = 'Yes'" class="option-btn" :class="{ active: selectedCompliance === 'Yes' }">{{ t.yes }}</button>
                        <button @click="selectedCompliance = 'No'" class="option-btn" :class="{ active: selectedCompliance === 'No' }">{{ t.no }}</button>
                    </div>
                  </div>

                  <!-- Step 11: Goal -->
                  <div v-else-if="step === 11" class="space-y-8">
                    <h2 class="step-title">{{ t.step11Title }}</h2>
                    <div class="space-y-4 max-w-[400px]"><button v-for="opt in goalOptions" :key="opt.value" @click="selectedGoal = opt.value" class="option-btn" :class="{ active: selectedGoal === opt.value }">{{ opt.label }}</button></div>
                  </div>
                </div>

                <!-- BOTTOM NEXT BUTTON -->
                <div class="mt-auto pt-8">
                  <button class="image-next-btn" :disabled="nextDisabled" @click="handleNext()">
                    {{ step === 11 ? t.finish : t.next }} 
                    <span class="font-bold mx-1" v-if="!isRtl">→</span>
                    <span class="font-bold mx-1" v-if="isRtl">←</span>
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- SUCCESS SCREEN -->
      <div v-else key="success" class="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6 bg-[#002B23] animate-fade-in overflow-hidden">
        <div class="absolute inset-0 pointer-events-none">
           <canvas ref="successParticleCanvas" class="w-full h-full opacity-60"></canvas>
        </div>
        
        <div class="relative mb-8 md:mb-12 flex items-center justify-center">
          <div class="absolute w-[200px] h-[200px] md:w-[380px] md:h-[380px] bg-[#00B794D1] rounded-full blur-[70px] md:blur-[90px] animate-pulse-slow"></div>
          <img :src="avatarSrc" class="relative z-10 w-28 h-28 md:w-44 md:h-44 object-contain drop-shadow-[0_0_30px_rgba(4,193,143,0.5)]" alt="Success Icon" />
        </div>
        
        <h2 class="relative z-10 text-white text-lg md:text-2xl font-light leading-relaxed max-w-2xl mb-10 md:mb-14 px-4">
          {{ t.successTitle }}
        </h2>
        
        <button class="relative z-10 image-next-btn !max-w-[280px] md:!max-w-[320px] !h-12 md:!h-14 !text-lg md:!text-xl" @click="goToDashboard()">
          {{ t.goDashboard }} 
          <span class="font-bold mx-1" v-if="!isRtl">→</span>
          <span class="font-bold mx-1" v-if="isRtl">←</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import LanguageToggle from '@/components/common/LanguageToggle.vue'

const isFinished = ref(false)
const pageLoaded = ref(false)
const step = ref(1)
const currentEntity = ref(1)
const direction = ref('next')
const avatarSrc = ref('/images/icon.png')
const currentLanguage = ref('en')

// State for steps
const selectedLabel = ref('Single Entity')
const entitiesCount = ref(1)
const entityForms = ref([{ legalName: '', nickName: '' }])
const commonGroupNickname = ref('')
const selectedBusiness = ref(null)
const otherBusinessDescription = ref('')
const selectedChallenge = ref(null)
const selectedImprovement = ref(null)
const selectedFrequency = ref(null)
const selectedERP = ref(null)
const otherERPDescription = ref('')
const selectedInsight = ref(null)
const selectedCompliance = ref(null)
const selectedGoal = ref(null)

// Option Lists (RESTORED)
const isRtl = computed(() => currentLanguage.value === 'ar')

const translations = {
  en: {
    prev: 'Previous',
    next: 'Next',
    finish: 'Finish',
    goDashboard: 'Go to Dashboard',
    step1Title: 'How many entities would you like to register?',
    singleEntity: 'Single Entity',
    multiEntity: 'Multiple Entities',
    step2Title: 'Please enter your company details.',
    entity: 'Entity',
    legalNamePh: 'Enter Company Legal Name',
    nickNamePh: 'Enter Company Nick Name',
    nickNameHint: 'e.g. HQ (Max 15 characters)',
    addEntity: 'Add Another Entity',
    step3Title: 'Set a common group nickname to refer to all your entities together.',
    groupNickPh: 'Enter Common Group Nick Name',
    step4Title: 'How would you describe your business in one line?',
    other: 'Other',
    otherBusinessPh: 'Please specify your business type',
    step5Title: 'What’s the biggest financial challenge you’re facing right now?',
    step6Title: 'Which of these areas do you want to improve the most?',
    step7Title: 'How frequently do you review your financial reports?',
    step8Title: 'Do you use any accounting or ERP system currently?',
    otherERPPh: 'Enter System Name',
    step9Title: 'What’s your preferred way to view insights?',
    step10Title: 'Would you like me to keep an eye on compliance changes for you?',
    yes: 'Yes',
    no: 'No',
    step11Title: 'What’s your ultimate goal with TAXAID.AI?',
    successTitle: "You're all set! Our implementation team will reach out soon to help you set up and start exploring insights with Akeel.",
    businessOpts: {
      Trading: 'Trading',
      'Professional Services': 'Professional Services',
      Medical: 'Medical',
      Construction: 'Construction',
      Other: 'Other'
    },
    challenges: {
      'Cash Flow': 'Cash Flow',
      Compliance: 'Compliance',
      Profitability: 'Profitability',
      'Cost Control': 'Cost Control',
      Growth: 'Growth'
    },
    improvements: {
      Profitability: 'Profitability',
      Liquidity: 'Liquidity',
      'Debt Management': 'Debt Management',
      Growth: 'Growth',
      Efficiency: 'Efficiency'
    },
    frequencies: {
      Daily: 'Daily',
      Weekly: 'Weekly',
      Monthly: 'Monthly',
      Quarterly: 'Quarterly'
    },
    erps: {
      Tally: 'Tally',
      'Zoho Books': 'Zoho Books',
      QuickBooks: 'QuickBooks',
      Odoo: 'Odoo',
      Other: 'Other'
    },
    insights: {
      'Chat-based Summaries': 'Chat-based Summaries',
      'Graphical Dashboards': 'Graphical Dashboards',
      'Alerts & Notifications': 'Alerts & Notifications'
    },
    goals: {
      'Save Time': 'Save Time',
      'Increase Profit': 'Increase Profit',
      'Ensure Compliance': 'Ensure Compliance',
      'Prepare for Growth': 'Prepare for Growth'
    }
  },
  ar: {
    prev: 'سابق',
    next: 'التالي',
    finish: 'إنهاء',
    goDashboard: 'الذهاب إلى لوحة القيادة',
    step1Title: 'كم عدد الكيانات التي ترغب في تسجيلها؟',
    singleEntity: 'كيان واحد',
    multiEntity: 'كيانات متعددة',
    step2Title: 'الرجاء إدخال تفاصيل شركتك.',
    entity: 'الكيان',
    legalNamePh: 'أدخل الاسم القانوني للشركة',
    nickNamePh: 'أدخل اسم الشركة نيك',
    nickNameHint: 'مثلاً: المقر الرئيسي (الحد الأقصى 15 حرفًا)',
    addEntity: 'إضافة كيان آخر',
    step3Title: 'قم بتعيين لقب مجموعة مشترك للإشارة إلى جميع كياناتك معًا.',
    groupNickPh: 'أدخل اسم المجموعة المشترك',
    step4Title: 'كيف تصف عملك في سطر واحد؟',
    other: 'أخرى',
    otherBusinessPh: 'الرجاء تحديد نوع عملك',
    step5Title: 'ما هو أكبر تحدي مالي تواجهه الآن؟',
    step6Title: 'أي من هذه المجالات تريد تحسينه أكثر؟',
    step7Title: 'كم مرة تراجع تقاريرك المالية؟',
    step8Title: 'هل تستخدم أي نظام محاسبة أو تخطيط موارد المؤسسات حاليًا؟',
    otherERPPh: 'أدخل اسم النظام',
    step9Title: 'ما هي طريقتك المفضلة لعرض الرؤى؟',
    step10Title: 'هل ترغب في أن أراقب تغييرات الامتثال نيابةً عنك؟',
    yes: 'نعم',
    no: 'لا',
    step11Title: 'ما هو هدفك النهائي مع TAXAID.AI؟',
    successTitle: 'أنت جاهز تمامًا! سيتواصل معك فريق التنفيذ قريبًا لمساعدتك في الإعداد والبدء في استكشاف الرؤى مع عقيل.',
    businessOpts: {
      Trading: 'تداول',
      'Professional Services': 'خدمات احترافية',
      Medical: 'طبي',
      Construction: 'بناء',
      Other: 'أخرى'
    },
    challenges: {
      'Cash Flow': 'تدفق نقدي',
      Compliance: 'امتثال',
      Profitability: 'ربحية',
      'Cost Control': 'التحكم في التكاليف',
      Growth: 'نمو'
    },
    improvements: {
      Profitability: 'ربحية',
      Liquidity: 'سيولة',
      'Debt Management': 'إدارة الديون',
      Growth: 'نمو',
      Efficiency: 'كفاءة'
    },
    frequencies: {
      Daily: 'يومي',
      Weekly: 'أسبوعي',
      Monthly: 'شهري',
      Quarterly: 'ربع سنوي'
    },
    erps: {
      Tally: 'تالي',
      'Zoho Books': 'كتب زوهو',
      QuickBooks: 'كويك بوكس',
      Odoo: 'أودو',
      Other: 'أخرى'
    },
    insights: {
      'Chat-based Summaries': 'ملخصات قائمة على الدردشة',
      'Graphical Dashboards': 'لوحات معلومات رسومية',
      'Alerts & Notifications': 'تنبيهات وإشعارات'
    },
    goals: {
      'Save Time': 'توفير الوقت',
      'Increase Profit': 'زيادة الربح',
      'Ensure Compliance': 'ضمان الامتثال',
      'Prepare for Growth': 'الاستعداد للنمو'
    }
  }
}

const t = computed(() => translations[currentLanguage.value])

// COMPUTED OPTIONS (Preserve English Values for logic)
const entityOptions = computed(() => [
  { label: t.value.singleEntity, value: 'Single Entity' },
  { label: t.value.multiEntity, value: 'Multiple Entities' }
])

const businessDescriptions = computed(() => [
  'Trading', 'Professional Services', 'Medical', 'Construction', 'Other'
].map(k => ({ value: k, label: t.value.businessOpts[k] })))

const challengeOptions = computed(() => [
  'Cash Flow', 'Compliance', 'Profitability', 'Cost Control', 'Growth'
].map(k => ({ value: k, label: t.value.challenges[k] })))

const improvementOptions = computed(() => [
  'Profitability', 'Liquidity', 'Debt Management', 'Growth', 'Efficiency'
].map(k => ({ value: k, label: t.value.improvements[k] })))

const frequencyOptions = computed(() => [
  'Daily', 'Weekly', 'Monthly', 'Quarterly'
].map(k => ({ value: k, label: t.value.frequencies[k] })))

const erpOptions = computed(() => [
  'Tally', 'Zoho Books', 'QuickBooks', 'Odoo', 'Other'
].map(k => ({ value: k, label: t.value.erps[k] })))

const insightOptions = computed(() => [
  'Chat-based Summaries', 'Graphical Dashboards', 'Alerts & Notifications'
].map(k => ({ value: k, label: t.value.insights[k] })))

const goalOptions = computed(() => [
  'Save Time', 'Increase Profit', 'Ensure Compliance', 'Prepare for Growth'
].map(k => ({ value: k, label: t.value.goals[k] })))

const transitionName = computed(() => direction.value === 'next' ? 'box-slide-next' : 'box-slide-prev')
const canGoMainPrevious = computed(() => step.value > 1)

function selectEntityOption(opt) {
  selectedLabel.value = opt.value
  if (opt.value === 'Single Entity') {
    entitiesCount.value = 1
    entityForms.value = [{ legalName: '', nickName: '' }]
  } else {
    // Keep existing count/forms if already > 1, otherwise ensure at least 1 (which it is).
    // Do not force 2. User must add manually.
  }
}

function handleNext() {
  direction.value = 'next'
  if (step.value === 1) {
    if (selectedLabel.value === 'Single Entity') { step.value = 4 } // JUMP TO 4
    else { step.value = 2 }
    return
  }
  if (step.value === 2) {
    if (currentEntity.value < entitiesCount.value) { currentEntity.value++ } 
    else { step.value = 3 }
    return
  }
  if (step.value === 11) { isFinished.value = true; return }
  step.value++
}

function handleSubNext() { 
  if (currentEntity.value < entitiesCount.value) { 
    direction.value = 'next'; 
    currentEntity.value++ 
  } 
}

function handleMainPrevious() {
  direction.value = 'prev'
  if (step.value > 1) {
    step.value--
    // Reset to first entity if leaving step 2? Or keep state? Usually reset is safer for navigation flow context.
    // However, if users go back to check, keeping state might be nicer. But user asked for "Main" navigation.
    // Let's safe reset if stepping back FROM step 2 into 1.
    if (step.value === 1) currentEntity.value = 1
  }
}

function handleSubPrevious() {
  if (currentEntity.value > 1) {
    direction.value = 'prev'
    currentEntity.value--
  }
}

function addAnotherEntity() {
  if (entitiesCount.value < 3) {
    entitiesCount.value++
    entityForms.value.push({ legalName: '', nickName: '' })
    currentEntity.value = entitiesCount.value
  }
}

function jumpToEntity(n) { direction.value = n > currentEntity.value ? 'next' : 'prev'; currentEntity.value = n }

const nextDisabled = computed(() => {
  if (step.value === 1) return !selectedLabel.value
  if (step.value === 2) return !entityForms.value[currentEntity.value - 1].legalName || !entityForms.value[currentEntity.value - 1].nickName
  if (step.value === 3) return !commonGroupNickname.value.trim()
  if (step.value === 4) return selectedBusiness.value === 'Other' ? !otherBusinessDescription.value.trim() : !selectedBusiness.value
  if (step.value === 8 && selectedERP.value === 'Other') return !otherERPDescription.value.trim()
  
  const map = { 5: selectedChallenge, 6: selectedImprovement, 7: selectedFrequency, 8: selectedERP, 9: selectedInsight, 10: selectedCompliance, 11: selectedGoal }
  if (map[step.value]) return !map[step.value].value
  return false
})

/** PARTICLE ENGINES */
const bgParticleCanvas = ref(null); const leftParticleCanvas = ref(null); const successParticleCanvas = ref(null);
let rafs = []

function initParticles(canvas, count, color, speed = 1) {
  if (!canvas) return
  const ctx = canvas.getContext('2d'); let w, h, pts = []
  const res = () => { w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * 2; canvas.height = h * 2; ctx.scale(2, 2) }
  res(); window.addEventListener('resize', res)
  for (let i = 0; i < count; i++) pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * speed, vy: (Math.random() - 0.5) * speed, r: Math.random() * 1.5, a: Math.random(), t: Math.random() * 10 })
  const anim = () => {
    ctx.clearRect(0, 0, w, h); pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.t += 0.02; if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
      ctx.beginPath(); ctx.fillStyle = `rgba(${color}, ${p.a * (0.5 + Math.sin(p.t) * 0.5)})`; ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill()
    })
    rafs.push(requestAnimationFrame(anim))
  }
  anim()
}

function initSuccessParticles(canvas, count, color) {
  if (!canvas) return
  const ctx = canvas.getContext('2d'); let w, h, pts = []
  const res = () => { w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * 2; canvas.height = h * 2; ctx.scale(2, 2) }
  res(); const cX = w / 2, cY = h / 2
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2, dst = (Math.random() * (w * 0.5)) * Math.pow(Math.random(), 2)
    pts.push({ x: cX + Math.cos(ang) * dst, y: cY + Math.sin(ang) * dst, ang, dst, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2, r: Math.random() * 2, a: Math.random(), t: Math.random() * 10 })
  }
  const anim = () => {
    ctx.clearRect(0, 0, w, h); pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.t += 0.01; const dx = p.x - cX, dy = p.y - cY, d = Math.sqrt(dx*dx+dy*dy)
      if (d > w * 0.6) { p.x = cX; p.y = cY }
      ctx.beginPath(); ctx.fillStyle = `rgba(${color}, ${p.a * (1 - d/(w*0.6))})`; ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill()
    })
    rafs.push(requestAnimationFrame(anim))
  }
  anim()
}

onMounted(() => {
  setTimeout(() => pageLoaded.value = true, 100)
  initParticles(bgParticleCanvas.value, 150, '49, 224, 200', 0.4)
  initParticles(leftParticleCanvas.value, 80, '255, 255, 255', 0.6)
})
watch(isFinished, (v) => { if (v) setTimeout(() => initSuccessParticles(successParticleCanvas.value, 300, '4, 193, 143'), 200) })
onBeforeUnmount(() => rafs.forEach(cancelAnimationFrame))
function goToDashboard() { window.location.href = '/dashboard' }
</script>

<style scoped>
.bg-layer { 
  background: radial-gradient(800px 600px at 90% 10%, rgba(0, 183, 148, 0.15) 0%, transparent 80%),
              linear-gradient(135deg, #004d42 0%, #003d35 100%); 
}
.bg-gradient-radial { background: radial-gradient(circle, var(--tw-gradient-stops)); }

/* QUESTION BOX - RESPONSIVE */
.question-box { 
  width: 100%; max-width: 580px; 
  min-height: auto; 
  padding: 24px; 
  border-radius: 24px; 
  background: radial-gradient(ellipse at top left, rgba(0, 88, 71, 0.35) 0%, rgba(0, 40, 34, 0.98) 100%); 
  border: 1px solid rgba(4, 193, 143, 0.15); 
  backdrop-filter: blur(40px); 
  -webkit-backdrop-filter: blur(40px);
  display: flex; flex-direction: column; 
  margin: 0 auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  position: relative;
}
.question-box::before {
    content: '';
    position: absolute;
    inset: -1px;
    background: linear-gradient(135deg, rgba(4, 193, 143, 0.3), transparent 40%, transparent 60%, rgba(4, 193, 143, 0.1));
    border-radius: inherit;
    z-index: -1;
    pointer-events: none;
}
@media (min-width: 768px) {
    .question-box { min-height: 580px; padding: 36px; border-radius: 40px; }
}
@media (min-width: 1024px) { 
    .question-box { min-height: 680px; padding: 48px; border-radius: 54px; margin: 0; } 
}

.step-title { color: #04C18F; font-size: 1.25rem; font-weight: 500; line-height: 1.4; max-width: 480px; margin-bottom: 0.5rem; }
@media (min-width: 768px) { .step-title { font-size: 1.5rem; } }
@media (min-width: 1024px) { .step-title { font-size: 1.75rem; } }

/* IMAGE STYLE: INPUTS */
.image-input {
    width: 100%; height: 50px; /* slightly smaller on mobile */
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 999px;
    padding: 0 24px; color: white; font-size: 15px; outline: none; transition: 0.3s;
}
@media (min-width: 1024px) {
    .image-input { height: 52px; padding: 0 28px; font-size: 16px; }
}
.image-input:focus { border-color: #04C18F; background: rgba(255, 255, 255, 0.06); }

/* PROGRESS BAR STYLES */
.entity-progress-wrapper { position: relative; width: 100%; max-width: 400px; display: flex; align-items: center; margin: 0 auto; }
.progress-line-bg { position: absolute; left: 0; right: 0; height: 1px; background: rgba(255, 255, 255, 0.1); z-index: 1; }
.progress-line-fill { position: absolute; left: 0; height: 1px; background: #04C18F; z-index: 2; transition: width 0.5s ease; }
.dots-container { position: relative; width: 100%; display: flex; justify-content: space-between; z-index: 3; }
.img-dot {
    width: 32px; height: 32px; border-radius: 50%; background: #003d35; border: 1px solid rgba(255, 255, 255, 0.2);
    color: white; font-size: 13px; display: grid; place-items: center; cursor: pointer; transition: 0.3s;
}
.img-dot.done { background: #04C18F; border-color: #04C18F; }
.img-dot.active { background: white; border-color: white; color: #003d35; font-weight: 600; }

/* OPTION BUTTONS */
.option-btn { 
    width: 100%; text-align: left; padding: 14px 24px; border-radius: 50px; 
    color: white; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.02); 
    transition: 0.3s; font-size: 15px; 
}
@media (min-width: 1024px) {
    .option-btn { padding: 16px 28px; font-size: 16px; }
}
.option-btn.active { border-color: #04C18F; background: rgba(4, 193, 143, 0.15); box-shadow: 0 0 20px rgba(4, 193, 143, 0.1); }
.option-btn:hover:not(.active) { border-color: rgba(4, 193, 143, 0.4); background: rgba(255, 255, 255, 0.05); transform: translateX(4px); }
[dir="rtl"] .option-btn:hover:not(.active) { transform: translateX(-4px); }

/* CTA BUTTON */
.image-next-btn {
    width: 100%; max-width: 100%; /* Full width on mobile */
    height: 50px; border-radius: 999px; color: white; font-weight: 600; font-size: 16px; border: none;
    background: linear-gradient(90deg, #00C79F 0%, #0A6B59 100%); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
@media (min-width: 640px) {
    .image-next-btn { max-width: 240px; height: 54px; font-size: 18px; }
}
.image-next-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0, 199, 159, 0.4); filter: brightness(1.1); }
.image-next-btn:active:not(:disabled) { transform: translateY(0); }
.image-next-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.add-entity-pill { display: flex; align-items: center; padding: 10px 24px; border-radius: 999px; border: 1px solid #04C18F; background: rgba(4, 193, 143, 0.05); color: white; transition: 0.3s; }
.top-prev-btn { background: none; border: none; color: #04C18F; cursor: pointer; font-size: 15px; }
.top-prev-btn.disabled { opacity: 0.3; cursor: default; }
.nav-text-btn { background: none; border: none; color: white; opacity: 0.6; cursor: pointer; }

/* TRANSITIONS */
.box-slide-next-enter-active, .box-slide-next-leave-active, 
.box-slide-prev-enter-active, .box-slide-prev-leave-active { transition: all 0.4s ease; }
.box-slide-next-enter-from { opacity: 0; transform: translateX(30px); }
.box-slide-next-leave-to { opacity: 0; transform: translateX(-30px); }
.box-slide-prev-enter-from { opacity: 0; transform: translateX(-30px); }
.box-slide-prev-leave-to { opacity: 0; transform: translateX(30px); }

.animate-pulse-slow { animation: pulse-slow 4s infinite; }
@keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } }
.animate-fade-in { animation: fadeIn 1s ease forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.panel-enter-active, .panel-leave-active { transition: all 0.3s ease; }
.panel-enter-from { opacity: 0; transform: translateY(10px); }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(4, 193, 143, 0.2); border-radius: 10px; }
</style>