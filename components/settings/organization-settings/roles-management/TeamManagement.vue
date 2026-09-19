<template>
  <div class="space-y-6">
    <div class="rounded-2xl border p-6 transition-all duration-300"
      :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-teal-50 text-[#013E32] shadow-[0_4px_20px_rgba(0,183,148,0.05)]'">

      <div class="flex items-start justify-between gap-4 mb-6">
        <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
          :class="isDark ? 'bg-teal-950 text-[#00B68D]' : 'bg-[#E6FFF9] text-[#013E32]'">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <div>
          <h2 class="text-[24px] font-regular mb-2" :class="isDark ? 'text-white' : 'text-[#013E32]'">
            {{ currentLang === 'ar' ? 'إدارة الفريق' : 'Team Management' }}
          </h2>
          <p class="text-[14px]" :class="muted">
            {{ currentLang === 'ar' ? 'أضف مستخدمي شركتك وأدر أدوارهم وحالاتهم' : 'Add your company users and manage their roles and access' }}
          </p>
        </div>
        </div>
        <button @click="openAdd" :disabled="loading"
          class="px-5 py-2.5 rounded-xl bg-[#00896F] hover:bg-[#00705a] text-white text-sm font-medium whitespace-nowrap transition-all active:scale-95 disabled:opacity-60">
          + {{ currentLang === 'ar' ? 'إضافة مستخدم' : 'Add user' }}
        </button>
      </div>

      <p v-if="pageError" class="mb-4 text-sm text-red-500">{{ pageError }}</p>
      <p v-if="notice" class="mb-4 text-sm text-[#00896F]">{{ notice }}</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <template v-if="loading || !limits">
          <div v-for="n in 3" :key="n" class="rounded-[10px] border p-4 h-[96px]" :class="statBorder">
            <div class="skeleton h-3 w-24 rounded mb-4" :class="{ dark: isDark }"></div>
            <div class="skeleton h-7 w-16 rounded" :class="{ dark: isDark }"></div>
          </div>
        </template>
        <template v-else>
          <div v-for="card in statCards" :key="card.title" class="rounded-[10px] border p-4 h-[96px]" :class="statBorder">
            <div class="text-[13px] mb-2 flex items-center justify-between font-medium" :class="muted">
              <span>{{ card.title }}</span>
              <span :class="card.iconBg" class="w-7 h-7 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="card.iconColor" v-html="card.icon"></svg>
              </span>
            </div>
            <div class="text-2xl font-semibold">
              {{ card.used }}<span v-if="card.max !== null" class="text-base font-medium" :class="muted"> / {{ card.max }}</span>
            </div>
          </div>
        </template>
      </div>

      <div class="rounded-xl border overflow-x-auto" :class="isDark ? 'border-white/10' : 'border-gray-100'">
        <div class="min-w-[720px]" :style="{ minHeight: `${48 + 5 * 60}px` }">
          <div class="grid grid-cols-[1.2fr_1.6fr_1fr_0.8fr_90px] h-[48px] items-center text-sm font-medium bg-[#008865] text-white">
            <div class="px-6">{{ currentLang === 'ar' ? 'الاسم' : 'Name' }}</div>
            <div class="px-4">{{ currentLang === 'ar' ? 'البريد' : 'Email' }}</div>
            <div class="px-4">{{ currentLang === 'ar' ? 'الدور' : 'Role' }}</div>
            <div class="px-4">{{ currentLang === 'ar' ? 'الحالة' : 'Status' }}</div>
            <div class="px-4 text-center">{{ currentLang === 'ar' ? 'إجراءات' : 'Actions' }}</div>
          </div>

          <template v-if="loading">
            <div v-for="n in 5" :key="n" class="grid grid-cols-[1.2fr_1.6fr_1fr_0.8fr_90px] h-[60px] items-center border-b" :class="rowBorder">
              <div class="px-6"><div class="skeleton h-4 w-28 rounded" :class="{ dark: isDark }"></div></div>
              <div class="px-4"><div class="skeleton h-4 w-44 rounded" :class="{ dark: isDark }"></div></div>
              <div class="px-4"><div class="skeleton h-6 w-20 rounded-full" :class="{ dark: isDark }"></div></div>
              <div class="px-4"><div class="skeleton h-6 w-16 rounded-full" :class="{ dark: isDark }"></div></div>
              <div class="px-4 flex justify-center"><div class="skeleton h-8 w-14 rounded-lg" :class="{ dark: isDark }"></div></div>
            </div>
          </template>

          <template v-else>
            <div v-for="member in pagedMembers" :key="member.id" class="grid grid-cols-[1.2fr_1.6fr_1fr_0.8fr_90px] h-[60px] items-center border-b text-sm" :class="[rowBorder, isOwner(member) ? (isDark ? 'bg-emerald-500/10' : 'bg-[#ECFDF5]/60') : '']">
              <div class="px-6 font-medium truncate" :class="isDark ? 'text-white' : 'text-[#013E32]'">{{ member.first_name }} {{ member.last_name }}</div>
              <div class="px-4 truncate" :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ member.email }}</div>
              <div class="px-4"><span :class="roleBadgeClass(member)" class="rounded-full px-2.5 py-1 text-[12px] font-medium">{{ userRoleLabel(member, currentLang) }}</span></div>
              <div class="px-4">
                <span class="px-2.5 py-1 text-[12px] rounded-full font-medium"
                  :class="member.status === 'live' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-amber-100 text-amber-700'">
                  {{ member.status === 'live' ? (currentLang === 'ar' ? 'نشط' : 'Active') : (currentLang === 'ar' ? 'معلّق' : 'Suspended') }}
                </span>
              </div>
              <div class="px-4 flex justify-center">
                <button v-if="!member.is_primary || member.is_self" @click="openEdit(member)" class="px-3 py-1 text-[12px] rounded-lg border border-[#008169]/40 text-[#00896F] hover:bg-[#00B794]/10">
                  {{ currentLang === 'ar' ? 'تعديل' : 'Edit' }}
                </button>
              </div>
            </div>
            <div v-if="!members.length" class="py-10 text-center text-sm" :class="muted">{{ currentLang === 'ar' ? 'لا يوجد مستخدمون.' : 'No users yet.' }}</div>
          </template>
        </div>
      </div>

      <div v-if="members.length > PER_PAGE" class="mt-4">
        <CommonPaginationBar :meta="memberMeta" :loading="loading" @page-change="(p) => memberPage = p" @per-page-change="() => {}" />
      </div>
    </div>

    <SettingsOrganizationSettingsRolesManagementPermissionsTable ref="permTable" />

    <CommonTeamUserModal v-if="modal.open"
      :mode="modal.id ? 'edit' : 'add'"
      :user="editingMember"
      :roles="roles"
      :fields="modalFields"
      :actions="modalActions"
      :lang="currentLang"
      :dark="isDark"
      :saving="modal.saving"
      :error="modal.error"
      @close="modal.open = false"
      @submit="submit"
      @reset-password="onModalReset"
      @toggle-status="onModalStatus"
      @remove="onModalRemove" />

    <Teleport to="body">
      <div v-if="confirmRemove" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40" @click.self="confirmRemove = null">
        <div class="w-full max-w-md rounded-2xl p-6 space-y-4" :class="isDark ? 'bg-[#002E26] text-white' : 'bg-white text-[#013E32]'">
          <h3 class="text-[20px]">{{ currentLang === 'ar' ? 'حذف المستخدم' : 'Remove user' }}</h3>
          <p class="text-sm">{{ confirmRemove.first_name }} {{ confirmRemove.last_name }} ({{ confirmRemove.email }})</p>
          <div class="flex gap-3 justify-end">
            <button @click="confirmRemove = null" class="px-5 py-2 rounded-xl border text-sm" :class="isDark ? 'border-white/20' : 'border-gray-200'">
              {{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}
            </button>
            <button @click="removeConfirmed" class="px-5 py-2 rounded-xl bg-[#FF6B50] text-white text-sm">
              {{ currentLang === 'ar' ? 'حذف' : 'Remove' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { roleLabel: roleLabelFor, userRoleLabel, roleBadgeClass, isOwner } = useRoleLabel()
const team = useTeamManagement()

const members = ref([])
const limits = ref(null)
const roles = ref([])
const PER_PAGE = 10
const memberPage = ref(1)
const loading = ref(true)
const pageError = ref('')
const notice = ref('')
const confirmRemove = ref(null)

const modal = reactive({ open: false, id: null, saving: false, error: '' })
const editingMember = ref(null)
const editingPrimaryOther = computed(() => !!editingMember.value?.is_primary && !editingMember.value.is_self)
const editingSelf = computed(() => !!editingMember.value?.is_self)

const muted = computed(() => (isDark.value ? 'text-white/60' : 'text-[#000000CC]'))
const statBorder = computed(() => (isDark.value ? 'border-white/10 bg-white/5' : 'border-[#D1FAE5] bg-white shadow-sm'))
const permTable = ref(null)
const memberMeta = computed(() => ({ current_page: memberPage.value, last_page: Math.max(Math.ceil(members.value.length / PER_PAGE), 1), total: members.value.length, per_page: PER_PAGE }))
const pagedMembers = computed(() => members.value.slice((memberPage.value - 1) * PER_PAGE, memberPage.value * PER_PAGE))
const statCards = computed(() => [
  { title: currentLang.value === 'ar' ? 'إجمالي المستخدمين' : 'Total users', used: limits.value.total.used, max: limits.value.total.max ?? null, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>' },
  { title: currentLang.value === 'ar' ? 'المستخدمون النشطون' : 'Active users', used: members.value.filter((m) => m.status === 'live').length, max: null, iconBg: 'bg-green-50', iconColor: 'text-green-600', icon: '<polyline points="20 6 9 17 4 12"></polyline>' },
  { title: currentLang.value === 'ar' ? 'الأدوار المستخدمة' : 'Roles in use', used: new Set(members.value.map((m) => m.role)).size, max: null, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>' },
])
const rowBorder = computed(() => (isDark.value ? 'border-white/10' : 'border-gray-100'))
const locked = computed(() => editingPrimaryOther.value || editingSelf.value)
const modalFields = computed(() => ({
  identity: true,
  email: !modal.id || !locked.value,
  role: !modal.id || !locked.value,
  password: !modal.id,
  primary: false,
  meta: true,
}))
const modalActions = computed(() => (modal.id && !editingMember.value?.is_primary && !editingMember.value?.is_self ? ['reset', 'status', 'remove'] : []))

const roleLabel = (role) => roleLabelFor(role, currentLang.value)

const load = async (silent = false) => {
  if (!silent) loading.value = true
  pageError.value = ''
  try {
    const res = await team.getTeam()
    members.value = res.data ?? []
    limits.value = res.limits ?? null
    roles.value = res.roles ?? []
    if (memberPage.value > memberMeta.value.last_page) memberPage.value = memberMeta.value.last_page
    permTable.value?.reload()
  } catch (e) {
    pageError.value = team.errorMessage(e)
  } finally {
    loading.value = false
  }
}

const openAdd = () => {
  editingMember.value = null
  Object.assign(modal, { open: true, id: null, saving: false, error: '' })
}

const openEdit = (member) => {
  editingMember.value = member
  Object.assign(modal, { open: true, id: member.id, saving: false, error: '' })
}

const submit = async (form) => {
  modal.saving = true
  modal.error = ''
  try {
    if (modal.id) {
      const payload = { first_name: form.first_name, last_name: form.last_name, contact_number: form.contact_number, department: form.department || null, title: form.title || null, position: form.position || null, description: form.description || null }
      if (!editingPrimaryOther.value) {
        if (!editingSelf.value) {
          payload.email = form.email
          payload.role = form.role
        }
      }
      await team.updateMember(modal.id, payload)
    } else {
      const payload = { ...form }
      delete payload.is_primary
      if (!payload.password) delete payload.password
      ;['department', 'title', 'position', 'description'].forEach((k) => { if (!payload[k]) delete payload[k] })
      const res = await team.createMember(payload)
      notice.value = res?.email_sent
        ? (currentLang.value === 'ar' ? 'تم إنشاء المستخدم وإرسال بيانات الدخول بالبريد.' : 'User created and login details emailed.')
        : (currentLang.value === 'ar' ? 'تم إنشاء المستخدم لكن تعذر إرسال البريد.' : 'User created, but the email could not be sent.')
    }
    modal.open = false
    await load()
  } catch (e) {
    modal.error = team.errorMessage(e)
  } finally {
    modal.saving = false
  }
}

const run = async (action, successMessage) => {
  pageError.value = ''
  notice.value = ''
  try {
    await action()
    if (successMessage) notice.value = successMessage
    await load()
  } catch (e) {
    pageError.value = team.errorMessage(e)
  }
}

const resetMemberPassword = (member) => run(() => team.resetPassword(member.id), currentLang.value === 'ar' ? 'تم إرسال كلمة مرور جديدة بالبريد.' : 'A new password was emailed to the user.')
const toggleStatus = (member) => run(() => team.setStatus(member.id, member.status === 'live' ? 'suspended' : 'live'))
const onModalReset = async () => {
  const member = editingMember.value
  modal.open = false
  await resetMemberPassword(member)
}
const onModalStatus = async () => {
  const member = editingMember.value
  modal.open = false
  await toggleStatus(member)
}
const onModalRemove = () => {
  confirmRemove.value = editingMember.value
  modal.open = false
}
const removeConfirmed = async () => {
  const member = confirmRemove.value
  confirmRemove.value = null
  await run(() => team.removeMember(member.id))
}

const onVisible = () => {
  if (document.visibilityState === 'visible') load(true)
}

onMounted(() => {
  load()
  document.addEventListener('visibilitychange', onVisible)
})
onBeforeUnmount(() => document.removeEventListener('visibilitychange', onVisible))
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: team-shimmer 1.4s ease infinite;
}
.skeleton.dark {
  background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.14) 37%, rgba(255,255,255,0.06) 63%);
  background-size: 400% 100%;
}
@keyframes team-shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
</style>
