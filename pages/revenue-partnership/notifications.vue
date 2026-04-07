<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">
    
    <!-- HEADER -->
    <DashboardHeader userName="Admin User" userId="ADMIN-001" showChangeProfile changeProfileLink="/revenue-partnership/admin" />

    <!-- CONTENT --> 
    <main class="flex-1 px-8 pb-[0px] pt-8 space-y-6 overflow-y-auto" style="margin-top: -18px;">
      <!-- Title Section -->
      <div class="space-y-1">
        <h1 class="text-[24px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">All Notifications</h1>
        <p class="text-[14px] font-normal" :class="isDark ? 'text-white/60' : 'text-gray-500'">Showing 8 notifications</p>
      </div>

      <!-- Tabs Section -->
      <div class="flex items-center justify-start gap-4 mt-6">
        <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="rounded-full p-1 border shadow-sm inline-flex items-center">
          <button 
            v-for="tab in notificationTabs" :key="tab.name"
            @click="activeTab = tab.name"
            class="px-10 py-2.5 rounded-full text-[14px] font-medium transition-all cursor-pointer whitespace-nowrap"
            :class="activeTab === tab.name 
              ? (isDark ? 'bg-[#1b5e50] text-[#fff] shadow-sm' : 'bg-[#82FFE0] text-[#0A0A0A] shadow-sm') 
              : (isDark ? 'bg-transparent text-white/50' : 'bg-transparent text-[#1a1a1a]')">
            {{ tab.name }} ({{ tab.count }})
          </button>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="space-y-10 mt-8">
        <div v-for="group in filteredNotifications" :key="group.id" class="space-y-4">
          <!-- Date Header -->
          <h3 class="text-[16px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#1a1a1a]'">{{ group.date }}</h3>
          
          <!-- Individual Notifications -->
          <div class="space-y-3">
            <div v-for="item in group.items" :key="item.id" 
                 class="group relative flex items-center gap-6 p-5 rounded-[16px] border transition-all duration-300 hover:shadow-md cursor-pointer overflow-hidden"
                 :class="isDark ? 'bg-[#00141080] border-white/10 hover:border-[#00BE8CBD]' : 'bg-white border-gray-100 hover:border-[#00BE8CBD]'">
              
              <!-- Background Glow on Hover (Dark Mode) -->
              <div v-if="isDark" class="absolute inset-0 bg-gradient-to-r from-[#00BE8CBD]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <!-- Unread Indicator -->
              <div class="relative flex items-center justify-center">
                <div v-if="item.unread" class="w-2.5 h-2.5 rounded-full bg-[#00BE8CBD] shadow-[0_0_8px_rgba(0,190,140,0.6)]"></div>
                <div v-else class="w-2.5 h-2.5"></div>
              </div>

              <!-- Status Icon -->
              <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                   :style="{ backgroundColor: isDark ? '#1b5e5080' : getIconBg(item.type) }">
                <img :src="getIcon(item.type)" class="w-6 h-6 object-contain" :class="{ 'brightness-0 invert': isDark }" />
              </div>

              <!-- Content Area -->
              <div class="flex-1 space-y-1 relative">
                <p class="text-[15px] font-normal leading-relaxed" :class="isDark ? 'text-white/90' : 'text-[#1a1a1a]'">
                  {{ item.message }}
                </p>
                <div class="flex items-center gap-2 text-[13px] font-normal" :class="isDark ? 'text-white/50' : 'text-gray-400'">
                  <span>{{ item.time }}</span>
                  <span class="w-1 h-1 rounded-full bg-current opacity-30"></span>
                  <span>{{ item.category }}</span>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- FOOTER -->
    <DashboardFooter />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { isDark } = useTheme()

definePageMeta({
  layout: false
})

const activeTab = ref('All')

const notificationTabs = [
  { name: 'All', count: 21 },
  { name: 'Accounts', count: 2 },
  { name: 'System', count: 2 }
]

const notificationGroups = [
  {
    id: 1,
    date: 'Today - Nov 15, 2024',
    items: [
      {
        id: 101,
        type: 'warning',
        message: '3 customer cards are due to expire soon. Update payment details to prevent failed transactions.',
        time: '05:30 AM',
        category: 'Accounts',
        unread: true
      },
      {
        id: 102,
        type: 'info',
        message: 'Month end report upload is pending. Please upload before end of business today.',
        time: '05:30 AM',
        category: 'Accounts',
        unread: true
      },
      {
        id: 103,
        type: 'success',
        message: 'Settlement of AED 125,308 for TechCorp Solutions Inc. completed successfully.',
        time: '05:30 AM',
        category: 'Accounts',
        unread: true
      }
    ]
  },
  {
    id: 2,
    date: 'Yesterday - Nov 14, 2024',
    items: [
      {
        id: 201,
        type: 'warning',
        message: '3 customer cards are due to expire soon. Update payment details to prevent failed transactions.',
        time: '05:30 AM',
        category: 'Accounts',
        unread: true
      },
      {
        id: 202,
        type: 'info',
        message: 'Month end report upload is pending. Please upload before end of business today.',
        time: '05:30 AM',
        category: 'Accounts',
        unread: true
      },
      {
        id: 203,
        type: 'success',
        message: 'Settlement of AED 125,308 for TechCorp Solutions Inc. completed successfully.',
        time: '05:30 AM',
        category: 'Accounts',
        unread: true
      }
    ]
  }
]

const filteredNotifications = computed(() => {
  if (activeTab.value === 'All') return notificationGroups
  return notificationGroups.map(group => ({
    ...group,
    items: group.items.filter(item => item.category === activeTab.value)
  })).filter(group => group.items.length > 0)
})

const getIcon = (type) => {
  switch (type) {
    case 'warning': return '/images/icons/n-01.svg'
    case 'info': return '/images/icons/n-02.svg'
    case 'success': return '/images/icons/n-03.svg'
    default: return '/images/icons/n-02.svg'
  }
}

const getIconBg = (type) => {
  switch (type) {
    case 'warning': return '#FFFBE1'
    case 'info': return '#DFF4FF'
    case 'success': return '#F0FDF4'
    default: return '#DFF4FF'
  }
}



</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

main::-webkit-scrollbar { width: 6px; }
main::-webkit-scrollbar-track { background: transparent; }
main::-webkit-scrollbar-thumb { background: #E5E5E5; border-radius: 10px; }
</style>
