<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40" @click="$emit('dismiss')" />

        <!-- Modal card -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4">
          <!-- Icon -->
          <div class="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
            <svg class="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>

          <!-- Text -->
          <div class="text-center">
            <h3 class="text-[16px] font-semibold text-gray-900 mb-1">Work Session Required</h3>
            <p class="text-[13px] text-gray-500 leading-relaxed">
              Your <span class="font-medium text-gray-700">Work Session Timer</span> must be running before you can start logging activities.<br/>
              Please <span class="font-medium text-gray-700">Clock In</span> from the Work Session Timer first.
            </p>
          </div>

          <!-- Buttons -->
          <div class="w-full mt-1">
            <button @click="$emit('dismiss')"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>()
defineEmits<{ dismiss: [] }>()
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.18s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .relative, .modal-leave-active .relative { transition: transform 0.18s ease; }
.modal-enter-from .relative { transform: scale(0.95); }
.modal-leave-to .relative { transform: scale(0.95); }
</style>
