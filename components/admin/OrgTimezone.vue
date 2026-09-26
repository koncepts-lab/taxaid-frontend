<template>
  <div class="border rounded-[16px] shadow-sm overflow-hidden" :class="isDark ? 'bg-[#002E26] border-teal-950/40' : 'bg-white border-gray-200'">
    <div class="px-6 py-4 border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
      <h2 class="text-[16px] font-medium" :class="isDark ? 'text-white' : 'text-[#101828]'">Time zone</h2>
      <p class="text-[13px] mt-0.5" :class="isDark ? 'text-white/60' : 'text-[#4A5565]'">
        The zone this organization and each of its tenants use, with the current time there.
        <template v-if="data && !data.can_edit">Only a Super Admin can change it.</template>
      </p>
    </div>

    <div class="p-6">
      <CommonTimezonePanel :data="data" :editable="!!data?.can_edit" :busy="busy" :error="error" show-default @save="onSave" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  tenantId: { type: Number, required: true },
})

const { isDark } = useTheme()
const { getTenantTimezone, setTenantTimezone } = useClientManagement()

const data = ref(null)
const busy = ref(false)
const error = ref('')

const message = (e, fallback) => e?.data?.message || (e?.data?.errors ? Object.values(e.data.errors).flat()[0] : null) || fallback

onMounted(async () => {
  try {
    const res = await getTenantTimezone(props.tenantId)
    data.value = res?.data ?? null
  } catch (e) {
    error.value = message(e, 'Could not load the time zone.')
  }
})

const onSave = async (payload) => {
  busy.value = true
  error.value = ''
  try {
    const res = await setTenantTimezone(props.tenantId, payload)
    data.value = res?.data ?? data.value
  } catch (e) {
    error.value = message(e, 'Could not save the time zone.')
  } finally {
    busy.value = false
  }
}
</script>
