<template>
  <div class="flex flex-col gap-3">
    <div>
      <label class="block text-[14px] mb-1" :class="dark ? 'text-white/80' : 'text-[#013E32]/80'">
        {{ lang === 'ar' ? 'إرسال البريد الداخلي إلى' : 'Send internal mails to' }}
      </label>
      <p class="text-[12px] min-h-[32px]" :class="dark ? 'text-white/50' : 'text-black/40'">
        {{ mode === 'roles'
          ? (lang === 'ar' ? 'المستخدمون النشطون الذين لديهم الأدوار المحددة. بدون تحديد = جميع المستخدمين النشطين' : 'Active users with the selected roles. Nothing selected = every active user')
          : (lang === 'ar' ? 'المستخدمون النشطون والجهات الداخلية غير المستخدمين في الأقسام المحددة. بدون تحديد = الجميع' : 'Active users and non-user contacts in the selected departments. Nothing selected = everyone') }}
      </p>
    </div>

    <div class="inline-flex self-start p-1 rounded-xl border" :class="dark ? 'border-teal-900 bg-teal-950/40' : 'border-[#A2E8D6] bg-[#F3FDFA]'">
      <button v-for="m in modes" :key="m.key" type="button" @click="$emit('update:mode', m.key)"
        class="px-4 py-1.5 rounded-lg text-sm transition-all"
        :class="mode === m.key ? 'bg-[#009276] text-white shadow-sm' : (dark ? 'text-white/70 hover:text-white' : 'text-[#013E32]/70 hover:text-[#013E32]')">
        {{ lang === 'ar' ? m.ar : m.en }}
      </button>
    </div>

    <div class="min-h-[96px]">
      <div v-if="loading" class="flex flex-wrap gap-3">
        <span v-for="i in 3" :key="i" class="h-[38px] w-24 rounded-lg animate-pulse" :class="dark ? 'bg-teal-950/60' : 'bg-gray-100'"></span>
      </div>

      <div v-else-if="mode === 'roles'" class="flex flex-wrap gap-3">
        <label v-for="r in ROLES" :key="r"
          class="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-all"
          :class="roles.includes(r)
            ? (dark ? 'border-[#00B68D] bg-teal-950/60 text-white' : 'border-[#00896F] bg-[#E6FFF9] text-[#013E32]')
            : (dark ? 'border-teal-900 text-white/70' : 'border-[#A2E8D6] text-gray-600')">
          <input type="checkbox" :checked="roles.includes(r)" @change="toggleRole(r)" class="accent-[#009276]" />
          {{ roleLabel(r, lang) }}
        </label>
      </div>

      <div v-else class="flex flex-col gap-3">
        <div class="flex flex-wrap items-center gap-2 min-h-[38px]">
          <span v-for="d in depts" :key="d" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px]"
            :class="dark ? 'bg-teal-900/60 text-teal-100' : 'bg-[#E6FFF9] text-[#013E32]'">
            {{ departmentLabel(d, lang) }}
            <button type="button" @click="$emit('update:depts', depts.filter((x) => x !== d))" class="opacity-60 hover:opacity-100" aria-label="Remove">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </span>
          <span v-if="!depts.length" class="text-[13px]" :class="dark ? 'text-white/50' : 'text-black/40'">
            {{ lang === 'ar' ? 'لم يتم اختيار أقسام — الجميع' : 'No departments selected — everyone' }}
          </span>
        </div>
        <button type="button" @click="showModal = true" class="self-start px-4 py-2 rounded-lg border text-sm transition-all"
          :class="dark ? 'border-teal-800 text-white hover:bg-teal-950/60' : 'border-[#A2E8D6] text-[#013E32] hover:bg-[#F3FDFA]'">
          {{ lang === 'ar' ? 'اختيار الأقسام' : 'Select departments' }}
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 p-4" @click.self="showModal = false">
        <div class="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 max-h-[85vh]" :class="dark ? 'bg-[#002E26] text-white' : 'bg-white text-[#013E32]'">
          <div>
            <h3 class="text-[20px]">{{ lang === 'ar' ? 'اختيار الأقسام' : 'Select departments' }}</h3>
            <p class="text-[13px] mt-1" :class="dark ? 'text-white/60' : 'text-gray-500'">{{ depts.length }} {{ lang === 'ar' ? 'محدد' : 'selected' }}</p>
          </div>
          <input v-model="query" type="text" :placeholder="lang === 'ar' ? 'ابحث عن قسم' : 'Search departments'"
            class="w-full h-10 rounded-lg px-3 text-sm border focus:outline-none focus:border-[#00896F]"
            :class="dark ? 'bg-transparent border-white/20 text-white placeholder-white/40' : 'bg-white border-[#04C18F] text-black'" />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto min-h-[240px] content-start">
            <label v-for="d in filtered" :key="d.key"
              class="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-all"
              :class="depts.includes(d.key)
                ? (dark ? 'border-[#00B68D] bg-teal-950/60' : 'border-[#00896F] bg-[#E6FFF9]')
                : (dark ? 'border-teal-900 text-white/80' : 'border-[#A2E8D6] text-gray-700')">
              <input type="checkbox" :checked="depts.includes(d.key)" @change="toggleDept(d.key)" class="accent-[#009276]" />
              {{ lang === 'ar' ? d.ar : d.en }}
            </label>
          </div>
          <div class="flex justify-between gap-3">
            <button type="button" @click="$emit('update:depts', [])" class="px-4 py-2 rounded-lg border text-sm" :class="dark ? 'border-white/20' : 'border-gray-200'">{{ lang === 'ar' ? 'مسح' : 'Clear' }}</button>
            <button type="button" @click="showModal = false" class="px-5 py-2 rounded-lg bg-[#009276] text-white text-sm">{{ lang === 'ar' ? 'تم' : 'Done' }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  mode: { type: String, default: 'roles' },
  roles: { type: Array, default: () => [] },
  depts: { type: Array, default: () => [] },
  lang: { type: String, default: 'en' },
  dark: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['update:mode', 'update:roles', 'update:depts'])

const { roleLabel } = useRoleLabel()
const ROLES = ['master_user', 'account_user', 'sales_user', 'procurement_user', 'project_manager_user', 'partner_user', 'guest_user']
const modes = [{ key: 'roles', en: 'Teams (roles)', ar: 'الفرق (الأدوار)' }, { key: 'departments', en: 'Departments', ar: 'الأقسام' }]

const showModal = ref(false)
const query = ref('')
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? DEPARTMENTS.filter((d) => d.en.toLowerCase().includes(q) || d.ar.includes(q)) : DEPARTMENTS
})

const toggleRole = (r) => emit('update:roles', props.roles.includes(r) ? props.roles.filter((x) => x !== r) : [...props.roles, r])
const toggleDept = (d) => emit('update:depts', props.depts.includes(d) ? props.depts.filter((x) => x !== d) : [...props.depts, d])
</script>
