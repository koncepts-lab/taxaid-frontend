<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">
    
    <!-- HEADER -->
    <DashboardHeader userName="Review Manager" userId="Welcome, Akhil" :showChangeProfile="false" />

    <!-- CONTENT -->
    <main class="flex-1 px-8 py-8 space-y-8 overflow-y-auto" style="margin-top: -18px;">
      
      <!-- Page Title Row -->
      <div class="flex items-center gap-4">
        <button @click="goBack" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer" :class="isDark ? 'hover:bg-white/10' : ''">
          <img src="/images/icons/back.svg" class="w-6 h-6" :class="isDark ? 'invert' : ''" alt="back" />
        </button>
        <div class="space-y-1">
          <h1 class="text-[24px] font-semibold text-[#013E32]" :class="isDark ? 'text-[#10FFD4]' : ''">Consultant Activity Log History</h1>
          <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">View consultant past daily activity logs</p>
        </div>
      </div>

      <!-- Toolbar Row -->
      <div class="flex items-center gap-8 py-2">
        <!-- Date Navigator -->
        <div class="flex items-center gap-4">
          <!-- Prev Button -->
          <button @click="prevDay" class="w-[50px] h-[50px] bg-[#013E32] rounded-[10px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
            <img src="/images/icons/back.svg" class="w-5 h-5 invert" alt="prev" />
          </button>

          <!-- Date text -->
          <div class="flex items-center gap-3 px-6 h-[50px] bg-white rounded-[10px] border border-[#E5E5E5]" :class="isDark ? 'bg-white/5 border-white/10' : ''">
            <span class="text-[15px] font-normal text-[#1a1a1a] whitespace-nowrap" :class="isDark ? 'text-white' : ''">{{ formattedDate }}</span>
            <img src="/images/icons/calendar.svg" class="w-5 h-5 opacity-60" :class="isDark ? 'invert' : 'brightness-0'" alt="calendar" />
          </div>

          <!-- Next Button -->
          <button @click="nextDay" class="w-[50px] h-[50px] bg-[#82B1A8] rounded-[10px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
            <img src="/images/icons/back.svg" class="w-5 h-5 invert rotate-180" alt="next" />
          </button>
        </div>

        <!-- Today Button -->
        <button @click="goToday" class="px-7 h-[46px] rounded-[10px] border border-[#04C18F66] bg-white text-[15px] font-normal text-[#1a1a1a] hover:border-[#04C18F] transition-colors cursor-pointer ml-2"
                :class="isDark ? 'bg-white/5 text-white border-white/20' : ''">
          Today
        </button>

        <!-- Consultant Selection -->
        <div class="relative ml-6">
          <div @click="showConsDropdown = !showConsDropdown"
               class="flex items-center gap-12 px-6 h-[50px] bg-white rounded-[10px] border border-[#E5E5E5] cursor-pointer group transition-all" :class="isDark ? 'bg-white/5 border-white/10' : 'bg-white'">
            <span class="text-[15px] font-normal text-[#6C768A]" :class="isDark ? 'text-white/70' : ''">{{ selectedConsultantName }}</span>
            <img src="/images/icons/down-select.svg" class="w-4 h-4 transition-all" :class="isDark ? 'invert opacity-60 group-hover:opacity-100' : 'brightness-0 opacity-40 group-hover:opacity-80'" alt="arrow" />
          </div>
          <div v-if="showConsDropdown" class="absolute top-full left-0 mt-2 bg-white rounded-[12px] shadow-lg border border-gray-100 p-2 z-30 min-w-[220px] flex flex-col gap-1">
            <button v-for="c in consultants" :key="c.id" @click="selectConsultant(c)"
                    class="text-left px-4 py-2.5 rounded-[10px] text-[14px] transition-colors cursor-pointer hover:bg-[#E6FFF3]">
              {{ c.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Metrics Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Total Hrs -->
        <div :class="isDark ? 'bg-[#00141080] border-white/10 text-white' : 'bg-white border-[#E5E5E5]'" 
             class="rounded-[16px] p-7 border shadow-sm space-y-6">
          <h5 class="text-[14px] font-medium opacity-70" :class="isDark ? 'text-white/70' : 'text-[#6B7280]'">Total Hrs</h5>
          <div class="space-y-1">
            <h2 class="text-[30px] font-normal leading-tight text-[#1a1a1a]" :class="isDark ? 'text-white' : ''">{{ logData.total_formatted }}</h2>
            <p class="text-[13px] opacity-60 text-[#6B7280]" :class="isDark ? 'text-white/60' : ''">Productive Time</p>
          </div>
        </div>

        <!-- Appointments -->
        <div :class="isDark ? 'bg-[#00141080] border-white/10 text-white' : 'bg-white border-[#E5E5E5]'" 
             class="rounded-[16px] p-7 border shadow-sm space-y-6">
          <h5 class="text-[14px] font-medium opacity-70" :class="isDark ? 'text-white/70' : 'text-[#6B7280]'">Appointments</h5>
          <div class="space-y-1">
            <h2 class="text-[30px] font-normal leading-tight text-[#1a1a1a]" :class="isDark ? 'text-white' : ''">{{ logData.count_fixed + logData.count_review }}</h2>
            <p class="text-[13px] opacity-60 text-[#6B7280]" :class="isDark ? 'text-white/60' : ''">{{ logData.count_fixed }} Client Fixed · {{ logData.count_review }} Client Review</p>
          </div>
        </div>

        <!-- Internal -->
        <div :class="isDark ? 'bg-[#00141080] border-white/10 text-white' : 'bg-white border-[#E5E5E5]'" 
             class="rounded-[16px] p-7 border shadow-sm space-y-6">
          <h5 class="text-[14px] font-medium opacity-70" :class="isDark ? 'text-white/70' : 'text-[#6B7280]'">Internal</h5>
          <div class="space-y-1">
            <h2 class="text-[30px] font-normal leading-tight text-[#1a1a1a]" :class="isDark ? 'text-white' : ''">{{ logData.count_internal }}</h2>
            <p class="text-[13px] opacity-60 text-[#6B7280]" :class="isDark ? 'text-white/60' : ''">Internal meetings</p>
          </div>
        </div>

      </div>

      <!-- Activity Log Card -->
      <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#F0F0F0]'" 
           class="rounded-[15px] border shadow-sm overflow-hidden flex flex-col">
        
        <!-- Section Header -->
        <div class="p-8 pb-5 flex justify-between items-center">
          <h3 class="text-[20px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">{{ formattedDate }}</h3>
          <span class="text-[14px] font-regular opacity-60">{{ logData.logs?.length ?? 0 }} Activities</span>
        </div>

        <!-- Table -->
        <div class="px-5 pb-8 flex-1">
          <div class="overflow-hidden rounded-[4px]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[#00896F] text-white">
                  <th class="py-3 px-6 font-normal text-[14px]">Time In</th>
                  <th class="py-3 px-6 font-normal text-[14px]">Time Out</th>
                  <th class="py-3 px-6 font-normal text-[14px]">Type of Appointment</th>
                  <th class="py-3 px-6 font-normal text-[14px]">Client Id</th>
                  <th class="py-3 px-6 font-normal text-[14px]">Client Name</th>
                </tr>
              </thead>
              <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-[#F0F0F0]'">
                <tr v-if="!logData.logs?.length">
                  <td colspan="5" class="py-8 text-center text-[14px] opacity-50">No activity logged for this day.</td>
                </tr>
                <tr v-for="log in logData.logs" :key="log.id" class="transition-colors" :class="isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/30'">
                  <td class="py-5 px-6 text-[14px] font-normal text-black" :class="isDark ? 'text-white' : ''">{{ log.time_in }}</td>
                  <td class="py-5 px-6 text-[14px] font-normal text-black" :class="isDark ? 'text-white' : ''">{{ log.time_out ?? '—' }}</td>
                  <td class="py-5 px-6 text-[14px] font-normal">
                    <span class="px-4 py-1.5 rounded-full bg-[#f3f4f6b3] text-black text-[12px] font-medium"
                          :class="isDark ? 'bg-white/10 text-white/90' : ''">
                      {{ log.appointment_type?.replace(/_/g, ' ') }}
                    </span>
                  </td>
                  <td class="py-5 px-6 text-[14px] font-normal text-black" :class="isDark ? 'text-white' : ''">{{ log.tenant_id ?? '—' }}</td>
                  <td class="py-5 px-6 text-[14px] font-normal text-black" :class="isDark ? 'text-white' : ''">{{ log.client_name }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Table Footer (Injected as a box) -->
          <div class="mt-8 mx-1">
            <div class="bg-[#FDC70029] p-5 px-8 flex justify-between items-center rounded-[10px] border border-[#D08700]" 
                 :class="isDark ? 'bg-yellow-900/20 border-yellow-700/30' : ''">
              <span class="text-[16px] font-medium text-[#0A0A0A]" :class="isDark ? 'text-white/90' : ''">Total hours logged:</span>
              <span class="text-[20px] font-bold text-[#0A0A0A]" :class="isDark ? 'text-white' : ''">{{ logData.total_formatted }}</span>
            </div>
          </div>
        </div>

      </div>

    </main>

    <DashboardFooter />
  </div>
</template>

<script setup>
import { useReviewManager } from '@/composables/admin/review/useReviewManager'

const { isDark } = useTheme()
const rm = useReviewManager()

const selectedDate      = ref(new Date().toISOString().split('T')[0])
const selectedAdminId   = ref(null)
const consultants       = ref([])
const logData           = ref({ logs: [], total_formatted: '0h 0m', count_fixed: 0, count_review: 0, count_internal: 0 })
const showConsDropdown  = ref(false)

onMounted(async () => {
  consultants.value = await rm.getConsultantList()
  if (consultants.value.length) {
    selectedAdminId.value = consultants.value[0].id
    await loadLog()
  }
})

async function loadLog() {
  if (!selectedAdminId.value) return
  logData.value = await rm.getConsultantDailyLog(selectedAdminId.value, selectedDate.value)
}

function prevDay() {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() - 1)
  selectedDate.value = d.toISOString().split('T')[0]
  loadLog()
}

function nextDay() {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() + 1)
  selectedDate.value = d.toISOString().split('T')[0]
  loadLog()
}

function goToday() {
  selectedDate.value = new Date().toISOString().split('T')[0]
  loadLog()
}

function selectConsultant(admin) {
  selectedAdminId.value = admin.id
  showConsDropdown.value = false
  loadLog()
}

const selectedConsultantName = computed(() =>
  consultants.value.find(c => c.id === selectedAdminId.value)?.name ?? 'Select Consultant'
)

const formattedDate = computed(() => {
  const d = new Date(selectedDate.value + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
})

function goBack() {
  navigateTo('/review-manager/dashboard')
}
</script>

<style scoped>
.dark-mode-bg {
  background-color: #000c0a;
}
</style>
