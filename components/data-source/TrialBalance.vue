<template>
    <div class="space-y-6">
        <div ref="cardRef" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                    <button v-if="userType === 'admin'" @click="handleUpdate" :disabled="tbSaving"
                        class="px-8 py-2 bg-[#FFF085] hover:bg-[#FACC15] text-black rounded-xl font-normal transition-all active:scale-95 shadow-sm disabled:opacity-50">
                        {{ tbSaving ? '...' : (currentLang === 'ar' ? 'تحديث' : 'Update') }}
                    </button>
                    <button @click="isReportModalOpen = true"
                        class="flex items-center gap-2 px-6 py-2 bg-[#68E4C4] hover:bg-[#34D399] text-[#064E3B] rounded-xl font-normal text-base transition-all active:scale-95 shadow-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                        {{ currentLang === 'ar' ? 'عرض تقرير مفصل' : 'View Detailed Report' }}
                    </button>
                </div>
            </div>

            <div v-if="userType === 'admin'"
                class="mx-6 mb-4 p-4 bg-[#FFFBEB] border border-[#FEF3C7] rounded-xl flex items-center gap-3">
                <div class="w-4 h-4 rounded-full border border-[#B45309] flex items-center justify-center shrink-0">
                    <span class="text-[#B45309] text-[10px] font-bold">!</span>
                </div>
                <p class="text-xs text-[#B45309]">
                    {{ currentLang === 'ar' ? 'قم بتحديث الحقول وانقر فوق تحديث لحفظ تخطيط ميزان المراجعة.' :
                        'Update the fields and click Update to save the trial balance mapping.' }}
                </p>
            </div>

            <!-- FS Code Present / Missing badges -->
            <div class="px-6 pb-3 flex items-center gap-3">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border border-[#22C55E] bg-white text-[#166534]">
                    <span class="w-2 h-2 rounded-full bg-[#22C55E] inline-block flex-shrink-0"></span>
                    {{ currentLang === 'ar' ? 'تم التخطيط' : 'Mapped' }}: {{ tbMeta.mapped_count }}
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border border-[#EF4444] bg-white text-[#991B1B]">
                    <span class="w-2 h-2 rounded-full bg-[#830b0b] inline-block flex-shrink-0"></span>
                    {{ currentLang === 'ar' ? 'غير مخطط' : 'Not Mapped' }}: {{ tbMeta.unmapped_count }}
                </span>
            </div>

            <div class="px-6 pb-0 overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-[#00896F] text-white">
                        <tr>
                            <th class="px-4 py-3 rounded-tl-xl text-sm font-medium">{{ currentLang === 'ar' ? 'كود FS' : 'FS Code' }}</th>
                            <th class="px-4 py-3 text-sm font-medium">{{ currentLang === 'ar' ? 'المجموعة الرئيسية' : 'Main Group' }}</th>
                            <th class="px-4 py-3 font-medium">{{ currentLang === 'ar' ? 'المجموعة الفرعية' : 'Sub group' }}</th>
                            <th class="px-4 py-3 rounded-tr-xl font-medium">{{ currentLang === 'ar' ? 'حساب الأستاذ' : 'Ledger' }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="tbLoading">
                            <tr v-for="i in localPerPage" :key="'skeleton-'+i" class="animate-pulse border-b border-gray-50 last:border-0">
                                <td class="p-2"><div class="h-[42px] bg-gray-100 rounded-lg w-full"></div></td>
                                <td class="p-2"><div class="h-[42px] bg-gray-100 rounded-lg w-full"></div></td>
                                <td class="p-2"><div class="h-[42px] bg-gray-100 rounded-lg w-full"></div></td>
                                <td class="p-2"><div class="h-5 bg-gray-100 rounded w-3/4 ml-2"></div></td>
                            </tr>
                        </template>
                        <template v-else-if="mappingData.length === 0">
                            <tr>
                                <td colspan="4" class="text-center py-10 text-gray-400 text-sm">
                                    {{ currentLang === 'ar' ? 'لا توجد بيانات' : 'No data available' }}
                                </td>
                            </tr>
                        </template>
                        <template v-else><!--tb color red-->
                            <tr v-for="item in mappingData" :key="item.id"
                                :class="item.fsCode && item.mainGroup && item.subGroup ? 'bg-[#d6ffe2]' : 'bg-[#ffdbe0]'">
                                <td class="p-2">
                                    <CommonSelectDropdown v-if="userType === 'admin'" v-model="item.fsCode"
                                        :options="fsCodes" :highlights="HIGHLIGHT_FS_CODES" />
                                    <span v-else class="px-4 text-sm text-black flex items-center gap-1.5">
                                        <span v-if="isHighlighted('fs', item.fsCode)" class="w-2.5 h-2.5 rounded-full bg-[#04C18F] inline-block shrink-0"></span>
                                        {{ item.fsCode || '—' }}
                                    </span>
                                </td>
                                <td class="p-2">
                                    <CommonSelectDropdown v-if="userType === 'admin'" v-model="item.mainGroup" searchable
                                        :options="mainGroups" :highlights="HIGHLIGHT_MAIN_GROUPS" />
                                    <span v-else class="px-4 text-sm text-black flex items-center gap-1.5">
                                        <span v-if="isHighlighted('main', item.mainGroup)" class="w-2.5 h-2.5 rounded-full bg-[#04C18F] inline-block shrink-0"></span>
                                        {{ item.mainGroup || '—' }}
                                    </span>
                                </td>
                                <td class="p-2">
                                    <CommonSelectDropdown v-if="userType === 'admin'" v-model="item.subGroup" searchable
                                        :options="subGroups" :highlights="HIGHLIGHT_SUB_GROUPS" />
                                    <span v-else class="px-4 text-sm text-black flex items-center gap-1.5">
                                        <span v-if="isHighlighted('sub', item.subGroup)" class="w-2.5 h-2.5 rounded-full bg-[#04C18F] inline-block shrink-0"></span>
                                        {{ item.subGroup || '—' }}
                                    </span>
                                </td>
                                <td class="p-2 text-sm text-black">{{ item.ledger }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <!-- Pagination footer -->
            <div class="px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 mt-2">
                <span class="text-sm text-gray-500">
                    {{ currentLang === 'ar'
                        ? `عرض ${pageStart}–${pageEnd} من ${tbMeta.total} نتيجة`
                        : `Showing ${pageStart}–${pageEnd} of ${tbMeta.total} results`
                    }}
                </span>

                <div class="flex items-center gap-1.5">
                    <button @click="goToPage(tbMeta.current_page - 1)"
                        :disabled="tbMeta.current_page <= 1 || tbLoading"
                        class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                        {{ currentLang === 'ar' ? 'السابق' : 'Previous' }}
                    </button>

                    <template v-for="p in visiblePages" :key="p">
                        <span v-if="p === '...'"
                            class="w-8 h-8 flex items-center justify-center text-sm text-gray-400 select-none">
                            &hellip;
                        </span>
                        <button v-else
                            @click="goToPage(p)"
                            :class="p === tbMeta.current_page
                                ? 'bg-[#00896F] text-white border-[#00896F]'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'"
                            class="w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-medium transition-all">
                            {{ p }}
                        </button>
                    </template>

                    <button @click="goToPage(tbMeta.current_page + 1)"
                        :disabled="tbMeta.current_page >= tbMeta.last_page || tbLoading"
                        class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                        {{ currentLang === 'ar' ? 'التالي' : 'Next' }}
                    </button>

                    <span class="ml-3 text-sm text-gray-500 whitespace-nowrap">
                        {{ currentLang === 'ar' ? 'صفوف لكل صفحة:' : 'Rows per page:' }}
                    </span>
                    <select v-model="localPerPage" @change="handlePerPageChange"
                        class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white text-gray-700 focus:ring-1 focus:ring-[#00896F] outline-none appearance-none">
                        <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- 2. Bottom Grid: Configuration and Integrity -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-normal text-gray-800">Configuration Details</h3>
                    <div v-if="userType === 'admin'" class="flex items-center gap-2">
                        <button v-if="!configLocked" @click="handleSaveConfig" :disabled="configSaving"
                            class="px-6 py-1.5 bg-[#FFF085] hover:bg-[#FACC15] text-black rounded-lg text-sm font-medium transition-all active:scale-95 disabled:opacity-50">
                            {{ configSaving ? '...' : 'Save' }}
                        </button>
                        <!-- Saving locks the table backend-side; Lock Table = save & lock.
                             When locked, the same slot becomes Unlock (POST /configuration-settings/unlock). -->
                        <button v-if="!configLocked" @click="handleSaveConfig" :disabled="configSaving"
                            class="flex items-center gap-2 px-4 py-1.5 border bg-[#FF91751A] border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-all disabled:opacity-50">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                            Lock Table
                        </button>
                        <button v-else @click="handleUnlockConfig" :disabled="configSaving"
                            class="flex items-center gap-2 px-4 py-1.5 border bg-[#F0FDFA] border-[#00B793CC] text-[#00896F] rounded-lg text-sm font-medium hover:bg-[#E6FFFA] transition-all disabled:opacity-50">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 019.9-1" />
                            </svg>
                            {{ configSaving ? '...' : 'Unlock Table' }}
                        </button>
                    </div>
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
                            <tr v-for="(row, idx) in localConfigData" :key="idx">
                                <td class="p-3 text-black text-sm">{{ row.label }}</td>
                                <td class="p-3">
                                    <div v-if="userType === 'admin' && !configLocked && !row.noFrom" class="relative">
                                        <button :ref="el => setButtonRef(el, `${idx}-from`)" @click.stop="toggleCalendar(`${idx}-from`)"
                                            class="w-full flex items-center justify-between gap-2 px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 hover:bg-gray-100 transition-all">
                                            <span :class="row.from ? 'text-black' : 'text-gray-400'">
                                                {{ row.from ? displayDate(row.from) : 'Select date' }}
                                            </span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400 shrink-0">
                                                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <span v-else class="text-black text-sm">{{ displayDate(row.from) || '' }}</span>
                                </td>
                                <td class="p-3">
                                    <input v-if="userType === 'admin' && !configLocked && row.isYear"
                                        :value="row.to"
                                        @input="row.to = String($event.target.value)"
                                        type="number" min="2000" max="2099" placeholder="e.g. 2022"
                                        class="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm text-black focus:ring-1 focus:ring-[#00896F] outline-none bg-gray-50 placeholder-gray-400" />
                                    <div v-else-if="userType === 'admin' && !configLocked" class="relative">
                                        <button :ref="el => setButtonRef(el, `${idx}-to`)" @click.stop="toggleCalendar(`${idx}-to`)"
                                            class="w-full flex items-center justify-between gap-2 px-2 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 hover:bg-gray-100 transition-all">
                                            <span :class="row.to ? 'text-black' : 'text-gray-400'">
                                                {{ row.to ? displayDate(row.to) : 'Select date' }}
                                            </span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400 shrink-0">
                                                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <span v-else class="text-black text-sm">{{ displayDate(row.to) || row.to || '' }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="userType === 'admin'"
                    class="mt-4 p-3 bg-[#FFFBEB] rounded-xl flex items-center gap-2 border border-[#FEF3C7]">
                    <span class="text-[#894B00] mt-0.5">ⓘ</span>
                    <p class="text-[11px] text-[#894B00]">
                        {{ configLocked
                            ? 'Table is locked. Click Unlock Table to make changes.'
                            : 'Implementation consultant must fill the historical data year and lock the table before proceeding.' }}
                    </p>
                </div>
            </div>

            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-normal text-black">Integrity Check</h3>
                    <button v-if="userType === 'admin'" @click="handleRunCheck" :disabled="integrityLoading"
                        class="px-6 py-1.5 border border-[#00B793CC] text-[#00896F] bg-[#86E4CB1A] rounded-lg text-sm font-medium hover:bg-[#F0FDFA] transition-all disabled:opacity-50">
                        {{ integrityLoading ? 'Checking...' : 'Run Check' }}
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
                        <tr v-for="(check, idx) in integrityRows" :key="idx"
                            :class="check.isValid === false ? 'bg-red-50' : idx % 2 === 1 ? 'bg-[#F0FDFA]/50' : ''">
                            <td class="p-3 text-sm text-black">{{ check.label }}</td>
                            <td class="p-3 text-sm text-center">
                                <span v-if="check.isValid === true" class="text-green-500"><svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.15852 15.4C3.15852 15.2267 3.12518 15.14 3.05852 15.14L2.59852 15.36C2.59852 15.2667 2.54518 15.2 2.43852 15.16L2.27852 15.14C2.17185 15.14 2.03852 15.1867 1.87852 15.28C1.85185 15.2134 1.81852 15.1467 1.77852 15.08C1.73852 15.0134 1.70518 14.9534 1.67852 14.9C1.50518 14.5667 1.33185 14.2 1.15852 13.8C0.998516 13.3867 0.845182 12.9934 0.698516 12.62C0.565182 12.2467 0.458516 11.9534 0.378516 11.74C0.325182 11.5667 0.265182 11.3067 0.198516 10.96C0.131849 10.6134 0.0651823 10.1734 -0.00148432 9.64002C0.145182 9.73335 0.258516 9.78002 0.338516 9.78002C0.431849 9.78002 0.518516 9.64002 0.598516 9.36002C0.638516 9.41335 0.711849 9.44002 0.818516 9.44002C0.898516 9.44002 0.958516 9.41335 0.998516 9.36002L1.31852 8.88002L1.67852 9.00002H1.69852C1.72518 9.00002 1.75185 8.98669 1.77852 8.96002C1.80518 8.93335 1.84518 8.90669 1.89852 8.88002C2.00518 8.81335 2.08518 8.78002 2.13852 8.78002L2.19852 8.80002C2.53185 8.96002 2.74518 9.25335 2.83852 9.68002C3.07852 10.6934 3.31852 11.2 3.55852 11.2C3.79852 11.2 4.07852 10.9467 4.39852 10.44C4.55852 10.1867 4.71852 9.89335 4.87852 9.56002C5.05185 9.22669 5.22518 8.85335 5.39852 8.44002C5.42518 8.60002 5.45185 8.68002 5.47852 8.68002C5.54518 8.68002 5.65852 8.51335 5.81852 8.18002C5.99185 7.84669 6.26518 7.38669 6.63852 6.80002C6.85185 6.44002 7.11852 6.03335 7.43852 5.58002C7.77185 5.12669 8.12518 4.66002 8.49852 4.18002C8.87185 3.70002 9.23185 3.24669 9.57852 2.82002C9.93852 2.39335 10.2585 2.02669 10.5385 1.72002C10.8185 1.41335 11.0252 1.21335 11.1585 1.12002C11.6652 0.773352 12.0652 0.440019 12.3585 0.120019C12.3452 0.213352 12.3252 0.300019 12.2985 0.380019C12.2852 0.446686 12.2785 0.493352 12.2785 0.520019C12.2785 0.573352 12.3052 0.600019 12.3585 0.600019L12.9185 0.320019V0.400019C12.9185 0.506686 12.9452 0.560019 12.9985 0.560019C13.0385 0.560019 13.1185 0.500019 13.2385 0.380019C13.3585 0.260019 13.4252 0.173352 13.4385 0.120019L13.3985 0.400019L14.0785 1.93119e-05L13.9185 0.360019C14.1318 0.213352 14.2852 0.140019 14.3785 0.140019C14.4318 0.140019 14.4718 0.173352 14.4985 0.240019C14.5252 0.293352 14.5385 0.346685 14.5385 0.400019C14.5385 0.480019 14.5052 0.573352 14.4385 0.680019C14.3718 0.786686 14.2852 0.913352 14.1785 1.06002C14.0985 1.16669 13.9652 1.32669 13.7785 1.54002C13.6052 1.74002 13.3385 2.04002 12.9785 2.44002C12.6185 2.82669 12.1385 3.36669 11.5385 4.06002C11.3785 4.23335 11.1318 4.54002 10.7985 4.98002C10.4652 5.40669 10.0852 5.90669 9.65852 6.48002C9.24518 7.04002 8.83185 7.60669 8.41852 8.18002C8.00518 8.75335 7.63852 9.27335 7.31852 9.74002C6.99852 10.1934 6.77185 10.5334 6.63852 10.76L5.39852 12.86C5.13185 13.3134 4.91185 13.6867 4.73852 13.98C4.56518 14.26 4.43185 14.4534 4.33852 14.56C4.13852 14.8 3.91852 15.0134 3.67852 15.2L3.49852 15.1L3.33852 15.2L3.15852 15.4Z" fill="currentColor"/></svg></span>
                            </td>
                            <td class="p-3 text-sm text-center">
                                <span v-if="check.isValid === false" class="text-red-500"><svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.15852 15.4C3.15852 15.2267 3.12518 15.14 3.05852 15.14L2.59852 15.36C2.59852 15.2667 2.54518 15.2 2.43852 15.16L2.27852 15.14C2.17185 15.14 2.03852 15.1867 1.87852 15.28C1.85185 15.2134 1.81852 15.1467 1.77852 15.08C1.73852 15.0134 1.70518 14.9534 1.67852 14.9C1.50518 14.5667 1.33185 14.2 1.15852 13.8C0.998516 13.3867 0.845182 12.9934 0.698516 12.62C0.565182 12.2467 0.458516 11.9534 0.378516 11.74C0.325182 11.5667 0.265182 11.3067 0.198516 10.96C0.131849 10.6134 0.0651823 10.1734 -0.00148432 9.64002C0.145182 9.73335 0.258516 9.78002 0.338516 9.78002C0.431849 9.78002 0.518516 9.64002 0.598516 9.36002C0.638516 9.41335 0.711849 9.44002 0.818516 9.44002C0.898516 9.44002 0.958516 9.41335 0.998516 9.36002L1.31852 8.88002L1.67852 9.00002H1.69852C1.72518 9.00002 1.75185 8.98669 1.77852 8.96002C1.80518 8.93335 1.84518 8.90669 1.89852 8.88002C2.00518 8.81335 2.08518 8.78002 2.13852 8.78002L2.19852 8.80002C2.53185 8.96002 2.74518 9.25335 2.83852 9.68002C3.07852 10.6934 3.31852 11.2 3.55852 11.2C3.79852 11.2 4.07852 10.9467 4.39852 10.44C4.55852 10.1867 4.71852 9.89335 4.87852 9.56002C5.05185 9.22669 5.22518 8.85335 5.39852 8.44002C5.42518 8.60002 5.45185 8.68002 5.47852 8.68002C5.54518 8.68002 5.65852 8.51335 5.81852 8.18002C5.99185 7.84669 6.26518 7.38669 6.63852 6.80002C6.85185 6.44002 7.11852 6.03335 7.43852 5.58002C7.77185 5.12669 8.12518 4.66002 8.49852 4.18002C8.87185 3.70002 9.23185 3.24669 9.57852 2.82002C9.93852 2.39335 10.2585 2.02669 10.5385 1.72002C10.8185 1.41335 11.0252 1.21335 11.1585 1.12002C11.6652 0.773352 12.0652 0.440019 12.3585 0.120019C12.3452 0.213352 12.3252 0.300019 12.2985 0.380019C12.2852 0.446686 12.2785 0.493352 12.2785 0.520019C12.2785 0.573352 12.3052 0.600019 12.3585 0.600019L12.9185 0.320019V0.400019C12.9185 0.506686 12.9452 0.560019 12.9985 0.560019C13.0385 0.560019 13.1185 0.500019 13.2385 0.380019C13.3585 0.260019 13.4252 0.173352 13.4385 0.120019L13.3985 0.400019L14.0785 1.93119e-05L13.9185 0.360019C14.1318 0.213352 14.2852 0.140019 14.3785 0.140019C14.4318 0.140019 14.4718 0.173352 14.4985 0.240019C14.5252 0.293352 14.5385 0.346685 14.5385 0.400019C14.5385 0.480019 14.5052 0.573352 14.4385 0.680019C14.3718 0.786686 14.2852 0.913352 14.1785 1.06002C14.0985 1.16669 13.9652 1.32669 13.7785 1.54002C13.6052 1.74002 13.3385 2.04002 12.9785 2.44002C12.6185 2.82669 12.1385 3.36669 11.5385 4.06002C11.3785 4.23335 11.1318 4.54002 10.7985 4.98002C10.4652 5.40669 10.0852 5.90669 9.65852 6.48002C9.24518 7.04002 8.83185 7.60669 8.41852 8.18002C8.00518 8.75335 7.63852 9.27335 7.31852 9.74002C6.99852 10.1934 6.77185 10.5334 6.63852 10.76L5.39852 12.86C5.13185 13.3134 4.91185 13.6867 4.73852 13.98C4.56518 14.26 4.43185 14.4534 4.33852 14.56C4.13852 14.8 3.91852 15.0134 3.67852 15.2L3.49852 15.1L3.33852 15.2L3.15852 15.4Z" fill="currentColor"/></svg></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="mt-6 flex items-center gap-6">
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

        <!-- Data Integrity Error Modal -->
        <Transition name="fade">
            <div v-if="isIntegrityModalOpen"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative p-8">
                    <button @click="isIntegrityModalOpen = false"
                        class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <h3 class="text-xl font-bold text-red-600 mb-4">Data Integrity Error Detected</h3>

                    <p class="text-sm text-gray-700 mb-4">
                        Errors have been detected in the following year(s) of historical data:
                    </p>

                    <div v-for="issue in integrityIssues" :key="issue.year"
                        class="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-500 shrink-0">
                            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                        </svg>
                        <span class="text-sm text-red-600 font-medium">Year: {{ issue.year }}</span>
                        <span class="text-xs text-red-400 ml-1">({{ issue.failed.join(', ') }})</span>
                    </div>

                    <div v-if="integrityMeta && !integrityMeta.isMappingComplete"
                        class="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-500 shrink-0">
                            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                        </svg>
                        <span class="text-sm text-red-600 font-medium">
                            {{ (integrityMeta.unmappedCount + integrityMeta.missingCount) }} ledger(s) need categorization in the mapping table
                        </span>
                    </div>

                    <div class="p-3 bg-[#FFFBEB] border border-[#FEF3C7] rounded-xl mb-6">
                        <p class="text-xs text-[#894B00] leading-relaxed">
                            <span class="font-bold">Action Required:</span>
                            Please review and correct the data for the mentioned year(s) in the Trial Balance tables.
                            <template v-for="issue in integrityIssues" :key="'act-' + issue.year">
                                Check the <span class="font-bold">{{ issue.failed.filter(f => f !== 'Report generation failed').join(' and ') || 'data' }} statement{{ issue.failed.length > 1 ? 's' : '' }} for year {{ issue.year }}</span> to identify the discrepancies.
                            </template>
                        </p>
                    </div>

                    <div class="flex items-center justify-end gap-3">
                        <button @click="isIntegrityModalOpen = false"
                            class="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                            Cancel
                        </button>
                        <button @click="handleReviewData"
                            class="px-6 py-2 bg-[#00896F] hover:bg-[#00755f] text-white rounded-lg text-sm font-medium transition-all active:scale-95">
                            Review Data
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Detailed Report Modal -->
        <Transition name="fade">
            <div v-if="isReportModalOpen"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div class="bg-white rounded-2xl w-full max-w-7xl shadow-2xl flex flex-col relative p-8 max-h-[90vh]">

                    <button @click="isReportModalOpen = false"
                        class="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <h3 class="text-2xl font-semibold text-gray-900 mb-4 px-2">
                        {{ currentLang === 'ar' ? 'ميزان المراجعة - تقرير مفصل' : 'Trial Balance - Detailed Report' }}
                    </h3>

                    <!-- Modal badges -->
                    <div class="px-2 mb-4 flex items-center gap-3">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border border-[#22C55E] bg-white text-[#166534]">
                            <span class="w-2 h-2 rounded-full bg-[#22C55E] inline-block flex-shrink-0"></span>
                            {{ currentLang === 'ar' ? 'تم التخطيط' : 'Mapped' }}: {{ tbMeta.mapped_count }}
                        </span>
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border border-[#EF4444] bg-white text-[#991B1B]">
                            <span class="w-2 h-2 rounded-full bg-[#EF4444] inline-block flex-shrink-0"></span>
                            {{ currentLang === 'ar' ? 'غير مخطط' : 'Not Mapped' }}: {{ tbMeta.unmapped_count }}
                        </span>
                    </div>

                    <div class="overflow-y-auto flex-1 border border-gray-100 rounded-2xl">
                        <table class="w-full border-separate border-spacing-0">
                            <thead class="bg-[#00896F] text-white sticky top-0">
                                <tr>
                                    <th class="px-6 py-4 text-left text-sm font-semibold rounded-tl-xl">FS Code</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold">Main Group</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold">Sub group</th>
                                    <th class="px-6 py-4 text-left text-sm font-semibold rounded-tr-xl">Ledger Account</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="tbLoading">
                                    <tr v-for="i in localPerPage" :key="'modal-skeleton-'+i" class="animate-pulse border-b border-gray-50 last:border-0">
                                        <td class="px-6 py-3"><div class="h-5 bg-gray-100 rounded w-full"></div></td>
                                        <td class="px-6 py-3"><div class="h-5 bg-gray-100 rounded w-full"></div></td>
                                        <td class="px-6 py-3"><div class="h-5 bg-gray-100 rounded w-full"></div></td>
                                        <td class="px-6 py-3"><div class="h-5 bg-gray-100 rounded w-3/4"></div></td>
                                    </tr>
                                </template>
                                <template v-else-if="mappingData.length === 0">
                                    <tr>
                                        <td colspan="4" class="text-center py-10 text-gray-400 text-sm">
                                            {{ currentLang === 'ar' ? 'لا توجد بيانات' : 'No data available' }}
                                        </td>
                                    </tr>
                                </template>
                                <template v-else>
                                    <tr v-for="(item, idx) in mappingData" :key="idx"
                                        :class="item.fsCode ? 'bg-[#F0FDF4]' : 'bg-[#FFF1F2]'">
                                        <td class="px-6 py-3 text-sm text-gray-900 font-medium">{{ item.fsCode || '—' }}</td>
                                        <td class="px-6 py-3 text-sm text-gray-600">{{ item.mainGroup || '—' }}</td>
                                        <td class="px-6 py-3 text-sm text-gray-600">{{ item.subGroup || '—' }}</td>
                                        <td class="px-6 py-3 text-sm text-gray-700">{{ item.ledger }}</td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>

                    <!-- Modal pagination footer -->
                    <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <span class="text-sm text-gray-500">
                            Showing {{ pageStart }}–{{ pageEnd }} of {{ tbMeta.total }} results
                        </span>
                        <div class="flex items-center gap-1.5">
                            <button @click="goToPage(tbMeta.current_page - 1)"
                                :disabled="tbMeta.current_page <= 1 || tbLoading"
                                class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                Previous
                            </button>
                            <button v-for="p in visiblePages" :key="p"
                                @click="goToPage(p)"
                                :class="p === tbMeta.current_page
                                    ? 'bg-[#00896F] text-white border-[#00896F]'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'"
                                class="w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-medium transition-all">
                                {{ p }}
                            </button>
                            <button @click="goToPage(tbMeta.current_page + 1)"
                                :disabled="tbMeta.current_page >= tbMeta.last_page || tbLoading"
                                class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                Next
                            </button>
                            <span class="ml-3 text-sm text-gray-500 whitespace-nowrap">Rows per page:</span>
                            <select v-model="localPerPage" @change="handlePerPageChange"
                                class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white text-gray-700 focus:ring-1 focus:ring-[#00896F] outline-none">
                                <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
                            </select>
                        </div>
                    </div>

                </div>
            </div>
        </Transition>
    </div>

    <!-- Calendar portal — rendered at body level to escape overflow:hidden table containers -->
    <Teleport to="body">
        <div v-if="activeCalendar" class="fixed inset-0 z-[9998]" @click="activeCalendar = null" />
        <div v-if="activeCalendar && calendarPos"
            class="fixed z-[9999] rounded-xl border border-[#03D8B0] shadow-2xl overflow-hidden"
            :class="isDark ? 'bg-[#002E26]' : 'bg-white'"
            :style="{ top: calendarPos.top + 'px', left: calendarPos.left + 'px' }"
            @click.stop>
            <VDatePicker :model-value="strToDate(calendarValue)" :is-dark="isDark"
                :locale="currentLang === 'ar' ? 'ar' : 'en'" color="primary" borderless
                @update:model-value="onCalendarSelect" />
        </div>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { DatePicker as VDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

const props = defineProps({
    userType:         { type: String,   default: 'admin' },
    currentLang:      { type: String,   default: 'en' },
    isDark:           { type: Boolean,  default: false },
    tbMappingData:    { type: Array,    default: () => [] },
    tbConfigData:     { type: Array,    default: () => [] },
    tbMappingOptions: { type: Object,   default: () => ({ fsCodes: [], mainGroups: [], subGroups: [] }) },
    tbSaving:         { type: Boolean,  default: false },
    tbLoading:        { type: Boolean,  default: false },
    tbMeta:           { type: Object,   default: () => ({ current_page: 1, last_page: 1, total: 0, per_page: 10, mapped_count: 0, unmapped_count: 0 }) }, // ← default per_page for the UI component
    integrityData:    { type: Array,    default: null },
    integrityLoading: { type: Boolean,  default: false },
    integrityMeta:    { type: Object,   default: null },
    integrityIssues:  { type: Array,    default: () => [] },
    configLocked:     { type: Boolean,  default: false },
    onRunCheck:       { type: Function, default: null },
    onUnlockConfig:   { type: Function, default: null },
    onUpdate:         { type: Function, default: null },
    onUpdateConfig:   { type: Function, default: null },
    onPageChange:     { type: Function, default: null },
    onPerPageChange:  { type: Function, default: null },
})

const isReportModalOpen = ref(false)
const perPageOptions = [10, 20, 30, 40] // ← add/remove options here
const localPerPage = ref(props.tbMeta?.per_page ?? 10)
const cardRef = ref(null)

const pageStart = computed(() =>
    props.tbMeta.total === 0 ? 0 : (props.tbMeta.current_page - 1) * props.tbMeta.per_page + 1
)
const pageEnd = computed(() =>
    Math.min(props.tbMeta.current_page * props.tbMeta.per_page, props.tbMeta.total)
)

// Ellipsis pagination:
// Always include page 1, last page, and cur-1/cur/cur+1.
// Fill a gap of exactly 1 missing page (no point showing ... for a single page).
// Use '...' for gaps > 2.
const visiblePages = computed(() => {
    const total = props.tbMeta.last_page
    const cur   = props.tbMeta.current_page
    if (total <= 1) return [1]

    const include = new Set([1, total])
    for (let p = Math.max(1, cur - 1); p <= Math.min(total, cur + 1); p++) include.add(p)

    const sorted = [...include].sort((a, b) => a - b)
    const result = []
    for (let i = 0; i < sorted.length; i++) {
        if (i > 0) {
            const gap = sorted[i] - sorted[i - 1]
            if (gap === 2)      result.push(sorted[i - 1] + 1) // fill single missing
            else if (gap > 2)   result.push('...')
        }
        result.push(sorted[i])
    }
    return result
})

const goToPage = (page) => {
    if (typeof page !== 'number') return
    if (props.onPageChange) {
        props.onPageChange(page)
        nextTick(() => cardRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
}

const handlePerPageChange = () => {
    if (props.onPerPageChange) props.onPerPageChange(localPerPage.value)
}

const mappingData = computed(() => props.tbMappingData)

// Options come from the backend only (/ledgers/mapping-options via
// mapping_masters + values on existing mappings). No local fallback —
// dummy values here let users save mappings the report formulas can't read.
const fsCodes = computed(() => props.tbMappingOptions.fsCodes ?? [])

const mainGroups = computed(() => props.tbMappingOptions.mainGroups ?? [])

const subGroups = computed(() => props.tbMappingOptions.subGroups ?? [])

// ---- Highlighted mapping values (edit these three arrays only) ----
// Any value listed here gets a green dot in its dropdown option and next
// to the field when selected.
const HIGHLIGHT_FS_CODES = ['BS']
const HIGHLIGHT_MAIN_GROUPS = ['Current asset']
const HIGHLIGHT_SUB_GROUPS = ['Stock in Hand']

const isHighlighted = (type, value) => {
    if (!value) return false
    if (type === 'fs') return HIGHLIGHT_FS_CODES.includes(value)
    if (type === 'main') return HIGHLIGHT_MAIN_GROUPS.includes(value)
    if (type === 'sub') return HIGHLIGHT_SUB_GROUPS.includes(value)
    return false
}

const defaultConfig = [
    { label: 'Financial Year',             from: '2025-01-01', to: '2025-12-31' },
    { label: 'VAT return (first quarter)', from: '2025-01-01', to: '2025-03-31' },
    { label: 'CT Due date',               from: null,          to: '2025-06-30', noFrom: true },
    { label: 'Go live date (as on)',       from: null,          to: '2025-01-01', noFrom: true },
    { label: 'Historical data since',      from: null,          to: '2022',       noFrom: true, isYear: true },
]

// Converts any stored date string to YYYY-MM-DD for the date input
// Handles: DD-Mon-YYYY (01-Jan-2025), YYYY-MM-DD, MM/DD/YYYY, etc.
const MONTH_MAP = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 }
const toDateInput = (str) => {
    if (!str) return ''
    const ddMonYYYY = str.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/)
    if (ddMonYYYY) {
        const mon = MONTH_MAP[ddMonYYYY[2]]
        if (mon !== undefined) {
            const d = new Date(parseInt(ddMonYYYY[3]), mon, parseInt(ddMonYYYY[1]))
            return d.toISOString().split('T')[0]
        }
    }
    const d = new Date(str)
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0]
}

const NO_FROM_LABELS = ['CT Due date', 'Go live date (as on)', 'Historical data since']

const toLocalRow = (r) => ({
    ...r,
    noFrom: r.noFrom ?? NO_FROM_LABELS.includes(r.label),
    from:   r.isYear ? r.from : toDateInput(r.from),
    to:     r.isYear ? r.to   : toDateInput(r.to),
})

const localConfigData = ref(
    (props.tbConfigData.length ? props.tbConfigData : defaultConfig).map(toLocalRow)
)

watch(() => props.tbConfigData, (val) => {
    if (val && val.length) localConfigData.value = val.map(toLocalRow)
}, { deep: true })

// VDatePicker needs a Date object; save back as YYYY-MM-DD (Carbon-parseable)
const strToDate = (str) => {
    if (!str) return null
    const d = new Date(str)
    return isNaN(d.getTime()) ? null : d
}
const dateToStr = (d) => {
    if (!d) return ''
    return new Date(d).toISOString().split('T')[0]
}
const displayDate = (str) => {
    if (!str) return ''
    const d = new Date(str)
    return isNaN(d.getTime()) ? str : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const activeCalendar = ref(null)
const calendarPos    = ref(null)
const calendarValue  = ref('')
const buttonRefs     = {}

const setButtonRef = (el, key) => {
    if (el) buttonRefs[key] = el
}

const toggleCalendar = (key) => {
    if (activeCalendar.value === key) {
        activeCalendar.value = null
        return
    }
    const btn = buttonRefs[key]
    if (btn) {
        const rect = btn.getBoundingClientRect()
        calendarPos.value = {
            top:  rect.bottom + window.scrollY + 4,
            left: rect.left   + window.scrollX,
        }
    }
    // key format: `${idx}-from` or `${idx}-to`
    const [idxStr, field] = key.split('-')
    const row = localConfigData.value[parseInt(idxStr)]
    calendarValue.value = row ? (field === 'from' ? row.from : row.to) : ''
    activeCalendar.value = key
}

const onCalendarSelect = (d) => {
    if (!activeCalendar.value) return
    const [idxStr, field] = activeCalendar.value.split('-')
    const row = localConfigData.value[parseInt(idxStr)]
    if (row) {
        if (field === 'from') row.from = dateToStr(d)
        else                  row.to   = dateToStr(d)
    }
    activeCalendar.value = null
}

const configSaving = ref(false)

const handleSaveConfig = async () => {
    if (!props.onUpdateConfig) return
    configSaving.value = true
    try {
        await props.onUpdateConfig(localConfigData.value)
    } finally {
        configSaving.value = false
    }
}

const handleUnlockConfig = async () => {
    if (!props.onUnlockConfig) return
    configSaving.value = true
    try {
        await props.onUnlockConfig()
    } finally {
        configSaving.value = false
    }
}

// Live results come from the verify endpoint via props; isValid stays null
// (neither tick nor cross) until Run Check has been pressed.
const integrityRows = computed(() =>
    props.integrityData?.length
        ? props.integrityData
        : [
            { label: 'Trial balance',   isValid: null },
            { label: 'Balance Sheet',   isValid: null },
            { label: 'Profit and loss', isValid: null },
        ]
)

const handleRunCheck = () => {
    if (props.onRunCheck) props.onRunCheck()
}

// Pop the error modal whenever a completed run reports failures
const isIntegrityModalOpen = ref(false)
watch(() => props.integrityIssues, (issues) => {
    if (issues && issues.length) isIntegrityModalOpen.value = true
})

// Review Data: close the modal and take the user to the mapping table
const handleReviewData = () => {
    isIntegrityModalOpen.value = false
    nextTick(() => cardRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

const handleUpdate = () => {
    if (props.onUpdate) props.onUpdate()
}
</script>

<style scoped>
select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
}
</style>
