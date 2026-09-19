<template>
    <div :dir="currentLang === 'ar' ? 'rtl' : 'ltr'"
        class="p-6 space-y-6 rounded-2xl transition-all duration-300"
        :class="isDark ? 'bg-[#015F4D]/20 border border-[#00B794]/30 text-white' : 'bg-white text-black'">

        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div :class="currentLang === 'ar' ? 'text-right' : 'text-left'">
                <h2 class="text-lg font-normal mb-2">{{ currentLang === 'ar' ? 'دليل البريد الداخلي' : 'Internal Email Directory' }}</h2>
                <p class="text-base" :class="isDark ? 'text-white/60' : 'text-[#717182]'">
                    {{ currentLang === 'ar' ? 'مستخدمو المؤسسة وجهات الاتصال الداخلية الأخرى' : 'Your organization users and other internal contacts' }}
                </p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 lg:items-center">
                <input v-model="search" type="text" :placeholder="currentLang === 'ar' ? 'بحث...' : 'Search name or email…'"
                    class="w-full sm:w-72 py-2 px-4 border rounded-xl text-sm outline-none shadow-sm transition-all"
                    :class="isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#00B794]' : 'bg-[#F3FDFA] border-[#04C18F80] text-black placeholder:text-[#717182] focus:border-[#00896F]'" />
                <button @click="editingEntry = null; isAddOpen = true" class="px-5 py-2 bg-[#008169] text-white rounded-xl text-sm font-medium hover:bg-[#006b56] transition-all shrink-0">
                    {{ currentLang === 'ar' ? '+ إضافة إدخال جديد' : '+ Add New Entry' }}
                </button>
            </div>
        </div>

        <DataSourceAddEntryModal v-model:open="isAddOpen" type="internal-email" :currentLang="currentLang" :entry="editingEntry" @saved="load(meta.current_page)" />

        <CommonTeamUserModal v-if="userModal" mode="edit" :user="userModal" :roles="roleKeys" :fields="userFields" :lang="currentLang" :dark="isDark"
            :saving="userSaving" :error="userError" @close="userModal = null" @submit="saveUser" />

        <p v-if="notice" class="px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{{ notice }}</p>

        <div class="rounded-2xl border shadow-sm overflow-x-auto" :class="isDark ? 'border-white/10' : 'border-gray-100 bg-white'">
            <div class="min-w-[860px] flex flex-col" :style="{ height: `${52 + ROWS * 60}px` }">
                <div class="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)_100px_100px] bg-[#00896F] text-white text-[13px] font-medium h-[52px] items-center shrink-0">
                    <div class="px-6">{{ currentLang === 'ar' ? 'الموظف' : 'Employee' }}</div>
                    <div class="px-4">{{ currentLang === 'ar' ? 'القسم' : 'Department' }}</div>
                    <div class="px-4">{{ currentLang === 'ar' ? 'البريد' : 'Email' }}</div>
                    <div class="px-4">{{ currentLang === 'ar' ? 'رقم الهاتف' : 'Phone Number' }}</div>
                    <div class="px-4">{{ currentLang === 'ar' ? 'المصدر' : 'Source' }}</div>
                    <div class="px-4 text-center">{{ currentLang === 'ar' ? 'إجراء' : 'Action' }}</div>
                </div>

                <template v-if="loading">
                    <div v-for="n in ROWS" :key="n" class="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)_100px_100px] h-[60px] items-center shrink-0 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
                        <div class="px-6"><div class="skeleton h-4 w-32 rounded"></div></div>
                        <div class="px-4"><div class="skeleton h-6 w-24 rounded-full"></div></div>
                        <div class="px-4"><div class="skeleton h-4 w-44 rounded"></div></div>
                        <div class="px-4"><div class="skeleton h-4 w-24 rounded"></div></div>
                        <div class="px-4"><div class="skeleton h-5 w-14 rounded-full"></div></div>
                        <div class="px-4 flex justify-center"><div class="skeleton h-7 w-14 rounded-md"></div></div>
                    </div>
                </template>

                <template v-else-if="rows.length">
                    <div v-for="row in rows" :key="row.key" class="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)_100px_100px] h-[60px] items-center shrink-0 border-b text-sm"
                        :class="isDark ? 'border-white/5' : 'border-gray-100'">
                        <div class="px-6 truncate font-medium">{{ row.employee_name }}</div>
                        <div class="px-4"><span v-if="row.department" class="rounded-full px-2.5 py-1 text-[12px] font-medium" :class="isDark ? 'bg-teal-900/50 text-teal-200' : 'bg-[#E4FFF6] text-[#00896F]'">{{ label(row) }}</span><span v-else :class="isDark ? 'text-white/40' : 'text-gray-400'">—</span></div>
                        <div class="px-4 truncate">{{ row.email }}</div>
                        <div class="px-4 truncate" :class="isDark ? 'text-white/70' : 'text-gray-600'">{{ row.phone_number || '—' }}</div>
                        <div class="px-4">
                            <span class="rounded-full px-2 py-0.5 text-[11px] font-medium" :class="row.source === 'user' ? (isDark ? 'bg-teal-900/50 text-teal-200' : 'bg-[#E4FFF6] text-[#00896F]') : (isDark ? 'bg-white/10 text-white/70' : 'bg-gray-100 text-gray-600')">
                                {{ row.source === 'user' ? (currentLang === 'ar' ? 'مستخدم' : 'User') : (currentLang === 'ar' ? 'إدخال' : 'Entry') }}
                            </span>
                        </div>
                        <div class="px-4 flex justify-start gap-2">
                            <button v-if="canEdit(row)" @click="openEdit(row)" :title="currentLang === 'ar' ? 'تعديل' : 'Edit'"
                                class="inline-flex items-center justify-center w-8 h-8 border border-[#008169]/40 text-[#00896F] rounded-md hover:bg-[#00B794]/10">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            </button>
                            <button v-if="row.source === 'entry'" @click="remove(row)" :disabled="deletingKey === row.key" :title="currentLang === 'ar' ? 'حذف' : 'Delete'"
                                class="inline-flex items-center justify-center w-8 h-8 border border-red-200 text-red-500 rounded-md hover:bg-red-50 disabled:opacity-50">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                            </button>
                        </div>
                    </div>
                </template>

                <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center gap-2 text-sm text-red-500">
                    {{ error }}
                    <button @click="load(meta.current_page)" class="px-4 py-1.5 border border-[#00896F] text-[#00896F] rounded-lg">Retry</button>
                </div>
                <div v-else class="flex-1 flex items-center justify-center text-sm" :class="isDark ? 'text-white/50' : 'text-gray-400'">
                    {{ currentLang === 'ar' ? 'لا توجد نتائج' : 'No entries found.' }}
                </div>
            </div>
        </div>

        <div class="min-h-[64px]">
            <CommonPaginationBar v-if="meta.total > 10" :meta="meta" :loading="loading"
                @page-change="(p) => load(p)" @per-page-change="(pp) => { perPage = pp; load(1) }" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useInternalEmails } from '~/composables/data-source/useInternalEmails'

defineProps({
    isDark: Boolean,
    currentLang: { type: String, default: 'en' },
})

const ROWS = 10
const { emails, meta, loading, error, fetchEmails, deleteEmail } = useInternalEmails()
const lang = useState('currentLang')

const rows = emails
const { can } = usePermissions()
const team = useTeamManagement()
const roleKeys = ['master_user', 'account_user', 'sales_user', 'procurement_user', 'project_manager_user', 'partner_user', 'guest_user']
const userFields = { identity: true, email: false, role: true, password: false, primary: false, meta: true }
const editingEntry = ref(null)
const userModal = ref(null)
const userSaving = ref(false)
const userError = ref('')

const canEdit = (row) => row.source === 'entry' || (can('team.manage') && !row.is_primary)

const openEdit = async (row) => {
    notice.value = ''
    if (row.source === 'entry') {
        editingEntry.value = row
        isAddOpen.value = true
        return
    }
    try {
        const res = await team.getTeam()
        const member = (res.data ?? []).find((m) => m.id === row.id)
        if (!member) throw new Error('User not found')
        userError.value = ''
        userModal.value = member
    } catch (e) {
        notice.value = e?.data?.message ?? 'Could not load this user.'
    }
}

const saveUser = async (form) => {
    userSaving.value = true
    userError.value = ''
    try {
        await team.updateMember(userModal.value.id, {
            first_name: form.first_name, last_name: form.last_name, contact_number: form.contact_number,
            role: form.role, department: form.department || null, title: form.title || null,
            position: form.position || null, description: form.description || null,
        })
        userModal.value = null
        await load(meta.value.current_page)
    } catch (e) {
        userError.value = team.errorMessage(e)
    } finally {
        userSaving.value = false
    }
}
const search = ref('')
const perPage = ref(ROWS)
const isAddOpen = ref(false)
const notice = ref('')
const deletingKey = ref(null)

const label = (row) => departmentLabel(row.department, lang.value)

const load = (page = 1) => fetchEmails({ page, per_page: perPage.value, search: search.value.trim() })

const remove = async (row) => {
    deletingKey.value = row.key
    notice.value = ''
    try {
        await deleteEmail(row.id)
        await load(meta.value.current_page)
    } catch (e) {
        notice.value = e?.data?.message ?? 'Failed to delete entry.'
    } finally {
        deletingKey.value = null
    }
}

let timer
watch(search, () => { clearTimeout(timer); timer = setTimeout(() => load(1), 300) })
onMounted(() => load(1))
onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
.skeleton {
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
    background-size: 400% 100%;
    animation: idir-shimmer 1.4s ease infinite;
}
@keyframes idir-shimmer {
    0% { background-position: 100% 50%; }
    100% { background-position: 0 50%; }
}
</style>
