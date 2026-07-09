<template>
  <NuxtLayout name="dashboard">
    <div class="relative z-10 flex h-full overflow-hidden" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <div class="flex-1 overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-0 pt-8">
        
        <div class=" data-source-container pt-8 lg:pt-0">
          <!-- Header -->
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-start gap-4">
              <button @click="router.back()" class="mt-1.5 p-1 rounded-full transition-colors" :class="isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-200 text-gray-700'">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <div>
                <h1 class="font-medium transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#013E32]'" style="font-size: 24px;">
                  {{ currentLang === 'ar' ? 'إدخال البيانات الرئيسية للعميل المحتمل' : 'Contract Master Data Entry' }}
                </h1>
              </div>
            </div>
            <!-- Close icon -->
            <button @click="router.back()" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mx-auto">

          <!-- Section 1: Form Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
            <!-- Row 1 -->
            <div>
              <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Lead ID</label>
              <div class="relative">
                <select class="w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-gray-700 text-sm placeholder-[#717182] appearance-none bg-white">
                  <option value="" disabled selected hidden>1234567</option>
                  <option>1234567</option>
                </select>
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Customer Name</label>
              <input type="text" value="Al Dhabi Real Estate" class="w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-gray-700 text-sm placeholder-[#717182]" />
            </div>

            <!-- Row 2 -->
            <div>
              <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Contract Sign Date</label>
              <div class="relative">
                <input type="text" value="15-03-2025" class="w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-gray-700 text-sm placeholder-[#717182]" />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Project Name</label>
              <input type="text" value="Al Dhabi Real Estate" class="w-full px-4 py-2.5 rounded-lg border border-[#04C18F80] focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F] outline-none text-gray-700 text-sm placeholder-[#717182]" />
            </div>
          </div>

          <!-- Summary Boxes -->
          <div class="grid grid-cols-1 xl:grid-cols-1 gap-6 mb-4">
            <!-- Card 1: Sales -->
            <div class="bg-[#E0F9F3] border border-[#6FDBBF] rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Lead Sales Value</label>
                <input type="text" value="3,854,920.00" class="w-full px-4 py-2.5 rounded-lg bg-white border-none outline-none text-gray-700 text-sm" />
              </div>
              <div>
                <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Final Contract Value</label>
                <input type="text" value="3,804,170.00" class="w-full px-4 py-2.5 rounded-lg bg-white border-none outline-none text-gray-700 text-sm" />
              </div>
              <div>
                <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Sales Variance</label>
                <input type="text" value="50,750.00" class="w-full px-4 py-2.5 rounded-lg border border-[#FCA5A5] bg-[#FEE2E2] outline-none text-[#EF4444] text-sm font-medium" />
              </div>
            </div>

            <!-- Card 2: Budget -->
            <div class="bg-[#E0F9F3] border border-[#6FDBBF] rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Planned Lead Budget</label>
                <input type="text" value="3,854,920.00" class="w-full px-4 py-2.5 rounded-lg bg-white border-none outline-none text-gray-700 text-sm" />
              </div>
              <div>
                <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Current Budget Value</label>
                <input type="text" value="3,804,170.00" class="w-full px-4 py-2.5 rounded-lg bg-white border-none outline-none text-gray-700 text-sm" />
              </div>
              <div>
                <label class="block text-[14px] font-medium text-[#0A0A0A] mb-1.5">Budget Variance</label>
                <input type="text" value="50,750.00" class="w-full px-4 py-2.5 rounded-lg border border-[#FCA5A5] bg-[#FEE2E2] outline-none text-[#EF4444] text-sm font-medium" />
              </div>
            </div>
          </div>

          <!-- Warning Message -->
          <div class="flex items-center gap-2 mb-10 text-[#EF4444] text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Sales variance AED 50,750 unresolved - Budget variance AED 50,750 unresolved— Fill in Final amounts in both tables.</p>
          </div>

          <!-- Section 2: Contract Milestones -->
          <div class="mb-10">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-[18px] font-medium text-[#0A0A0A]">Contract Milestones</h2>
              <button @click="addMilestone" class="flex items-center justify-center gap-2 hover:bg-[#52D1B2] transition-colors" style="background: #68E4C4; width: 204px; height: 40px; border-radius: 8.84px; border: 1px solid #04C18F80; color: #0A0A0A; font-size: 16px; font-weight: 400;">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Milestone
              </button>
            </div>
            
            <div class="w-full overflow-x-auto rounded-t-lg">
              <table class="w-full text-sm text-left">
                <thead class="bg-[#00896F] text-white">
                  <tr>
                    <th class="px-4 py-3 font-medium rounded-tl-lg">Date</th>
                    <th class="px-4 py-3 font-medium">Milestone Details</th>
                    <th class="px-4 py-3 font-medium w-32">Lead</th>
                    <th class="px-4 py-3 font-medium w-32">Final</th>
                    <th class="px-4 py-3 font-medium rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody class="border-b border-gray-100">
                  <tr v-for="(milestone, index) in paginatedMilestones" :key="milestone.id || index" class="border-b border-gray-100/50">
                    <td class="p-2 w-48">
                      <div class="relative">
                        <input type="text" v-model="milestone.date" placeholder="dd-mm-yyyy" style="background: rgb(243, 243, 245); border: 1px solid rgba(0, 0, 0, 0.04);" class="w-full px-3 py-2.5 rounded outline-none text-gray-700 text-sm placeholder-[#717182]" />
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td class="p-2">
                      <input type="text" v-model="milestone.details" placeholder="Describe Milestone Deliverable" style="background: rgb(243, 243, 245); border: 1px solid rgba(0, 0, 0, 0.04);" class="w-full px-3 py-2.5 rounded outline-none text-gray-700 text-sm placeholder-[#717182]" />
                    </td>
                    <td class="p-2 w-32">
                      <input type="text" v-model="milestone.leadAmount" placeholder="Amount" style="background: rgb(243, 243, 245); border: 1px solid rgba(0, 0, 0, 0.04);" class="w-full px-3 py-2.5 rounded outline-none text-gray-700 text-sm placeholder-[#717182]" />
                    </td>
                    <td class="p-2 w-32">
                      <input type="text" v-model="milestone.finalAmount" placeholder="Amount" style="background: rgb(243, 243, 245); border: 1px solid rgba(0, 0, 0, 0.04);" class="w-full px-3 py-2.5 rounded outline-none text-gray-700 text-sm placeholder-[#717182]" />
                    </td>
                    <td class="p-2 w-36">
                      <div class="flex items-center gap-3">
                        <button v-if="!milestone.isApplied" @click="milestone.isApplied = true" class="px-3 py-1.5 bg-[#00896F] text-white rounded text-xs font-medium hover:bg-[#00705a] transition-colors">Update</button>
                        <button v-else @click="milestone.isApplied = false" class="px-3 py-1.5 bg-[#D1F2EB] text-[#00896F] rounded text-xs font-medium flex items-center gap-1 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                          Applied
                        </button>
                        <button @click="removeMilestone(milestone)" class="text-[#FCA5A5] hover:text-red-500 font-medium transition-colors text-xs">Delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="bg-[#65E2C4] px-4 py-3 flex justify-end items-center text-sm font-semibold text-[#013E32]">
                <span class="mr-4">Total Milestone Value</span>
                <span>420,000 AED</span>
              </div>
              
              <!-- Pagination footer -->
              <div class="px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 mt-2 bg-white rounded-b-lg">
                  <span class="text-sm text-gray-500">
                      {{ currentLang === 'ar'
                          ? `عرض ${pageStart}–${pageEnd} من ${totalResults} نتيجة`
                          : `Showing ${pageStart}–${pageEnd} of ${totalResults} results`
                      }}
                  </span>

                  <div class="flex items-center gap-1.5">
                      <button :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)"
                          class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                          {{ currentLang === 'ar' ? 'السابق' : 'Previous' }}
                      </button>

                      <template v-for="p in visiblePages" :key="p">
                          <span v-if="p === '...'"
                              class="w-8 h-8 flex items-center justify-center text-sm text-gray-400 select-none">
                              &hellip;
                          </span>
                          <button v-else @click="goToPage(p)"
                              :class="p === currentPage
                                  ? 'bg-[#00896F] text-white border-[#00896F]'
                                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'"
                              class="w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-medium transition-all">
                              {{ p }}
                          </button>
                      </template>

                      <button :disabled="currentPage >= lastPage" @click="goToPage(currentPage + 1)"
                          class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                          {{ currentLang === 'ar' ? 'التالي' : 'Next' }}
                      </button>

                      <span class="ml-3 text-sm text-gray-500 whitespace-nowrap">
                          {{ currentLang === 'ar' ? 'صفوف لكل صفحة:' : 'Rows per page:' }}
                      </span>
                      <select v-model="localPerPage"
                          class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white text-gray-700 focus:ring-1 focus:ring-[#00896F] outline-none appearance-none">
                          <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
                      </select>
                  </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Budget Overview -->
          <div class="mb-10">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-[18px] font-medium text-[#0A0A0A]">Budget Overview - Cost Allocation</h2>
              <button @click="addBudget" class="flex items-center justify-center gap-2 hover:bg-[#52D1B2] transition-colors" style="background: #68E4C4; width: 204px; height: 40px; border-radius: 8.84px; border: 1px solid #04C18F80; color: #0A0A0A; font-size: 16px; font-weight: 400;">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Cost Head
              </button>
            </div>
            
            <div class="w-full overflow-x-auto rounded-t-lg">
              <table class="w-full text-sm text-left">
                <thead class="bg-[#00896F] text-white">
                  <tr>
                    <th class="px-4 py-3 font-medium rounded-tl-lg w-20">Sl. No</th>
                    <th class="px-4 py-3 font-medium">Select Cost Heads - Main Group</th>
                    <th class="px-4 py-3 font-medium w-32">Lead</th>
                    <th class="px-4 py-3 font-medium w-32">Final</th>
                    <th class="px-4 py-3 font-medium rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody class="border-b border-gray-100">
                  <tr v-for="(budget, index) in paginatedBudgets" :key="budget.id || index" class="border-b border-gray-100/50">
                    <td class="p-2">
                      <input type="text" :value="(budgetCurrentPage - 1) * budgetPerPage + index + 1" disabled style="background: rgb(243, 243, 245); border: 1px solid rgba(0, 0, 0, 0.04);" class="w-full px-3 py-2.5 rounded outline-none text-gray-500 text-sm text-center" />
                    </td>
                    <td class="p-2">
                      <div class="relative">
                        <select v-model="budget.category" style="background: rgb(243, 243, 245); border: 1px solid rgba(0, 0, 0, 0.04);" class="w-full px-3 py-2.5 rounded outline-none text-gray-700 text-sm placeholder-[#717182] appearance-none">
                          <option value="" disabled selected hidden>Select cost head category</option>
                        </select>
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td class="p-2 w-32">
                      <input type="text" v-model="budget.leadAmount" placeholder="Amount" style="background: rgb(243, 243, 245); border: 1px solid rgba(0, 0, 0, 0.04);" class="w-full px-3 py-2.5 rounded outline-none text-gray-700 text-sm placeholder-[#717182]" />
                    </td>
                    <td class="p-2 w-32">
                      <input type="text" v-model="budget.finalAmount" placeholder="Amount" style="background: rgb(243, 243, 245); border: 1px solid rgba(0, 0, 0, 0.04);" class="w-full px-3 py-2.5 rounded outline-none text-gray-700 text-sm placeholder-[#717182]" />
                    </td>
                    <td class="p-2 w-36">
                      <div class="flex items-center gap-3">
                        <button v-if="!budget.isApplied" @click="budget.isApplied = true" class="px-3 py-1.5 bg-[#00896F] text-white rounded text-xs font-medium hover:bg-[#00705a] transition-colors">Update</button>
                        <button v-else @click="budget.isApplied = false" class="px-3 py-1.5 bg-[#D1F2EB] text-[#00896F] rounded text-xs font-medium flex items-center gap-1 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                          Applied
                        </button>
                        <button @click="removeBudget(budget)" class="text-[#FCA5A5] hover:text-red-500 font-medium transition-colors text-xs">Delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="bg-[#65E2C4] px-4 py-3 flex justify-end items-center text-sm font-semibold text-[#013E32]">
                <span class="mr-4">Total Budget Allocation</span>
                <span>420,000 AED</span>
              </div>
              
              <!-- Pagination footer -->
              <div class="px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 mt-2 bg-white rounded-b-lg">
                  <span class="text-sm text-gray-500">
                      {{ currentLang === 'ar'
                          ? `عرض ${budgetPageStart}–${budgetPageEnd} من ${budgetTotalResults} نتيجة`
                          : `Showing ${budgetPageStart}–${budgetPageEnd} of ${budgetTotalResults} results`
                      }}
                  </span>

                  <div class="flex items-center gap-1.5">
                      <button :disabled="budgetCurrentPage <= 1" @click="budgetGoToPage(budgetCurrentPage - 1)"
                          class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                          {{ currentLang === 'ar' ? 'السابق' : 'Previous' }}
                      </button>

                      <template v-for="p in budgetVisiblePages" :key="p">
                          <span v-if="p === '...'"
                              class="w-8 h-8 flex items-center justify-center text-sm text-gray-400 select-none">
                              &hellip;
                          </span>
                          <button v-else @click="budgetGoToPage(p)"
                              :class="p === budgetCurrentPage
                                  ? 'bg-[#00896F] text-white border-[#00896F]'
                                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'"
                              class="w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-medium transition-all">
                              {{ p }}
                          </button>
                      </template>

                      <button :disabled="budgetCurrentPage >= budgetLastPage" @click="budgetGoToPage(budgetCurrentPage + 1)"
                          class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                          {{ currentLang === 'ar' ? 'التالي' : 'Next' }}
                      </button>

                      <span class="ml-3 text-sm text-gray-500 whitespace-nowrap">
                          {{ currentLang === 'ar' ? 'صفوف لكل صفحة:' : 'Rows per page:' }}
                      </span>
                      <select v-model="budgetPerPage"
                          class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white text-gray-700 focus:ring-1 focus:ring-[#00896F] outline-none appearance-none">
                          <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
                      </select>
                  </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex justify-end mt-4">
            <button class="px-6 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors shadow-sm">
              Save Contract Data
            </button>
          </div>

        </div>
          </div>
        </div>
      </div>
  </NuxtLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useState } from '#app'
import { ref, computed } from 'vue'

const router = useRouter()
const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()

const milestones = ref([
  { id: Date.now() + 1, date: '15-03-2025', details: 'Initial mobilization', leadAmount: '50000', finalAmount: '0', isApplied: false },
  { id: Date.now() + 2, date: '15-03-2025', details: 'First phase completion', leadAmount: '100000', finalAmount: '200000', isApplied: true },
  { id: Date.now() + 3, date: '15-03-2025', details: 'Second phase completion', leadAmount: '150000', finalAmount: '0', isApplied: false }
])

const addMilestone = () => {
  milestones.value.push({ id: Date.now(), date: '', details: '', leadAmount: '', finalAmount: '', isApplied: false })
  setTimeout(() => { currentPage.value = lastPage.value }, 0)
}

const removeMilestone = (milestone) => {
  const index = milestones.value.indexOf(milestone)
  if (index !== -1) milestones.value.splice(index, 1)
  if (currentPage.value > lastPage.value && lastPage.value >= 1) {
    currentPage.value = lastPage.value
  }
}

const currentPage = ref(1)
const localPerPage = ref(6)
const perPageOptions = [6, 10, 20, 30]

const totalResults = computed(() => milestones.value.length)
const lastPage = computed(() => Math.ceil(totalResults.value / localPerPage.value) || 1)

const pageStart = computed(() => totalResults.value > 0 ? (currentPage.value - 1) * localPerPage.value + 1 : 0)
const pageEnd = computed(() => Math.min(currentPage.value * localPerPage.value, totalResults.value))

const visiblePages = computed(() => {
  const total = lastPage.value
  const cur = currentPage.value
  if (total <= 1) return [1]
  const include = new Set([1, total])
  for (let p = Math.max(1, cur - 1); p <= Math.min(total, cur + 1); p++) include.add(p)
  const sorted = [...include].sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      const gap = sorted[i] - sorted[i - 1]
      if (gap === 2) result.push(sorted[i - 1] + 1)
      else if (gap > 2) result.push('...')
    }
    result.push(sorted[i])
  }
  return result
})

const paginatedMilestones = computed(() => {
  const start = (currentPage.value - 1) * localPerPage.value
  return milestones.value.slice(start, start + localPerPage.value)
})

const goToPage = (page) => {
  if (typeof page === 'number' && page >= 1 && page <= lastPage.value) {
    currentPage.value = page
  }
}

// Budget Overview - Cost Allocation State
const budgets = ref([
  { id: Date.now() + 1, category: '', leadAmount: '50000', finalAmount: '0', isApplied: false },
  { id: Date.now() + 2, category: '', leadAmount: '100000', finalAmount: '0', isApplied: true },
  { id: Date.now() + 3, category: '', leadAmount: '150000', finalAmount: '0', isApplied: false }
])

const budgetCurrentPage = ref(1)
const budgetPerPage = ref(6)

const budgetTotalResults = computed(() => budgets.value.length)
const budgetLastPage = computed(() => Math.ceil(budgetTotalResults.value / budgetPerPage.value) || 1)

const budgetPageStart = computed(() => budgetTotalResults.value > 0 ? (budgetCurrentPage.value - 1) * budgetPerPage.value + 1 : 0)
const budgetPageEnd = computed(() => Math.min(budgetCurrentPage.value * budgetPerPage.value, budgetTotalResults.value))

const budgetVisiblePages = computed(() => {
  const total = budgetLastPage.value
  const cur = budgetCurrentPage.value
  if (total <= 1) return [1]
  const include = new Set([1, total])
  for (let p = Math.max(1, cur - 1); p <= Math.min(total, cur + 1); p++) include.add(p)
  const sorted = [...include].sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      const gap = sorted[i] - sorted[i - 1]
      if (gap === 2) result.push(sorted[i - 1] + 1)
      else if (gap > 2) result.push('...')
    }
    result.push(sorted[i])
  }
  return result
})

const paginatedBudgets = computed(() => {
  const start = (budgetCurrentPage.value - 1) * budgetPerPage.value
  return budgets.value.slice(start, start + budgetPerPage.value)
})

const budgetGoToPage = (page) => {
  if (typeof page === 'number' && page >= 1 && page <= budgetLastPage.value) {
    budgetCurrentPage.value = page
  }
}

const addBudget = () => {
  budgets.value.push({ id: Date.now(), category: '', leadAmount: '', finalAmount: '', isApplied: false })
  setTimeout(() => { budgetCurrentPage.value = budgetLastPage.value }, 0)
}

const removeBudget = (budget) => {
  const index = budgets.value.indexOf(budget)
  if (index !== -1) budgets.value.splice(index, 1)
  if (budgetCurrentPage.value > budgetLastPage.value && budgetLastPage.value >= 1) {
    budgetCurrentPage.value = budgetLastPage.value
  }
}
</script>
