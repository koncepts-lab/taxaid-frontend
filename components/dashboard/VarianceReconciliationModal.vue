<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[99999] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
      <div class="rounded-2xl mt-auto md:mt-0 h-[90vh] md:h-[82vh] max-h-[900px] w-[96vw] md:w-full max-w-5xl shadow-2xl flex flex-col overflow-hidden" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

      <!-- Header & Summary -->
      <div class="shrink-0 border-b shadow-sm" :class="isDark ? 'bg-[#002e26] border-white/10' : 'bg-white border-gray-100'">
        <div class="px-4 md:px-6 py-4 flex justify-between items-start border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
          <div>
            <div class="flex items-center gap-2 text-lg md:text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-800'">
              <svg class="w-6 h-6 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              {{ cfg.title }}
            </div>
            <p class="text-sm mt-2 max-w-2xl" :class="isDark ? 'text-white/60' : 'text-gray-500'">
              {{ cfg.subtitle }}
            </p>
          </div>
          <button @click="closeModal" class="transition-colors cursor-pointer" :class="isDark ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-600'">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="px-4 md:px-6 py-4">
          <div class="border rounded-xl p-4 flex flex-col md:flex-row gap-4 mb-3" :class="isDark ? 'bg-white/5 border-white/10' : 'bg-[#eefdf6] border-[#a7f3d0]'">
            <div class="flex-1 min-w-0">
              <label class="block text-sm font-semibold mb-2" :class="isDark ? 'text-white/70' : 'text-gray-700'">{{ cfg.tbLabel }}</label>
              <input type="text" :value="`${code} ${formatCurrency(balanceTB)}`" readonly class="w-full border rounded-lg px-4 py-2.5 font-medium focus:outline-none" :class="isDark ? 'bg-[#002e26] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'" />
            </div>
            <div class="flex-1 min-w-0">
              <label class="block text-sm font-semibold mb-2" :class="isDark ? 'text-white/70' : 'text-gray-700'">{{ cfg.reportLabel }}</label>
              <input type="text" :value="`${code} ${formatCurrency(balanceReport)}`" readonly class="w-full border rounded-lg px-4 py-2.5 font-medium focus:outline-none" :class="isDark ? 'bg-[#002e26] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'" />
            </div>
            <div class="flex-1 min-w-0">
              <label class="block text-sm font-semibold mb-2" :class="isDark ? 'text-white/70' : 'text-gray-700'">{{ labels.variance }}</label>
              <input type="text" :value="`${code} ${formatCurrency(variance)}`" readonly :class="isResolved ? (isDark ? 'bg-[#047857]/20 border-[#6ee7b7]/40 text-[#6ee7b7]' : 'bg-[#eefdf6] border-[#6ee7b7] text-[#047857]') : (isDark ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-[#fef2f2] border-[#fca5a5] text-red-600')" class="w-full border rounded-lg px-4 py-2.5 font-medium focus:outline-none" />
            </div>
          </div>
          <div v-if="!isResolved" class="flex items-center gap-2 text-sm font-medium" :class="isDark ? 'text-red-400' : 'text-red-500'">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ code }} {{ formatCurrency(variance) }} {{ labels.varianceRemaining }}
          </div>
          <div v-else class="flex items-center gap-2 text-sm font-medium" :class="isDark ? 'text-[#6ee7b7]' : 'text-[#047857]'">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            {{ labels.varianceZero }}
          </div>
        </div>
      </div>

      <!-- Tabs + active section title, same row — only Sales Forecast still has tabs -->
      <div v-if="isSF" class="shrink-0 px-4 md:px-6 pt-3 pb-2 flex flex-wrap items-center justify-between gap-3 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
        <div class="flex items-center gap-2">
          <button v-for="tab in visibleTabs" :key="tab.key" @click="activeTab = tab.key"
            class="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            :class="activeTab === tab.key
              ? (isDark ? 'bg-white/10 text-white' : 'bg-[#eefdf6] text-[#047857]')
              : (isDark ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-700')">
            {{ tab.label }}
            <span v-if="tab.count" class="text-xs px-1.5 py-0.5 rounded-full" :class="isDark ? 'bg-white/10' : 'bg-gray-200'">{{ tab.count }}</span>
          </button>
        </div>
        <div class="flex items-center gap-3">
          <!-- <h3 class="text-base font-bold" :class="isDark ? 'text-white' : 'text-gray-800'">{{ activeTabHeading }}</h3> -->
          <button v-if="activeTab === 'manual'" @click="addManualEntry" class="bg-[#058a64] hover:bg-[#047857] text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            {{ labels.addManualRow }}
          </button>
        </div>
      </div>

      <!-- Content: the only scroll region -->
      <div class="flex-1 overflow-y-auto overflow-x-auto px-4 md:px-6 pb-6" :class="isDark ? 'text-white' : ''">

        <div v-show="activeTab === 'primary'">
          <table class="w-full text-left border-separate border-spacing-0 min-w-[760px]">
            <thead>
              <tr class="text-white text-sm">
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium rounded-ss-lg">{{ labels.date }}</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium">{{ labels.partyName }}</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium">{{ cfg.refColumnLabel }}</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium">{{ labels.amount }} ({{ code }})</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium">{{ labels.select }}</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium">{{ labels.adjustments }} ({{ code }})</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium rounded-se-lg">{{ labels.action }}</th>
              </tr>
            </thead>
            <tbody class="divide-y text-sm" :class="isDark ? 'divide-white/10' : 'divide-gray-100'">
              <tr v-if="voucherRows.length === 0">
                <td colspan="7" class="py-8 px-4 text-center" :class="isDark ? 'text-white/50 bg-[#002e26]' : 'text-gray-500 bg-white'">{{ voucherEmptyMessage }}</td>
              </tr>
              <tr v-for="(row, i) in voucherRows" :key="`${activeTab}-${i}`" class="transition-colors" :class="isDark ? 'hover:bg-white/5 bg-[#002e26]' : 'hover:bg-gray-50 bg-white'">
                <td class="py-3 px-4" :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ rowDate(row) }}</td>
                <td class="py-3 px-4 font-medium" :class="isDark ? 'text-white/80' : 'text-gray-700'">
                  {{ rowParty(row) }}
                  <span v-if="vendorDiff(rowParty(row))" class="block text-xs font-normal" :class="isDark ? 'text-white/40' : 'text-gray-400'">{{ labels.needs }} {{ formatCurrency(vendorDiff(rowParty(row))) }}</span>
                </td>
                <td class="py-3 px-4" :class="isDark ? 'text-white/60' : 'text-gray-600'">{{ rowRef(row) }}</td>
                <td class="py-3 px-4" :class="isDark ? 'text-white/80' : 'text-gray-700'">
                  <span :class="{'line-through text-gray-400 mr-2': voucherState[i].selected && voucherState[i].adjust}">{{ rowAmount(row) }}</span>
                  <span v-if="voucherState[i].selected && voucherState[i].adjust" class="font-bold text-[#058a64]">{{ voucherState[i].adjust }}</span>
                </td>
                <td class="py-3 px-4"><input type="checkbox" v-model="voucherState[i].selected" @change="onRowToggle(voucherState[i])" class="w-4 h-4 rounded text-[#058a64] focus:ring-[#058a64]" :class="isDark ? 'border-white/20 bg-[#002e26]' : 'border-gray-300 bg-white'" /></td>
                <td class="py-2 px-4">
                  <input type="text" v-model="voucherState[i].adjust" :placeholder="voucherState[i].selected ? String(rowAmount(row)) : labels.selectToAdjust" :class="voucherState[i].selected ? (isDark ? 'bg-white/10 rounded-md py-1.5 px-3 text-right text-white' : 'bg-gray-100 rounded-md py-1.5 px-3 text-right text-gray-800') : (isDark ? 'bg-transparent disabled:bg-transparent p-0 text-white/30 placeholder-white/20' : 'bg-transparent disabled:bg-transparent p-0 text-gray-400 placeholder-gray-300')" class="w-full border-none focus:outline-none focus:ring-0 text-sm transition-all" :disabled="!voucherState[i].selected"/>
                </td>
                <td class="py-2 px-4">
                  <span v-if="voucherState[i].selected" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1.5 rounded-md text-sm font-medium w-24 flex items-center justify-center gap-1">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    {{ labels.applied }}
                  </span>
                </td>
              </tr>
              <tr v-if="cfg.showTotalRow && voucherRows.length > 0" class="bg-[#a7f3d0] font-bold text-gray-800">
                <td colspan="3" class="py-3 px-4 text-right">{{ cfg.totalRowLabel }}</td>
                <td class="py-3 px-4">{{ code }} {{ formatCurrency(selectedVoucherTotal) }}</td>
                <td colspan="3"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- AP/AR: resolved per vendor, one table driven by whichever tab is active, same modal underneath -->
        <div v-show="!isSF">
          <table class="w-full text-left border-separate border-spacing-0 min-w-[640px]">
            <thead>
              <tr class="text-white text-sm">
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium rounded-ss-lg">{{ labels.partyName }}</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium text-right">{{ labels.needsCol }} ({{ code }})</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium">{{ labels.status }}</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium rounded-se-lg">{{ labels.action }}</th>
              </tr>
            </thead>
            <tbody class="divide-y text-sm" :class="isDark ? 'divide-white/10' : 'divide-gray-100'">
              <tr v-if="allVendors.length === 0">
                <td colspan="4" class="py-8 px-4 text-center" :class="isDark ? 'text-white/50 bg-[#002e26]' : 'text-gray-500 bg-white'">{{ isAr ? 'لا توجد صفوف فروقات.' : 'No variance rows found.' }}</td>
              </tr>
              <tr v-for="vendor in allVendors" :key="vendor" :class="isDark ? 'hover:bg-white/5 bg-[#002e26]' : 'hover:bg-gray-50 bg-white'">
                <td class="py-3 px-4 font-medium" :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ vendor }}</td>
                <td class="py-3 px-4 text-right" :class="isDark ? 'text-white/80' : 'text-gray-700'">{{ formatCurrency(vendorDiff(vendor)) }}</td>
                <td class="py-3 px-4">
                  <span v-if="vendorResolutions[vendor]" class="bg-[#d1fae5] text-[#047857] border border-[#6ee7b7] px-3 py-1 rounded-md text-xs font-medium">{{ labels.resolved }}</span>
                  <span v-else class="text-xs" :class="isDark ? 'text-white/40' : 'text-gray-400'">{{ labels.pending }}</span>
                </td>
                <td class="py-2 px-4">
                  <button @click="openVendorModal(vendor)" class="bg-[#058a64] hover:bg-[#047857] text-white px-3 py-1.5 rounded-md text-sm font-medium">
                    {{ vendorResolutions[vendor] ? labels.edit : labels.resolveBtn }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-show="activeTab === 'manual'">
          <table class="w-full text-left border-separate border-spacing-0 min-w-[900px]">
            <thead>
              <tr class="text-white text-sm">
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-40 rounded-ss-lg">{{ labels.date }}</th>
                <th v-if="isSF" class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-auto">{{ labels.projectName }}</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-auto">{{ labels.partyName }}</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-36">{{ labels.invoiceNumber }}</th>
                <th v-if="!isSF" class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-28">{{ labels.creditDays }}</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-32">{{ labels.amount }} ({{ code }})</th>
                <th v-if="!isSF" class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-44">{{ labels.type }}</th>
                <th class="sticky top-0 z-10 bg-[#058a64] py-3 px-4 font-medium w-32 text-center rounded-se-lg">{{ labels.action }}</th>
              </tr>
            </thead>
            <tbody class="divide-y text-sm" :class="isDark ? 'divide-white/10' : 'divide-gray-100'">
              <tr v-if="manualEntries.length === 0">
                <td :colspan="isSF ? 6 : 7" class="py-8 px-4 text-center" :class="isDark ? 'text-white/50 bg-[#002e26]' : 'text-gray-500 bg-white'">
                  {{ labels.noManualEntries }}
                </td>
              </tr>
              <tr v-for="(entry, index) in manualEntries" :key="index" :class="isDark ? 'bg-[#002e26]' : 'bg-white'">
                <td class="py-2 px-2">
                  <CommonDateField v-model="entry.date" format="dmy" size="sm" allow-future />
                </td>
                <td v-if="isSF" class="py-2 px-2">
                  <input type="text" v-model="entry.projectName" :placeholder="labels.enterProjectName" class="w-full border rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                </td>
                <td class="py-2 px-2">
                  <CommonSelectDropdown v-if="!isSF" v-model="entry.partyName" mode="select" size="sm" searchable :dark="isDark"
                    :placeholder="cfg.partyPlaceholder" :options="partyOptions" @update:model-value="onEntryPartyChange(entry)" />
                  <input v-else type="text" v-model="entry.partyName" :placeholder="labels.enterCustomerName" class="w-full border rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                </td>
                <td class="py-2 px-2">
                  <CommonSelectDropdown v-if="!isSF" v-model="entry.invoiceNumber" mode="select" size="sm" searchable :dark="isDark"
                    :placeholder="labels.selectInvoice" :options="invoiceOptionsFor(entry.partyName)" :disabled="!entry.partyName" />
                  <input v-else type="text" v-model="entry.invoiceNumber" :placeholder="labels.enterInvoiceNumber" class="w-full border rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                </td>
                <td v-if="!isSF" class="py-2 px-2">
                  <input type="text" v-model="entry.creditDays" :placeholder="labels.creditDaysPlaceholder" class="w-full border rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                </td>
                <td class="py-2 px-2">
                  <input type="text" v-model="entry.amount" placeholder="0.00" class="w-full border rounded-md py-1.5 px-3 text-center focus:outline-none focus:ring-1 focus:ring-[#058a64]" :class="isDark ? 'bg-white/5 border-white/10 text-white/80 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 placeholder-gray-400'" />
                </td>
                <td v-if="!isSF" class="py-2 px-2">
                  <div class="flex items-center gap-2">
                    <button type="button" @click="entry.type = cfg.primaryType" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors" :class="entry.type === cfg.primaryType ? 'bg-[#058a64] text-white' : (isDark ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')">
                      {{ cfg.primaryLabel }}
                    </button>
                    <button type="button" @click="entry.type = 'return'" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors" :class="entry.type === 'return' ? 'bg-[#058a64] text-white' : (isDark ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')">
                      {{ labels.returnLabel }}
                    </button>
                  </div>
                </td>
                <td class="py-2 px-2 text-center">
                  <button @click="removeManualEntry(index)" class="text-red-500 hover:text-red-700 transition-colors font-medium">{{ labels.delete }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- Footer -->
      <div class="shrink-0 px-4 md:px-6 py-4 border-t flex flex-wrap justify-end items-center gap-3" :class="isDark ? 'bg-[#002e26] border-white/10' : 'bg-white'">
        <p v-if="errorMessage" class="text-sm text-red-500 mr-auto">{{ errorMessage }}</p>
        <button @click="closeModal" class="px-4 py-1.5 border rounded-lg font-medium transition-colors text-sm" :class="isDark ? 'border-white/20 text-white/80 hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-50'">
          {{ labels.cancel }}
        </button>
        <button @click="postVariance" :disabled="!canPost || actionLoading" :class="canPost ? 'bg-[#058a64] hover:bg-[#047857] text-white cursor-pointer' : (isDark ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')" class="px-4 py-1.5 rounded-lg font-medium text-sm">
          {{ actionLoading ? labels.posting : labels.postVariance }}
        </button>
      </div>

    </div>
  </div>
  </Teleport>

  <DashboardVendorBillResolutionModal
    v-if="activeVendorModal"
    :side="props.side"
    :party-name="activeVendorModal"
    :needed="vendorDiff(activeVendorModal)"
    :invoices="invoicesByParty[activeVendorModal] || null"
    :purchase-candidates="purchaseCandidatesFor(activeVendorModal)"
    :payment-candidates="paymentCandidatesFor(activeVendorModal)"
    :loading="!invoicesByParty[activeVendorModal]"
    :code="code"
    :is-dark="isDark"
    :tb-balance="vendorTbBalance(activeVendorModal)"
    :ap-balance="vendorApBalance(activeVendorModal)"
    :tb-label="cfg.tbLabel"
    :report-label="cfg.reportLabel"
    :target-date="props.date"
    @close="activeVendorModal = null"
    @resolved="onVendorResolved"
  />
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  side: { type: String, required: true },
  data: { type: Object, required: true },
  date: { type: String, default: null },
});
const emit = defineEmits(['close', 'resolved']);

const SIDE_CONFIG = {
  ap: {
    code: 'AP',
    reportKey: 'Balance as per AP report',
    primaryKey: 'Potential reason for variance - Purchase',
    secondaryKey: 'Payment - Unrecorded Transactions',
    primaryType: 'purchase',
    bulkEndpoint: '/adjustments/ap/bulk',
    typeField: 'transaction_type',
    en: {
      title: 'AP VARIANCE RECONCILIATION',
      subtitle: 'Reconcile differences between Trial Balance and AP Report. All variances must be resolved to zero before posting.',
      tbLabel: 'Balance as per TB',
      reportLabel: 'Balance as per AP report',
      primaryLabel: 'Purchase',
      secondaryLabel: 'Payment',
      refColumnLabel: 'Voucher No.',
      partyPlaceholder: 'Select vendor',
    },
    ar: {
      title: 'تسوية فروقات الحسابات الدائنة',
      subtitle: 'التوفيق بين الفروقات بين ميزان المراجعة وتقرير الحسابات الدائنة. يجب تسوية جميع الفروقات إلى صفر قبل الترحيل.',
      tbLabel: 'الرصيد حسب ميزان المراجعة',
      reportLabel: 'الرصيد حسب تقرير الحسابات الدائنة',
      primaryLabel: 'مشتريات',
      secondaryLabel: 'مدفوعات',
      refColumnLabel: 'رقم السند',
      partyPlaceholder: 'اختر المورد',
    },
  },
  ar: {
    code: 'AR',
    reportKey: 'Balance as per AR report',
    primaryKey: 'Potential reason for variance - Sales',
    secondaryKey: 'Receipt - Unrecorded Transactions',
    primaryType: 'sales',
    bulkEndpoint: '/adjustments/ar/bulk',
    typeField: 'type',
    en: {
      title: 'AR VARIANCE RECONCILIATION',
      subtitle: 'Reconcile differences between Trial Balance and AR Report. All variances must be resolved to zero before posting.',
      tbLabel: 'Balance as per TB',
      reportLabel: 'Balance as per AR report',
      primaryLabel: 'Sales',
      secondaryLabel: 'Receipt',
      refColumnLabel: 'Voucher No.',
      partyPlaceholder: 'Select customer',
    },
    ar: {
      title: 'تسوية فروقات الحسابات المدينة',
      subtitle: 'التوفيق بين الفروقات بين ميزان المراجعة وتقرير الحسابات المدينة. يجب تسوية جميع الفروقات إلى صفر قبل الترحيل.',
      tbLabel: 'الرصيد حسب ميزان المراجعة',
      reportLabel: 'الرصيد حسب تقرير الحسابات المدينة',
      primaryLabel: 'مبيعات',
      secondaryLabel: 'مقبوضات',
      refColumnLabel: 'رقم السند',
      partyPlaceholder: 'اختر العميل',
    },
  },
  'sales-forecast': {
    code: 'SF',
    showTotalRow: true,
    en: {
      title: 'SALES FORECAST VARIANCE',
      subtitle: 'Reconcile discrepancies between forecasted values and actual invoiced revenue.',
      tbLabel: 'Actual Revenue (Invoiced)',
      reportLabel: 'Balance as per sales forecast',
      primaryLabel: 'Reason for variance',
      refColumnLabel: 'Invoice Number',
      totalRowLabel: 'Total sales',
    },
    ar: {
      title: 'فروقات توقعات المبيعات',
      subtitle: 'التوفيق بين القيم المتوقعة والإيرادات الفعلية المفوترة.',
      tbLabel: 'الإيرادات الفعلية (المفوترة)',
      reportLabel: 'الرصيد حسب توقعات المبيعات',
      primaryLabel: 'سبب الفرق',
      refColumnLabel: 'رقم الفاتورة',
      totalRowLabel: 'إجمالي المبيعات',
    },
  },
};
const isSF = computed(() => props.side === 'sales-forecast');
const currentLang = useState('currentLang', () => 'en');
const isAr = computed(() => currentLang.value === 'ar');
const cfg = computed(() => {
  const base = SIDE_CONFIG[props.side];
  return { ...base, ...base[isAr.value ? 'ar' : 'en'] };
});

const partyOptions = ref([]);
const invoicesByParty = ref({});

const loadPartyOptions = async () => {
  if (isSF.value) return;
  try {
    const res = await useApi('/adjustments/parties', { params: { side: props.side } });
    partyOptions.value = res?.data ?? [];
  } catch (e) { /* non-fatal — dropdown just stays empty */ }
};
loadPartyOptions();

const loadInvoicesForParty = async (partyName) => {
  if (!partyName || invoicesByParty.value[partyName]) return;
  try {
    const res = await useApi('/adjustments/invoices', { params: { side: props.side, party_name: partyName } });
    invoicesByParty.value = { ...invoicesByParty.value, [partyName]: res?.data ?? [] };
  } catch (e) { /* non-fatal */ }
};

const invoiceOptionsFor = (partyName) => (invoicesByParty.value[partyName] || []).map((inv) => inv.invoice_number).filter(Boolean);

const onEntryPartyChange = (entry) => {
  entry.invoiceNumber = '';
  loadInvoicesForParty(entry.partyName);
};

// Batch preload every secondary-tab vendor's invoices in one call, right when
// this modal opens — so clicking "Resolve" on any vendor is instant, with no
// per-vendor round trip and no repeat calls on revisit.
const loadInvoicesBatch = async (partyNames) => {
  const names = [...new Set(partyNames)].filter((n) => n && !invoicesByParty.value[n]);
  if (!names.length) return;
  try {
    const res = await useApi('/adjustments/invoices-batch', { params: { side: props.side, party_names: names.join(',') } });
    invoicesByParty.value = { ...invoicesByParty.value, ...(res?.data ?? {}) };
  } catch (e) { /* non-fatal — falls back to per-vendor fetch on open */ }
};

const { isDark } = useTheme();
const { code } = useCurrency();

const baseBalanceTB = ref(0);
const baseBalanceReport = ref(0);
const baseVariance = ref(0);

watch(() => props.data, (d) => {
  if (isSF.value) {
    baseBalanceTB.value = Number(d?.actual_revenue ?? 0);
    baseBalanceReport.value = Number(d?.forecasted_revenue ?? 0);
    baseVariance.value = Math.abs(baseBalanceTB.value - baseBalanceReport.value);
    return;
  }
  baseBalanceTB.value = Number(d?.['Balance as per TB'] ?? 0);
  baseBalanceReport.value = Number(d?.[cfg.value.reportKey] ?? 0);
  baseVariance.value = Number(d?.['Variance'] ?? 0);
}, { immediate: true });

const primaryRows = computed(() => isSF.value ? (props.data?.reasons ?? []) : (props.data?.Vouchers?.[cfg.value.primaryKey] ?? []));
const secondaryRows = computed(() => isSF.value ? [] : (props.data?.Vouchers?.[cfg.value.secondaryKey] ?? []));
const vendorDiffs = computed(() => props.data?.VendorDiffs ?? {});
const vendorDiff = (ledgerName) => vendorDiffs.value[ledgerName] ? Math.abs(Number(vendorDiffs.value[ledgerName])) : 0;
const vendorDiffSigned = (ledgerName) => Number(vendorDiffs.value[ledgerName] ?? 0);

const allVendors = computed(() => [...new Set([
  ...primaryRows.value.map((r) => r.ledger_name),
  ...secondaryRows.value.map((r) => r.ledger_name),
])].sort((a, b) => vendorDiff(b) - vendorDiff(a)));

const purchaseCandidatesFor = (vendor) => primaryRows.value.filter((r) => r.ledger_name === vendor);
const paymentCandidatesFor = (vendor) => secondaryRows.value.filter((r) => r.ledger_name === vendor);

const originalVendorBalances = computed(() => props.data?.VendorBalances ?? {});
const resolvedVendorBalances = ref({});
const vendorApBalance = (vendor) => Number((resolvedVendorBalances.value[vendor] ?? originalVendorBalances.value[vendor])?.report ?? 0);
const vendorTbBalance = (vendor) => Number((resolvedVendorBalances.value[vendor] ?? originalVendorBalances.value[vendor])?.tb ?? 0);

const activeVendorModal = ref(null);
const vendorResolutions = ref({}); // { [vendorName]: { balances } } — backend-confirmed

const openVendorModal = (vendor) => {
  activeVendorModal.value = vendor;
  loadInvoicesForParty(vendor);
};

const onVendorResolved = ({ partyName, balances }) => {
  vendorResolutions.value = { ...vendorResolutions.value, [partyName]: { balances } };
  if (balances) {
    resolvedVendorBalances.value = { ...resolvedVendorBalances.value, [partyName]: balances };
  }
  activeVendorModal.value = null;
};

watch(allVendors, (vendors) => {
  if (vendors.length) loadInvoicesBatch(vendors);
}, { immediate: true });

const rowDate = (row) => isSF.value ? row['Date'] : row.entry_date;
const rowParty = (row) => isSF.value ? row['Party Name'] : row.ledger_name;
const rowRef = (row) => isSF.value ? row['Invoice Number'] : row.voucher_no;
const rowAmount = (row) => isSF.value ? row['Amount'] : row.amount;


// AP/AR show one direct vendor list, no tabs to switch between — only SF
// still has separate Primary/Manual Entry tabs.
const visibleTabs = computed(() => {
  if (!isSF.value) return [];
  const tabs = [];
  if (primaryRows.value.length) tabs.push({ key: 'primary', label: cfg.value.primaryLabel, count: primaryRows.value.length });
  tabs.push({ key: 'manual', label: isAr.value ? 'الإدخال اليدوي' : 'Manual Entry', count: 0 });
  return tabs;
});
const activeTab = ref(null);
watch(visibleTabs, (tabs) => {
  if (!isSF.value) { activeTab.value = 'vendors'; return; }
  if (!tabs.some((t) => t.key === activeTab.value)) {
    activeTab.value = tabs[0]?.key ?? 'manual';
  }
}, { immediate: true });

const activeTabHeading = computed(() => {
  if (activeTab.value === 'primary') return `${cfg.value.primaryLabel} variance`;
  if (activeTab.value === 'secondary') return `${cfg.value.secondaryLabel} - Unrecorded Transactions`;
  return 'Manual entry - Adjustments';
});

const primaryState = ref([]);
const secondaryState = ref([]);

const resetRowState = (rows) => rows.map(() => ({ selected: false, adjust: '', applied: false }));

watch(primaryRows, (rows) => { primaryState.value = resetRowState(rows); }, { immediate: true });
watch(secondaryRows, (rows) => { secondaryState.value = resetRowState(rows); }, { immediate: true });

const voucherRows = computed(() => activeTab.value === 'secondary' ? secondaryRows.value : primaryRows.value);
const voucherState = computed(() => activeTab.value === 'secondary' ? secondaryState.value : primaryState.value);
const voucherEmptyMessage = computed(() => {
  if (isSF.value) return isAr.value ? 'لا توجد صفوف توقعات لهذا التاريخ.' : 'No forecast rows found for this date.';
  return activeTab.value === 'secondary'
    ? `No unrecorded ${cfg.value.secondaryLabel.toLowerCase()} rows found.`
    : `No ${cfg.value.primaryLabel.toLowerCase()}-side variance rows found.`;
});
const selectedVoucherTotal = computed(() =>
  voucherRows.value.reduce((sum, row, i) => voucherState.value[i]?.selected
    ? sum + toNumber(voucherState.value[i].adjust || rowAmount(row))
    : sum, 0)
);

const errorMessage = ref('');

const labels = computed(() => isAr.value ? {
  variance: 'الفرق',
  varianceRemaining: 'فرق متبقٍ - اختر العناصر أدناه لتسوية الفرق.',
  varianceZero: 'تم تسوية الفرق إلى صفر - يمكنك الآن ترحيل الفرق.',
  addManualRow: 'إضافة صف إدخال يدوي',
  date: 'التاريخ',
  partyName: 'اسم الطرف',
  amount: 'المبلغ',
  select: 'تحديد',
  adjustments: 'التسويات',
  action: 'إجراء',
  needs: 'يحتاج',
  selectToAdjust: 'اختر للتسوية',
  applied: 'مُطبّق',
  needsCol: 'المطلوب',
  status: 'الحالة',
  resolved: 'تمت التسوية',
  pending: 'قيد الانتظار',
  edit: 'تعديل',
  resolveBtn: 'تسوية',
  noManualEntries: 'لا توجد إدخالات يدوية. انقر على «إضافة صف إدخال يدوي» لإضافة واحد.',
  projectName: 'اسم المشروع',
  invoiceNumber: 'رقم الفاتورة',
  creditDays: 'أيام الائتمان',
  type: 'النوع',
  enterProjectName: 'أدخل اسم المشروع',
  enterCustomerName: 'أدخل اسم العميل',
  selectInvoice: 'اختر الفاتورة',
  enterInvoiceNumber: 'أدخل رقم الفاتورة',
  creditDaysPlaceholder: 'مثال: 30',
  returnLabel: 'مرتجع',
  delete: 'حذف',
  cancel: 'إلغاء',
  posting: 'جارٍ الترحيل...',
  postVariance: 'ترحيل الفرق',
} : {
  variance: 'Variance',
  varianceRemaining: 'variance remaining - Select items below to resolve the variance.',
  varianceZero: 'Variance resolved to zero - you can now post the variance.',
  addManualRow: 'Add Manual Entry Row',
  date: 'Date',
  partyName: 'Party Name',
  amount: 'Amount',
  select: 'Select',
  adjustments: 'Adjustments',
  action: 'Action',
  needs: 'needs',
  selectToAdjust: 'Select to adjust',
  applied: 'Applied',
  needsCol: 'Needs',
  status: 'Status',
  resolved: 'Resolved',
  pending: 'Pending',
  edit: 'Edit',
  resolveBtn: 'Resolve',
  noManualEntries: 'No manual entries. Click "Add Manual Entry Row" to add one.',
  projectName: 'Project Name',
  invoiceNumber: 'Invoice Number',
  creditDays: 'Credit Days',
  type: 'Type',
  enterProjectName: 'Enter project name',
  enterCustomerName: 'Enter customer name',
  selectInvoice: 'Select invoice',
  enterInvoiceNumber: 'Enter invoice number',
  creditDaysPlaceholder: 'e.g., 30',
  returnLabel: 'Return',
  delete: 'Delete',
  cancel: 'Cancel',
  posting: 'Posting...',
  postVariance: 'Post Variance',
});

const toNumber = (v) => {
  const n = parseFloat(String(v ?? '').replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
};
const toApiDate = (value) => {
  const v = String(value ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  const m = v.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return v;
};
const extractError = (err) => {
  const data = err?.data || err?.response?._data;
  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    return Array.isArray(first) ? String(first[0]) : String(first);
  }
  return data?.message || err?.message || (isAr.value ? 'حدث خطأ ما' : 'Something went wrong');
};

const closeModal = () => emit('close');

const onRowToggle = (rowState) => {
  if (!rowState.selected) rowState.adjust = '';
};

const manualEntries = ref([]);

const addManualEntry = () => {
  if (isSF.value) {
    manualEntries.value.push({ date: '', projectName: '', partyName: '', invoiceNumber: '', amount: '' });
    return;
  }
  manualEntries.value.push({ date: '', partyName: '', invoiceNumber: '', creditDays: '', amount: '', type: cfg.value.primaryType });
};

const removeManualEntry = (index) => manualEntries.value.splice(index, 1);

const validManualEntries = computed(() => isSF.value
  ? manualEntries.value.filter((e) => e.partyName && e.date && e.invoiceNumber && toNumber(e.amount))
  : manualEntries.value.filter((e) => e.partyName && e.date && toNumber(e.amount))
);

const balanceTB = computed(() => baseBalanceTB.value);

const balanceReport = computed(() => {
  if (isSF.value) {
    let total = baseBalanceReport.value;
    primaryRows.value.forEach((row, i) => {
      if (primaryState.value[i]?.selected) {
        total += toNumber(primaryState.value[i].adjust || rowAmount(row)) - toNumber(rowAmount(row));
      }
    });
    validManualEntries.value.forEach((e) => { total += toNumber(e.amount); });
    return total;
  }
  let total = baseBalanceReport.value;
  Object.entries(resolvedVendorBalances.value).forEach(([vendor, bal]) => {
    const originalReport = Number(originalVendorBalances.value[vendor]?.report ?? 0);
    total += Number(bal.report ?? 0) - originalReport;
  });
  validManualEntries.value.forEach((e) => {
    const amt = toNumber(e.amount);
    total += e.type === 'return' ? -amt : amt;
  });
  return total;
});

const variance = computed(() => {
  if (isSF.value) return Math.abs(balanceTB.value - balanceReport.value);
  let resolvedMagnitude = 0;
  Object.keys(resolvedVendorBalances.value).forEach((vendor) => {
    resolvedMagnitude += Math.abs(vendorDiffSigned(vendor));
  });
  validManualEntries.value.forEach((e) => { resolvedMagnitude += toNumber(e.amount); });
  return baseVariance.value - resolvedMagnitude;
});

const isResolved = computed(() => Math.abs(Number(variance.value)) < 0.005);

const actionLoading = ref(false);

const appliedAdjustments = computed(() => {
  if (!isSF.value) return [];
  const selectedRows = primaryRows.value.filter((_, i) => primaryState.value[i]?.selected);
  return [...selectedRows, ...validManualEntries.value];
});

// Every vendor with a variance needs its own resolution before posting.
const allVendorsResolved = computed(() =>
  allVendors.value.every((v) => vendorResolutions.value[v])
);

const canPost = computed(() => isSF.value
  ? isResolved.value && appliedAdjustments.value.length > 0
  : isResolved.value && allVendors.value.length > 0 && allVendorsResolved.value);

const resolveAlert = async (type) => {
  if (!props.data.alert_id) return;
  await useApi(`/alerts/${props.data.alert_id}/action`, {
    method: 'POST',
    body: { type, action_by: 'Dashboard' },
  });
};

const postVariance = async () => {
  errorMessage.value = '';
  actionLoading.value = true;
  try {
    if (isSF.value) {
      for (let i = 0; i < primaryRows.value.length; i++) {
        if (!primaryState.value[i]?.selected) continue;
        const row = primaryRows.value[i];
        await useApi('/data-source/sales-forecast/update-adjustments', {
          method: 'POST',
          body: {
            date: row['Date'],
            party_name: row['Party Name'],
            invoice_number: row['Invoice Number'],
            original_invoice_number: row['Invoice Number'],
            amount: row['Amount'],
            adjustments: toNumber(primaryState.value[i].adjust || row['Amount']),
            current_date: props.date,
          },
        });
      }
      for (const entry of validManualEntries.value) {
        await useApi('/data-source/sales-forecast/store', {
          method: 'POST',
          body: {
            date: entry.date,
            project_name: entry.projectName,
            party_name: entry.partyName,
            invoice_number: entry.invoiceNumber,
            amount: entry.amount,
          },
        });
      }
    }
    await resolveAlert('resolve');
    emit('resolved');
  } catch (err) {
    errorMessage.value = extractError(err);
  } finally {
    actionLoading.value = false;
  }
};

</script>
