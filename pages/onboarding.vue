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

          <video 
  src="/images/left-image.webm" 
  class="relative z-10 w-full max-w-[420px] animate-zoom-fade-up"
  autoplay 
  loop 
  muted 
  playsinline
>
</video>
        </div>

        <!-- RIGHT COLUMN (Question Box) -->
        <div class="flex justify-center lg:justify-end right-content relative">
          <Transition 
            :name="transitionName" 
            mode="out-in" 
            appear
            appear-active-class="box-appear-enter-active"
            appear-from-class="box-appear-enter-from"
          >
            <div v-if="pageLoaded" :key="step + '-' + currentEntity" class="question-box">
              <div class="flex flex-col h-full">
                
                <!-- TOP BAR -->
                <div class="flex flex-wrap justify-between items-center gap-4 mb-6 lg:mb-10">
                  <img src="/images/logo-white.png" class="w-28 md:w-32 lg:w-36 h-auto" alt="Logo" />
                  <div class="flex items-center gap-2 md:gap-3 text-[#04C18F]/70 select-none">
                    <button class="top-prev-btn text-sm md:text-base" :class="{ disabled: !canGoMainPrevious }" :disabled="!canGoMainPrevious" @click="handleMainPrevious()">
                      <span v-if="!isRtl">‹</span> {{ t.prev }} <span v-if="isRtl">›</span>
                    </button>
                    <span class="opacity-30">|</span>
                    <span class="text-[#04C18F] font-medium text-base md:text-lg">{{ step }}/12</span>
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
                      <h2 class="step-title">{{ t.step2Title }}</h2>
                      <p class="text-white/70 text-[16px]">{{ t.entity }} {{ currentEntity }}</p>
                    </div>

                    <!-- Numbered Progress Bar -->
                    <div class="entity-progress-wrapper py-4">
                        <div v-if="entitiesCount > 1" class="progress-line-bg"></div>
                        <div v-if="entitiesCount > 1" class="progress-line-fill" :style="{ width: entitiesCount > 1 ? ((currentEntity - 1) / (entitiesCount - 1)) * 100 + '%' : '0%' }"></div>
                        <div class="dots-container" :class="{ 'justify-center': entitiesCount === 1 }">
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
                    
                    <button v-if="selectedLabel === 'Multiple Entities' && entitiesCount < 10" class="add-entity-pill mt-4" @click="addAnotherEntity">
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
                      <button 
                        v-for="opt in challengeOptions" 
                        :key="opt.value" 
                        @click="toggleChallenge(opt.value)" 
                        class="option-btn" 
                        :class="{ active: selectedChallenge.includes(opt.value) }"
                      >
                        {{ opt.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Step 6: Improvements -->
                  <div v-else-if="step === 6" class="space-y-8">
                    <h2 class="step-title">{{ t.step6Title }}</h2>
                    <div class="space-y-4 max-w-[400px]">
                      <button 
                        v-for="opt in improvementOptions" 
                        :key="opt.value" 
                        @click="toggleImprovement(opt.value)" 
                        class="option-btn" 
                        :class="{ active: selectedImprovement.includes(opt.value) }"
                      >
                        {{ opt.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Step 7: Frequency -->
                  <div v-else-if="step === 7" class="space-y-8">
                    <h2 class="step-title">{{ t.step7Title }}</h2>
                    <div class="space-y-4 max-w-[400px]"><button v-for="opt in frequencyOptions" :key="opt.value" @click="selectedFrequency = opt.value" class="option-btn" :class="{ active: selectedFrequency === opt.value }">{{ opt.label }}</button></div>
                  </div>

                  <!-- Step 8: ERP -->
                  <div v-else-if="step === 8" class="space-y-8">
                    <h2 class="step-title">
                      {{ t.step8Title }}
                      <span v-if="selectedLabel === 'Multiple Entities'" class="block mt-1 text-sm font-light opacity-80 italic">Select all that apply.</span>
                    </h2>
                    <div class="space-y-4 max-w-[400px]">
                      <div v-for="opt in erpOptions" :key="opt.value" class="space-y-3">
                        <button 
                          @click="toggleERP(opt.value)" 
                          class="option-btn" 
                          :class="{ active: selectedERP.includes(opt.value) }"
                        >
                          {{ opt.label }}
                        </button>
                        <Transition name="panel">
                          <div v-if="opt.value === 'Other' && selectedERP.includes('Other')" class="pt-1">
                            <input v-model="otherERPDescription" class="image-input" :placeholder="t.otherERPPh" />
                          </div>
                        </Transition>
                      </div>
                    </div>
                  </div>

                  <!-- Step 9: Insights -->
                  <div v-else-if="step === 9" class="space-y-8">
                    <h2 class="step-title">{{ t.step9Title }}</h2>
                    <div class="space-y-4 max-w-[400px]">
                      <button 
                        v-for="opt in insightOptions" 
                        :key="opt.value" 
                        @click="toggleInsight(opt.value)" 
                        class="option-btn" 
                        :class="{ active: selectedInsight.includes(opt.value) }"
                      >
                        {{ opt.label }}
                      </button>
                    </div>
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
                    <div class="space-y-4 max-w-[400px]">
                      <button 
                        v-for="opt in goalOptions" 
                        :key="opt.value" 
                        @click="toggleGoal(opt.value)" 
                        class="option-btn" 
                        :class="{ active: selectedGoal.includes(opt.value) }"
                      >
                        {{ opt.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Step 12: Base Currency -->
                  <div v-else-if="step === 12" class="space-y-6">
                    <h2 class="step-title">{{ t.step12Title }}</h2>
                    <div class="space-y-4 max-w-[400px]">
                        <button @click="selectedBaseCurrency = 'Yes'; selectedSpecificCurrency = 'AED'" class="option-btn" :class="{ active: selectedBaseCurrency === 'Yes' }">{{ t.yes }}</button>
                        <button @click="selectedBaseCurrency = 'No'" class="option-btn" :class="{ active: selectedBaseCurrency === 'No' }">{{ t.no }}</button>
                    </div>

                    <!-- SELECT DROPDOWN (ONLY IF NO) -->
                    <Transition name="panel">
                      <div v-if="selectedBaseCurrency === 'No'" class="relative max-w-[400px] z-20">
                        <div 
                          class="image-input flex items-center justify-between cursor-pointer select-none"
                          @click="showCurrencyDropdown = !showCurrencyDropdown"
                        >
                          <span :class="{ 'text-white/40': !selectedSpecificCurrency }">
                            {{ selectedSpecificCurrency || t.selectCurrencyPh }}
                          </span>
                          <span class="text-white/40 transition-transform duration-300" :class="{ 'rotate-180': showCurrencyDropdown }">
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                          </span>
                        </div>

                        <!-- DROPDOWN OPTIONS -->
                        <Transition name="fade-scale-fast">
                          <div v-if="showCurrencyDropdown" class="currency-dropdown-list">
                            <div 
                              v-for="curr in currencyOptions" 
                              :key="curr" 
                              class="currency-item"
                              :class="{ active: selectedSpecificCurrency === curr }"
                              @click="selectedSpecificCurrency = curr; showCurrencyDropdown = false"
                            >
                              {{ curr }}
                            </div>
                          </div>
                        </Transition>
                      </div>
                    </Transition>
                  </div>
                </div>

                <!-- BOTTOM NEXT BUTTON -->
                <div class="mt-auto pt-8">
                  <button class="image-next-btn" :disabled="nextDisabled" @click="handleNext()">
                    {{ t.next }} 
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
const direction = ref('appear')
const avatarSrc = ref('/images/icon.png')
const currentLanguage = ref('en')

// State for steps
const selectedLabel = ref('Single Entity')
const entitiesCount = ref(1)
const entityForms = ref([{ legalName: '', nickName: '' }])
const commonGroupNickname = ref('')
const selectedBusiness = ref(null)
const otherBusinessDescription = ref('')
const selectedChallenge = ref([])
const selectedImprovement = ref([])
const selectedFrequency = ref(null)
const selectedERP = ref([])
const otherERPDescription = ref('')
const selectedInsight = ref([])
const selectedCompliance = ref(null)
const selectedGoal = ref([])
const selectedBaseCurrency = ref(null)
const selectedSpecificCurrency = ref(null)
const showCurrencyDropdown = ref(false)

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
    step5Title: 'What are the biggest financial challenge you’re facing right now? Select all that apply.',
    step6Title: 'Which of these areas do you want to improve the most? Select all that apply.',
    step7Title: 'How frequently do you review your financial reports?',
    step8Title: 'Do you use any accounting or ERP system currently?',
    otherERPPh: 'Enter System Name',
    step9Title: 'What’s your preferred way to view insights? Select all that apply.',
    step10Title: 'Would you like me to keep an eye on compliance changes for you?',
    selectCurrencyPh: 'Select your base currency',
    yes: 'Yes',
    no: 'No',
    step11Title: 'What’s your ultimate goal with TAXAID.AI? Select all that apply.',
    step12Title: 'Is AED your base currency?',
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
    step6Title: 'أي من هذه المجالات تريد تحسينه أكثر؟ اختر كل ما ينطبق.',
    step7Title: 'كم مرة تراجع تقاريرك المالية؟',
    step8Title: 'هل تستخدم أي نظام محاسبة أو تخطيط موارد المؤسسات حاليًا؟',
    otherERPPh: 'أدخل اسم النظام',
    step9Title: 'ما هي طريقتك المفضلة لعرض الرؤى؟ اختر كل ما ينطبق.',
    step10Title: 'هل ترغب في أن أراقب تغييرات الامتثال نيابةً عنك؟',
    selectCurrencyPh: 'اختر عملتك الأساسية',
    yes: 'نعم',
    no: 'لا',
    step11Title: 'ما هو هدفك النهائي مع TAXAID.AI؟ اختر كل ما ينطبق.',
    step12Title: 'هل الدرهم الإماراتي هو عملتك الأساسية؟',
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

const currencyOptions = ['USD', 'EUR', 'SAR', 'GBP', 'INR', 'Other']

const transitionName = computed(() => {
  if (direction.value === 'appear') return 'box-appear'
  return direction.value === 'next' ? 'box-slide-next' : 'box-slide-prev'
})
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
  if (step.value === 12) { isFinished.value = true; return }
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
  if (entitiesCount.value < 10) {
    entitiesCount.value++
    entityForms.value.push({ legalName: '', nickName: '' })
    currentEntity.value = entitiesCount.value
  }
}

function jumpToEntity(n) { direction.value = n > currentEntity.value ? 'next' : 'prev'; currentEntity.value = n }

function toggleChallenge(val) {
  const idx = selectedChallenge.value.indexOf(val)
  if (idx > -1) {
    selectedChallenge.value.splice(idx, 1)
  } else {
    selectedChallenge.value.push(val)
  }
}

function toggleImprovement(val) {
  const idx = selectedImprovement.value.indexOf(val)
  if (idx > -1) {
    selectedImprovement.value.splice(idx, 1)
  } else {
    selectedImprovement.value.push(val)
  }
}

function toggleInsight(val) {
  const idx = selectedInsight.value.indexOf(val)
  if (idx > -1) {
    selectedInsight.value.splice(idx, 1)
  } else {
    selectedInsight.value.push(val)
  }
}

function toggleGoal(val) {
  const idx = selectedGoal.value.indexOf(val)
  if (idx > -1) {
    selectedGoal.value.splice(idx, 1)
  } else {
    selectedGoal.value.push(val)
  }
}

function toggleERP(val) {
  if (selectedLabel.value === 'Single Entity') {
    // Single-select mode: Replace current selection or clear it
    if (selectedERP.value.length === 1 && selectedERP.value[0] === val) {
      selectedERP.value = []
    } else {
      selectedERP.value = [val]
    }
  } else {
    // Multi-select mode: Toggle selection
    const idx = selectedERP.value.indexOf(val)
    if (idx > -1) {
      selectedERP.value.splice(idx, 1)
    } else {
      selectedERP.value.push(val)
    }
  }
}

const nextDisabled = computed(() => {
  if (step.value === 1) return !selectedLabel.value
  if (step.value === 2) return !entityForms.value[currentEntity.value - 1].legalName || !entityForms.value[currentEntity.value - 1].nickName
  if (step.value === 3) return !commonGroupNickname.value.trim()
  if (step.value === 4) return selectedBusiness.value === 'Other' ? !otherBusinessDescription.value.trim() : !selectedBusiness.value
  if (step.value === 8) {
    if (selectedERP.value.length === 0) return true
    if (selectedERP.value.includes('Other')) return !otherERPDescription.value.trim()
    return false
  }
  if (step.value === 12) {
    if (selectedBaseCurrency.value === 'Yes') return false
    if (selectedBaseCurrency.value === 'No') return !selectedSpecificCurrency.value
    return true
  }
  
  if (step.value === 5) return selectedChallenge.value.length === 0
  if (step.value === 6) return selectedImprovement.value.length === 0
  if (step.value === 9) return selectedInsight.value.length === 0
  if (step.value === 11) return selectedGoal.value.length === 0
  
  const map = { 7: selectedFrequency, 10: selectedCompliance }
  if (map[step.value]) return !map[step.value].value
  return false
})

const bgParticleCanvas = ref(null); const successParticleCanvas = ref(null);

/** REFINED PARTICLE ENGINE (Same as home.vue) */
let activeStopFunctions = []

function startParticleEngine(canvas, { count = 160, color = '0, 229, 176', speedMult = 1, sizeMult = 1, opacity = 0.75 } = {}) {
  if (!canvas) return () => {}
  const ctx = canvas.getContext('2d')
  let W = 0, H = 0
  let animId = null

  function resize() {
    W = canvas.width  = canvas.offsetWidth
    H = canvas.height = canvas.offsetHeight
  }

  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  function createParticle() {
    const angle   = Math.random() * Math.PI * 2
    const isFar   = Math.random() < 0.2
    const maxDist = isFar
      ? Math.hypot(W, H) * (0.9 + Math.random() * 0.8)
      : Math.hypot(W, H) * (0.15 + Math.random() * 0.35)

    const speed = (0.18 + Math.random() * 0.37) * speedMult
    const size  = (0.5 + Math.random() * 1.5) * sizeMult
    const life  = maxDist / speed
    const delay = Math.random() * 180

    return {
      x: W / 2, y: H / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size,
      life,
      maxLife: life,
      delay,
      age: -delay
    }
  }

  let particles = Array.from({ length: count }, createParticle)

  function draw() {
    ctx.clearRect(0, 0, W, H)
    particles.forEach((p, i) => {
      p.age++
      if (p.age < 0) return
      if (p.age > p.maxLife) {
        particles[i] = createParticle()
        return
      }
      p.x += p.vx
      p.y += p.vy
      const progress = p.age / p.maxLife
      const alpha = progress < 0.1  ? progress / 0.1
                  : progress > 0.7  ? (1 - progress) / 0.3
                  : 1

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${color}, ${alpha * opacity})`
      ctx.fill()
    })
    animId = requestAnimationFrame(draw)
  }

  draw()
  const stop = () => {
    ro.disconnect()
    cancelAnimationFrame(animId)
  }
  activeStopFunctions.push(stop)
  return stop
}

onMounted(() => {
  setTimeout(() => pageLoaded.value = true, 100)
  
  // Background particles
  startParticleEngine(bgParticleCanvas.value, { 
    count: 180, 
    color: '0, 229, 176', 
    opacity: 0.5 
  })
})

watch(isFinished, (v) => { 
  if (v) {
    setTimeout(() => {
      startParticleEngine(successParticleCanvas.value, { 
        count: 250, 
        color: '4, 193, 143', 
        opacity: 0.8,
        speedMult: 1.5
      })
    }, 200)
  } 
})

onBeforeUnmount(() => {
  activeStopFunctions.forEach(stop => stop())
})
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
  min-height: 85vh;
  max-height: 85vh;
  padding: 24px; 
  border-radius: 24px; 
  background: #0F0F0F4A;
  backdrop-filter: blur(72.9000015258789px); 
  -webkit-backdrop-filter: blur(72.9000015258789px);
  display: flex; flex-direction: column; 
  box-shadow: 0px 4px 4px 0px #00000040;
  position: relative;
  border: 1px solid transparent; 
}
.question-box::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px; /* Border thickness */
  background: linear-gradient(125.98deg, #02362D 0%, #01362D 93.88%),
              linear-gradient(124.6deg, rgba(0, 114, 92, 0.28) 6.57%, rgba(0, 112, 90, 0.28) 99.94%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 1;
}
@media (min-width: 768px) {
    .question-box { padding: 36px; border-radius: 40px; }
}
@media (min-width: 1024px) { 
    .question-box { padding: 48px; border-radius: 54px; margin: 0; } 
}

.step-title { color: #04C18F; font-size: 22px; font-weight: 500; line-height: 1.4; max-width: 480px; margin-bottom: 25px; }

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
    height: 50px; border-radius: 999px; color: white; font-weight: 500; font-size: 16px; border: none;
    background: linear-gradient(90deg, #00C79F 0%, #0A6B59 57.14%, #175C50 100%);
    background-size: 200% auto;
    background-position: 0% 0%;
    cursor: pointer; 
    transition: background-position 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease, opacity 0.3s ease;
}
@media (min-width: 640px) {
    .image-next-btn { max-width: 240px; height: 54px; font-size: 18px; }
}
.image-next-btn:hover:not(:disabled) { 
    background-position: 100% 0%;
    transform: translateY(-2px); 
}
.image-next-btn:active:not(:disabled) { transform: translateY(0); }
.image-next-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.add-entity-pill { display: flex; align-items: center; padding: 10px 24px; border-radius: 999px; border: 1px solid #04C18F; background: rgba(4, 193, 143, 0.05); color: white; transition: 0.3s; }
.top-prev-btn { background: none; border: none; color: #04C18F; cursor: pointer; font-size: 15px; }
.top-prev-btn.disabled { opacity: 0.3; cursor: default; }
.nav-text-btn { background: none; border: none; color: white; opacity: 0.6; cursor: pointer; }

/* TRANSITIONS */
.box-appear-enter-active { transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
.box-appear-enter-from { opacity: 0; transform: translateX(50vw); }

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

.animate-zoom-fade-up { animation: zoomFadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; transform-origin: center; }
@keyframes zoomFadeUp {
  0% { opacity: 0; transform: scale(0); }
  100% { opacity: 1; transform: scale(1); }
}

.panel-enter-active, .panel-leave-active { transition: all 0.3s ease; }
.panel-enter-from { opacity: 0; transform: translateY(10px); }

/* SCROLLBAR - Higher specificity to override main.css */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px !important;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2) !important;
  border-radius: 10px !important;
  margin-block: 8px !important;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #04C18F !important;
  border-radius: 10px !important;
}
.custom-scrollbar::-webkit-scrollbar-button {
  display: none !important;
}
/* Firefox support */
.custom-scrollbar {
  scrollbar-width: thin !important;
  scrollbar-color: #04C18F rgba(0, 0, 0, 0.2) !important;
}

/* CURRENCY DROPDOWN */
.currency-dropdown-list {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(0, 43, 35, 0.95);
  border: 1px solid rgba(4, 193, 143, 0.2);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  backdrop-filter: blur(20px);
  padding: 8px;
}
.currency-item {
  padding: 12px 20px;
  color: white;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 12px;
}
.currency-item:hover {
  background: rgba(255, 255, 255, 0.05);
}
.currency-item.active {
  background: rgba(4, 193, 143, 0.2);
  color: #04C18F;
}

.fade-scale-fast-enter-active, .fade-scale-fast-leave-active {
  transition: all 0.2s ease;
}
.fade-scale-fast-enter-from, .fade-scale-fast-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>