<template>
  <div class="rounded-2xl border p-6 transition-all duration-300"
    :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-teal-50 shadow-[0_4px_20px_rgba(0,183,148,0.05)]'">

    <div class="flex items-start gap-4 mb-6">
      <div class="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-colors"
        :class="isDark ? 'bg-teal-950 text-[#00B68D]' : 'bg-[#E8FCF2] text-[#00835D]'">
        <!-- Clock Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h2 class="leading-tight"
          :style="{
            fontFamily: 'Noto Sans Arabic, sans-serif',
            fontWeight: '400',
            fontSize: '18px',
            color: isDark ? '#FFFFFF' : '#000000'
          }">
          {{ currentLang === 'ar' ? 'الجلسات النشطة' : 'Active Sessions' }}
        </h2>
        <p class="mt-1"
          :style="{
            fontWeight: '400',
            fontSize: '14px',
            color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#00000080'
          }">
          {{ currentLang === 'ar' ? 'إدارة الأجهزة التي قمت بتسجيل الدخول منها حاليًا' : 'Manage devices where you\'re currently signed in' }}
        </p>
      </div>
    </div>

    <!-- Sessions List -->
    <div v-if="sessionsLoading" class="space-y-3">
      <div v-for="i in 2" :key="'sk' + i" class="h-[100px] rounded-xl animate-pulse"
        :class="isDark ? 'bg-teal-950/60' : 'bg-gray-100'"></div>
    </div>
    <!-- max 3 rows visible; more devices scroll inside (fixed cap = no layout shift) -->
    <div v-else class="space-y-3 overflow-y-auto max-h-[330px] pr-1 sessions-scroll"
      :class="isDark ? 'dark-scroll' : ''">
      <div v-for="session in sessions" :key="session.id"
        class="flex items-center justify-between p-4 rounded-xl border transition-all"
        :class="isDark ? 'bg-[#00251e]/80 border-teal-950/60' : ''"
        :style="!isDark ? { backgroundColor: '#EAFCF4', borderColor: '#A2E8D6' } : {}">

        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center border transition-colors flex-shrink-0"
            :class="isDark ? 'bg-teal-950/80 border-teal-900 text-teal-300' : 'bg-white border-[#A2E8D6] text-gray-400'">
            <!-- Device Icon (Dynamic) -->
            <svg v-if="session.device === 'desktop'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          </div>

          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-normal text-[16px]" :style="{ color: isDark ? '#FFFFFF' : '#000000' }">{{ session.browser }}</span>
              <span v-if="session.isCurrent"
                class="px-2 py-0.5 text-[10px] font-semibold rounded-full"
                :class="isDark ? 'bg-emerald-950 text-emerald-300' : 'bg-[#E6FFF9] text-[#00896F] border border-[#A2E8D6]'">
                {{ currentLang === 'ar' ? 'الحالي' : 'Current' }}
              </span>
            </div>
            <div class="mt-0.5"
              :style="{
                fontWeight: '400',
                fontSize: '14px',
                color: isDark ? 'rgba(255, 255, 255, 0.8)' : '#000000CC'
              }">
              {{ session.location }}
            </div>
            <div class="mt-0.5"
              :style="{
                fontWeight: '400',
                fontSize: '12px',
                color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#00000080'
              }">
              {{ currentLang === 'ar' ? 'نشط منذ: ' : 'Last active: ' }} {{ session.lastActive }}
            </div>
          </div>
        </div>

        <!-- Sign Out action button -->
         <button v-if="!session.isCurrent" @click="$emit('revoke', session.id)"
           @mouseenter="hoveredSessionId = session.id"
           @mouseleave="hoveredSessionId = null"
           class="transition-all transform active:scale-95 text-center px-3 py-1.5 font-normal"
           :style="{
             backgroundColor: isDark ? '#00251e' : '#FFFFFF',
             borderRadius: '8px',
             border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #0000001A',
             color: hoveredSessionId === session.id ? '#d62d04' : '#FF3908',
             fontSize: '14px',
             fontWeight: '400',
             cursor: 'pointer'
           }">
           {{ currentLang === 'ar' ? 'تسجيل الخروج' : 'Sign Out' }}
         </button>
      </div>
    </div>

    <!-- Sign Out All Button -->
    <button v-if="sessions.length > 1" @click="$emit('revoke-others')"
      @mouseenter="isSignOutAllHovered = true"
      @mouseleave="isSignOutAllHovered = false"
      class="w-full mt-4 py-2.5 border rounded-xl text-sm font-medium transition-all text-center"
      :style="{
        backgroundColor: isDark ? '#00251e' : '#FFFFFF',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#0000001A',
        color: isSignOutAllHovered ? '#d62d04' : '#FF3908'
      }">
      {{ currentLang === 'ar' ? 'تسجيل الخروج من جميع الجلسات الأخرى' : 'Sign Out All Other Sessions' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  sessions: { type: Array, required: true },
  sessionsLoading: { type: Boolean, default: false },
})

defineEmits(['revoke', 'revoke-others'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const hoveredSessionId = ref(null)
const isSignOutAllHovered = ref(false)
</script>

<style scoped>
.sessions-scroll {
  scrollbar-width: thin;
  scrollbar-color: #A2E8D6 transparent;
}
.sessions-scroll::-webkit-scrollbar {
  width: 6px;
}
.sessions-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.sessions-scroll::-webkit-scrollbar-thumb {
  background-color: #A2E8D6;
  border-radius: 9999px;
}
.dark .sessions-scroll::-webkit-scrollbar-thumb,
.sessions-scroll.dark-scroll::-webkit-scrollbar-thumb {
  background-color: #013E32;
}
</style>
