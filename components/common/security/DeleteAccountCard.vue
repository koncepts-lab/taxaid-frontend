<template>
  <div class="rounded-2xl border p-6 transition-all duration-300"
    :class="isDark ? 'bg-[#2E0A0A] border-red-950/40 text-white' : 'bg-white border-red-100 shadow-[0_4px_20px_rgba(220,38,38,0.05)]'">

    <div class="flex items-start gap-4 mb-6">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
        :class="isDark ? 'bg-red-950 text-red-300' : 'bg-red-50 text-red-600'">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </div>
      <div>
        <h2 class="text-[24px] font-regular mb-2" :class="isDark ? 'text-white' : 'text-red-700'">
          {{ currentLang === 'ar' ? 'حذف الحساب' : 'Delete Account' }}
        </h2>
        <p class="text-[14px] text-[#000000CC]" :class="isDark ? 'text-white/70' : ''">
          {{ currentLang === 'ar'
            ? 'حذف حسابك وبياناتك بشكل دائم. هذا الإجراء يخضع لمراجعة فريقنا قبل تنفيذه.'
            : 'Permanently delete your account and your data. This goes through a review before it happens.' }}
        </p>
      </div>
    </div>

    <button @click="$emit('delete-click')"
      class="px-4 py-2.5 rounded-lg text-sm font-medium border transition-all"
      :class="isDark ? 'border-red-900 text-red-300 hover:bg-red-950/40' : 'border-red-200 text-red-600 hover:bg-red-50'">
      {{ currentLang === 'ar' ? 'حذف حسابي' : 'Delete My Account' }}
    </button>
  </div>
</template>

<script setup>
defineEmits(['delete-click'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
</script>
