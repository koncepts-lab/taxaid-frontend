<template>
  <div class="border rounded-[16px] shadow-sm overflow-hidden" :class="isDark ? 'bg-[#002E26] border-teal-950/40' : 'bg-white border-gray-200'">
    <div class="px-6 py-4 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
      <h2 class="text-[16px] font-medium" :class="isDark ? 'text-white' : 'text-[#101828]'">Currency &amp; country</h2>
      <p class="text-[13px] mt-0.5" :class="isDark ? 'text-white/60' : 'text-[#4A5565]'">
        Each tenant keeps its own currency and country. This overrides what was chosen at onboarding.
        <template v-if="data && !data.can_edit">Only a Super Admin can change it.</template>
      </p>
    </div>

    <div class="p-6">
      <div v-if="!data && !error" class="h-16 rounded-lg animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'"></div>
      <p v-else-if="!data" class="text-sm text-red-500">{{ error }}</p>

      <div v-else class="divide-y" :class="isDark ? 'divide-white/10' : 'divide-gray-100'">
        <div v-for="tenant in data.tenants" :key="tenant.id" class="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
          <div class="min-w-0">
            <p class="text-[14px] font-medium truncate" :class="isDark ? 'text-white' : 'text-[#101828]'">{{ tenant.name }}</p>
            <p class="text-[13px]" :class="isDark ? 'text-white/60' : 'text-[#4A5565]'">
              {{ tenant.currency || '—' }} · {{ tenant.country ? countryName(tenant.country) : '—' }}
            </p>
          </div>
          <button v-if="data.can_edit" type="button" @click="openEdit(tenant)"
            class="px-4 py-1.5 rounded-[10px] border border-[#00896F] text-[#00896F] text-[13px] font-medium hover:bg-[#00896F]/10 transition-colors cursor-pointer">
            Edit
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="editing" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="close">
        <div class="w-[460px] max-w-full rounded-2xl shadow-xl p-6 space-y-4" :class="isDark ? 'bg-[#002E26] text-white' : 'bg-white text-gray-900'">
          <div>
            <h3 class="text-[18px] font-semibold">Currency &amp; country</h3>
            <p class="text-[13px] mt-0.5" :class="isDark ? 'text-white/60' : 'text-gray-500'">{{ editing.name }}</p>
          </div>

          <div>
            <label class="block text-[13px] font-medium mb-1">Currency</label>
            <CommonSelectDropdown mode="select" v-model="form.currency" :options="currencyOptions" :clearable="false" />
          </div>

          <div>
            <label class="block text-[13px] font-medium mb-1">Country</label>
            <CommonSelectDropdown mode="select" v-model="form.country" :options="countries" :clearable="false" searchable />
          </div>

          <p class="text-[12px] text-amber-500">Changing the currency only changes the label. Amounts are not converted.</p>
          <p v-if="error" class="text-[13px] text-red-500">{{ error }}</p>

          <div class="flex justify-end gap-3 pt-1">
            <button type="button" @click="close" :disabled="busy"
              class="px-5 h-[40px] rounded-[10px] text-sm font-medium cursor-pointer" :class="isDark ? 'text-white/70 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'">Cancel</button>
            <button type="button" @click="save" :disabled="busy"
              class="px-5 h-[40px] rounded-[10px] bg-[#00896F] text-white text-sm font-medium hover:bg-[#00705a] disabled:opacity-60 cursor-pointer">
              {{ busy ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  tenantId: { type: Number, required: true },
})

const { isDark } = useTheme()
const { getOrgRegion, setOrgRegion } = useClientManagement()

const data = ref(null)
const editing = ref(null)
const form = ref({ currency: '', country: '' })
const busy = ref(false)
const error = ref('')

const currencyOptions = computed(() => (data.value?.currencies ?? []).map((code) => ({ value: code, label: code })))
const countries = computed(() => countryOptions('en').map((c) => ({ value: c.code, label: c.name, search: c.code })))

const message = (e, fallback) => e?.data?.message || (e?.data?.errors ? Object.values(e.data.errors).flat()[0] : null) || fallback

onMounted(async () => {
  try {
    data.value = (await getOrgRegion(props.tenantId))?.data ?? null
  } catch (e) {
    error.value = message(e, 'Could not load the currency and country.')
  }
})

const openEdit = (tenant) => {
  error.value = ''
  form.value = { currency: tenant.currency || (data.value?.currencies?.[0] ?? ''), country: tenant.country || '' }
  editing.value = tenant
}

const close = () => { if (!busy.value) editing.value = null }

const save = async () => {
  busy.value = true
  error.value = ''

  try {
    const payload = { tenant_id: editing.value.id, currency: form.value.currency }
    if (form.value.country) payload.country = form.value.country
    data.value = (await setOrgRegion(props.tenantId, payload))?.data ?? data.value
    editing.value = null
  } catch (e) {
    error.value = message(e, 'Could not save the currency and country.')
  } finally {
    busy.value = false
  }
}
</script>
