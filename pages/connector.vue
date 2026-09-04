<template>
  <div class="min-h-screen bg-[#f4f6f5] flex items-center justify-center p-4">

    <div v-if="!route.query.token" class="bg-white rounded-2xl shadow-md w-[440px] max-w-full p-10 text-center">
      <div class="w-14 h-14 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-5">
        <svg class="text-red-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </div>
      <h2 class="text-[18px] font-semibold text-gray-900 mb-2">Link Invalid</h2>
      <p class="text-sm text-gray-500">This link is missing its download token.</p>
    </div>

    <div v-else-if="state === 'error'" class="bg-white rounded-2xl shadow-md w-[440px] max-w-full p-10 text-center">
      <div class="w-14 h-14 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-5">
        <svg class="text-red-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </div>
      <h2 class="text-[18px] font-semibold text-gray-900 mb-2">Link Expired</h2>
      <p class="text-sm text-gray-500">{{ errorMessage }}</p>
    </div>

    <div v-else class="bg-white rounded-2xl shadow-md w-[440px] max-w-full p-10 text-center">
      <img src="https://storage.googleapis.com/taxaid_kcms/logo-new-svg/1775803721_tx2.svg" alt="TaxAid" class="h-9 mx-auto mb-6">
      <div class="w-14 h-14 rounded-full bg-[#D1FAE5] flex items-center justify-center mx-auto mb-4">
        <svg class="text-[#007C65]" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      </div>
      <h1 class="text-[20px] font-semibold text-gray-900 mb-2">TaxAid Connector</h1>
      <p class="text-sm text-gray-500 mb-6">Download the connector installer to link this client's Tally to TaxAid.</p>

      <p v-if="state === 'downloading'" class="text-sm text-gray-500 mb-4">Preparing your download…</p>

      <button @click="download" :disabled="state === 'downloading'"
        class="w-full bg-[#007C65] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#006A56] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        <svg v-if="state === 'downloading'" class="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        {{ state === 'downloading' ? 'Downloading…' : 'Download Connector' }}
      </button>
    </div>

  </div>
</template>

<script setup>
definePageMeta({
  middleware: []
})

const route = useRoute()
const config = useRuntimeConfig()

if (route.query.src !== 'taxaidconnect') {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const state = ref('idle') // idle | downloading | error
const errorMessage = ref('')

async function download() {
  if (state.value === 'downloading') return
  state.value = 'downloading'
  try {
    const res = await fetch(`${config.public.apiBase}/connector/tally/updates/download-by-token/${route.query.token}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      errorMessage.value = body.error || 'This download link is invalid or has expired.'
      state.value = 'error'
      return
    }
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'TaxAidConnector.exe'
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
    state.value = 'idle'
  } catch {
    errorMessage.value = 'Could not reach the server. Please try again.'
    state.value = 'error'
  }
}
</script>
