<template>
  <div class="rounded-2xl border p-6 transition-all duration-300"
    :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-teal-50 shadow-[0_4px_20px_rgba(0,183,148,0.05)]'">

    <h2 class="font-medium text-lg" :class="isDark ? 'text-white' : 'text-[#013E32]'">
      {{ currentLang === 'ar' ? 'إدارة الجلسات' : 'Session Management' }}
    </h2>
    <p class="text-xs transition-colors mb-6" :class="isDark ? 'text-white/60' : 'text-black/50'">
      {{ currentLang === 'ar' ? 'التحكم في مدة بقاء تسجيل الدخول نشطًا' : 'Control how long you stay logged in' }}
    </p>

    <div class="flex flex-col gap-1.5 max-w-sm">
      <label class="block text-[14px] text-gray-900 mb-2" :class="isDark ? 'text-white/80' : 'text-[#013E32]/80'">
        {{ currentLang === 'ar' ? 'مهلة الجلسة' : 'Session Timeout' }}
      </label>
      <div class="relative">
        <CommonSelectDropdown mode="select" :clearable="false" :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" :placeholder="currentLang === 'ar' ? 'اختر المدة' : 'Select duration'" :options="timeoutOptions.map(opt => ({ value: opt.minutes, label: opt.label }))" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [Number, String, null], default: null },
  timeoutOptions: { type: Array, required: true },
})

defineEmits(['update:modelValue'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
</script>
