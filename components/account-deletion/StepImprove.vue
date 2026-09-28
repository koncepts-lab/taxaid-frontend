<template>
  <div>
    <h2 class="text-[16px] font-medium mb-1" :class="isDark ? 'text-white' : 'text-[#013E32]'">{{ question?.question_text }}</h2>
    <p class="text-xs mb-4" :class="isDark ? 'text-white/50' : 'text-gray-400'">{{ currentLang === 'ar' ? 'اختياري' : 'Optional' }}</p>
    <div class="space-y-2 mb-4">
      <label v-for="opt in question?.options || []" :key="opt" class="flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all"
        :class="isDark ? 'border-white/10' : 'border-gray-100'">
        <input type="checkbox" :value="opt" v-model="answers.improve_points" class="accent-[#DC2626]" />
        <span class="text-sm font-medium" :class="isDark ? 'text-emerald-300' : 'text-[#00695C]'">{{ opt }}</span>
      </label>
    </div>
    <textarea v-model="answers.improve_freetext" rows="3" maxlength="2000" :placeholder="currentLang === 'ar' ? 'أخبرنا المزيد (اختياري)' : 'Tell us more (optional)'"
      class="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all"
      :class="isDark ? 'bg-[#00251E] border-white/10 focus:border-[#00896F] focus:ring-[#00896F] text-white' : 'bg-white border-gray-200 text-gray-900 focus:border-[#00896F] focus:ring-[#00896F]'" />
    <p class="text-xs text-right mt-1" :class="isDark ? 'text-white/40' : 'text-gray-400'">{{ (answers.improve_freetext || '').length }}/2000</p>
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
