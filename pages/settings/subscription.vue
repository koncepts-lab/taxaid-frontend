<template>
  <NuxtLayout name="dashboard">
    <div class="mx-auto p-6 pb-20">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="transition-colors duration-300 text-[#013E32]" style="font-size: 24px;">Subscription Management</h1>
        <p class="font-normal mt-1 transition-colors duration-300 text-[#00000080]">Manage your plan, billing and payment methods</p>
      </div>

      <div v-if="loading" class="text-center py-20 text-[#00000080]">Loading...</div>

      <template v-else>
        <!-- Trial Banner -->
        <div v-if="subscription && isTrial" class="rounded-2xl text-white p-8 mb-10 flex justify-between items-center shadow-lg" style="background: linear-gradient(90deg, #B45309 0%, #92400E 100%);">
          <div>
            <p class="text-[14px] text-white mb-1 font-normal">Free Trial</p>
            <h2 class="text-[30px] font-normal mb-1">{{ subscription.plan_name }}</h2>
            <p class="text-[16px] text-white font-light">Trial ends on {{ formatDate(subscription.end_date) }} — add a payment method before then to keep access</p>
          </div>
          <div class="text-right">
            <p class="text-[14px] text-white font-light">Trial Ends</p>
            <p class="text-[24px] text-white font-light">{{ trialDaysLeft }} day{{ trialDaysLeft === 1 ? '' : 's' }} left</p>
          </div>
        </div>

        <!-- Current Plan Banner -->
        <div v-else-if="subscription" class="rounded-2xl text-white p-8 mb-10 flex justify-between items-center shadow-lg" style="background: linear-gradient(90deg, #015243 0%, #007760 100%);">
          <div>
            <p class="text-[14px] text-white mb-1 font-normal">Current Plan</p>
            <h2 class="text-[30px] font-normal mb-1">{{ subscription.plan_name }}</h2>
            <p class="text-[16px] text-white font-light">
              {{ currency }} {{ Number(subscription.plan_amount_aed).toFixed(2) }}/{{ subscription.billing_cycle === 'monthly' ? 'month' : 'year' }}
              <template v-if="subscription.current_period_end"> • Renews on {{ formatDate(subscription.current_period_end) }}</template>
            </p>
          </div>
          <div class="text-right">
            <p class="text-[14px] text-white font-light">Next Payment</p>
            <p class="text-[24px] text-white font-light">{{ currency }} {{ Number(subscription.plan_amount_aed).toFixed(2) }}</p>
          </div>
        </div>
        <div v-else class="rounded-2xl p-8 mb-10 text-center border border-gray-200 bg-white">
          <p class="text-[16px] text-[#00000080]">You don't have an active subscription yet — choose a plan below to get started.</p>
        </div>

        <!-- Available Plans -->
        <div class="mb-12">
          <h3 class="text-[24px] font-regular text-black mb-2">Available Plans</h3>

          <!-- Toggle -->
          <div class="flex mb-8">
            <div class="w-full rounded-xl flex justify-center items-center gap-3.5" style="background-color: #61FFD62E; border: 1px solid #04C18FBD; padding: 18px;">
              <button @click="billingCycle = 'monthly'" :class="['max-w-[400px] flex-1 py-3 rounded-lg text-[14px] transition-all shadow-sm', billingCycle === 'monthly' ? 'font-regular bg-[#00896F] text-white' : 'font-regular bg-white text-[#1a1a1a]']">Monthly Billing</button>
              <button @click="billingCycle = 'yearly'" :class="['max-w-[400px] flex-1 py-3 rounded-lg text-[14px] transition-all flex items-center justify-center gap-2 shadow-sm', billingCycle === 'yearly' ? 'font-regular bg-[#00896F] text-white' : 'font-regular bg-white text-[#1a1a1a]']">
                Annual Billing
                <span v-if="maxAnnualSavingsPercent > 0" :class="['text-[12px] px-3 py-0.5 rounded-full font-regular', billingCycle === 'yearly' ? 'bg-white text-[#00896F]' : 'text-white']" :style="billingCycle !== 'yearly' ? 'background-color: #00C950;' : ''">Save {{ maxAnnualSavingsPercent }}%</span>
              </button>
            </div>
          </div>

          <!-- Pricing Cards -->
          <div v-if="sortedPlans.length" class="overflow-x-auto pt-4 pb-2">
          <div class="grid grid-flow-col auto-cols-[calc((100%-6rem)/3)] gap-12">
            <div v-for="plan in sortedPlans" :key="plan.id" :class="['h-full bg-white rounded-2xl p-6 flex flex-col shadow-sm relative', isCurrentPlan(plan) ? 'border-2 border-[#04C18F] shadow-lg z-10' : 'border border-gray-200']">
              <div v-if="plan.is_popular || isCurrentPlan(plan)" class="absolute -top-3 left-6 flex gap-2">
                <span v-if="plan.is_popular" class="bg-[#04C18F] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
                <span v-if="isCurrentPlan(plan)" class="bg-[#E6F8F3] text-[#00896F] border border-[#04C18F] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">Current Plan</span>
              </div>

              <h4 :class="['text-[24px] font-normal text-gray-900 mb-3', (plan.is_popular || isCurrentPlan(plan)) ? 'mt-10' : '']">{{ plan.name }}</h4>
              <div class="mb-4">
                <span v-if="plan.is_trial" class="text-[36px] font-regular text-black">FREE</span>
                <template v-else>
                  <span class="text-[36px] font-regular text-black">{{ currency }} {{ planPrice(plan) }}</span>
                  <span class="text-[16px] text-[#000000CC]">{{ billingCycle === 'monthly' ? ' /month' : ' /year' }}</span>
                </template>
              </div>
              <p v-if="!plan.is_trial && billingCycle === 'yearly' && annualMonthlyEquivalent(plan)" class="text-[14px] text-[#04C18F] mb-3 font-medium">{{ currency }} {{ annualMonthlyEquivalent(plan) }}/mo when billed annually</p>
              <p class="text-[16px] text-[#000000CC] mb-6">{{ plan.description }}</p>

              <ul class="space-y-4 mb-8 flex-1">
                <li v-for="group in planFeatures(plan)" :key="group.title">
                  <p class="text-[13px] font-medium text-[#00896F] mb-2">{{ group.title }}</p>
                  <ul class="space-y-3 mb-3">
                    <li v-for="(point, i) in group.points" :key="i" class="text-[14px] text-[#000000] flex items-start gap-3">
                      <svg v-if="point.included === false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-red-400 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                      <svg v-else-if="point.included === true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-[#04C18F] shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                      <span v-else class="w-5 h-5 shrink-0 flex items-center justify-center"><span class="w-1.5 h-1.5 rounded-full bg-[#000000CC]"></span></span>
                      {{ point.label }}
                    </li>
                  </ul>
                </li>
              </ul>

              <button v-if="isCurrentPlan(plan)" class="w-full bg-white border border-gray-200 text-gray-400 py-3 rounded-xl text-sm font-medium cursor-default">
                Current Plan
              </button>
              <NuxtLink v-else :to="`/settings/checkout?plan_id=${plan.id}&cycle=${billingCycle}`" class="w-full bg-[#00896F] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#00705a] flex items-center justify-center gap-2 transition-colors">
                {{ subscription && Number(plan.current_version?.[priceField]) < Number(subscription.plan_amount_aed) ? 'Downgrade' : subscription ? 'Upgrade' : 'Choose Plan' }}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </NuxtLink>
            </div>
          </div>
          </div>
          <div v-else class="text-center py-10 text-[#00000080] border border-gray-200 rounded-2xl bg-white">No plans available right now.</div>
        </div>

        <!-- Payment Methods -->
        <div class="mb-12">
          <h3 class="text-[20px] text-[#000] font-medium mb-1">Payment Methods</h3>
          <p class="text-[14px] text-[#000000CC] mb-6">Manage your saved payment methods</p>

          <div v-if="defaultPaymentMethod" class="mb-6">
            <p class="mb-3 text-[14px] text-[#000000CC]">Default Payment Method</p>
            <div class="border border-[#04C18F] rounded-2xl p-8 flex items-center justify-between shadow-sm" style="background: linear-gradient(90deg, #F0FDFA 0%, #F0FDF4 100%);">
              <div class="flex items-center gap-4">
                <div class="w-12 h-8 bg-[#DCFCE7] rounded flex items-center justify-center text-[#00A63E]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                </div>
                <div>
                  <div class="flex items-center gap-3 mb-1">
                    <p class="text-[16px] font-medium text-gray-900 capitalize">{{ defaultPaymentMethod.card_brand }} •••• {{ defaultPaymentMethod.card_last4 }}</p>
                    <span class="bg-[#00896F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Default</span>
                  </div>
                  <p class="text-[14px] text-[#000000CC]">Expires {{ String(defaultPaymentMethod.card_exp_month).padStart(2, '0') }}/{{ defaultPaymentMethod.card_exp_year }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="otherPaymentMethods.length" class="mb-6">
            <p class="mb-3 text-[14px] text-[#000000CC]">Other Saved Cards ({{ otherPaymentMethods.length }})</p>
            <div v-for="pm in otherPaymentMethods" :key="pm.id" class="border rounded-2xl p-8 flex items-center justify-between mb-4 shadow-sm" style="background-color: #F9FAFB; border-color: #E5E7EB;">
              <div class="flex items-center gap-4">
                <div class="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                </div>
                <div>
                  <p class="text-[16px] font-medium text-gray-900 capitalize mb-1">{{ pm.card_brand }} •••• {{ pm.card_last4 }}</p>
                  <p class="text-[14px] text-[#000000CC]">Expires {{ String(pm.card_exp_month).padStart(2, '0') }}/{{ pm.card_exp_year }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <button @click="makeDefault(pm.id)" class="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">Set as Default</button>
                <button @click="removeCard(pm.id)" class="p-2.5 bg-white border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                </button>
              </div>
            </div>
          </div>

          <div v-if="!paymentMethods.length" class="mb-6 text-center py-10 text-[#00000080] border border-gray-200 rounded-2xl bg-white">No saved payment methods yet.</div>

          <button @click="isUpdatePaymentModalOpen = true" class="w-full py-4 bg-[#FFFFFF] border border-[#04C18F80] text-[#00896F] text-sm font-medium rounded-2xl hover:bg-[#F0FDF8] flex items-center justify-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add New Payment Method
          </button>
        </div>

        <!-- Billing History -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-6">Billing History</h3>

          <div v-if="invoices.length" class="space-y-3">
            <div v-for="invoice in invoices" :key="invoice.id" class="border rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all hover:shadow-md" style="background-color: #F0FDFA; border-color: #04C18F80;">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 mb-1">{{ invoice.stripe_invoice_id || `Invoice #${invoice.id}` }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(invoice.payment_date) }} • {{ invoice.plan?.name || subscription?.plan_name }}</p>
                </div>
              </div>
              <div class="flex items-center gap-6">
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900 mb-1">{{ currency }} {{ Number(invoice.amount_aed).toFixed(2) }}</p>
                  <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full inline-block uppercase', invoice.status === 'paid' ? 'bg-[#E6F8F3] text-[#00896F]' : invoice.status === 'failed' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500']">{{ invoice.status }}</span>
                </div>
                <NuxtLink v-if="invoice.status === 'failed' && invoice.plan_id" :to="`/settings/checkout?plan_id=${invoice.plan_id}&cycle=${subscription?.billing_cycle || 'monthly'}`" class="text-xs font-medium text-[#00896F] hover:underline px-2">Retry</NuxtLink>
                <a v-if="invoice.receipt_url" :href="invoice.receipt_url" target="_blank" class="text-gray-400 hover:text-gray-800 transition-colors p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                </a>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-10 text-[#00000080] border border-gray-200 rounded-2xl bg-white">No billing history yet.</div>
        </div>
      </template>

    </div>

    <!-- Update/Add Payment Method Modal -->
    <div v-if="isUpdatePaymentModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div class="p-6">
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
            <button @click="closePaymentModal" class="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div id="update-card-element" class="border rounded-lg px-4 py-3.5" style="border-color: #04C18F80;"></div>
          <p v-if="cardError" class="text-sm text-red-500 mt-2">{{ cardError }}</p>

          <div class="bg-[#EBFAF6] border border-[#04C18F80] rounded-lg p-4 flex gap-3 mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-[#00896F] shrink-0 mt-0.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
            <p class="text-sm text-[#00896F]">Your payment information is encrypted and processed securely by Stripe.</p>
          </div>
        </div>

        <div class="px-6 py-5 flex gap-4">
          <button @click="closePaymentModal" class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button @click="submitPaymentMethod" :disabled="savingCard" class="flex-1 py-2.5 bg-[#00896F] text-white text-sm font-medium rounded-lg hover:bg-[#00705a] transition-colors disabled:opacity-50">
            {{ savingCard ? 'Saving...' : 'Add Card' }}
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { loadStripe, type Stripe, type StripeElements, type StripeCardElement } from '@stripe/stripe-js'

const {
  getPlans, getSubscription, getInvoices, createSetupIntent,
  getPaymentMethods, addPaymentMethod, setDefaultPaymentMethod, deletePaymentMethod,
} = usePayment()

const loading = ref(true)
const billingCycle = ref<'monthly' | 'yearly'>('monthly')
const plans = ref<any[]>([])
const subscription = ref<any>(null)
const invoices = ref<any[]>([])
const paymentMethods = ref<any[]>([])

const isUpdatePaymentModalOpen = ref(false)
const savingCard = ref(false)
const cardError = ref('')

const defaultPaymentMethod = computed(() => paymentMethods.value.find(pm => pm.is_default) || null)
const otherPaymentMethods = computed(() => paymentMethods.value.filter(pm => !pm.is_default))

const currency = computed(() => subscription.value?.plan?.current_version?.currency || plans.value[0]?.current_version?.currency || 'AED')
const priceField = computed(() => billingCycle.value === 'monthly' ? 'monthly_price' : 'annual_price')
const isTrial = computed(() => subscription.value && !subscription.value.stripe_subscription_id)

const trialDaysLeft = computed(() => {
  if (!subscription.value?.end_date) return 0
  const diffMs = new Date(subscription.value.end_date).getTime() - Date.now()
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
})

const planPrice = (plan: any) => Number(plan.current_version?.[priceField.value] ?? 0).toFixed(2)

const planFeatures = (plan: any) => {
  // Trial plans have no real annual variant (price is always 0 either way) — one shared list.
  if (plan.is_trial) return plan.current_version?.monthly_features || []
  const groups = billingCycle.value === 'monthly' ? plan.current_version?.monthly_features : plan.current_version?.annual_features
  return groups || []
}

const isCurrentPlan = (plan: any) => subscription.value?.plan_id === plan.id

// Trial plans are excluded from GET /payment/plans (not selectable by anyone else) — but the
// user currently on one needs to see their own card, so merge it in from the subscription payload.
const sortedPlans = computed(() => {
  const list = [...plans.value]
  if (isTrial.value && subscription.value?.plan && !list.some(p => p.id === subscription.value.plan.id)) {
    list.push(subscription.value.plan)
  }
  return list.sort((a, b) => Number(a.current_version?.[priceField.value] ?? 0) - Number(b.current_version?.[priceField.value] ?? 0))
})

// Derived, not stored — savings only shown when annual genuinely beats monthly*12.
const annualSavingsPercent = (plan: any) => {
  const monthly = Number(plan.current_version?.monthly_price ?? 0)
  const annual = Number(plan.current_version?.annual_price ?? 0)
  if (!monthly || !annual) return 0
  const percent = Math.round((1 - annual / (monthly * 12)) * 100)
  return percent > 0 ? percent : 0
}

const annualMonthlyEquivalent = (plan: any) => {
  const annual = Number(plan.current_version?.annual_price ?? 0)
  if (!annual) return null
  return (annual / 12).toFixed(2)
}

const maxAnnualSavingsPercent = computed(() => Math.max(0, ...plans.value.map(annualSavingsPercent)))

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

let stripe: Stripe | null = null
let elements: StripeElements | null = null
let cardElement: StripeCardElement | null = null

const closePaymentModal = () => {
  isUpdatePaymentModalOpen.value = false
  cardError.value = ''
}

watch(isUpdatePaymentModalOpen, async (open) => {
  if (!open) return
  cardError.value = ''

  const config = useRuntimeConfig()
  if (!stripe) stripe = await loadStripe(config.public.stripePublishableKey as string)
  if (!stripe) return

  elements = stripe.elements()
  cardElement = elements.create('card', { style: { base: { fontSize: '14px' } } })

  await nextTick()
  cardElement.mount('#update-card-element')
  cardElement.on('change', (event) => { cardError.value = event.error?.message || '' })
})

const submitPaymentMethod = async () => {
  if (!stripe || !cardElement || savingCard.value) return
  savingCard.value = true
  cardError.value = ''

  try {
    const { data } = await createSetupIntent()
    const { error, setupIntent } = await stripe.confirmCardSetup(data.client_secret, {
      payment_method: { card: cardElement },
    })

    if (error) {
      cardError.value = error.message || 'Card confirmation failed'
      return
    }

    const res = await addPaymentMethod(setupIntent!.payment_method as string)
    paymentMethods.value.push(res.data)
    closePaymentModal()
  } catch (err: any) {
    cardError.value = err?.data?.message || 'Something went wrong. Please try again.'
  } finally {
    savingCard.value = false
  }
}

const makeDefault = async (id: number) => {
  await setDefaultPaymentMethod(id)
  paymentMethods.value = paymentMethods.value.map(pm => ({ ...pm, is_default: pm.id === id }))
}

const removeCard = async (id: number) => {
  await deletePaymentMethod(id)
  paymentMethods.value = paymentMethods.value.filter(pm => pm.id !== id)
}

onMounted(async () => {
  try {
    const [plansRes, subRes, invoicesRes, pmRes] = await Promise.all([
      getPlans(),
      getSubscription(),
      getInvoices(),
      getPaymentMethods(),
    ])
    plans.value = plansRes.data || []
    subscription.value = subRes.data || null
    invoices.value = invoicesRes.data || []
    paymentMethods.value = pmRes.data || []
  } finally {
    loading.value = false
  }
})
</script>
