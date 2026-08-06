<template>
    <NuxtLayout name="dashboard">
        <CommonParticleBackground />
        <UNotifications />
        <div class="font-sans flex relative z-10" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
            <div
                class="flex-1 min-w-0 no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-4 pt-8">
                <div class="mx-auto">
                    <AlertsHeader @change="onDateChange" />

                    <!-- Mobile Status Pill Layout -->
                    <div class="mt-4 md:hidden relative" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                        <div class="w-full bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-full p-1.5 flex gap-1 shadow-sm overflow-x-auto no-scrollbar">
                            <button v-for="(cat, idx) in enrichedCategories" :key="'mob-stat-'+cat.id" @click="activeIndex = idx"
                                class="flex-1 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2"
                                :class="activeIndex === idx ? 'bg-[#013E32] text-white shadow-md' : 'text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10'">
                                {{ currentLang === 'ar' ? cat.labelAr : cat.label }}
                                <span class="px-2 py-0.5 rounded-full text-xs" :class="activeIndex === idx ? 'bg-white/20' : 'bg-gray-200 dark:bg-white/10'">
                                    {{ cat.count }}
                                </span>
                            </button>
                        </div>
                    </div>

                    <!-- Loading state -->
                    <div v-if="loading" class="flex items-center justify-center py-16">
                        <div class="w-8 h-8 border-4 border-[#008864] border-t-transparent rounded-full animate-spin"></div>
                    </div>

                    <!-- Error state -->
                    <div v-else-if="error" class="mt-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
                        {{ error }}
                    </div>

                    <template v-else>
                        <AlertsSummary
                            :type="activeStatus"
                            :data="filteredData"
                            :isDark="isDark"
                            @view="openModal('details', $event)"
                            @resolve="openModal('resolve', $event)"
                            @chat="openModal('chat', $event)"
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
        <div class="hidden md:block">
            <AlertsWheel
                v-model:activeIndex="activeIndex"
                :categories="enrichedCategories"
            />
        </div>
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
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
