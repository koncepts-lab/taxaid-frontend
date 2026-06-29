<template>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm py-8 px-6 flex flex-col gap-12">
        <div class="flex items-center justify-between w-full lg:w-1/2">
            <div>
                <h3 class="text-base font-semibold text-gray-900">Existing List</h3>
                <p class="text-sm text-[#717182]">Edit fields and apply changes.</p>
            </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-12">
            <div class="overflow-hidden border border-gray-100 rounded-2xl lg:w-3/5">
                <table class="w-full text-left border-separate border-spacing-0 table-fixed">
                    <thead>
                        <tr class="text-gray-800 text-sm border-b border-gray-50 bg-gray-50/50">
                            <th class="px-4 py-4 w-1/4 font-medium">FS Code</th>
                            <th class="px-4 py-4 w-1/4 font-medium">Main Group</th>
                            <th class="px-4 py-4 w-2/4 font-medium">Subgroup</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="idx in Math.max(fsCodes.length, mainGroups.length, subGroups.length)" :key="idx">
                            <td class="px-2 py-3 border-r border-gray-50 align-top">
                                <div v-if="fsCodes[idx - 1] !== undefined"
                                    class="flex items-center gap-2 group/cell h-10">
                                    <template v-if="editingCell === `fs-${idx - 1}`">
                                        <input v-model="fsCodes[idx - 1]" @blur="editingCell = null"
                                            @keyup.enter="saveCell('fs', idx - 1)" v-focus
                                            class="flex-1 min-w-0 h-full px-3 rounded-xl text-black border border-[#00896F] outline-none text-sm shadow-sm" />
                                        <button @mousedown.prevent="saveCell('fs', idx - 1)"
                                            class="bg-[#FFF085] px-3 h-full rounded-lg text-xs text-black font-medium">Save</button>
                                    </template>
                                    <template v-else>
                                        <div
                                            class="flex-1 flex items-center justify-between bg-[#F3F4F6] text-black px-3 py-2 rounded-xl h-full min-w-0">
                                            <span class="text-sm truncate">{{ fsCodes[idx - 1] }}</span>
                                            <svg @click="editingCell = `fs-${idx - 1}`" width="14" height="14"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                class="text-gray-300 hover:text-[#00896F] cursor-pointer shrink-0">
                                                <path
                                                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </div>
                                        <button @click="prepareDelete('fs', idx - 1)"
                                            class="opacity-0 group-hover/cell:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded transition-all"><svg
                                                width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2">
                                                <path
                                                    d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                            </svg></button>
                                    </template>
                                </div>
                            </td>

                            <td class="px-2 py-3 border-r border-gray-50 align-top">
                                <div v-if="mainGroups[idx - 1] !== undefined"
                                    class="flex items-center gap-2 group/cell h-10">
                                    <template v-if="editingCell === `mg-${idx - 1}`">
                                        <input v-model="mainGroups[idx - 1]" @blur="editingCell = null"
                                            @keyup.enter="saveCell('mg', idx - 1)" v-focus
                                            class="flex-1 min-w-0 h-full px-3 text-black rounded-xl border border-[#00896F] outline-none text-sm shadow-sm" />
                                        <button @mousedown.prevent="saveCell('mg', idx - 1)"
                                            class="bg-[#FFF085] px-3 h-full rounded-lg text-xs text-black font-medium">Save</button>
                                    </template>
                                    <template v-else>
                                        <div
                                            class="flex-1 flex items-center justify-between text-black bg-[#F3F4F6] px-3 py-2 rounded-xl h-full min-w-0">
                                            <span class="text-sm truncate">{{ mainGroups[idx - 1] }}</span>
                                            <svg @click="editingCell = `mg-${idx - 1}`" width="14" height="14"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                class="text-gray-300 hover:text-[#00896F] cursor-pointer shrink-0">
                                                <path
                                                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </div>
                                        <button @click="prepareDelete('mg', idx - 1)"
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
                                <div v-if="subGroups[idx - 1] !== undefined"
                                    class="flex items-center gap-2 group/cell h-10">
                                    <template v-if="editingCell === `sg-${idx - 1}`">
                                        <input v-model="subGroups[idx - 1]" @blur="editingCell = null"
                                            @keyup.enter="saveCell('sg', idx - 1)" v-focus
                                            class="flex-1 min-w-0 h-full px-3 rounded-xl text-black border border-[#00896F] outline-none text-sm shadow-sm" />
                                        <button @mousedown.prevent="saveCell('sg', idx - 1)"
                                            class="bg-[#FFF085] px-3 h-full rounded-lg text-xs text-black font-medium">Save</button>
                                    </template>
                                    <template v-else>
                                        <div
                                            class="flex-1 flex items-center justify-between text-black bg-[#F3F4F6] px-3 py-2 rounded-xl h-full min-w-0">
                                            <span class="text-sm truncate">{{ subGroups[idx - 1] }}</span>
                                            <svg @click="editingCell = `sg-${idx - 1}`" width="14" height="14"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                class="text-gray-300 hover:text-[#00896F] cursor-pointer shrink-0">
                                                <path
                                                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </div>
                                        <button @click="prepareDelete('sg', idx - 1)"
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
                    </tbody>
                </table>
            </div>

            <div class="w-full lg:w-2/5 space-y-8">
                <h3 class="text-lg font-bold text-gray-900">Add New Entries</h3>
                <div v-for="field in [{ l: 'FS Code', k: 'fs' }, { l: 'Main Group', k: 'mg' }, { l: 'Subgroup', k: 'sg' }]"
                    :key="field.k" class="space-y-3">
                    <label class="text-sm font-semibold text-gray-800">{{ field.l }}</label>
                    <div class="flex gap-2 mt-1.5">
                        <input type="text" v-model="newValues[field.k]" :placeholder="`Enter ${field.l}`"
                            class=" flex-1 bg-[#F3F4F6] border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#00896F] text-black" />
                        <button @click="addItem(field.k)"
                            class="bg-[#FFF085] hover:bg-[#FACC15] text-gray-800 px-8  rounded-lg font-normal text-base whitespace-nowrap transition-all ">+
                            Add</button>
                    </div>
                </div>
            </div>
        </div>

        <DataSourceSettingsDeleteModal :isOpen="isDeleteModalOpen" :isDark="isDark" :currentLang="currentLang"
            @close="isDeleteModalOpen = false" @confirm="confirmDelete" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const props = defineProps({ isDark: Boolean, currentLang: String })

const {
    getGLMasters,
    createFsCode, createMainGroup, createSubGroup,
    updateFsCode, updateMainGroup, updateSubGroup,
    deleteFsCode, deleteMainGroup, deleteSubGroup,
} = useImplementation()

// --- MOCK DATA (commented out — replaced by API) ---
// const fsCodes = ref(['1000', '1100', '1200', '1300', '1400'])
// const mainGroups = ref(['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'])
// const subGroups = ref(['Current Assets', 'Fixed Assets', 'Long Term Liab', 'Operating Exp', 'Sales'])

// Item arrays store objects {id, value} internally; template still binds to string arrays via index
const fsCodeItems   = ref([])
const mainGroupItems = ref([])
const subGroupItems  = ref([])

// String arrays for template v-model compatibility
const fsCodes    = ref([])
const mainGroups = ref([])
const subGroups  = ref([])

onMounted(async () => {
    const data = await getGLMasters()
    fsCodeItems.value    = data.fs_codes   ?? []
    mainGroupItems.value = data.main_groups ?? []
    subGroupItems.value  = data.sub_groups  ?? []
    fsCodes.value    = fsCodeItems.value.map(i => i.code)
    mainGroups.value = mainGroupItems.value.map(i => i.name)
    subGroups.value  = subGroupItems.value.map(i => i.name)
})

const editingCell = ref(null)
const vFocus = { mounted: (el) => el.focus() }

const saveCell = async (type, index) => {
    editingCell.value = null
    if (type === 'fs' && fsCodeItems.value[index]) {
        await updateFsCode(fsCodeItems.value[index].id, fsCodes.value[index])
        fsCodeItems.value[index].code = fsCodes.value[index]
    }
    if (type === 'mg' && mainGroupItems.value[index]) {
        await updateMainGroup(mainGroupItems.value[index].id, mainGroups.value[index])
        mainGroupItems.value[index].name = mainGroups.value[index]
    }
    if (type === 'sg' && subGroupItems.value[index]) {
        await updateSubGroup(subGroupItems.value[index].id, subGroups.value[index])
        subGroupItems.value[index].name = subGroups.value[index]
    }
}

const isDeleteModalOpen = ref(false)
const pendingDelete = reactive({ type: '', index: null })

const prepareDelete = (type, index) => {
    pendingDelete.type = type
    pendingDelete.index = index
    isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
    const { type, index } = pendingDelete
    if (type === 'fs' && fsCodeItems.value[index]) {
        await deleteFsCode(fsCodeItems.value[index].id)
        fsCodes.value.splice(index, 1)
        fsCodeItems.value.splice(index, 1)
    }
    if (type === 'mg' && mainGroupItems.value[index]) {
        await deleteMainGroup(mainGroupItems.value[index].id)
        mainGroups.value.splice(index, 1)
        mainGroupItems.value.splice(index, 1)
    }
    if (type === 'sg' && subGroupItems.value[index]) {
        await deleteSubGroup(subGroupItems.value[index].id)
        subGroups.value.splice(index, 1)
        subGroupItems.value.splice(index, 1)
    }
    isDeleteModalOpen.value = false
}

const newValues = reactive({ fs: '', mg: '', sg: '' })
const addItem = async (key) => {
    if (!newValues[key]) return
    if (key === 'fs') {
        const item = await createFsCode(newValues[key])
        fsCodeItems.value.push(item)
        fsCodes.value.push(item.code)
    }
    if (key === 'mg') {
        const item = await createMainGroup(newValues[key])
        mainGroupItems.value.push(item)
        mainGroups.value.push(item.name)
    }
    if (key === 'sg') {
        const item = await createSubGroup(newValues[key])
        subGroupItems.value.push(item)
        subGroups.value.push(item.name)
    }
    newValues[key] = ''
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