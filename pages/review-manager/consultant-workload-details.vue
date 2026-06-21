<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300 pb-10" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">
    
    <!-- HEADER -->
    <DashboardHeader userName="Review Manager" userId="Welcome, Akhil" :showChangeProfile="false" />

    <!-- CONTENT -->
    <main class="flex-1 px-8 py-8 space-y-8 overflow-y-auto" style="margin-top: -18px;">
      
      <!-- Page Header with Back Button -->
      <div class="flex items-center gap-6 mb-2">
        <button @click="goBack" class="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer" :class="isDark ? 'hover:bg-white/10' : ''">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="space-y-0.5">
          <h1 class="text-[32px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">{{ consultantName }}</h1>
          <p class="text-[14px] font-medium text-[#00000080]" :class="isDark ? 'text-white/60' : ''">ID #{{ adminId }}</p>
        </div>
      </div>

      <!-- Main Container -->
      <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'" class="rounded-[20px] border shadow-sm p-8 pb-12 space-y-8">
        
        <!-- Search & Refresh -->
        <div class="flex items-center gap-4">
          <div class="relative flex-1">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">
              <img src="/images/icons/search.svg" class="w-5 h-5" :class="isDark ? 'invert brightness-0' : ''" alt="search" />
            </span>
            <input type="text" 
                   placeholder="Search by consultant name or consultant Id..." 
                   class="w-full h-[48px] pl-12 pr-4 rounded-[10px] border border-[#04C18F33] outline-none focus:border-[#00896F] transition-colors text-[14px] font-regular"
                   :class="isDark ? 'bg-black/20 border-white/10 text-white' : 'bg-white text-[#1a1a1a] placeholder-[#0000004D]'" />
          </div>
          <button class="w-[48px] h-[48px] rounded-[10px] border border-[#04C18F33] flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
                  :class="isDark ? 'bg-black/20 border-white/10' : 'bg-white'">
            <img src="/images/icons/reload.svg" class="w-5 h-5 opacity-80" :class="isDark ? 'invert brightness-0' : ''" alt="refresh" />
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-hidden rounded-[8px]">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896F] text-white">
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Project Name</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Client Fixed</th>
                <th class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A]">Client Request</th>
                <th class="py-4 px-8 font-normal text-[15px]">Client Analysis</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
              <tr v-if="!detailsData.length">
                <td colspan="4" class="py-8 text-center text-[14px] opacity-50">No workload data for this month.</td>
              </tr>
              <tr v-for="(item, idx) in detailsData" :key="idx"
                  class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'">
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.client_name }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.fixed_hours }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.request_hours }}</td>
                <td class="py-6 px-8 text-[14px] font-regular text-[#000000CC]" :class="isDark ? 'text-white/90' : ''">{{ item.analysis_hours }}</td>
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
import { useReviewManager } from '@/composables/admin/review/useReviewManager'

const { isDark } = useTheme()
const route = useRoute()
const rm = useReviewManager()

const adminId     = computed(() => Number(route.query.admin_id))
const consultantName = ref('Consultant')
const detailsData = ref([])

onMounted(async () => {
  if (!adminId.value) return
  const [workload, consultants] = await Promise.all([
    rm.getConsultantWorkload(adminId.value),
    rm.getConsultantList(),
  ])
  detailsData.value    = workload
  consultantName.value = consultants.find((c) => c.id === adminId.value)?.name ?? 'Consultant'
})

function goBack() {
  navigateTo('/review-manager/dashboard?tab=Consultant workload')
}
</script>

<style scoped>
.dark-mode-bg {
  background-color: #000c0a;
}
</style>
