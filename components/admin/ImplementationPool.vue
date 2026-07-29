<template>
    <div class="space-y-6">
        <!-- 1. Sub-tabs -->
        <div class="flex bg-white p-1.5 rounded-full shadow-sm w-full border border-gray-100 transition-all duration-300"
            :class="isDark ? 'bg-[#013E32] border-white/5' : 'bg-white'">
            <button v-for="sub in subTabs" :key="sub.id" @click="setSubTab(sub.id)"
                class="flex-1 px-4 py-2.5 rounded-full text-base font-normal transition-all duration-300 whitespace-nowrap"
                :class="activeSubTab === sub.id
                    ? (isDark ? 'bg-[#00B794] text-white shadow-lg' : 'bg-[#68FFD6] text-black shadow-sm')
                    : (isDark ? 'text-white/60 hover:text-white' : 'text-black hover:text-black')">
                {{ currentLang === 'ar' ? sub.labelAr : sub.label }} ({{ sub.count }})
            </button>
        </div>

        <!-- 2a. Registrations Content Card (new organization approvals) -->
        <div v-if="activeSubTab === 'registrations'" class="rounded-2xl border transition-all duration-300 p-8 space-y-6"
            :class="isDark ? 'bg-[#015F4D]/20 border-[#00B794]/30 text-white' : 'bg-white border-gray-100 shadow-sm text-black'">

            <div class="space-y-1 text-left rtl:text-right">
                <h3 class="text-xl font-normal">{{ currentLang === 'ar' ? 'طلبات تسجيل المنظمات' : 'Organization Registrations' }}</h3>
                <p class="text-base text-[#717182]">{{ currentLang === 'ar' ? 'راجع طلبات المنظمات الجديدة ووافق عليها أو ارفضها' : 'Review new organization sign-ups awaiting approval' }}</p>
            </div>

            <div class="flex flex-col md:flex-row items-center gap-3">
                <div class="relative flex-1 w-full">
                    <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 rtl:left-auto rtl:right-0 rtl:pr-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                        </svg>
                    </span>
                    <input v-model="registrationSearch" @keyup.enter="loadRegistrations(1)" type="text"
                        :placeholder="currentLang === 'ar' ? 'بحث باسم الشركة أو البريد...' : 'Search by company, org name, or email...'"
                        class="w-full py-3 border rounded-xl text-sm outline-none transition-all" :class="[
                            currentLang === 'ar' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left',
                            isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-[#04C18F80] text-black'
                        ]" />
                </div>
                <button @click="loadRegistrations(1)" :disabled="registrationLoading" class="p-3 border rounded-xl transition-all"
                    :class="[isDark ? 'bg-white/5 border-white/10 text-[#00B794]' : 'bg-white hover:bg-[#86E4CB] border-[#04C18F80] text-[#00896F]', registrationLoading ? 'opacity-50 cursor-not-allowed' : '']">
                    <img src="/images/icons/reload.svg" alt="Reload" class="w-5 h-5" :class="registrationLoading ? 'animate-spin' : ''">
                </button>
            </div>

            <div class="overflow-x-auto border rounded-xl transition-colors" :class="isDark ? 'border-white/10' : 'border-gray-100'">
                <table class="w-full text-left rtl:text-right border-separate border-spacing-0 min-w-[900px]">
                    <thead>
                        <tr class="bg-[#00896F] text-white">
                            <th class="px-4 py-4 text-sm font-normal">Company</th>
                            <th class="px-4 py-4 text-sm font-normal">Organization</th>
                            <th class="px-4 py-4 text-sm font-normal">Email</th>
                            <th class="px-4 py-4 text-sm font-normal">Status</th>
                            <th class="px-4 py-4 text-sm font-normal">Submitted</th>
                            <th class="px-4 py-4 text-sm font-normal">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
                        <tr v-if="registrationLoading"><td colspan="6" class="px-4 py-10 text-center text-gray-400">Loading...</td></tr>
                        <tr v-else-if="!registrationRows.length"><td colspan="6" class="px-4 py-10 text-center text-gray-400">No pending registrations.</td></tr>
                        <tr v-for="row in registrationRows" :key="row.id" class="hover:bg-gray-50/50 transition-colors">
                            <td class="px-4 py-5 text-sm">{{ row.company_name }}</td>
                            <td class="px-4 py-5 text-sm">{{ row.org_name || '-' }}</td>
                            <td class="px-4 py-5 text-sm">{{ row.email }}</td>
                            <td class="px-4 py-5">
                                <span class="px-3 py-0.5 rounded-full text-sm capitalize" :class="registrationStatusPillClass(row.status)">{{ row.status.replace('_', ' ') }}</span>
                            </td>
                            <td class="px-4 py-5 text-sm opacity-70">{{ row.created_at ? new Date(row.created_at).toLocaleDateString() : '-' }}</td>
                            <td class="px-4 py-5">
                                <button @click="openRegistrationDetail(row)" class="bg-white border border-[#00896F] text-[#00896F] hover:bg-[#E6FDF9] px-4 py-1.5 rounded-md text-xs font-medium transition-colors">
                                    Review
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="registrationMeta.last_page > 1" class="flex items-center justify-center gap-2 pt-2">
                <button v-for="p in registrationMeta.last_page" :key="p" @click="loadRegistrations(p)"
                    class="w-8 h-8 rounded-full text-sm transition-colors"
                    :class="p === registrationMeta.current_page ? 'bg-[#00B794] text-white' : 'text-gray-500 hover:bg-gray-100'">
                    {{ p }}
                </button>
            </div>
        </div>

        <!-- 2b. Pool Content Card -->
        <div v-else class="rounded-2xl border transition-all duration-300 p-8 space-y-6"
            :class="isDark ? 'bg-[#015F4D]/20 border-[#00B794]/30 text-white' : 'bg-white border-gray-100 shadow-sm text-black'">

            <div class="space-y-1 text-left rtl:text-right">
                <h3 class="text-xl font-normal">{{ currentLang === 'ar' ? currentTabConfig.titleAr :
                    currentTabConfig.title }}</h3>
                <p class="text-base text-[#717182]">{{ currentLang === 'ar' ? currentTabConfig.subAr :
                    currentTabConfig.sub }}</p>
            </div>

            <!-- Search bar Row -->
            <div class="flex flex-col md:flex-row items-center gap-3">
                <div class="relative flex-1 w-full">
                    <span
                        class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 rtl:left-auto rtl:right-0 rtl:pr-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </span>
                    <input type="text" :placeholder="currentLang === 'ar' ? 'بحث باسم العميل...' : 'Search...'"
                        class="w-full py-3 border rounded-xl text-sm outline-none transition-all" :class="[
                            currentLang === 'ar' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left',
                            isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-[#04C18F80] text-black'
                        ]" />
                </div>
                <div class="flex items-center gap-3">
                    <button @click="loadPool" :disabled="loading" class="p-3 border rounded-xl transition-all"
                        :class="[isDark ? 'bg-white/5 border-white/10 text-[#00B794]' : 'bg-white hover:bg-[#86E4CB] border-[#04C18F80] text-[#00896F]', loading ? 'opacity-50 cursor-not-allowed' : '']">
                        <img src="/images/icons/reload.svg" alt="Reload" class="w-5 h-5" :class="loading ? 'animate-spin' : ''">
                    </button>

                    <div v-if="activeSubTab === 'ongoing'" class="relative">
                        <button @click.stop="openDropdown($event, 'filter', null)"
                            class="flex items-center gap-3 px-4 py-3 bg-white border border-[#04C18F80] rounded-xl text-sm text-[#717182] transition-all">
                            <span>{{ selectedFilter }}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="3" :class="{ 'rotate-180': openDropdownId === 'filter-global' }">
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 3. Dynamic Table -->
            <div class="overflow-x-auto border rounded-xl transition-colors"
                :class="isDark ? 'border-white/10' : 'border-gray-100'">
                <!-- Increased min-width to 2200px to accommodate all columns in "All Projects" -->
                <table class="w-full text-left rtl:text-right border-separate border-spacing-0 min-w-[2200px]">
                    <thead>
                        <tr class="bg-[#00896F] text-white">
                            <th v-for="h in translatedHeaders" :key="h"
                                class="px-4 py-4 text-sm font-normal tracking-wider  last:border-0">
                                {{ h }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
                        <tr v-for="client in activeTableData" :key="client.id"
                            class="hover:bg-gray-50/50 transition-colors">
                            <!-- 1. ID -->
                            <td class="px-4 py-5 text-sm text-black tabular-nums">{{ client.id }}</td>
                            <!-- 2. Name -->
                            <td class="px-4 py-5 text-sm ">{{ client.name }}</td>
                            <!-- 3. Date -->
                            <td class="px-4 py-5 text-sm ">{{ client.date }}</td>
                            <!-- 4. ERP -->
                            <td class="px-4 py-5 text-sm">{{ client.erp }}</td>

                            <!-- 5. Industry (Visible in New, Completed, All) -->
                            <td v-if="['new', 'completed', 'all'].includes(activeSubTab)" class="px-4 py-5 text-sm">
                                {{ client.industry || '-' }}
                            </td>

                            <!-- 6. Status/Connector (Visible in New, Ongoing, All) -->
                            <td v-if="['new', 'ongoing', 'all'].includes(activeSubTab)" class="px-4 py-5">
                                <div v-if="activeSubTab === 'new' || (activeSubTab === 'all' && !client.status)"
                                    class="relative w-44">
                                    <button @click.stop="openDropdown($event, 'conn', client)"
                                        class="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm border border-transparent transition-all"
                                        :class="[isDark ? 'bg-white/5 text-white' : 'bg-[#F3F4F6] text-black', openDropdownId === 'conn-' + client.id ? 'border-[#00896F] bg-white ring-1 ring-[#00896F]/20' : '']">
                                        <span>{{ client.connectorStatus || '-' }}</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="3"
                                            :class="{ 'rotate-180': openDropdownId === 'conn-' + client.id }"
                                            class="transition-transform">
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </button>
                                </div>
                                <span v-else-if="client.status" class="px-3 py-0.5 rounded-full text-sm "
                                    :class="getStatusPillClass(client.status)">{{ client.status }}</span>
                                <span v-else>-</span>
                            </td>

                            <!-- 7. Progress Indicator (Visible in Ongoing, All) -->
                            <td v-if="['ongoing', 'all'].includes(activeSubTab)" class="px-4 py-5">
                                <div v-if="client.progress !== undefined" class="flex items-center gap-3 w-40">
                                    <div class="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div class="h-full transition-all duration-700"
                                            :style="{ width: (client.progress / 15 * 100) + '%', backgroundColor: getProgressHex(client.progress) }">
                                        </div>
                                    </div>
                                    <span class="text-xs font-bold text-gray-700 tabular-nums">{{ client.progress
                                    }}/15</span>
                                </div>
                                <span v-else>-</span>
                            </td>

                            <!-- 8. Mobile Number (Visible in New, All) -->
                            <td v-if="['new', 'all'].includes(activeSubTab)"
                                class="px-4 py-5 text-sm whitespace-nowrap">{{ client.phone || '-' }}</td>

                            <!-- 9. Email (Visible in New, All) -->
                            <td v-if="['new', 'all'].includes(activeSubTab)" class="px-4 py-5 text-sm">{{ client.email
                                || '-' }}</td>

                            <!-- 10. End Date (Visible in Ongoing, Completed, All) -->
                            <td v-if="['ongoing', 'completed', 'all'].includes(activeSubTab)"
                                class="px-4 py-5 text-sm opacity-70">{{ client.endDate || '-' }}</td>

                            <!-- 11. Overrun (Visible in Ongoing, Completed, All) -->
                            <td v-if="['ongoing', 'completed', 'all'].includes(activeSubTab)"
                                class="px-4 py-5 text-sm font-semibold"
                                :class="client.overrun && client.overrun !== '-' ? 'text-[#FF3D00]' : 'text-gray-400'">
                                {{ client.overrun || '-' }}</td>

                            <!-- 12. Partner (New + Ongoing) -->
                            <td v-if="['new', 'ongoing'].includes(activeSubTab)" class="px-4 py-5">
                                <span v-if="client.partnerName" class="text-sm font-medium text-[#007C65]">{{ client.partnerName }}</span>
                                <button v-else @click="openPartnerModal(client)" class="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors">Config</button>
                            </td>

                            <!-- 13. Consultant Column (Visible in All Tabs) -->
                            <td class="px-4 py-5">
                                <div v-if="activeSubTab === 'new'" class="relative w-56">
                                    <button @click.stop="openDropdown($event, 'cons', client)"
                                        class="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm border border-transparent transition-all"
                                        :class="[isDark ? 'bg-white/5 text-white' : 'bg-[#F3F4F6] text-black', openDropdownId === 'cons-' + client.id ? 'border-[#00896F] bg-white ring-1 ring-[#00896F]/20' : '']">
                                        <span :class="!client.consultant ? 'opacity-40' : ''">{{ client.consultant || 'Select Consultant' }}</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                                            :class="{ 'rotate-180': openDropdownId === 'cons-' + client.id }" class="transition-transform">
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </button>
                                </div>
                                <span v-else class="text-sm font-medium">{{ client.consultant || '-' }}</span>
                            </td>

                            <!-- 14. View Delays (Ongoing only) -->
                            <td v-if="activeSubTab === 'ongoing'" class="px-4 py-5">
                                <button @click="openDelaysModal(client)"
                                    class="bg-white border border-[#00896F] text-[#00896F] hover:bg-[#E6FDF9] px-4 py-1.5 rounded-md text-xs font-medium transition-colors">
                                    View
                                </button>
                            </td>

                            <!-- 15. Assign Action (New only) -->
                            <td v-if="activeSubTab === 'new'" class="px-4 py-5 pe-8">
                                <button @click="assignProject(client)" :disabled="!client.consultant"
                                    class="bg-[#00B68D] hover:bg-[#006552] text-white px-6 py-2 rounded-md text-xs font-bold">Assign</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Registration Review Modal -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="showRegistrationDetail" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div class="bg-white rounded-2xl shadow-xl w-[560px] max-w-full flex flex-col max-h-[85vh]">
                        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 class="text-[16px] font-semibold text-gray-900">Registration Review</h3>
                                <p class="text-xs text-gray-400 mt-0.5">{{ registrationDetail?.company_name }}</p>
                            </div>
                            <button @click="showRegistrationDetail = false" class="text-gray-400 hover:text-gray-600">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div class="overflow-y-auto flex-1 p-6">
                            <div v-if="!registrationDetail" class="text-center text-sm text-gray-400 py-8">Loading...</div>
                            <div v-else class="space-y-3 text-sm">
                                <div class="flex justify-between"><span class="text-gray-400">Company</span><span class="font-medium text-gray-800">{{ registrationDetail.company_name }}</span></div>
                                <div class="flex justify-between"><span class="text-gray-400">Organization</span><span class="font-medium text-gray-800">{{ registrationDetail.org_name || '-' }}</span></div>
                                <div class="flex justify-between"><span class="text-gray-400">Email</span><span class="font-medium text-gray-800">{{ registrationDetail.email }}</span></div>
                                <div class="flex justify-between"><span class="text-gray-400">Status</span>
                                    <span class="px-3 py-0.5 rounded-full text-xs capitalize" :class="registrationStatusPillClass(registrationDetail.status)">{{ registrationDetail.status?.replace('_', ' ') }}</span>
                                </div>
                                <div class="flex justify-between"><span class="text-gray-400">Sign-up method</span><span class="font-medium text-gray-800 capitalize">{{ registrationDetail.auth_provider }}</span></div>
                                <div class="flex justify-between"><span class="text-gray-400">ERP</span><span class="font-medium text-gray-800">{{ registrationDetail.erp_type || '-' }}</span></div>
                                <div class="flex justify-between"><span class="text-gray-400">Industry</span><span class="font-medium text-gray-800">{{ registrationDetail.industry || '-' }}</span></div>
                                <div class="flex justify-between"><span class="text-gray-400">Email verified</span><span class="font-medium text-gray-800">{{ registrationDetail.email_verified_at ? new Date(registrationDetail.email_verified_at).toLocaleString() : '-' }}</span></div>
                                <div v-if="registrationDetail.reviewed_by_name" class="flex justify-between"><span class="text-gray-400">Reviewed by</span><span class="font-medium text-gray-800">{{ registrationDetail.reviewed_by_name }}</span></div>
                            </div>
                        </div>
                        <div v-if="registrationDetail?.status === 'email_verified'" class="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
                            <button @click="rejectRegistration(registrationDetail)" :disabled="registrationActing"
                                class="px-5 py-2 border border-red-200 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 disabled:opacity-60 transition-colors">
                                Reject
                            </button>
                            <button @click="approveRegistration(registrationDetail)" :disabled="registrationActing"
                                class="px-5 py-2 bg-[#007C65] text-white rounded-md text-sm font-medium hover:bg-[#006A56] disabled:opacity-60 transition-colors">
                                {{ registrationActing ? 'Approving…' : 'Approve — Provision Organization' }}
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Partner Link Modal -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="showPartnerModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div class="bg-white rounded-2xl shadow-xl w-[520px] max-w-full flex flex-col max-h-[80vh]">
                        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 class="text-[16px] font-semibold text-gray-900">Link Partner</h3>
                                <p class="text-xs text-gray-400 mt-0.5">{{ partnerModalClient?.name }}</p>
                            </div>
                            <button @click="showPartnerModal = false" class="text-gray-400 hover:text-gray-600">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div class="overflow-y-auto flex-1">
                            <div v-if="partnerLoading" class="p-8 text-center text-sm text-gray-400">Loading partners…</div>
                            <div v-else-if="!partnerList.length" class="p-8 text-center text-sm text-gray-400">No active partners found.</div>
                            <div v-else>
                                <div v-for="p in partnerList" :key="p.id" @click="selectPartner(p)"
                                    class="flex items-center justify-between px-6 py-4 border-b border-gray-50 hover:bg-[#F0FDF9] cursor-pointer transition-colors last:border-0">
                                    <div>
                                        <div class="text-sm font-medium text-gray-900">{{ p.name }}</div>
                                        <div class="text-xs text-gray-400 mt-0.5">{{ p.email }}</div>
                                    </div>
                                    <span class="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">{{ p.code }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Partner Link Confirmation -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="showPartnerConfirm" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div class="bg-white rounded-2xl shadow-xl w-[420px] max-w-full px-8 py-8 text-center">
                        <div class="w-14 h-14 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-4">
                            <svg class="text-[#007C65]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </div>
                        <h3 class="text-[17px] font-semibold text-gray-900 mb-2">Link Partner?</h3>
                        <p class="text-sm text-gray-500 mb-1">You're assigning</p>
                        <p class="text-sm font-semibold text-gray-800 mb-1">{{ partnerModalClient?.name }}</p>
                        <p class="text-sm text-gray-500 mb-1">to partner</p>
                        <p class="text-sm font-semibold text-[#007C65] mb-6">{{ selectedPartner?.name }} <span class="text-xs font-mono text-gray-400">({{ selectedPartner?.code }})</span></p>
                        <div class="flex gap-3 justify-center">
                            <button @click="cancelPartnerConfirm" class="px-5 py-2 border border-gray-200 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50">Cancel</button>
                            <button @click="confirmLinkPartner" :disabled="partnerLinking" class="px-5 py-2 bg-[#007C65] text-white rounded-md text-sm font-medium hover:bg-[#006A56] transition-colors disabled:opacity-60">
                                {{ partnerLinking ? 'Linking…' : 'Confirm' }}
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Client Delays Modal -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="showDelaysModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div class="bg-white rounded-2xl shadow-xl w-[680px] max-w-full flex flex-col max-h-[80vh]">
                        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 class="text-[16px] font-semibold text-gray-900">Client Delays</h3>
                                <p class="text-xs text-gray-400 mt-0.5">{{ delaysClient?.name }}</p>
                            </div>
                            <button @click="showDelaysModal = false" class="text-gray-400 hover:text-gray-600">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div class="overflow-y-auto flex-1 p-6">
                            <div v-if="delaysLoading" class="text-center text-sm text-gray-400 py-8">Loading...</div>
                            <div v-else-if="!delaysList.length" class="text-center text-sm text-gray-400 py-8">No delays reported for this client.</div>
                            <table v-else class="w-full text-left text-sm">
                                <thead>
                                    <tr class="bg-[#00896F] text-white">
                                        <th class="px-4 py-3 font-medium rounded-tl-lg">Step</th>
                                        <th class="px-4 py-3 font-medium">Step Name</th>
                                        <th class="px-4 py-3 font-medium">Date / Time</th>
                                        <th class="px-4 py-3 font-medium rounded-tr-lg">Delay Reason</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr v-for="d in delaysList" :key="d.step_number" class="hover:bg-gray-50">
                                        <td class="px-4 py-3 font-semibold text-[#007C65]">{{ d.step_number }}</td>
                                        <td class="px-4 py-3 text-gray-800">{{ d.step_name }}</td>
                                        <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ d.completed_at ?? '-' }}</td>
                                        <td class="px-4 py-3 text-gray-700">{{ d.client_delay_reason || '-' }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <Teleport to="body">
            <Transition name="fade">
                <div v-if="openDropdownId"
                    class="absolute z-[9999] bg-white rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.2)] border border-gray-100 p-2 overflow-hidden"
                    :style="{ top: dropdownPos.top + 'px', left: dropdownPos.left + 'px', width: dropdownPos.width + 'px' }">
                    <div v-for="opt in dropdownItems" :key="opt" @click.stop="handleSelect(opt)"
                        class="px-4 py-2.5 text-xs rounded-xl cursor-pointer transition-colors hover:bg-[#E6FDF9] hover:text-[#00896F]"
                        :class="isOptionSelected(opt) ? 'bg-[#E6FDF9] text-[#00896F] font-bold' : 'text-gray-700'">
                        {{ opt }}
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({ isDark: Boolean, currentLang: { type: String, default: 'en' } })

const { getPool, getConsultants, updateAssignment, getRegistrationRequests, getRegistrationRequestDetail, approveRegistrationRequest, rejectRegistrationRequest } = useImplementation()

const route  = useRoute()
const router = useRouter()
const validSubTabs = ['new', 'ongoing', 'completed', 'all', 'registrations']
const activeSubTab = ref(validSubTabs.includes(route.query.subtab) ? route.query.subtab : 'new')

function setSubTab(id) {
    activeSubTab.value = id
    router.replace({ query: { ...route.query, subtab: id } })
    if (id === 'registrations' && !registrationsLoaded.value) loadRegistrations()
}
const openDropdownId = ref(null)
const dropdownPos = ref({ top: 0, left: 0, width: 0 })
const activeClient = ref(null)
const activeDropdownType = ref(null)
const selectedFilter = ref('All Connector Statuses')
const loading = ref(false)
const consultantList = ref([])

// --- 1. MOCK DATA STORE (commented out — replaced by API) ---
// const mockData = ref({
//     'new': [{ id: 'client-7', name: 'Logistics Express Inc.', date: '01/10/2026', erp: 'SAP', industry: 'Logistics', connectorStatus: 'Pending', phone: '+ 123 123 123', email: 'sarah@gmail.com', consultant: '' }],
//     'ongoing': [{ id: 'client-11', name: 'Al Dhabi Contracting', date: '01/10/2026', erp: 'SAP', status: 'Pending', progress: 8, endDate: '01/10/2026', overrun: '+5 days', consultant: 'Sarah Johnson' }],
//     'completed': [{ id: 'client-134', name: 'Maritime Logistics', date: '01/10/2026', erp: 'Oracle', industry: 'Maritime', status: 'Connected', progress: 15, endDate: '01/10/2026', overrun: '-', consultant: 'Sarah Johnson' }]
// })

const poolData = ref({ new: [], ongoing: [], completed: [] })

function mapClient(item) {
    return {
        id:               item.client_id,
        name:             item.client_name,
        date:             item.date_assigned,
        erp:              item.erp ?? '-',
        industry:         item.industry ?? '-',
        connectorStatus:  item.connector_status ?? 'Pending',
        status:           item.connector_status ?? null,
        progress:         item.progress_indicator ?? 0,
        phone:            item.mobile_number ?? '-',
        email:            item.email ?? '-',
        endDate:          item.expected_date_to_close ?? '-',
        overrun:          item.overrun ? `+${item.overrun} days` : '-',
        consultant:       item.assigned_consultant ?? '',
        consultantId:     item.implementation_consultant_id ?? null,
        implementationStatus: item.implementation_status,
        partnerId:        item.partner_id ?? null,
        partnerName:      item.partner_name ?? null,
        _tenantId:        item.tenant_id, // tenants.id for partner linking
    }
}

async function loadPool() {
    loading.value = true
    try {
        const all = await getPool()
        poolData.value.new       = all.filter(c => c.implementation_status === 'New').map(mapClient)
        poolData.value.ongoing   = all.filter(c => c.implementation_status === 'Ongoing').map(mapClient)
        poolData.value.completed = all.filter(c => c.implementation_status === 'Completed').map(mapClient)
    } finally {
        loading.value = false
    }
}

// --- 2. DYNAMIC COMPUTE FOR "ALL" DATA ---
const activeTableData = computed(() => {
    if (activeSubTab.value === 'all') {
        return [...poolData.value.new, ...poolData.value.ongoing, ...poolData.value.completed]
    }
    const data = poolData.value[activeSubTab.value] ?? []
    if (activeSubTab.value === 'ongoing' && selectedFilter.value !== 'All Connector Statuses') {
        return data.filter(c => c.status === selectedFilter.value)
    }
    return data
})

const subTabs = computed(() => [
    { id: 'registrations', label: 'Registrations', labelAr: 'طلبات التسجيل', count: registrationMeta.value.total },
    { id: 'new', label: 'New', labelAr: 'جديد', count: poolData.value.new.length },
    { id: 'ongoing', label: 'Ongoing', labelAr: 'قيد التنفيذ', count: poolData.value.ongoing.length },
    { id: 'completed', label: 'Completed', labelAr: 'مكتمل', count: poolData.value.completed.length },
    { id: 'all', label: 'All Projects', labelAr: 'جميع المشاريع', count: poolData.value.new.length + poolData.value.ongoing.length + poolData.value.completed.length },
])

// --- Organization registration review (new tenants awaiting approval) ---
const registrationsLoaded  = ref(false)
const registrationLoading  = ref(false)
const registrationRows     = ref([])
const registrationMeta     = ref({ current_page: 1, last_page: 1, total: 0, per_page: 10 })
const registrationSearch   = ref('')
const registrationDetail   = ref(null)
const showRegistrationDetail = ref(false)
const registrationActing   = ref(false)

async function loadRegistrations(page = 1) {
    registrationLoading.value = true
    try {
        const res = await getRegistrationRequests({ search: registrationSearch.value || undefined, page, per_page: 10 })
        registrationRows.value = res.data ?? []
        registrationMeta.value = res.meta ?? { current_page: 1, last_page: 1, total: 0, per_page: 10 }
        registrationsLoaded.value = true
    } finally {
        registrationLoading.value = false
    }
}

async function openRegistrationDetail(row) {
    showRegistrationDetail.value = true
    registrationDetail.value = null
    registrationDetail.value = await getRegistrationRequestDetail(row.id)
}

async function approveRegistration(row) {
    registrationActing.value = true
    try {
        await approveRegistrationRequest(row.id)
        showRegistrationDetail.value = false
        await loadRegistrations(registrationMeta.value.current_page)
    } finally {
        registrationActing.value = false
    }
}

async function rejectRegistration(row) {
    registrationActing.value = true
    try {
        await rejectRegistrationRequest(row.id)
        showRegistrationDetail.value = false
        await loadRegistrations(registrationMeta.value.current_page)
    } finally {
        registrationActing.value = false
    }
}

// Status pipeline badge — matches the backend's own status field, no separate progress-bar
// endpoint (approval is synchronous, per the locked design).
function registrationStatusPillClass(status) {
    if (status === 'approved') return 'bg-[#D0FAE5] text-[#007C65]'
    if (status === 'rejected') return 'bg-red-100 text-red-600'
    if (status === 'email_verified') return 'bg-[#DBEAFE] text-[#193CB8]'
    return 'bg-[#FEF9C2] text-[#CE8600]' // pending
}

const tabConfigs = {
    'new': { title: 'New Clients', titleAr: 'عملاء جدد', sub: 'Assign consultants to projects', headers: ['Client ID', 'Client Name', 'Date Assigned', 'ERP', 'Industry', 'Connector', 'Mobile Number', 'Email', 'Partner', 'Consultant', 'Action'], headersAr: ['المعرف', 'الاسم', 'التاريخ', 'ERP', 'الصناعة', 'الموصل', 'الهاتف', 'البريد', 'الشريك', 'المستشار', 'إجراء'] },
    'ongoing': { title: 'Ongoing Projects', titleAr: 'مشاريع قيد التنفيذ', sub: 'Track progress and assignments', headers: ['Client ID', 'Client Name', 'Date Assigned', 'ERP', 'Status', 'Progress Indicator', 'Expected Close', 'Overrun', 'Partner', 'Consultant', 'Delays'], headersAr: ['المعرف', 'الاسم', 'التاريخ', 'ERP', 'الحالة', 'مؤشر التقدم', 'تاريخ الإغلاق', 'التجاوز', 'الشريك', 'المستشار', 'التأخيرات'] },
    'completed': { title: 'Completed Projects', titleAr: 'المشاريع المكتملة', sub: 'Successfully completed projects', headers: ['Client ID', 'Client Name', 'Date Assigned', 'ERP', 'Industry', 'Go Live Date', 'Overrun', 'Consultant ID'], headersAr: ['المعرف', 'الاسم', 'التاريخ', 'ERP', 'الصناعة', 'تاريخ الإطلاق', 'التجاوز', 'المستشار'] },
    'all': {
        title: 'All Projects', titleAr: 'جميع المشاريع', sub: 'Complete project implementation history',
        headers: ['Client ID', 'Client Name', 'Date Assigned', 'ERP', 'Industry', 'Status/Connector', 'Progress', 'Mobile', 'Email', 'End Date', 'Overrun', 'Consultant'],
        headersAr: ['المعرف', 'الاسم', 'التاريخ', 'ERP', 'الصناعة', 'الحالة', 'التقدم', 'الهاتف', 'البريد', 'تاريخ الانتهاء', 'التجاوز', 'المستشار']
    }
}

const currentTabConfig = computed(() => tabConfigs[activeSubTab.value] || tabConfigs['new'])
const translatedHeaders = computed(() => props.currentLang === 'ar' ? currentTabConfig.value.headersAr : currentTabConfig.value.headers)

// Logic helpers (Pills, Progress, Dropdowns) same as before...
const getProgressHex = (val) => val >= 10 ? '#00896F' : val >= 6 ? '#F59E0B' : '#FF3D00'
const getStatusPillClass = (status) => {
    if (status === 'Pending') return 'bg-[#FEF9C2] text-[#CE8600]'
    if (status.includes('Manual')) return 'bg-[#D0FAE5] text-[#007C65]'
    return 'bg-[#DBEAFE] text-[#193CB8]'
}
const isOptionSelected = (opt) => {
    if (activeDropdownType.value === 'filter') return selectedFilter.value === opt
    if (!activeClient.value) return false
    return activeDropdownType.value === 'conn' ? activeClient.value.connectorStatus === opt : activeClient.value.consultant === opt
}
const openDropdown = (event, type, client) => {
    const id = client ? `${type}-${client.id}` : 'filter-global'
    if (openDropdownId.value === id) { openDropdownId.value = null; return }
    activeClient.value = client; activeDropdownType.value = type
    const rect = event.currentTarget.getBoundingClientRect()
    dropdownPos.value = { top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX, width: rect.width }
    openDropdownId.value = id
}
const handleSelect = (val) => {
    if (activeDropdownType.value === 'filter') selectedFilter.value = val
    else if (activeClient.value) { if (activeDropdownType.value === 'conn') activeClient.value.connectorStatus = val; else activeClient.value.consultant = val }
    openDropdownId.value = null
}
const dropdownItems = computed(() => {
    if (activeDropdownType.value === 'filter') return ['All Connector Statuses', 'Pending', 'Manual Connector', 'Connected', 'Send']
    if (activeDropdownType.value === 'conn') return ['Pending', 'Manual Connected', 'Send', 'Connected']
    // consultant dropdown: show names from API
    return consultantList.value.map(c => c.full_name)
})
const assignProject = async (client) => {
    const consultant = consultantList.value.find(c => c.full_name === client.consultant)
    await updateAssignment({
        client_id: client.id,
        implementation_consultant_id: consultant?.id ?? null,
        implementation_status: 'Ongoing',
    })
    await loadPool()
}
// Delays modal
const { getActivePartners, linkPartnerToClient, getClientDelays } = useImplementation()
const showDelaysModal = ref(false)
const delaysClient    = ref(null)
const delaysList      = ref([])
const delaysLoading   = ref(false)

async function openDelaysModal(client) {
    delaysClient.value  = client
    showDelaysModal.value = true
    delaysLoading.value = true
    try {
        delaysList.value = await getClientDelays(client.id)
    } finally {
        delaysLoading.value = false
    }
}

// Partner linking
const showPartnerModal   = ref(false)
const showPartnerConfirm = ref(false)
const partnerModalClient = ref(null)
const selectedPartner    = ref(null)
const partnerList        = ref([])
const partnerLoading     = ref(false)
const partnerLinking     = ref(false)

async function openPartnerModal(client) {
    partnerModalClient.value = client
    selectedPartner.value    = null
    showPartnerModal.value   = true
    partnerLoading.value     = true
    try {
        partnerList.value = await getActivePartners()
    } finally {
        partnerLoading.value = false
    }
}

function selectPartner(partner) {
    selectedPartner.value    = partner
    showPartnerModal.value   = false
    showPartnerConfirm.value = true
}

function cancelPartnerConfirm() {
    showPartnerConfirm.value = false
    showPartnerModal.value   = true
}

async function confirmLinkPartner() {
    partnerLinking.value = true
    try {
        await linkPartnerToClient(selectedPartner.value.id, partnerModalClient.value._tenantId)
        for (const tab of ['new', 'ongoing', 'completed']) {
            const idx = poolData.value[tab].findIndex(c => c.id === partnerModalClient.value.id)
            if (idx !== -1) {
                poolData.value[tab][idx].partnerId   = selectedPartner.value.id
                poolData.value[tab][idx].partnerName = selectedPartner.value.name
                break
            }
        }
        showPartnerConfirm.value = false
    } finally {
        partnerLinking.value = false
    }
}

onMounted(async () => {
    window.addEventListener('click', (e) => { if (!e.target.closest('button')) openDropdownId.value = null })
    const [, consultants] = await Promise.all([loadPool(), getConsultants(), loadRegistrations()])
    consultantList.value = consultants
})
</script>