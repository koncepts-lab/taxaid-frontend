<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto p-6 pb-20">
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="transition-colors duration-300 text-[#013E32]" style="font-size: 24px;">Subscription Management</h1>
        <p class="font-normal mt-1 transition-colors duration-300 text-[#00000080]">Manage your plan, billing and payment methods</p>
      </div>

      <!-- Current Plan Banner -->
      <div class="rounded-2xl text-white p-8 mb-10 flex justify-between items-center shadow-lg" style="background: linear-gradient(90deg, #015243 0%, #007760 100%);">
        <div>
          <p class="text-[14px] text-white mb-1 font-normal">Current Plan</p>
          <h2 class="text-[30px] font-normal mb-1">Professional</h2>
          <p class="text-[16px] text-white font-light">$99/month • Renews on December 24, 2025</p>
        </div>
        <div class="text-right">
          <p class="text-[14px] text-white font-light">Next Payment</p>
          <p class="text-[24px] text-white font-light">$99.00</p>
        </div>
      </div>

      <!-- Available Plans -->
      <div class="mb-12">
        <h3 class="text-[24px] font-regular text-black mb-2">Available Plans</h3>
        
        <!-- Toggle -->
        <div class="flex mb-8">
          <div class="w-full rounded-xl flex justify-center items-center gap-3.5" style="background-color: #61FFD62E; border: 1px solid #04C18FBD; padding: 18px;">
            <button @click="billingCycle = 'monthly'" :class="['max-w-[400px] flex-1 py-3 rounded-lg text-[14px] transition-all shadow-sm', billingCycle === 'monthly' ? 'font-regular bg-[#00896F] text-white' : 'font-regular bg-white text-[#1a1a1a]']">Monthly Billing</button>
            <button @click="billingCycle = 'annual'" :class="['max-w-[400px] flex-1 py-3 rounded-lg text-[14px] transition-all flex items-center justify-center gap-2 shadow-sm', billingCycle === 'annual' ? 'font-regular bg-[#00896F] text-white' : 'font-regular bg-white text-[#1a1a1a]']">
              Annual Billing
              <span :class="['text-[12px] px-3 py-0.5 rounded-full font-regular', billingCycle === 'annual' ? 'bg-white text-[#00896F]' : 'text-white']" :style="billingCycle !== 'annual' ? 'background-color: #00C950;' : ''">Save 20%</span>
            </button>
          </div>
        </div>

        <!-- Pricing Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <!-- Starter -->
          <div class="h-full bg-white border border-gray-200 rounded-2xl p-6 flex flex-col shadow-sm">
            <h4 class="text-[24px] font-normal text-gray-900 mb-3">Starter</h4>
            <div class="mb-4">
              <span class="text-[36px] font-regular text-black">{{ billingCycle === 'monthly' ? '$29' : '$278' }}</span>
              <span class="text-[16px] text-[#000000CC]">{{ billingCycle === 'monthly' ? ' /month' : ' /year' }}</span>
            </div>
            <p v-if="billingCycle === 'annual'" class="text-[14px] text-[#04C18F] mb-3 font-medium">$23/mo when billed annually</p>
            <p :class="['text-[16px] text-[#000000CC]', billingCycle === 'annual' ? 'mb-6' : 'mb-6']">Perfect for small businesses and startups</p>
            
            <ul class="space-y-4 mb-8 flex-1">
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                1 Company/Entity
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Up to 10 tax filings per year
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Basic compliance tracking
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Email support
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                10 GB storage
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Mobile app access
              </li>
            </ul>
            <NuxtLink to="/settings/checkout" class="w-full bg-[#00896F] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#00705a] flex items-center justify-center gap-2 transition-colors">
              Downgrade
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </NuxtLink>
          </div>

          <!-- Professional -->
          <div class="h-full bg-white border-2 border-[#04C18F] rounded-2xl p-6 flex flex-col shadow-lg relative z-10">
            <div class="absolute -top-3 left-6 flex gap-2">
              <span class="bg-[#04C18F] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
              <span class="bg-[#E6F8F3] text-[#00896F] border border-[#04C18F] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">Current Plan</span>
            </div>
            
            <h4 class="text-[24px] font-normal text-gray-900 mb-3 mt-10">Professional</h4>
            <div class="mb-4">
              <span class="text-[36px] font-regular text-black">{{ billingCycle === 'monthly' ? '$99' : '$950' }}</span>
              <span class="text-[16px] text-[#000000CC]">{{ billingCycle === 'monthly' ? ' /month' : ' /year' }}</span>
            </div>
            <p v-if="billingCycle === 'annual'" class="text-[14px] text-[#04C18F] mb-3 font-medium">$79/mo when billed annually</p>
            <p class="text-[16px] text-[#000000CC] mb-6">For growing businesses with multiple entities</p>
            
            <ul class="space-y-4 mb-8 flex-1">
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                3 Companies/Entities
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Unlimited tax filings
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Advanced compliance tracking
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Priority email & chat support
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                100 GB storage
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Mobile app access
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Automated reminders
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Real-time dashboards
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Custom reports
              </li>
            </ul>
            <button class="w-full bg-white border border-gray-200 text-gray-400 py-3 rounded-xl text-sm font-medium cursor-default">
              Current Plan
            </button>
          </div>

          <!-- Enterprise -->
          <div class="h-full bg-white border border-gray-200 rounded-2xl p-6 flex flex-col shadow-sm">
            <h4 class="text-[24px] font-normal text-gray-900 mb-3">Enterprise</h4>
            <div class="mb-4">
              <span class="text-[36px] font-regular text-black">{{ billingCycle === 'monthly' ? '$299' : '$2870' }}</span>
              <span class="text-[16px] text-[#000000CC]">{{ billingCycle === 'monthly' ? ' /month' : ' /year' }}</span>
            </div>
            <p v-if="billingCycle === 'annual'" class="text-[14px] text-[#04C18F] mb-3 font-medium">$239/mo when billed annually</p>
            <p class="text-[16px] text-[#000000CC] mb-6">For large organizations with complex needs</p>
            
            <ul class="space-y-4 mb-8 flex-1">
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Unlimited Companies/Entities
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Unlimited tax filings
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Enterprise compliance suite
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                24/7 phone & chat support
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Unlimited storage
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Mobile app access
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Dedicated account manager
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Advanced analytics
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                API access
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                Custom integrations
              </li>
              <li class="text-[14px] text-[#000000] flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                White-label options
              </li>
            </ul>
            <NuxtLink to="/settings/checkout" class="w-full bg-[#00896F] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#00705a] flex items-center justify-center gap-2 transition-colors">
              Upgrade
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </NuxtLink>
          </div>

        </div>
      </div>

      <!-- Payment Methods -->
      <div class="mb-12">
        <h3 class="text-[20px] text-[#000] font-medium mb-1">Payment Methods</h3>
        <p class="text-[14px] text-[#000000CC] mb-6">Manage your saved payment methods</p>
        
        <!-- Default Payment -->
        <div class="mb-6">
          <p class="mb-3 text-[14px] text-[#000000CC]">Default Payment Method</p>
          <div class="border border-[#04C18F] rounded-2xl p-8 flex items-center justify-between shadow-sm" style="background: linear-gradient(90deg, #F0FDFA 0%, #F0FDF4 100%);">
            <div class="flex items-center gap-4">
              <div class="w-12 h-8 bg-[#DCFCE7] rounded flex items-center justify-center text-[#00A63E]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
              </div>
              <div>
                <div class="flex items-center gap-3 mb-1">
                  <p class="text-[16px] font-medium text-gray-900">Mastercard •••• 5555</p>
                  <span class="bg-[#00896F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Default</span>
                </div>
                <p class="text-[14px] text-[#000000CC]">Expires 08/2027</p>
              </div>
            </div>
            <button @click="isUpdatePaymentModalOpen = true" class="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">Update</button>
          </div>
        </div>

        <!-- Other Saved Cards -->
        <div>
          <p class="mb-3 text-[14px] text-[#000000CC]">Other Saved Cards (1)</p>
          <div class="border rounded-2xl p-8 flex items-center justify-between mb-4 shadow-sm" style="background-color: #F9FAFB; border-color: #E5E7EB;">
            <div class="flex items-center gap-4">
              <div class="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
              </div>
              <div>
                <p class="text-[16px] font-medium text-gray-900 mb-1">Visa •••• 4242</p>
                <p class="text-[14px] text-[#000000CC]">Expires 12/2026</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button class="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">Set as Default</button>
              <button class="p-2.5 bg-white border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
              </button>
            </div>
          </div>
          
          <button @click="isAddPaymentModalOpen = true" class="w-full py-4 bg-[#FFFFFF] border border-[#04C18F80]- text-[#00896F] text-sm font-medium rounded-2xl hover:bg-[#F0FDF8] flex items-center justify-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add New Payment Method
          </button>
        </div>
      </div>

      <!-- Billing History -->
      <div>
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-medium text-gray-900">Billing History</h3>
          <button class="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            Download All
          </button>
        </div>
        
        <div class="space-y-3">
          <div v-for="invoice in invoices" :key="invoice.id" class="border rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all hover:shadow-md" style="background-color: #F0FDFA; border-color: #04C18F80;">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 mb-1">{{ invoice.id }}</p>
                <p class="text-xs text-gray-500">{{ invoice.date }} • {{ invoice.plan }}</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900 mb-1">${{ invoice.amount.toFixed(2) }}</p>
                <span class="bg-[#E6F8F3] text-[#00896F] text-[10px] font-bold px-2 py-0.5 rounded-full inline-block uppercase">Paid</span>
              </div>
              <button class="text-gray-400 hover:text-gray-800 transition-colors p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Update Payment Modal -->
    <div v-if="isUpdatePaymentModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div class="p-6">
          <!-- Header -->
          <div class="flex justify-between items-start mb-6">
            <div class="flex gap-4">
              <div class="w-12 h-12 bg-[#DCFCE7] rounded-xl flex items-center justify-center text-[#00896F]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
              </div>
              <div>
                <h3 class="text-xl font-medium text-gray-900">Update Payment Method</h3>
                <p class="text-sm text-gray-500 mt-1">Update your card details</p>
              </div>
            </div>
            <button @click="isUpdatePaymentModalOpen = false" class="text-gray-400 hover:text-gray-600">
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
            <div class="bg-[#EBFAF6] border border-[#04C18F80] rounded-lg p-4 flex gap-3 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-[#00896F] shrink-0 mt-0.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
              <p class="text-sm text-[#00896F]">Your payment information is encrypted and secure. We use industry-standard SSL encryption.</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-5 flex gap-4">
          <button @click="isUpdatePaymentModalOpen = false" class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button @click="isUpdatePaymentModalOpen = false" class="flex-1 py-2.5 bg-[#00896F] text-white text-sm font-medium rounded-lg hover:bg-[#00705a] transition-colors">Update Card</button>
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

const billingCycle = ref('annual')
const isUpdatePaymentModalOpen = ref(false)
const isAddPaymentModalOpen = ref(false)

const invoices = ref([
  {
    id: 'INV-2025-11',
    date: 'Nov 24, 2025',
    plan: 'Professional Plan',
    amount: 99.00
  },
  {
    id: 'INV-2025-10',
    date: 'Oct 24, 2025',
    plan: 'Professional Plan',
    amount: 99.00
  },
  {
    id: 'INV-2025-09',
    date: 'Sep 24, 2025',
    plan: 'Professional Plan',
    amount: 99.00
  }
])
</script>
