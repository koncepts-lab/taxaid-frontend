<script setup>
import { defineProps, defineEmits, watch, onBeforeUnmount } from 'vue';

// Generic popup — mode 'error' (default) is a one-button auto-dismissing notice, replacing raw
// alert(); mode 'confirm' is a Cancel/Confirm gate, replacing raw confirm().
const props = defineProps({
  isOpen: { type: Boolean, default: false },
  isDark: { type: Boolean, default: false },
  mode: { type: String, default: 'error' }, // 'error' | 'confirm'
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  autoCloseMs: { type: Number, default: 5000 },
});

const emit = defineEmits(['close', 'confirm']);

const close = () => emit('close');
const confirm = () => emit('confirm');

let autoCloseTimer = null;
const clearAutoClose = () => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
};

watch(() => props.isOpen, (open) => {
  clearAutoClose();
  if (open && props.mode !== 'confirm' && props.autoCloseMs > 0) {
    autoCloseTimer = setTimeout(close, props.autoCloseMs);
  }
});

onBeforeUnmount(clearAutoClose);
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen"
          class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          @click.self="close">

        <div class="w-full max-w-md shadow-2xl rounded-2xl"
            :class="isDark ? 'bg-[#01261f] border border-white/10' : 'bg-white'">

          <div class="flex justify-between items-start gap-3 p-5 pb-3">
            <div class="flex items-start gap-3 min-w-0">
              <div class="p-2 rounded-full shrink-0" :class="mode === 'confirm' ? (isDark ? 'bg-amber-500/10' : 'bg-amber-50') : (isDark ? 'bg-red-500/10' : 'bg-red-50')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="mode === 'confirm' ? 'text-amber-500' : 'text-red-600'">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div class="min-w-0">
                <h2 class="text-base font-semibold truncate" :class="isDark ? 'text-white' : 'text-gray-900'">{{ title || (mode === 'confirm' ? 'Are you sure?' : 'Upload Failed') }}</h2>
                <p v-if="mode !== 'confirm'" class="text-[13px] mt-0.5" :class="isDark ? 'text-white/60' : 'text-gray-500'">Something went wrong</p>
              </div>
            </div>
            <button @click="close" class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" :class="isDark ? 'text-white' : 'text-gray-400'">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-5 pb-5">
            <p v-if="mode === 'confirm'" class="text-[13px] leading-relaxed" :class="isDark ? 'text-white/70' : 'text-gray-600'">
              {{ message }}
            </p>
            <p v-else class="text-[13px] leading-relaxed rounded-lg border p-3"
                :class="isDark ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-red-50 border-red-200 text-red-600'">
              {{ message }}
            </p>
          </div>

          <div v-if="mode === 'confirm'" class="flex justify-end gap-2 px-5 pb-5">
            <button @click="close" class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                :class="isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'">
              {{ cancelText }}
            </button>
            <button @click="confirm" class="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">
              {{ confirmText }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
