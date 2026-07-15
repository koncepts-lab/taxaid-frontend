<template>
  <NuxtLayout name="dashboard">

    <!-- 1. Container fills the screen height and prevents page-level scrolling -->
    <div v-if="!isFullScreenChat" class="h-screen font-sans flex overflow-hidden relative z-10" :class="{ '': isDark }"
      :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

      <!-- 2. LEFT AREA: Resizes dynamically -->
      <div class="flex-1 overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-0 pt-8" :class="[
        isChatOpen
          ? (currentLang === 'ar' ? '2xl:ml-[480px] ml-[400px]' : '2xl:mr-[480px] mr-[400px]')
          : (currentLang === 'ar' ? 'lg:ml-[170px] ml-0' : 'lg:mr-[170px] mr-0')
      ]">
        <div class="mx-auto pt-8 lg:pt-0">

          <CommonDashboardHeader ref="headerRef" :title="{ en: 'Cost Center Analysis', ar: 'تحليل مركز التكلفة' }"
            :subtitle="{ en: 'Track Overheads and Optimize Operational Costs', ar: 'تتبع النفقات العامة وتحسين التكاليف التشغيلية' }"
            :oneclickreview="false" :periods="costCenterPeriods"
            @export-pdf="handleExportPDF"
            @selected-date="handleDateChange" @reload="fetchData" />
          <div class="my-8">
            <CostCenterSummary ref="summaryRef" />
          </div>

          <div>
            <div class="h-[620px]">
              <CostCenterOverallRevenueVsCost />
            </div>
          </div>

        </div>
      </div>

      <!-- 3. RIGHT SIDEBAR -->
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

    <div v-else class="w-full flex overflow-hidden" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <!-- Full Sidebar version -->
      <aside class="w-80 shrink-0 h-[calc(100vh-90px)]">
        <TaxQueriesLeftSideBar @close="isFullScreenChat = false" />
      </aside>

      <!-- Main Chat Window -->
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

onMounted(() => useLocation().syncSessionLocation())


const handleDateUpdate = (payload) => {
  filters.value = payload;

  fetchTabData(activeTab.value);
}
const summaryRef = ref(null)
const headerRef = ref(null)

const { fetchChart, activeDate: ccDate } = useCostCenterChart()

const costCenterPeriods = [
  // { en: 'This Year', ar: 'هذه السنة' },   // not supported — backend uses single date, no range_option
  // { en: 'Last Year', ar: 'السنة الماضية' }, // not supported
  { en: 'Custom Date', ar: 'تاريخ مخصص' },    // ✅ maps to ?date=dd-MM-yyyy
]

const fetchData = async () => {
  if (headerRef.value) headerRef.value.resetToDefault()
  ccDate.value = '31-12-2025'
  await Promise.all([
    summaryRef.value?.fetchSummaryData(),
    fetchChart()
  ])
}

const handleDateChange = (period) => {
  if (period.custom_to) {
    const [d, m, y] = period.custom_to.split('-')
    ccDate.value = `${d}-${m}-${y}`
  } else if (period.custom_from) {
    const [d, m, y] = period.custom_from.split('-')
    ccDate.value = `${d}-${m}-${y}`
  }
  summaryRef.value?.fetchSummaryData(ccDate.value)
  fetchChart()
}

const handleExportPDF = async () => {
  if (!process.client) return;

  // 4. Access data through the ref
  const childData = summaryRef.value?.tableData || []
  const childTotal = summaryRef.value?.summaryTotal

  if (childData.length === 0) return;

  try {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape is better for tables

    const body = childData.map(row => [
      row.label,
      row.revenue,
      row.cogs,
      row.indirectExp,
      row.profit,
      row.margin + '%'
    ]);

    if (childTotal) {
      body.push([childTotal.label, childTotal.revenue, childTotal.cogs, childTotal.indirectExp, childTotal.profit, childTotal.margin + '%'])
    }

    doc.setFontSize(18);
    doc.text(`Cost Center Summary Report`, 14, 15);
    autoTable(doc, {
      head: [['Particulars', 'Revenue', 'COGS', 'Indirect Exp', 'Profit', 'Margin']],
      body: body,
      startY: 25,
      theme: 'grid',
      headStyles: { fillColor: [0, 136, 100] },
      styles: { fontSize: 9 },
      margin: { top: 25 }
    });
    doc.save(`Cost_Center_Summary.pdf`);
  } catch (error) {
    console.error("Export Error:", error);
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
