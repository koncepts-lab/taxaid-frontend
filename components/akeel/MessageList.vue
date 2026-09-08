<template>
    <div v-for="(m, idx) in messages" :key="idx"
        class="max-w-[85%] rounded-xl px-4 py-2.5 text-sm"
        :class="m.role === 'user' ? 'ml-auto bg-[#00B69B] text-white whitespace-pre-wrap' : (isDark ? 'bg-white/10 text-white' : 'bg-primary-100/10 text-black')">
        <span v-if="m.role === 'user'">{{ m.content }}</span>
        <div v-else>
            <div class="md-content" v-html="renderMarkdown(m.content)"></div>
            <div v-if="m.ledgerRefs?.length" class="flex flex-wrap gap-1.5 mt-2">
                <button v-for="ledger in m.ledgerRefs" :key="ledger" @click="openLedger(ledger)"
                    :class="['inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors', isDark ? 'border-white/20 text-white/80 hover:bg-white/10' : 'border-primary-100/40 text-[#013e32] hover:bg-primary-100/10']">
                    <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                        <line x1="9" y1="10" x2="9" y2="20" />
                    </svg>
                    {{ ledger }}
                </button>
            </div>
        </div>
    </div>

    <!-- Reuses the real Revenue ledger modal as-is — button-only, never opens by default.
         ledgerRefs only ever populate from System-category tool results, so this only ever
         opens for real data the chat actually surfaced. -->
    <RevenueLedgerModal :is-open="ledgerModalOpen" :ledger-name="selectedLedgerName" @close="ledgerModalOpen = false" />
</template>

<script setup>
/**
 * Single shared message-list renderer for every Akeel chat surface (full-page ChatWindow,
 * sidebar ChatSideBar, alert ChatModal) — one place to fix instead of three. Reads `messages`
 * straight from useAkeel()'s shared state, no props needed; the ledger-modal trigger lives here
 * too so any surface embedding this component gets it automatically.
 */
const { isDark } = useTheme()
const { messages } = useAkeel()

const ledgerModalOpen = ref(false)
const selectedLedgerName = ref('')

function openLedger(ledgerName) {
    selectedLedgerName.value = ledgerName
    ledgerModalOpen.value = true
}
</script>

<style scoped>
.md-content :deep(p) { margin: 0 0 0.5em; }
.md-content :deep(p:last-child) { margin-bottom: 0; }
.md-content :deep(ul), .md-content :deep(ol) { margin: 0 0 0.5em 1.25em; }
.md-content :deep(strong) { font-weight: 600; }
.md-content :deep(code) { background: rgba(0,0,0,0.06); padding: 0.1em 0.35em; border-radius: 4px; font-size: 0.9em; }
</style>
