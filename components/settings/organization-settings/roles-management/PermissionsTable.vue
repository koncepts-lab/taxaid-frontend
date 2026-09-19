<template>
  <div v-if="loading || groups.length" class="rounded-2xl border p-6 transition-all duration-300"
    :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-teal-50 text-[#013E32] shadow-[0_4px_20px_rgba(0,183,148,0.05)]'">

    <div class="flex items-start gap-4 mb-6">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" :class="isDark ? 'bg-teal-950 text-[#00B68D]' : 'bg-[#E6FFF9] text-[#013E32]'">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      </div>
      <div>
        <h2 class="text-[24px] font-regular mb-2" :class="isDark ? 'text-white' : 'text-[#013E32]'">{{ t('Permissions', 'الصلاحيات') }}</h2>
        <p class="text-[14px]" :class="muted">{{ t('Choose which roles can access each feature', 'اختر الأدوار التي يمكنها الوصول إلى كل ميزة') }}</p>
      </div>
    </div>

    <p v-if="error" class="mb-4 text-sm text-red-500">{{ error }}</p>

    <div class="rounded-xl border overflow-x-auto" :class="isDark ? 'border-white/10' : 'border-gray-100'">
      <div class="min-w-[640px]">
        <div class="grid grid-cols-[1.2fr_2.2fr_100px] h-[48px] items-center text-sm font-medium bg-[#008865] text-white">
          <div class="px-6">{{ t('Feature', 'الميزة') }}</div>
          <div class="px-4">{{ t('Roles', 'الأدوار') }}</div>
          <div class="px-4 text-center">{{ t('Actions', 'إجراءات') }}</div>
        </div>

        <div class="overflow-y-auto" :style="{ height: `${VISIBLE_ROWS * 64}px` }">
        <template v-if="loading">
          <div v-for="n in VISIBLE_ROWS" :key="n" class="grid grid-cols-[1.2fr_2.2fr_100px] h-[64px] items-center border-b" :class="rowBorder">
            <div class="px-6"><div class="skeleton h-4 w-32 rounded" :class="{ dark: isDark }"></div></div>
            <div class="px-4 flex gap-2"><div class="skeleton h-6 w-16 rounded-full" :class="{ dark: isDark }"></div><div class="skeleton h-6 w-16 rounded-full" :class="{ dark: isDark }"></div></div>
            <div class="px-4 flex justify-center"><div class="skeleton h-8 w-14 rounded-lg" :class="{ dark: isDark }"></div></div>
          </div>
        </template>

        <template v-else>
          <div v-for="group in groups" :key="group.group" class="grid grid-cols-[1.2fr_2.2fr_100px] h-[64px] items-center border-b text-sm" :class="rowBorder">
            <div class="px-6 min-w-0">
              <span class="font-medium block truncate" :class="isDark ? 'text-white' : 'text-[#013E32]'">{{ group.label }}</span>
              <span v-if="group.description" class="block text-[12px] truncate" :class="muted">{{ group.description }}</span>
            </div>
            <div class="px-4 flex flex-wrap items-center gap-1.5 overflow-hidden max-h-[56px]">
              <span v-for="role in activeRoles(group)" :key="role" class="rounded-full px-2.5 py-0.5 text-[12px] font-medium" :class="isDark ? 'bg-teal-900/50 text-teal-200' : 'bg-[#E4FFF6] text-[#00896F]'">{{ roleLabel(role) }}</span>
              <span v-if="!activeRoles(group).length" class="rounded-full px-2.5 py-0.5 text-[12px] font-medium" :class="isDark ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-500'">{{ t('No roles', 'لا أدوار') }}</span>
            </div>
            <div class="px-4 flex justify-center">
              <button @click="openEdit(group)" class="px-3 py-1 text-[12px] rounded-lg border border-[#008169]/40 text-[#00896F] hover:bg-[#00B794]/10">{{ t('Edit', 'تعديل') }}</button>
            </div>
          </div>
        </template>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="editing" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40" @click.self="editing = null">
        <div class="w-full max-w-md rounded-2xl p-6 space-y-4" :class="isDark ? 'bg-[#002E26] text-white' : 'bg-white text-[#013E32]'">
          <div>
            <h3 class="text-[20px]">{{ editing.label }}</h3>
            <p v-if="editing.description" class="text-[13px] mt-1" :class="muted">{{ editing.description }}</p>
          </div>
          <div class="space-y-2">
            <label v-for="item in editing.items.filter((i) => i.editable)" :key="item.role" class="flex items-center gap-3 text-sm">
              <input type="checkbox" v-model="form[item.role]" class="w-5 h-5 accent-[#00896F]" />
              {{ roleLabel(item.role) }}
            </label>
          </div>
          <p class="text-sm text-red-500 min-h-[20px]">{{ modalError }}</p>
          <div class="flex gap-3 justify-end">
            <button @click="editing = null" class="px-5 py-2 rounded-xl border text-sm" :class="isDark ? 'border-white/20' : 'border-gray-200'">{{ t('Cancel', 'إلغاء') }}</button>
            <button @click="save" :disabled="busy" class="px-5 py-2 rounded-xl bg-[#00896F] hover:bg-[#00705a] text-white text-sm disabled:opacity-60">{{ busy ? '...' : t('Save', 'حفظ') }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const VISIBLE_ROWS = 5
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { roleLabel: roleLabelFor } = useRoleLabel()
const team = useTeamManagement()

const groups = ref([])
const loading = ref(true)
const error = ref('')
const editing = ref(null)
const form = reactive({})
const busy = ref(false)
const modalError = ref('')

const t = (en, ar) => (currentLang.value === 'ar' ? ar : en)
const roleLabel = (role) => roleLabelFor(role, currentLang.value)
const muted = computed(() => (isDark.value ? 'text-white/60' : 'text-[#000000CC]'))
const rowBorder = computed(() => (isDark.value ? 'border-white/10' : 'border-gray-100'))

const activeRoles = (group) => group.items.filter((i) => i.value).map((i) => i.role)

const load = async () => {
  error.value = ''
  try {
    const res = await team.getPermissions()
    groups.value = res?.enabled ? (res.groups ?? []).filter((g) => g.items.some((i) => i.editable)) : []
  } catch (e) {
    error.value = team.errorMessage(e)
  } finally {
    loading.value = false
  }
}

const openEdit = (group) => {
  modalError.value = ''
  Object.keys(form).forEach((k) => delete form[k])
  group.items.filter((i) => i.editable).forEach((i) => { form[i.role] = !!i.value })
  editing.value = group
}

const save = async () => {
  busy.value = true
  modalError.value = ''
  try {
    await team.setPermissionGroup(editing.value.group, { ...form })
    editing.value = null
    await load()
  } catch (e) {
    modalError.value = team.errorMessage(e)
  } finally {
    busy.value = false
  }
}

defineExpose({ reload: load })
onMounted(load)
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: perm-shimmer 1.4s ease infinite;
}
.skeleton.dark {
  background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.14) 37%, rgba(255,255,255,0.06) 63%);
  background-size: 400% 100%;
}
@keyframes perm-shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
</style>
