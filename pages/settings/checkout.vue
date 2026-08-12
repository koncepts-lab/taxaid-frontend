<template>
  <NuxtLayout name="dashboard">
    <div class="min-h-screen">
      <div class="mx-auto p-6 pb-20">

      <!-- Header -->
      <div class="mb-6">
        <h1 class="transition-colors duration-300 text-[#013E32]" style="font-size: 24px;">Subscription Management</h1>
        <p class="font-normal mt-1 transition-colors duration-300 text-[#00000080]">Manage your plan, billing and payment methods</p>
      </div>

      <div v-if="loading" class="text-center py-20 text-[#00000080]">Loading...</div>

      <template v-else-if="!plan">
        <div class="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 p-12 shadow-sm text-center mt-8">
          <p class="text-[16px] text-[#667085] mb-6">Plan not found.</p>
          <NuxtLink to="/settings/subscription" class="bg-[#00896F] text-white px-6 py-3 rounded-lg text-[15px] font-medium hover:bg-[#00705a] transition-colors">Back to Subscription</NuxtLink>
        </div>
      </template>

      <template v-else>
        <!-- Progress Tracker -->
        <div v-if="!success" class="mb-8 p-5 rounded-2xl border" style="background: linear-gradient(90deg, #ECFDF5 0%, #D1F4E6 100%); border-color: #A2E8D6;">
          <div class="flex items-center max-w-2xl mx-auto px-4">
            <!-- Step 1: Billing Info -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#00896F] text-white flex items-center justify-center shadow-sm">
                <svg v-if="step >= 2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
              </div>
              <span class="text-sm font-medium text-[#00896F]">Billing Info</span>
            </div>

            <div :class="['flex-1 h-[2px] mx-4', step >= 2 ? 'bg-[#00896F]' : 'bg-gray-200']"></div>

            <!-- Step 2: Payment -->
            <div :class="['flex items-center gap-3', step < 2 ? 'opacity-50' : '']">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center', step >= 2 ? 'bg-[#00896F] text-white shadow-sm' : 'bg-white border-2 border-gray-200 text-gray-400']">
                <svg v-if="step >= 3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
              </div>
              <span :class="['text-sm font-medium', step >= 2 ? 'text-[#00896F]' : 'text-gray-500']">Payment</span>
            </div>

            <div :class="['flex-1 h-[2px] mx-4', step >= 3 ? 'bg-[#00896F]' : 'bg-gray-200']"></div>

            <!-- Step 3: Confirm -->
            <div :class="['flex items-center gap-3', step < 3 ? 'opacity-50' : '']">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center', step >= 3 ? 'bg-[#00896F] text-white shadow-sm' : 'bg-white border-2 border-gray-200 text-gray-400']">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </div>
              <span :class="['text-sm font-medium', step >= 3 ? 'text-[#00896F]' : 'text-gray-500']">Confirm</span>
            </div>
          </div>
        </div>

        <!-- Main Content Layout -->
        <div v-if="!success" class="flex flex-col lg:flex-row gap-8">

          <!-- Left Column -->
          <div class="flex-1">

            <!-- Step 1: Billing Information -->
            <div v-if="step === 1" class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <h2 class="text-[20px] font-medium text-gray-900 mb-8">Billing Information</h2>

              <div class="space-y-6">
                <div>
                  <label class="block text-[14px] text-gray-900 mb-2">Company Name</label>
                  <input v-model="billing.company_name" type="text" class="w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #A2E8D6;" />
                </div>

                <div>
                  <label class="block text-[14px] text-gray-900 mb-2">Tax ID / EIN</label>
                  <input v-model="billing.tax_id" type="text" placeholder="XX-XXXXXXX" class="w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #A2E8D6;" />
                </div>

                <div>
                  <label class="block text-[14px] text-gray-900 mb-2">Street Address</label>
                  <input v-model="billing.street_address" type="text" class="w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #A2E8D6;" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-[14px] text-gray-900 mb-2">City</label>
                    <input v-model="billing.city" type="text" class="w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #A2E8D6;" />
                  </div>
                  <div>
                    <label class="block text-[14px] text-gray-900 mb-2">State</label>
                    <input v-model="billing.state" type="text" class="w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #A2E8D6;" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-[14px] text-gray-900 mb-2">ZIP Code</label>
                    <input v-model="billing.zip_code" type="text" class="w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #A2E8D6;" />
                  </div>
                  <div>
                    <label class="block text-[14px] text-gray-900 mb-2">Country</label>
                    <input v-model="billing.country" type="text" class="w-full bg-white border rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00896F] focus:ring-1 focus:ring-[#00896F]" style="border-color: #A2E8D6;" />
                  </div>
                </div>

                <button @click="step = 2" type="button" class="w-full mt-4 bg-[#00896F] text-white py-3.5 rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors">
                  Continue to Payment
                </button>
              </div>
            </div>

            <!-- Step 2: Payment Method -->
            <div v-else-if="step === 2" class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <h2 class="text-[20px] font-medium text-gray-900 mb-2">Payment Details</h2>

              <!-- Saved cards, offered first — skips re-entering card details entirely -->
              <template v-if="savedCards.length && !useNewCard">
                <p class="text-[14px] text-gray-500 mb-6">Choose a saved card, or add a different one</p>
                <div class="space-y-3 mb-4">
                  <div
                    v-for="card in savedCards"
                    :key="card.id"
                    @click="selectedCardId = card.id"
                    :class="['border rounded-2xl p-6 flex items-center justify-between cursor-pointer transition-colors', selectedCardId === card.id ? 'border-[#04C18F]' : 'border-gray-200']"
                    :style="selectedCardId === card.id ? 'background: linear-gradient(90deg, #F0FDFA 0%, #F0FDF4 100%);' : ''"
                  >
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-8 bg-[#DCFCE7] rounded flex items-center justify-center text-[#00A63E]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                      </div>
                      <div>
                        <p class="text-[14px] font-medium text-gray-900 capitalize">{{ card.card_brand }} •••• {{ card.card_last4 }}</p>
                        <p class="text-[12px] text-gray-500">Expires {{ String(card.card_exp_month).padStart(2, '0') }}/{{ card.card_exp_year }}</p>
                      </div>
                    </div>
                    <div :class="['w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0', selectedCardId === card.id ? 'border-[#04C18F]' : 'border-gray-300']">
                      <div v-if="selectedCardId === card.id" class="w-2.5 h-2.5 rounded-full bg-[#04C18F]"></div>
                    </div>
                  </div>
                </div>
                <button type="button" @click="switchToNewCard" class="text-sm text-[#00896F] font-medium hover:underline mb-2">Use a different card</button>
              </template>

              <!-- New card entry -->
              <template v-else>
                <p class="text-[14px] text-gray-500 mb-8">Enter your card details to subscribe</p>
                <div id="card-element" class="border rounded-lg px-4 py-3.5" style="border-color: #A2E8D6;"></div>
                <button v-if="savedCards.length" type="button" @click="useNewCard = false" class="text-sm text-[#00896F] font-medium hover:underline mt-2">Use saved card instead</button>
              </template>

              <p v-if="cardError" class="text-sm text-red-500 mt-2">{{ cardError }}</p>

              <div class="bg-[#EBFAF6] border border-[#04C18F80] rounded-lg p-4 flex gap-3 mt-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-[#00896F] shrink-0 mt-0.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                <p class="text-sm text-[#00896F]">Your payment information is encrypted and processed securely by Stripe. TaxAid never stores your card number.</p>
              </div>

              <div class="flex gap-4 pt-8">
                <button @click="step = 1" type="button" class="w-1/3 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button @click="goToReview" type="button" class="flex-1 bg-[#00896F] text-white py-3.5 rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors">
                  Review Order
                </button>
              </div>
            </div>

            <!-- Step 3: Review & Confirm -->
            <div v-else class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <h2 class="text-[20px] font-medium text-gray-900 mb-6">Review & Confirm</h2>

              <div class="space-y-6 mb-8">
                <div>
                  <p class="text-sm text-gray-900 mb-3">Billing Information</p>
                  <div class="rounded-xl p-5" style="background-color: #F0FDFA;">
                    <p class="text-[16px] text-gray-900 font-medium mb-1">{{ billing.company_name || '—' }}</p>
                    <p v-if="billing.tax_id" class="text-sm text-gray-600 mb-1">{{ billing.tax_id }}</p>
                    <p v-if="billing.street_address" class="text-sm text-gray-600 mb-1">{{ billing.street_address }}</p>
                    <p v-if="billing.city || billing.state || billing.zip_code" class="text-sm text-gray-600 mb-1">{{ [billing.city, billing.state, billing.zip_code].filter(Boolean).join(', ') }}</p>
                    <p v-if="billing.country" class="text-sm text-gray-600">{{ billing.country }}</p>
                  </div>
                </div>

                <div>
                  <p class="text-sm text-gray-900 mb-3">Payment Method</p>
                  <div class="rounded-xl p-5 flex items-center gap-4" style="background-color: #F0FDFA;">
                    <div class="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-900 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
                    </div>
                    <div v-if="selectedCard && !useNewCard">
                      <p class="text-[14px] text-gray-900 font-medium capitalize">{{ selectedCard.card_brand }} •••• {{ selectedCard.card_last4 }}</p>
                      <p class="text-[12px] text-gray-600">Expires {{ String(selectedCard.card_exp_month).padStart(2, '0') }}/{{ selectedCard.card_exp_year }}</p>
                    </div>
                    <p v-else class="text-[14px] text-gray-900 font-medium">New card</p>
                  </div>
                </div>
              </div>

              <p v-if="cardError" class="text-sm text-red-500 mb-4">{{ cardError }}</p>

              <div class="flex gap-4 pt-4 border-t border-gray-100">
                <button @click="step = 2" type="button" class="flex-1 bg-white border py-3.5 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors" style="border-color: #A2E8D6;">
                  Back
                </button>
                <button @click="submit" :disabled="submitting" type="button" class="flex-1 bg-[#00896F] text-white py-3.5 rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-50">
                  {{ submitting ? 'Processing...' : 'Confirm Payment' }}
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
                  <span class="text-gray-600">{{ plan.name }} Plan</span>
                  <span class="text-gray-900 font-medium">{{ plan.is_trial ? 'FREE' : `${currency} ${price.toFixed(2)}` }}</span>
                </div>
                <div class="flex justify-between text-[14px]">
                  <span class="text-gray-600">Billing Period</span>
                  <span class="text-gray-900 font-medium">{{ cycle === 'monthly' ? 'Monthly' : 'Yearly' }}</span>
                </div>
                <div v-for="(d, i) in applicableDiscounts" :key="'d'+i" class="flex justify-between text-[14px]">
                  <span class="text-[#04C18F]">Discount ({{ d.name }})</span>
                  <span class="text-[#04C18F] font-medium">-{{ currency }} {{ discountValue(d).toFixed(2) }}</span>
                </div>
              </div>

              <template v-if="!plan.is_trial && (applicableDiscounts.length || planTaxes.length)">
                <div class="border-t border-gray-100 pt-4 space-y-2 mb-4">
                  <div class="flex justify-between text-[14px]">
                    <span class="text-gray-600">Subtotal</span>
                    <span class="text-gray-900 font-medium">{{ currency }} {{ afterDiscount.toFixed(2) }}</span>
                  </div>
                  <div v-for="(t, i) in planTaxes" :key="'t'+i" class="flex justify-between text-[14px]">
                    <span class="text-gray-600">{{ t.name }} {{ t.is_percent ? `(${t.amount}%)` : '' }}</span>
                    <span class="text-gray-900 font-medium">{{ currency }} {{ taxValue(t).toFixed(2) }}</span>
                  </div>
                </div>
              </template>

              <div class="border-t border-gray-100 pt-6 mb-8">
                <div class="flex justify-between items-end">
                  <span class="text-[16px] text-gray-900 font-medium">Total Due Today</span>
                  <span class="text-[24px] text-gray-900 font-medium">{{ displayPrice }}</span>
                </div>
              </div>

              <div class="bg-[#F9FAFB] rounded-xl p-5">
                <h4 class="text-[14px] font-medium text-gray-900 mb-4">What's included:</h4>
                <ul v-if="checkoutIncluded.length" class="space-y-2">
                  <li v-for="(line, i) in checkoutIncluded" :key="i" class="flex items-start gap-2 text-[13px] text-gray-600">
                    <span class="w-1 h-1 rounded-full mt-1.5 shrink-0 bg-black"></span>
                    {{ line }}
                  </li>
                </ul>
                <ul v-else class="space-y-3">
                  <li v-for="group in features" :key="group.title" class="text-[13px] text-gray-600">
                    <p class="font-medium text-gray-900 mb-1">{{ group.title }}</p>
                    <ul class="space-y-2 mb-2">
                      <li v-for="(point, i) in group.points" :key="i" class="flex items-start gap-2">
                        <span class="w-1 h-1 rounded-full mt-1.5 shrink-0 bg-black"></span>
                        {{ point.label }}
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </template>

      <!-- Success -->
      <div v-if="success" class="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 p-12 shadow-sm text-center mt-8">
        <div class="w-24 h-24 bg-[#E6FBF2] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-10 h-10 text-[#00C950]"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
        </div>
        <h2 class="text-[30px] font-medium text-[#000000] mb-2">Payment Successful!</h2>
        <p class="text-[16px] text-[#667085] mb-10">Your subscription to the <span class="font-bold">{{ plan?.name }}</span> plan has been activated.</p>

        <div class="bg-[#F4FBF9] rounded-xl p-6 text-left mb-10">
          <div class="flex justify-between py-4 border-b border-[#E6F5F0]">
            <span class="text-[16px] text-gray-900">Plan</span>
            <span class="text-[16px] text-gray-900">{{ plan?.name }}</span>
          </div>
          <div class="flex justify-between py-4 border-b border-[#E6F5F0]">
            <span class="text-[16px] text-gray-900">Billing Cycle</span>
            <span class="text-[16px] text-gray-900">{{ cycle === 'monthly' ? 'Monthly' : 'Yearly' }}</span>
          </div>
          <div class="flex justify-between pt-6 pb-2 items-center">
            <span class="text-[18px] text-gray-900">Total</span>
            <span class="text-[28px] text-gray-900 font-medium">{{ displayPrice }}</span>
          </div>
        </div>

        <div class="flex justify-center gap-4">
          <NuxtLink to="/settings/subscription" class="bg-[#00896F] text-white px-6 py-3 rounded-lg text-[15px] font-medium hover:bg-[#00705a] transition-colors">
            Return to Subscription
          </NuxtLink>
        </div>
      </div>
    </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { loadStripe, type Stripe, type StripeElements, type StripeCardElement } from '@stripe/stripe-js'

const route = useRoute()
const { getPlans, createSetupIntent, subscribe, getPaymentMethods, getBillingInfo, saveBillingInfo, addPaymentMethod } = usePayment()

const planId = Number(route.query.plan_id)
const cycle = (route.query.cycle === 'yearly' ? 'yearly' : 'monthly') as 'monthly' | 'yearly'

const step = ref(1)
const loading = ref(true)
const submitting = ref(false)
const success = ref(false)
const cardError = ref('')
const plan = ref<any>(null)
const savedCards = ref<any[]>([])
const selectedCardId = ref<number | null>(null)
const useNewCard = ref(false)
const selectedCard = computed(() => savedCards.value.find((c: any) => c.id === selectedCardId.value) || null)
const isFirstPayment = ref(true)
const billing = ref<any>({ company_name: '', tax_id: '', street_address: '', city: '', state: '', zip_code: '', country: '' })

const priceField = computed(() => cycle === 'monthly' ? 'monthly_price' : 'annual_price')
const currency = computed(() => plan.value?.current_version?.currency || 'AED')
const price = computed(() => Number(plan.value?.current_version?.[priceField.value] ?? 0))
const features = computed(() => (cycle === 'monthly' ? plan.value?.current_version?.monthly_features : plan.value?.current_version?.annual_features) || [])
const checkoutIncluded = computed(() => plan.value?.current_version?.checkout_included || [])

const applicableDiscounts = computed(() =>
  (plan.value?.current_version?.discounts || []).filter((d: any) => !d.one_time || isFirstPayment.value)
)
const planTaxes = computed(() => plan.value?.current_version?.taxes || [])
const discountValue = (d: any) => d.is_percent ? price.value * d.amount / 100 : d.amount
const afterDiscount = computed(() => Math.max(0, price.value - applicableDiscounts.value.reduce((sum: number, d: any) => sum + discountValue(d), 0)))
const taxValue = (t: any) => t.is_percent ? afterDiscount.value * t.amount / 100 : t.amount
const total = computed(() => afterDiscount.value + planTaxes.value.reduce((sum: number, t: any) => sum + taxValue(t), 0))
const displayPrice = computed(() => plan.value?.is_trial ? 'FREE' : `${currency.value} ${total.value.toFixed(2)}`)

let stripe: Stripe | null = null
let elements: StripeElements | null = null
let cardElement: StripeCardElement | null = null

async function mountCardElement() {
  if (cardElement) return // already mounted
  const config = useRuntimeConfig()
  if (!stripe) stripe = await loadStripe(config.public.stripePublishableKey as string)
  if (!stripe) return

  elements = stripe.elements()
  cardElement = elements.create('card', { style: { base: { fontSize: '14px' } } })

  await nextTick()
  cardElement.mount('#card-element')
  cardElement.on('change', (event) => {
    cardError.value = event.error?.message || ''
  })
}

function switchToNewCard() {
  useNewCard.value = true
  nextTick(() => mountCardElement())
}

function goToReview() {
  if ((!selectedCard.value || useNewCard.value) && (!stripe || !cardElement)) return
  step.value = 3
}

onMounted(async () => {
  try {
    const [plansRes, pmRes, billingRes] = await Promise.all([getPlans(), getPaymentMethods(), getBillingInfo()])
    plan.value = (plansRes.data || []).find((p: any) => p.id === planId) || null
    isFirstPayment.value = plansRes.is_first_payment ?? true
    savedCards.value = pmRes.data || []
    selectedCardId.value = (savedCards.value.find((pm: any) => pm.is_default) || savedCards.value[0] || null)?.id ?? null
    if (billingRes.data) {
      billing.value = {
        company_name: billingRes.data.company_name || '', tax_id: billingRes.data.tax_id || '',
        street_address: billingRes.data.street_address || '', city: billingRes.data.city || '',
        state: billingRes.data.state || '', zip_code: billingRes.data.zip_code || '', country: billingRes.data.country || '',
      }
    }
  } finally {
    loading.value = false
  }

  if (!plan.value) return

  // No saved card at all — go straight to card entry, nothing to offer as "saved".
  if (!savedCards.value.length) {
    await mountCardElement()
  }
})

async function attemptSubscribe(paymentMethodId: string) {
  try {
    await subscribe({ plan_id: planId, billing_cycle: cycle, payment_method_id: paymentMethodId })
    success.value = true
  } catch (err: any) {
    const errData = err?.data
    if (errData?.requires_action && errData?.client_secret && stripe) {
      const { error: confirmError } = await stripe.confirmCardPayment(errData.client_secret)
      if (confirmError) {
        cardError.value = confirmError.message || 'Card authentication failed'
        return
      }
      // 3D Secure completed — the same invoice is now confirmed, retry so subscribe() picks
      // up the now-paid incomplete subscription instead of leaving it stuck.
      await attemptSubscribe(paymentMethodId)
      return
    }
    cardError.value = errData?.message || 'Something went wrong. Please try again.'
  }
}

const submit = async () => {
  if (submitting.value) return
  submitting.value = true
  cardError.value = ''

  try {
    await saveBillingInfo(billing.value)

    let paymentMethodId: string

    if (selectedCard.value && !useNewCard.value) {
      paymentMethodId = selectedCard.value.stripe_payment_method_id
    } else {
      if (!stripe || !cardElement) { submitting.value = false; return }

      const intentRes = await createSetupIntent()
      const clientSecret = intentRes.data.client_secret

      const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement },
      })

      if (error) {
        cardError.value = error.message || 'Card confirmation failed'
        submitting.value = false
        return
      }

      paymentMethodId = setupIntent!.payment_method as string

      // Persist the now-verified card immediately — if subscribe() fails below, the card is
      // still saved locally so a retry reuses it instead of re-confirming a fresh SetupIntent
      // (which would otherwise leave a Stripe-only card the local list never learns about).
      try {
        const pmRes = await addPaymentMethod(paymentMethodId)
        savedCards.value = [...savedCards.value.filter((c: any) => c.id !== pmRes.data.id), pmRes.data]
        selectedCardId.value = pmRes.data.id
        useNewCard.value = false
      } catch {
        // non-fatal — subscribe() below still works with the raw paymentMethodId either way
      }
    }

    await attemptSubscribe(paymentMethodId)
  } catch (err: any) {
    cardError.value = err?.data?.message || 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
