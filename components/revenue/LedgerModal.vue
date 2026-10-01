<template>
  <CommonLedgerModal
    :is-open="isOpen"
    :ledger-name="ledgerName"
    card="revenue"
    @close="$emit('close')"
  />
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  ledgerName: String
})

defineEmits(['close'])
</script>
