<template>
  <NuxtLayout name="dashboard">
    <div v-if="!isFullScreenChat" class="font-sans flex relative z-10" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <div class="flex-1 transition-all duration-500 ease-in-out px-8 pt-0 pb-[17px]" :class="isChatOpen
        ? (currentLang === 'ar' ? '2xl:ml-[480px] ml-[400px]' : '2xl:mr-[480px] mr-[400px]')
        : (currentLang === 'ar' ? 'ml-[170px]' : 'mr-[170px]')">

        <div class="mx-auto max-w-[1600px] flex flex-col gap-8 pt-4">
          <CostCenterProjectDetailHeader ref="headerRef" @reload="fetchData" @export-excel="handleExportExcel"
            @export-pdf="handleExportPDF" @selected-date="handleDateChange"
            :title="{ en: data?.cost_center, ar: data?.cost_center }" />
          <CostCenterProjectDetailSummaryCards :summary-data="data?.contract_summary" />
          <CostCenterProjectDetailTable ref="tableRef" :data="data" />
          <div class="h-[500px]">
            <CostCenterProjectDetailRevenueVsCost :data="data" />
          </div>
        </div>
      </div>

      <aside class="fixed top-1/2 -translate-y-1/2 shrink-0 transition-all duration-500 ease-in-out mt-5" :class="[
        currentLang === 'ar' ? 'left-0' : 'right-0',
        isChatOpen ? '2xl:w-120 w-100' : 'w-[80px]'
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
import * as XLSX from 'xlsx'

const isChatOpen = ref(false)
const isFullScreenChat = ref(false)
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const headerRef = ref(null)
const tableRef = ref(null)
const route = useRoute()

const title = computed(() => decodeURIComponent(route.params.id))
const date = computed(() => route.query.date)
const data = ref({})
const selectedDate = route.query.date || '31-12-2025'
const costCenterId = computed(() => decodeURIComponent(route.params.id))


const fetchProjectData = async () => {
  try {
    const response = await useApi(
      `cost-center/cost-center-summary?date=${selectedDate}&cost_center=${costCenterId.value}`
    )
    data.value = response
    console.log("🚀 ~ fetchProjectData ~ data:", data)
  } catch (error) {
    console.error("Error fetching detail:", error)
  }
}
const fetchData = () => fetchProjectData()

const handleDateChange = (period) => {
  if (tableRef.value) {
    tableRef.value.fetchProjectData(period)
  }
}

// --- 3. EXPORT LOGIC ---
const handleExportExcel = () => {
  const rowsToExport = tableRef.value?.tableData || []
  const total = tableRef.value?.summaryTotal

  if (data.length === 0) return

  const exportRows = data.map(row => ({
    "Project": row.label,
    "Revenue": row.revenue,
    "COGS": row.cogs,
    "Indirect Exp": row.indirectExp,
    "Profit": row.profit,
    "Margin": row.margin + '%'
  }))

  if (total) {
    exportRows.push({ "Project": total.label, "Revenue": total.revenue, "COGS": total.cogs, "Indirect Exp": total.indirectExp, "Profit": total.profit, "Margin": total.margin + '%' })
  }

  const worksheet = XLSX.utils.json_to_sheet(exportRows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Project_Detail")
  XLSX.writeFile(workbook, `Project_Detail_Report.xlsx`)
}

const handleExportPDF = async () => {
  if (!process.client) return;
  const data = tableRef.value?.tableData || []
  const total = tableRef.value?.summaryTotal
  if (data.length === 0) return;

  try {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF('l', 'mm', 'a4');

    const body = data.map(row => [row.label, row.revenue, row.cogs, row.indirectExp, row.profit, row.margin + '%']);
    if (total) body.push([total.label, total.revenue, total.cogs, total.indirectExp, total.profit, total.margin + '%'])

    doc.text("Project Detail Performance Report", 14, 15);
    autoTable(doc, {
      head: [['Particulars', 'Revenue', 'COGS', 'Indirect Exp', 'Profit', 'Margin']],
      body: body,
      startY: 25,
      theme: 'grid',
      headStyles: { fillColor: [0, 136, 100] }
    });
    doc.save(`Project_Detail_Report.pdf`);
  } catch (error) {
    console.error("PDF Export Error:", error);
  }
};
onMounted(() => {
  fetchProjectData()
})
</script>