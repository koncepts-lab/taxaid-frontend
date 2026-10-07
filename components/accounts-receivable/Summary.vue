<template>
  <div class="w-full overflow-hidden transition-all duration-500 rounded-3xl"
    :class="isDark ? 'bg-[#002e26]' : 'bg-white shadow-sm'">
    <div class="py-5 lg:px-8 px-4 flex justify-between items-center sticky top-[-32px] z-30 rounded-t-3xl" :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
      <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
        {{ currentLang === 'ar' ? 'ملخص حسابات القبض' : 'Accounts Receivable Summary' }}
      </p>
      <div class="flex items-center gap-4">
        <p class="text-[12px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
          {{ valuesNote(false) }}
        </p>
        <CommonInfoTooltip tip="accountsReceivable.summary" align="right" />
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand Icon" class="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100" @click="isModalOpen = true" />
      </div>
    </div>

    <div class="w-full max-w-full overflow-auto custom-scrollbar relative" :style="scrollStyle">
      <table class="w-full text-left rtl:text-right border-collapse lg:min-w-full min-w-[1000px] table-fixed">
        <colgroup>
            <col style="width: 25%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
        </colgroup>
        <thead class="text-white sticky top-0 z-20" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
          <tr class="transition-all duration-500">
            <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'التفاصيل' : 'Particulars' }}</th>
            <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">
              <div class="flex items-center justify-end rtl:justify-start gap-2">
                {{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}
                <img src="/images/icons/edit-white.svg" class="w-[21px] h-auto" />
              </div>
            </th>
            <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '>30' : '>30' }}</th>
            <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '30-60' : '30-60' }}</th>
            <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '60-90' : '60-90' }}</th>
            <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? '<90' : '<90' }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr v-for="n in FIXED_ROWS" :key="'sk' + n" class="border-b animate-pulse" :class="isDark ? 'border-white/5' : 'border-gray-100'">
              <td class="px-8 py-5"><div class="h-[14px] rounded" :class="[isDark ? 'bg-white/10' : 'bg-gray-200', n % 2 ? 'w-40' : 'w-56']"></div></td>
              <td v-for="c in 5" :key="c" class="px-6 py-5 text-right rtl:text-left"><div class="h-[14px] w-16 ml-auto rtl:ml-0 rtl:mr-auto rounded" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div></td>
            </tr>
          </template>
          <template v-for="group in (loading ? [] : arData)" :key="group.label">
            <!-- Main Group Row -->
            <tr :class="[
                isDark ? 'bg-[#002e26] border-b border-white/10' : 'bg-white border-b border-gray-100',
                'text-[14px] font-medium transition-all duration-500'
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
              <td class="px-6 py-5 text-right rtl:text-left font-semibold tabular-nums text-[14px]" :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">{{ formatStandardNumber(group.total, 2) }}</td>
              <td class="px-6 py-5 text-right rtl:text-left font-medium tabular-nums text-[14px]" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ formatStandardNumber(group.age30, 2) }}</td>
              <td class="px-6 py-5 text-right rtl:text-left font-medium tabular-nums text-[14px]" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ formatStandardNumber(group.age3060, 2) }}</td>
              <td class="px-6 py-5 text-right rtl:text-left font-medium tabular-nums text-[14px]" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ formatStandardNumber(group.age6090, 2) }}</td>
              <td class="px-6 py-5 text-right rtl:text-left font-medium tabular-nums text-[14px]" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ formatStandardNumber(group.age90plus, 2) }}</td>
            </tr>

            <!-- Expandable Invoice Section -->
            <template v-if="expandedGroups.includes(group.label)">
              <!-- Action Bar Row -->
              <tr :class="isDark ? 'bg-black/20' : 'bg-[#A2E8D6]'">
                <td colspan="6" class="lg:px-8 px-4 py-5 border-t border-black/5 dark:border-white/5">
                  <div class="flex justify-between items-center">
                    <div>
                      <h3 class="text-[15px] font-medium mb-2" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
                        {{ currentLang === 'ar' ? 'حدد الفواتير لإرسال التذكيرات' : 'Select invoices to send reminders.' }}
                      </h3>
                      <div class="flex items-center gap-3">
                        <input type="checkbox" :checked="isGroupAllSelected(group)" @change="toggleGroupSelectAll(group)"
                          class="w-[18px] h-[18px] rounded border-2 border-gray-300 text-[#008864] bg-white/20 focus:ring-[#008864]">
                        <span class="text-[14px] font-normal" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">
                          {{ currentLang === 'ar' ? `تحديد الكل (${getInvoices(group).length})` : `Select All (${getInvoices(group).length})` }}
                        </span>
                      </div>
                    </div>
                    <div class="flex flex-col items-end gap-1">
                      <button @click="handleSendReminders(group)"
                        :disabled="sendingKey !== null || groupSelectedCount(group) === 0 || !hasMailSettings || !hasEmail(group)"
                        :title="emailTooltip(group)"
                        class="bg-[#005A48] hover:bg-[#004A3B] text-white px-5 py-2.5 rounded-xl flex items-center gap-3 text-[14px] font-normal transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg v-if="sendingKey === group.label" class="animate-spin shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.25" stroke-width="3" /><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
                        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ currentLang === 'ar' ? `إرسال تذكير (${groupSelectedCount(group)})` : `Send Reminder (${groupSelectedCount(group)})` }}
                      </button>
                      <span v-if="!hasMailSettings" class="text-[12px] text-amber-700">
                        {{ mailSetupTip() }}
                      </span>
                      <span v-else-if="!hasEmail(group)" class="text-[12px] text-amber-700">
                        {{ currentLang === 'ar' ? 'لم تتم إضافة بريد لهذا العميل' : "Email for this client isn't added" }}
                        <a v-if="canOpenCustomers" href="/data-source?tab=contacts&sub=customers" target="_blank"
                          class="underline hover:text-amber-900">
                          {{ currentLang === 'ar' ? 'إضافته هنا' : 'Add it here' }}
                        </a>
                      </span>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Loading Skeleton -->
              <template v-if="loadingGroup === group.label">
                <tr v-for="sk in 4" :key="'inv-sk-' + sk" class="border-t border-black/5 dark:border-white/5 animate-pulse" :class="isDark ? 'bg-black/20' : 'bg-[#A2E8D6]'">
                  <td class="lg:px-8 px-4 py-3.5"><div class="h-[14px] rounded" :class="[isDark ? 'bg-white/20' : 'bg-black/10', sk % 2 ? 'w-32' : 'w-24']"></div></td>
                  <td v-for="c in 5" :key="c" class="lg:px-6 px-4 py-3.5 text-right rtl:text-left"><div class="h-[14px] w-16 ml-auto rtl:ml-0 rtl:mr-auto rounded" :class="isDark ? 'bg-white/20' : 'bg-black/10'"></div></td>
                </tr>
              </template>

              <!-- Empty State -->
              <tr v-else-if="!getInvoices(group).length" :class="isDark ? 'bg-black/20' : 'bg-[#A2E8D6]'">
                <td colspan="6" class="text-center py-6 opacity-60 text-sm border-t border-black/5 dark:border-white/5">
                  {{ currentLang === 'ar' ? 'لا توجد فواتير' : 'No invoices found.' }}
                </td>
              </tr>

              <!-- Native Invoice Rows -->
              <template v-else>
                <tr v-for="(inv, iIdx) in getInvoices(group)" :key="'inv-' + iIdx"
                  class="border-t border-black/5 dark:border-white/5 transition-opacity"
                  :class="[isDark ? 'bg-black/20 hover:bg-black/30' : 'bg-[#A2E8D6] hover:bg-[#8ee0cb]', inv.on_cooldown ? 'opacity-45' : '']">
                  <td class="lg:px-8 px-4 py-3.5">
                    <div class="flex items-center gap-3">
                      <input type="checkbox" v-model="inv.selected" :disabled="inv.on_cooldown"
                        class="w-[18px] h-[18px] rounded border-2 border-gray-300 text-[#008864] bg-white/20 focus:ring-[#008864] shrink-0 disabled:cursor-not-allowed">
                      <span class="text-[14px] font-normal truncate max-w-[200px]"
                        :class="[isDark ? 'text-white' : 'text-[#1A1A1A]', inv.on_cooldown ? 'underline decoration-dotted underline-offset-4 cursor-help' : '']"
                        @mouseenter="inv.on_cooldown && showCooldownTip($event, inv)" @mouseleave="hideCooldownTip">
                        {{ inv.invoiceNo }}
                      </span>
                    </div>
                  </td>
                  <td class="lg:px-6 px-4 py-3.5 text-right rtl:text-left font-semibold text-[14px] tabular-nums"
                    :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">
                    {{ formatStandardNumber(inv.amount, 2) }}
                  </td>
                  <td class="lg:px-6 px-4 py-3.5 text-right rtl:text-left text-[14px] font-normal tabular-nums"
                    :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">
                    {{ formatStandardNumber(inv.age30, 2) }}
                  </td>
                  <td class="lg:px-6 px-4 py-3.5 text-right rtl:text-left text-[14px] font-normal tabular-nums"
                    :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">
                    {{ formatStandardNumber(inv.age3060, 2) }}
                  </td>
                  <td class="lg:px-6 px-4 py-3.5 text-right rtl:text-left text-[14px] font-normal tabular-nums"
                    :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">
                    {{ formatStandardNumber(inv.age6090, 2) }}
                  </td>
                  <td class="lg:px-6 px-4 py-3.5 text-right rtl:text-left text-[14px] font-normal tabular-nums"
                    :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">
                    {{ formatStandardNumber(inv.age90plus, 2) }}
                  </td>
                </tr>
                <template v-if="loadingMore === group.label">
                  <tr v-for="sk in 3" :key="'inv-more-sk-' + sk" class="border-t border-black/5 dark:border-white/5 animate-pulse" :class="isDark ? 'bg-black/20' : 'bg-[#A2E8D6]'">
                    <td class="lg:px-8 px-4 py-3.5"><div class="h-[14px] rounded" :class="[isDark ? 'bg-white/20' : 'bg-black/10', sk % 2 ? 'w-32' : 'w-24']"></div></td>
                    <td v-for="c in 5" :key="c" class="lg:px-6 px-4 py-3.5 text-right rtl:text-left"><div class="h-[14px] w-16 ml-auto rtl:ml-0 rtl:mr-auto rounded" :class="isDark ? 'bg-white/20' : 'bg-black/10'"></div></td>
                  </tr>
                </template>
                <tr v-else-if="invoiceHasMore[group.label]" :class="isDark ? 'bg-black/20' : 'bg-[#A2E8D6]'">
                  <td colspan="6" class="text-center py-3 border-t border-black/5 dark:border-white/5">
                    <button @click="loadMoreInvoices(group)"
                      class="text-[13px] font-medium underline underline-offset-2 hover:opacity-70 transition-opacity"
                      :class="isDark ? 'text-white' : 'text-[#013e32]'">
                      {{ currentLang === 'ar' ? 'تحميل المزيد' : 'Load more' }}
                    </button>
                  </td>
                </tr>
              </template>
            </template>
          </template>
          <tr v-if="fillerHeight" aria-hidden="true">
            <td colspan="6" class="p-0" :style="{ height: `${fillerHeight}px` }"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="loading || summaryTotal" class="w-full max-w-full overflow-x-auto no-scrollbar">
      <table class="w-full text-left rtl:text-right border-collapse lg:min-w-full min-w-[1000px] table-fixed">
        <colgroup>
            <col style="width: 25%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
            <col style="width: 15%" />
        </colgroup>
        <tfoot>
          <tr v-if="loading" :class="isDark ? 'bg-[#1D5E54]' : 'bg-[#68E4C4]'" class="transition-all duration-500 text-[14px] font-medium animate-pulse">
            <td class="px-8 py-5" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}</td>
            <td v-for="c in 5" :key="'tot-sk-' + c" class="px-6 py-5 text-right rtl:text-left">
              <div class="h-[14px] w-20 rounded inline-block ml-auto rtl:ml-0 rtl:mr-auto" :class="isDark ? 'bg-white/20' : 'bg-[#008864]/20'"></div>
            </td>
          </tr>
          <tr v-else-if="summaryTotal" :class="isDark ? 'bg-[#1D5E54]' : 'bg-[#68E4C4]'" class="transition-all duration-500 text-[14px] font-medium">
            <td class="px-8 py-5 font-semibold" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}</td>
            <td class="px-6 py-5 text-right rtl:text-left font-semibold tabular-nums" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatStandardNumber(summaryTotal.total, 2) }}</td>
            <td class="px-6 py-5 text-right rtl:text-left font-semibold tabular-nums" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatStandardNumber(summaryTotal.age30, 2) }}</td>
            <td class="px-6 py-5 text-right rtl:text-left font-semibold tabular-nums" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatStandardNumber(summaryTotal.age3060, 2) }}</td>
            <td class="px-6 py-5 text-right rtl:text-left font-semibold tabular-nums" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatStandardNumber(summaryTotal.age6090, 2) }}</td>
            <td class="px-6 py-5 text-right rtl:text-left font-semibold tabular-nums" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatStandardNumber(summaryTotal.age90plus, 2) }}</td>
          </tr>
        </tfoot>
      </table>
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
                {{ valuesNote(false) }}
              </p>
            </div>
            <button @click="isModalOpen = false" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
              <img src="/images/icons/expand.svg" alt="Close Modal" class="w-5 h-5" :class="[isDark ? 'invert' : '', currentLang === 'ar' ? 'scale-x-[-1]' : '']" />
            </button>
          </div>

          <div class="w-full flex-1 flex flex-col min-h-0 overflow-x-auto overflow-y-hidden no-scrollbar" :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
            <div class="min-w-[1000px] flex flex-col flex-1 min-h-0">
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
                          <img src="/images/icons/edit-white.svg" class="w-[21px] h-auto" />
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
              <div class="overflow-y-auto custom-scrollbar flex-1 min-h-0">
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
                          isDark ? 'bg-[#002e26] border-b border-white/10' : 'bg-white border-b border-gray-100',
                          'text-[14px] font-medium transition-all duration-500'
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
                        <td class="px-6 py-5 text-right rtl:text-left font-semibold tabular-nums text-[14px]" :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">{{ formatStandardNumber(group.total, 2) }}</td>
                        <td class="px-6 py-5 text-right rtl:text-left font-medium tabular-nums text-[14px]" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ formatStandardNumber(group.age30, 2) }}</td>
                        <td class="px-6 py-5 text-right rtl:text-left font-medium tabular-nums text-[14px]" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ formatStandardNumber(group.age3060, 2) }}</td>
                        <td class="px-6 py-5 text-right rtl:text-left font-medium tabular-nums text-[14px]" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ formatStandardNumber(group.age6090, 2) }}</td>
                        <td class="px-6 py-5 text-right rtl:text-left font-medium tabular-nums text-[14px]" :class="isDark ? 'text-white/80' : 'text-[#000] opacity-80'">{{ formatStandardNumber(group.age90plus, 2) }}</td>
                      </tr>

                      <!-- Expandable Invoice Section (modal version) -->
                      <template v-if="expandedGroups.includes(group.label)">
                        <template v-if="loadingGroup === group.label">
                          <tr v-for="sk in 4" :key="'modal-inv-sk-' + sk" class="border-t border-black/5 dark:border-white/5 animate-pulse" :class="isDark ? 'bg-black/20' : 'bg-[#A2E8D6]'">
                            <td class="px-8 py-3.5"><div class="h-[14px] rounded" :class="[isDark ? 'bg-white/20' : 'bg-black/10', sk % 2 ? 'w-32' : 'w-24']"></div></td>
                            <td v-for="c in 5" :key="c" class="px-6 py-3.5 text-right rtl:text-left"><div class="h-[14px] w-16 ml-auto rtl:ml-0 rtl:mr-auto rounded" :class="isDark ? 'bg-white/20' : 'bg-black/10'"></div></td>
                          </tr>
                        </template>
                        <tr v-else-if="!getInvoices(group).length" :class="isDark ? 'bg-black/20' : 'bg-[#A2E8D6]'">
                          <td colspan="6" class="text-center py-6 opacity-60 text-sm border-t border-black/5 dark:border-white/5">
                            {{ currentLang === 'ar' ? 'لا توجد فواتير' : 'No invoices found.' }}
                          </td>
                        </tr>
                        <template v-else>
                          <tr v-for="(inv, iIdx) in getInvoices(group)" :key="'modal-inv-' + iIdx"
                            class="border-t border-black/5 dark:border-white/5 transition-opacity"
                            :class="isDark ? 'bg-black/20 hover:bg-black/30' : 'bg-[#A2E8D6] hover:bg-[#8ee0cb]'">
                            <td class="lg:px-8 px-4 py-3.5">
                              <div class="flex items-center gap-3">
                                <input type="checkbox" v-model="inv.selected"
                                  class="w-[18px] h-[18px] rounded border-2 border-gray-300 text-[#008864] bg-white/20 focus:ring-[#008864] shrink-0">
                                <span class="text-[14px] font-normal truncate max-w-[200px]" :class="isDark ? 'text-white' : 'text-[#1A1A1A]'">{{ inv.invoiceNo }}</span>
                              </div>
                            </td>
                            <td class="lg:px-6 px-4 py-3.5 text-right rtl:text-left font-semibold text-[14px] tabular-nums"
                              :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">{{ formatStandardNumber(inv.amount, 2) }}</td>
                            <td class="lg:px-6 px-4 py-3.5 text-right rtl:text-left text-[14px] font-normal tabular-nums" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ formatStandardNumber(inv.age30, 2) }}</td>
                            <td class="lg:px-6 px-4 py-3.5 text-right rtl:text-left text-[14px] font-normal tabular-nums" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ formatStandardNumber(inv.age3060, 2) }}</td>
                            <td class="lg:px-6 px-4 py-3.5 text-right rtl:text-left text-[14px] font-normal tabular-nums" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ formatStandardNumber(inv.age6090, 2) }}</td>
                            <td class="lg:px-6 px-4 py-3.5 text-right rtl:text-left text-[14px] font-normal tabular-nums" :class="isDark ? 'text-white/80' : 'text-[#1A1A1A]'">{{ formatStandardNumber(inv.age90plus, 2) }}</td>
                          </tr>
                          <template v-if="loadingMore === group.label">
                            <tr v-for="sk in 3" :key="'modal-inv-more-sk-' + sk" class="border-t border-black/5 dark:border-white/5 animate-pulse" :class="isDark ? 'bg-black/20' : 'bg-[#A2E8D6]'">
                              <td class="px-8 py-3.5"><div class="h-[14px] rounded" :class="[isDark ? 'bg-white/20' : 'bg-black/10', sk % 2 ? 'w-32' : 'w-24']"></div></td>
                              <td v-for="c in 5" :key="c" class="px-6 py-3.5 text-right rtl:text-left"><div class="h-[14px] w-16 ml-auto rtl:ml-0 rtl:mr-auto rounded" :class="isDark ? 'bg-white/20' : 'bg-black/10'"></div></td>
                            </tr>
                          </template>
                          <tr v-else-if="invoiceHasMore[group.label]" :class="isDark ? 'bg-black/20' : 'bg-[#A2E8D6]'">
                            <td colspan="6" class="text-center py-3 border-t border-black/5 dark:border-white/5">
                              <button @click="loadMoreInvoices(group)"
                                class="text-[13px] font-medium underline underline-offset-2 hover:opacity-70 transition-opacity"
                                :class="isDark ? 'text-white' : 'text-[#013e32]'">
                                {{ currentLang === 'ar' ? 'تحميل المزيد' : 'Load more' }}
                              </button>
                            </td>
                          </tr>
                        </template>
                      </template>
                    </template>
                  </tbody>
                </table>
              </div>

              <div v-if="summaryTotal" class="shrink-0" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
                <table class="w-full text-left rtl:text-right table-fixed border-collapse">
                  <colgroup>
                      <col style="width: 25%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                      <col style="width: 15%" />
                  </colgroup>
                  <tfoot>
                    <tr :class="isDark ? 'bg-[#1D5E54]' : 'bg-[#68E4C4]'" class="transition-all duration-500 text-[14px] font-semibold">
                      <td class="px-8 py-5" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}</td>
                      <td class="px-6 py-5 text-right rtl:text-left tabular-nums" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatStandardNumber(summaryTotal.total, 2) }}</td>
                      <td class="px-6 py-5 text-right rtl:text-left tabular-nums" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatStandardNumber(summaryTotal.age30, 2) }}</td>
                      <td class="px-6 py-5 text-right rtl:text-left tabular-nums" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatStandardNumber(summaryTotal.age3060, 2) }}</td>
                      <td class="px-6 py-5 text-right rtl:text-left tabular-nums" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatStandardNumber(summaryTotal.age6090, 2) }}</td>
                      <td class="px-6 py-5 text-right rtl:text-left tabular-nums" :class="isDark ? 'text-white' : 'text-[#000]'">{{ formatStandardNumber(summaryTotal.age90plus, 2) }}</td>
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
import { ref, reactive, computed, onMounted, watch } from 'vue'

const props = defineProps({
  data:     { type: Array,  default: () => [] },
  testDate: { type: String, default: '' },
  loading:  { type: Boolean, default: false }
})

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { valuesNote } = useCurrency()

const { sendReminders, fetchCustomerInvoicesBatch, hasMailSettings } = useAccountsReceivablePage()
const { can, contactSubTabs } = usePermissions()
const canOpenCustomers = computed(() => contactSubTabs.value.customers)
const PRELOAD_CUSTOMERS = 10

const expandedGroups = ref([])
const isModalOpen    = ref(false)
const loadingGroup   = ref(null)
const invoiceCache   = ref({})
const invoiceHasEmail = ref({}) // has_email per customer label, from /ar-report/customer-details
const invoicePage    = ref({}) // last page fetched, per customer label
const invoiceHasMore = ref({}) // more invoices to load, per customer label
const loadingMore    = ref(null) // customer label currently loading its next page
const INVOICES_PER_PAGE = 10
const sendingKey     = ref(null) // label of the company currently sending (per-group)
const sendStatus     = reactive({ type: '', message: '' })

const ROW_HEIGHT = 60
const FIXED_ROWS = 6
const MAX_ROWS = 15

const arData = computed(() => props.data)

watch(() => props.data, async (data) => {
  expandedGroups.value = []
  invoiceCache.value = {}
  invoiceHasEmail.value = {}
  invoicePage.value = {}
  invoiceHasMore.value = {}
  loadingGroup.value = null
  loadingMore.value = null

  const firstLabels = (data ?? []).slice(0, PRELOAD_CUSTOMERS).map(g => g.label).filter(Boolean)
  if (!firstLabels.length) return

  const batch = await fetchCustomerInvoicesBatch(firstLabels, INVOICES_PER_PAGE)
  for (const label of firstLabels) {
    const entry = batch[label]
    if (!entry) continue
    invoiceHasEmail.value[label] = !!entry.has_email
    invoiceCache.value[label] = (entry.data || []).filter(r => !r.isTotal).map(mapInvoiceRow)
    invoicePage.value[label] = 1
    invoiceHasMore.value[label] = !!entry.has_more
  }
}, { immediate: true })

// Header and total row count as one row each; expanded invoices lift the cap so the table grows.
const scrollStyle = computed(() => {
  const n = arData.value.length
  if (props.loading) return { minHeight: `${(FIXED_ROWS + 2) * ROW_HEIGHT}px` }
  if (n === 0) return {}
  if (expandedGroups.value.length) return { minHeight: `${(FIXED_ROWS + 2) * ROW_HEIGHT}px` }
  if (n <= FIXED_ROWS) return { minHeight: `${(FIXED_ROWS + 2) * ROW_HEIGHT}px` }
  return { maxHeight: `${(MAX_ROWS + 2) * ROW_HEIGHT}px` }
})

// Empty space under a short list so the total row always sits at the bottom of the fixed-height card.
const fillerHeight = computed(() => {
  const n = arData.value.length
  if (props.loading || n === 0 || n >= FIXED_ROWS || expandedGroups.value.length) return 0
  return (FIXED_ROWS - n) * ROW_HEIGHT
})

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
  expandedGroups.value = [group.label]

  if (invoiceCache.value[group.label] !== undefined) return

  loadingGroup.value = group.label
  try {
    const res = await useApi('/ar-report/customer-details', {
      params: { date: props.testDate, customer_name: group.label, page: 1, per_page: INVOICES_PER_PAGE }
    })
    if (res?.status === 'success' && Array.isArray(res.data)) {
      invoiceHasEmail.value[group.label] = !!res.has_email
      invoiceCache.value[group.label] = res.data.filter(r => !r.isTotal).map(mapInvoiceRow)
      invoicePage.value[group.label] = res.page ?? 1
      invoiceHasMore.value[group.label] = !!res.has_more
    } else {
      invoiceCache.value[group.label] = []
      invoiceHasEmail.value[group.label] = false
      invoiceHasMore.value[group.label] = false
    }
  } catch {
    invoiceCache.value[group.label] = []
    invoiceHasEmail.value[group.label] = false
    invoiceHasMore.value[group.label] = false
  } finally {
    loadingGroup.value = null
  }
}

const mapInvoiceRow = (r) => ({
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
})

const loadMoreInvoices = async (group) => {
  if (!group || loadingMore.value) return
  const label = group.label
  if (!invoiceHasMore.value[label]) return

  loadingMore.value = label
  try {
    const nextPage = (invoicePage.value[label] ?? 1) + 1
    const res = await useApi('/ar-report/customer-details', {
      params: { date: props.testDate, customer_name: label, page: nextPage, per_page: INVOICES_PER_PAGE }
    })
    if (res?.status === 'success' && Array.isArray(res.data)) {
      invoiceCache.value[label] = [...(invoiceCache.value[label] ?? []), ...res.data.filter(r => !r.isTotal).map(mapInvoiceRow)]
      invoicePage.value[label] = res.page ?? nextPage
      invoiceHasMore.value[label] = !!res.has_more
    }
  } catch {
  } finally {
    loadingMore.value = null
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

const mailSetupTip = () => {
  const ar = currentLang.value === 'ar'
  if (can('company_settings.access')) return ar ? 'لم يتم إعداد بريد الشركة. أضفه من إعدادات الشركة.' : 'Company mail is not set up. Go to Company Settings to add it.'
  return ar ? 'لم يتم إعداد بريد الشركة. اطلب من المسؤول (مستخدم لديه صلاحية إعدادات الشركة) إضافته.' : 'Company mail is not set up. Ask your admin (a user with Company Settings access) to add it.'
}

const emailTooltip = (group) => {
  if (!hasMailSettings.value) return mailSetupTip()
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

  if (!hasMailSettings.value) {
    flashStatus('error', mailSetupTip())
    return
  }

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
      const tomorrow = orgTodayDate(); tomorrow.setDate(tomorrow.getDate() + 1)
      const tISO = localIsoDate(tomorrow)
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
