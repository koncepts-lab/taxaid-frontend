// composables/usePayment.ts
export const usePayment = () => {
  const getPlans = () => useApi('/payment/plans')

  const getSubscription = () => useApi('/payment/subscription')

  const getInvoices = (page = 1, perPage = 10) =>
    useApi(`/payment/invoices?page=${page}&per_page=${perPage}`)

  const createSetupIntent = () => useApi('/payment/setup-intent', { method: 'POST' })

  const subscribe = (payload: { plan_id: number; billing_cycle: 'monthly' | 'yearly'; payment_method_id: string }) =>
    useApi('/payment/subscribe', { method: 'POST', body: payload })

  const cancelSubscription = () => useApi('/payment/cancel', { method: 'POST' })

  const getPaymentMethods = () => useApi('/payment/payment-methods')

  const addPaymentMethod = (paymentMethodId: string) =>
    useApi('/payment/payment-methods', { method: 'POST', body: { payment_method_id: paymentMethodId } })

  const setDefaultPaymentMethod = (id: number) =>
    useApi(`/payment/payment-methods/${id}`, { method: 'PATCH', body: { is_default: true } })

  const deletePaymentMethod = (id: number) =>
    useApi(`/payment/payment-methods/${id}`, { method: 'DELETE' })

  return {
    getPlans, getSubscription, getInvoices, createSetupIntent, subscribe, cancelSubscription,
    getPaymentMethods, addPaymentMethod, setDefaultPaymentMethod, deletePaymentMethod,
  }
}
