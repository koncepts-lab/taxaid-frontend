<template>
  <div class="border rounded-xl overflow-hidden shadow-sm" :class="dark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-gray-100'">
    <div class="px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-3" :class="dark ? 'border-white/10' : 'border-gray-100'">
      <div>
        <h2 class="text-[16px] font-medium" :class="dark ? 'text-white' : 'text-[#101828]'">Content Sources</h2>
        <p class="text-[13px] mt-0.5" :class="dark ? 'text-white/60' : 'text-[#4A5565]'">External pages our backend fetches and serves to the frontend, like terms and privacy.</p>
      </div>
      <div class="flex items-center gap-3">
        <input v-model="search" @input="debouncedLoad" type="text" placeholder="Search key or URL…"
          class="px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#008169] w-full md:w-[220px]" :class="dark ? 'bg-transparent border-white/20 text-white placeholder-white/40' : 'border-gray-200'" />
        <button @click="openCreate" class="px-4 py-2 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] whitespace-nowrap">Add link</button>
      </div>
    </div>

    <p v-if="error" class="px-6 pt-3 text-[13px] text-red-500">{{ error }}</p>

    <div class="w-full overflow-x-auto">
      <div class="w-full min-w-[980px] flex flex-col" :style="{ minHeight: `${48 + perPage * 68}px` }">
        <div :class="gridClass" class="bg-[#008865] text-white text-sm h-[48px] items-center shrink-0">
          <div class="px-6 font-medium">Key</div>
          <div class="px-4 font-medium">Base URL</div>
          <div class="px-4 font-medium">Path</div>
          <div class="px-4 font-medium">Params</div>
          <div class="px-4 font-medium">Content blocks</div>
          <div class="px-4 font-medium">Headers</div>
          <div class="px-4 font-medium">Access</div>
          <div class="px-4 font-medium text-center">Actions</div>
        </div>

        <template v-if="loading">
          <div v-for="n in perPage" :key="n" :class="[gridClass, dark ? 'border-white/10' : 'border-gray-100']" class="h-[68px] items-center border-b shrink-0">
            <div class="px-6"><div class="skeleton h-4 w-20 rounded" :class="{ dark }"></div></div>
            <div class="px-4"><div class="skeleton h-3 w-44 rounded" :class="{ dark }"></div></div>
            <div class="px-4"><div class="skeleton h-3 w-40 rounded" :class="{ dark }"></div></div>
            <div class="px-4"><div class="skeleton h-6 w-24 rounded-full" :class="{ dark }"></div></div>
            <div class="px-4"><div class="skeleton h-6 w-20 rounded-full" :class="{ dark }"></div></div>
            <div class="px-4"><div class="skeleton h-6 w-14 rounded-full" :class="{ dark }"></div></div>
            <div class="px-4"><div class="skeleton h-6 w-16 rounded-full" :class="{ dark }"></div></div>
            <div class="px-4 flex justify-center gap-2"><div class="skeleton h-8 w-12 rounded-md" :class="{ dark }"></div><div class="skeleton h-8 w-14 rounded-md" :class="{ dark }"></div></div>
          </div>
        </template>

        <template v-else-if="rows.length">
          <div v-for="row in rows" :key="row.id" :class="[gridClass, dark ? 'border-white/10 text-white/90' : 'border-gray-100 text-gray-700']" class="min-h-[68px] py-3 items-start border-b text-sm shrink-0">
            <div class="px-6 min-w-0"><span class="font-medium block" :class="dark ? 'text-white' : 'text-gray-800'">{{ row.key }}</span></div>
            <div class="px-4 min-w-0"><span class="block truncate font-mono text-[12px]" :title="row.base_url">{{ row.base_url }}</span></div>
            <div class="px-4 min-w-0"><span class="block truncate font-mono text-[12px]" :title="row.path || '/'">{{ row.path || '/' }}</span></div>
            <div class="px-4 min-w-0 flex flex-col gap-1">
              <span v-for="p in row.params.slice(0, 2)" :key="p.name" class="rounded-full px-2.5 py-0.5 text-[12px] font-medium truncate w-fit max-w-full" :class="chipBlue" :title="`${p.name}=${p.value}`">{{ p.name }}={{ p.value }}</span>
              <span v-if="row.params.length > 2" class="text-[12px]" :class="dark ? 'text-white/40' : 'text-gray-400'">+{{ row.params.length - 2 }} more — see Edit</span>
              <span v-if="!row.params.length" class="text-[12px]" :class="dark ? 'text-white/40' : 'text-gray-400'">None</span>
            </div>
            <div class="px-4 min-w-0 flex flex-col gap-1">
              <span v-for="b in row.content_blocks.slice(0, 2)" :key="b" class="rounded-full px-2.5 py-0.5 text-[12px] font-medium truncate w-fit max-w-full" :class="chipGreen" :title="b">{{ b }}</span>
              <span v-if="row.content_blocks.length > 2" class="text-[12px]" :class="dark ? 'text-white/40' : 'text-gray-400'">+{{ row.content_blocks.length - 2 }} more — see Edit</span>
              <span v-if="!row.content_blocks.length" class="text-[12px]" :class="dark ? 'text-white/40' : 'text-gray-400'">Whole response</span>
            </div>
            <div class="px-4">
              <span v-if="row.headers.length" class="rounded-full px-2.5 py-0.5 text-[12px] font-medium" :class="chipGreen" :title="row.headers.map((h) => h.name).join(', ')">{{ row.headers.length }} set</span>
              <span v-else class="text-[12px]" :class="dark ? 'text-white/40' : 'text-gray-400'">None</span>
            </div>
            <div class="px-4">
              <span class="rounded-full px-2.5 py-0.5 text-[12px] font-medium" :class="row.is_public ? chipGreen : chipAmber">
                {{ row.is_public ? 'Public' : audienceLabel(row.audience) }}
              </span>
            </div>
            <div class="px-4 flex justify-center gap-1.5">
              <button @click="copyUrl(row)" :title="copiedId === row.id ? 'Copied' : 'Copy endpoint URL'" class="w-8 h-8 flex items-center justify-center border rounded-md" :class="dark ? 'border-white/20 text-white/80 hover:bg-white/10' : 'border-gray-200 text-gray-600 hover:bg-gray-50'">
                <svg v-if="copiedId === row.id" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button @click="openEdit(row)" title="Edit" class="w-8 h-8 flex items-center justify-center border border-[#008169]/30 text-[#00896F] rounded-md hover:bg-[#00B794]/10">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button @click="confirmDelete = row" title="Delete" class="w-8 h-8 flex items-center justify-center border border-red-300 text-red-500 rounded-md hover:bg-red-50/10">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
        </template>

        <div v-else class="flex-1 flex items-center justify-center text-sm" :class="dark ? 'text-white/40' : 'text-gray-400'">No CMS links yet.</div>
      </div>
    </div>

    <div class="min-h-[64px]">
      <CommonPaginationBar v-if="meta.total > 0" :meta="meta" :loading="loading" :dark="dark" :per-page-options="[perPage]"
        @page-change="(p) => load(p)" />
    </div>

    <div v-if="editing" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="closeEdit">
      <div class="rounded-xl shadow-lg w-[640px] max-w-full p-6 max-h-[92vh] overflow-y-auto" :class="dark ? 'bg-[#002E26] text-white' : 'bg-white text-gray-900'">
        <h3 class="text-[16px] font-semibold">{{ editing.id ? 'Edit CMS link' : 'Add CMS link' }}</h3>
        <p class="text-[13px] mt-1 mb-4" :class="dark ? 'text-white/60' : 'text-gray-500'">
          The frontend calls <span class="font-mono">/api/public/cms/&lt;key&gt;</span>. Only the params already in the URL can be changed by the frontend.
        </p>

        <label class="block text-[13px] font-medium mb-1">Key</label>
        <input v-model="form.key" :disabled="!!editing.id" type="text" placeholder="terms" maxlength="100" :class="inputClass" class="mb-3 font-mono disabled:opacity-60" />

        <label class="block text-[13px] font-medium mb-1">Access</label>
        <div class="flex rounded-lg border overflow-hidden text-[13px] font-medium mb-3 w-fit" :class="dark ? 'border-white/20' : 'border-gray-200'">
          <button type="button" @click="form.is_public = true" class="px-4 py-2" :class="form.is_public ? 'bg-[#00896F] text-white' : (dark ? 'text-white/70 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-50')">Public</button>
          <button type="button" @click="form.is_public = false" class="px-4 py-2" :class="!form.is_public ? 'bg-[#00896F] text-white' : (dark ? 'text-white/70 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-50')">Requires login</button>
        </div>

        <div v-if="!form.is_public" class="mb-3">
          <p class="text-[12px] mb-1.5 opacity-70">Who can call this endpoint once logged in</p>

          <label class="flex items-center gap-2 mb-2 text-[13px] cursor-pointer w-fit">
            <input type="checkbox" :checked="isAnyAuth" @change="toggleAnyAuth" class="w-4 h-4 accent-[#00896F]" />
            Any logged-in user, regardless of type
          </label>

          <div v-if="!isAnyAuth" class="flex flex-wrap gap-2">
            <button v-for="a in SPECIFIC_AUDIENCES" :key="a" type="button" @click="toggleAudience(a)"
              class="px-3 py-1.5 rounded-full border text-[12px] font-medium capitalize"
              :class="form.audience.includes(a) ? chipGreen + ' border-transparent' : (dark ? 'border-white/20 text-white/60 hover:bg-white/10' : 'border-gray-200 text-gray-500 hover:bg-gray-50')">
              {{ a }}
            </button>
          </div>
        </div>

        <label class="block text-[13px] font-medium mb-1">Full CMS URL</label>
        <textarea v-model="form.url" rows="2" maxlength="2000" placeholder="https://cms.example.com/api/public/v1/single-types/terms?populate[contentBlocks]=true" :class="inputClass" class="font-mono"></textarea>
        <div v-if="preview" class="mt-2 mb-3 text-[12px] rounded-lg px-3 py-2 font-mono break-all" :class="dark ? 'bg-white/5 text-white/70' : 'bg-gray-50 text-gray-600'">
          <div><span class="opacity-60">Base URL</span> {{ preview.base }}</div>
          <div><span class="opacity-60">Path</span> {{ preview.path || '/' }}</div>
          <div><span class="opacity-60">Params</span> {{ preview.params.length ? preview.params.join('  ') : 'none' }}</div>
        </div>
        <div v-else class="mb-3"></div>

        <div v-if="schemeChoices.length" class="mb-3 rounded-lg border px-3 py-3 text-[13px]" :class="dark ? 'border-white/15 bg-white/5' : 'border-[#04C18F33] bg-[#F0FFFB]'">
          <p class="mb-2 font-medium">This is a local or IP address. Is it http or https? Pick the correct one.</p>
          <div class="flex flex-wrap gap-2">
            <button v-for="choice in schemeChoices" :key="choice" @click="pickScheme(choice)" :disabled="busy"
              class="px-3 py-1.5 rounded-md border font-mono text-[12px] max-w-full truncate disabled:opacity-50" :class="dark ? 'border-white/20 hover:bg-white/10' : 'border-[#007C65]/40 hover:bg-[#007C65]/10'">{{ choice }}</button>
          </div>
        </div>

        <label class="block text-[13px] font-medium mb-1">Content blocks <span class="font-normal opacity-60">(optional, returns only these blocks)</span></label>
        <div class="flex gap-2 mb-2">
          <input v-model="blockDraft" @keyup.enter.prevent="addBlock" type="text" placeholder="privacy-editor" maxlength="100" :class="inputClass" class="font-mono" />
          <button @click="addBlock" type="button" class="px-3 py-2 border rounded-lg text-sm whitespace-nowrap" :class="dark ? 'border-white/20 hover:bg-white/10' : 'border-gray-200 hover:bg-gray-50'">Add</button>
        </div>
        <div class="flex flex-wrap gap-1.5 mb-3 min-h-[8px]">
          <span v-for="b in form.content_blocks" :key="b" class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium" :class="chipGreen">
            {{ b }}<button @click="form.content_blocks = form.content_blocks.filter((x) => x !== b)" type="button" class="opacity-70 hover:opacity-100" aria-label="Remove">×</button>
          </span>
        </div>

        <label class="block text-[13px] font-medium mb-1">HTTP headers <span class="font-normal opacity-60">(optional, any name/value pair sent with the request to the CMS — not limited to auth)</span></label>
        <div v-for="(h, i) in form.headers" :key="i" class="flex gap-2 mb-2 items-start">
          <input v-model="h.name" type="text" placeholder="Header name" maxlength="100" :class="inputClass" class="w-[38%] font-mono" />
          <input v-model="h.value" type="password" autocomplete="off" maxlength="4000" :placeholder="h.saved ? '•••••• saved, leave blank to keep' : 'Header value'" :class="inputClass" class="font-mono" />
          <button @click="form.headers.splice(i, 1)" type="button" class="px-2.5 py-2 border rounded-lg text-sm text-red-500 border-red-300" aria-label="Remove header">×</button>
        </div>
        <button @click="form.headers.push({ name: '', value: '', saved: false })" type="button" :disabled="form.headers.length >= 20" class="text-[13px] text-[#00896F] font-medium disabled:opacity-40 mb-3">+ Add header</button>

        <p v-if="modalError" class="text-[13px] text-red-500 mb-3">{{ modalError }}</p>
        <div class="flex items-center justify-end gap-3">
          <button @click="closeEdit" class="px-4 py-2 border rounded-lg text-sm" :class="dark ? 'border-white/20 text-white/80 hover:bg-white/10' : 'border-gray-200 text-gray-600 hover:bg-gray-50'">Cancel</button>
          <button @click="save" :disabled="busy || !form.key.trim() || !form.url.trim()" class="px-4 py-2 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] disabled:opacity-60">
            {{ busy ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="confirmDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="confirmDelete = null">
      <div class="rounded-xl shadow-lg w-[420px] max-w-full p-6" :class="dark ? 'bg-[#002E26] text-white' : 'bg-white text-gray-900'">
        <h3 class="text-[16px] font-semibold">Delete "{{ confirmDelete.key }}"?</h3>
        <p class="text-[13px] mt-2 mb-4" :class="dark ? 'text-white/60' : 'text-gray-500'">The public route for this key stops working right away.</p>
        <p v-if="modalError" class="text-[13px] text-red-500 mb-3">{{ modalError }}</p>
        <div class="flex justify-end gap-3">
          <button @click="confirmDelete = null" class="px-4 py-2 border rounded-lg text-sm" :class="dark ? 'border-white/20 text-white/80 hover:bg-white/10' : 'border-gray-200 text-gray-600 hover:bg-gray-50'">Cancel</button>
          <button @click="removeRow" :disabled="busy" class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-60">{{ busy ? 'Deleting…' : 'Delete' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  dark: { type: Boolean, default: false },
})

const { isDark } = useTheme()
const dark = computed(() => props.dark || isDark.value)

const { list, create, update, remove, errorMessage } = useCmsEndpoints()

const gridClass = 'grid grid-cols-[120px_minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.9fr)_95px_100px_120px]'

const chipBlue = computed(() => (dark.value ? 'bg-blue-400/15 text-blue-200' : 'bg-blue-50 text-blue-600'))
const chipGreen = computed(() => (dark.value ? 'bg-[#00B68D]/20 text-[#5CE5C1]' : 'bg-[#E4FFF6] text-[#00896F]'))
const chipGray = computed(() => (dark.value ? 'bg-white/10 text-white/70' : 'bg-gray-100 text-gray-600'))
const chipAmber = computed(() => (dark.value ? 'bg-amber-400/15 text-amber-300' : 'bg-amber-50 text-amber-700'))

const SPECIFIC_AUDIENCES = ['admin', 'partner', 'organization']
const audienceLabel = (audience) => {
  if (!audience?.length) return 'Gated'
  if (audience.includes('all') || SPECIFIC_AUDIENCES.every((a) => audience.includes(a))) return 'Authenticated'
  if (audience.length === 1) return audience[0][0].toUpperCase() + audience[0].slice(1)
  return 'Selective'
}
const inputClass = computed(() => [
  'w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#008169]',
  dark.value ? 'bg-transparent border-white/20 text-white placeholder-white/40' : 'border-gray-200',
].join(' '))

const rows = ref([])
const meta = ref({ current_page: 1, last_page: 1, total: 0, per_page: 10 })
const FIXED_ROWS = 5
const MAX_ROWS = 10
const perPage = ref(FIXED_ROWS)
const search = ref('')
const loading = ref(true)
const busy = ref(false)
const error = ref('')
const modalError = ref('')
const editing = ref(null)
const confirmDelete = ref(null)
const schemeChoices = ref([])
const blockDraft = ref('')
const copiedId = ref(null)
const form = ref({ key: '', url: '', is_public: true, audience: [], content_blocks: [], headers: [] })

const isAnyAuth = computed(() => form.value.audience.includes('all'))

const toggleAnyAuth = () => {
  form.value.audience = isAnyAuth.value ? [] : ['all']
}

const toggleAudience = (a) => {
  form.value.audience = form.value.audience.includes(a)
    ? form.value.audience.filter((x) => x !== a)
    : [...form.value.audience.filter((x) => x !== 'all'), a]
}

const copyUrl = async (row) => {
  const endpointUrl = `${useRuntimeConfig().public.apiBase}/public/cms/${row.key}`
  try {
    await navigator.clipboard.writeText(endpointUrl)
    copiedId.value = row.id
    setTimeout(() => { if (copiedId.value === row.id) copiedId.value = null }, 1500)
  } catch {}
}

async function load(page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await list({ page, per_page: perPage.value, search: search.value.trim() })
    rows.value = res.data ?? []
    meta.value = res.meta

    const wantedPerPage = meta.value.total > FIXED_ROWS ? MAX_ROWS : FIXED_ROWS
    if (perPage.value !== wantedPerPage) {
      perPage.value = wantedPerPage
      return load(1)
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

const preview = computed(() => {
  try {
    const u = new URL(form.value.url.trim())
    const params = u.search ? decodeURIComponent(u.search.slice(1)).split('&').filter(Boolean) : []
    return { base: u.origin, path: u.pathname === '/' ? '' : u.pathname, params }
  } catch {
    return null
  }
})

const resetModal = () => {
  modalError.value = ''
  schemeChoices.value = []
  blockDraft.value = ''
}

const openCreate = () => {
  resetModal()
  form.value = { key: '', url: '', is_public: true, audience: [], content_blocks: [], headers: [] }
  editing.value = {}
}

const openEdit = (row) => {
  resetModal()
  form.value = {
    key: row.key,
    url: row.url,
    is_public: row.is_public,
    audience: [...(row.audience ?? [])],
    content_blocks: [...row.content_blocks],
    headers: row.headers.map((h) => ({ name: h.name, value: '', saved: true })),
  }
  editing.value = row
}

const closeEdit = () => { editing.value = null }

const addBlock = () => {
  const v = blockDraft.value.trim()
  if (v && !form.value.content_blocks.includes(v) && form.value.content_blocks.length < 20) form.value.content_blocks.push(v)
  blockDraft.value = ''
}

const pickScheme = async (choice) => {
  form.value.url = choice
  await save()
}

async function save() {
  addBlock()
  busy.value = true
  modalError.value = ''
  schemeChoices.value = []
  try {
    const payload = {
      key: form.value.key.trim(),
      url: form.value.url.trim(),
      is_public: form.value.is_public,
      audience: form.value.is_public ? [] : form.value.audience,
      content_blocks: form.value.content_blocks,
      headers: form.value.headers.filter((h) => h.name.trim()).map((h) => ({ name: h.name.trim(), value: h.value })),
    }
    const wasEdit = !!editing.value.id
    if (wasEdit) await update(editing.value.key, payload)
    else await create(payload)
    editing.value = null
    await load(wasEdit ? meta.value.current_page : 1)
  } catch (e) {
    if (e?.data?.code === 'confirm_scheme') schemeChoices.value = e.data.suggestions ?? []
    else modalError.value = errorMessage(e)
  } finally {
    busy.value = false
  }
}

async function removeRow() {
  busy.value = true
  modalError.value = ''
  try {
    await remove(confirmDelete.value.key)
    confirmDelete.value = null
    await load(rows.value.length === 1 && meta.value.current_page > 1 ? meta.value.current_page - 1 : meta.value.current_page)
  } catch (e) {
    modalError.value = errorMessage(e)
  } finally {
    busy.value = false
  }
}

onMounted(() => load(1))
onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
.skeleton.dark {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.06) 25%, rgba(255, 255, 255, 0.14) 37%, rgba(255, 255, 255, 0.06) 63%);
  background-size: 400% 100%;
}
@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
</style>
