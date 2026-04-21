<template>
    <NuxtLayout name="dashboard">
        <CommonParticleBackground />
        <UNotifications />
        <div class="font-sans flex  relative z-10" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
            <div
                class="flex-1  h-[calc(100vh-154px)] no-scrollbar transition-all duration-500 ease-in-out lg:p-8  p-4 pt-8">
                <div class="mx-auto">
                    <AlertsHeader />
                    <AlertsSummary :type="activeCategory" :data="filteredData" :isDark="isDark"
                        @view="openModal('details', $event)" @resolve="openModal('resolve', $event)"
                        @chat="openModal('chat', $event)" />
                </div>
            </div>
        </div>
        <AlertsViewModal :isOpen="activeModal === 'details'" :alert="selectedAlert" :isDark="isDark"
            :currentLang="currentLang" @close="closeModal" />
        <AlertsResolveModal :isOpen="activeModal === 'resolve'" :alert="selectedAlert" :isDark="isDark"
            :currentLang="currentLang" @close="closeModal" @submit="handleActionSubmit" @ignore="handleIgnore" />
        <AlertsChatModal :isOpen="activeModal === 'chat'" :alert="selectedAlert" :isDark="isDark"
            :currentLang="currentLang" @close="closeModal" />
        <AlertsWheel v-model:activeIndex="activeIndex" :categories="enrichedCategories" />
    </NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const isChatOpen = ref(false)

// 1. Fetch dynamic data from composable
const { categories: categoriesFromDs, statusMap, alerts: masterAlerts, loading, error } = useAlertsPage()

// 2. Track which tab is active (index in categories array)
const activeIndex = ref(0)

// 3. Category mapping derived from dynamic categories
const activeCategory = computed(() => categoriesFromDs.value[activeIndex.value]?.id || 'all')

// 4. Enrich categories with dynamic counts
const enrichedCategories = computed(() => {
    return categoriesFromDs.value.map(cat => {
        let count = 0
        if (cat.id === 'all') {
            count = masterAlerts.value.length
        } else {
            const statusToMatch = statusMap.value[cat.id]
            count = masterAlerts.value.filter(a => a.status === statusToMatch).length
        }
        return { ...cat, count }
    })
})

const activeModal = ref(null); // stores 'details', 'resolve', 'delete', etc.
const selectedAlert = ref({});

const openModal = (type, data) => {
    selectedAlert.value = data;
    activeModal.value = type;
};

const closeModal = () => {
    activeModal.value = null;
};

const handleActionSubmit = (updatedData) => {
    console.log("Action recorded:", updatedData);
    closeModal();
};

const handleIgnore = (alert) => {
    console.log("Alert ignored:", alert);
    closeModal();
};

const filteredData = computed(() => {
    const type = activeCategory.value
    if (type === 'all') return masterAlerts.value

    const statusToMatch = statusMap.value[type]
    if (!statusToMatch) return masterAlerts.value

    return masterAlerts.value.filter(item => item.status === statusToMatch)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>