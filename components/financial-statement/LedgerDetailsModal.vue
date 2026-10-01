<template>
    <FinancialStatementLedgerModal v-bind="$props" @close="$emit('close')" />
</template>

<script setup>
defineProps({
    isOpen: Boolean,
    loading: Boolean,
    ledgerName: String,
    data: Object,
    isDark: Boolean,
    statement: {
        type: String,
        default: 'pl'
    },
    rangeOption: String,
    customFrom: String,
    customTo: String
})

defineEmits(['close'])
</script>