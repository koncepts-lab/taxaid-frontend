<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto p-6 pb-20">
      
      <!-- Header -->
      <div class="mb-8">
         <h1 class="transition-colors duration-300 text-[#013E32] text-[24px]">Support Center</h1>
       <p class="font-normal mt-1 transition-colors duration-300 text-[#00000080]">Get help with Taxaid features and services</p>
      </div>

      <!-- Contact Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <!-- Live Chat -->
        <div class="rounded-xl p-6 flex flex-col justify-between text-white" style="background-color: #1C5F50;">
          <div>
            <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style="background-color: #04725A; color: #04C18F;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
            </div>
            <h3 class="text-[18px] font-normal mb-1" style="color: #FFFFFF;">Live Chat</h3>
            <p class="text-[14px] font-normal mb-6" style="color: #FFFFFFCC;">Mon-Fri 9AM-6PM EST</p>
          </div>
          <button class="w-full transition-colors font-normal py-2.5 rounded-lg text-[14px]" style="background-color: #86E4CB; color: #0A0A0A;">
            Start Chat
          </button>
        </div>

        <!-- Phone Support -->
        <div class="rounded-xl p-6 flex flex-col justify-between text-white" style="background-color: #1C5F50;">
          <div>
            <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style="background-color: #04725A; color: #04C18F;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
            </div>
            <h3 class="text-[18px] font-normal mb-1" style="color: #FFFFFF;">Phone Support</h3>
            <p class="text-[14px] font-normal mb-6" style="color: #FFFFFFCC;">Call us: 1-800-TAXAID (829-2443)</p>
          </div>
          <button class="w-full transition-colors font-normal py-2.5 rounded-lg text-[14px]" style="background-color: #86E4CB; color: #0A0A0A;">
            Schedule Call
          </button>
        </div>

        <!-- Email Support -->
        <div class="rounded-xl p-6 flex flex-col justify-between text-white" style="background-color: #1C5F50;">
          <div>
            <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style="background-color: #04725A; color: #04C18F;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.909A2.25 2.25 0 0 1 2.25 8.5v-.243" /></svg>
            </div>
            <h3 class="text-[18px] font-normal mb-1" style="color: #FFFFFF;">Email Support</h3>
            <p class="text-[14px] font-normal mb-6" style="color: #FFFFFFCC;">support@taxaid.com</p>
          </div>
          <button class="w-full transition-colors font-normal py-2.5 rounded-lg text-[14px]" style="background-color: #86E4CB; color: #0A0A0A;">
            Send Email
          </button>
        </div>
      </div>

      <!-- Submit a Support Ticket Form -->
      <div class="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <h2 class="text-[20px] font-normal mb-6" style="color: #101828;">Submit a Support Ticket</h2>
        
        <form @submit.prevent class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block mb-1.5 custom-label">Your Name</label>
              <input type="text" placeholder="John Anderson" class="w-full border rounded-[8px] px-3.5 transition-all custom-input">
            </div>
            <div>
              <label class="block mb-1.5 custom-label">Email Address</label>
              <input type="email" placeholder="john@example.com" class="w-full border rounded-[8px] px-3.5 transition-all custom-input">
            </div>
          </div>

          <div>
            <label class="block mb-1.5 custom-label">Subject</label>
            <input type="text" placeholder="Brief description of your issue" class="w-full border rounded-[8px] px-3.5 transition-all custom-input">
          </div>

          <div>
            <label class="block mb-1.5 custom-label">Category</label>
            <div class="relative" ref="categoryDropdownRef">
              <button 
                type="button"
                @click="isCategoryOpen = !isCategoryOpen"
                class="w-full border rounded-[8px] px-3.5 flex items-center justify-between transition-all bg-white text-gray-700 custom-input"
                :class="{'custom-input-active': isCategoryOpen}"
              >
                <span>{{ selectedCategory ? categories.find(c => c.value === selectedCategory)?.label : 'Select a Category' }}</span>
                <svg class="h-4 w-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isCategoryOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <Transition name="dropdown">
                <div 
                  v-if="isCategoryOpen"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-[8px] shadow-lg overflow-hidden"
                >
                  <div class="max-h-60 overflow-y-auto py-1">
                    <div 
                      class="px-3.5 py-2.5 text-[14px] text-gray-700 cursor-pointer hover:bg-[#E8FCF2] transition-colors"
                      :class="{'bg-[#E8FCF2] font-medium text-[#00835D]': selectedCategory === ''}"
                      @click="selectCategory('')"
                    >
                      Select a Category
                    </div>
                    <div 
                      v-for="cat in categories" 
                      :key="cat.value"
                      class="px-3.5 py-2.5 text-[14px] text-gray-700 cursor-pointer hover:bg-[#E8FCF2] transition-colors"
                      :class="{'bg-[#E8FCF2] font-medium text-[#00835D]': selectedCategory === cat.value}"
                      @click="selectCategory(cat.value)"
                    >
                      {{ cat.label }}
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <div>
            <label class="block mb-1.5 custom-label">Priority</label>
            <div class="relative" ref="priorityDropdownRef">
              <button 
                type="button"
                @click="isPriorityOpen = !isPriorityOpen"
                class="w-full border rounded-[8px] px-3.5 flex items-center justify-between transition-all bg-white text-gray-900 custom-input"
                :class="{'custom-input-active': isPriorityOpen}"
              >
                <span>{{ selectedPriority ? priorities.find(p => p.value === selectedPriority)?.label : 'Normal' }}</span>
                <svg class="h-4 w-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isPriorityOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <Transition name="dropdown">
                <div 
                  v-if="isPriorityOpen"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-[8px] shadow-lg overflow-hidden"
                >
                  <div class="max-h-60 overflow-y-auto p-1">
                    <div 
                      v-for="pri in priorities" 
                      :key="pri.value"
                      class="px-3.5 py-2.5 text-[14px] text-gray-700 cursor-pointer hover:bg-[#E8FCF2] transition-colors rounded-[6px] mb-0.5 last:mb-0"
                      :class="{'bg-[#E8FCF2] text-[#00835D]': selectedPriority === pri.value}"
                      @click="selectPriority(pri.value)"
                    >
                      {{ pri.label }}
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <div>
            <label class="block mb-1.5 custom-label">Describe Your Issue</label>
            <textarea rows="4" placeholder="Please provide as much detail as possible..." class="w-full border rounded-[8px] px-3.5 py-2.5 transition-all resize-none custom-input"></textarea>
          </div>

          <div>
            <span class="block text-[14px] mb-1.5" style="color: #0A0A0A;">Attachments (Optional)</span>
            <label class="border border-gray-200 rounded-[8px] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors w-full block">
              <input type="file" class="hidden" accept=".png,.jpg,.jpeg,.pdf" />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-400 mb-2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
              <p class="text-[13px] text-gray-500 mb-1">Click to upload or drag and drop</p>
              <p class="text-[11px] text-gray-400">PNG, JPG, PDF up to 10MB</p>
            </label>
          </div>

          <button type="submit" class="w-full bg-[#00835D] hover:bg-[#006A4A] transition-colors text-white font-medium py-2.5 rounded-[8px] text-[14px]">
            Submit Ticket
          </button>
        </form>
      </div>

      <!-- Previous Tickets -->
      <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 class="text-[18px] font-medium text-[#101828] mb-1">Previous Tickets</h2>
        <p class="text-[13px] text-gray-500 mb-6">View and track all your support requests</p>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-[#F0FDF4] border border-[#BBF7D0] rounded-[10px] p-4">
            <p class="text-[13px] text-gray-600 mb-2">Resolved</p>
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#16A34A]"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span class="text-[18px] font-medium text-[#166534]">4</span>
            </div>
          </div>
          <div class="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[10px] p-4">
            <p class="text-[13px] text-gray-600 mb-2">In Progress</p>
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#3B82F6]"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span class="text-[18px] font-medium text-[#1E40AF]">1</span>
            </div>
          </div>
          <div class="bg-[#F9FAFB] border border-gray-200 rounded-[10px] p-4">
            <p class="text-[13px] text-gray-600 mb-2">Total</p>
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-gray-600"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
              <span class="text-[18px] font-medium text-gray-900">5</span>
            </div>
          </div>
        </div>

        <!-- Ticket List -->
        <div class="space-y-4">
          <!-- Ticket Item 1 -->
          <div class="border border-[#A7F3D0] rounded-[12px] p-5">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <span class="text-[14px] text-gray-700">TKT-4-0145</span>
                <span class="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#166534] px-2.5 py-1 rounded-full text-[11px] font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" /></svg>
                  Resolved
                </span>
                <span class="bg-[#FEE2E2] text-[#991B1B] px-2.5 py-1 rounded-full text-[11px] font-medium">High</span>
              </div>
              <button class="inline-flex items-center gap-1.5 bg-[#E8FCF2] hover:bg-[#D1F4E0] text-[#00835D] px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                View
              </button>
            </div>
            <h3 class="text-[15px] font-medium text-gray-900 mb-4">Unable to export Q4 tax reports</h3>
            <div class="flex items-center gap-6 text-[12px] text-gray-500">
              <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-[4px]">Technical Issue</span>
              <span>Created: Jan 5, 2026</span>
              <span>Resolved: Jan 6, 2026</span>
            </div>
          </div>

          <!-- Ticket Item 2 -->
          <div class="border border-[#A7F3D0] rounded-[12px] p-5">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <span class="text-[14px] text-gray-700">TKT-4-0145</span>
                <span class="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#166534] px-2.5 py-1 rounded-full text-[11px] font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" /></svg>
                  Resolved
                </span>
                <span class="bg-[#FEE2E2] text-[#991B1B] px-2.5 py-1 rounded-full text-[11px] font-medium">High</span>
              </div>
              <button class="inline-flex items-center gap-1.5 bg-[#E8FCF2] hover:bg-[#D1F4E0] text-[#00835D] px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                View
              </button>
            </div>
            <h3 class="text-[15px] font-medium text-gray-900 mb-4">Unable to export Q4 tax reports</h3>
            <div class="flex items-center gap-6 text-[12px] text-gray-500">
              <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-[4px]">Technical Issue</span>
              <span>Created: Jan 5, 2026</span>
              <span>Resolved: Jan 6, 2026</span>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-center">
          <button class="inline-flex items-center gap-2 bg-[#00835D] hover:bg-[#006A4A] transition-colors text-white px-4 py-2 rounded-[6px] text-[13px] font-medium shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
            View all Tickets
          </button>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isCategoryOpen = ref(false)
const selectedCategory = ref('')
const categoryDropdownRef = ref(null)

const isPriorityOpen = ref(false)
const selectedPriority = ref('normal')
const priorityDropdownRef = ref(null)

const categories = [
  { value: 'billing', label: 'Billing & Subscription' },
  { value: 'tax_filing', label: 'Tax Filing' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'account_management', label: 'Account Management' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'other', label: 'Other' }
]

const priorities = [
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
]

const selectCategory = (val) => {
  selectedCategory.value = val
  isCategoryOpen.value = false
}

const selectPriority = (val) => {
  selectedPriority.value = val
  isPriorityOpen.value = false
}

const closeDropdowns = (e) => {
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(e.target)) {
    isCategoryOpen.value = false
  }
  if (priorityDropdownRef.value && !priorityDropdownRef.value.contains(e.target)) {
    isPriorityOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
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

.custom-label {
  font-size: 14px;
  font-weight: 400;
  color: #0A0A0A;
}

.custom-input {
  height: 40px;
  border-color: #04C18F80;
  font-size: 14px;
  font-weight: 400;
  outline: none;
}

.custom-input:focus,
.custom-input-active {
  outline: none !important;
  border-color: #00835D !important;
  box-shadow: 0 0 0 1px rgba(0, 131, 93, 0.2) !important;
}

.custom-input::placeholder {
  color: #0000004D;
}

textarea.custom-input {
  height: 150px;
}
</style>
