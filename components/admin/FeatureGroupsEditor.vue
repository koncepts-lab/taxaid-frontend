<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <label class="block text-sm font-medium text-gray-900">{{ label }}</label>
      <button type="button" @click="addGroup" class="text-xs text-[#007C65] font-medium hover:underline">+ Add Section</button>
    </div>

    <div v-for="(group, gi) in modelValue" :key="gi" class="border border-gray-100 rounded-lg p-3 mb-3 bg-gray-50/50">
      <div class="flex items-center gap-2 mb-2">
        <input v-model="group.title" type="text" placeholder="Section title, e.g. Core Features"
          class="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-[#00896F]" />
        <button type="button" @click="removeGroup(gi)" class="text-gray-400 hover:text-red-500 shrink-0">✕</button>
      </div>

      <div v-for="(pt, pi) in group.points" :key="pi" class="flex items-start gap-2 mb-2 pl-2">
        <input v-model="pt.included" type="checkbox" class="h-4 w-4 shrink-0 mt-2" />
        <textarea v-model="pt.label" rows="2" placeholder="e.g. Up to 10 tax filings per year"
          class="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#00896F] resize-y max-h-32 overflow-y-auto"></textarea>
        <select v-model="pt.entitlement_key" class="w-40 border border-gray-200 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:border-[#00896F] mt-1">
          <option :value="null">Not linked</option>
          <option v-for="def in entitlementKeys" :key="def.key" :value="def.key">{{ def.label }}</option>
        </select>
        <button type="button" @click="group.points.splice(pi, 1)" class="text-gray-400 hover:text-red-500 shrink-0 mt-2">✕</button>
      </div>
      <button type="button" @click="addPoint(gi)" class="text-xs text-[#007C65] font-medium hover:underline pl-2">+ Add line</button>
    </div>

    <p v-if="!modelValue.length" class="text-xs text-gray-400">No sections yet — add one to start building the feature checklist.</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Array, required: true },
  entitlementKeys: { type: Array, default: () => [] },
  label: { type: String, default: 'Feature List' },
})
const emit = defineEmits(['update:modelValue'])

function addGroup() {
  emit('update:modelValue', [...props.modelValue, { title: '', points: [] }])
}
function removeGroup(gi) {
  const next = [...props.modelValue]
  next.splice(gi, 1)
  emit('update:modelValue', next)
}
function addPoint(gi) {
  props.modelValue[gi].points.push({ label: '', included: true, entitlement_key: null })
}
</script>
