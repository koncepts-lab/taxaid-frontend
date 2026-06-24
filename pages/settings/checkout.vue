<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-screen">
      <div class="mx-auto p-6 pb-20">
      
      <!-- Header -->
      <div class="mb-6">
        <h1 class="transition-colors duration-300 text-[#013E32]" style="font-size: 24px;">Subscription Management</h1>
        <p class="font-normal mt-1 transition-colors duration-300 text-[#00000080]">Manage your plan, billing and payment methods</p>
      </div>

     

      <!-- Progress Tracker -->
      <div v-if="step < 4" class="mb-8 p-5 rounded-2xl border" style="background: linear-gradient(90deg, #ECFDF5 0%, #D1F4E6 100%); border-color: #A2E8D6;">
        <div class="flex items-center max-w-2xl mx-auto px-4">
          <!-- Step 1 -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-[#00896F] text-white flex items-center justify-center shadow-sm">
              <svg v-if="step >= 2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.71.947H4.038a.75.75 0 0 1-.71-.947ZM15 9a.75.75 0 0 0-.75.75v.5a.75.75 0 0 0 1.5 0v-.5A.75.75 0 0 0 15 9Zm0 3a.75.75 0 0 0-.75.75v.5a.75.75 0 0 0 1.5 0v-.5A.75.75 0 0 0 15 12Z" clip-rule="evenodd" /></svg>
            </div>
            <span class="text-sm font-medium text-[#00896F]">Billing Info</span>
          </div>
          
          <!-- Line -->
          <div :class="['flex-1 h-[2px] mx-4', step >= 2 ? 'bg-[#00896F]' : 'bg-gray-200']"></div>

          <!-- Step 2 -->
          <div :class="['flex items-center gap-3', step < 2 ? 'opacity-50' : '']">
            <div :class="['w-10 h-10 rounded-full flex items-center justify-center', step >= 2 ? 'bg-[#00896F] text-white shadow-sm' : 'bg-white border-2 border-gray-200 text-gray-400']">
              <svg v-if="step >= 3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
            </div>
            <span :class="['text-sm font-medium', step >= 2 ? 'text-[#00896F]' : 'text-gray-500']">Payment</span>
          </div>

          <!-- Line -->
          <div :class="['flex-1 h-[2px] mx-4', step >= 3 ? 'bg-[#00896F]' : 'bg-gray-200']"></div>

          <!-- Step 3 -->
          <div :class="['flex items-center gap-3', step < 3 ? 'opacity-50' : '']">
            <div :class="['w-10 h-10 rounded-full flex items-center justify-center', step >= 3 ? 'bg-[#00896F] text-white shadow-sm' : 'bg-white border-2 border-gray-200 text-gray-400']">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
            </div>
            <span :class="['text-sm font-medium', step >= 3 ? 'text-[#00896F]' : 'text-gray-500']">Confirm</span>
          </div>
        </div>
      </div>

      <!-- Main Content Layout -->
      <div v-if="step < 4" class="flex flex-col lg:flex-row gap-8">
        
        <!-- Left Column: Forms -->
        <div class="flex-1">
          <!-- Step 1: Billing Information -->
          <div v-if="step === 1" class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 class="text-[20px] font-medium text-gray-900 mb-8">Billing Information</h2>
            
            <form class="space-y-6">
              <!-- Company Name -->
              <div>
                <label class="block text-[14px] text-gray-900 mb-2">Company Name</label>
                <input type="text" value="MasterLine Mechanical LLC" class="w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #A2E8D6;" />
              </div>
              
              <!-- Tax ID / EIN -->
              <div>
                <label class="block text-[14px] text-gray-900 mb-2">Tax ID / EIN</label>
                <input type="text" placeholder="XX-XXXXXXX" class="w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #A2E8D6;" />
              </div>

              <!-- Street Address -->
              <div>
                <label class="block text-[14px] text-gray-900 mb-2">Street Address</label>
                <input type="text" class="w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #A2E8D6;" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- City -->
                <div>
                  <label class="block text-[14px] text-gray-900 mb-2">City</label>
                  <input type="text" class="w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #A2E8D6;" />
                </div>
                <!-- State -->
                <div>
                  <label class="block text-[14px] text-gray-900 mb-2">State</label>
                  <div class="relative">
                    <select class="w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-900 appearance-none focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #A2E8D6;">
                      <option value=""></option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- ZIP Code -->
                <div>
                  <label class="block text-[14px] text-gray-900 mb-2">ZIP Code</label>
                  <input type="text" class="w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #A2E8D6;" />
                </div>
                <!-- Country -->
                <div>
                  <label class="block text-[14px] text-gray-900 mb-2">Country</label>
                  <div class="relative">
                    <select class="w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-500 appearance-none focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #A2E8D6;">
                      <option value="US">United States</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <button @click="step = 2" type="button" class="w-full mt-4 bg-[#00896F] text-white py-3.5 rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors">
                Continue to Payment
              </button>
            </form>
          </div>

          <!-- Step 2: Payment Method -->
          <div v-else-if="step === 2" class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 class="text-[20px] font-medium text-gray-900 mb-2">Select Payment Method</h2>
            <p class="text-[14px] text-gray-500 mb-8">Choose a saved payment method or add a new one</p>
            
            <div class="space-y-4 mb-8">
              <!-- Card 1 -->
              <div @click="selectedPayment = 'mastercard'" :class="['rounded-xl p-5 flex items-center justify-between cursor-pointer shadow-sm transition-all', selectedPayment === 'mastercard' ? 'bg-[#F0FDFA] border border-[#04C18F]' : 'bg-white border border-gray-200 hover:border-[#A2E8D6]']">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-8 bg-[#E6FBF2] rounded flex items-center justify-center text-[#04C18F]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
                  </div>
                  <div>
                    <p class="text-[14px] font-medium text-gray-900 flex items-center gap-2">
                      Mastercard •••• 5555
                      <span class="bg-[#00896F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Default</span>
                    </p>
                    <p class="text-[12px] text-gray-500">Expires 08/2027</p>
                  </div>
                </div>
                <div v-if="selectedPayment === 'mastercard'" class="w-6 h-6 rounded-full bg-[#00896F] text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                </div>
                <div v-else class="w-6 h-6 rounded-full border-2 border-gray-300" style="border-color: #04C18F80;"></div>
              </div>
              
              <!-- Card 2 -->
              <div @click="selectedPayment = 'visa'" :class="['rounded-xl p-5 flex items-center justify-between cursor-pointer shadow-sm transition-all', selectedPayment === 'visa' ? 'bg-[#F0FDFA] border border-[#04C18F]' : 'bg-white border border-gray-200 hover:border-[#A2E8D6]']">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
                  </div>
                  <div>
                    <p class="text-[14px] font-medium text-gray-900">Visa •••• 4242</p>
                    <p class="text-[12px] text-gray-500">Expires 12/2026</p>
                  </div>
                </div>
                <div v-if="selectedPayment === 'visa'" class="w-6 h-6 rounded-full bg-[#00896F] text-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                </div>
                <div v-else class="w-6 h-6 rounded-full border-2 border-gray-300" style="border-color: #04C18F80;"></div>
              </div>
              
              <!-- Add New -->
              <button @click="isAddPaymentModalOpen = true" type="button" class="w-full bg-white border rounded-lg py-3.5 text-sm font-medium text-[#00896F] flex items-center justify-center gap-2 hover:bg-[#F0FDF8] transition-colors" style="border-color: #A2E8D6;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Add New Payment Method
              </button>
            </div>
            
            <div class="flex gap-4 pt-6">
              <button @click="step = 1" type="button" class="w-1/3 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button @click="step = 3" type="button" class="flex-1 bg-[#00896F] text-white py-3.5 rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors">
                Review Order
              </button>
            </div>
          </div>

          <!-- Step 3: Confirm -->
          <div v-else-if="step === 3" class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 class="text-[20px] font-medium text-gray-900 mb-6">Review & Confirm</h2>
            
            <div class="space-y-6 mb-8">
              <div>
                <p class="text-sm text-gray-900 mb-3">Billing Information</p>
                <div class="rounded-xl p-5" style="background-color: #F0FDFA;">
                  <p class="text-[16px] text-gray-900 font-medium mb-1">MasterLine Mechanical LLC</p>
                  <p class="text-sm text-gray-600 mb-1">12-3456789</p>
                  <p class="text-sm text-gray-600 mb-1">742 Corporate Park Drive, Suite 210</p>
                  <p class="text-sm text-gray-600 mb-1">Houston, Texas 77002</p>
                  <p class="text-sm text-gray-600">United States</p>
                </div>
              </div>

              <div>
                <p class="text-sm text-gray-900 mb-3">Payment Method</p>
                <div class="rounded-xl p-5 flex items-center gap-4" style="background-color: #F0FDFA;">
                  <div class="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-900 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
                  </div>
                  <div>
                    <p class="text-[14px] text-gray-900 font-medium">{{ selectedPayment === 'mastercard' ? 'Mastercard •••• 5555' : 'Visa •••• 4242' }}</p>
                    <p class="text-[12px] text-gray-600">Expires {{ selectedPayment === 'mastercard' ? '08/2027' : '12/2026' }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex gap-4 pt-4 border-t border-gray-100">
              <button @click="step = 2" type="button" class="flex-1 bg-white border py-3.5 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors" style="border-color: #A2E8D6;">
                Back
              </button>
              <button @click="step = 4" type="button" class="flex-1 bg-[#00896F] text-white py-3.5 rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors">
                Confirm Payment
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Order Summary -->
        <div class="w-full lg:w-96 shrink-0">
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm sticky top-6">
            <h3 class="text-[20px] font-medium text-gray-900 mb-8">Order Summary</h3>
            
            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-[14px]">
                <span class="text-gray-600">Starter Plan</span>
                <span class="text-gray-900 font-medium">$29.00</span>
              </div>
              <div class="flex justify-between text-[14px]">
                <span class="text-gray-600">Billing Period</span>
                <span class="text-gray-900 font-medium">Monthly</span>
              </div>
              <div class="flex justify-between text-[14px]">
                <span class="text-[#00A63E] font-regular">Discount (First Month)</span>
                <span class="text-[#00A63E] font-regular">-$10.00</span>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-6 space-y-4 mb-6">
              <div class="flex justify-between text-[14px]">
                <span class="text-gray-600 font-medium">Subtotal</span>
                <span class="text-gray-900 font-medium">$19.00</span>
              </div>
              <div class="flex justify-between text-[14px]">
                <span class="text-gray-500">Tax (0%)</span>
                <span class="text-gray-900 font-medium">$0.00</span>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-6 mb-8">
              <div class="flex justify-between items-end">
                <span class="text-[16px] text-gray-900 font-medium">Total Due Today</span>
                <span class="text-[24px] text-gray-900 font-medium">$19.00</span>
              </div>
            </div>

            <!-- What's included -->
            <div class="bg-[#F9FAFB] rounded-xl p-5">
              <h4 class="text-[14px] font-medium text-gray-900 mb-4">What's included:</h4>
              <ul class="space-y-3">
                <li class="text-[13px] text-gray-600 flex items-start gap-2">
                  <span class="w-1 h-1 rounded-full bg-black mt-1.5 shrink-0"></span>
                  Access to all Starter features
                </li>
                <li class="text-[13px] text-gray-600 flex items-start gap-2">
                  <span class="w-1 h-1 rounded-full bg-black mt-1.5 shrink-0"></span>
                  No setup fees
                </li>
                <li class="text-[13px] text-gray-600 flex items-start gap-2">
                  <span class="w-1 h-1 rounded-full bg-black mt-1.5 shrink-0"></span>
                  Cancel anytime
                </li>
                <li class="text-[13px] text-gray-600 flex items-start gap-2">
                  <span class="w-1 h-1 rounded-full bg-black mt-1.5 shrink-0"></span>
                  24/7 customer support
                </li>
              </ul>
            </div>
          </div>
        </div>

        </div>
      </div>

      <!-- Step 4: Success -->
      <div v-if="step === 4" class="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 p-12 shadow-sm text-center mt-8">
        <div class="w-24 h-24 bg-[#E6FBF2] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-10 h-10 text-[#00C950]"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
        </div>
        <h2 class="text-[30px] font-medium text-[#000000] mb-2">Payment Successful!</h2>
        <p class="text-[16px] text-[#667085] mb-10">Your subscription to the <span class="font-bold">Starter</span> plan has been activated.</p>
        
        <div class="bg-[#F4FBF9] rounded-xl p-6 text-left mb-10">
          <div class="flex justify-between py-4 border-b border-[#E6F5F0]">
            <span class="text-[16px] text-gray-900">Plan</span>
            <span class="text-[16px] text-gray-900">Starter</span>
          </div>
          <div class="flex justify-between py-4 border-b border-[#E6F5F0]">
            <span class="text-[16px] text-gray-900">Billing Cycle</span>
            <span class="text-[16px] text-gray-900">Monthly</span>
          </div>
          <div class="flex justify-between py-4 border-b border-[#E6F5F0]">
            <span class="text-[16px] text-gray-900">Next Billing Date</span>
            <span class="text-[16px] text-gray-900">December 24, 2025</span>
          </div>
          <div class="flex justify-between pt-6 pb-2 items-center">
            <span class="text-[18px] text-gray-900">Total</span>
            <span class="text-[28px] text-gray-900 font-medium">$29.00</span>
          </div>
        </div>

        <div class="flex justify-center gap-4">
          <NuxtLink to="/settings/subscription" class="bg-[#00896F] text-white px-6 py-3 rounded-lg text-[15px] font-medium hover:bg-[#00705a] transition-colors">
            Return to Subscription
          </NuxtLink>
          <button type="button" class="bg-white border px-6 py-3 rounded-lg text-[15px] font-medium text-gray-900 hover:bg-gray-50 transition-colors" style="border-color: #A2E8D6;">
            Download Receipt
          </button>
        </div>
      </div>
    </div>

    <!-- Add Payment Modal -->
    <div v-if="isAddPaymentModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div class="p-6">
          <!-- Header -->
          <div class="flex justify-between items-start mb-6">
            <div class="flex gap-4">
              <div class="w-12 h-12 bg-[#DCFCE7] rounded-xl flex items-center justify-center text-[#00896F]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
              </div>
              <div>
                <h3 class="text-xl font-medium text-gray-900">Add Payment Method</h3>
                <p class="text-sm text-gray-500 mt-1">Add a new card to your account</p>
              </div>
            </div>
            <button @click="isAddPaymentModalOpen = false" class="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Form -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-1">Card Number</label>
              <input type="text" placeholder="•••• •••• •••• 4242" class="w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #04C18F80;" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-1">Cardholder Name</label>
              <input type="text" placeholder="John Anderson" class="w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #04C18F80;" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-1">Expiry Date</label>
                <input type="text" placeholder="12/2026" class="w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #04C18F80;" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-1">CVV</label>
                <input type="text" placeholder="123" class="w-full bg-white border rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #04C18F80;" />
              </div>
            </div>
            
            <!-- Security Info -->
            <div class="bg-[] border border-[#04C18F80] rounded-lg p-4 flex gap-3 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-[#00896F] shrink-0 mt-0.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
              <p class="text-sm text-[#00896F]">Your payment information is encrypted and secure. We use industry-standard SSL encryption.</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-5 flex gap-4">
          <button @click="isAddPaymentModalOpen = false" class="flex-1 py-2.5 bg-white border text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors" style="border-color: #04C18F80;">Cancel</button>
          <button @click="isAddPaymentModalOpen = false" class="flex-1 py-2.5 bg-[#00896F] text-white text-sm font-medium rounded-lg hover:bg-[#00705a] transition-colors">Add Card</button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const step = ref(1)
const selectedPayment = ref('mastercard')
const isAddPaymentModalOpen = ref(false)
</script>
