<template>
  <div>
    <h2 class="text-[16px] font-medium mb-1" :class="isDark ? 'text-white' : 'text-[#013E32]'">{{ question?.question_text }}</h2>
    <p class="text-xs mb-4" :class="isDark ? 'text-white/50' : 'text-gray-400'">{{ currentLang === 'ar' ? 'اختياري' : 'Optional' }}</p>
    <textarea v-model="answers.general_freetext" rows="5" maxlength="2000" :placeholder="currentLang === 'ar' ? 'أي شيء آخر تود مشاركته؟' : 'Anything else you\'d like to share?'"
      class="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all"
      :class="isDark ? 'bg-[#00251E] border-white/10 focus:border-[#00896F] focus:ring-[#00896F] text-white' : 'bg-white border-gray-200 text-gray-900 focus:border-[#00896F] focus:ring-[#00896F]'" />
    <p class="text-xs text-right mt-1" :class="isDark ? 'text-white/40' : 'text-gray-400'">{{ (answers.general_freetext || '').length }}/2000</p>
  </div>
</template>

<script setup>
defineProps({
  isDark: Boolean,
  currentLang: { type: String, default: 'en' },
  question: { type: Object, default: null },
  answers: { type: Object, required: true },
})
</script>
