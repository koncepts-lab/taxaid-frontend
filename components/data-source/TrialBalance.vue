<template>
    <div class=" space-y-6 ">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 class="text-lg font-normal text-black">
                        {{ currentLang === 'ar' ? 'تخطيط ميزان المراجعة' : 'Trial Balance Mapping' }}
                    </h2>
                    <p class="text-base text-[#717182] mt-1">
                        {{ currentLang === 'ar' ? 'أكواد القوائم المالية وتخطيطات حسابات الأستاذ' :
                            'Financial statement codes and ledger account mappings' }}
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <button v-if="userType === 'admin'"
                        class="px-8 py-2 bg-[#FFF085] hover:bg-[#FACC15] text-black rounded-xl font-normal transition-all active:scale-95 shadow-sm">
                        {{ currentLang === 'ar' ? 'تحديث' : 'Update' }}
                    </button>
                    <button @click="isReportModalOpen = true"
                        class="flex items-center gap-2 px-6 py-2 bg-[#68E4C4] hover:bg-[#34D399] text-[#064E3B] rounded-xl font-normal text-base transition-all active:scale-95 shadow-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                        {{ currentLang === 'ar' ? 'عرض تقرير مفصل' : 'View Detailed Report' }}
                    </button>
                </div>
            </div>

            <div v-if="userType === 'admin'"
                class="mx-6 mb-6 p-4 bg-[#FFFBEB] border border-[#FEF3C7] rounded-xl flex items-center gap-3">
                <div class="w-4 h-4 rounded-full border border-[#B45309] flex items-center justify-center shrink-0">
                    <span class="text-[#B45309] text-[10px] font-bold">!</span>
                </div>
                <p class="text-xs text-[#B45309]">
                    {{ currentLang === 'ar' ? 'قم بتحديث الحقول وانقر فوق تحديث لحفظ تخطيط ميزان المراجعة.' :
                        'Update the fields and click Update to save the trial balance mapping.' }}
                </p>
            </div>

            <div class="px-6 pb-6 overflow-x-auto">
                <table class="w-full text-left border-separate border-spacing-y-2">
                    <thead class="bg-[#00896F] text-white">
                        <tr>
                            <th class="px-4 py-3 rounded-tl-xl text-sm font-medium">{{ currentLang === 'ar' ? 'كود FS' :
                                'FS Code' }}</th>
                            <th class="px-4 py-3 text-sm font-medium">{{ currentLang === 'ar' ? 'المجموعة الرئيسية' :
                                'Main Group' }}</th>
                            <th class="px-4 py-3 font-medium">{{ currentLang === 'ar' ? 'المجموعة الفرعية' : 'Sub group'
                            }}</th>
                            <th class="px-4 py-3 rounded-tr-xl font-medium">{{ currentLang === 'ar' ? 'حساب الأستاذ' :
                                'Ledger' }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50 ">
                        <tr v-for="item in mappingData" :key="item.id"
                            class="group transition-colors border-b border-[#0000001A]">
                            <td class="p-2 border-b border-[#0000001A]">
                                <select v-if="userType === 'admin'" v-model="item.fsCode"
                                    class="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-[#00896F] outline-none appearance-none cursor-pointer text-[#717182]">
                                    <option v-for="opt in fsCodes" :key="opt" :value="opt">{{ opt }}</option>
                                </select>
                                <span v-else class="px-4 text-sm text-black">{{ item.fsCode }}</span>
                            </td>
                            <td class="p-2 border-b border-[#0000001A]">
                                <select v-if="userType === 'admin'" v-model="item.mainGroup"
                                    class="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-[#00896F] outline-none appearance-none cursor-pointer text-[#717182]">
                                    <option value="Assets">Assets</option>
                                    <option value="Liabilities">Liabilities</option>
                                </select>
                                <span v-else class="px-4 text-sm text-black">{{ item.mainGroup }}</span>
                            </td>
                            <td class="p-2 border-b border-[#0000001A]">
                                <select v-if="userType === 'admin'" v-model="item.subGroup"
                                    class="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-1 focus:ring-[#00896F] outline-none appearance-none cursor-pointer text-[#717182]">
                                    <option value="Current Assets">Current Assets</option>
                                    <option value="Fixed Assets">Fixed Assets</option>
                                </select>
                                <span v-else class="px-4 text-sm text-black">{{ item.subGroup }}</span>
                            </td>
                            <td class="p-2 text-sm text-black border-b border-[#0000001A]">
                                {{ item.ledger }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 2. Bottom Grid: Configuration and Integrity -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <!-- Configuration Details -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-normal text-gray-800">Configuration Details</h3>
                    <button v-if="userType === 'admin'"
                        class="flex items-center gap-2 px-4 py-1.5 border bg-[#FF91751A] border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-all">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        Lock Table
                    </button>
                </div>

                <div class="overflow-hidden">
                    <table class="w-full text-sm">
                        <thead class="bg-[#00896F] text-white">
                            <tr>
                                <th class="px-4 py-2.5 rounded-tl-lg text-left font-medium">Particulars</th>
                                <th class="px-4 py-2.5 text-left font-medium">From</th>
                                <th class="px-4 py-2.5 rounded-tr-lg text-left font-medium">To</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="(row, idx) in configData" :key="idx">
                                <td class="p-3  text-black">{{ row.label }}</td>
                                <td class="p-3  text-black">{{ row.from || '' }}</td>
                                <td class="p-3 text-black">
                                    <div v-if="row.isYear" class=" rounded text-start text-black">
                                        {{ row.to }}
                                    </div>
                                    <span v-else class="text-black">{{ row.to }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="userType === 'admin'"
                    class="mt-4 p-3 bg-[#FFFBEB] rounded-xl flex items-center gap-2 border border-[#FEF3C7]">
                    <span class="text-[#894B00] mt-0.5">ⓘ</span>
                    <p class="text-[11px] text-[#894B00]">
                        Implementation consultant must fill the historical data year and lock the table before
                        proceeding.
                    </p>
                </div>
            </div>

            <!-- Integrity Check -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-normal text-black">Integrity Check</h3>
                    <button v-if="userType === 'admin'"
                        class="px-6 py-1.5 border border-[#00B793CC] text-[#00896F] bg-[#86E4CB1A] rounded-lg text-sm font-medium hover:bg-[#F0FDFA] transition-all">
                        Run Check
                    </button>
                </div>

                <table class="w-full text-sm">
                    <thead class="bg-[#00896F] text-white">
                        <tr>
                            <th class="px-4 py-2.5 rounded-tl-lg text-left font-medium">Particulars</th>
                            <th class="px-4 py-2.5 text-center font-medium">Yes</th>
                            <th class="px-4 py-2.5 rounded-tr-lg text-center font-medium">No</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(check, idx) in integrityData" :key="idx"
                            :class="!check.isValid ? 'bg-red-50' : idx % 2 === 1 ? 'bg-[#F0FDFA]/50' : ''">
                            <td class="p-3 text-sm text-black">{{ check.label }}</td>
                            <td class="p-3 text-sm text-center">
                                <span v-if="check.isValid" class="text-green-500 text-lg font-bold"><svg width="15"
                                        height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3.15852 15.4C3.15852 15.2267 3.12518 15.14 3.05852 15.14L2.59852 15.36C2.59852 15.2667 2.54518 15.2 2.43852 15.16L2.27852 15.14C2.17185 15.14 2.03852 15.1867 1.87852 15.28C1.85185 15.2134 1.81852 15.1467 1.77852 15.08C1.73852 15.0134 1.70518 14.9534 1.67852 14.9C1.50518 14.5667 1.33185 14.2 1.15852 13.8C0.998516 13.3867 0.845182 12.9934 0.698516 12.62C0.565182 12.2467 0.458516 11.9534 0.378516 11.74C0.325182 11.5667 0.265182 11.3067 0.198516 10.96C0.131849 10.6134 0.0651823 10.1734 -0.00148432 9.64002C0.145182 9.73335 0.258516 9.78002 0.338516 9.78002C0.431849 9.78002 0.518516 9.64002 0.598516 9.36002C0.638516 9.41335 0.711849 9.44002 0.818516 9.44002C0.898516 9.44002 0.958516 9.41335 0.998516 9.36002L1.31852 8.88002L1.67852 9.00002H1.69852C1.72518 9.00002 1.75185 8.98669 1.77852 8.96002C1.80518 8.93335 1.84518 8.90669 1.89852 8.88002C2.00518 8.81335 2.08518 8.78002 2.13852 8.78002L2.19852 8.80002C2.53185 8.96002 2.74518 9.25335 2.83852 9.68002C3.07852 10.6934 3.31852 11.2 3.55852 11.2C3.79852 11.2 4.07852 10.9467 4.39852 10.44C4.55852 10.1867 4.71852 9.89335 4.87852 9.56002C5.05185 9.22669 5.22518 8.85335 5.39852 8.44002C5.42518 8.60002 5.45185 8.68002 5.47852 8.68002C5.54518 8.68002 5.65852 8.51335 5.81852 8.18002C5.99185 7.84669 6.26518 7.38669 6.63852 6.80002C6.85185 6.44002 7.11852 6.03335 7.43852 5.58002C7.77185 5.12669 8.12518 4.66002 8.49852 4.18002C8.87185 3.70002 9.23185 3.24669 9.57852 2.82002C9.93852 2.39335 10.2585 2.02669 10.5385 1.72002C10.8185 1.41335 11.0252 1.21335 11.1585 1.12002C11.6652 0.773352 12.0652 0.440019 12.3585 0.120019C12.3452 0.213352 12.3252 0.300019 12.2985 0.380019C12.2852 0.446686 12.2785 0.493352 12.2785 0.520019C12.2785 0.573352 12.3052 0.600019 12.3585 0.600019L12.9185 0.320019V0.400019C12.9185 0.506686 12.9452 0.560019 12.9985 0.560019C13.0385 0.560019 13.1185 0.500019 13.2385 0.380019C13.3585 0.260019 13.4252 0.173352 13.4385 0.120019L13.3985 0.400019L14.0785 1.93119e-05L13.9185 0.360019C14.1318 0.213352 14.2852 0.140019 14.3785 0.140019C14.4318 0.140019 14.4718 0.173352 14.4985 0.240019C14.5252 0.293352 14.5385 0.346685 14.5385 0.400019C14.5385 0.480019 14.5052 0.573352 14.4385 0.680019C14.3718 0.786686 14.2852 0.913352 14.1785 1.06002C14.0985 1.16669 13.9652 1.32669 13.7785 1.54002C13.6052 1.74002 13.3385 2.04002 12.9785 2.44002C12.6185 2.82669 12.1385 3.36669 11.5385 4.06002C11.3785 4.23335 11.1318 4.54002 10.7985 4.98002C10.4652 5.40669 10.0852 5.90669 9.65852 6.48002C9.24518 7.04002 8.83185 7.60669 8.41852 8.18002C8.00518 8.75335 7.63852 9.27335 7.31852 9.74002C6.99852 10.1934 6.77185 10.5334 6.63852 10.76L5.39852 12.86C5.13185 13.3134 4.91185 13.6867 4.73852 13.98C4.56518 14.26 4.43185 14.4534 4.33852 14.56C4.13852 14.8 3.91852 15.0134 3.67852 15.2L3.49852 15.1L3.33852 15.2L3.15852 15.4Z"
                                            fill="currentColor" />
                                    </svg>
                                </span>
                            </td>
                            <td class="p-3 text-sm text-center">
                                <span v-if="!check.isValid" class="text-red-500 text-lg font-bold"><svg width="15"
                                        height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3.15852 15.4C3.15852 15.2267 3.12518 15.14 3.05852 15.14L2.59852 15.36C2.59852 15.2667 2.54518 15.2 2.43852 15.16L2.27852 15.14C2.17185 15.14 2.03852 15.1867 1.87852 15.28C1.85185 15.2134 1.81852 15.1467 1.77852 15.08C1.73852 15.0134 1.70518 14.9534 1.67852 14.9C1.50518 14.5667 1.33185 14.2 1.15852 13.8C0.998516 13.3867 0.845182 12.9934 0.698516 12.62C0.565182 12.2467 0.458516 11.9534 0.378516 11.74C0.325182 11.5667 0.265182 11.3067 0.198516 10.96C0.131849 10.6134 0.0651823 10.1734 -0.00148432 9.64002C0.145182 9.73335 0.258516 9.78002 0.338516 9.78002C0.431849 9.78002 0.518516 9.64002 0.598516 9.36002C0.638516 9.41335 0.711849 9.44002 0.818516 9.44002C0.898516 9.44002 0.958516 9.41335 0.998516 9.36002L1.31852 8.88002L1.67852 9.00002H1.69852C1.72518 9.00002 1.75185 8.98669 1.77852 8.96002C1.80518 8.93335 1.84518 8.90669 1.89852 8.88002C2.00518 8.81335 2.08518 8.78002 2.13852 8.78002L2.19852 8.80002C2.53185 8.96002 2.74518 9.25335 2.83852 9.68002C3.07852 10.6934 3.31852 11.2 3.55852 11.2C3.79852 11.2 4.07852 10.9467 4.39852 10.44C4.55852 10.1867 4.71852 9.89335 4.87852 9.56002C5.05185 9.22669 5.22518 8.85335 5.39852 8.44002C5.42518 8.60002 5.45185 8.68002 5.47852 8.68002C5.54518 8.68002 5.65852 8.51335 5.81852 8.18002C5.99185 7.84669 6.26518 7.38669 6.63852 6.80002C6.85185 6.44002 7.11852 6.03335 7.43852 5.58002C7.77185 5.12669 8.12518 4.66002 8.49852 4.18002C8.87185 3.70002 9.23185 3.24669 9.57852 2.82002C9.93852 2.39335 10.2585 2.02669 10.5385 1.72002C10.8185 1.41335 11.0252 1.21335 11.1585 1.12002C11.6652 0.773352 12.0652 0.440019 12.3585 0.120019C12.3452 0.213352 12.3252 0.300019 12.2985 0.380019C12.2852 0.446686 12.2785 0.493352 12.2785 0.520019C12.2785 0.573352 12.3052 0.600019 12.3585 0.600019L12.9185 0.320019V0.400019C12.9185 0.506686 12.9452 0.560019 12.9985 0.560019C13.0385 0.560019 13.1185 0.500019 13.2385 0.380019C13.3585 0.260019 13.4252 0.173352 13.4385 0.120019L13.3985 0.400019L14.0785 1.93119e-05L13.9185 0.360019C14.1318 0.213352 14.2852 0.140019 14.3785 0.140019C14.4318 0.140019 14.4718 0.173352 14.4985 0.240019C14.5252 0.293352 14.5385 0.346685 14.5385 0.400019C14.5385 0.480019 14.5052 0.573352 14.4385 0.680019C14.3718 0.786686 14.2852 0.913352 14.1785 1.06002C14.0985 1.16669 13.9652 1.32669 13.7785 1.54002C13.6052 1.74002 13.3385 2.04002 12.9785 2.44002C12.6185 2.82669 12.1385 3.36669 11.5385 4.06002C11.3785 4.23335 11.1318 4.54002 10.7985 4.98002C10.4652 5.40669 10.0852 5.90669 9.65852 6.48002C9.24518 7.04002 8.83185 7.60669 8.41852 8.18002C8.00518 8.75335 7.63852 9.27335 7.31852 9.74002C6.99852 10.1934 6.77185 10.5334 6.63852 10.76L5.39852 12.86C5.13185 13.3134 4.91185 13.6867 4.73852 13.98C4.56518 14.26 4.43185 14.4534 4.33852 14.56C4.13852 14.8 3.91852 15.0134 3.67852 15.2L3.49852 15.1L3.33852 15.2L3.15852 15.4Z"
                                            fill="currentColor" />
                                    </svg>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="mt-6 flex items-center gap-6 text-xs font-medium">
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 rounded bg-green-500"></div>
                        <span class="text-[#4A5565] text-sm">Valid</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-4 h-4 rounded bg-red-500"></div>
                        <span class="text-[#4A5565] text-sm">Error detected</span>
                    </div>
                </div>
            </div>

        </div>
        <Transition name="fade">
            <div v-if="isReportModalOpen"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div class="bg-white rounded-2xl w-full max-w-7xl shadow-2xl flex flex-col relative p-8">

                    <button @click="isReportModalOpen = false"
                        class="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <h3 class="text-2xl font-semibold text-gray-900 mb-8 px-2">
                        {{ currentLang === 'ar' ? 'ميزان المراجعة - تقرير مفصل' : 'Trial Balance - Detailed Report' }}
                    </h3>

                    <div class="overflow-hidden border border-gray-100 rounded-2xl">
                        <table class="w-full border-separate border-spacing-0">
                            <thead class="bg-[#00896F] text-white">
                                <tr>
                                    <th class="px-6 py-4 text-left text-sm font-semibold first:rounded-tl-xl">FS Code
                                    </th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold">Main Group</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold">Sub group</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold last:rounded-tr-xl">Ledger
                                        Account</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white">
                                <tr v-for="(item, idx) in reportData" :key="idx"
                                    class="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                                    <td class="px-6 py-4 text-sm text-gray-900 font-medium border-b border-gray-100">{{
                                        item.fsCode }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-600 border-b border-gray-100">{{
                                        item.mainGroup }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-600 border-b border-gray-100">{{
                                        item.subGroup }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-700 border-b border-gray-100">{{ item.ledger
                                        }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    userType: {
        type: String,
        default: 'admin'
    },
    currentLang: {
        type: String,
        default: 'en'
    }
})

const isReportModalOpen = ref(false)
const fsCodes = ['1000', '1100', '1500', '1550', '2000']
const reportData = ref([
    { fsCode: '1000', mainGroup: 'Assets', subGroup: 'Current Assets', ledger: 'Cash and Bank' },
    { fsCode: '1100', mainGroup: 'Assets', subGroup: 'Current Assets', ledger: 'Accounts Receivable' },
    { fsCode: '1150', mainGroup: 'Assets', subGroup: 'Current Assets', ledger: 'Inventory' },
    { fsCode: '1200', mainGroup: 'Assets', subGroup: 'Current Assets', ledger: 'Prepaid Expenses' },
    { fsCode: '1500', mainGroup: 'Assets', subGroup: 'Fixed Assets', ledger: 'Property & Equipment' },
    { fsCode: '1550', mainGroup: 'Assets', subGroup: 'Fixed Assets', ledger: 'Accumulated Depreciation' },
    { fsCode: '2000', mainGroup: 'Liabilities', subGroup: 'Current Liabilities', ledger: 'Accounts Payable' },
    { fsCode: '2100', mainGroup: 'Liabilities', subGroup: 'Current Liabilities', ledger: 'VAT Payable' },
    { fsCode: '2200', mainGroup: 'Liabilities', subGroup: 'Long-term Liabilities', ledger: 'Bank Loan' },
    { fsCode: '3000', mainGroup: 'Equity', subGroup: 'Share Capital', ledger: 'Common Stock' },
    { fsCode: '3100', mainGroup: 'Equity', subGroup: 'Retained Earnings', ledger: 'Retained Earnings' },
    { fsCode: '4000', mainGroup: 'Revenue', subGroup: 'Sales', ledger: 'Service Revenue' },
])
const mappingData = ref([
    { id: 1, fsCode: '1000', mainGroup: 'Assets', subGroup: 'Current Assets', ledger: 'Cash and Bank' },
    { id: 2, fsCode: '1100', mainGroup: 'Assets', subGroup: 'Current Assets', ledger: 'Accounts Receivable' },
    { id: 3, fsCode: '1500', mainGroup: 'Assets', subGroup: 'Fixed Assets', ledger: 'Property & Equipment' },
    { id: 4, fsCode: '1550', mainGroup: 'Assets', subGroup: 'Fixed Assets', ledger: 'Accumulated Depreciation' },
])

// Mock Data for Config
const configData = ref([
    { label: 'Financial Year', from: '01-Jan-2025', to: '31-Dec-2025' },
    { label: 'VAT return (first quarter)', from: '01-Jan-2025', to: '31-Mar-2025' },
    { label: 'CT Due date', from: null, to: '30-Jun-2025' },
    { label: 'Go live date (as on)', from: null, to: '01-Jan-2025' },
    { label: 'Historical data since', from: null, to: '2022', isYear: true },
])

// Mock Data for Integrity
const integrityData = ref([
    { label: 'Trial balance', isValid: true },
    { label: 'Balance Sheet', isValid: true },
    { label: 'Profit and loss', isValid: false },
])
</script>

<style scoped>
/* Optional: Customizing select scrollbars or dropdown icons */
select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
}
</style>