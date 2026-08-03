<template>
  <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
    <div class="w-full overflow-x-auto min-h-[600px]">
      <table class="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr class="bg-[#008865] text-white text-sm">
            <th v-if="showOrg" class="py-3 px-6 font-medium whitespace-nowrap">Organization</th>
            <th class="py-3 px-6 font-medium whitespace-nowrap">Name</th>
            <th class="py-3 px-6 font-medium whitespace-nowrap">Tier</th>
            <th class="py-3 px-6 font-medium whitespace-nowrap">Monthly</th>
            <th class="py-3 px-6 font-medium whitespace-nowrap">Annual</th>
            <th class="py-3 px-6 font-medium whitespace-nowrap">Versions</th>
            <th class="py-3 px-6 font-medium whitespace-nowrap">Status</th>
            <th class="py-3 px-6 font-medium whitespace-nowrap text-right">Action</th>
          </tr>
        </thead>
        <tbody class="text-sm text-gray-700">
          <tr v-if="loading"><td :colspan="showOrg ? 8 : 7" class="py-10 text-center text-gray-400">Loading...</td></tr>
          <tr v-else-if="!plans.length"><td :colspan="showOrg ? 8 : 7" class="py-10 text-center text-gray-400">No plans yet.</td></tr>
          <tr v-for="p in plans" :key="p.id" class="border-b border-gray-100 hover:bg-gray-50/50">
            <td v-if="showOrg" class="py-4 px-6 font-medium text-gray-800">{{ p.organization?.name ?? `Org #${p.organization_id}` }}</td>
            <td class="py-4 px-6 font-medium text-gray-800">{{ p.name }} <span v-if="p.is_popular" class="text-[#04C18F] text-xs">★</span></td>
            <td class="py-4 px-6 capitalize">{{ p.tier ?? '—' }}</td>
            <td class="py-4 px-6">{{ p.current_version ? formatMoney(p.current_version.monthly_price, p.current_version.currency) : '—' }}</td>
            <td class="py-4 px-6">{{ p.current_version ? formatMoney(p.current_version.annual_price, p.current_version.currency) : '—' }}</td>
            <td class="py-4 px-6">{{ p.versions_count }}</td>
            <td class="py-4 px-6 relative">
              <button @click="openStatusMenu === p.id ? openStatusMenu = null : openStatusMenu = p.id"
                class="text-[12px] font-medium rounded-full px-3 py-1 inline-flex items-center gap-1"
                :class="statusClass(p.status)">
                {{ p.status }}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              <div v-if="openStatusMenu === p.id" class="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-28">
                <button v-for="s in ['draft', 'active', 'inactive']" :key="s"
                  @click="$emit('status', p, s); openStatusMenu = null"
                  class="w-full text-left px-3 py-1.5 text-xs capitalize hover:bg-gray-50" :class="p.status === s ? 'font-semibold' : ''">{{ s }}</button>
              </div>
            </td>
            <td class="py-4 px-6 text-right space-x-3 whitespace-nowrap">
              <button @click="$emit('view', p)" class="inline-flex items-center gap-1.5 text-gray-500 text-[13px] font-medium hover:underline">
                <img src="/images/icons/View.svg" class="w-3.5 h-3.5" alt="" /> View
              </button>
              <button @click="$emit('edit', p)" class="inline-flex items-center gap-1.5 text-[#007C65] text-[13px] font-medium hover:underline">
                <img src="/images/icons/pencil-edit.svg" class="w-3.5 h-3.5" alt="" /> {{ p.status === 'draft' ? 'Continue Editing' : 'New Version' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <CommonPaginationBar v-if="meta && meta.total > 0" :meta="meta" :loading="loading"
      @page-change="(p) => $emit('page-change', p)" @per-page-change="(pp) => $emit('per-page-change', pp)" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  plans: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  showOrg: { type: Boolean, default: false },
  meta: { type: Object, default: null },
})
defineEmits(['view', 'edit', 'status', 'page-change', 'per-page-change'])

const openStatusMenu = ref(null)

function formatMoney(amount, currency) {
  if (amount === null || amount === undefined) return '—'
  return `${Number(amount).toFixed(2)} ${currency ?? 'AED'}`
}

function statusClass(status) {
  if (status === 'active') return 'bg-[#D1FAE5] text-[#065F46]'
  if (status === 'inactive') return 'bg-gray-100 text-gray-500'
  return 'bg-amber-100 text-amber-700'
}
</script>
