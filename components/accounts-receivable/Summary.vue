<template>
  <div class="w-full transition-all duration-500 rounded-3xl"
    :class="isDark ? 'bg-[#00141080]' : 'bg-white shadow-sm'">
    <div class="py-5 lg:px-8 px-4 flex justify-between items-center sticky top-[-32px] z-30 rounded-t-3xl" :class="isDark ? 'bg-[#001a14]' : 'bg-white'">
      <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
        {{ currentLang === 'ar' ? 'ملخص حسابات القبض' : 'Accounts Receivable Summary' }}
      </p>
      <div class="flex items-center gap-4">
        <p class="text-[12px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
          {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
        </p>
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand Icon" class="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100" @click="isModalOpen = true" />
      </div>
    </div>

    <div class="w-full max-w-full xl:overflow-visible overflow-x-auto custom-scrollbar relative">
      <table class="w-full text-left rtl:text-right border-collapse lg:min-w-full min-w-[1000px] table-fixed">
        <colgroup>
            <col style="width: 25%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
        </colgroup>
        <thead class="text-white lg:sticky lg:top-[32px] z-20" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
          <tr class="transition-all duration-500">
            <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'التفاصيل' : 'Particulars' }}</th>
            <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">
              <div class="flex items-center justify-end rtl:justify-start gap-2">
                {{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}
                <img src="/images/icons/edit-white.svg" class="w-[21px] h-auto" v-if="!isDark" />
                <svg v-else width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-70">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </th>
            <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '>30' : '>30' }}</th>
            <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '30-60' : '30-60' }}</th>
            <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '60-90' : '60-90' }}</th>
            <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '<90' : '<90' }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="group in paginatedData" :key="group.label">
            <!-- Main Group Row -->
            <tr :class="[
                isDark ? 'bg-[#001a14] border-b border-white/10' : 'bg-white border-b border-gray-100',
                'text-[14px] font-medium transition-all duration-500',
                expandedGroups.includes(group.label) ? 'lg:sticky lg:top-[92px] z-10 shadow-sm outline outline-1 outline-gray-100 dark:outline-white/10' : ''
              ]">
              <td class="px-8 py-5" :class="isDark ? 'text-white' : 'text-[#000]'">
                <div class="flex items-center gap-2 cursor-pointer" @click="toggleGroup(group)">
                  <span>{{ currentLang === 'ar' ? group.labelAr : group.label }}</span>
                  <button class="focus:outline-none transition-transform duration-200">
                    <svg v-if="expandedGroups.includes(group.label)" width="10" height="7" viewBox="0 0 10 7" fill="none">
                        <path d="M1 6L5 2L9 6" :stroke="isDark ? '#00FFBC' : '#008864'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else width="10" height="7" viewBox="0 0 10 7" fill="none">
                        <path d="M1 1L5 5L9 1" :stroke="isDark ? '#00FFBC' : '#008864'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </td>
              <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-[#00FFBC]' : 'text-[#00b484]'">{{ group.total }}</td>
              <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ group.age30 }}</td>
              <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ group.age3060 }}</td>
              <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ group.age6090 }}</td>
              <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ group.age90plus }}</td>
            </tr>

            <!-- Expandable Invoice Section -->
            <tr v-if="expandedGroups.includes(group.label)">
              <td colspan="6" class="p-0 border-none">
                <div :class="isDark ? 'bg-[#003D2E]' : 'bg-[#E8FBF3]'" class="p-8 shadow-inner">
                  <div class="flex justify-between items-start mb-6">
                    <div>
                      <h3 class="text-[16px] font-normal mb-6" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
                        {{ currentLang === 'ar' ? 'حدد الفواتير لإرسال التذكيرات' : 'Select invoices to send reminders.' }}
                      </h3>
                      <div class="flex items-center gap-3">
                        <input type="checkbox" :checked="isGroupAllSelected(group)" @change="toggleGroupSelectAll(group)"
                          class="custom-checkbox">
                        <span class="text-[16px] font-normal" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
                          {{ currentLang === 'ar' ? `تحديد الكل (${getInvoices(group).length})` : `Select All (${getInvoices(group).length})` }}
                        </span>
                      </div>
                    </div>
                    <div class="flex flex-col items-end gap-1">
                      <button @click="handleSendReminders(group)"
                        :disabled="sendingKey !== null || groupSelectedCount(group) === 0 || !hasEmail(group)"
                        :title="emailTooltip(group)"
                        class="bg-[#005A48] hover:bg-[#004A3B] text-white px-5 py-3 rounded-xl flex items-center gap-3 text-[16px] font-normal transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ sendingKey === group.label
                            ? '...'
                            : (currentLang === 'ar' ? `إرسال تذكير (${groupSelectedCount(group)})` : `Send Reminder (${groupSelectedCount(group)})`) }}
                      </button>
                      <span v-if="!hasEmail(group)" class="text-[12px] text-amber-700">
                        {{ currentLang === 'ar' ? 'لم تتم إضافة بريد لهذا العميل' : "Email for this client isn't added" }}
                      </span>
                    </div>
                  </div>


                  <!-- Loading spinner -->
                  <div v-if="loadingGroup === group.label" class="flex justify-center py-6">
                    <div class="w-8 h-8 border-4 border-[#005A48] border-t-transparent rounded-full animate-spin"></div>
                  </div>

                  <div v-else class="space-y-4 mt-8">
                    <div v-if="getInvoices(group).length === 0" class="text-[14px] opacity-60 py-4" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
                      {{ currentLang === 'ar' ? 'لا توجد فواتير' : 'No invoices found.' }}
                    </div>
                    <div v-for="(inv, iIdx) in getInvoices(group)" :key="iIdx"
                      class="grid grid-cols-6 items-center border-b pt-4 pb-4 transition-opacity"
                      :class="[
                          inv.on_cooldown ? 'opacity-45' : '',
                          isDark ? 'border-white/5' : 'border-[#b2edd4]'
                      ]">
                      <div class="flex items-center gap-3">
                        <input type="checkbox" v-model="inv.selected" :disabled="inv.on_cooldown"
                          class="custom-checkbox">
                        <!-- Invoice no; cooldown → dotted underline + fixed tooltip on hover -->
                        <span class="text-[16px] font-normal"
                          :class="[isDark ? 'text-white' : 'text-[#1A1A1A]', inv.on_cooldown ? 'underline decoration-dotted underline-offset-4 cursor-help' : '']"
                          @mouseenter="inv.on_cooldown && showCooldownTip($event, inv)" @mouseleave="hideCooldownTip">
                          {{ inv.invoiceNo }}
                        </span>
                      </div>
                      <div class="text-right rtl:text-left font-normal text-[16px]" :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">
                        <span class="underline underline-offset-4 cursor-pointer">{{ formatInMillions(inv.amount) }}</span>
                      </div>
                      <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age30?.toLocaleString() }}</div>
                      <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age3060?.toLocaleString() }}</div>
                      <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age6090?.toLocaleString() }}</div>
                      <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age90plus?.toLocaleString() }}</div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr :class="isDark ? 'bg-[#1D5E54]' : 'bg-[#68E4C4]'" class="transition-all duration-500 text-[14px] font-medium">
            <td class="px-8 py-5" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}</td>
            <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatInMillions(summaryTotal.total) }}</td>
            <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatInMillions(summaryTotal.age30) }}</td>
            <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatInMillions(summaryTotal.age3060) }}</td>
            <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatInMillions(summaryTotal.age6090) }}</td>
            <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatInMillions(summaryTotal.age90plus) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="paginatedData.length > 0" class="lg:py-6 py-4 px-4 lg:px-8 flex flex-wrap items-center justify-between gap-3">
        <span class="text-sm" :class="isDark ? 'text-white/60' : 'text-gray-500'">
            {{ currentLang === 'ar' ? 'عرض' : 'Showing' }} {{ pageStart }}–{{ pageEnd }} {{ currentLang === 'ar' ? 'من' : 'of' }} {{ totalItems }} {{ currentLang === 'ar' ? 'النتائج' : 'results' }}
        </span>
        <div class="flex items-center gap-1.5">
            <button @click="goToPage(currentPage - 1)"
                :disabled="currentPage <= 1"
                class="px-3 py-1.5 rounded-lg border text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                :class="isDark ? 'border-white/10 text-white/80 bg-[#1a1a1a] hover:bg-white/10' : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'">
                {{ currentLang === 'ar' ? 'السابق' : 'Previous' }}
            </button>
            <button v-for="p in visiblePages" :key="p"
                @click="goToPage(p)"
                :class="[
                    p === currentPage
                        ? (isDark ? 'bg-[#00896F] text-white border-[#00896F]' : 'bg-[#00896F] text-white border-[#00896F]')
                        : (isDark ? 'bg-[#1a1a1a] text-white/80 border-white/10 hover:bg-white/10' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'),
                    'w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-medium transition-all'
                ]">
                {{ p }}
            </button>
            <button @click="goToPage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="px-3 py-1.5 rounded-lg border text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                :class="isDark ? 'border-white/10 text-white/80 bg-[#1a1a1a] hover:bg-white/10' : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'">
                {{ currentLang === 'ar' ? 'التالي' : 'Next' }}
            </button>
        </div>
    </div>

    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full max-h-[78vh] rounded-xl shadow-2xl flex flex-col overflow-hidden" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1500px; margin: 0 15px;">
          <div class="flex justify-between items-center py-6 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
            <div>
              <p class="text-lg font-medium" :class="isDark ? 'text-white' : 'text-[#013e32]'">
                {{ currentLang === 'ar' ? 'ملخص حسابات القبض' : 'Accounts Receivable Summary' }}
              </p>
              <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
                {{ currentLang === 'ar' ? 'القيم بمليون درهم' : 'Values in AED Million' }}
              </p>
            </div>
            <button @click="isModalOpen = false" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
              <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5" :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
            </button>
          </div>

          <div class="w-full flex-1 flex flex-col min-h-0 overflow-x-auto overflow-y-hidden no-scrollbar bg-white dark:bg-[#00141080]">
            <div class="min-w-[1000px] flex flex-col flex-1 h-full">
              <!-- Header Table (Fixed) -->
              <div class="shrink-0 sticky top-0 z-10" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                <table class="w-full text-left rtl:text-right table-fixed border-collapse">
                  <colgroup>
                      <col style="width: 25%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                  </colgroup>
                  <thead class="text-white" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                    <tr>
                      <th class="px-8 py-5 font-normal text-[14px]">{{ currentLang === 'ar' ? 'التفاصيل' : 'Particulars' }}</th>
                      <th class="px-6 py-5 font-normal text-right rtl:text-left text-[14px]">
                        <div class="flex items-center justify-end rtl:justify-start gap-2">
                          {{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}
                          <img src="/images/icons/edit-white.svg" class="w-[21px] h-auto" v-if="!isDark" />
                          <svg v-else width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-70">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </div>
                      </th>
                      <th class="px-6 py-5 font-normal text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '>30' : '>30' }}</th>
                      <th class="px-6 py-5 font-normal text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '30-60' : '30-60' }}</th>
                      <th class="px-6 py-5 font-normal text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '60-90' : '60-90' }}</th>
                      <th class="px-6 py-5 font-normal text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '<90' : '<90' }}</th>
                    </tr>
                  </thead>
                </table>
              </div>

              <!-- Scrollable Body Table -->
              <div class="overflow-y-auto custom-scrollbar flex-1 max-h-[78vh]">
                <table class="w-full text-left rtl:text-right table-fixed border-collapse">
                  <colgroup>
                      <col style="width: 25%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                  </colgroup>
                  <tbody>
                    <template v-for="group in arData" :key="'modal-' + group.label">
                      <tr :class="[
                          isDark ? 'bg-[#001a14] border-b border-white/10' : 'bg-white border-b border-gray-100',
                          'text-[14px] font-medium transition-all duration-500',
                          expandedGroups.includes(group.label) ? 'sticky top-[60px] z-10 shadow-sm outline outline-1 outline-gray-100 dark:outline-white/10' : ''
                        ]">
                        <td class="px-8 py-5" :class="isDark ? 'text-white' : 'text-[#000]'">
                          <div class="flex items-center gap-2 cursor-pointer" @click="toggleGroup(group)">
                            <span>{{ currentLang === 'ar' ? group.labelAr : group.label }}</span>
                            <button class="focus:outline-none transition-transform duration-200">
                              <svg v-if="expandedGroups.includes(group.label)" width="10" height="7" viewBox="0 0 10 7" fill="none">
                                  <path d="M1 6L5 2L9 6" :stroke="isDark ? '#00FFBC' : '#008864'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              <svg v-else width="10" height="7" viewBox="0 0 10 7" fill="none">
                                  <path d="M1 1L5 5L9 1" :stroke="isDark ? '#00FFBC' : '#008864'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-[#00FFBC]' : 'text-[#00b484]'">{{ group.total }}</td>
                        <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ group.age30 }}</td>
                        <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ group.age3060 }}</td>
                        <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ group.age6090 }}</td>
                        <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ group.age90plus }}</td>
                      </tr>
    
                      <!-- Expandable Invoice Section (modal version) -->
                      <tr v-if="expandedGroups.includes(group.label)">
                        <td colspan="6" class="p-0 border-none">
                          <div :class="isDark ? 'bg-[#003D2E]' : 'bg-[#E8FBF3]'" class="p-8 shadow-inner">
                            <div v-if="loadingGroup === group.label" class="flex justify-center py-6">
                              <div class="w-8 h-8 border-4 border-[#005A48] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <div v-else class="space-y-4">
                              <div v-if="getInvoices(group).length === 0" class="text-[14px] opacity-60 py-4" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
                                {{ currentLang === 'ar' ? 'لا توجد فواتير' : 'No invoices found.' }}
                              </div>
                              <div v-for="(inv, iIdx) in getInvoices(group)" :key="'modal-inv-' + iIdx"
                                class="grid grid-cols-6 items-center border-b pt-4 pb-4"
                                :class="isDark ? 'border-white/5' : 'border-[#b2edd4]'">
                                <div class="flex items-center gap-3">
                                  <input type="checkbox" v-model="inv.selected"
                                    class="custom-checkbox">
                                  <span class="text-[16px] font-normal" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ inv.invoiceNo }}</span>
                                </div>
                                <div class="text-right rtl:text-left font-normal text-[16px]" :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">
                                  <span class="underline underline-offset-4 cursor-pointer">{{ formatInMillions(inv.amount) }}</span>
                                </div>
                                <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age30?.toLocaleString() }}</div>
                                <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age3060?.toLocaleString() }}</div>
                                <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age6090?.toLocaleString() }}</div>
                                <div class="text-right rtl:text-left text-[16px] font-normal" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ inv.age90plus?.toLocaleString() }}</div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                  <tfoot>
                    <tr :class="isDark ? 'bg-[#1D5E54]' : 'bg-[#68E4C4]'" class="transition-all duration-500 text-[14px] font-medium">
                      <td class="px-8 py-5" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}</td>
                      <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatInMillions(summaryTotal.total) }}</td>
                      <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatInMillions(summaryTotal.age30) }}</td>
                      <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatInMillions(summaryTotal.age3060) }}</td>
                      <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatInMillions(summaryTotal.age6090) }}</td>
                      <td class="px-6 py-5 text-right rtl:text-left" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatInMillions(summaryTotal.age90plus) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Cooldown tooltip (fixed → never clipped, no CLS) -->
    <Teleport to="body">
      <div v-if="cooldownTip.show"
        class="fixed z-[10000] pointer-events-none -translate-x-1/2 -translate-y-full px-3 py-2 rounded-lg text-[12px] font-medium shadow-lg bg-[#013E32] text-white whitespace-nowrap"
        :style="{ left: cooldownTip.x + 'px', top: cooldownTip.y + 'px' }">
        {{ currentLang === 'ar' ? 'يمكن إرسال التذكير التالي في' : 'Next reminder can be sent on' }}
        <span class="text-[#5CE5C1]">{{ formatCooldownDate(cooldownTip.date) }}</span>
      </div>
    </Teleport>

    <!-- Error-only toast (fixed → no layout shift) -->
    <Teleport to="body">
      <div v-if="sendStatus.message && sendStatus.type === 'error'"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] px-5 py-3 rounded-xl text-sm shadow-lg bg-red-600 text-white">
        {{ sendStatus.message }}
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const props = defineProps({
  data:     { type: Array,  default: () => [] },
  testDate: { type: String, default: '' }
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const { sendReminders } = useAccountsReceivablePage()

const expandedGroups = ref([])
const isModalOpen    = ref(false)
const loadingGroup   = ref(null)
const invoiceCache   = ref({})
const invoiceHasEmail = ref({}) // has_email per customer label, from /ar-report/customer-details
const sendingKey     = ref(null) // label of the company currently sending (per-group)
const sendStatus     = reactive({ type: '', message: '' })

const currentPage = ref(1)
const itemsPerPage = 10

const arData = computed(() => props.data)

const totalItems = computed(() => arData.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return arData.value.slice(start, end)
})

const pageStart = computed(() => Math.min((currentPage.value - 1) * itemsPerPage + 1, totalItems.value))
const pageEnd = computed(() => Math.min(currentPage.value * itemsPerPage, totalItems.value))

const visiblePages = computed(() => {
    let pages = []
    for (let i = 1; i <= totalPages.value; i++) {
        if (i === 1 || i === totalPages.value || (i >= currentPage.value - 1 && i <= currentPage.value + 1)) {
            pages.push(i)
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...')
        }
    }
    return pages
})

const goToPage = (p) => {
    if (p === '...' || p < 1 || p > totalPages.value) return
    currentPage.value = p
}

const summaryTotal = computed(() => {
  const rows = props.data
  return {
    total:     rows.reduce((s, r) => s + (r.total     ?? 0), 0),
    age30:     rows.reduce((s, r) => s + (r.age30     ?? 0), 0),
    age3060:   rows.reduce((s, r) => s + (r.age3060   ?? 0), 0),
    age6090:   rows.reduce((s, r) => s + (r.age6090   ?? 0), 0),
    age90plus: rows.reduce((s, r) => s + (r.age90plus ?? 0), 0),
  }
})

const toggleGroup = async (group) => {
  if (!group) return
  const pos = expandedGroups.value.indexOf(group.label)
  if (pos > -1) {
    expandedGroups.value.splice(pos, 1)
    return
  }
  expandedGroups.value.push(group.label)

  if (invoiceCache.value[group.label] !== undefined) return

  loadingGroup.value = group.label
  try {
    const res = await useApi('/ar-report/customer-details', {
      params: { test_date: props.testDate, customer_name: group.label }
    })
    if (res?.status === 'success' && Array.isArray(res.data)) {
      invoiceHasEmail.value[group.label] = !!res.has_email
      invoiceCache.value[group.label] = res.data
        .filter(r => !r.isTotal)
        .map(r => ({
          invoiceNo:  r.invoice_no,
          amount:     r.amount,
          dueDate:    r.due_date ?? null,
          invoiceDate: r.date_of_invoice ?? r.invoice_date ?? null,
          age30:      r.bucket_0_30,
          age3060:    r.bucket_31_60,
          age6090:    r.bucket_61_90,
          age90plus:  (r.bucket_91_180 ?? 0) + (r.bucket_181_365 ?? 0) + (r.bucket_365_plus ?? 0),
          on_cooldown:        r.on_cooldown ?? false,
          next_reminder_date: r.next_reminder_date ?? null,
          selected:   false
        }))
    } else {
      invoiceCache.value[group.label] = []
      invoiceHasEmail.value[group.label] = false
    }
  } catch {
    invoiceCache.value[group.label] = []
    invoiceHasEmail.value[group.label] = false
  } finally {
    loadingGroup.value = null
  }
}

const getInvoices = (group) => invoiceCache.value[group?.label] ?? []

// Per-group Select All (was toggling every group's invoices before)
const isGroupAllSelected = (group) => {
  const invs = getInvoices(group).filter(i => !i.on_cooldown)
  return invs.length > 0 && invs.every(i => i.selected)
}
const toggleGroupSelectAll = (group) => {
  const next = !isGroupAllSelected(group)
  getInvoices(group).forEach(inv => { if (!inv.on_cooldown) inv.selected = next })
}

// Does this customer have an email? — from the customer-details response
// fetched when the group was expanded (no separate /customers lookup).
const hasEmail = (group) => !!invoiceHasEmail.value[group?.label]

const emailTooltip = (group) => {
  if (hasEmail(group)) return ''
  return currentLang.value === 'ar'
    ? 'لم تتم إضافة بريد إلكتروني لهذا العميل — أضفه في جهات الاتصال'
    : "Email for this client isn't added — add it in Contacts (Data Source page)"
}

const formatCooldownDate = (d) => {
  if (!d) return ''
  const dt = new Date(d)
  return isNaN(dt) ? d : dt.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Fixed-position cooldown tooltip (escapes the table's overflow clipping, no CLS)
const cooldownTip = reactive({ show: false, x: 0, y: 0, date: '' })
const showCooldownTip = (e, inv) => {
  const r = e.currentTarget.getBoundingClientRect()
  cooldownTip.x = r.left + r.width / 2
  cooldownTip.y = r.top - 8
  cooldownTip.date = inv.next_reminder_date
  cooldownTip.show = true
}
const hideCooldownTip = () => { cooldownTip.show = false }

// Selected count for a single company (this button's group only)
const groupSelectedCount = (group) => getInvoices(group).filter(i => i.selected).length

const flashStatus = (type, message) => {
  sendStatus.type = type
  sendStatus.message = message
  setTimeout(() => { sendStatus.message = '' }, 4000)
}

// Send ONLY this company's selected invoices — independent per company.
const handleSendReminders = async (group) => {
  const selected = getInvoices(group).filter(i => i.selected)
  if (!selected.length) return

  if (!hasEmail(group)) {
    flashStatus('error', currentLang.value === 'ar'
      ? `لا يوجد بريد إلكتروني لـ ${group.label}`
      : `No email on file for ${group.label}`)
    return
  }

  const items = [{
    customer: group.label,
    invoices: selected.map(i => ({
      invoice_no: i.invoiceNo,
      amount:     i.amount,
      due_date:   i.dueDate,
      invoice_date: i.invoiceDate,
    })),
  }]

  sendingKey.value = group.label
  sendStatus.message = ''
  try {
    const res = await sendReminders(items)
    if (!res.ok) {
      flashStatus('error', res.message)
      return
    }
    const r = res.results[0] ?? {}
    // Success + cooldown need no banner — the greyed row + hover tooltip is the
    // feedback. Only surface a hard "no email" case as a brief fixed toast.
    if (r.status === 'no_email') {
      flashStatus('error', currentLang.value === 'ar' ? 'لا يوجد بريد لهذا العميل' : 'No email on file for this customer.')
    }

    // Grey the invoices (sent OR already-on-cooldown) so the tooltip shows
    // immediately instead of the banner re-appearing. Skip when no email.
    if (r.status !== 'no_email') {
      const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
      const tISO = tomorrow.toISOString().slice(0, 10)
      getInvoices(group).forEach(i => {
        if (i.selected) { i.on_cooldown = true; i.next_reminder_date = tISO }
        i.selected = false
      })
    }
  } finally {
    sendingKey.value = null
  }
}
</script>

<style scoped>
.custom-checkbox {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid #b3b3b3;
  background-color: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  margin: 0;
  outline: none;
}

:deep(.dark) .custom-checkbox {
  border-color: rgba(255, 255, 255, 0.3);
}

.custom-checkbox:checked {
  background-color: #008864;
  border-color: #008864;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 7.5L5.5 10L11 4' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;
}

.custom-checkbox:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }
</style>
