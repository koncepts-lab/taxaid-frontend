<template>
    <div class="content-area rounded-[20px] lg:p-8 p-4 transition-all duration-300"
        :class="isDark ? 'bg-[#015F4D]/20 border border-[#00B794]/30' : 'bg-white border border-gray-100 shadow-sm'">

        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
            <h2 class="text-lg font-normal transition-colors duration-300"
                :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">
                {{ currentLang === 'ar' ? 'تفاصيل مركز التكلفة / تقارير المشروع' :
                    'Cost Center Details / Project-wise Reports' }}
            </h2>

            <div class="flex bg-[#61FFD61A] p-1 rounded-xl border border-[#84D7C5]/30">
                <button v-for="mode in ['Hybrid', 'Direct']" :key="mode" @click="$emit('change-mode', mode)"
                    class="px-4 py-1.5 rounded-lg text-sm transition-all duration-300"
                    :class="activeMode === mode ? 'bg-[#00B794] text-white shadow-sm' : 'text-black/80 '">
                    {{ mode }}
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="card in reportCards" :key="card.id"
                class="flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 "
                :class="isDark ? 'bg-white/5 border-white/10 hover:border-[#00B794]' : 'bg-[#F3FDFA] border-[#04C18F80] hover:border-[#00B794] hover:shadow-md'">

                <div>
                    <h3 class="text-base font-medium mb-1" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">
                        {{ currentLang === 'ar' ? card.titleAr : card.title }}
                    </h3>
                    <p v-if="card.subtext" class="text-sm text-[#6A7282] font-normal">
                        {{ card.subtext }}
                    </p>
                </div>

                <button @click="$emit('open-report', card.id)"
                    class="flex items-center mt-3 justify-center gap-2 w-full py-3 bg-[#008169] hover:bg-[#006b56] text-white rounded-xl text-sm font-medium transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    {{ currentLang === 'ar' ? 'عرض تقرير مفصل' : 'View Detailed Report' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    isDark:      Boolean,
    currentLang: String,
    activeCount: { type: Number, default: null },
    // Persisted tenant data mode ('Hybrid' | 'Direct')
    activeMode:  { type: String, default: 'Hybrid' },
})

defineEmits(['open-report', 'change-mode'])

const reportCards = computed(() => [
    {
        id: 'mapping',
        title: 'Cost Center Mapping',
        titleAr: 'تخطيط مركز التكلفة',
        subtext: ''
    },
    {
        id: 'contract',
        title: 'Contract Master',
        titleAr: 'سجل العقود الرئيسي',
        subtext: props.activeCount !== null
            ? `Number of active projects - ${props.activeCount}`
            : 'Number of active projects - ...'
    },
    {
        id: 'budget',
        title: 'Budget Cost Center',
        titleAr: 'ميزانية مركز التكلفة',
        subtext: ''
    }
])
</script>