<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto px-4 md:px-8 py-8 pb-20" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <!-- HEADER -->
    <div class="mb-8">
      <h1 class="transition-colors duration-300 text-[#013E32] text-[24px]" :class="isDark ? 'text-white' : 'text-[#013E32]'">
        {{ currentLang === 'ar' ? 'الأمن والخصوصية' : 'Security & Privacy' }}
      </h1>
      <p class="font-normal mt-1 transition-colors duration-300 text-[#00000080]" :class="isDark ? 'text-white/60' : 'text-black/50'">
        {{ currentLang === 'ar' ? 'إدارة إعدادات الأمان والخصوصية لحسابك' : 'Manage your account security and privacy settings' }}
      </p>
    </div>

    <div class="space-y-6">
      <!-- 1. CHANGE PASSWORD CARD -->
      <CommonSecurityChangePasswordCard :change-password="changePassword" />

      <!-- 2. TWO-FACTOR AUTHENTICATION CARD — disabled until 2FA is implemented -->
      <CommonSecurityTwoFactorCard v-if="false" />

      <!-- 3. ACTIVE SESSIONS CARD -->
      <CommonSecurityActiveSessionsCard
        :sessions="sessions"
        :sessions-loading="sessionsLoading"
        @revoke="signOutSession"
        @revoke-others="signOutAllOtherSessions"
      />

      <!-- 4. SESSION MANAGEMENT CARD -->
      <CommonSecuritySessionManagementCard v-model="sessionTimeout" :timeout-options="timeoutOptions" />

      <!-- 5. <<<ADD Roles based Card for user admin here>>> -->

      <!-- 6. DELETE ACCOUNT CARD -->
      <CommonSecurityDeleteAccountCard @delete-click="showDeleteModal = true" />

    </div>
    </div>

    <CommonDeleteAccountModal :open="showDeleteModal" @close="showDeleteModal = false" />
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

onMounted(() => {
  fetchSessions()
  fetchTimeout()
})

const changePassword = async (currentPassword, password, passwordConfirmation) => {
  try {
    await useApi('/users/change-password', {
      method: 'POST',
      body: {
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      },
    })
    return { ok: true }
  } catch (err) {
    return { ok: false, message: err?.data?.message }
  }
}

// Active Sessions + Session Management (backend /sessions)
const {
  sessions,
  loading: sessionsLoading,
  fetchSessions,
  revoke,
  revokeOthers,
  timeoutOptions,
  currentTimeout,
  fetchTimeout,
  saveTimeout,
} = useSessions()

const signOutSession = async (id) => {
  await revoke(id)
}

const signOutAllOtherSessions = async () => {
  await revokeOthers()
}

// Session Management Timeout (minutes; null = no idle limit yet chosen)
const sessionTimeout = computed({
  get: () => currentTimeout.value,
  set: (v) => {
    const minutes = v === null || v === '' ? null : Number(v)
    currentTimeout.value = minutes
    saveTimeout(minutes)
  },
})

// labels + relative times are language-dependent
watch(currentLang, () => {
  fetchTimeout()
  fetchSessions()
})

// Privacy Settings switches
const shareUsageData = ref(false)
const emailUpdates = ref(false)
const allowSupportAccess = ref(true)

const downloadData = () => {
  alert(currentLang.value === 'ar'
    ? 'بدأ تنزيل بياناتك. سيتم إرسال بريد إلكتروني عند انتهاء التصدير.'
    : 'Your data download has started. An email will be sent once the export is ready.'
  )
}

// Delete Account — full flow lives in CommonDeleteAccountModal
const showDeleteModal = ref(false)
</script>
