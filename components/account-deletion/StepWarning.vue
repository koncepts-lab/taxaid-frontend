<template>
  <div>
    <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto" :class="isDark ? 'bg-red-950 text-red-300' : 'bg-red-50 text-red-600'">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    </div>
    <h2 class="text-[20px] font-medium mb-3 text-center" :class="isDark ? 'text-white' : 'text-red-700'">
      {{ currentLang === 'ar' ? 'قبل أن تتابع' : 'Before you continue' }}
    </h2>
    <ul class="space-y-2.5 text-sm mb-6" :class="isDark ? 'text-white/70' : 'text-gray-600'">
      <li class="flex gap-2 font-semibold" :class="isDark ? 'text-white' : 'text-red-700'">
        <span>•</span>
        <span>{{ currentLang === 'ar' ? 'سيؤدي هذا إلى حذف حسابك نهائيًا ومحو جميع بياناتك.' : 'This will permanently delete your account and erase all your data.' }}</span>
      </li>
      <li class="flex gap-2">
        <span>•</span>
        <span>{{ currentLang === 'ar' ? 'سيتم تعليق حسابك أولًا للمراجعة، ثم حذفه نهائيًا.' : 'Your account will first be suspended for review and then permanently deleted.' }}</span>
      </li>
      <li class="flex gap-2">
        <span>•</span>
        <span>{{ currentLang === 'ar' ? 'سيتم تسجيل خروجك من كل الأجهزة فور إرسال الطلب.' : 'You\'ll be logged out of every device the moment you submit this.' }}</span>
      </li>
      <li class="flex gap-2">
        <span>•</span>
        <span>{{ currentLang === 'ar' ? 'هذا الإجراء يخضع لمراجعة قبل تنفيذه، ولا يمكن التراجع عنه بعد اكتماله.' : 'This goes through a review and can\'t be undone once it\'s complete.' }}</span>
      </li>
    </ul>

    <button @click="$emit('continue')" :disabled="readTimer > 0"
      class="w-full py-3 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50" style="background-color: #DC2626;">
      {{ readTimer > 0
        ? (currentLang === 'ar' ? `تابع (${readTimer})` : `Continue (${readTimer})`)
        : (currentLang === 'ar' ? 'أفهم، تابع' : 'I understand, continue') }}
    </button>
  </div>
</template>

<script setup>
defineProps({ isDark: Boolean, currentLang: { type: String, default: 'en' } })
defineEmits(['continue'])

const readTimer = ref(3)
let timerHandle = null

onMounted(() => {
  timerHandle = setInterval(() => {
    if (readTimer.value > 0) readTimer.value--
    else clearInterval(timerHandle)
  }, 1000)
})
onUnmounted(() => clearInterval(timerHandle))
</script>
