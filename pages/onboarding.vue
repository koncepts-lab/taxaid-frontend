<template>
  <div class="min-h-screen w-full bg-[#003d35] overflow-x-hidden flex items-center justify-center p-4 lg:p-12 relative font-sans">
    <!-- BACKGROUND LAYERS -->
    <div v-if="!isFinished" class="absolute inset-0 z-0 bg-layer"></div>
    <div v-if="!isFinished" class="absolute inset-0 z-0">
      <canvas ref="bgParticleCanvas" class="w-full h-full opacity-60"></canvas>
    </div>

    <!-- MAIN ONBOARDING INTERFACE -->
    
    <!-- LANGUAGE TOGGLE -->
    <div class="absolute top-6 right-6 z-50">
       <LanguageToggle v-model="currentLanguage" />
    </div>

    <Transition name="fade-scale" mode="out-in">
      <div
        v-if="!isFinished"
        key="onboarding"
        class="relative z-10 w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
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
          <img src="/images/left-image.png" class="relative z-10 w-full max-w-[420px]" alt="Dashboard Preview" />
        </div>

        <!-- RIGHT COLUMN (Question Box) -->
        <div class="flex justify-center lg:justify-end right-content relative">
          <Transition :name="transitionName" mode="out-in">
            <div :key="step + '-' + currentEntity" class="question-box">
              <div class="flex flex-col h-full">
                
                <!-- TOP BAR -->
                <div class="flex justify-between items-center mb-8">
                  <img src="/images/logo-white.png" class="w-full max-w-[140px] h-auto" alt="Logo" />
                  <div class="flex items-center gap-3 text-[#04C18F]/70 select-none">
                    <button class="top-prev-btn" :class="{ disabled: !canGoPrevious }" :disabled="!canGoPrevious" @click="handlePrevious()">
                      ‹ Previous
                    </button>
                    <span class="opacity-30">|</span>
                    <span class="text-[#04C18F] font-medium text-[18px]">{{ step }}/11</span>
                  </div>
                </div>

                <!-- CONTENT AREA -->
                <div class="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  
                  <!-- Step 1: Entity Registration -->
                  <div v-if="step === 1" class="space-y-8">
                    <h2 class="step-title">How many entities would you like to register?</h2>
                    <div class="space-y-4 max-w-[400px]">
                      <button v-for="opt in entityOptions" :key="opt.label" @click="selectEntityOption(opt)" class="option-btn" :class="{ active: selectedLabel === opt.label }">{{ opt.label }}</button>
                    </div>
                  </div>

                  <!-- Step 2: Company Details (Image Style) -->
                  <div v-else-if="step === 2" class="space-y-6">
                    <div class="space-y-1">
                      <h2 class="step-title !text-[22px]">Please enter your company details.</h2>
                      <p class="text-white/70 text-[16px]">Entity {{ currentEntity }}</p>
                    </div>

                    <!-- Numbered Progress Bar -->
                    <div class="entity-progress-wrapper py-4">
                        <div class="progress-line-bg"></div>
                        <div class="progress-line-fill" :style="{ width: entitiesCount > 1 ? ((currentEntity - 1) / (entitiesCount - 1)) * 100 + '%' : '0%' }"></div>
                        <div class="dots-container">
                           <div v-for="n in entitiesCount" :key="n" class="img-dot" :class="{ 'done': n < currentEntity, 'active': n === currentEntity }" @click="jumpToEntity(n)">{{ n }}</div>
                        </div>
                    </div>

                    <div class="space-y-5">
                      <input v-model="entityForms[currentEntity - 1].legalName" class="image-input" placeholder="Enter Company Legal Name" />
                      <div>
                        <input v-model="entityForms[currentEntity - 1].nickName" class="image-input" placeholder="Enter Company Nick Name" />
                        <p class="text-white/30 text-[13px] mt-2 ml-5">e.g. HQ (Max 15 characters)</p>
                      </div>
                    </div>
                    
                    <button v-if="selectedLabel === 'Multiple Entities' && entitiesCount < 3" class="add-entity-pill mt-4" @click="addAnotherEntity">
                        <span class="text-[20px] leading-none mr-2">+</span> Add Another Entity
                    </button>

                    <div class="flex items-center justify-between text-white/45 text-[14px] pt-8 mt-4 border-t border-white/5">
                      <button class="nav-text-btn" @click="handlePrevious()">← Previous</button>
                      <span class="text-white/30">{{ currentEntity }}/{{ entitiesCount }}</span>
                      <button class="nav-text-btn" @click="handleSubNext()">Next →</button>
                    </div>
                  </div>

                  <!-- Step 3: Group Nickname -->
                  <div v-else-if="step === 3" class="space-y-10">
                    <h2 class="step-title">Set a common group nickname to refer to all your entities together.</h2>
                    <input v-model="commonGroupNickname" class="image-input max-w-[450px]" placeholder="Enter Common Group Nick Name" />
                  </div>

                  <!-- Step 4: Business Type -->
                  <div v-else-if="step === 4" class="space-y-8">
                    <h2 class="step-title">How would you describe your business in one line?</h2>
                    <div class="space-y-4 max-w-[400px]">
                      <div v-for="desc in businessDescriptions" :key="desc" class="space-y-3">
                        <button @click="selectedBusiness = desc" class="option-btn" :class="{ active: selectedBusiness === desc }">{{ desc }}</button>
                        <Transition name="panel"><div v-if="desc === 'Other' && selectedBusiness === 'Other'" class="pt-1"><input v-model="otherBusinessDescription" class="image-input" placeholder="Please specify your business type" /></div></Transition>
                      </div>
                    </div>
                  </div>

                  <!-- Step 5: Financial Challenge -->
                  <div v-else-if="step === 5" class="space-y-8">
                    <h2 class="step-title">What’s the biggest financial challenge you’re facing right now?</h2>
                    <div class="space-y-4 max-w-[400px]">
                      <button v-for="c in challengeOptions" :key="c" @click="selectedChallenge = c" class="option-btn" :class="{ active: selectedChallenge === c }">{{ c }}</button>
                    </div>
                  </div>

                  <!-- Step 6: Improvements -->
                  <div v-else-if="step === 6" class="space-y-8">
                    <h2 class="step-title">Which of these areas do you want to improve the most?</h2>
                    <div class="space-y-4 max-w-[400px]"><button v-for="opt in improvementOptions" :key="opt" @click="selectedImprovement = opt" class="option-btn" :class="{ active: selectedImprovement === opt }">{{ opt }}</button></div>
                  </div>

                  <!-- Step 7: Frequency -->
                  <div v-else-if="step === 7" class="space-y-8">
                    <h2 class="step-title">How frequently do you review your financial reports?</h2>
                    <div class="space-y-4 max-w-[400px]"><button v-for="opt in frequencyOptions" :key="opt" @click="selectedFrequency = opt" class="option-btn" :class="{ active: selectedFrequency === opt }">{{ opt }}</button></div>
                  </div>

                  <!-- Step 8: ERP -->
                  <div v-else-if="step === 8" class="space-y-8">
                    <h2 class="step-title">Do you use any accounting or ERP system currently?</h2>
                    <div class="space-y-4 max-w-[400px]">
                      <div v-for="opt in erpOptions" :key="opt" class="space-y-3">
                        <button @click="selectedERP = opt" class="option-btn" :class="{ active: selectedERP === opt }">{{ opt }}</button>
                        <Transition name="panel"><div v-if="opt === 'Other' && selectedERP === 'Other'" class="pt-1"><input v-model="otherERPDescription" class="image-input" placeholder="Enter System Name" /></div></Transition>
                      </div>
                    </div>
                  </div>

                  <!-- Step 9: Insights -->
                  <div v-else-if="step === 9" class="space-y-8">
                    <h2 class="step-title">What’s your preferred way to view insights?</h2>
                    <div class="space-y-4 max-w-[400px]"><button v-for="opt in insightOptions" :key="opt" @click="selectedInsight = opt" class="option-btn" :class="{ active: selectedInsight === opt }">{{ opt }}</button></div>
                  </div>

                  <!-- Step 10: Compliance -->
                  <div v-else-if="step === 10" class="space-y-8">
                    <h2 class="step-title">Would you like me to keep an eye on compliance changes for you?</h2>
                    <div class="space-y-4 max-w-[400px]"><button v-for="opt in ['Yes', 'No']" :key="opt" @click="selectedCompliance = opt" class="option-btn" :class="{ active: selectedCompliance === opt }">{{ opt }}</button></div>
                  </div>

                  <!-- Step 11: Goal -->
                  <div v-else-if="step === 11" class="space-y-8">
                    <h2 class="step-title">What’s your ultimate goal with TAXAID.AI?</h2>
                    <div class="space-y-4 max-w-[400px]"><button v-for="opt in goalOptions" :key="opt" @click="selectedGoal = opt" class="option-btn" :class="{ active: selectedGoal === opt }">{{ opt }}</button></div>
                  </div>
                </div>

                <!-- BOTTOM NEXT BUTTON -->
                <div class="mt-auto pt-8">
                  <button class="image-next-btn" :disabled="nextDisabled" @click="handleNext()">
                    {{ step === 11 ? 'Finish' : 'Next' }} <span class="font-bold ml-1">→</span>
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
        <div class="relative mb-10 flex items-center justify-center">
          <div class="absolute w-[240px] h-[240px] md:w-[380px] md:h-[380px] bg-[#00B794D1] rounded-full blur-[90px] animate-pulse-slow"></div>
          <img :src="avatarSrc" class="relative z-10 w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-[0_0_30px_rgba(4,193,143,0.5)]" alt="Success Icon" />
        </div>
        <h2 class="relative z-10 text-white text-xl md:text-2xl font-light leading-relaxed max-w-2xl mb-12">
          You're all set! Our implementation team will reach out soon to help you set up and start exploring insights with Akeel.
        </h2>
        <button class="relative z-10 image-next-btn !max-w-[320px] !h-14 !text-xl" @click="goToDashboard()">
          Go to Dashboard <span class="font-bold">→</span>
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
const entityOptions = [{ label: 'Single Entity' }, { label: 'Multiple Entities' }]
const businessDescriptions = ['Trading', 'Professional Services', 'Medical', 'Construction', 'Other']
const challengeOptions = ['Cash Flow', 'Compliance', 'Profitability', 'Cost Control', 'Growth']
const improvementOptions = ['Profitability', 'Liquidity', 'Debt Management', 'Growth', 'Efficiency']
const frequencyOptions = ['Daily', 'Weekly', 'Monthly', 'Quarterly']
const erpOptions = ['Tally', 'Zoho Books', 'QuickBooks', 'Odoo', 'Other']
const insightOptions = ['Chat-based Summaries', 'Graphical Dashboards', 'Alerts & Notifications']
const goalOptions = ['Save Time', 'Increase Profit', 'Ensure Compliance', 'Prepare for Growth']

const transitionName = computed(() => direction.value === 'next' ? 'box-slide-next' : 'box-slide-prev')
const canGoPrevious = computed(() => step.value > 1 || (step.value === 2 && currentEntity.value > 1))

function selectEntityOption(opt) {
  selectedLabel.value = opt.label
  if (opt.label === 'Single Entity') {
    entitiesCount.value = 1
    entityForms.value = [{ legalName: '', nickName: '' }]
  } else if (entitiesCount.value < 2) {
    entitiesCount.value = 2
    entityForms.value = [{ legalName: '', nickName: '' }, { legalName: '', nickName: '' }]
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

function handleSubNext() { if (currentEntity.value < entitiesCount.value) { direction.value = 'next'; currentEntity.value++ } else { handleNext() } }

function handlePrevious() {
  direction.value = 'prev'
  if (step.value === 4 && selectedLabel.value === 'Single Entity') { step.value = 1; return }
  if (step.value === 2 && currentEntity.value > 1) { currentEntity.value--; return }
  step.value--
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

/* QUESTION BOX - EQUAL HEIGHT ON DESKTOP */
.question-box { 
  width: 100%; max-width: 550px; min-height: 550px; padding: 30px; border-radius: 40px; 
  background: radial-gradient(ellipse at top left, rgba(0, 88, 71, 0.3) 0%, rgba(0, 50, 43, 0.98) 100%); 
  border: 1px solid rgba(1, 88, 71, 0.5); backdrop-filter: blur(60px); display: flex; flex-direction: column; 
}
@media (min-width: 1024px) { .question-box { min-height: 700px; padding: 45px; border-radius: 60px; } }

.step-title { color: #04C18F; font-size: 20px; font-weight: 500; line-height: 1.3; max-width: 480px; }
@media (min-width: 1024px) { .step-title { font-size: 24px; } }

/* IMAGE STYLE: INPUTS */
.image-input {
    width: 100%; height: 52px; background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 999px;
    padding: 0 28px; color: white; font-size: 16px; outline: none; transition: 0.3s;
}
.image-input:focus { border-color: #04C18F; background: rgba(255, 255, 255, 0.06); }

/* PROGRESS BAR STYLES */
.entity-progress-wrapper { position: relative; width: 100%; max-width: 320px; display: flex; align-items: center; }
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
.option-btn { width: 100%; text-align: left; padding: 16px 28px; border-radius: 50px; color: white; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.02); transition: 0.3s; font-size: 16px; }
.option-btn.active { border-color: #04C18F; background: rgba(4, 193, 143, 0.15); }

/* CTA BUTTON */
.image-next-btn {
    width: 100%; max-width: 240px; height: 54px; border-radius: 999px; color: white; font-weight: 600; font-size: 18px; border: none;
    background: linear-gradient(90deg, #00C79F 0%, #0A6B59 100%); cursor: pointer; transition: 0.2s;
}
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