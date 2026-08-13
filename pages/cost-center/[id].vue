<template>
  <NuxtLayout name="dashboard">
    <div v-if="!isFullScreenChat" class="h-screen font-sans flex overflow-hidden relative z-10" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <div class="flex-1 overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-0 pt-8" :class="[
        isChatOpen
          ? (currentLang === 'ar' ? '2xl:ml-[480px] ml-[400px]' : '2xl:mr-[480px] mr-[400px]')
          : (currentLang === 'ar' ? 'lg:ml-[170px] ml-0' : 'lg:mr-[170px] mr-0')
      ]">

        <div class="mx-auto pt-8 lg:pt-0 max-w-[1600px] flex flex-col gap-8">
          <CostCenterProjectDetailHeader ref="headerRef" @reload="fetchData"
            @export-pdf="handleExportPDF" @selected-date="handleDateChange"
            :title="{ en: data?.cost_center ?? costCenterId, ar: data?.cost_center ?? costCenterId }" />

          <!-- Gap-period snapshot notice: shown when the requested date has no
               cost center data and the latest earlier period is displayed -->
          <div v-if="snapshotNotice"
            class="-mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span v-if="currentLang === 'ar'">عرض بيانات <b>{{ data?.snapshot_date }}</b> (آخر بيانات متاحة) — لا توجد بيانات للتاريخ المحدد {{ data?.requested_date }}</span>
            <span v-else>Showing data of <b>{{ data?.snapshot_date }}</b> (latest available) — no data for the selected date {{ data?.requested_date }}.</span>
          </div>

          <!-- Skeleton -->
          <template v-if="loading">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div v-for="i in 4" :key="i" class="rounded-2xl h-28 animate-pulse"
                :class="isDark ? 'bg-white/10' : 'bg-gray-100'" />
            </div>
            <div class="rounded-2xl h-64 animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'" />
            <div class="rounded-2xl h-[500px] animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'" />
          </template>

          <template v-else>
            <CostCenterProjectDetailSummaryCards :summary-data="data?.contract_summary" />
            <CostCenterProjectDetailTable ref="tableRef" :data="data" />
            <div class="h-[500px]">
              <CostCenterProjectDetailRevenueVsCost :data="data" />
            </div>
          </template>
        </div>
      </div>

      <aside class="fixed z-[1000] transition-all duration-500 ease-in-out" :class="[
        currentLang === 'ar' ? 'left-0' : 'right-0',
        'lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:mt-5',
        isChatOpen
          ? 'bottom-0 w-full translate-y-0'
          : 'bottom-24 w-[80px]',
        isChatOpen ? 'lg:2xl:w-120 lg:w-100' : 'lg:w-[80px]'
      ]">
        <CommonChatSideBar v-model:isChatOpen="isChatOpen" @expand="isFullScreenChat = true" />
      </aside>
    </div>

    <div v-else class="w-full flex overflow-hidden">

      <TaxQueriesLeftSideBar @close="isFullScreenChat = false" />

      <main class="flex-1">
        <TaxQueriesChatWindow :isMinimized="false" class="flex-1 min-h-0 h-[calc(100vh-90px)] ml-12" />
      </main>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from 'vue'

const isChatOpen = ref(false)
const isFullScreenChat = ref(false)
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const headerRef = ref(null)
const tableRef = ref(null)
const route = useRoute()

const todayDDMMYYYY = () => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
}

const date = computed(() => route.query.date)
const data = ref({})
const loading = ref(true)
const selectedDate = ref(route.query.date || todayDDMMYYYY())
const costCenterId = computed(() => decodeURIComponent(route.params.id))
const snapshotNotice = computed(() => {
  return !!(data.value?.snapshot_date && data.value?.requested_date && data.value.snapshot_date !== data.value.requested_date)
})

const fetchProjectData = async () => {
  loading.value = true
  try {
    const response = await useApi(
      `cost-center/cost-center-summary?date=${selectedDate.value}&cost_center_id=${costCenterId.value}`
    )
    data.value = response
  } catch (error) {
    console.error("Error fetching detail:", error)
  } finally {
    loading.value = false
  }
}
const fetchData = () => fetchProjectData()

const handleDateChange = (period) => {
  selectedDate.value = period.en
  fetchProjectData()
}

// --- 3. EXPORT LOGIC ---
const exportPDF = async () => {
  console.warn("PDF export is currently disabled.");
};
onMounted(() => {
  fetchProjectData()
})
</script>