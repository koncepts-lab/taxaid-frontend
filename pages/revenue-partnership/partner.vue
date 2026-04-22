<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300"
    :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'"
    :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

    <!-- HEADER -->
    <DashboardHeader />

    <!-- CONTENT -->
    <main class="flex-1 px-8 pb-[0px] pt-8 space-y-6 overflow-y-auto" style="margin-top: -18px;">

      <!-- Alert Banner -->
      <div v-if="showAlert && dynamicAlert.text"
        class="bg-[#FEFCE8] border border-[#FFF085] rounded-[16px] p-4 flex items-center justify-between shadow-sm relative pr-12">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-[#FFBB0D] rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="text-white w-6 h-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 class="text-[16px] font-semibold text-[#854D0E]">
              {{ currentLang === 'ar' ? dynamicAlert.titleAr : dynamicAlert.title }}
            </h4>
            <p class="text-[14px] font-normal text-[#854D0E]">
              {{ currentLang === 'ar' ? dynamicAlert.textAr : dynamicAlert.text }}
            </p>
          </div>
        </div>
        <button @click="showAlert = false" class="text-[#854D0E] hover:text-black transition-colors cursor-pointer absolute top-4 right-4 rtl:right-auto rtl:left-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Stat Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(stat, idx) in mainStats" :key="idx"
          class="bg-white rounded-[24px] p-6 border border-[#04C18F80] transition-all hover:shadow-lg group">
          <div class="flex justify-between items-start mb-3">
            <h5 class="text-[18px] font-medium text-[#00000080]">{{ stat.displayTitle }}</h5>
            <div class="w-10 h-10 flex items-center justify-center text-[#04C18F]">
              <img :src="stat.icon" class="w-8 h-8" alt="icon" />
            </div>
          </div>
          <div class="flex items-baseline gap-2 mb-2">
            <img v-if="stat.isCurrency" src="/images/icons/dirham-black.svg" alt="AED" class="w-6 h-6 self-center" />
            <span class="text-[30px] font-normal text-[#1a1a1a] leading-[45px]">{{ stat.value }}</span>
          </div>
          <p v-if="stat.displaySubtext" class="text-[14px] text-[#999]">{{ stat.displaySubtext }}</p>
        </div>
      </div>

      <!-- Partner Summary -->
      <div class="bg-white rounded-[24px] p-6 border border-[#0000001A] shadow-sm">
        <div class="flex items-center justify-between mb-6 px-4">
          <h3 class="text-[20px] font-normal text-[#0A0A0A]">
            {{ currentLang === 'ar' ? dynamicPartnerSummary.titleAr : dynamicPartnerSummary.title }}
            ({{ dynamicPartnerSummary.partners?.length }} {{ currentLang === 'ar' ? 'شركاء' : 'partners' }})
          </h3>
          <button
            class="flex items-center gap-2 bg-[#A1FFE64D] border border-[#04C18F80] px-6 py-2 rounded-[8px] text-[#0A0A0A] font-medium text-[14px] hover:bg-[#A1FFE666] transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {{ currentLang === 'ar' ? dynamicPartnerSummary.exportBtnAr : dynamicPartnerSummary.exportBtn }}
          </button>
        </div>

        <!-- Conditional Partner Grid/Carousel -->
        <div class="px-4 pb-4">
          <div
            :class="partnerCards.length > 4 ? 'flex overflow-x-auto gap-4 snap-x hide-scrollbar scroll-smooth' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'">
            <div v-for="partner in partnerCards" :key="partner.name"
              class="bg-[#E4FFF6B0] border border-[#04C18F80] rounded-[10px] p-6 relative transition-all hover:bg-[#E4FFF6]"
              :class="partnerCards.length > 4 ? 'min-w-[calc(25%-12px)] p-6 snap-start' : 'w-full'">
              <h4 class="text-[16px] font-medium text-[#1a1a1a] mb-6">{{ partner.name }}</h4>
              <div class="space-y-3">
                <div v-for="(m, midx) in partner.displayMetrics" :key="midx">
                  <div v-if="m.isRate" class="border-t border-[#04C18F40] mt-3 pt-3 mb-1"></div>
                  <div class="flex justify-between items-center">
                    <span class="text-[14px]" :class="isDark ? 'text-white' : 'text-[#000000B2]'">{{ m.displayLabel }}</span>
                    <span class="text-[14px] font-medium flex items-center gap-1"
                      :class="m.isRate ? 'text-[#155DFC]' : (m.isCurrency ? 'text-[#00A63E]' : 'text-[#1a1a1a]')">
                      <img v-if="m.isCurrency" src="/images/icons/dirham-black.svg" alt="AED"
                        class="w-3.5 h-3.5" :class="m.label === 'Collected:' ? 'grayscale-0' : 'grayscale'" />
                      {{ m.value }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Details & Management -->
      <div class="bg-white rounded-[24px] p-8 border border-[#0000001A] shadow-sm">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <h3 class="text-[20px] font-normal text-[#0A0A0A] w-full md:w-auto">
            {{ currentLang === 'ar' ? dynamicPaymentDetails.titleAr : dynamicPaymentDetails.title }}
          </h3>
          <span class="text-[12px] text-gray-400">
            {{ currentLang === 'ar' ? dynamicPaymentDetails.unitTextAr : dynamicPaymentDetails.unitText }}
          </span>
        </div>

        <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div class="flex flex-wrap items-center gap-3 w-full">
            <div class="relative flex-1 md:w-[450px]">
              <span class="absolute top-1/2 -translate-y-1/2 text-[#00000080]" :class="currentLang === 'ar' ? 'right-4' : 'left-4'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input type="text" :placeholder="currentLang === 'ar' ? dynamicPaymentDetails.searchPlaceholderAr : dynamicPaymentDetails.searchPlaceholder"
                class="w-full h-[44px] bg-white border border-[#04C18F80] rounded-[6px] outline-none focus:border-[#007C65] transition-all text-[14px] text-[#000] placeholder:text-gray-400"
                :class="currentLang === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'">
            </div>

            <div class="relative w-full md:w-[280px]">
              <button @click="isStatusDropdownOpen = !isStatusDropdownOpen"
                class="flex items-center w-full h-[44px] bg-white border border-[#04C18F80] rounded-[6px] px-4 outline-none transition-all cursor-pointer">
                <span class="text-[#00000080]" :class="currentLang === 'ar' ? 'ml-3' : 'mr-3'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </span>
                <span class="text-[#000] text-[14px] flex-1 text-left rtl:text-right">{{ selectedStatus }}</span>
                <span class="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200"
                    :class="{ 'rotate-180': isStatusDropdownOpen }" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <!-- Dropdown Menu -->
              <div v-if="isStatusDropdownOpen"
                class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-[12px] shadow-xl z-50 p-2 space-y-1">
                <div v-for="status in statuses" :key="status"
                  @click="selectedStatus = status; isStatusDropdownOpen = false"
                  class="px-4 py-2.5 rounded-[8px] text-[14px] cursor-pointer transition-colors"
                  :class="selectedStatus === status ? 'bg-[#E4FFF6B0] text-[#000]' : 'text-gray-600 hover:bg-gray-50'">
                  {{ status }}
                </div>
              </div>
            </div>

            <button
              class="h-[44px] flex items-center gap-2 bg-[#A1FFE64D] border border-[#04C18F80] px-6 py-2 rounded-[6px] text-[#0A0A0A] font-medium text-[14px] hover:bg-[#A1FFE666] transition-colors cursor-pointer ml-auto rtl:ml-0 rtl:mr-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {{ currentLang === 'ar' ? dynamicPaymentDetails.exportBtnAr : dynamicPaymentDetails.exportBtn }}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto rounded-[10px] border border-gray-100">
          <table class="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th v-for="(col, cidx) in displayColumns" :key="cidx" class="px-6 py-4 font-normal text-[14px]"
                  :class="{ 'relative': col === 'Partner Name' || col === 'اسم الشريك' }">
                  <div v-if="col === 'Partner Name' || col === 'اسم الشريك'" @click="isPartnerMenuOpen = !isPartnerMenuOpen"
                    class="flex items-center gap-1 cursor-pointer select-none">
                    {{ col }}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 transition-transform duration-200"
                      :class="{ 'rotate-180': isPartnerMenuOpen }" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div v-else-if="col === 'Revenue' || col === 'الإيرادات' || col === 'Collected' || col === 'المحصل' || col === 'Settlement' || col === 'التسوية'" class="flex items-center gap-1">
                    {{ col }}
                    <img src="/images/icons/dirham-black.svg" alt="AED"
                      class="w-3 h-3 invert contrast-[200%] grayscale" />
                  </div>
                  <template v-else>{{ col }}</template>

                  <!-- Partner Multi-Select Dropdown -->
                  <div v-if="(col === 'Partner Name' || col === 'اسم الشريك') && isPartnerMenuOpen"
                    class="absolute top-full left-0 rtl:left-auto rtl:right-0 mt-1 bg-white border border-gray-100 rounded-[16px] shadow-2xl z-50 p-3 min-w-[240px]">
                    <div class="space-y-2">
                      <div v-for="p in dynamicPartnerSummary.partners" :key="p.name"
                        @click="togglePartnerFilter(p.name)"
                        class="flex items-center gap-3 p-2 rounded-[12px] hover:bg-gray-50 cursor-pointer transition-colors group">
                        <div class="w-6 h-6 rounded-[6px] flex items-center justify-center transition-all flex-shrink-0"
                          :class="selectedPartners.includes(p.name) ? 'bg-[#00896F]' : 'border-2 border-gray-300 group-hover:border-[#00896F80]'">
                          <svg v-if="selectedPartners.includes(p.name)" xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clip-rule="evenodd" />
                          </svg>
                        </div>
                        <span class="text-[14px] font-normal"
                          :class="selectedPartners.includes(p.name) ? 'text-[#000]' : 'text-gray-700'">
                          {{ p.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="row in paymentTable" :key="row.code" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-[13px] text-gray-700">{{ row.code }}</td>
                <td class="px-6 py-4 text-[13px] text-gray-700">{{ row.partner }}</td>
                <td class="px-6 py-4 text-[13px] text-gray-700">{{ row.company }}</td>
                <td class="px-6 py-4 text-[13px] text-gray-700 text-center">{{ row.period }}</td>
                <td class="px-6 py-4 text-[13px] text-gray-700 text-center">{{ row.year }}</td>
                <td class="px-6 py-4 text-[13px] text-gray-700 text-center">{{ row.revenue }}</td>
                <td class="px-6 py-4 text-[13px] text-gray-700 text-center">{{ row.collected }}</td>
                <td class="px-6 py-4 text-[13px] text-gray-700 text-center">{{ row.settlement }}</td>
                <td class="px-6 py-4">
                  <span :class="row.status === 'Paid' ? 'bg-[#00896F] text-white' : 'bg-[#EF4444] text-white'"
                    class="px-4 py-1 rounded-full text-[12px] font-medium block w-fit mx-auto">
                    {{ currentLang === 'ar' ? (row.status === 'Paid' ? 'مدفوع' : 'فشل') : row.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- FOOTER -->
    <DashboardFooter />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: false
})

const currentLang = useState('currentLang', () => 'en')
const { isDark, toggleTheme } = useTheme()

const {
  alert: dynamicAlert,
  mainStats: dynamicMainStats,
  partnerSummary: dynamicPartnerSummary,
  paymentDetails: dynamicPaymentDetails
} = useRevenuePartnershipPartnerPage()

const showAlert = ref(true)
const isStatusDropdownOpen = ref(false)
const selectedStatus = ref('All Statuses')
const isPartnerMenuOpen = ref(false)

// Select all partners by default once they are loaded
const selectedPartners = ref([])
watchEffect(() => {
  if (dynamicPartnerSummary.value?.partners?.length > 0 && selectedPartners.value.length === 0) {
    selectedPartners.value = dynamicPartnerSummary.value.partners.map(p => p.name)
  }
})

const togglePartnerFilter = (partnerName) => {
  const index = selectedPartners.value.indexOf(partnerName)
  if (index > -1) {
    selectedPartners.value.splice(index, 1)
  } else {
    selectedPartners.value.push(partnerName)
  }
}

// Stats Mapping
const mainStats = computed(() => {
  return dynamicMainStats.value.map(stat => ({
    ...stat,
    displayTitle: currentLang.value === 'ar' ? stat.titleAr : stat.title,
    displaySubtext: currentLang.value === 'ar' ? stat.subtextAr : stat.subtext
  }))
})

// Partner Summary Mapping
const partnerCards = computed(() => {
  return (dynamicPartnerSummary.value?.partners ?? []).map(partner => ({
    ...partner,
    displayMetrics: partner.metrics.map(m => ({
      ...m,
      displayLabel: currentLang.value === 'ar' ? m.labelAr : m.label
    }))
  }))
})

// Payment Table Logic
const paymentTable = computed(() => {
  let rows = dynamicPaymentDetails.value?.table?.rows ?? []
  
  if (selectedStatus.value !== 'All Statuses' && selectedStatus.value !== 'كل الحالات') {
    rows = rows.filter(r => r.status === selectedStatus.value || (selectedStatus.value === 'Paid' && r.status === 'Paid') || (selectedStatus.value === 'Failed' && r.status === 'Failed'))
  }
  
  if (selectedPartners.value.length > 0) {
    rows = rows.filter(r => selectedPartners.value.includes(r.partner))
  }
  
  return rows
})

const statuses = computed(() => {
  return currentLang.value === 'ar' ? dynamicPaymentDetails.value?.statusesAr : dynamicPaymentDetails.value?.statuses
})

const displayColumns = computed(() => {
  return currentLang.value === 'ar' ? dynamicPaymentDetails.value?.table?.columnsAr : dynamicPaymentDetails.value?.table?.columns
})

</script>

<style scoped>
/* Custom scrollbar for main area */
main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: transparent;
}

main::-webkit-scrollbar-thumb {
  background: #E5E5E5;
  border-radius: 10px;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
