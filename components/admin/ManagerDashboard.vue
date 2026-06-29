<template>
    <div class="p-8 space-y-6">
        <!-- Main Navigation Tabs -->
        <div class="flex bg-white p-1.5 rounded-full shadow-sm w-fit border border-gray-100">
            <button v-for="tab in tabs" :key="tab.id" @click="setTab(tab.id)"
                class="px-12 py-1.5 rounded-full text-sm font-normal transition-all duration-300"
                :class="activeTab === tab.id ? 'bg-[#68FFD6] text-black shadow-sm' : 'text-black hover:text-gray-800'">
                {{ currentLang === 'ar' ? tab.labelAr : tab.label }}
            </button>
        </div>

        <div class="mt-8">
            <!-- Dynamic Title Section -->
            <h1 class="text-2xl font-semibold text-black mb-1">
                {{ currentLang === 'ar' ? currentTabConfig.titleAr : currentTabConfig.title }}
            </h1>
            <p class="text-sm text-[#717182] mb-8">
                {{ currentLang === 'ar' ? currentTabConfig.subAr : currentTabConfig.sub }}
            </p>

            <!-- Components -->
            <AdminGLCodeMaster v-if="activeTab === 'gl-master'" :isDark="isDark" :currentLang="currentLang" />

            <!-- Ensure this component is imported correctly -->
            <AdminImplementationPool v-else-if="activeTab === 'pool'" :isDark="isDark" :currentLang="currentLang" />

            <AdminConsultantWorkload v-else-if="activeTab === 'workload'" :isDark="isDark" :currentLang="currentLang" />

            <div v-else
                class="bg-white p-20 rounded-3xl border border-dashed border-gray-200 text-center text-gray-400">
                {{ activeTab }} Content Coming Soon
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ isDark: Boolean, currentLang: String })

const route  = useRoute()
const router = useRouter()
const validTabs = ['gl-master', 'pool', 'workload']
const activeTab = ref(validTabs.includes(route.query.tab) ? route.query.tab : 'gl-master')

function setTab(id) {
    activeTab.value = id
    router.replace({ query: { ...route.query, tab: id } })
}
const tabs = [
    { id: 'gl-master', label: 'GL Code Master', labelAr: 'سجل أكواد GL' },
    { id: 'pool', label: 'Implementation Pool', labelAr: 'مجموعة التنفيذ' },
    { id: 'workload', label: 'Consultant workload', labelAr: 'عبء عمل الاستشاري' },
]

const configs = {
    'gl-master': {
        title: 'GL Code Master', titleAr: 'سجل أكواد GL',
        sub: 'Manage Financial Statement Codes, Main Groups, and Subgroups',
        subAr: 'إدارة أكواد القوائم المالية والمجموعات الرئيسية والفرعية'
    },
    'pool': {
        title: 'Implementation Pool', titleAr: 'مجموعة التنفيذ',
        sub: 'Monitor and manage client implementation cycles',
        subAr: 'مراقبة وإدارة دورات تنفيذ العملاء'
    },
    'workload': {
        title: 'Consultant Workload', titleAr: 'عبء عمل الاستشاري',
        sub: 'Track project distribution across consultants',
        subAr: 'تتبع توزيع المشاريع عبر الاستشاريين'
    }
}

const currentTabConfig = computed(() => configs[activeTab.value])
</script>