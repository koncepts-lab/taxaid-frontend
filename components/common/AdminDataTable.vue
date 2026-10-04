<template>
  <div class="rounded-[8px] min-h-[420px] border" :class="[overflowVisible ? 'overflow-visible' : 'overflow-hidden', dark ? 'border-white/10' : 'border-gray-100']">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-[#00896F] text-white">
          <th v-for="h in headers" :key="h" class="py-4 px-8 font-normal text-[15px] border-r border-[#ffffff1A] last:border-0 first:rounded-tl-[8px] last:rounded-tr-[8px]">{{ h }}</th>
        </tr>
      </thead>
      <tbody class="divide-y" :class="dark ? 'divide-white/5' : 'divide-gray-100'">
        <template v-if="loading">
          <tr v-for="n in minRows" :key="'sk' + n" class="h-[64px]">
            <td v-for="h in headers" :key="h" class="py-6 px-8">
              <div class="h-4 rounded animate-pulse" :class="dark ? 'bg-white/10' : 'bg-gray-100'" style="width: 70%"></div>
            </td>
          </tr>
        </template>
        <template v-else-if="rowCount === 0">
          <tr>
            <td :colspan="headers.length" class="py-10 px-8 text-center text-[14px] opacity-50">{{ emptyText }}</td>
          </tr>
          <tr v-for="n in minRows - 1" :key="'empty' + n" class="h-[64px]"><td :colspan="headers.length"></td></tr>
        </template>
        <template v-else>
          <slot />
          <tr v-for="n in Math.max(0, minRows - rowCount)" :key="'fill' + n" class="h-[64px]"><td :colspan="headers.length"></td></tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  headers: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  rowCount: { type: Number, default: 0 },
  emptyText: { type: String, default: 'No data found.' },
  minRows: { type: Number, default: 10 },
  dark: { type: Boolean, default: false },
  overflowVisible: { type: Boolean, default: false },
})
</script>
