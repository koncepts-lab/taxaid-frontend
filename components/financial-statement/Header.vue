<template>
    <div class=" ">
        <div class="container mx-auto">
            <div class="flex items-center justify-between">
                <!-- Title Section -->
                <div>
                    <h1 class="text-2xl font-medium text-primary-450">Financial Statement Analysis</h1>
                    <p class="text-sm text-black/59 mt-1">Income, balance sheet, and financial ratios overview.</p>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center space-x-3">
                    <!-- Date Filter -->
                    <div class="relative">
                        <button @click="showDateDropdown = !showDateDropdown"
                            class="flex items-center space-x-2 px-4 py-2 bg-white border border-primary-100 text-gray-700 rounded-lg hover:bg-teal-50 transition-colors">
                            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span class="text-sm font-normal">{{ selectedPeriod }}</span>
                            <svg class="w-4 h-4 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <!-- Dropdown -->
                        <Transition name="dropdown">
                            <div v-if="showDateDropdown"
                                class="absolute right-0 mt-2  bg-white border border-primary-100 rounded-lg shadow-lg z-10 py-2 px-2">
                                <button v-for="period in periods" :key="period" @click="selectPeriod(period)"
                                    class="w-full text-left px-4 py-2 font-normal text-sm hover:bg-primary-700 rounded-lg "
                                    :class="{ 'bg-primary-700 text-black font-normal': selectedPeriod === period }">
                                    {{ period }}
                                </button>
                            </div>
                        </Transition>
                    </div>

                    <!-- Search Button -->
                    <button
                        class="p-2 bg-white border border-primary-100 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <img src="/images/icons/reload.svg" alt="Search Icon" class="w-5 h-5" />
                    </button>

                    <!-- Download Button -->
                    <button
                        class="p-2 bg-white border border-primary-100 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <img src="/images/icons/export.svg" alt="Export Icon" class="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const showDateDropdown = ref(false)
const selectedPeriod = ref('Year to Date')
const dashboardData = {
    'profit-loss': {
        title: 'Profit & Loss Summary',
        subtitle: 'Values in AED Million',
        rows: [
            { label: 'Revenue', schedule: '01', current: 4250000, previous: 3900000, budget: 5000000, variance: '+5.9%', progress: 75 },
            { label: 'COGS', schedule: '02', current: 2150000, previous: 2000000, budget: 2800000, variance: '+3.6%', progress: 65 },
            { label: 'Gross Profit', schedule: '', current: 2100000, previous: 1900000, budget: 2200000, variance: '+7.1%', progress: 10 },
            { label: 'Operating Expenses', schedule: '03', current: 950000, previous: 870000, budget: 1200000, variance: '+4.3%', progress: 25 },
            // ... rest of the data
        ]
    },
    // ...
}

const periods = [
    'Year to Date',
    'This Quarter',
    'Last Quarter',
    'This Year',
    'Last Year',
    'Custom Range'
]

const selectPeriod = (period) => {
    selectedPeriod.value = period
    showDateDropdown.value = false
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>