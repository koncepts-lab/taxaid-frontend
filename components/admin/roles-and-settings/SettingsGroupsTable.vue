<template>
  <div class="border rounded-xl overflow-hidden shadow-sm" :class="dark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-gray-100'">
    <div class="px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-3" :class="dark ? 'border-white/10' : 'border-gray-100'">
      <div class="flex items-start gap-3">
        <div v-if="icon" class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="dark ? 'bg-teal-950 text-[#00B68D]' : 'bg-[#E6FFF9] text-[#013E32]'">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" v-html="icon"></svg>
        </div>
        <div>
        <h2 class="text-[16px] font-medium" :class="dark ? 'text-white' : 'text-[#101828]'">{{ title }}</h2>
        <p class="text-[13px] mt-0.5" :class="dark ? 'text-white/60' : 'text-[#4A5565]'">{{ subtitle }}</p>
        </div>
      </div>
      <input v-model="search" @input="debouncedLoad" type="text" placeholder="Search settings…"
        class="px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#008169] w-full md:w-[220px]" :class="dark ? 'bg-transparent border-white/20 text-white placeholder-white/40' : 'border-gray-200'" />
    </div>

    <p v-if="error" class="px-6 pt-3 text-[13px] text-red-500">{{ error }}</p>

    <div class="w-full overflow-x-auto">
      <div class="min-w-[820px] flex flex-col" :style="{ height: `${48 + 10 * 68}px` }">
        <div class="grid grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)_minmax(0,2fr)_110px] bg-[#008865] text-white text-sm h-[48px] items-center shrink-0">
          <div class="px-6 font-medium">Name</div>
          <div class="px-4 font-medium">Description</div>
          <div class="px-4 font-medium">Value</div>
          <div class="px-4 font-medium text-center">Actions</div>
        </div>

        <template v-if="loading">
          <div v-for="n in 10" :key="n" class="grid grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)_minmax(0,2fr)_110px] h-[68px] items-center border-b shrink-0" :class="dark ? 'border-white/10' : 'border-gray-100'">
            <div class="px-6"><div class="skeleton h-4 w-32 rounded"></div></div>
            <div class="px-4"><div class="skeleton h-3 w-56 rounded"></div></div>
            <div class="px-4 flex gap-2"><div class="skeleton h-6 w-16 rounded-full"></div><div class="skeleton h-6 w-16 rounded-full"></div></div>
            <div class="px-4 flex justify-center"><div class="skeleton h-8 w-16 rounded-md"></div></div>
          </div>
        </template>

        <template v-else-if="rows.length">
          <div v-for="row in rows" :key="row.group" class="grid grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)_minmax(0,2fr)_110px] h-[68px] items-center border-b text-sm shrink-0" :class="dark ? 'border-white/10 text-white/90' : 'border-gray-100 text-gray-700'">
            <div class="px-6 min-w-0">
              <span class="font-medium block truncate" :class="dark ? 'text-white' : 'text-gray-800'">{{ row.label }}</span>
              <span v-if="mode === 'org' && row.customized" class="text-[11px] font-medium bg-[#E4FFF6] text-[#00896F] rounded-full px-2 py-0.5">Customized</span>
            </div>
            <div class="px-4 text-[13px] line-clamp-2" :class="dark ? 'text-white/60' : 'text-gray-500'">{{ row.description }}</div>
            <div class="px-4 flex flex-wrap items-center gap-1.5 overflow-hidden max-h-[60px]">
              <template v-if="row.type === 'role_bool'">
                <span v-for="chip in chips(row).slice(0, 3)" :key="chip" class="rounded-full px-2.5 py-0.5 text-[12px] font-medium bg-[#E4FFF6] text-[#00896F]">{{ chip }}</span>
                <span v-if="chips(row).length > 3" class="rounded-full px-2.5 py-0.5 text-[12px] font-medium bg-gray-100 text-gray-600">+{{ chips(row).length - 3 }}</span>
                <span v-if="!chips(row).length" class="rounded-full px-2.5 py-0.5 text-[12px] font-medium bg-gray-100 text-gray-500">None</span>
              </template>
              <template v-else-if="row.type === 'role_number'">
                <span v-for="chip in chips(row).slice(0, 3)" :key="chip" class="rounded-full px-2.5 py-0.5 text-[12px] font-medium bg-blue-50 text-blue-600">{{ chip }}</span>
                <span v-if="chips(row).length > 3" class="rounded-full px-2.5 py-0.5 text-[12px] font-medium bg-gray-100 text-gray-600">+{{ chips(row).length - 3 }}</span>
                <span v-if="!chips(row).length" class="rounded-full px-2.5 py-0.5 text-[12px] font-medium bg-gray-100 text-gray-500">No limit</span>
              </template>
              <template v-else>
                <span class="rounded-full px-2.5 py-0.5 text-[12px] font-medium bg-blue-50 text-blue-600">{{ singleValue(row) ?? 'No limit' }}</span>
                <span v-if="mode === 'org' && row.items[0]?.org_value == null && row.items[0]?.default_value != null" class="text-[11px] text-blue-400">plan default</span>
              </template>
            </div>
            <div class="px-4 flex justify-center">
              <button @click="openEdit(row)" class="px-3 py-1.5 border border-[#008169]/30 text-[#00896F] rounded-md text-[13px] font-medium hover:bg-[#00B794]/10 disabled:opacity-40">Edit</button>
            </div>
          </div>
        </template>

        <div v-else class="flex-1 flex items-center justify-center text-sm text-gray-400">No settings found.</div>
      </div>
    </div>

    <div class="min-h-[64px]">
      <CommonPaginationBar v-if="meta.total > 0" :meta="meta" :loading="loading"
        @page-change="(p) => load(p)" @per-page-change="(pp) => { perPage = pp; load(1) }" />
    </div>

    <div v-if="editing" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="editing = null">
      <div class="rounded-xl shadow-lg w-[480px] max-w-full p-6 max-h-[90vh] overflow-y-auto" :class="dark ? 'bg-[#002E26] text-white' : 'bg-white text-gray-900'">
        <h3 class="text-[16px] font-semibold">{{ editing.label }}</h3>
        <p class="text-[13px] mt-1 mb-4" :class="dark ? 'text-white/60' : 'text-gray-500'">{{ editing.description }}</p>

        <div v-if="editing.type === 'role_bool'" class="space-y-2 mb-4">
          <label v-for="role in roles" :key="role" class="flex items-center gap-3 text-sm">
            <input type="checkbox" v-model="editing.form[role]" class="w-5 h-5 accent-[#00896F]" />
            {{ roleLabel(role, lang) }}
          </label>
        </div>

        <div v-else-if="editing.type === 'role_number'" class="space-y-2 mb-4">
          <div v-for="role in roles" :key="role" class="flex items-center justify-between gap-3 text-sm">
            <span>{{ roleLabel(role, lang) }}</span>
            <input v-model="editing.form[role]" type="number" min="0" placeholder="No limit"
              class="w-28 px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]" />
          </div>
        </div>

        <div v-else class="mb-4">
          <input v-model="editing.form.value" type="number" min="0" placeholder="Use plan default"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]" />
        </div>

        <label v-if="mode === 'org' && !editing.group.startsWith('limit.')" class="flex items-center justify-between gap-4 text-sm mb-4">
          <span>
            Master can see this
            <span class="block text-[12px] text-gray-400">Only applies when Master can edit permissions is on.</span>
          </span>
          <input type="checkbox" v-model="editing.visible" class="w-5 h-5 accent-[#00896F]" />
        </label>

        <p v-if="modalError" class="text-[13px] text-red-500 mb-3">{{ modalError }}</p>
        <div class="flex items-center justify-between gap-3">
          <button v-if="mode === 'org' && editing.customized" @click="reset" :disabled="busy"
            class="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-60">Reset to default</button>
          <span v-else></span>
          <div class="flex gap-3">
            <button @click="editing = null" class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button @click="save" :disabled="busy" class="px-4 py-2 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] disabled:opacity-60">
              {{ busy ? 'Saving…' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  mode: { type: String, default: 'global' },
  tenantId: { type: Number, default: null },
  title: { type: String, default: 'Roles & Settings' },
  subtitle: { type: String, default: '' },
  dark: { type: Boolean, default: false },
  icon: { type: String, default: '' },
})
const emit = defineEmits(['loaded', 'changed'])

const { list, updateGroup, errorMessage } = useDefaultSettings()
const { getRolesSettings, setRolesGroup, resetRolesGroup } = useClientManagement()
const { roleLabel } = useRoleLabel()
const lang = useState('currentLang')

const ALL_ROLES = ['master_user', 'account_user', 'sales_user', 'procurement_user', 'project_manager_user', 'partner_user', 'guest_user']

const rows = ref([])
const roles = ref(ALL_ROLES)
const meta = ref({ current_page: 1, last_page: 1, total: 0, per_page: 10 })
const perPage = ref(10)
const search = ref('')
const loading = ref(true)
const busy = ref(false)
const error = ref('')
const modalError = ref('')
const editing = ref(null)

const asBool = (v) => v === true || v === 1 || v === '1'
const currentOf = (item) => (props.mode === 'org' ? (item.org_value ?? item.default_value) : item.value)

const chips = (row) => {
  if (row.type === 'role_bool') {
    return row.items.filter((i) => asBool(currentOf(i))).map((i) => roleLabel(i.role, lang.value))
  }
  return row.items
    .filter((i) => currentOf(i) !== null && currentOf(i) !== undefined && currentOf(i) !== '')
    .map((i) => `${roleLabel(i.role, lang.value)} ${currentOf(i)}`)
}

const singleValue = (row) => {
  const v = row.items[0] ? currentOf(row.items[0]) : null
  return v === '' ? null : v
}

async function load(page = 1) {
  loading.value = true
  error.value = ''
  try {
    const params = { page, per_page: perPage.value, search: search.value.trim() }
    if (props.mode === 'org') {
      const res = await getRolesSettings(props.tenantId, params)
      rows.value = res.groups ?? []
      meta.value = res.meta
      if (res.data?.roles?.length) roles.value = res.data.roles
      emit('loaded', res.data)
    } else {
      const res = await list(params)
      rows.value = res.data ?? []
      meta.value = res.meta
    }
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}

let timer
const debouncedLoad = () => {
  clearTimeout(timer)
  timer = setTimeout(() => load(1), 300)
}

const openEdit = (row) => {
  modalError.value = ''
  const form = {}
  if (row.type === 'role_bool') roles.value.forEach((r) => { form[r] = asBool(currentOf(row.items.find((i) => i.role === r) ?? {})) })
  else if (row.type === 'role_number') roles.value.forEach((r) => {
    const v = currentOf(row.items.find((i) => i.role === r) ?? {})
    form[r] = v ?? ''
  })
  else form.value = props.mode === 'org' ? (row.items[0]?.org_value ?? '') : (row.items[0]?.value ?? '')
  editing.value = { ...row, form, visible: !row.locked }
}

const buildPayload = () => {
  const row = editing.value
  const payload = {}
  if (row.type === 'role_bool') {
    payload.values = Object.fromEntries(roles.value.map((r) => [r, !!row.form[r]]))
  } else if (row.type === 'role_number') {
    payload.values = Object.fromEntries(roles.value.map((r) => [r, row.form[r] === '' || row.form[r] === null ? null : Number(row.form[r])]))
  } else {
    payload.value = row.form.value === '' || row.form.value === null ? null : Number(row.form.value)
  }
  if (props.mode === 'org' && !row.group.startsWith('limit.') && row.group !== 'limit.users.total') payload.is_admin_default = !row.visible
  return payload
}

async function save() {
  busy.value = true
  modalError.value = ''
  try {
    const payload = buildPayload()
    if (props.mode === 'org') await setRolesGroup(props.tenantId, editing.value.group, payload)
    else await updateGroup(editing.value.group, payload)
    editing.value = null
    emit('changed')
    await load(meta.value.current_page)
  } catch (e) {
    modalError.value = errorMessage(e)
  } finally {
    busy.value = false
  }
}

async function reset() {
  busy.value = true
  modalError.value = ''
  try {
    await resetRolesGroup(props.tenantId, editing.value.group)
    editing.value = null
    emit('changed')
    await load(meta.value.current_page)
  } catch (e) {
    modalError.value = errorMessage(e)
  } finally {
    busy.value = false
  }
}

defineExpose({ reload: () => load(meta.value.current_page) })

onMounted(() => load(1))
onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
</style>
