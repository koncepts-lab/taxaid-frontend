<template>
  <div class="min-h-screen w-full bg-[#003d35] overflow-x-hidden flex items-center justify-center p-4 lg:p-12 relative font-sans" :dir="isRtl ? 'rtl' : 'ltr'">
    <!-- BACKGROUND LAYERS -->
      <CommonParticleBackground/>
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
            <div v-if="pageLoaded && questions.length > 0" :key="step + '-' + currentEntity" class="question-box">
              <div class="flex flex-col h-full">
                
                <!-- TOP BAR -->
                <div class="flex flex-wrap justify-between items-center gap-4 mb-6 lg:mb-10">
                  <img src="/images/logo-white.png" class="w-28 md:w-32 lg:w-36 h-auto" alt="Logo" />
                  <div class="flex items-center gap-2 md:gap-3 text-[#04C18F]/70 select-none">
                    <button class="top-prev-btn text-sm md:text-base" :class="{ disabled: !canGoMainPrevious }" :disabled="!canGoMainPrevious" @click="handleMainPrevious()">
                      <span v-if="!isRtl">‹</span> {{ t.prev }} <span v-if="isRtl">›</span>
                    </button>
                    <span class="opacity-30">|</span>
                    <span class="text-[#04C18F] font-medium text-base md:text-lg">{{ step }}/{{ questions.length }}</span>
                  </div>
                </div>

                <!-- CONTENT AREA -->
                <div class="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  
                  <h2 class="step-title mb-6">{{ questions[step-1].question_text }}</h2>

                  <div v-if="questions[step-1].maps_to_config_key === 'company_structure'" class="space-y-8">
                    <div class="space-y-4 max-w-[400px]">
                      <button v-for="opt in questions[step-1].options" :key="opt" @click="selectEntityOption(opt)" class="option-btn" :class="{ active: selectedLabel === opt }">{{ opt }}</button>
                    </div>
                  </div>
                  <!-- Step 2: Company Details (Image Style) -->
                  <div v-else-if="questions[step-1].maps_to_config_key === 'company_name'" class="space-y-6">
                    <div class="space-y-1">
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
                      <input v-model="entityForms[currentEntity - 1].legalName" class="image-input" :placeholder="questions[step-1].options[0]" />
                      <div>
                        <input v-model="entityForms[currentEntity - 1].nickName" class="image-input" :placeholder="questions[step-1].options[1]" />
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

                  <div v-else-if="questions[step-1].maps_to_config_key === 'currency'" class="space-y-6">
                    <div class="space-y-4 max-w-[400px]">
                        <button @click="selectedBaseCurrency = 'Yes'; selectedSpecificCurrency = questions[step-1].options.default" class="option-btn" :class="{ active: selectedBaseCurrency === 'Yes' }">{{ t.yes }}</button>
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
                              v-for="curr in questions[step-1].options.alternatives" 
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

                  <div v-else class="space-y-8">
                    <div v-if="questions[step-1].type === 'text'">
                       <input v-model="dynamicAnswers[questions[step-1].id]" class="image-input max-w-[450px]" placeholder="Type your answer..." />
                    </div>

                    <div v-else class="space-y-4 max-w-[400px]">
                      <div v-for="opt in questions[step-1].options" :key="opt" class="space-y-3">
                        <button @click="toggleDynamicOption(questions[step-1], opt)" class="option-btn" :class="{ active: isOptionSelected(questions[step-1], opt) }">{{ opt }}</button>
                        <Transition name="panel">
                           <div v-if="opt === 'Other' && isOptionSelected(questions[step-1], opt)" class="pt-1">
                              <input v-model="otherDescriptions[questions[step-1].id]" class="image-input" :placeholder="t.otherBusinessPh" />
                           </div>
                        </Transition>
                      </div>
                    </div>
                  </div>

                </div>

                <!-- BOTTOM NEXT BUTTON -->
                <div class="mt-auto pt-8">
                  <button class="image-next-btn" :disabled="nextDisabled || submitting" @click="handleNext()">
                    <span v-if="submitting">Saving...</span>
                    <template v-else>
                      {{ step === questions.length ? t.finish : t.next }} 
                      <span class="font-bold mx-1" v-if="!isRtl">→</span>
                      <span class="font-bold mx-1" v-if="isRtl">←</span>
                    </template>
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="flex items-center justify-center min-h-[400px]">
                <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-[#04C18F]" />
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

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import LanguageToggle from '@/components/common/LanguageToggle.vue'

const isFinished = ref(false)
const pageLoaded = ref(false)
const submitting = ref(false)
const step = ref(1)
const currentEntity = ref(1)
const direction = ref('appear')
const avatarSrc = ref('/images/icon.png')
const currentLanguage = ref('en')

// Questions from Backend
interface Question {
  id: number;
  question_text: string;
  type: string;
  options: any;
  maps_to_config_key: string;
}
const questions = ref<Question[]>([])

// Logic States
const dynamicAnswers = ref<Record<number, any>>({})
const otherDescriptions = ref<Record<number, string>>({})
const selectedLabel = ref('Single Entity')
const entitiesCount = ref(1)
const entityForms = ref([{ legalName: '', nickName: '' }])
const selectedBaseCurrency = ref<string | null>(null)
const selectedSpecificCurrency = ref<string | null>(null)
const showCurrencyDropdown = ref(false)

const isRtl = computed(() => currentLanguage.value === 'ar')

const translations = {
  en: {
    prev: 'Previous',
    next: 'Next',
    finish: 'Finish',
    goDashboard: 'Go to Dashboard',
    entity: 'Entity',
    nickNameHint: 'e.g. HQ (Max 15 characters)',
    addEntity: 'Add Another Entity',
    otherBusinessPh: 'Please specify...',
    selectCurrencyPh: 'Select your base currency',
    yes: 'Yes',
    no: 'No',
    successTitle: "You're all set! Our implementation team will reach out soon to help you set up and start exploring insights with Akeel."
  },
  ar: {
    prev: 'سابق',
    next: 'التالي',
    finish: 'إنهاء',
    goDashboard: 'الذهاب إلى لوحة القيادة',
    entity: 'الكيان',
    nickNameHint: 'مثلاً: المقر الرئيسي (الحد الأقصى 15 حرفًا)',
    addEntity: 'إضافة كيان آخر',
    otherBusinessPh: 'الرجاء تحديد...',
    selectCurrencyPh: 'اختر عملتك الأساسية',
    yes: 'نعم',
    no: 'لا',
    successTitle: 'أنت جاهز تمامًا! سيتواصل معك فريق التنفيذ قريبًا لمساعدتك في الإعداد والبدء في استكشاف الرؤى مع عقيل.'
  }
}

const t = computed(() => translations[currentLanguage.value])

const transitionName = computed(() => {
  if (direction.value === 'appear') return 'box-appear'
  return direction.value === 'next' ? 'box-slide-next' : 'box-slide-prev'
})
const canGoMainPrevious = computed(() => step.value > 1)

/** * BACKEND INTEGRATION LOGIC */

const initOnboarding = async () => {
  const langQuery = currentLanguage.value === 'ar' ? 'arb' : 'en'
  try {
    // 1. Check Status
    const status: any = await useApi(`/status?`)
    if (status?.completed) {
       return navigateTo('/dashboard')
    }

    // 2. Fetch Questions
    const response: any = await useApi(`/questions?lang=${langQuery}`)
    questions.value = response.data || []

    // Initialize answer models
    questions.value.forEach(q => {
       if (q.type === 'select') dynamicAnswers.value[q.id] = []
       else dynamicAnswers.value[q.id] = ""
    })
  } catch (error: any) {
    console.error("Init Error:", error)
    // If unauthorized/unauthenticated, redirect home
    if (error.response?.status === 401) navigateTo('/')
  }
}

const syncWithBackend = async () => {
  if (questions.value.length === 0) return
  submitting.value = true
  const langQuery = currentLanguage.value === 'ar' ? 'arb' : 'en'
  
  try {
    const finalCurrency = selectedSpecificCurrency.value || 'AED'
    const payload = {
      company_name: entityForms.value[0].legalName,
      country: 'UAE',
      currency: finalCurrency,
      answers: questions.value.map((q, idx) => {
          let ans = dynamicAnswers.value[q.id]
          
          // Custom mapping based on UI logic
          if (q.maps_to_config_key === 'company_structure') ans = selectedLabel.value
          if (q.maps_to_config_key === 'company_name') ans = JSON.stringify(entityForms.value)
          if (q.maps_to_config_key === 'currency') ans = finalCurrency
          
          // Handle 'Other' inputs
          if (ans === 'Other') ans = otherDescriptions.value[q.id] || 'Other'
          if (Array.isArray(ans)) ans = ans.join(', ')

          return { question_id: q.id, answer: String(ans || 'N/A') }
      })
    }

    await useApi(`/submit?lang=${langQuery}`, { method: 'POST', body: payload })
    isFinished.value = true
  } catch (error) {
    console.error("Submission failed:", error)
  } finally {
    submitting.value = false
  }
}

// Navigation Functions
function selectEntityOption(opt: any) {
  selectedLabel.value = opt
  if (opt === 'Single Entity') {
    entitiesCount.value = 1
    entityForms.value = [{ legalName: '', nickName: '' }]
  }
}

function handleNext() {
  direction.value = 'next'
  const currentQ = questions.value[step.value - 1]
  
  // Custom Flow: Step 1 (Structure)
  if (currentQ.maps_to_config_key === 'company_structure') {
     step.value = (selectedLabel.value === 'Single Entity') ? 4 : 2
     return
  }
  
  // Custom Flow: Step 2 (Entity Details)
  if (currentQ.maps_to_config_key === 'company_name') {
    if (currentEntity.value < entitiesCount.value) { currentEntity.value++ } 
    else { step.value = 3 }
    return
  }

  // Final Step check
  if (step.value === questions.value.length) { 
     syncWithBackend()
     return 
  }
  
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
    // Jump back logic
    if (step.value === 4 && selectedLabel.value === 'Single Entity') step.value = 1
    else step.value--
    
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

function jumpToEntity(n: number) { 
   direction.value = n > currentEntity.value ? 'next' : 'prev'; 
   currentEntity.value = n 
}

// Helper Toggles for Generic Questions
function toggleDynamicOption(q: Question, val: string) {
   if (q.type === 'radio') {
      dynamicAnswers.value[q.id] = val
   } else {
      const current = dynamicAnswers.value[q.id] || []
      const idx = current.indexOf(val)
      if (idx > -1) current.splice(idx, 1); else current.push(val)
      dynamicAnswers.value[q.id] = [...current]
   }
}

function isOptionSelected(q: Question, val: string) {
   if (q.type === 'radio') return dynamicAnswers.value[q.id] === val
   return (dynamicAnswers.value[q.id] || []).includes(val)
}

const nextDisabled = computed(() => {
  if (questions.value.length === 0) return true
  const q = questions.value[step.value - 1]
  
  if (q.maps_to_config_key === 'company_structure') return !selectedLabel.value
  if (q.maps_to_config_key === 'company_name') return !entityForms.value[currentEntity.value - 1].legalName
  if (q.maps_to_config_key === 'currency') return selectedBaseCurrency.value === null
  
  if (q.type === 'select') return (dynamicAnswers.value[q.id] || []).length === 0
  return !dynamicAnswers.value[q.id]
})


onMounted(() => {
  setTimeout(() => pageLoaded.value = true, 100)
  initOnboarding()
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