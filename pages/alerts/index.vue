<template>
    <NuxtLayout name="dashboard">
        <CommonParticleBackground />
        <UNotifications />
        <div class="font-sans flex  relative z-10" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
            <div class="flex-1  no-scrollbar transition-all duration-500 ease-in-out lg:p-8  p-4 pt-8">
                <div class="mx-auto">
                    <AlertsHeader />
                    <AlertsSummary :type="activeCategory" :data="filteredData" :isDark="isDark"
                        @view="openModal('details', $event)" @resolve="openModal('resolve', $event)" />
                </div>
            </div>
        </div>
        <AlertsViewModal :isOpen="activeModal === 'details'" :alert="selectedAlert" :isDark="isDark"
            :currentLang="currentLang" @close="closeModal" />
        <AlertsResolveModal :isOpen="activeModal === 'resolve'" :alert="selectedAlert" :isDark="isDark"
            :currentLang="currentLang" @close="closeModal" @submit="handleActionSubmit" @ignore="handleIgnore" />
        <AlertsWheel v-model:activeIndex="activeIndex" />
    </NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const isChatOpen = ref(false)

// 1. Track which tab is active (0: All, 1: Pending, 2: Resolved, 3: Ignored)
const activeIndex = ref(0)

// 2. Category mapping to match your Table's "type" prop
const categoryIds = ['all', 'pending', 'resolved', 'ignored']
const activeCategory = computed(() => categoryIds[activeIndex.value])

// 3. Sample Master Data
const masterAlerts = ref([
    {
        module: "Revenue Analysis",
        title: "Revenue Variance Detected",
        date: "Nov 14, 2025",
        status: "Completed",
        description: "Q3 revenue decreased by 12% compared to Q2 - requires analysis",
        fullModuleName: "Revenue Analysis Module",
        actionTitle: "Action Taken",
        actionNote: "Detailed variance analysis completed and presented to management",
        assignee: "Sarah Johnson - Financial Analyst",
        actionDate: "Nov 14, 2025"
    }, {
        module: "COGS Analysis", title: "COGS Increase Alert", date: "Nov 14, 2025", status: "Awaiting Action", description: "Q3 revenue decreased by 12% compared to Q2 - requires analysis",
        fullModuleName: "Revenue Analysis Module",
        actionTitle: "Action Taken",
        actionNote: "Detailed variance analysis completed and presented to management",
        assignee: "Sarah Johnson - Financial Analyst",
        actionDate: "Nov 14, 2025"
    },
    {
        module: "Financial statement", title: "Monthly Statements Pending", date: "Nov 14, 2025", status: "Awaiting Action", description: "Q3 revenue decreased by 12% compared to Q2 - requires analysis",
        fullModuleName: "Revenue Analysis Module",
        actionTitle: "Action Taken",
        actionNote: "Detailed variance analysis completed and presented to management",
        assignee: "Sarah Johnson - Financial Analyst",
        actionDate: "Nov 14, 2025"
    },
    {
        module: "Revenue Analysis", title: "Revenue Variance Detected", date: "Nov 14, 2025", status: "Ignored", description: "Q3 revenue decreased by 12% compared to Q2 - requires analysis",
        fullModuleName: "Revenue Analysis Module",
        actionTitle: "Action Taken",
        actionNote: "Detailed variance analysis completed and presented to management",
        assignee: "Sarah Johnson - Financial Analyst",
        actionDate: "Nov 14, 2025"
    },
    {
        module: "Tax Compliance", title: "VAT Filing Deadline", date: "Nov 15, 2025", status: "Awaiting Action", description: "Q3 revenue decreased by 12% compared to Q2 - requires analysis",
        fullModuleName: "Revenue Analysis Module",
        actionTitle: "Action Taken",
        actionNote: "Detailed variance analysis completed and presented to management",
        assignee: "Sarah Johnson - Financial Analyst",
        actionDate: "Nov 14, 2025"
    },
    {
        module: "COGS Analysis", title: "COGS Variance", date: "Nov 10, 2025", status: "Completed", description: "Q3 revenue decreased by 12% compared to Q2 - requires analysis",
        fullModuleName: "Revenue Analysis Module",
        actionTitle: "Action Taken",
        actionNote: "Detailed variance analysis completed and presented to management",
        assignee: "Sarah Johnson - Financial Analyst",
        actionDate: "Nov 14, 2025"
    },
    {
        module: "Revenue Analysis", title: "Revenue Variance Detected", date: "Nov 14, 2025", status: "Completed", description: "Q3 revenue decreased by 12% compared to Q2 - requires analysis",
        fullModuleName: "Revenue Analysis Module",
        actionTitle: "Action Taken",
        actionNote: "Detailed variance analysis completed and presented to management",
        assignee: "Sarah Johnson - Financial Analyst",
        actionDate: "Nov 14, 2025"
    },
    {
        module: "COGS Analysis", title: "COGS Increase Alert", date: "Nov 14, 2025", status: "Awaiting Action", description: "Q3 revenue decreased by 12% compared to Q2 - requires analysis",
        fullModuleName: "Revenue Analysis Module",
        actionTitle: "Action Taken",
        actionNote: "Detailed variance analysis completed and presented to management",
        assignee: "Sarah Johnson - Financial Analyst",
        actionDate: "Nov 14, 2025"
    },
    {
        module: "Financial statement", title: "Monthly Statements Pending", date: "Nov 14, 2025", status: "Awaiting Action", description: "Q3 revenue decreased by 12% compared to Q2 - requires analysis",
        fullModuleName: "Revenue Analysis Module",
        actionTitle: "Action Taken",
        actionNote: "Detailed variance analysis completed and presented to management",
        assignee: "Sarah Johnson - Financial Analyst",
        actionDate: "Nov 14, 2025"
    }
])
const activeModal = ref(null); // stores 'details', 'resolve', 'delete', etc.
const selectedAlert = ref({});

const openModal = (type, data) => {
    selectedAlert.value = data;
    activeModal.value = type;
};

const closeModal = () => {
    activeModal.value = null;
    // selectedAlert.value = {}; // optional: clear data on close
};
const handleActionSubmit = (updatedData) => {
    console.log("Action recorded:", updatedData);
    // Here you would typically call your API to save the resolution
    closeModal();
}; const filteredData = computed(() => {
    const type = activeCategory.value
    if (type === 'all') return masterAlerts.value

    const typeMap = {
        pending: 'Awaiting Action',
        resolved: 'Completed',
        ignored: 'Ignored'
    }

    return masterAlerts.value.filter(item => item.status === typeMap[type])
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>