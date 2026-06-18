<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isDark: {
    type: Boolean,
    default: false
  },
  currentLang: {
    type: String,
    default: 'en'
  },
  varianceData: {
    type: Array,
    default: () => [
      {
        slNo: '001',
        projectName: 'SST 055 - Yas Driving Academy',
        type: 'changed',
        statusFrom: 'Closed',
        statusTo: 'Active',
        projectValueFrom: '1,200,000',
        projectValueTo: '1,200,000',
        variationFrom: '1,200,000',
        variationTo: '1,200,000',
        vatFrom: '1,200,000',
        vatTo: '1,200,000'
      },
      {
        slNo: '002',
        projectName: 'SST 62 - AGTECH Park Green House',
        type: 'added',
        statusFrom: null,
        statusTo: 'Closed',
        projectValueFrom: null,
        projectValueTo: '1,200,000',
        variationFrom: null,
        variationTo: '1,200,000',
        vatFrom: null,
        vatTo: '1,200,000'
      },
      {
        slNo: '003',
        projectName: 'SST 62 - AGTECH Park Green House',
        type: 'removed',
        statusFrom: 'Closed',
        statusTo: null,
        projectValueFrom: '1,200,000',
        projectValueTo: null,
        variationFrom: '1,200,000',
        variationTo: null,
        vatFrom: '1,200,000',
        vatTo: null
      }
    ]
  }
});

const emit = defineEmits(['close', 'confirm']);

const close = () => {
  emit('close');
};

const confirm = () => {
  emit('confirm');
  close();
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close"></div>

    <!-- Modal Content -->
    <div class="relative w-full max-w-[1000px] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col"
         :class="isDark ? 'bg-[#013E32] text-white border border-[#00B794]/30' : 'bg-white text-gray-900 border border-gray-200'">
      
      <!-- Header -->
      <div class="p-6 pb-4 relative">
        <button @click="close" class="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 class="text-[22px] font-medium" :class="isDark ? 'text-white' : 'text-gray-900'">Cost Center Master Variance</h2>
        <p class="text-[15px] font-medium mt-1" :class="isDark ? 'text-white/80' : 'text-gray-800'">Variance detected — review before replacing</p>
        <p class="text-[14px] mt-1" :class="isDark ? 'text-white/60' : 'text-gray-500'">Differences found between your uploaded file and the current document</p>
      </div>

      <div class="px-6 flex-1 overflow-y-auto">
        <!-- Alert Banner -->
        <div class="bg-[#FFF8E6] border border-[#FEEFC3] rounded-lg p-3 flex items-start gap-2 mb-4">
          <svg class="text-[#D97706] mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p class="text-[13px] text-[#B45309]">
            <span class="font-bold">3 differences found.</span> Confirm to replace the existing document.
          </p>
        </div>

        <!-- Filters / Badges -->
        <div class="flex gap-3 mb-4">
          <span class="px-3 py-1 bg-[#FEF3C7] text-[#D97706] text-[13px] font-medium rounded-full">1 Changed</span>
          <span class="px-3 py-1 bg-[#D1FAE5] text-[#059669] text-[13px] font-medium rounded-full">1 Added</span>
          <span class="px-3 py-1 bg-[#FCE7F3] text-[#BE185D] text-[13px] font-medium rounded-full">1 Removed</span>
        </div>

        <!-- Table -->
        <div class="rounded-lg overflow-hidden border border-gray-200 mb-6" :class="isDark ? 'border-white/10' : ''">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#00896A] text-white">
                <th class="px-4 py-3 text-[13px] font-medium">SL No.</th>
                <th class="px-4 py-3 text-[13px] font-medium">Project Name</th>
                <th class="px-4 py-3 text-[13px] font-medium">Status</th>
                <th class="px-4 py-3 text-[13px] font-medium text-center">Project Value</th>
                <th class="px-4 py-3 text-[13px] font-medium text-center">Variation</th>
                <th class="px-4 py-3 text-[13px] font-medium text-center">VAT</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in varianceData" :key="idx" 
                  :class="{
                    'bg-[#FEF9C3]/40': row.type === 'changed',
                    'bg-[#D1FAE5]/40': row.type === 'added',
                    'bg-[#FCE7F3]/40': row.type === 'removed',
                  }">
                <td class="px-4 py-4 text-[13px] border-b border-white/40 align-top">{{ row.slNo }}</td>
                <td class="px-4 py-4 text-[13px] font-medium border-b border-white/40 align-top">{{ row.projectName }}</td>
                
                <td class="px-4 py-4 text-[13px] border-b border-white/40">
                  <div class="flex flex-col items-center gap-1 w-max">
                    <span v-if="row.statusFrom" class="px-3 py-1 bg-gray-200/60 text-gray-600 rounded-full text-[12px] whitespace-nowrap">{{ row.statusFrom }}</span>
                    <svg v-if="row.type === 'changed'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                    <span v-if="row.statusTo" class="px-3 py-1 bg-[#A7F3D0]/80 text-[#065F46] rounded-full text-[12px] whitespace-nowrap">{{ row.statusTo }}</span>
                  </div>
                </td>
                
                <td class="px-4 py-4 text-[13px] border-b border-white/40 text-center">
                  <div class="flex flex-col items-center gap-1">
                    <span v-if="row.projectValueFrom" class="text-gray-600">{{ row.projectValueFrom }}</span>
                    <svg v-if="row.type === 'changed'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                    <span v-if="row.projectValueTo" class="text-gray-800">{{ row.projectValueTo }}</span>
                  </div>
                </td>
                
                <td class="px-4 py-4 text-[13px] border-b border-white/40 text-center">
                  <div class="flex flex-col items-center gap-1">
                    <span v-if="row.variationFrom" class="text-gray-600">{{ row.variationFrom }}</span>
                    <svg v-if="row.type === 'changed'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                    <span v-if="row.variationTo" class="text-gray-800">{{ row.variationTo }}</span>
                  </div>
                </td>
                
                <td class="px-4 py-4 text-[13px] border-b border-white/40 text-center">
                  <div class="flex flex-col items-center gap-1">
                    <span v-if="row.vatFrom" class="text-gray-600">{{ row.vatFrom }}</span>
                    <svg v-if="row.type === 'changed'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                    <span v-if="row.vatTo" class="text-gray-800">{{ row.vatTo }}</span>
                  </div>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
        
        <p class="text-[13px] text-gray-600" :class="isDark ? 'text-white/60' : 'text-gray-600'">Once confirmed, this action cannot be undone. The current document will be permanently replaced.</p>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t flex justify-end gap-3 mt-2" :class="isDark ? 'border-white/10' : 'border-gray-100'">
        <button @click="close" class="px-5 py-2.5 rounded-lg border text-[14px] font-medium transition-colors"
                :class="isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-gray-200 text-gray-700 hover:bg-gray-50'">
          Cancel
        </button>
        <button @click="confirm" class="px-5 py-2.5 bg-[#00896A] text-white rounded-lg text-[14px] font-medium hover:bg-[#007056] transition-colors">
          Confirm & Replace
        </button>
      </div>

    </div>
  </div>
</template>
