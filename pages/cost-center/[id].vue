<template>
  <NuxtLayout name="dashboard">
    <div v-if="!isFullScreenChat" class="min-h-screen font-sans flex relative z-10" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <div class="flex-1 min-w-0 transition-all duration-500 ease-in-out lg:p-8 p-0 pt-8" :class="[
        isChatOpen
          ? (currentLang === 'ar' ? '2xl:ml-[480px] ml-[400px]' : '2xl:mr-[480px] mr-[400px]')
          : (currentLang === 'ar' ? 'lg:ml-[170px] ml-0' : 'lg:mr-[170px] mr-0')
      ]">

        <div class="mx-auto pt-8 lg:pt-0 max-w-[1600px] flex flex-col gap-8">
          <CostCenterProjectDetailHeader ref="headerRef" @reload="fetchData"
            @export-excel="handleExport" @selected-date="handleDateChange"
            :title="data?.cost_center ? { en: data.cost_center, ar: data.cost_center } : null"
            :selected-date="selectedDate" :max-date="maxDate" :period="data?.period" />

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

          <!-- Skeleton (mirrors the summary cards, table and chart below) -->
          <template v-if="loading">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="i in 3" :key="i" class="p-6 rounded-2xl border animate-pulse"
                :class="isDark ? 'bg-[#002B21] border-white/5' : 'bg-white border-[#03D8B0]/40 shadow-sm'">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-5 h-5 rounded-full" :class="skBar" />
                  <div class="h-[14px] w-28 rounded" :class="skBar" />
                </div>
                <div class="flex items-baseline gap-2">
                  <div class="h-[10px] w-7 rounded" :class="skBar" />
                  <div class="h-[20px] w-24 rounded" :class="skBar" />
                </div>
              </div>
            </div>

            <div class="w-full overflow-hidden rounded-3xl animate-pulse" :class="isDark ? 'bg-[#00141080]' : 'bg-white shadow-sm'">
              <div class="py-5 px-8 flex justify-between items-center">
                <div>
                  <div class="h-[16px] w-44 rounded" :class="skBar" />
                  <div class="h-[12px] w-32 rounded mt-2" :class="skBar" />
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-4 h-4 rounded-full" :class="skBar" />
                  <div class="w-6 h-6 rounded" :class="skBar" />
                </div>
              </div>
              <div class="grid grid-cols-[2fr_1fr_1fr_1fr] gap-6 px-8 py-5" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]/80'">
                <div class="h-[14px] w-24 rounded bg-white/50" />
                <div class="h-[14px] w-14 rounded bg-white/50 ml-auto rtl:mr-auto rtl:ml-0" />
                <div class="h-[14px] w-14 rounded bg-white/50 ml-auto rtl:mr-auto rtl:ml-0" />
                <div class="h-[14px] w-20 rounded bg-white/50 mx-auto" />
              </div>
              <div v-for="r in 8" :key="r" class="grid grid-cols-[2fr_1fr_1fr_1fr] gap-6 px-8 py-5 border-b"
                :class="isDark ? 'border-white/5' : 'border-[#F2F2F2]'">
                <div class="h-[14px] rounded" :class="[skBar, r % 3 === 0 ? 'w-40' : 'w-56']" />
                <div class="h-[14px] w-16 rounded ml-auto rtl:mr-auto rtl:ml-0" :class="skBar" />
                <div class="h-[14px] w-16 rounded ml-auto rtl:mr-auto rtl:ml-0" :class="skBar" />
                <div class="h-[14px] w-16 rounded mx-auto" :class="skBar" />
              </div>
            </div>

            <div class="h-[500px]">
              <div class="w-full h-full rounded-[24px] p-8 shadow-sm flex flex-col animate-pulse"
                style="background: linear-gradient(205.59deg, #005A48 8.7%, #00342A 83.81%);">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="h-[16px] w-72 max-w-full rounded bg-white/25" />
                    <div class="h-[12px] w-32 rounded bg-white/15 mt-2" />
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="h-3 w-16 rounded bg-white/20" />
                    <div class="h-3 w-16 rounded bg-white/20" />
                  </div>
                </div>
                <div class="flex-1 flex items-end gap-6 pt-10">
                  <div v-for="n in 7" :key="n" class="flex-1 flex items-end gap-2 h-full">
                    <div class="flex-1 rounded-t bg-white/20" :style="{ height: [45, 70, 55, 85, 60, 75, 50][n - 1] + '%' }" />
                    <div class="flex-1 rounded-t bg-white/10" :style="{ height: [60, 50, 75, 65, 80, 55, 70][n - 1] + '%' }" />
                  </div>
                </div>
              </div>
            </div>
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

      <Teleport to="body">
        <div v-if="exportOpen" class="fixed inset-0 z-[1200] flex items-center justify-center p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeExport"></div>
          <div class="relative w-full max-w-[460px] rounded-[24px] shadow-2xl overflow-hidden p-6"
            :class="isDark ? 'bg-[#002E26] border border-[#03D8B0]/20 text-white' : 'bg-white border border-gray-100 text-[#013e32]'" @click.stop>
            <div class="flex items-start justify-between gap-4 mb-4">
              <div class="min-w-0">
                <h2 class="text-xl font-bold">{{ currentLang === 'ar' ? 'تصدير' : 'Export' }}</h2>
                <p class="text-[13px] mt-0.5 truncate" :class="isDark ? 'text-white/60' : 'text-gray-500'">{{ data?.cost_center }}</p>
              </div>
              <button @click="closeExport" class="p-1 rounded-lg cursor-pointer" :class="isDark ? 'text-white/60 hover:bg-white/10' : 'text-gray-400 hover:bg-gray-100'">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <p class="text-[12px] mb-2" :class="isDark ? 'text-white/60' : 'text-gray-500'">{{ currentLang === 'ar' ? 'الصيغة' : 'Format' }}</p>
            <button type="button" class="w-full flex items-center justify-between px-4 h-[44px] rounded-[10px] border text-[14px] font-medium"
              :class="isDark ? 'bg-[#00FFBC]/15 border-[#00FFBC] text-[#00FFBC]' : 'bg-[#E6FFF5] border-[#04C18F] text-[#013e32]'">
              <span>{{ currentLang === 'ar' ? 'إكسل (.xlsx)' : 'Excel (.xlsx)' }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            </button>

            <p class="text-[13px] mt-4" :class="isDark ? 'text-white/70' : 'text-gray-600'">
              {{ currentLang === 'ar' ? 'سيتم تصدير بيانات هذا المشروع حتى' : 'This project will be exported as of' }}
              <b>{{ exportDateLabel }}</b>.
            </p>
            <p v-if="exportMessage" class="text-[13px] text-red-500 mt-3">{{ exportMessage }}</p>

            <div class="flex justify-end gap-3 mt-6">
              <button @click="closeExport" class="px-5 h-[40px] rounded-[10px] text-sm font-medium cursor-pointer"
                :class="isDark ? 'text-white/70 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'">{{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}</button>
              <button @click="confirmExport" :disabled="exporting"
                class="px-5 h-[40px] rounded-[10px] bg-[#00896F] text-white text-sm font-medium hover:bg-[#00705a] disabled:opacity-60 cursor-pointer">
                {{ exporting ? (currentLang === 'ar' ? 'جارٍ التصدير...' : 'Exporting...') : (currentLang === 'ar' ? 'تنزيل' : 'Download') }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

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
        <TaxQueriesChatWindow @shrink="isFullScreenChat = false" :isMinimized="false" class="flex-1 min-h-0 h-[calc(100vh-90px)] ml-12" />
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
const skBar = computed(() => (isDark.value ? 'bg-white/10' : 'bg-gray-200'))
const tableRef = ref(null)
const route = useRoute()

const date = computed(() => route.query.date)
const data = ref({})
const loading = ref(true)
const selectedDate = ref(route.query.date || '')
const costCenterId = computed(() => decodeURIComponent(route.params.id))
const snapshotNotice = computed(() => {
  return !!(data.value?.snapshot_date && data.value?.requested_date && data.value.snapshot_date !== data.value.requested_date)
})

const fetchProjectData = async () => {
  loading.value = true
  try {
    const response = await useApi(
      `cost-center/cost-center-summary?${selectedDate.value ? `date=${selectedDate.value}&` : ''}cost_center_id=${costCenterId.value}`
    )
    data.value = response

    if (!selectedDate.value && response?.requested_date) {
      const [y, m, d] = String(response.requested_date).split('-')
      selectedDate.value = `${d}-${m}-${y}`
    }
  } catch (error) {
    console.error("Error fetching detail:", error)
  } finally {
    loading.value = false
  }
}
const fetchData = () => {
  selectedDate.value = ''
  return fetchProjectData()
}

const handleDateChange = (period) => {
  selectedDate.value = period.custom_from
  fetchProjectData()
}

const maxDate = computed(() => {
  const m = String(data.value?.today || '').match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null
})

// --- 3. EXPORT LOGIC ---
const { exportPart, exporting } = useExport()
const exportOpen = ref(false)
const exportMessage = ref('')
const handleExport = () => { exportMessage.value = ''; exportOpen.value = true }
const closeExport = () => { if (!exporting.value) exportOpen.value = false }
const exportDateLabel = computed(() => {
  const m = String(selectedDate.value || '').match(/^(\d{2})-(\d{2})-(\d{4})$/)
  return m ? formatDisplayDate(`${m[3]}-${m[2]}-${m[1]}`) : (currentLang.value === 'ar' ? 'اليوم' : 'today')
})
const confirmExport = async () => {
  exportMessage.value = ''
  const result = await exportPart('cost-center', 'detail', {
    ...(selectedDate.value ? { date: selectedDate.value } : {}),
    cost_center_id: costCenterId.value,
  }, { showError: false })
  if (result?.ok) exportOpen.value = false
  else exportMessage.value = result?.message || (currentLang.value === 'ar' ? 'فشل التصدير.' : 'The export failed.')
}
onMounted(() => {
  fetchProjectData()
})
</script>