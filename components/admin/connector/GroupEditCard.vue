<template>
  <div class="rounded-[12px] border p-5 pb-6 space-y-4 shadow-sm h-[300px] overflow-hidden flex flex-col"
       :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-[#E0F9F3]/40 border-[#6FDBBF]'">
    <div class="flex flex-wrap items-end gap-4">
      <div>
        <label class="flex items-center gap-1.5 text-[13px] font-medium mb-1">
          Name
          <span v-if="group.is_custom" class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#82FFE0] text-[#0A0A0A]">
            {{ group.is_ephemeral ? 'Custom · temp' : 'Custom' }}
          </span>
        </label>
        <input v-model="draft.name"
               class="rounded-[8px] border border-[#04C18F33] px-3 py-2 text-[14px]" />
      </div>
      <div>
        <label class="flex items-center gap-1.5 text-[13px] font-medium mb-1">
          Sync Time (cycle 1)
          <span class="relative inline-block group/tip">
            <span class="w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-[10px] flex items-center justify-center cursor-help">i</span>
            <span class="pointer-events-none absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-lg bg-[#003d35] text-white text-[12px] leading-snug px-3 py-2 opacity-0 group-hover/tip:opacity-100 transition-opacity">
              The base daily time this group's tenants sync at. This is the only window a full sync can run in.
            </span>
          </span>
        </label>
        <AdminConnectorTimeWheelPicker v-model="draft.sync_time" :is24-hour="is24Hour" />
      </div>
      <div>
        <label class="flex items-center gap-1.5 text-[13px] font-medium mb-1">
          Cycle 2 Time (catch-up)
          <span class="relative inline-block group/tip">
            <span class="w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-[10px] flex items-center justify-center cursor-help">i</span>
            <span class="pointer-events-none absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-lg bg-[#003d35] text-white text-[12px] leading-snug px-3 py-2 opacity-0 group-hover/tip:opacity-100 transition-opacity">
              Only runs if cycle 1 was missed today — a same-day catch-up attempt. Uncheck "Enabled" for groups that never need a catch-up.
            </span>
          </span>
        </label>
        <div class="flex items-center gap-3">
          <AdminConnectorTimeWheelPicker v-model="draft.cycle_2_time" :is24-hour="is24Hour" />
          <label class="flex items-center gap-1.5 text-[12px] text-gray-600 whitespace-nowrap cursor-pointer">
            <input type="checkbox" v-model="draft.cycle_2_enabled" class="w-4 h-4 accent-[#00896F] cursor-pointer" />
            Enabled
          </label>
        </div>
      </div>
      <div>
        <label class="flex items-center gap-1.5 text-[13px] font-medium mb-1">
          Reconciliation Interval (minutes)
          <span class="relative inline-block group/tip">
            <span class="w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-[10px] flex items-center justify-center cursor-help">i</span>
            <span class="pointer-events-none absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-lg bg-[#003d35] text-white text-[12px] leading-snug px-3 py-2 opacity-0 group-hover/tip:opacity-100 transition-opacity">
              How long a tenant can go without a successful sync before it's flagged for a full resync (checked hourly).
            </span>
          </span>
        </label>
        <input v-model.number="draft.reconciliation_interval_minutes"
               type="number" min="1" class="w-32 rounded-[8px] border border-[#04C18F33] px-3 py-2 text-[14px]" />
      </div>
      <div class="text-[13px] text-gray-500 pb-2.5">{{ group.erp_connections_count ?? 0 }} tenant(s)</div>
      <div class="ml-auto flex items-center gap-2">
        <button v-if="showDelete" @click="$emit('delete')"
                class="px-4 py-2.5 rounded-[10px] border border-red-300 text-red-500 text-[13px] font-medium hover:bg-red-50 transition-colors cursor-pointer">
          Delete
        </button>
        <div class="flex flex-col items-end gap-1">
          <button @click="$emit('save')" :disabled="saving"
                  class="px-6 py-2.5 rounded-[10px] bg-[#00896F] text-white text-[14px] font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
          <span v-if="saved" class="text-[12px] text-[#00896F]">Saved</span>
        </div>
      </div>
    </div>
    <div>
      <label class="flex items-center gap-1.5 text-[13px] font-medium mb-1">
        Scheduled Full Sync
        <span class="relative inline-block group/tip">
          <span class="w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-[10px] flex items-center justify-center cursor-help">i</span>
          <span class="pointer-events-none absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-lg bg-[#003d35] text-white text-[12px] leading-snug px-3 py-2 opacity-0 group-hover/tip:opacity-100 transition-opacity">
            Cycle 1 always runs a full sync (not diff) on this day, regardless of any flag — routine drift prevention.
          </span>
        </span>
      </label>
      <AdminConnectorFullSyncDayPicker
        :frequency="draft.full_sync_frequency" :day="draft.full_sync_day"
        @update:frequency="onFrequencyChange"
        @update:day="draft.full_sync_day = $event" />
    </div>
    <div>
      <label class="block text-[13px] font-medium mb-1">Notes</label>
      <textarea v-model="draft.notes"
                maxlength="2000" rows="2" placeholder="Reference notes for this group..."
                class="w-full h-[56px] rounded-[8px] border border-[#04C18F33] px-3 py-2 text-[14px] resize-none overflow-y-auto"></textarea>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  group: { type: Object, required: true },
  draft: { type: Object, required: true },
  is24Hour: { type: Boolean, default: true },
  saving: { type: Boolean, default: false },
  saved: { type: Boolean, default: false },
  showDelete: { type: Boolean, default: false },
})

const emit = defineEmits(['save', 'delete'])

const { isDark } = useTheme()

function onFrequencyChange(frequency) {
  props.draft.full_sync_frequency = frequency
  props.draft.full_sync_day = frequency === 'monthly' ? 1 : 0
}
</script>
