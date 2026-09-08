<template>
  <div class="rounded-2xl border p-6 transition-all duration-300"
    :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-teal-50 shadow-[0_4px_20px_rgba(0,183,148,0.05)]'">

    <div class="flex items-start justify-between gap-4 mb-6">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
          :class="isDark ? 'bg-teal-950 text-[#00B68D]' : 'bg-[#E6FFF9] text-[#013E32]'">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <div>
          <h2 class="text-[24px] font-regular mb-2" :class="isDark ? 'text-white' : 'text-[#013E32]'">
            {{ currentLang === 'ar' ? 'إعدادات بريد الشركة' : 'Company Mail Settings' }}
          </h2>
          <p class="text-[14px] mb-2" :class="isDark ? 'text-white/60' : 'text-[#000000CC]'">
            {{ currentLang === 'ar'
              ? 'تُرسل تذكيرات الدفع والبريد الداخلي عبر خادم بريد شركتك (Google أو Microsoft أو أي SMTP)'
              : 'Payment reminders and internal mails are sent through YOUR company mail server (Google, Microsoft, or any SMTP)' }}
          </p>
        </div>
      </div>
      <!-- Verified badge (skeleton while loading so the row height never shifts) -->
      <span v-if="mailLoading"
        class="px-3 py-1 text-[11px] rounded-full shrink-0 w-20 h-6 animate-pulse"
        :class="isDark ? 'bg-teal-950/60' : 'bg-gray-100'"></span>
      <span v-else-if="mailSettings?.verified_at"
        class="px-3 py-1 text-[11px] font-semibold rounded-full shrink-0"
        :class="isDark ? 'bg-emerald-950 text-emerald-300' : 'bg-[#E6FFF9] text-[#00896F] border border-[#A2E8D6]'">
        {{ currentLang === 'ar' ? 'تم التحقق ✓' : 'Verified ✓' }}
      </span>
      <span v-else-if="mailSettings"
        class="px-3 py-1 text-[11px] font-semibold rounded-full shrink-0 bg-amber-50 text-amber-700 border border-amber-200">
        {{ currentLang === 'ar' ? 'غير مُتحقق' : 'Not verified' }}
      </span>
    </div>

    <div class="space-y-5 max-w-xl">
      <!-- Action buttons: Mailer Settings (modal) + Send Test Mail (modal) -->
      <div class="flex flex-wrap gap-3">
        <button type="button" @click="openMailerModal"
          class="transition-all transform active:scale-95 flex items-center gap-2 font-normal text-white px-5"
          :style="{ backgroundColor: '#009276', fontSize: '14px', height: '42px', borderRadius: '8px' }">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ mailSettings ? (currentLang === 'ar' ? 'إعدادات المرسل' : 'Mailer Settings') : (currentLang === 'ar' ? 'إعداد المرسل' : 'Set up Mailer') }}
        </button>
        <button type="button" @click="openTestModal" :disabled="!mailSettings"
          class="transition-all transform active:scale-95 flex items-center gap-2 font-normal border px-5 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="isDark ? 'border-teal-800 text-white' : 'text-[#013E32]'"
          :style="{ fontSize: '14px', height: '42px', borderRadius: '8px', borderColor: !isDark ? '#A2E8D6' : undefined }">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          {{ currentLang === 'ar' ? 'إرسال بريد تجريبي' : 'Send Test Mail' }}
        </button>
      </div>

      <!-- Status banner -->
      <Transition name="fade">
        <div v-if="mailStatus.message" class="p-3.5 rounded-xl text-sm border font-medium flex items-center gap-2"
          :class="mailStatus.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
            : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50 text-red-800 dark:text-red-300'">
          <span>{{ mailStatus.message }}</span>
        </div>
      </Transition>

      <!-- Internal mail recipients (departments from the Internal Email Directory) -->
      <div class="flex flex-col gap-1.5 pt-2 border-t" :class="isDark ? 'border-teal-950/60' : 'border-[#EAF7F3]'">
        <label class="block text-[14px] mb-1" :class="isDark ? 'text-white/80' : 'text-[#013E32]/80'">
          {{ currentLang === 'ar' ? 'إرسال البريد الداخلي إلى الأقسام' : 'Send internal mails to departments' }}
        </label>
        <p class="text-[12px] mb-2" :class="isDark ? 'text-white/50' : 'text-black/40'">
          {{ currentLang === 'ar'
            ? 'بدون تحديد = يُرسل إلى جميع عناوين البريد الداخلي'
            : 'Nothing ticked = sent to ALL internal email directory entries' }}
        </p>
        <div v-if="mailLoading" class="flex flex-wrap gap-3">
          <span v-for="i in 3" :key="i" class="h-[38px] w-24 rounded-lg animate-pulse"
            :class="isDark ? 'bg-teal-950/60' : 'bg-gray-100'"></span>
        </div>
        <div v-else-if="availableDepartments.length" class="flex flex-wrap gap-3">
          <label v-for="d in availableDepartments" :key="d"
            class="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-all"
            :class="mailForm.internal_departments.includes(d)
              ? (isDark ? 'border-[#00B68D] bg-teal-950/60 text-white' : 'border-[#00896F] bg-[#E6FFF9] text-[#013E32]')
              : (isDark ? 'border-teal-900 text-white/70' : 'border-[#A2E8D6] text-gray-600')">
            <input type="checkbox" :value="d" v-model="mailForm.internal_departments" class="accent-[#009276]" />
            {{ d }}
          </label>
        </div>
        <p v-else class="text-[13px]" :class="isDark ? 'text-white/50' : 'text-black/40'">
          {{ currentLang === 'ar'
            ? 'لا توجد أقسام بعد — أضف موظفين في دليل البريد الداخلي (مصادر البيانات)'
            : 'No departments yet — add employees in the Internal Email Directory (Data Source page)' }}
        </p>
      </div>

      <!-- Save departments (only when mailer is configured) -->
      <button v-if="mailSettings" type="button" @click="handleSaveDepartments" :disabled="mailSaving"
        class="mt-3 transition-all transform active:scale-95 font-normal disabled:opacity-50 px-5"
        :style="{ backgroundColor: '#009276', fontSize: '14px', height: '40px', borderRadius: '8px', color: '#FFFFFF' }">
        {{ mailSaving ? '...' : (currentLang === 'ar' ? 'حفظ الأقسام' : 'Save Departments') }}
      </button>
    </div>
  </div>

  <!-- Mailer Settings Modal (SMTP config) -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showMailerModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="showMailerModal = false">
        <div class="w-full max-w-lg rounded-2xl bg-white max-h-[78vh] overflow-y-auto shadow-2xl">
          <div class="flex items-center justify-between px-7 py-5 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900">{{ currentLang === 'ar' ? 'إعدادات المرسل (SMTP)' : 'Mailer Settings (SMTP)' }}</h2>
            <button @click="showMailerModal = false" class="text-gray-400 hover:text-gray-600">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <form @submit.prevent="handleSaveMailer" class="p-7 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'خادم SMTP *' : 'SMTP Host *' }}</label>
                <input type="text" v-model="mailForm.host" required placeholder="smtp.gmail.com"
                  class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" />
              </div>
              <div>
                <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'المنفذ *' : 'Port *' }}</label>
                <input type="number" v-model="mailForm.port" required placeholder="587" min="1" max="65535"
                  class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" />
              </div>
            </div>
            <div>
              <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'التشفير' : 'Encryption' }}</label>
              <select v-model="mailForm.encryption"
                class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F]">
                <option value="tls">TLS (587)</option>
                <option value="ssl">SSL (465)</option>
                <option :value="null">{{ currentLang === 'ar' ? 'بدون' : 'None' }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'اسم المستخدم *' : 'Username *' }}</label>
              <input type="text" v-model="mailForm.username" required placeholder="accounts@yourcompany.com"
                class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" />
            </div>
            <div>
              <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'كلمة المرور / كلمة مرور التطبيق *' : 'Password / App Password *' }}</label>
              <input type="password" v-model="mailForm.password" :required="!mailSettings"
                :placeholder="mailSettings ? (currentLang === 'ar' ? '•••••••• (اتركه لعدم التغيير)' : '•••••••• (leave blank to keep)') : (currentLang === 'ar' ? 'كلمة مرور SMTP' : 'SMTP password or app password')"
                class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'عنوان المرسل *' : 'From Address *' }}</label>
                <input type="email" v-model="mailForm.from_address" required placeholder="accounts@yourcompany.com"
                  class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" />
              </div>
              <div>
                <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'اسم المرسل' : 'From Name' }}</label>
                <input type="text" v-model="mailForm.from_name" :placeholder="currentLang === 'ar' ? 'اسم شركتك' : 'Your Company Name'"
                  class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" />
              </div>
            </div>
            <p v-if="modalError" class="text-sm text-red-500">{{ modalError }}</p>
            <div class="flex gap-3 pt-2">
              <button type="submit" :disabled="mailSaving"
                class="flex-1 h-11 rounded-lg text-white text-sm font-medium disabled:opacity-50" style="background-color:#009276">
                {{ mailSaving ? '...' : (currentLang === 'ar' ? 'حفظ' : 'Save') }}
              </button>
              <button type="button" @click="showMailerModal = false"
                class="flex-1 h-11 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">
                {{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Send Test Mail Modal -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showTestModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="showTestModal = false">
        <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl">
          <div class="flex items-center justify-between px-7 py-5 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900">{{ currentLang === 'ar' ? 'إرسال بريد تجريبي' : 'Send Test Mail' }}</h2>
            <button @click="showTestModal = false" class="text-gray-400 hover:text-gray-600">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="p-7 space-y-4">
            <div>
              <label class="block text-[13px] text-gray-600 mb-1.5">{{ currentLang === 'ar' ? 'إرسال إلى' : 'Send to' }}</label>
              <input type="email" v-model="testEmail" :placeholder="currentLang === 'ar' ? 'بريدك الإلكتروني' : 'your@email.com'"
                class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" />
              <p class="text-[12px] text-gray-400 mt-1.5">{{ currentLang === 'ar' ? 'افتراضيًا بريد حسابك عند تركه فارغًا' : 'Defaults to your login email if left blank' }}</p>
            </div>
            <div class="flex gap-3 pt-1">
              <button type="button" @click="handleTestMail" :disabled="mailTesting"
                class="flex-1 h-11 rounded-lg text-white text-sm font-medium disabled:opacity-50" style="background-color:#009276">
                {{ mailTesting ? '...' : (currentLang === 'ar' ? 'إرسال' : 'Send Test') }}
              </button>
              <button type="button" @click="showTestModal = false"
                class="flex-1 h-11 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">
                {{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const { getMailSettings, saveMailSettings: saveMailSettingsApi, testMailSettings } = useOrganizationSettings()

const mailSettings = ref(null)
const availableDepartments = ref([])
const mailLoading = ref(true)
const mailSaving = ref(false)
const mailTesting = ref(false)

const mailForm = reactive({
  host: '', port: 587, encryption: 'tls', username: '', password: '',
  from_address: '', from_name: '', internal_departments: [],
})
const mailStatus = reactive({ type: '', message: '' })
const showMailerModal = ref(false)
const showTestModal = ref(false)
const modalError = ref('')
const testEmail = ref('')
const ownerEmail = ref('')

const syncMailForm = () => {
  if (!mailSettings.value) return
  const s = mailSettings.value
  mailForm.host = s.host ?? ''
  mailForm.port = s.port ?? 587
  mailForm.encryption = s.encryption ?? 'tls'
  mailForm.username = s.username ?? ''
  mailForm.password = '' // never echoed back
  mailForm.from_address = s.from_address ?? ''
  mailForm.from_name = s.from_name ?? ''
  mailForm.internal_departments = [...(s.internal_departments ?? [])]
}
watch(mailSettings, syncMailForm)

const fetchMailSettings = async () => {
  mailLoading.value = true
  try {
    const res = await getMailSettings()
    mailSettings.value = res?.data ?? null
    availableDepartments.value = res?.available_departments ?? []
  } catch {
    mailSettings.value = null
    availableDepartments.value = []
  } finally {
    mailLoading.value = false
  }
}

// Loads on mount, not a top-level await — no <Suspense> boundary around this component.
onMounted(async () => {
  await fetchMailSettings()
  try {
    const res = await useApi('/profile')
    ownerEmail.value = res?.data?.email ?? ''
  } catch { /* non-fatal */ }
})

const flashMailStatus = (type, message) => {
  mailStatus.type = type
  mailStatus.message = message
  setTimeout(() => { mailStatus.message = '' }, 5000)
}

const buildMailPayload = () => {
  const p = { ...mailForm, port: Number(mailForm.port) }
  if (!p.password) delete p.password // blank = keep existing (backend allows on update)
  return p
}

const openMailerModal = () => {
  modalError.value = ''
  syncMailForm() // reset from stored settings
  showMailerModal.value = true
}

const saveMailSettings = async (payload) => {
  mailSaving.value = true
  try {
    const res = await saveMailSettingsApi(payload)
    mailSettings.value = res?.data ?? mailSettings.value
    return { ok: true, message: res?.message }
  } catch (e) {
    const errs = e?.data?.errors
    return { ok: false, message: errs ? Object.values(errs).flat().join(' ') : (e?.data?.message ?? 'Failed to save.') }
  } finally {
    mailSaving.value = false
  }
}

// Full SMTP save (from the modal)
const handleSaveMailer = async () => {
  modalError.value = ''
  if (!mailSettings.value && !mailForm.password) {
    modalError.value = currentLang.value === 'ar' ? 'كلمة مرور SMTP مطلوبة' : 'SMTP password is required.'
    return
  }
  const res = await saveMailSettings(buildMailPayload())
  if (res.ok) {
    showMailerModal.value = false
    flashMailStatus('success', res.message)
  } else {
    modalError.value = res.message
  }
}

// Departments-only save (keeps stored SMTP + password)
const handleSaveDepartments = async () => {
  const res = await saveMailSettings(buildMailPayload())
  flashMailStatus(res.ok ? 'success' : 'error', res.message)
}

const openTestModal = () => {
  testEmail.value = ownerEmail.value || ''
  showTestModal.value = true
}

const handleTestMail = async () => {
  mailTesting.value = true
  try {
    const res = await testMailSettings(testEmail.value?.trim() || undefined)
    await fetchMailSettings() // refresh verified_at
    showTestModal.value = false
    flashMailStatus('success', res?.message)
  } catch (e) {
    showTestModal.value = false
    flashMailStatus('error', e?.data?.message ?? 'Test failed.')
  } finally {
    mailTesting.value = false
  }
}
</script>
