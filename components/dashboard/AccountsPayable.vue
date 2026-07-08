<template>
  <div class="rounded-[20px] p-4 flex flex-col h-[225px] relative overflow-hidden group cursor-pointer transition-all duration-300 border border-transparent"
    :class="[
      isDark ? 'bg-[#002e26]' : 'bg-white',
      isHovered ? 'shadow-[0_0_15px_#00B794] border-[#00B794]/30' : 'shadow-sm hover:shadow-[0_0_10px_#00B794]'
    ]"
    @mouseenter="hoveredMenuItem = 'Accounts Payable'"
    @mouseleave="hoveredMenuItem = null">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div 
          class="w-10 h-10 rounded-full grid place-items-center"
          :style="isDark ? { background: '#00B794' } : { background: 'linear-gradient(313.43deg, rgba(223, 255, 248, 0.9) 14.29%, rgba(109, 216, 193, 0.9) 81.93%)' }"
        >
          <img src="/images/icons/Accounts-Payable-black.svg" alt="Payable" class="w-5 h-5 object-contain" />
        </div>
        <div class="font-medium text-xl" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'حسابات الدفع' : 'Accounts Payable' }}</div>
      </div>
      <img 
        src="/images/icons/right-hover-2.svg" 
        alt="Arrow" 
        class="w-[35px] h-[35px] transition-all duration-300"
        :class="isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
      />
    </div>

    <!-- Main Content -->
    <div class="flex justify-between items-end">
      <div class="flex flex-col">
        <div class="text-[12px] font-medium transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'">{{ currentLang === 'ar' ? 'إجمالي الذمم الدائنة المستحقة' : 'Total Outstanding Payables' }}</div>
        <div class="text-[34px] font-semibold mt-1 flex items-center transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#000]'">
          <span class="mr-1"><img :src="isDark ? '/images/icons/AED-dark.svg' : '/images/icons/AED.svg'" alt="AED" class="w-7" /></span>{{ formatNumber(totalPayables) }}
        </div>
        <div v-if="vsLastMonth" class="flex items-center gap-1 font-medium text-[14px] mt-2" :class="trend === 'down' ? 'text-[#FB7554]' : 'text-[#05B743]'">
           <span><img :src="trend === 'down' ? '/images/icons/down-right.svg' : '/images/icons/up.svg'" alt="trend" class="w-4 h-4" /></span>
           <span>{{ vsLastMonth }} vs last month</span>
        </div>
      </div>

      <!-- Small Bar Chart — real aging buckets (0-30, 31-60, 61-90, 90+),
           each scaled against the largest bucket. min 6% so empty buckets
           still show a stub. -->
      <div class="flex items-end gap-2 h-20 mb-1 animate-sweep-right">
        <div v-for="(bar, i) in agingBars" :key="i"
          class="w-3 rounded-full"
          :class="i % 2 === 0 ? 'bg-[#00B794]' : 'bg-[#004D4E]'"
          :style="{ height: `${Math.max(6, bar)}%` }"></div>
      </div>
    </div>

    <!-- Footer Stats -->
    <div class="flex flex-col gap-1">
      <div class="text-[12px]">
        <span class="text-gray-400 transition-colors duration-300" :class="isDark ? 'text-white/40' : 'text-gray-400'">{{ currentLang === 'ar' ? 'تجاوزت موعد الاستحقاق: ' : 'Overdue: ' }}</span>
        <span class="font-bold transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#000]'">{{ overdue }}</span>
      </div>
      <div class="text-[12px]">
        <span class="text-gray-400 transition-colors duration-300" :class="isDark ? 'text-white/40' : 'text-gray-400'">{{ currentLang === 'ar' ? 'مستحقة في الـ 30 يوم القادمة: ' : 'Due in next 30 days: ' }}</span>
        <span class="font-bold transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#000]'">{{ dueInNext30Days }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()
const hoveredMenuItem = useState('hoveredMenuItem')
const isHovered = computed(() => hoveredMenuItem.value === 'Accounts Payable')

// ── Pull values from website-data.json ────────────────────────────────────
const { accountsPayable } = useDashboard()

const totalPayables   = computed(() => accountsPayable.value?.totalOutstandingPayables ?? 0)
// No real month-over-month comparison is available from the backend for AP —
// leave empty rather than show a fabricated trend/percentage.
const vsLastMonth     = computed(() => accountsPayable.value?.vsLastMonth ?? '')
const trend           = computed(() => accountsPayable.value?.trend ?? 'up')
const overdue         = computed(() => accountsPayable.value?.overdue ?? 0)
const dueInNext30Days = computed(() => accountsPayable.value?.dueInNext30Days ?? 0)
const agingBars       = computed(() => accountsPayable.value?.agingBars ?? [0, 0, 0, 0])

const formatNumber = (n: number) => new Intl.NumberFormat('en-AE').format(n)
</script>

<style scoped>
@keyframes sweep-right {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}

.animate-sweep-right {
  animation: sweep-right 1.2s ease-out forwards;
}
</style>
