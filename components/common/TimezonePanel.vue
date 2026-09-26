<template>
  <div :dir="isAr ? 'rtl' : 'ltr'" class="space-y-4">
    <template v-if="data">
      <p class="text-[13px] leading-relaxed" :class="muted">{{ rows.length > 1 ? t('introMulti') : t('intro') }}</p>

      <div v-if="showDefault" class="rounded-[14px] border px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-1"
        :class="isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'">
        <span class="text-[12px] font-semibold uppercase tracking-wide" :class="muted">{{ t('platformDefault') }}</span>
        <span class="text-[14px] font-medium" dir="ltr" :class="strong">{{ data.default_zone }}</span>
        <span class="text-[13px] tabular-nums" dir="ltr" :class="muted">{{ offsetLabel(data.default_zone) }} · {{ clock(data.default_zone).time }}</span>
      </div>

      <div v-for="row in rows" :key="row.key" class="rounded-[14px] border p-4"
        :class="isDark ? 'bg-white/5 border-white/10' : 'bg-[#F7FFFE] border-[#04C18F]/25'">
        <div class="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-[15px] font-medium truncate" :class="strong">{{ row.title }}</h3>
              <span v-if="row.current" class="px-2 py-0.5 rounded-full text-[11px] font-medium"
                :class="isDark ? 'bg-[#00FFBC]/15 text-[#00FFBC]' : 'bg-[#D6F5ED] text-[#006A56]'">{{ t('current') }}</span>
            </div>
            <p class="text-[12px] mt-1" :class="muted">{{ row.hint }}</p>
            <span class="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium" :class="sourceClass(row.source)">{{ t('source_' + row.source) }}</span>
          </div>

          <div class="min-w-0">
            <CommonSelectDropdown v-if="editable" mode="select" :clearable="false" searchable
              :options="row.options" :model-value="drafts[row.key]" :placeholder="row.emptyLabel"
              :search-placeholder="t('search')" :no-matches-label="t('noMatches')" :disabled="busy"
              @update:model-value="(value) => (drafts[row.key] = value)" />
            <p v-else class="text-[14px]" dir="ltr" :class="strong">
              <template v-if="row.zone">{{ row.zone }}</template>
              <span v-else :class="muted" :dir="isAr ? 'rtl' : 'ltr'">{{ row.emptyLabel }}</span>
            </p>
          </div>

          <div class="min-w-0 md:text-end">
            <div class="text-[24px] leading-none font-semibold tabular-nums" dir="ltr" :class="isDark ? 'text-[#00FFBC]' : 'text-[#00896F]'">{{ clock(row.preview).time }}</div>
            <div class="text-[12px] mt-1.5" :class="strong">{{ clock(row.preview).day }} · {{ clock(row.preview).date }}</div>
            <div class="text-[11px] mt-0.5 tabular-nums" dir="ltr" :class="muted">{{ row.preview }} · {{ offsetLabel(row.preview) }}</div>
          </div>
        </div>

        <div v-if="editable && isDirty(row)" class="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" @click="save(row)" :disabled="busy"
            class="h-[38px] px-5 rounded-[10px] text-[13px] font-medium text-white bg-[#00896F] hover:bg-[#006552] disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer">
            {{ busy ? t('saving') : t('save') }}
          </button>
          <button type="button" @click="reset(row)" :disabled="busy"
            class="h-[38px] px-4 rounded-[10px] border text-[13px] font-medium transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            :class="isDark ? 'border-white/15 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
            {{ t('reset') }}
          </button>
        </div>
      </div>

      <p v-if="!editable" class="text-[12px]" :class="muted">{{ t('readOnly') }}</p>
      <p v-if="error" class="px-4 py-2.5 rounded-[10px] text-[13px] border"
        :class="isDark ? 'text-red-300 bg-red-950/40 border-red-800' : 'text-red-600 bg-red-50 border-red-200'">{{ error }}</p>
    </template>

    <template v-else>
      <div v-for="n in 2" :key="n" class="h-[92px] rounded-[14px] animate-pulse" :class="isDark ? 'bg-white/5' : 'bg-gray-100'"></div>
    </template>
  </div>
</template>

<script setup>
// Shows the TaxAid default, the organization zone and (when the org has several) each tenant's zone,
// with a live clock in the zone each one really uses. editable=false renders it read-only (admin view).
// data = payload of GET .../timezone; emits save({ scope: 'organization'|'tenant', tenant_id?, zone: string|null }).
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  data: { type: Object, default: null },
  editable: { type: Boolean, default: false },
  busy: { type: Boolean, default: false },
  error: { type: String, default: '' },
  showDefault: { type: Boolean, default: false },
})
const emit = defineEmits(['save'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const isAr = computed(() => currentLang.value === 'ar')

const TEXT = {
  en: {
    intro: 'Choose the time zone your account uses for dates and times in cards, reports and exports.',
    introMulti: 'Choose one time zone for the whole organization. Each tenant follows it unless you give that tenant its own zone.',
    platformDefault: 'TaxAid default', orgZone: 'Organization time zone', orgHint: 'Used by every tenant that has no zone of its own.',
    tenantHint: 'Leave on "Follow organization" to use the organization zone.', current: 'This tenant',
    useDefault: 'Default', followOrg: 'Follow organization',
    source_tenant: 'Tenant setting', source_organization: 'Organization setting', source_default: 'Default',
    save: 'Save', saving: 'Saving…', reset: 'Reset', search: 'Search country, city or time zone…', noMatches: 'No matching time zone',
    readOnly: 'Only the organization owner can change time zones.',
  },
  ar: {
    intro: 'اختر المنطقة الزمنية التي يستخدمها حسابك للتواريخ والأوقات في البطاقات والتقارير والتصدير.',
    introMulti: 'اختر منطقة زمنية واحدة للمؤسسة بأكملها. تتبعها كل جهة ما لم تحدد لها منطقة خاصة.',
    platformDefault: 'الافتراضي في TaxAid', orgZone: 'المنطقة الزمنية للمؤسسة', orgHint: 'تستخدمها كل جهة ليس لها منطقة زمنية خاصة.',
    tenantHint: 'اتركها على "اتباع المؤسسة" لاستخدام منطقة المؤسسة.', current: 'هذه الجهة',
    useDefault: 'افتراضي', followOrg: 'اتباع المؤسسة',
    source_tenant: 'إعداد الجهة', source_organization: 'إعداد المؤسسة', source_default: 'افتراضي',
    save: 'حفظ', saving: 'جارٍ الحفظ…', reset: 'تراجع', search: 'ابحث بالدولة أو المدينة أو المنطقة الزمنية…', noMatches: 'لا توجد منطقة مطابقة',
    readOnly: 'يمكن لمالك المؤسسة فقط تغيير المناطق الزمنية.',
  },
}
const ADMIN_TEXT = {
  en: { useDefault: 'TaxAid default', source_default: 'TaxAid default' },
  ar: { useDefault: 'الافتراضي في TaxAid', source_default: 'الافتراضي في TaxAid' },
}
const t = (key) => {
  const lang = isAr.value ? 'ar' : 'en'
  return (props.showDefault ? ADMIN_TEXT[lang][key] : undefined) ?? TEXT[lang][key] ?? key
}

const muted = computed(() => (isDark.value ? 'text-white/60' : 'text-gray-500'))
const strong = computed(() => (isDark.value ? 'text-white' : 'text-[#101828]'))

const now = ref(new Date())
let timer = null
onMounted(() => { timer = setInterval(() => { now.value = new Date() }, 1000) })
onBeforeUnmount(() => clearInterval(timer))

const clock = (zone) => zoneClock(zone, currentLang.value, now.value)
const offsetLabel = (zone) => zoneOffsetLabel(zone, now.value)

const zoneOptions = computed(() => timezoneOptions(currentLang.value))

const drafts = reactive({})
watch(() => props.data, (data) => {
  for (const key of Object.keys(drafts)) delete drafts[key]
  if (!data) return
  drafts.org = data.organization.zone ?? ''
  for (const tenant of data.tenants) drafts[`t${tenant.id}`] = tenant.zone ?? ''
}, { immediate: true, deep: true })

const rows = computed(() => {
  const data = props.data
  if (!data) return []

  const orgEmpty = `${t('useDefault')} — ${data.default_zone}`
  const orgRow = {
    key: 'org', scope: 'organization', title: t('orgZone'), hint: t('orgHint'), current: false,
    zone: data.organization.zone, source: data.organization.source,
    emptyLabel: orgEmpty, options: [{ value: '', label: orgEmpty }, ...zoneOptions.value],
    preview: drafts.org || data.default_zone,
  }

  if (data.tenants.length < 2) return [orgRow]

  const followLabel = `${t('followOrg')} — ${data.organization.effective}`
  const tenantRows = data.tenants.map((tenant) => ({
    key: `t${tenant.id}`, scope: 'tenant', id: tenant.id, title: tenant.name || `#${tenant.id}`, hint: t('tenantHint'), current: tenant.is_current,
    zone: tenant.zone, source: tenant.source,
    emptyLabel: followLabel, options: [{ value: '', label: followLabel }, ...zoneOptions.value],
    preview: drafts[`t${tenant.id}`] || data.organization.effective,
  }))

  return [orgRow, ...tenantRows]
})

const savedValue = (row) => row.zone ?? ''
const isDirty = (row) => (drafts[row.key] ?? '') !== savedValue(row)

const save = (row) => {
  emit('save', {
    scope: row.scope,
    ...(row.scope === 'tenant' ? { tenant_id: row.id } : {}),
    zone: drafts[row.key] === '' ? null : drafts[row.key],
  })
}

const reset = (row) => { drafts[row.key] = savedValue(row) }

const sourceClass = (source) => {
  if (source === 'tenant') return isDark.value ? 'bg-[#00FFBC]/15 text-[#00FFBC]' : 'bg-[#D6F5ED] text-[#006A56]'
  if (source === 'organization') return isDark.value ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-100 text-sky-700'
  return isDark.value ? 'bg-white/10 text-white/70' : 'bg-gray-100 text-gray-600'
}
</script>
