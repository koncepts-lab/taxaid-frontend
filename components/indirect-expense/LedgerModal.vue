<template>
  <CommonLedgerModal
    :is-open="open"
    :ledger-name="ledger"
    card="indirect-expense"
    @close="$emit('update:open', false)"
  />
</template>

<script setup>
defineProps({
  open: Boolean,
  ledger: String
})

defineEmits(['update:open'])
</script>
