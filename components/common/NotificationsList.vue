<template>
  <div>
    <!-- Title Section -->
    <div class="space-y-1">
      <h1 class="text-[24px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">All Notifications</h1>
      <p class="text-[14px] font-normal" :class="isDark ? 'text-white/60' : 'text-gray-500'">Showing {{ totalCount }} notifications</p>
    </div>

    <!-- Tabs Section -->
    <div v-if="tabs.length" class="flex items-center justify-start gap-4 mt-6">
      <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'" class="rounded-full p-1 border shadow-sm inline-flex items-center">
        <button
          v-for="tab in tabs" :key="tab.name"
          @click="$emit('update:activeTab', tab.name)"
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
      <div v-if="loading" class="text-center py-16" :class="isDark ? 'text-white/40' : 'text-gray-400'">Loading...</div>
      <div v-else-if="!filteredGroups.length" class="text-center py-16" :class="isDark ? 'text-white/40' : 'text-gray-400'">No notifications.</div>

      <div v-for="group in filteredGroups" :key="group.id" class="space-y-4">
        <h3 class="text-[16px] font-medium" :class="isDark ? 'text-white/80' : 'text-[#1a1a1a]'">{{ group.date }}</h3>

        <div class="space-y-3">
          <div v-for="item in group.items" :key="item.id"
               class="group relative flex items-center gap-6 p-5 rounded-[16px] border transition-all duration-300 hover:shadow-md cursor-pointer overflow-hidden"
               :class="isDark ? 'bg-[#00141080] border-white/10 hover:border-[#00BE8CBD]' : 'bg-white border-gray-100 hover:border-[#00BE8CBD]'">

            <div v-if="isDark" class="absolute inset-0 bg-gradient-to-r from-[#00BE8CBD]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div class="relative flex items-center justify-center">
              <div v-if="item.unread" class="w-2.5 h-2.5 rounded-full bg-[#00BE8CBD] shadow-[0_0_8px_rgba(0,190,140,0.6)]"></div>
              <div v-else class="w-2.5 h-2.5"></div>
            </div>

            <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                 :style="{ backgroundColor: isDark ? '#1b5e5080' : getIconBg(item.type) }">
              <img :src="getIcon(item.type)" class="w-6 h-6 object-contain" :class="{ 'brightness-0 invert': isDark }" />
            </div>

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
  </div>
</template>

<script setup>
// Reusable notification list UI — every role's notifications page renders this with its own
// fetched data/tabs; the component itself has no role-specific logic or API calls.
import { computed } from 'vue'

const props = defineProps({
  groups: { type: Array, default: () => [] }, // [{ id, date, items: [{ id, type, message, time, category, unread }] }]
  tabs: { type: Array, default: () => [] },    // [{ name, count }] — omit to hide the tab bar
  activeTab: { type: String, default: 'All' },
  loading: { type: Boolean, default: false },
})
defineEmits(['update:activeTab'])

const { isDark } = useTheme()

const totalCount = computed(() => props.groups.reduce((sum, g) => sum + g.items.length, 0))

const filteredGroups = computed(() => {
  if (!props.tabs.length || props.activeTab === 'All') return props.groups
  return props.groups
    .map(group => ({ ...group, items: group.items.filter(item => item.category === props.activeTab) }))
    .filter(group => group.items.length > 0)
})

function getIcon(type) {
  switch (type) {
    case 'warning': return '/images/icons/n-01.svg'
    case 'info': return '/images/icons/n-02.svg'
    case 'success': return '/images/icons/n-03.svg'
    default: return '/images/icons/n-02.svg'
  }
}

function getIconBg(type) {
  switch (type) {
    case 'warning': return '#FFFBE1'
    case 'info': return '#DFF4FF'
    case 'success': return '#F0FDF4'
    default: return '#DFF4FF'
  }
}
</script>
