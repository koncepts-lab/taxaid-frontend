<template>
  <div class="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 w-[360px] max-w-[calc(100vw-3rem)]">
    <TransitionGroup name="toast">
      <div v-for="n in items" :key="n.id"
        class="flex items-start justify-between px-5 py-4 rounded-xl shadow-lg transition-all duration-300"
        :class="[isDark ? '' : 'bg-white border border-[#E5E7EB]', n.target ? 'cursor-pointer' : '']"
        :style="isDark ? 'background: #001410; border: 0.8px solid #F9AF4D80' : ''"
        @click="open(n)">
        <div class="flex items-start gap-3 min-w-0">
          <div class="w-10 h-10 shrink-0 rounded-full flex items-center justify-center"
            :class="isDark ? '' : 'bg-[#FF990011]'">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 17H20L18.595 15.595C18.214 15.214 18 14.697 18 14.158V11C18 8.388 16.33 6.165 14 5.341V5C14 3.895 13.105 3 12 3C10.895 3 10 3.895 10 5V5.341C7.67 6.165 6 8.388 6 11V14.158C6 14.697 5.786 15.214 5.405 15.595L4 17H9M15 17V18C15 19.657 13.657 21 12 21C10.343 21 9 19.657 9 18V17M15 17H9"
                :stroke="isDark ? '#D08700' : '#FF9900'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="min-w-0">
            <h4 class="text-[15px] font-medium truncate" :class="isDark ? 'text-[#FFCD9D]' : 'text-[#1F2937]'">
              {{ n.title }}
            </h4>
            <p class="text-[13px] font-normal mt-0.5 line-clamp-3" :class="isDark ? 'text-[#D08700]' : 'text-[#6B7280]'">
              {{ n.body }}
            </p>
          </div>
        </div>
        <button @click.stop="remove(n.id)"
          class="p-1.5 shrink-0 transition-opacity hover:opacity-100 opacity-60"
          :class="isDark ? 'text-[#FFCD9D]' : 'text-[#6B7280]'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const { isDark } = useTheme()
const { items, remove } = useAppNotifications()

const open = (n: { id: number; target: string | null }) => {
  if (!n.target) return
  remove(n.id)
  navigateTo('/' + String(n.target).replace(/^\/+/, ''))
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
