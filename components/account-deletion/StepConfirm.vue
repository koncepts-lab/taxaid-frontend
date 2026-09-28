<template>
  <div>
    <h2 class="text-[16px] font-medium mb-2" :class="isDark ? 'text-white' : 'text-red-700'">
      {{ currentLang === 'ar' ? 'تأكيد حذف الحساب' : 'Confirm account deletion' }}
    </h2>
    <p class="text-sm mb-4" :class="isDark ? 'text-white/60' : 'text-gray-500'">
      {{ currentLang === 'ar'
        ? 'سيتم حذف حسابك وبياناتك نهائيًا بعد التأكيد.'
        : 'Your account and your data will be permanently deleted after you confirm this.' }}
    </p>
    <label class="block text-[14px] mb-2" :class="isDark ? 'text-white/80' : 'text-[#013E32]/80'">
      {{ currentLang === 'ar' ? 'اكتب' : 'Type' }}
      <strong class="font-bold" :class="isDark ? 'text-white' : 'text-black'">DELETE</strong>
      {{ currentLang === 'ar' ? 'للتأكيد' : 'to confirm' }}
    </label>
    <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" autocomplete="off"
      class="w-full max-w-xs border rounded-lg px-4 py-3 text-sm font-semibold tracking-wide focus:outline-none focus:ring-1 transition-all"
      :class="isDark ? 'bg-[#00251E] border-white/10 focus:border-red-400 focus:ring-red-400 text-white' : 'bg-white border-gray-200 text-black focus:border-red-400 focus:ring-red-400'" />
  </div>
</template>

<script setup>
defineProps({
  isDark: Boolean,
  currentLang: { type: String, default: 'en' },
  modelValue: { type: String, default: '' },
})
defineEmits(['update:modelValue'])
</script>
