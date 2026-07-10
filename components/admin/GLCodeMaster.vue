<template>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm py-8 px-6 flex flex-col gap-12">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div>
                <h3 class="text-base font-semibold text-gray-900">Existing List</h3>
                <p class="text-sm text-[#717182]">Edit fields and apply changes. Default values are system-managed.</p>
            </div>
            <div class="relative w-full sm:w-72">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <input type="text" v-model="search" placeholder="Search groups..."
                    class="w-full bg-[#F3F4F6] border-none rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00896F] text-black" />
            </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-12">
            <div class="border border-gray-100 rounded-2xl lg:w-3/5 max-h-[60vh] overflow-y-auto">
                <table class="w-full text-left border-separate border-spacing-0 table-fixed">
                    <thead>
                        <tr class="text-gray-800 text-sm">
                            <th class="px-4 py-4 w-1/4 font-medium sticky top-0 z-10 bg-gray-50 border-b border-gray-100">
                                <span class="inline-flex items-center gap-1.5">
                                    FS Code
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" class="text-gray-400">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </span>
                                <p class="text-[11px] font-normal text-gray-400">Fixed (BS, P&amp;L)</p>
                            </th>
                            <th class="px-4 py-4 w-1/4 font-medium sticky top-0 z-10 bg-gray-50 border-b border-gray-100">Main Group</th>
                            <th class="px-4 py-4 w-2/4 font-medium sticky top-0 z-10 bg-gray-50 border-b border-gray-100">Subgroup</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="idx in visibleRowCount" :key="idx">
                            <!-- FS Code: locked, display only -->
                            <td class="px-2 py-3 border-r border-gray-50 align-top">
                                <div v-if="filteredFs[idx - 1]" class="flex items-center gap-2 h-10">
                                    <div
                                        class="flex-1 flex items-center justify-between bg-[#F3F4F6] text-black px-3 py-2 rounded-xl h-full min-w-0">
                                        <span class="text-sm truncate">{{ filteredFs[idx - 1].code }}</span>
                                    </div>
                                </div>
                            </td>

                            <td class="px-2 py-3 border-r border-gray-50 align-top">
                                <div v-if="filteredMain[idx - 1]" class="flex items-center gap-2 group/cell h-10">
                                    <template v-if="editingCell === `mg-${filteredMain[idx - 1].id}`">
                                        <input v-model="editValue" @blur="editingCell = null"
                                            @keyup.enter="saveCell('mg', filteredMain[idx - 1])" v-focus
                                            class="flex-1 min-w-0 h-full px-3 text-black rounded-xl border border-[#00896F] outline-none text-sm shadow-sm" />
                                        <button @mousedown.prevent="saveCell('mg', filteredMain[idx - 1])"
                                            class="bg-[#FFF085] px-3 h-full rounded-lg text-xs text-black font-medium">Save</button>
                                    </template>
                                    <template v-else>
                                        <div
                                            class="flex-1 flex items-center justify-between text-black bg-[#F3F4F6] px-3 py-2 rounded-xl h-full min-w-0">
                                            <span class="text-sm truncate">{{ filteredMain[idx - 1].name }}</span>
                                            <span v-if="filteredMain[idx - 1].is_default"
                                                title="Default value — managed by the system"
                                                class="text-[10px] uppercase tracking-wide text-gray-400 bg-gray-200/70 px-1.5 py-0.5 rounded shrink-0">default</span>
                                            <svg v-else @click="startEdit('mg', filteredMain[idx - 1])" width="14"
                                                height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                stroke-width="2"
                                                class="text-gray-300 hover:text-[#00896F] cursor-pointer shrink-0">
                                                <path
                                                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </div>
                                        <button v-if="!filteredMain[idx - 1].is_default"
                                            @click="prepareDelete('mg', filteredMain[idx - 1])"
                                            class="opacity-0 group-hover/cell:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded transition-all"><svg
                                                width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2">
                                                <path
                                                    d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                            </svg></button>
                                    </template>
                                </div>
                            </td>

                            <td class="px-2 py-3 align-top">
                                <div v-if="filteredSub[idx - 1]" class="flex items-center gap-2 group/cell h-10">
                                    <template v-if="editingCell === `sg-${filteredSub[idx - 1].id}`">
                                        <input v-model="editValue" @blur="editingCell = null"
                                            @keyup.enter="saveCell('sg', filteredSub[idx - 1])" v-focus
                                            class="flex-1 min-w-0 h-full px-3 rounded-xl text-black border border-[#00896F] outline-none text-sm shadow-sm" />
                                        <button @mousedown.prevent="saveCell('sg', filteredSub[idx - 1])"
                                            class="bg-[#FFF085] px-3 h-full rounded-lg text-xs text-black font-medium">Save</button>
                                    </template>
                                    <template v-else>
                                        <div
                                            class="flex-1 flex items-center justify-between text-black bg-[#F3F4F6] px-3 py-2 rounded-xl h-full min-w-0">
                                            <span class="text-sm truncate">{{ filteredSub[idx - 1].name }}</span>
                                            <span v-if="filteredSub[idx - 1].is_default"
                                                title="Default value — managed by the system"
                                                class="text-[10px] uppercase tracking-wide text-gray-400 bg-gray-200/70 px-1.5 py-0.5 rounded shrink-0">default</span>
                                            <svg v-else @click="startEdit('sg', filteredSub[idx - 1])" width="14"
                                                height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                stroke-width="2"
                                                class="text-gray-300 hover:text-[#00896F] cursor-pointer shrink-0">
                                                <path
                                                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </div>
                                        <button v-if="!filteredSub[idx - 1].is_default"
                                            @click="prepareDelete('sg', filteredSub[idx - 1])"
                                            class="opacity-0 group-hover/cell:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded transition-all"><svg
                                                width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2">
                                                <path
                                                    d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                            </svg></button>
                                    </template>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="visibleRowCount === 0">
                            <td colspan="3" class="px-4 py-6 text-sm text-gray-400 text-center">
                                No matches for "{{ search }}"
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="w-full lg:w-2/5 space-y-8">
                <h3 class="text-lg font-bold text-gray-900">Add New Entries</h3>

                <div v-if="errorMsg && !pendingConfirm"
                    class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                    {{ errorMsg }}
                </div>

                <div v-if="pendingConfirm"
                    class="bg-[#FFF9E5] border border-[#FACC15] text-gray-800 text-sm rounded-xl px-4 py-3 space-y-3">
                    <p>A similar value already exists: <b>{{ pendingConfirm.similar }}</b>.
                        Add "<b>{{ pendingConfirm.value }}</b>" anyway?</p>
                    <div class="flex gap-2">
                        <button @click="confirmSimilar"
                            class="bg-[#FFF085] hover:bg-[#FACC15] text-gray-800 px-4 py-1.5 rounded-lg text-xs font-medium">Add
                            anyway</button>
                        <button @click="pendingConfirm = null"
                            class="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-1.5 rounded-lg text-xs font-medium">Cancel</button>
                    </div>
                </div>

                <div v-for="field in [{ l: 'Main Group', k: 'mg' }, { l: 'Subgroup', k: 'sg' }]" :key="field.k"
                    class="space-y-3">
                    <label class="text-sm font-semibold text-gray-800">{{ field.l }}</label>
                    <div class="flex gap-2 mt-1.5">
                        <input type="text" v-model="newValues[field.k]" :placeholder="`Enter ${field.l}`"
                            @input="clearFeedback"
                            class=" flex-1 bg-[#F3F4F6] border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00896F] text-black" />
                        <button @click="addItem(field.k)"
                            class="bg-[#FFF085] hover:bg-[#FACC15] text-gray-800 px-8  rounded-lg font-normal text-base whitespace-nowrap transition-all ">+
                            Add</button>
                    </div>
                </div>

                <p class="text-xs text-gray-400">FS Codes are fixed to BS and P&amp;L and cannot be changed.</p>
            </div>
        </div>

        <DataSourceSettingsDeleteModal :isOpen="isDeleteModalOpen" :isDark="isDark" :currentLang="currentLang"
            @close="isDeleteModalOpen = false" @confirm="confirmDelete" />
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const props = defineProps({ isDark: Boolean, currentLang: String })

const {
    getGLMasters,
    createMainGroup, createSubGroup,
    updateMainGroup, updateSubGroup,
    deleteMainGroup, deleteSubGroup,
} = useImplementation()

const fsCodeItems = ref([])
const mainGroupItems = ref([])
const subGroupItems = ref([])

onMounted(async () => {
    const data = await getGLMasters()
    fsCodeItems.value = data.fs_codes ?? []
    mainGroupItems.value = data.main_groups ?? []
    subGroupItems.value = data.sub_groups ?? []
})

// --- Search ---------------------------------------------------------------
const search = ref('')
const matches = (text) => (text ?? '').toLowerCase().includes(search.value.trim().toLowerCase())
const filteredFs = computed(() => fsCodeItems.value.filter(i => matches(i.code)))
const filteredMain = computed(() => mainGroupItems.value.filter(i => matches(i.name)))
const filteredSub = computed(() => subGroupItems.value.filter(i => matches(i.name)))
const visibleRowCount = computed(() =>
    Math.max(filteredFs.value.length, filteredMain.value.length, filteredSub.value.length))

// --- Error / similar-value feedback ----------------------------------------
const errorMsg = ref('')
// { action: 'add'|'edit', kind, value, similar, id }
const pendingConfirm = ref(null)

const clearFeedback = () => { errorMsg.value = ''; pendingConfirm.value = null }

const handleApiError = (e, context) => {
    const errors = e?.data?.errors
    const message = errors?.value?.[0] ?? e?.data?.message ?? 'Something went wrong. Please try again.'

    if (context && errors?.similar?.[0]) {
        pendingConfirm.value = { ...context, similar: errors.similar[0] }
        errorMsg.value = ''
    } else {
        errorMsg.value = message
        pendingConfirm.value = null
    }
}

// --- Edit (main/sub only; items identified by id so search can't misroute) --
const editingCell = ref(null) // `${kind}-${id}`
const editValue = ref('')
const vFocus = { mounted: (el) => el.focus() }

const startEdit = (kind, item) => {
    clearFeedback()
    editingCell.value = `${kind}-${item.id}`
    editValue.value = item.name
}

const saveCell = async (kind, item, confirm = false) => {
    editingCell.value = null
    const value = editValue.value.trim()
    if (!value || value === item.name) return

    try {
        if (kind === 'mg') await updateMainGroup(item.id, value, confirm)
        else await updateSubGroup(item.id, value, confirm)
        item.name = value
        clearFeedback()
    } catch (e) {
        handleApiError(e, { action: 'edit', kind, value, id: item.id })
    }
}

// --- Delete -----------------------------------------------------------------
const isDeleteModalOpen = ref(false)
const pendingDelete = reactive({ kind: '', id: null })

const prepareDelete = (kind, item) => {
    clearFeedback()
    pendingDelete.kind = kind
    pendingDelete.id = item.id
    isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
    const { kind, id } = pendingDelete
    const list = kind === 'mg' ? mainGroupItems : subGroupItems

    try {
        if (kind === 'mg') await deleteMainGroup(id)
        else await deleteSubGroup(id)
        list.value = list.value.filter(i => i.id !== id)
    } catch (e) {
        handleApiError(e, null)
    }
    isDeleteModalOpen.value = false
}

// --- Add ----------------------------------------------------------------------
const newValues = reactive({ mg: '', sg: '' })

const addItem = async (kind, confirm = false, value = null) => {
    value = (value ?? newValues[kind]).trim()
    if (!value) return

    try {
        const item = kind === 'mg'
            ? await createMainGroup(value, confirm)
            : await createSubGroup(value, confirm)
        const list = kind === 'mg' ? mainGroupItems : subGroupItems
        list.value.push(item)
        newValues[kind] = ''
        clearFeedback()
    } catch (e) {
        handleApiError(e, { action: 'add', kind, value })
    }
}

const confirmSimilar = async () => {
    const { action, kind, value, id } = pendingConfirm.value
    pendingConfirm.value = null

    if (action === 'add') {
        await addItem(kind, true, value)
    } else if (action === 'edit') {
        const list = kind === 'mg' ? mainGroupItems : subGroupItems
        const item = list.value.find(i => i.id === id)
        if (item) {
            editValue.value = value
            await saveCell(kind, item, true)
        }
    }
}
</script>

<style scoped>
table {
    table-layout: fixed;
}

.group-hover\/cell\:opacity-100 {
    transition: opacity 0.2s ease;
}
</style>
