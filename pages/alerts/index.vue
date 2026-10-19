<template>
    <NuxtLayout name="dashboard">
        <CommonParticleBackground />
        <UNotifications />
        <div class="font-sans flex relative z-10" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
            <div
                class="flex-1 min-w-0 no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-4 pt-8">
                <div class="mx-auto">
                    <AlertsHeader @change="onDateChange" />

                    <!-- Mobile Status Pill Layout (Removed) -->

                    <!-- Loading state -->
                    <AlertsSkeleton v-if="loading" :type="activeStatus" />

                    <!-- Error state -->
                    <div v-else-if="error" class="mt-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
                        {{ error }}
                    </div>

                    <template v-else>
                        <AlertsWheel
                            v-model:activeIndex="activeIndex"
                            :categories="enrichedCategories"
                        />
                        <div v-if="!filteredData.length" class="mt-6 py-16 flex items-center justify-center rounded-2xl" :class="isDark ? 'bg-[#002E26] border border-[#03D8B0]/20' : 'bg-gray-50'">
                            <p class="text-sm font-medium" :class="isDark ? 'text-white/60' : 'text-gray-500'">
                                {{ currentLang === 'ar' ? 'لا توجد تنبيهات' : 'No alerts found' }}
                            </p>
                        </div>
                        <AlertsSummary
                            v-else
                            :type="activeStatus"
                            :data="filteredData"
                            :isDark="isDark"
                            @view="openModal('details', $event)"
                            @resolve="openModal('resolve', $event)"
                            @chat="openModal('chat', $event)"
                            @inspect="handleInspect"
                        />

                        <!-- Pagination -->
                        <CommonPaginationBar 
                            v-if="meta.last_page > 1" 
                            :meta="meta" 
                            :loading="loading" 
                            @page-change="fetchAlerts(null, null, $event)" 
                        />
                    </template>
                </div>
            </div>
        </div>


        <AlertsViewModal
            :isOpen="activeModal === 'details'"
            :alert="selectedAlert"
            :isDark="isDark"
            :currentLang="currentLang"
            @close="closeModal"
        />
        <AlertsResolveModal
            :isOpen="activeModal === 'resolve'"
            :alert="selectedAlert"
            :isDark="isDark"
            :currentLang="currentLang"
            @close="closeModal"
            @submit="handleActionSubmit"
            @ignore="handleIgnore"
        />
        <AlertsChatModal
            :isOpen="activeModal === 'chat'"
            :alert="selectedAlert"
            :isDark="isDark"
            :currentLang="currentLang"
            @close="closeModal"
        />

        <DashboardVarianceReconciliationModal
            v-if="inspectKey === 'ap_variance' || inspectKey === 'ar_variance'"
            :side="inspectKey === 'ap_variance' ? 'ap' : 'ar'"
            :data="inspectData"
            @close="closeInspect"
            @resolved="onInspectResolved"
        />
        <DashboardNewLedgerDetectedModal
            v-if="inspectKey === 'missing_ledgers'"
            :data="inspectData"
            @close="closeInspect"
            @resolved="onInspectResolved"
        />
        <DashboardSalesForecastVarianceModal
            v-if="inspectKey === 'sales_forecast_variance'"
            :data="inspectData"
            :date="todayIso"
            @close="closeInspect"
            @resolved="onInspectResolved"
        />
    </NuxtLayout>
</template>

<script setup>
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const {
    alerts, loading, loadingMore, error, meta,
    activeStatus, enrichedCategories,
    fetchAlerts, loadMore, recordAction,
} = useAlertsPage()

const onDateChange = ({ type, date }) => {
    fetchAlerts(date, type)
}

// Map activeStatus ↔ wheel index
const activeIndex = computed({
    get: () => {
        const idx = enrichedCategories.value.findIndex(c => c.id === activeStatus.value)
        return idx >= 0 ? idx : 0
    },
    set: (idx) => {
        activeStatus.value = enrichedCategories.value[idx]?.id || 'all'
    },
})

// Backend already filters by status — just expose directly
const filteredData = computed(() => alerts.value)

const activeModal  = ref(null)
const selectedAlert = ref({})

const openModal = (type, data) => {
    selectedAlert.value = data
    activeModal.value   = type
}

const closeModal = () => {
    activeModal.value = null
}

const handleActionSubmit = async (data) => {
    await recordAction(selectedAlert.value.id, 'resolve', data.action_by, data.action_notes)
    closeModal()
}

const handleIgnore = async (alert) => {
    await recordAction(alert.id, 'ignore')
    closeModal()
}

const todayIso = localIsoDate()

const TARGET_TO_KEY = {
    'ap-verification': 'ap_variance',
    'ar-verification': 'ar_variance',
    'ledger-mapping': 'missing_ledgers',
    'sales-forecast': 'sales_forecast_variance',
}

const inspectKey = ref(null)
const inspectData = ref(null)

const handleInspect = async (row) => {
    const key = TARGET_TO_KEY[row.action?.target]
    if (!key) return
    const res = await useApi('/dashboard/alerts')
    const data = res?.data?.[key]
    if (!data) return
    inspectData.value = data
    inspectKey.value = key
}

const closeInspect = () => {
    inspectKey.value = null
    inspectData.value = null
}

const onInspectResolved = async () => {
    closeInspect()
    await fetchAlerts()
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
