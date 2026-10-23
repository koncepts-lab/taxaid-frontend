<template>
  <div class="rounded-2xl border p-6 transition-all duration-300"
    :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-teal-50 shadow-[0_4px_20px_rgba(0,183,148,0.05)]'">

    <div class="flex items-start justify-between gap-4 mb-6">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-colors"
          :class="isDark ? 'bg-teal-950 text-[#00B68D]' : 'bg-[#E8FCF2] text-[#00835D]'">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <div>
          <h2 class="text-[24px] font-regular mb-2" :class="isDark ? 'text-white' : 'text-[#013E32]'">
            {{ currentLang === 'ar' ? 'الملف الشخصي' : 'Profile' }}
          </h2>
          <p class="text-[14px] mb-6" :style="{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#00000080' }">
            {{ currentLang === 'ar' ? 'قم بتحديث اسمك كما يظهر في جميع أنحاء النظام' : 'Update your name as it appears across the system' }}
          </p>
        </div>
      </div>

      <Transition name="fade">
        <div v-if="profileStatus.message" class="flex items-center gap-1.5 text-[13px] font-medium flex-shrink-0"
          :class="profileStatus.type === 'success' ? 'text-emerald-500' : 'text-red-500'">
          <svg v-if="profileStatus.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{{ profileStatus.message }}</span>
        </div>
      </Transition>
    </div>

    <form @submit.prevent="handleUpdateProfile" class="flex flex-col gap-4 max-w-3xl">
      <div class="flex flex-col sm:flex-row gap-4 sm:items-end">
        <div class="flex-1 flex flex-col gap-1.5">
          <label class="block text-[14px] text-gray-900 mb-2" :class="isDark ? 'text-white/80' : 'text-[#013E32]/80'">
            {{ currentLang === 'ar' ? 'الاسم الأول' : 'First Name' }}
          </label>
          <input v-model="firstNameForm" type="text" required maxlength="15" :disabled="!isEditing"
            class="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            :class="isDark
              ? 'bg-[#00251E] border-teal-900 focus:border-[#00B68D] focus:ring-[#00B68D] text-white'
              : 'bg-white border text-gray-900 focus:border-[#00896F] focus:ring-[#00896F]'"
            :style="!isDark ? 'border-color: #A2E8D6;' : ''" />
        </div>
        <div class="flex-1 flex flex-col gap-1.5">
          <label class="block text-[14px] text-gray-900 mb-2" :class="isDark ? 'text-white/80' : 'text-[#013E32]/80'">
            {{ currentLang === 'ar' ? 'اسم العائلة' : 'Last Name' }}
          </label>
          <input v-model="lastNameForm" type="text" maxlength="15" :disabled="!isEditing"
            class="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            :class="isDark
              ? 'bg-[#00251E] border-teal-900 focus:border-[#00B68D] focus:ring-[#00B68D] text-white'
              : 'bg-white border text-gray-900 focus:border-[#00896F] focus:ring-[#00896F]'"
            :style="!isDark ? 'border-color: #A2E8D6;' : ''" />
        </div>

        <div class="flex gap-3 flex-shrink-0 w-[214px]">
          <button v-if="!isEditing" type="button" @click="isEditing = true"
            @mouseenter="isBtnHovered = true"
            @mouseleave="isBtnHovered = false"
            class="w-fit transition-all transform active:scale-95 text-center flex items-center justify-center font-normal px-6 py-3"
            :class="isDark
              ? 'shadow-[0_4px_12px_rgba(0,146,118,0.2)]'
              : 'shadow-[0_4px_12px_rgba(0,146,118,0.15)]'"
            :style="{
              backgroundColor: isBtnHovered ? '#007b63' : '#009276',
              fontWeight: '400',
              fontSize: '14px',
              borderRadius: '8px',
              color: '#FFFFFF'
            }">
            {{ currentLang === 'ar' ? 'تعديل' : 'Edit' }}
          </button>

          <button v-else type="submit"
            @mouseenter="isBtnHovered = true"
            @mouseleave="isBtnHovered = false"
            class="w-fit transition-all transform active:scale-95 text-center flex items-center justify-center font-normal px-6 py-3"
            :class="isDark
              ? 'shadow-[0_4px_12px_rgba(0,146,118,0.2)]'
              : 'shadow-[0_4px_12px_rgba(0,146,118,0.15)]'"
            :style="{
              backgroundColor: isBtnHovered ? '#007b63' : '#009276',
              fontWeight: '400',
              fontSize: '14px',
              borderRadius: '8px',
              color: '#FFFFFF'
            }">
            {{ currentLang === 'ar' ? 'حفظ' : 'Save' }}
          </button>

          <button v-if="isEditing" type="button" @click="handleCancel"
            class="w-fit transition-all transform active:scale-95 text-center flex items-center justify-center font-normal border px-6 py-3"
            :style="{
              fontWeight: '400',
              fontSize: '14px',
              borderRadius: '8px',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#0000001A',
              color: isDark ? '#FFFFFF' : '#013E32'
            }">
            {{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  currentName: { type: String, default: '' },
  updateProfile: { type: Function, required: true },
})

const emit = defineEmits(['updated'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const isBtnHovered = ref(false)

const splitName = (full) => {
  const parts = (full ?? '').trim().split(/\s+/)
  return { first: parts[0] ?? '', last: parts.slice(1).join(' ') }
}
const { first: initialFirst, last: initialLast } = splitName(props.currentName)
const firstNameForm = ref(initialFirst)
const lastNameForm = ref(initialLast)

const isEditing = ref(false)
const profileStatus = reactive({ type: '', message: '' })
const profileSaving = ref(false)

const handleCancel = () => {
  firstNameForm.value = initialFirst
  lastNameForm.value = initialLast
  isEditing.value = false
}

const handleUpdateProfile = async () => {
  if (profileSaving.value) return
  profileSaving.value = true

  const fullName = [firstNameForm.value.trim(), lastNameForm.value.trim()].filter(Boolean).join(' ')
  const res = await props.updateProfile(fullName)

  profileStatus.type = res.ok ? 'success' : 'error'
  profileStatus.message = res.ok
    ? (currentLang.value === 'ar' ? 'تم التحديث' : 'Profile updated')
    : (currentLang.value === 'ar' ? 'فشل التحديث' : 'Update failed')

  profileSaving.value = false
  if (res.ok) {
    isEditing.value = false
    emit('updated', fullName)
  }
  setTimeout(() => { profileStatus.message = '' }, 4000)
}
</script>
