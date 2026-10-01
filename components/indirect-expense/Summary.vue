<template>
  <div class="w-full overflow-hidden transition-all duration-500 rounded-3xl"
    :class="isDark ? 'bg-[#00141080]' : 'bg-white shadow-sm'">
    
    <div class="lg:px-8 px-4 py-5 flex justify-between items-center text-left rtl:text-right sticky top-0 z-30 rounded-t-3xl" :class="isDark ? 'bg-[#001410]' : 'bg-white'">
      <div>
        <p class="text-[16px] font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
          {{ currentLang === 'ar' ? 'ملخص المصروفات غير المباشرة' : 'Indirect Expense Summary' }}
        </p>
        <p class="text-[12px] font-normal mt-0.5" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
          {{ valuesNote(false) }}
        </p>
      </div>
      <div class="flex items-center gap-3">
        <CommonInfoTooltip tip="indirectExpense.summary" align="right" />
        <img :src="isDark ? '/images/icons/expand-white.svg' : '/images/icons/expand-dark.svg'" alt="Expand Icon" class="w-6 h-6 cursor-pointer opacity-80 hover:opacity-100 transition-opacity" @click="isModalOpen = true" />
      </div>
    </div>

    <div class="w-full max-w-full overflow-auto custom-scrollbar relative" :style="scrollStyle">
      <div v-if="error" class="flex items-center justify-center bg-red-50/10 backdrop-blur-[2px] py-16">
        <div class="flex flex-col items-center gap-3 text-center px-6">
          <p class="text-sm font-medium text-red-600">{{ currentLang === 'ar' ? 'فشل تحميل البيانات.' : 'Failed to load data.' }}</p>
        </div>
      </div>

      <table v-else class="w-full text-left rtl:text-right border-collapse lg:min-w-full min-w-[1100px] table-fixed">
        <colgroup>
          <col style="width: 25%" />
          <col style="width: 15%" />
          <col style="width: 15%" />
          <col style="width: 15%" />
          <col style="width: 15%" />
          <col style="width: 15%" />
        </colgroup>
        <thead class="text-white sticky top-0 z-20 shadow-sm" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
          <tr>
            <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'المصروفات غير المباشرة' : 'Indirect Expenses' }}</th>
            <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}</th>
            <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'السنة الماضية' : 'Previous Year' }}</th>
            <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</th>
            <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'الانحراف' : 'Variance' }}</th>
            <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'المتبقي من السنة' : 'Year to Go' }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading Skeletons -->
          <template v-if="loading">
            <tr v-for="n in FIXED_ROWS" :key="'skel-row-' + n" class="border-b animate-pulse" :class="isDark ? 'border-white/5' : 'border-[#F2F2F2]'">
              <td class="px-8 py-5">
                <div class="h-[14px] rounded" :class="[isDark ? 'bg-white/10' : 'bg-gray-200', n % 2 ? 'w-44' : 'w-56']"></div>
              </td>
              <td v-for="c in 3" :key="'skel-col-' + c" class="px-6 py-5 text-right rtl:text-left">
                <div class="h-[14px] w-20 rounded inline-block ml-auto rtl:ml-0 rtl:mr-auto" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div>
              </td>
              <td class="px-6 py-5 text-right rtl:text-left">
                <div class="h-[24px] w-16 rounded-full inline-block ml-auto rtl:ml-0 rtl:mr-auto" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div>
              </td>
              <td class="px-6 py-5 text-right rtl:text-left">
                <div class="h-[24px] w-16 rounded-full inline-block ml-auto rtl:ml-0 rtl:mr-auto" :class="isDark ? 'bg-white/10' : 'bg-gray-200'"></div>
              </td>
            </tr>
          </template>

          <!-- Real Data Rows -->
          <template v-else>
            <template v-for="(item, idx) in mainRows" :key="'row-' + idx">
              <tr class="transition-all duration-500 border-b"
                :class="isDark ? 'border-white/5 hover:bg-white/5' : 'border-[#F2F2F2] hover:bg-gray-50'">
                <td class="px-8 py-5">
                  <div class="flex items-center gap-2 cursor-pointer" @click="toggleExpand(item)">
                    <span class="font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang === 'ar' ? item.labelAr : item.label }}</span>
                    <svg class="w-2.5 h-2.5 transition-transform duration-300" :class="[expanded[item.label] ? 'rotate-180' : '', isDark ? 'text-white/70' : 'text-[#333333]']" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z" /></svg>
                  </div>
                </td>
                <td class="px-6 py-5 text-right rtl:text-left font-semibold tabular-nums text-[14px]" :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">{{ item.currentYear }}</td>
                <td class="px-6 py-5 text-right rtl:text-left font-normal tabular-nums text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ item.previousYear }}</td>
                <td class="px-6 py-5 text-right rtl:text-left font-normal tabular-nums text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ item.budget }}</td>
                <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]">
                  <span class="inline-block px-3 py-1 text-[13px] font-medium tabular-nums" style="border-radius: 19px;"
                    :class="item.variance >= 0
                    ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#68E4C4] text-[#008864]')
                    : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                    {{ item.variance >= 0 ? '+' : '' }}{{ item.variance }}%
                  </span>
                </td>
                <td class="px-6 py-5 text-right rtl:text-left">
                  <div class="inline-flex justify-end rtl:justify-start">
                    <div class="relative w-[65px] h-[32px] overflow-hidden">
                      <svg viewBox="0 0 100 50" class="w-full h-full">
                        <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="isDark ? '#FFFFFF20' : '#E5E7EB'" stroke-width="12" stroke-linecap="round" />
                        <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="gaugeColor(item.yearToGo)" stroke-width="12" stroke-linecap="round"
                          :stroke-dasharray="251" :stroke-dashoffset="251 - (251 * item.yearToGo / 100)" />
                      </svg>
                      <div class="absolute inset-x-0 bottom-0 text-[10px] text-center font-bold tabular-nums" :class="isDark ? 'text-white' : 'text-[#333333]'">
                        {{ item.yearToGo }}%
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Ledger sub-rows (drill-down) -->
              <template v-if="expanded[item.label]">
                <!-- 2-Row Animated Pulse Skeleton when loading drilldown -->
                <template v-if="expanded[item.label].loading">
                  <tr v-for="sk in 2" :key="'exp-skel-' + item.label + sk" class="border-b animate-pulse" :class="isDark ? 'bg-[#04C18F1A] border-white/10' : 'bg-[#A1E2D2]/40 border-white'">
                    <td class="px-12 py-4">
                      <div class="h-[14px] rounded" :class="[isDark ? 'bg-white/20' : 'bg-black/15', sk === 1 ? 'w-36' : 'w-48']"></div>
                    </td>
                    <td class="px-6 py-4 text-right rtl:text-left">
                      <div class="h-[14px] w-16 rounded inline-block ml-auto rtl:ml-0 rtl:mr-auto" :class="isDark ? 'bg-white/20' : 'bg-black/15'"></div>
                    </td>
                    <td class="px-6 py-4 text-right rtl:text-left">
                      <div class="h-[14px] w-16 rounded inline-block ml-auto rtl:ml-0 rtl:mr-auto" :class="isDark ? 'bg-white/20' : 'bg-black/15'"></div>
                    </td>
                    <td v-for="c in 3" :key="'exp-skel-dash-' + c" class="px-6 py-4 text-right rtl:text-left text-[13px]" :class="isDark ? 'text-white/30' : 'text-black/30'">
                      -
                    </td>
                  </tr>
                </template>

                <tr v-else-if="expanded[item.label].error" :class="isDark ? 'bg-[#04C18F1A]' : 'bg-[#A1E2D2]/40'">
                  <td colspan="6" class="px-12 py-3 text-[13px] text-red-500">{{ expanded[item.label].error }}</td>
                </tr>
                <tr v-else-if="!expanded[item.label].rows.length" :class="isDark ? 'bg-[#04C18F1A]' : 'bg-[#A1E2D2]/40'">
                  <td colspan="6" class="px-12 py-3 text-[13px]" :class="isDark ? 'text-white/60' : 'text-black/60'">{{ currentLang === 'ar' ? 'لا توجد دفاتر لهذه الفترة' : 'No ledgers for this period' }}</td>
                </tr>
                <tr v-else v-for="led in expanded[item.label].rows" :key="item.label + led.name"
                  class="border-b" :class="isDark ? 'bg-[#04C18F1A] border-white/10' : 'bg-[#A1E2D2]/60 border-white'">
                  <td class="px-12 py-4">
                    <button class="text-[13px] font-medium underline underline-offset-2 hover:opacity-70 transition-opacity" :class="isDark ? 'text-white' : 'text-[#013e32]'"
                      :title="currentLang === 'ar' ? 'عرض دفتر الأستاذ' : 'View Ledger'" @click="openLedger(led.name)">
                      {{ led.name }}
                    </button>
                  </td>
                  <td class="px-6 py-4 text-right rtl:text-left text-[13px] font-medium tabular-nums" :class="isDark ? 'text-white/90' : 'text-black'">{{ led.currentYear }}</td>
                  <td class="px-6 py-4 text-right rtl:text-left text-[13px] font-medium tabular-nums" :class="isDark ? 'text-white/90' : 'text-black'">{{ led.previousYear }}</td>
                  <td class="px-6 py-4 text-right rtl:text-left text-[13px]" :class="isDark ? 'text-white/50' : 'text-black/50'">{{ led.budget }}</td>
                  <td class="px-6 py-4 text-right rtl:text-left text-[13px] font-medium">
                    <span class="inline-block px-2.5 py-0.5 text-[12px] font-medium tabular-nums" style="border-radius: 19px;"
                      :class="led.variance >= 0
                      ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#68E4C4] text-[#008864]')
                      : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                      {{ led.variance >= 0 ? '+' : '' }}{{ led.variance }}%
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right rtl:text-left text-[13px]" :class="isDark ? 'text-white/50' : 'text-black/50'">-</td>
                </tr>
              </template>
            </template>

            <!-- Filler empty space to keep fixed 6-row height -->
            <tr v-if="fillerHeight" aria-hidden="true">
              <td colspan="6" class="p-0" :style="{ height: `${fillerHeight}px` }"></td>
            </tr>
          </template>
        </tbody>

        <!-- Persistent Green Total Row in tfoot -->
        <tfoot>
          <tr v-if="loading" :class="isDark ? 'bg-[#1D5E54]' : 'bg-[#68E4C4]'" class="transition-all duration-500 text-[14px] font-medium animate-pulse">
            <td class="px-8 py-5" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? 'الإجمالي' : 'Total' }}</td>
            <td v-for="c in 3" :key="'tot-sk-' + c" class="px-6 py-5 text-right rtl:text-left">
              <div class="h-[14px] w-20 rounded inline-block ml-auto rtl:ml-0 rtl:mr-auto" :class="isDark ? 'bg-white/20' : 'bg-[#008864]/20'"></div>
            </td>
            <td class="px-6 py-5 text-right rtl:text-left">
              <div class="h-[24px] w-16 rounded-full inline-block ml-auto rtl:ml-0 rtl:mr-auto" :class="isDark ? 'bg-white/20' : 'bg-[#008864]/20'"></div>
            </td>
            <td class="px-6 py-5 text-right rtl:text-left">
              <div class="h-[24px] w-16 rounded-full inline-block ml-auto rtl:ml-0 rtl:mr-auto" :class="isDark ? 'bg-white/20' : 'bg-[#008864]/20'"></div>
            </td>
          </tr>
          <tr v-else-if="totalRow" :class="isDark ? 'bg-[#1D5E54]' : 'bg-[#68E4C4]'" class="transition-all duration-500 text-[14px] font-semibold">
            <td class="px-8 py-5" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? totalRow.labelAr : totalRow.label }}</td>
            <td class="px-6 py-5 text-right rtl:text-left tabular-nums font-semibold" :class="isDark ? 'text-white' : 'text-[#000]'">{{ totalRow.currentYear }}</td>
            <td class="px-6 py-5 text-right rtl:text-left tabular-nums font-semibold" :class="isDark ? 'text-white' : 'text-[#000]'">{{ totalRow.previousYear }}</td>
            <td class="px-6 py-5 text-right rtl:text-left tabular-nums font-semibold" :class="isDark ? 'text-white' : 'text-[#000]'">{{ totalRow.budget }}</td>
            <td class="px-6 py-5 text-right rtl:text-left font-semibold">
              <span class="inline-block px-3 py-1 text-[13px] font-semibold tabular-nums" style="border-radius: 19px;"
                :class="totalRow.variance >= 0
                ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-white/60 text-[#008864]')
                : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                {{ totalRow.variance >= 0 ? '+' : '' }}{{ totalRow.variance }}%
              </span>
            </td>
            <td class="px-6 py-5 text-right rtl:text-left">
              <div class="inline-flex justify-end rtl:justify-start">
                <div class="relative w-[65px] h-[32px] overflow-hidden" v-if="totalRow.yearToGo > 0">
                  <svg viewBox="0 0 100 50" class="w-full h-full">
                    <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="isDark ? '#FFFFFF20' : '#E5E7EB'" stroke-width="12" stroke-linecap="round" />
                    <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="gaugeColor(totalRow.yearToGo)" stroke-width="12" stroke-linecap="round"
                      :stroke-dasharray="251" :stroke-dashoffset="251 - (251 * totalRow.yearToGo / 100)" />
                  </svg>
                  <div class="absolute inset-x-0 bottom-0 text-[10px] text-center font-bold tabular-nums" :class="isDark ? 'text-white' : 'text-[#333333]'">
                    {{ totalRow.yearToGo }}%
                  </div>
                </div>
                <span v-else class="text-[13px]" :class="isDark ? 'text-white/60' : 'text-black/60'">-</span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <div class="w-full max-h-[78vh] rounded-xl flex flex-col overflow-hidden shadow-2xl" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" style="max-width: 1500px; margin: 0 15px;">
          <div class="flex justify-between items-center py-6 px-8 border-b" :class="isDark ? 'border-white/5' : 'border-gray-100'">
            <div>
              <p class="text-lg font-medium" :class="isDark ? 'text-[#00C9A2]' : 'text-[#013e32]'">
                {{ currentLang === 'ar' ? 'ملخص المصروفات غير المباشرة' : 'Indirect Expense Summary' }}
              </p>
              <p class="text-xs font-normal mt-1" :class="isDark ? 'text-white/60' : 'text-[#00000096]'">
                {{ valuesNote(false) }}
              </p>
            </div>
            <button @click="isModalOpen = false" class="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors flex-shrink-0" :class="isDark ? 'text-white' : 'text-[#013e32]'" :title="currentLang === 'ar' ? 'إغلاق' : 'Close'">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-width="2" stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="overflow-y-auto w-full custom-scrollbar flex-1 min-h-0 relative"
            :class="isDark ? 'bg-[#00141080]' : 'bg-[#fff]'">
            <table class="w-full text-left rtl:text-right border-collapse lg:min-w-full min-w-[1100px] table-fixed">
              <colgroup>
                <col style="width: 25%" />
                <col style="width: 15%" />
                <col style="width: 15%" />
                <col style="width: 15%" />
                <col style="width: 15%" />
                <col style="width: 15%" />
              </colgroup>
              <thead class="text-white sticky top-0 z-20 shadow-sm" :class="isDark ? 'bg-[#002B21]' : 'bg-[#008864]'">
                <tr>
                  <th class="px-8 py-5 font-medium text-[14px]">{{ currentLang === 'ar' ? 'المصروفات غير المباشرة' : 'Indirect Expenses' }}</th>
                  <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'السنة الحالية' : 'Current Year' }}</th>
                  <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'السنة الماضية' : 'Previous Year' }}</th>
                  <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'الميزانية' : 'Budget' }}</th>
                  <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'الانحراف' : 'Variance' }}</th>
                  <th class="px-6 py-5 font-medium text-right rtl:text-left text-[14px]">{{ currentLang === 'ar' ? 'المتبقي من السنة' : 'Year to Go' }}</th>
                </tr>
              </thead>
              <tbody :class="isDark ? 'bg-[#00141080]' : 'bg-white'">
                <template v-for="(item, idx) in mainRows" :key="'modal-' + idx">
                  <tr class="transition-all duration-500 border-b"
                    :class="isDark ? 'border-white/5 hover:bg-white/5' : 'border-[#F2F2F2] hover:bg-gray-50'">
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-2 cursor-pointer" @click="toggleExpand(item)">
                        <span class="font-normal text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ currentLang === 'ar' ? item.labelAr : item.label }}</span>
                        <svg class="w-2.5 h-2.5 transition-transform duration-300" :class="[expanded[item.label] ? 'rotate-180' : '', isDark ? 'text-white/70' : 'text-[#333333]']" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z" /></svg>
                      </div>
                    </td>
                    <td class="px-6 py-5 text-right rtl:text-left font-semibold tabular-nums text-[14px]" :class="isDark ? 'text-[#00FFBC]' : 'text-[#008864]'">{{ item.currentYear }}</td>
                    <td class="px-6 py-5 text-right rtl:text-left font-normal tabular-nums text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ item.previousYear }}</td>
                    <td class="px-6 py-5 text-right rtl:text-left font-normal tabular-nums text-[14px]" :class="isDark ? 'text-white' : 'text-[#333333]'">{{ item.budget }}</td>
                    <td class="px-6 py-5 text-right rtl:text-left font-medium text-[14px]">
                      <span class="inline-block px-3 py-1 text-[13px] font-medium tabular-nums" style="border-radius: 19px;"
                        :class="item.variance >= 0
                        ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#68E4C4] text-[#008864]')
                        : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                        {{ item.variance >= 0 ? '+' : '' }}{{ item.variance }}%
                      </span>
                    </td>
                    <td class="px-6 py-5 text-right rtl:text-left">
                      <div class="inline-flex justify-end rtl:justify-start">
                        <div class="relative w-[65px] h-[32px] overflow-hidden">
                          <svg viewBox="0 0 100 50" class="w-full h-full">
                            <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="isDark ? '#FFFFFF20' : '#E5E7EB'" stroke-width="12" stroke-linecap="round" />
                            <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="gaugeColor(item.yearToGo)" stroke-width="12" stroke-linecap="round"
                              :stroke-dasharray="251" :stroke-dashoffset="251 - (251 * item.yearToGo / 100)" />
                          </svg>
                          <div class="absolute inset-x-0 bottom-0 text-[10px] text-center font-bold tabular-nums" :class="isDark ? 'text-white' : 'text-[#333333]'">
                            {{ item.yearToGo }}%
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Ledger sub-rows (drill-down) -->
                  <template v-if="expanded[item.label]">
                    <template v-if="expanded[item.label].loading">
                      <tr v-for="sk in 2" :key="'modal-exp-skel-' + item.label + sk" class="border-b animate-pulse" :class="isDark ? 'bg-[#04C18F1A] border-white/10' : 'bg-[#A1E2D2]/40 border-white'">
                        <td class="px-12 py-4">
                          <div class="h-[14px] rounded" :class="[isDark ? 'bg-white/20' : 'bg-black/15', sk === 1 ? 'w-36' : 'w-48']"></div>
                        </td>
                        <td class="px-6 py-4 text-right rtl:text-left">
                          <div class="h-[14px] w-16 rounded inline-block ml-auto rtl:ml-0 rtl:mr-auto" :class="isDark ? 'bg-white/20' : 'bg-black/15'"></div>
                        </td>
                        <td class="px-6 py-4 text-right rtl:text-left">
                          <div class="h-[14px] w-16 rounded inline-block ml-auto rtl:ml-0 rtl:mr-auto" :class="isDark ? 'bg-white/20' : 'bg-black/15'"></div>
                        </td>
                        <td v-for="c in 3" :key="'modal-exp-skel-dash-' + c" class="px-6 py-4 text-right rtl:text-left text-[13px]" :class="isDark ? 'text-white/30' : 'text-black/30'">
                          -
                        </td>
                      </tr>
                    </template>

                    <tr v-else-if="expanded[item.label].error" :class="isDark ? 'bg-[#04C18F1A]' : 'bg-[#A1E2D2]/40'">
                      <td colspan="6" class="px-12 py-3 text-[13px] text-red-500">{{ expanded[item.label].error }}</td>
                    </tr>
                    <tr v-else-if="!expanded[item.label].rows.length" :class="isDark ? 'bg-[#04C18F1A]' : 'bg-[#A1E2D2]/40'">
                      <td colspan="6" class="px-12 py-3 text-[13px]" :class="isDark ? 'text-white/60' : 'text-black/60'">{{ currentLang === 'ar' ? 'لا توجد دفاتر لهذه الفترة' : 'No ledgers for this period' }}</td>
                    </tr>
                    <tr v-else v-for="led in expanded[item.label].rows" :key="'modal-' + item.label + led.name"
                      class="border-b" :class="isDark ? 'bg-[#04C18F1A] border-white/10' : 'bg-[#A1E2D2]/60 border-white'">
                      <td class="px-12 py-4">
                        <button class="text-[13px] font-medium underline underline-offset-2 hover:opacity-70 transition-opacity" :class="isDark ? 'text-white' : 'text-[#013e32]'"
                          :title="currentLang === 'ar' ? 'عرض دفتر الأستاذ' : 'View Ledger'" @click="openLedger(led.name)">
                          {{ led.name }}
                        </button>
                      </td>
                      <td class="px-6 py-4 text-right rtl:text-left text-[13px] font-medium tabular-nums" :class="isDark ? 'text-white/90' : 'text-black'">{{ led.currentYear }}</td>
                      <td class="px-6 py-4 text-right rtl:text-left text-[13px] font-medium tabular-nums" :class="isDark ? 'text-white/90' : 'text-black'">{{ led.previousYear }}</td>
                      <td class="px-6 py-4 text-right rtl:text-left text-[13px]" :class="isDark ? 'text-white/50' : 'text-black/50'">{{ led.budget }}</td>
                      <td class="px-6 py-4 text-right rtl:text-left text-[13px] font-medium">
                        <span class="inline-block px-2.5 py-0.5 text-[12px] font-medium tabular-nums" style="border-radius: 19px;"
                          :class="led.variance >= 0
                          ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-[#68E4C4] text-[#008864]')
                          : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                          {{ led.variance >= 0 ? '+' : '' }}{{ led.variance }}%
                        </span>
                      </td>
                      <td class="px-6 py-4 text-right rtl:text-left text-[13px]" :class="isDark ? 'text-white/50' : 'text-black/50'">-</td>
                    </tr>
                  </template>
                </template>
              </tbody>
              <tfoot>
                <tr v-if="totalRow" :class="isDark ? 'bg-[#1D5E54]' : 'bg-[#68E4C4]'" class="transition-all duration-500 text-[14px] font-semibold">
                  <td class="px-8 py-5" :class="isDark ? 'text-white' : 'text-[#000]'">{{ currentLang === 'ar' ? totalRow.labelAr : totalRow.label }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left tabular-nums" :class="isDark ? 'text-white' : 'text-[#000]'">{{ totalRow.currentYear }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left tabular-nums" :class="isDark ? 'text-white' : 'text-[#000]'">{{ totalRow.previousYear }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left tabular-nums" :class="isDark ? 'text-white' : 'text-[#000]'">{{ totalRow.budget }}</td>
                  <td class="px-6 py-5 text-right rtl:text-left font-semibold">
                    <span class="inline-block px-3 py-1 text-[13px] font-semibold tabular-nums" style="border-radius: 19px;"
                      :class="totalRow.variance >= 0
                      ? (isDark ? 'bg-[#00FFBC]/20 text-[#00FFBC]' : 'bg-white/60 text-[#008864]')
                      : (isDark ? 'bg-[#FB7554]/20 text-[#FF582F]' : 'bg-[#FB75544D] text-[#FF582F]')">
                      {{ totalRow.variance >= 0 ? '+' : '' }}{{ totalRow.variance }}%
                    </span>
                  </td>
                  <td class="px-6 py-5 text-right rtl:text-left">
                    <div class="inline-flex justify-end rtl:justify-start">
                      <div class="relative w-[65px] h-[32px] overflow-hidden" v-if="totalRow.yearToGo > 0">
                        <svg viewBox="0 0 100 50" class="w-full h-full">
                          <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="isDark ? '#FFFFFF20' : '#E5E7EB'" stroke-width="12" stroke-linecap="round" />
                          <path d="M 10,50 A 40,40 0 0 1 90,50" fill="none" :stroke="gaugeColor(totalRow.yearToGo)" stroke-width="12" stroke-linecap="round"
                            :stroke-dasharray="251" :stroke-dashoffset="251 - (251 * totalRow.yearToGo / 100)" />
                        </svg>
                        <div class="absolute inset-x-0 bottom-0 text-[10px] text-center font-bold tabular-nums" :class="isDark ? 'text-white' : 'text-[#333333]'">
                          {{ totalRow.yearToGo }}%
                        </div>
                      </div>
                      <span v-else class="text-[13px]" :class="isDark ? 'text-white/60' : 'text-black/60'">-</span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Teleport>

    <CommonLedgerModal
      :is-open="ledgerModalOpen"
      :ledger-name="activeLedger"
      card="indirect-expense"
      @close="ledgerModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { formatStandardNumber } from '~/utils/formatters'
import { useCurrency } from '~/composables/common/useCurrency'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { valuesNote } = useCurrency()

const isModalOpen = ref(false)

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: [String, Object],
    default: null
  }
})

const ROW_HEIGHT = 60
const FIXED_ROWS = 6
const MAX_ROWS = 15

const formatNumber = (val) => {
  if (val === null || val === undefined || val === '') return '0.00'
  const clean = typeof val === 'string' ? val.replace(/,/g, '') : val
  const num = Number(clean)
  if (isNaN(num)) return '0.00'
  return formatStandardNumber(num, 2)
}

const parsePercent = (str) => {
  if (!str) return 0
  return parseFloat(String(str).replace('%', '')) || 0
}

const tableData = computed(() => {
  return props.data.map(item => {
    const isTot = item.isTotal || item.subgroup === 'Total Indirect Expenses'
    return {
      label: item.subgroup,
      labelAr: isTot ? 'إجمالي المصروفات غير المباشرة' : item.subgroup,
      currentYear: formatNumber(item.current_year),
      previousYear: formatNumber(item.previous_year),
      budget: item.budget !== null && item.budget !== undefined ? formatNumber(item.budget) : '-',
      variance: parsePercent(item.variance_percent),
      yearToGo: parsePercent(item.ytg_percent),
      isTotal: isTot
    }
  })
})

const mainRows = computed(() => tableData.value.filter(r => !r.isTotal))

const totalRow = computed(() => {
  const found = tableData.value.find(r => r.isTotal)
  if (found) return found

  if (!mainRows.value.length) return null
  const sumCurrent = mainRows.value.reduce((acc, r) => acc + (Number(String(r.currentYear).replace(/,/g, '')) || 0), 0)
  const sumPrev = mainRows.value.reduce((acc, r) => acc + (Number(String(r.previousYear).replace(/,/g, '')) || 0), 0)
  const v = sumPrev !== 0 ? ((sumCurrent - sumPrev) / sumPrev) * 100 : 0

  return {
    label: currentLang.value === 'ar' ? 'إجمالي المصروفات غير المباشرة' : 'Total Indirect Expenses',
    labelAr: 'إجمالي المصروفات غير المباشرة',
    currentYear: formatStandardNumber(sumCurrent, 2),
    previousYear: formatStandardNumber(sumPrev, 2),
    budget: '-',
    variance: Math.round(v * 100) / 100,
    yearToGo: 0,
    isTotal: true
  }
})

const holdsFixedHeight = computed(() => props.loading || (mainRows.value.length > 0 && mainRows.value.length <= FIXED_ROWS && Object.keys(expanded.value).length === 0))

const scrollStyle = computed(() => {
  const n = mainRows.value.length
  if (holdsFixedHeight.value) return { minHeight: `${(FIXED_ROWS + 2) * ROW_HEIGHT}px` }
  if (n === 0 || Object.keys(expanded.value).length > 0) return {}
  return { maxHeight: `${(MAX_ROWS + 2) * ROW_HEIGHT}px` }
})

const fillerHeight = computed(() => {
  const n = mainRows.value.length
  if (props.loading || n === 0 || n >= FIXED_ROWS || Object.keys(expanded.value).length > 0) return 0
  return (FIXED_ROWS - n) * ROW_HEIGHT
})

const gaugeColor = (value) => {
  if (value >= 50) return '#00d28e'
  if (value >= 25) return '#ffb74d'
  return '#fb7554'
}

// ── Ledger drill-down (Figma) ────────────────────────────────────────────────
const { fetchSubgroupLedgers } = useIndirectExpense()

const expanded = ref({}) // subgroup label → { loading, error, rows }

const toggleExpand = async (item) => {
  const key = item.label
  if (expanded.value[key]) {
    delete expanded.value[key]
    return
  }
  expanded.value = { ...expanded.value, [key]: { loading: true, error: null, rows: [] } }
  try {
    const rows = await fetchSubgroupLedgers(key)
    expanded.value[key] = {
      loading: false,
      error: null,
      rows: (rows || []).filter(r => !r.isTotal).map(r => ({
        name:         r.ledger_name || r.name,
        currentYear:  formatNumber(r.current_year),
        previousYear: formatNumber(r.previous_year),
        budget:       r.budget !== null && r.budget !== undefined ? formatNumber(r.budget) : '-',
        variance:     parsePercent(r.variance_percent || r.variance),
        variancePercent: r.variance_percent || '0%',
        yearToGo:     r.ytg_percent ? parsePercent(r.ytg_percent) : null,
      })),
    }
  } catch (e) {
    expanded.value[key] = { loading: false, error: e?.message ?? 'Failed to load ledgers', rows: [] }
  }
}

// Collapse everything when the page range/data changes
watch(() => props.data, () => { expanded.value = {} })

const ledgerModalOpen = ref(false)
const activeLedger    = ref('')

const openLedger = (name) => {
  activeLedger.value    = name
  ledgerModalOpen.value = true
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
:deep(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }
</style>
