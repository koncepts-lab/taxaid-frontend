<template>
  <NuxtLayout name="dashboard">


    <!-- 1. Container fills the screen height and prevents page-level scrolling -->
    <div v-if="!isFullScreenChat" class="h-screen font-sans flex overflow-hidden relative z-10" :class="{ '': isDark }"
      :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

      <!-- 2. LEFT AREA: Resizes dynamically -->
      <div class="flex-1 overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-0 pt-8" :class="isChatOpen
        ? (currentLang === 'ar' ? '2xl:ml-[480px] ml-[400px]' : '2xl:mr-[480px] mr-[400px]')
        : (currentLang === 'ar' ? 'lg:ml-[170px] ml-0' : 'lg:mr-[170px] mr-0')">
        <div class="mx-auto pt-8 lg:pt-0">

          <CommonDashboardHeader 
            :title="{ en: 'Accounts Payable', ar: 'حسابات الدفع' }"
            :subtitle="{ en: 'Accounts Payable Dashboard', ar: 'لوحة معلومات حسابات الدفع' }" 
            :periods="customPeriods"
            class="mb-8" 
            @selected-date="handleDateChange"
            @reload="fetchAgingData"
          />

          <AccountsPayableAlert />

          <div class="mb-4 lg:mb-8">
            <AccountsPayableSummary />
          </div>

          <div class="mb-4 lg:mb-8">
            <div class="h-[600px]">
              <AccountsPayableTopCustomers :data="topCustomersData" />
            </div>
          </div>

          <div class="mb-4 lg:mb-8">
            <div class="h-[420px]">
              <AccountsPayableHistoricalMovement />
            </div>
          </div>

          <div>
            <div class="lg:h-[440px] h-[440px]">
              <AccountsPayableAgingGraph :agingData="agingData" />
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
        <CommonChatSideBar v-model:isChatOpen="isChatOpen" @expand="isFullScreenChat = false" />
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
import { ref, onMounted, watch } from 'vue'
import ParticleBackground from '~/components/common/ParticleBackground.vue'
import AccountsPayableHeader from '~/components/accounts-payable/Header.vue'
import AccountsPayableAlert from '~/components/accounts-payable/Alert.vue'
import AccountsPayableSummary from '~/components/accounts-payable/Summary.vue'
import AccountsPayableTopCustomers from '~/components/accounts-payable/TopCustomers.vue'
import AccountsPayableHistoricalMovement from '~/components/accounts-payable/HistoricalMovement.vue'
import AccountsPayableAgingGraph from '~/components/accounts-payable/AgingGraph.vue'

const isChatOpen = ref(false)
const isFullScreenChat = ref(false)
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const agingData = ref({})
const topCustomersData = ref(null)
const activeTestDate = ref('2025-07-02')

const customPeriods = [
    { en: 'Year to Date', ar: 'منذ بداية العام' },
    { en: 'This Quarter', ar: 'هذا الربع' },
    { en: 'Last Quarter', ar: 'الربع الماضي' },
    { en: 'This Year', ar: 'هذه السنة' },
    { en: 'Last Year', ar: 'السنة الماضية' },
    { en: 'Custom Date', ar: 'تاريخ مخصص' }
]

const fetchAgingData = async () => {
  try {
    const response = await useApi('/ap-report/aging', {
      params: {
        test_date: activeTestDate.value,
        lang: currentLang.value
      }
    })
    
    if (response && response.status === 'success') {
      agingData.value = response.payload
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

const fetchTopCustomersData = async () => {
  try {
    const response = await useApi('/ap-report/top-eight', {
      params: {
        test_date: activeTestDate.value
      }
    })
    
    if (response && response.status === 'success') {
      topCustomersData.value = response.payload
    }
  } catch (error) {
    console.error('Error fetching top customers data:', error)
  }
}

const handleDateChange = (period) => {
  if (period.custom_from) {
    const parts = period.custom_from.split('-')
    activeTestDate.value = `${parts[2]}-${parts[1]}-${parts[0]}`
  }
  fetchAgingData()
  fetchTopCustomersData()
}

watch(currentLang, () => {
  fetchAgingData()
})

onMounted(() => {
  fetchAgingData()
  fetchTopCustomersData()
})
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
