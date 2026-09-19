<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40" @click.self="$emit('close')">
      <div class="w-full max-w-lg rounded-2xl p-6 flex flex-col max-h-[92vh] overflow-y-auto" :class="dark ? 'bg-[#002E26] text-white' : 'bg-white text-[#013E32]'">
        <h3 class="text-[20px] mb-1">{{ isAdd ? t('Add user', 'إضافة مستخدم') : t('Edit user', 'تعديل مستخدم') }}</h3>
        <p class="text-[13px] mb-4 min-h-[20px]" :class="muted">{{ isAdd ? t('Create a login for a member of your company.', 'أنشئ حساب دخول لأحد أفراد شركتك.') : user?.email }}</p>

        <div class="space-y-3 flex-1">
          <div v-if="fields.identity" class="grid grid-cols-2 gap-3">
            <input v-model="form.first_name" :placeholder="t('First name', 'الاسم الأول')" :class="inputClass" />
            <input v-model="form.last_name" :placeholder="t('Last name', 'اسم العائلة')" :class="inputClass" />
          </div>
          <input v-if="fields.identity" v-model="form.contact_number" :placeholder="t('Mobile number', 'رقم الجوال')" :class="inputClass" />
          <input v-if="fields.email" v-model="form.email" type="email" :placeholder="t('Email', 'البريد الإلكتروني')" :class="inputClass" />

          <div>
            <label class="block text-[13px] mb-1.5" :class="muted">{{ t('Role', 'الدور') }}</label>
            <CommonRoleSelect v-model="form.role" :options="roles" :lang="lang" :dark="dark" :disabled="!fields.role" />
          </div>

          <template v-if="fields.meta">
            <div>
              <label class="block text-[13px] mb-1.5" :class="muted">{{ t('Department', 'القسم') }} <span class="text-red-500">*</span></label>
              <CommonDepartmentSelect v-model="form.department" :lang="lang" :dark="dark" :placeholder="t('Select department', 'اختر القسم')" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <input v-model="form.title" :placeholder="t('Title (optional)', 'المسمى (اختياري)')" maxlength="100" :class="inputClass" />
              <input v-model="form.position" :placeholder="t('Position (optional)', 'المنصب (اختياري)')" maxlength="100" :class="inputClass" />
            </div>
            <textarea v-model="form.description" rows="2" maxlength="500" :placeholder="t('Description (optional)', 'الوصف (اختياري)')" :class="[inputClass, 'h-auto resize-none']"></textarea>
          </template>

          <template v-if="fields.password">
            <div class="relative">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" :placeholder="t('Password (optional)', 'كلمة المرور (اختياري)')" :class="[inputClass, 'pr-10']" />
              <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 px-3 flex items-center" :class="muted" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.9 17.9A10.1 10.1 0 0112 20c-7 0-11-8-11-8a18.5 18.5 0 015.1-5.9M9.9 4.2A9.1 9.1 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.2 3.2M1 1l22 22"/></svg>
              </button>
            </div>
            <div class="relative">
              <input v-model="form.confirm" :type="showConfirm ? 'text' : 'password'" autocomplete="new-password" :placeholder="t('Confirm password', 'تأكيد كلمة المرور')" :class="[inputClass, 'pr-10']" />
              <button type="button" @click="showConfirm = !showConfirm" class="absolute inset-y-0 right-0 px-3 flex items-center" :class="muted" :aria-label="showConfirm ? 'Hide password' : 'Show password'">
                <svg v-if="!showConfirm" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.9 17.9A10.1 10.1 0 0112 20c-7 0-11-8-11-8a18.5 18.5 0 015.1-5.9M9.9 4.2A9.1 9.1 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.2 3.2M1 1l22 22"/></svg>
              </button>
            </div>
            <p class="text-[12px] min-h-[16px]" :class="mismatch ? 'text-red-500' : muted">
              {{ mismatch ? t('Passwords do not match.', 'كلمتا المرور غير متطابقتين.') : t('Leave empty to generate a random password and email it to the user.', 'اتركه فارغاً لإنشاء كلمة مرور عشوائية وإرسالها بالبريد.') }}
            </p>
          </template>

          <label v-if="fields.primary" class="flex items-center justify-between gap-4 text-sm">
            <span>
              {{ t('Primary account', 'الحساب الرئيسي') }}
              <span v-if="form.role !== 'master_user'" class="block text-[12px]" :class="muted">{{ t('Only a master can be the primary account.', 'يمكن للمدير الرئيسي فقط أن يكون الحساب الرئيسي.') }}</span>
            </span>
            <input type="checkbox" v-model="form.is_primary" :disabled="form.role !== 'master_user' || user?.is_primary" class="w-5 h-5 accent-[#00896F]" />
          </label>

          <div v-if="!isAdd && actions.length" class="pt-3 border-t" :class="dark ? 'border-white/10' : 'border-gray-100'">
            <p class="text-[12px] mb-2" :class="muted">{{ t('Account actions', 'إجراءات الحساب') }}</p>
            <div class="flex flex-wrap gap-2">
              <button v-if="actions.includes('reset')" type="button" @click="$emit('reset-password')" class="px-3 py-1.5 text-[13px] rounded-lg border border-[#008169]/40 text-[#00896F] hover:bg-[#00B794]/10">
                {{ t('Reset password', 'إعادة تعيين كلمة المرور') }}
              </button>
              <button v-if="actions.includes('status')" type="button" @click="$emit('toggle-status')" class="px-3 py-1.5 text-[13px] rounded-lg border border-amber-400 text-amber-600 hover:bg-amber-50/10">
                {{ user?.status === 'live' ? t('Suspend', 'تعليق') : t('Unsuspend', 'إلغاء التعليق') }}
              </button>
              <button v-if="actions.includes('remove')" type="button" @click="$emit('remove')" class="px-3 py-1.5 text-[13px] rounded-lg border border-[#FFA6A6] text-[#FF6B50] hover:bg-[#FF6B50] hover:text-white">
                {{ t('Remove', 'حذف') }}
              </button>
            </div>
          </div>
        </div>

        <p class="text-sm text-red-500 min-h-[20px] mt-3">{{ localError || error }}</p>

        <div class="flex gap-3 justify-end mt-2">
          <button @click="$emit('close')" class="px-5 py-2 rounded-xl border text-sm" :class="dark ? 'border-white/20' : 'border-gray-200'">{{ t('Cancel', 'إلغاء') }}</button>
          <button @click="submit" :disabled="saving || mismatch" class="px-5 py-2 rounded-xl bg-[#00896F] hover:bg-[#00705a] text-white text-sm disabled:opacity-60">
            {{ saving ? '...' : t('Save', 'حفظ') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const props = defineProps({
  mode: { type: String, default: 'add' },
  user: { type: Object, default: null },
  roles: { type: Array, default: () => [] },
  fields: { type: Object, default: () => ({ identity: true, email: true, role: true, password: true, primary: false }) },
  actions: { type: Array, default: () => [] },
  lang: { type: String, default: 'en' },
  dark: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
  error: { type: String, default: '' },
})
const emit = defineEmits(['close', 'submit', 'reset-password', 'toggle-status', 'remove'])

const isAdd = computed(() => props.mode === 'add')
const t = (en, ar) => (props.lang === 'ar' ? ar : en)
const muted = computed(() => (props.dark ? 'text-white/50' : 'text-gray-500'))

const form = reactive({
  first_name: props.user?.first_name ?? '',
  last_name: props.user?.last_name ?? '',
  contact_number: props.user?.contact_number ?? '',
  email: props.user?.email ?? '',
  role: props.user?.role && props.roles.includes(props.user.role) ? props.user.role : (props.roles.includes('account_user') ? 'account_user' : props.roles[0] ?? ''),
  password: '',
  confirm: '',
  is_primary: !!props.user?.is_primary,
  department: props.user?.department ?? '',
  title: props.user?.title ?? '',
  position: props.user?.position ?? '',
  description: props.user?.description ?? '',
})
const showPassword = ref(false)
const showConfirm = ref(false)
const mismatch = computed(() => !!props.fields.password && form.password !== form.confirm && (form.password !== '' || form.confirm !== ''))

const inputClass = computed(() => [
  'w-full h-[40px] rounded-lg px-3 py-2 text-sm border focus:outline-none focus:border-[#00896F] disabled:opacity-60',
  props.dark ? 'bg-transparent border-white/20 text-white placeholder-white/40' : 'bg-white border-[#04C18F] text-black',
])

const missingDepartment = computed(() => !!props.fields.meta && !form.department)
const localError = ref('')

const submit = () => {
  if (mismatch.value) return
  if (missingDepartment.value) {
    localError.value = t('Department is required.', 'القسم مطلوب.')
    return
  }
  localError.value = ''
  const { confirm, ...payload } = form
  if (!props.fields.meta) {
    delete payload.department
    delete payload.title
    delete payload.position
    delete payload.description
  }
  emit('submit', payload)
}
</script>
