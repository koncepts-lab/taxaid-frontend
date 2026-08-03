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
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#00896F] text-white flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
              </div>
              <span class="text-sm font-medium text-[#00896F]">Payment</span>
            </div>
            <div class="flex-1 h-[2px] mx-4 bg-gray-200"></div>
            <div class="flex items-center gap-3 opacity-50">
              <div class="w-10 h-10 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </div>
              <span class="text-sm font-medium text-gray-500">Confirm</span>
            </div>
          </div>
        </div>

        <!-- Main Content Layout -->
        <div v-if="!success" class="flex flex-col lg:flex-row gap-8">

          <!-- Left Column: Payment -->
          <div class="flex-1">
            <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <h2 class="text-[20px] font-medium text-gray-900 mb-2">Payment Details</h2>
              <p class="text-[14px] text-gray-500 mb-8">Enter your card details to subscribe</p>

              <div id="card-element" class="border rounded-lg px-4 py-3.5" style="border-color: #A2E8D6;"></div>
              <p v-if="cardError" class="text-sm text-red-500 mt-2">{{ cardError }}</p>

              <div class="bg-[#EBFAF6] border border-[#04C18F80] rounded-lg p-4 flex gap-3 mt-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-[#00896F] shrink-0 mt-0.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                <p class="text-sm text-[#00896F]">Your payment information is encrypted and processed securely by Stripe. TaxAid never stores your card number.</p>
              </div>

              <div class="flex gap-4 pt-8">
                <NuxtLink to="/settings/subscription" class="w-1/3 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-center">
                  Cancel
                </NuxtLink>
                <button @click="submit" :disabled="submitting" type="button" class="flex-1 bg-[#00896F] text-white py-3.5 rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-50">
                  {{ submitting ? 'Processing...' : `Subscribe — ${currency} ${price}` }}
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
                  <span class="text-gray-900 font-medium">{{ currency }} {{ price }}</span>
                </div>
                <div class="flex justify-between text-[14px]">
                  <span class="text-gray-600">Billing Period</span>
                  <span class="text-gray-900 font-medium">{{ cycle === 'monthly' ? 'Monthly' : 'Yearly' }}</span>
                </div>
              </div>

              <div class="border-t border-gray-100 pt-6 mb-8">
                <div class="flex justify-between items-end">
                  <span class="text-[16px] text-gray-900 font-medium">Total Due Today</span>
                  <span class="text-[24px] text-gray-900 font-medium">{{ currency }} {{ price }}</span>
                </div>
              </div>

              <div class="bg-[#F9FAFB] rounded-xl p-5">
                <h4 class="text-[14px] font-medium text-gray-900 mb-4">What's included:</h4>
                <ul class="space-y-3">
                  <li v-for="group in features" :key="group.title" class="text-[13px] text-gray-600">
                    <p class="font-medium text-gray-900 mb-1">{{ group.title }}</p>
                    <ul class="space-y-2 mb-2">
                      <li v-for="(point, i) in group.points" :key="i" class="flex items-start gap-2">
                        <span class="w-1 h-1 rounded-full bg-black mt-1.5 shrink-0"></span>
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
            <span class="text-[28px] text-gray-900 font-medium">{{ currency }} {{ price }}</span>
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
import { ref, computed, onMounted } from 'vue'
import { loadStripe, type Stripe, type StripeElements, type StripeCardElement } from '@stripe/stripe-js'

const route = useRoute()
const { getPlans, createSetupIntent, subscribe } = usePayment()

const planId = Number(route.query.plan_id)
const cycle = (route.query.cycle === 'yearly' ? 'yearly' : 'monthly') as 'monthly' | 'yearly'

const loading = ref(true)
const submitting = ref(false)
const success = ref(false)
const cardError = ref('')
const plan = ref<any>(null)

const priceField = computed(() => cycle === 'monthly' ? 'monthly_price' : 'annual_price')
const currency = computed(() => plan.value?.current_version?.currency || 'AED')
const price = computed(() => Number(plan.value?.current_version?.[priceField.value] ?? 0).toFixed(2))
const features = computed(() => (cycle === 'monthly' ? plan.value?.current_version?.monthly_features : plan.value?.current_version?.annual_features) || [])

let stripe: Stripe | null = null
let elements: StripeElements | null = null
let cardElement: StripeCardElement | null = null

onMounted(async () => {
  try {
    const res = await getPlans()
    plan.value = (res.data || []).find((p: any) => p.id === planId) || null
  } finally {
    loading.value = false
  }

  if (!plan.value) return

  const config = useRuntimeConfig()
  stripe = await loadStripe(config.public.stripePublishableKey as string)
  if (!stripe) return

  elements = stripe.elements()
  cardElement = elements.create('card', { style: { base: { fontSize: '14px' } } })

  await nextTick()
  cardElement.mount('#card-element')
  cardElement.on('change', (event) => {
    cardError.value = event.error?.message || ''
  })
})

const submit = async () => {
  if (!stripe || !cardElement || submitting.value) return
  submitting.value = true
  cardError.value = ''

  try {
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

    await subscribe({
      plan_id: planId,
      billing_cycle: cycle,
      payment_method_id: setupIntent!.payment_method as string,
    })

    success.value = true
  } catch (err: any) {
    cardError.value = err?.data?.message || 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
