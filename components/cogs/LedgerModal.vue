<template>
  <CommonLedgerModal
    :is-open="open"
    :ledger-name="ledger"
    card="cogs"
    @close="$emit('close')"
  />
</template>

<script setup>
defineProps({
  open: Boolean,
  ledger: String
})

defineEmits(['close'])
</script>
