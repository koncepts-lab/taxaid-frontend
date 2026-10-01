<template>
    <Teleport to="body">
        <Transition name="export-modal">
            <div v-if="modelValue" class="fixed inset-0 z-[20000] flex items-center justify-center p-4" :dir="isAr ? 'rtl' : 'ltr'">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close"></div>

                <div class="relative w-full max-w-[560px] max-h-[92vh] flex flex-col rounded-[24px] shadow-2xl overflow-hidden"
                    :class="isDark ? 'bg-[#002E26] border border-[#03D8B0]/20 text-white' : 'bg-white border border-gray-100 text-[#013e32]'"
                    @click.stop>

                    <div class="flex items-start justify-between gap-4 px-6 pt-6 pb-3">
                        <div class="min-w-0">
                            <h2 class="text-xl font-bold truncate">{{ t('title') }}</h2>
                            <p class="text-[13px] mt-0.5 truncate" :class="isDark ? 'text-white/60' : 'text-gray-500'">{{ cardTitle }}</p>
                        </div>
                        <button @click="close" class="p-1 rounded-lg transition-colors cursor-pointer"
                            :class="isDark ? 'text-white/60 hover:bg-white/10' : 'text-gray-400 hover:bg-gray-100'">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="px-6 pb-4 overflow-y-auto space-y-5 no-scrollbar">

                        <section v-if="dateMode !== 'none'">
                            <p class="section-label" :class="muted">{{ t('period') }}</p>
                            <div class="flex gap-2 mb-3">
                                <button v-for="mode in ['page', 'custom']" :key="mode" @click="periodMode = mode"
                                    class="flex-1 h-[40px] rounded-[10px] border text-[13px] font-medium transition-all cursor-pointer"
                                    :class="periodMode === mode
                                        ? (isDark ? 'bg-[#00FFBC]/15 border-[#00FFBC] text-[#00FFBC]' : 'bg-[#E6FFF5] border-[#04C18F] text-[#013e32]')
                                        : (isDark ? 'border-white/15 text-white/60 hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:bg-gray-50')">
                                    {{ mode === 'page' ? t('pagePeriod') : t('customPeriod') }}
                                </button>
                            </div>

                            <div v-if="periodMode === 'page'" class="flex items-center gap-2 px-4 h-[44px] rounded-[10px] text-[13px]"
                                :class="isDark ? 'bg-white/5 border border-white/10' : 'bg-[#F7FFFE] border border-[#04C18F]/30'">
                                <svg class="w-4 h-4 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span class="font-medium truncate">{{ pageSummary }}</span>
                            </div>

                            <div v-else class="space-y-3">
                                <template v-if="dateMode === 'range'">
                                    <CommonSelectDropdown v-model="custom.preset" mode="select" :clearable="false" :options="presetOptions" />
                                    <div v-if="custom.preset === 'Custom Dates'">
                                        <span class="text-[12px] block mb-1" :class="muted">{{ t('period') }}</span>
                                        <CommonDateField range v-model:from="custom.from" v-model:to="custom.to" :placeholder="t('pickRange')" />
                                    </div>
                                </template>
                                <div v-else>
                                    <span class="text-[12px] block mb-1" :class="muted">{{ t('date') }}</span>
                                    <CommonDateField v-model="custom.date" :placeholder="t('pick')" />
                                </div>
                            </div>

                            <div v-if="extraFields.length" class="grid gap-3 mt-3" :class="extraFields.length > 1 ? 'grid-cols-2' : 'grid-cols-1'">
                                <div v-for="f in extraFields" :key="f.key" class="block">
                                    <span class="text-[12px] block mb-1" :class="muted">{{ isAr ? f.label.ar : f.label.en }}</span>
                                    <CommonSelectDropdown v-model="extras[f.key]" mode="select" :clearable="false" :options="extraOptions(f)" />
                                </div>
                            </div>
                        </section>

                        <section>
                            <div class="flex items-center justify-between mb-2">
                                <p class="section-label !mb-0" :class="muted">{{ t('include') }}</p>
                                <div class="flex gap-3 text-[12px] font-medium" :class="isDark ? 'text-[#00FFBC]' : 'text-[#00896F]'">
                                    <button @click="setAll(true)" class="hover:underline cursor-pointer">{{ t('all') }}</button>
                                    <button @click="setAll(false)" class="hover:underline cursor-pointer">{{ t('none') }}</button>
                                </div>
                            </div>

                            <div v-if="loadingOptions" class="space-y-2">
                                <div v-for="n in 4" :key="n" class="h-[52px] rounded-[10px] animate-pulse" :class="isDark ? 'bg-white/5' : 'bg-gray-100'"></div>
                            </div>

                            <p v-else-if="loadError" class="text-[13px]" :class="isDark ? 'text-red-300' : 'text-red-500'">{{ loadError }}</p>

                            <div v-else class="space-y-2">
                                <label v-for="s in options.sheets" :key="s.key"
                                    class="flex items-start gap-3 p-3 rounded-[10px] border cursor-pointer transition-colors"
                                    :class="selected[s.key]
                                        ? (isDark ? 'border-[#00FFBC]/40 bg-[#00FFBC]/5' : 'border-[#04C18F]/50 bg-[#F0FFFA]')
                                        : (isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50')">
                                    <input v-model="selected[s.key]" type="checkbox" class="mt-1 w-4 h-4 accent-[#00896F] cursor-pointer" />
                                    <span class="min-w-0">
                                        <span class="block text-[14px] font-medium">{{ s.label }}</span>
                                        <span class="block text-[12px] mt-0.5" :class="muted">{{ s.description }}</span>
                                    </span>
                                </label>
                            </div>
                        </section>

                        <section v-if="options.details.length">
                            <p class="section-label" :class="muted">{{ t('details') }}</p>
                            <div class="space-y-2">
                                <label v-for="d in options.details" :key="d.key"
                                    class="flex items-center gap-3 p-3 rounded-[10px] border cursor-pointer"
                                    :class="isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'">
                                    <input v-model="detailsOn[d.key]" type="checkbox" class="w-4 h-4 accent-[#00896F] cursor-pointer" />
                                    <span class="text-[13px]">{{ d.label }}</span>
                                </label>
                            </div>
                        </section>

                        <section>
                            <p class="section-label" :class="muted">{{ t('format') }}</p>
                            <div class="flex gap-2">
                                <button v-for="f in formats" :key="f" @click="format = f"
                                    class="px-4 h-[36px] rounded-[10px] border text-[13px] font-medium cursor-pointer"
                                    :class="format === f
                                        ? (isDark ? 'bg-[#00FFBC]/15 border-[#00FFBC] text-[#00FFBC]' : 'bg-[#E6FFF5] border-[#04C18F] text-[#013e32]')
                                        : (isDark ? 'border-white/15 text-white/60' : 'border-gray-200 text-gray-500')">
                                    {{ f === 'xlsx' ? 'Excel (.xlsx)' : 'PDF (.pdf)' }}
                                </button>
                            </div>
                            <p v-if="options.row_limit" class="text-[11px] mt-2" :class="muted">{{ t('limit', { n: options.row_limit.toLocaleString('en-US') }) }}</p>
                        </section>
                    </div>

                    <div class="px-6 pt-3 pb-6 border-t space-y-3" :class="isDark ? 'border-white/10' : 'border-gray-100'">
                        <div v-if="exporting">
                            <div class="flex justify-between text-[12px] mb-1.5" :class="muted">
                                <span>{{ progress.stage === 'downloading' ? t('downloading') : t('preparing') }}</span>
                                <span v-if="progress.percent !== null">{{ progress.percent }}%</span>
                            </div>
                            <div class="h-2 rounded-full overflow-hidden" :class="isDark ? 'bg-white/10' : 'bg-[#E6FFF5]'">
                                <div v-if="progress.percent !== null" class="h-full bg-[#00896F] rounded-full transition-all duration-200" :style="{ width: progress.percent + '%' }"></div>
                                <div v-else class="h-full w-1/3 bg-[#00896F] rounded-full export-indeterminate"></div>
                            </div>
                        </div>

                        <p v-if="errorMessage" class="px-4 py-2.5 rounded-[10px] text-[13px] border"
                            :class="isDark ? 'text-red-300 bg-red-950/40 border-red-800' : 'text-red-600 bg-red-50 border-red-200'">{{ errorMessage }}</p>

                        <div class="flex items-center gap-3">
                            <button @click="submit" :disabled="!canSubmit"
                                class="flex-1 h-[46px] rounded-[12px] bg-[#007B5B] text-white font-medium flex items-center justify-center gap-2 hover:bg-[#00664B] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M8 12l4 4m0 0l4-4m-4 4V4" />
                                </svg>
                                {{ t('download') }}
                            </button>
                            <button @click="close" :disabled="exporting"
                                class="flex-1 h-[46px] rounded-[12px] border font-medium cursor-pointer transition-all disabled:opacity-50"
                                :class="isDark ? 'border-[#03D8B0] text-white hover:bg-white/5' : 'border-[#04C18F] text-[#013e32] hover:bg-gray-50'">
                                {{ t('cancel') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
    modelValue: Boolean,
    card: { type: String, required: true },
    title: { type: Object, default: () => ({ en: '', ar: '' }) },
    filters: { type: Object, default: () => ({}) },
    dateMode: { type: String, default: 'range' },
    dateFormat: { type: String, default: 'iso' },
    extraFields: { type: Array, default: () => [] },
    formats: { type: Array, default: () => ['xlsx'] },
})

const emit = defineEmits(['update:modelValue'])

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { exporting, progress, exportCard, fetchExportOptions } = useExport()

const isAr = computed(() => currentLang.value === 'ar')

const TEXT = {
    en: {
        title: 'Export', period: 'Period', pagePeriod: 'Page period', customPeriod: 'Custom', from: 'From', to: 'To', date: 'Date',
        include: 'Include', all: 'Select all', none: 'Clear', details: 'Details', format: 'Format', download: 'Download', cancel: 'Cancel',
        preparing: 'Preparing your file…', downloading: 'Downloading…', today: 'Today', pick: 'Choose a date', pickRange: 'Choose both dates',
        limit: 'Each tab can hold up to :n rows.', failed: 'Could not load the export options.', oneTab: 'Select at least one tab.',
    },
    ar: {
        title: 'تصدير', period: 'الفترة', pagePeriod: 'فترة الصفحة', customPeriod: 'مخصصة', from: 'من', to: 'إلى', date: 'التاريخ',
        include: 'المحتويات', all: 'تحديد الكل', none: 'إلغاء التحديد', details: 'التفاصيل', format: 'الصيغة', download: 'تنزيل', cancel: 'إلغاء',
        preparing: 'جارٍ تجهيز الملف…', downloading: 'جارٍ التنزيل…', today: 'اليوم', pick: 'اختر تاريخاً', pickRange: 'اختر التاريخين',
        limit: 'تتسع كل ورقة حتى :n صف.', failed: 'تعذر تحميل خيارات التصدير.', oneTab: 'اختر ورقة واحدة على الأقل.',
    },
}

const t = (key, vars = {}) => {
    let text = TEXT[isAr.value ? 'ar' : 'en'][key] ?? key
    for (const [name, value] of Object.entries(vars)) text = text.replace(`:${name}`, value)
    return text
}

const PRESETS = [
    { value: 'Year to Date', en: 'Year to Date', ar: 'منذ بداية العام' },
    { value: 'Previous 3 months', en: 'Previous 3 months', ar: 'آخر 3 أشهر' },
    { value: 'Previous 6 months', en: 'Previous 6 months', ar: 'آخر 6 أشهر' },
    { value: 'Custom Dates', en: 'Custom dates', ar: 'تواريخ مخصصة' },
]

const presetOptions = computed(() => PRESETS.map(p => ({ value: p.value, label: isAr.value ? p.ar : p.en })))
const extraOptions = (f) => f.options.map(o => ({ value: o.value, label: isAr.value ? o.label.ar : o.label.en }))

const muted = computed(() => (isDark.value ? 'text-white/50' : 'text-gray-500'))
const cardTitle = computed(() => (isAr.value ? props.title.ar : props.title.en))

const options = ref({ sheets: [], details: [], row_limit: 0 })
const loadingOptions = ref(false)
const loadError = ref('')
const selected = reactive({})
const detailsOn = reactive({})
const periodMode = ref('page')
const format = ref(props.formats[0])
const errorMessage = ref('')
const custom = reactive({ preset: 'Year to Date', from: '', to: '', date: '' })
const extras = reactive({})

const toIso = (value) => {
    if (!value) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
    const match = String(value).match(/^(\d{2})-(\d{2})-(\d{4})$/)
    return match ? `${match[3]}-${match[2]}-${match[1]}` : ''
}

const fromIso = (value) => {
    if (!value) return ''
    if (props.dateFormat !== 'dmy') return value
    const [y, m, d] = value.split('-')
    return `${d}-${m}-${y}`
}

const formatShown = (value) => {
    const iso = toIso(value)
    if (!iso) return ''
    const [y, m, d] = iso.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString(isAr.value ? 'ar-AE-u-nu-latn' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const pageSummary = computed(() => {
    if (props.dateMode === 'date') return props.filters.date ? formatShown(props.filters.date) : t('today')

    const option = props.filters.range_option
    const preset = PRESETS.find(p => p.value === (option === 'Custom Range' ? 'Custom Dates' : option))
    const label = preset ? (isAr.value ? preset.ar : preset.en) : (option ?? '')

    if ((option === 'Custom Range' || option === 'Custom Dates') && props.filters.custom_from) {
        return `${formatShown(props.filters.custom_from)} – ${formatShown(props.filters.custom_to)}`
    }

    return label
})

const resetState = () => {
    errorMessage.value = ''
    loadError.value = ''
    periodMode.value = 'page'
    format.value = props.formats[0]

    const option = props.filters.range_option
    custom.preset = option === 'Custom Range' ? 'Custom Dates' : (PRESETS.some(p => p.value === option) ? option : 'Year to Date')
    custom.from = toIso(props.filters.custom_from)
    custom.to = toIso(props.filters.custom_to)
    custom.date = toIso(props.filters.date) || localIsoDate()

    for (const field of props.extraFields) extras[field.key] = props.filters[field.key] ?? field.options[0]?.value
}

const loadOptions = async () => {
    loadingOptions.value = true
    try {
        options.value = await fetchExportOptions(props.card)
        for (const s of options.value.sheets) selected[s.key] = s.default
        for (const d of options.value.details) detailsOn[d.key] = d.default
    } catch (err) {
        loadError.value = err?.data?.message ?? t('failed')
    } finally {
        loadingOptions.value = false
    }
}

watch(() => props.modelValue, (open) => {
    if (!open) return
    resetState()
    loadOptions()
})

const selectedKeys = computed(() => options.value.sheets.filter(s => selected[s.key]).map(s => s.key))
const hasDataTab = computed(() => selectedKeys.value.some(key => key !== 'overview'))

const customValid = computed(() => {
    if (periodMode.value !== 'custom') return true
    if (props.dateMode === 'date') return !!custom.date
    return custom.preset !== 'Custom Dates' || (!!custom.from && !!custom.to && custom.from <= custom.to)
})

const canSubmit = computed(() => !exporting.value && !loadingOptions.value && !loadError.value && hasDataTab.value && customValid.value)

const setAll = (on) => {
    for (const s of options.value.sheets) selected[s.key] = on
}

const periodParams = () => {
    if (props.dateMode === 'none') return {}

    if (periodMode.value === 'page') {
        return props.dateMode === 'date'
            ? { date: props.filters.date }
            : { range_option: props.filters.range_option, custom_from: props.filters.custom_from, custom_to: props.filters.custom_to }
    }

    if (props.dateMode === 'date') return { date: fromIso(custom.date) }

    return custom.preset === 'Custom Dates'
        ? { range_option: 'Custom Dates', custom_from: custom.from, custom_to: custom.to }
        : { range_option: custom.preset }
}

const submit = async () => {
    if (!canSubmit.value) return

    errorMessage.value = ''

    const enabledDetails = options.value.details.filter(d => detailsOn[d.key]).map(d => d.key)

    const result = await exportCard(props.card, {
        type: format.value,
        ...periodParams(),
        ...Object.fromEntries(props.extraFields.map(f => [f.key, extras[f.key]])),
        ...(props.filters.ratio_type ? { ratio_type: props.filters.ratio_type } : {}),
        sheets: selectedKeys.value.join(','),
        details: enabledDetails.join(','),
    }, { showError: false })

    if (result.ok) close()
    else errorMessage.value = result.message ?? ''
}

const close = () => {
    if (exporting.value) return
    emit('update:modelValue', false)
}
</script>

<style scoped>
.section-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.export-modal-enter-active, .export-modal-leave-active { transition: opacity 0.2s ease; }
.export-modal-enter-from, .export-modal-leave-to { opacity: 0; }

@keyframes export-slide {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
}
.export-indeterminate { animation: export-slide 1.1s ease-in-out infinite; }
</style>
