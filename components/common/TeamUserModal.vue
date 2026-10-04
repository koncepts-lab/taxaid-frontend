<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40">
      <div class="relative w-full max-w-lg rounded-2xl flex flex-col max-h-[92vh] overflow-hidden" :class="dark ? 'bg-[#002E26] text-white' : 'bg-white text-[#013E32]'">
        <div class="p-6 pb-3 shrink-0 relative">
          <button
            type="button"
            @click="$emit('close')"
            class="absolute top-5 right-5 p-1.5 rounded-lg transition-colors focus:outline-none"
            :class="dark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'"
            aria-label="Close"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 class="text-[20px] mb-1 pr-8">{{ isAdd ? t('Add user', 'إضافة مستخدم') : t('Edit user', 'تعديل مستخدم') }}</h3>
          <p class="text-[13px] min-h-[20px] pr-8" :class="muted">{{ isAdd ? t('Create a login for a member of your company.', 'أنشئ حساب دخول لأحد أفراد شركتك.') : user?.email }}</p>
        </div>

        <div class="px-6 pb-6 overflow-y-auto flex-1 space-y-3">
          <div v-if="fields.identity">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <input
                  v-model="form.first_name"
                  @blur="touched.first_name = true"
                  @input="touched.first_name = true"
                  :placeholder="t('First name', 'الاسم الأول') + ' *'"
                  :class="inputClassFor('first_name')"
                />
                <p v-if="(touched.first_name || submitted) && fieldErrors.first_name" class="text-[12px] text-red-500 mt-1">
                  {{ fieldErrors.first_name }}
                </p>
              </div>
              <div>
                <input
                  v-model="form.last_name"
                  @blur="touched.last_name = true"
                  @input="touched.last_name = true"
                  :placeholder="t('Last name', 'اسم العائلة') + ' *'"
                  :class="inputClassFor('last_name')"
                />
                <p v-if="(touched.last_name || submitted) && fieldErrors.last_name" class="text-[12px] text-red-500 mt-1">
                  {{ fieldErrors.last_name }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="fields.identity">
            <input
              v-model="form.contact_number"
              @blur="touched.contact_number = true"
              @input="touched.contact_number = true"
              :placeholder="t('Mobile number', 'رقم الجوال') + ' *'"
              :class="inputClassFor('contact_number')"
            />
            <p v-if="(touched.contact_number || submitted) && fieldErrors.contact_number" class="text-[12px] text-red-500 mt-1">
              {{ fieldErrors.contact_number }}
            </p>
          </div>

          <div v-if="fields.email">
            <input
              v-model="form.email"
              @blur="touched.email = true"
              @input="touched.email = true"
              type="email"
              :placeholder="t('Email', 'البريد الإلكتروني') + ' *'"
              :class="inputClassFor('email')"
            />
            <p v-if="(touched.email || submitted) && fieldErrors.email" class="text-[12px] text-red-500 mt-1">
              {{ fieldErrors.email }}
            </p>
          </div>

          <div>
            <label class="block text-[13px] mb-1.5" :class="muted">{{ t('Role', 'الدور') }} <span class="text-red-500">*</span></label>
            <CommonRoleSelect v-model="form.role" :options="roles" :lang="lang" :dark="dark" :disabled="!fields.role" />
            <p v-if="(touched.role || submitted) && fieldErrors.role" class="text-[12px] text-red-500 mt-1">
              {{ fieldErrors.role }}
            </p>
          </div>

          <template v-if="fields.meta">
            <div>
              <label class="block text-[13px] mb-1.5" :class="muted">{{ t('Department', 'القسم') }} <span class="text-red-500">*</span></label>
              <CommonDepartmentSelect v-model="form.department" :lang="lang" :dark="dark" :placeholder="t('Select department', 'اختر القسم')" />
              <p v-if="(touched.department || submitted) && fieldErrors.department" class="text-[12px] text-red-500 mt-1">
                {{ fieldErrors.department }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <input v-model="form.title" :placeholder="t('Title (optional)', 'المسمى (اختياري)')" maxlength="100" :class="inputClassFor('title')" />
              <input v-model="form.position" :placeholder="t('Position (optional)', 'المنصب (اختياري)')" maxlength="100" :class="inputClassFor('position')" />
            </div>
            <textarea v-model="form.description" rows="2" maxlength="500" :placeholder="t('Description (optional)', 'الوصف (اختياري)')" :class="[inputClassFor('description'), 'h-auto resize-none']"></textarea>
          </template>

          <template v-if="fields.password">
            <div>
              <div class="relative">
                <input
                  v-model="form.password"
                  @blur="touched.password = true"
                  @input="touched.password = true"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  :placeholder="t('Password (optional)', 'كلمة المرور (اختياري)')"
                  :class="[inputClassFor('password'), 'pr-10']"
                />
                <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 px-3 flex items-center" :class="muted" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                  <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.9 17.9A10.1 10.1 0 0112 20c-7 0-11-8-11-8a18.5 18.5 0 015.1-5.9M9.9 4.2A9.1 9.1 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.2 3.2M1 1l22 22"/></svg>
                </button>
              </div>
              <p v-if="(touched.password || submitted) && fieldErrors.password" class="text-[12px] text-red-500 mt-1">
                {{ fieldErrors.password }}
              </p>
            </div>

            <div>
              <div class="relative">
                <input
                  v-model="form.confirm"
                  @blur="touched.confirm = true"
                  @input="touched.confirm = true"
                  :type="showConfirm ? 'text' : 'password'"
                  autocomplete="new-password"
                  :placeholder="t('Confirm password', 'تأكيد كلمة المرور')"
                  :class="[inputClassFor('confirm'), 'pr-10']"
                />
                <button type="button" @click="showConfirm = !showConfirm" class="absolute inset-y-0 right-0 px-3 flex items-center" :class="muted" :aria-label="showConfirm ? 'Hide password' : 'Show password'">
                  <svg v-if="!showConfirm" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.9 17.9A10.1 10.1 0 0112 20c-7 0-11-8-11-8a18.5 18.5 0 015.1-5.9M9.9 4.2A9.1 9.1 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.2 3.2M1 1l22 22"/></svg>
                </button>
              </div>
              <p class="text-[12px] min-h-[16px] mt-1" :class="(touched.confirm || submitted) && fieldErrors.confirm ? 'text-red-500' : muted">
                {{ (touched.confirm || submitted) && fieldErrors.confirm ? fieldErrors.confirm : t('Leave empty to generate a random password and email it to the user.', 'اتركه فارغاً لإنشاء كلمة مرور عشوائية وإرسالها بالبريد.') }}
              </p>
            </div>
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

          <p class="text-sm text-red-500 min-h-[20px] mt-3">{{ localError || error }}</p>

          <div class="flex gap-3 justify-end mt-2">
            <button @click="$emit('close')" class="px-5 py-2 rounded-xl border text-sm" :class="dark ? 'border-white/20' : 'border-gray-200'">{{ t('Cancel', 'إلغاء') }}</button>
            <button @click="submit" :disabled="saving" class="px-5 py-2 rounded-xl bg-[#00896F] hover:bg-[#00705a] text-white text-sm disabled:opacity-60">
              {{ saving ? '...' : t('Save', 'حفظ') }}
            </button>
          </div>
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

const touched = reactive({
  first_name: false,
  last_name: false,
  contact_number: false,
  email: false,
  role: false,
  department: false,
  password: false,
  confirm: false,
})

const submitted = ref(false)
const showPassword = ref(false)
const showConfirm = ref(false)
const localError = ref('')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fieldErrors = computed(() => {
  const errs = {}

  if (props.fields.identity) {
    if (!form.first_name.trim()) {
      errs.first_name = t('First name is required.', 'الاسم الأول مطلوب.')
    } else if (form.first_name.length > 100) {
      errs.first_name = t('First name cannot exceed 100 characters.', 'الاسم الأول يجب ألا يتجاوز 100 حرف.')
    }

    if (!form.last_name.trim()) {
      errs.last_name = t('Last name is required.', 'اسم العائلة مطلوب.')
    } else if (form.last_name.length > 100) {
      errs.last_name = t('Last name cannot exceed 100 characters.', 'اسم العائلة يجب ألا يتجاوز 100 حرف.')
    }

    if (!form.contact_number.trim()) {
      errs.contact_number = t('Mobile number is required.', 'رقم الجوال مطلوب.')
    } else if (form.contact_number.length > 30) {
      errs.contact_number = t('Mobile number cannot exceed 30 characters.', 'رقم الجوال يجب ألا يتجاوز 30 حرف.')
    }
  }

  if (props.fields.email) {
    if (!form.email.trim()) {
      errs.email = t('Email is required.', 'البريد الإلكتروني مطلوب.')
    } else if (!emailRegex.test(form.email.trim())) {
      errs.email = t('Please enter a valid email address.', 'يرجى إدخال بريد إلكتروني صحيح.')
    } else if (form.email.length > 255) {
      errs.email = t('Email cannot exceed 255 characters.', 'البريد الإلكتروني يجب ألا يتجاوز 255 حرف.')
    }
  }

  if (props.fields.role && !form.role) {
    errs.role = t('Role is required.', 'الدور مطلوب.')
  }

  if (props.fields.meta && !form.department) {
    errs.department = t('Department is required.', 'القسم مطلوب.')
  }

  if (props.fields.password) {
    if (form.password && form.password.length < 8) {
      errs.password = t('Password must be at least 8 characters.', 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل.')
    } else if (form.password && form.password.length > 100) {
      errs.password = t('Password cannot exceed 100 characters.', 'كلمة المرور يجب ألا تتجاوز 100 حرف.')
    }

    if ((form.password || form.confirm) && form.password !== form.confirm) {
      errs.confirm = t('Passwords do not match.', 'كلمتا المرور غير متطابقتين.')
    }
  }

  return errs
})

const hasErrors = computed(() => Object.keys(fieldErrors.value).length > 0)

const inputClassFor = (fieldName) => {
  const isInvalid = (touched[fieldName] || submitted.value) && fieldErrors.value[fieldName]
  return [
    'w-full h-[40px] rounded-lg px-3 py-2 text-sm border focus:outline-none transition-colors disabled:opacity-60',
    isInvalid
      ? (props.dark ? 'bg-transparent border-red-500 text-white placeholder-white/40 focus:border-red-400' : 'bg-white border-red-500 text-black focus:border-red-500')
      : (props.dark ? 'bg-transparent border-white/20 text-white placeholder-white/40 focus:border-[#00896F]' : 'bg-white border-[#04C18F] text-black focus:border-[#00896F]'),
  ]
}

const submit = () => {
  submitted.value = true
  if (hasErrors.value) return
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
