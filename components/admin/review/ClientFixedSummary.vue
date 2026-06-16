<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-8 p-8">
    <div class="mb-6">
      <h2 class="text-[22px] font-medium text-gray-900 mb-1">Client Fixed Summary</h2>
      <p class="text-[15px] text-gray-500">Overview of all client fixed</p>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center gap-4 mb-6">
      <div class="relative flex-1 max-w-[60%]">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input type="text" class="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-[#00896F]" placeholder="Search by Client name or client id...">
      </div>
      <button class="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      <div class="relative w-56">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        <select class="block w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-[#00896F] text-gray-700 bg-white">
          <option>All Statuses</option>
          <option>Ongoing</option>
          <option>Planned</option>
          <option>Completed</option>
        </select>
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-t-lg border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#00896F]">
          <tr>
            <th scope="col" class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[15%]">Client ID</th>
            <th scope="col" class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[25%]">Client Name</th>
            <th scope="col" class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[45%]">Client Fixed Review</th>
            <th scope="col" class="px-6 py-4 text-left text-[13px] font-medium text-white tracking-wider w-[15%]">Status</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100 border-x border-b border-gray-200">
          <tr v-if="summaries.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-sm text-gray-500">No summaries found.</td>
          </tr>
          <tr v-for="sum in summaries" :key="sum.id" class="hover:bg-gray-50 transition-colors group">
            <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-800">{{ sum.clientId }}</td>
            <td class="px-6 py-5 whitespace-nowrap text-[15px] font-medium text-gray-900">{{ sum.clientName }}</td>
            <td class="px-6 py-5">
              <div class="flex items-center gap-4 w-[85%]">
                <div class="flex-1 flex flex-col gap-2">
                  <span class="text-[13px] font-medium text-gray-800">
                    Review {{ sum.reviewCurrent }}/{{ sum.reviewTotal }} <span class="mx-1 text-gray-400">.</span> Steps {{ sum.stepsCurrent }}/{{ sum.stepsTotal }}
                  </span>
                  <div class="w-full bg-[#EAEAEA] rounded-full h-[5px] overflow-hidden">
                    <div class="h-[5px] rounded-full" :class="getProgressColor(sum.status)" :style="`width: ${sum.progressPercent}%`"></div>
                  </div>
                </div>
                <span class="text-[13px] font-semibold text-gray-800 mt-5">{{ sum.progressPercent }}%</span>
              </div>
            </td>
            <td class="px-6 py-5 whitespace-nowrap">
              <span class="px-3.5 py-1 inline-flex text-xs font-semibold rounded-full" :class="getStatusClass(sum.status)">
                {{ sum.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ClientFixedSummary {
  id: string
  clientId: string
  clientName: string
  reviewCurrent: number
  reviewTotal: number
  stepsCurrent: number
  stepsTotal: number
  progressPercent: number
  status: 'Planned' | 'Ongoing' | 'Completed'
}

defineProps<{
  summaries: ClientFixedSummary[]
}>()

const getProgressColor = (status: string) => {
  if (status === 'Ongoing') return 'bg-[#5C8DFF]'
  if (status === 'Planned') return 'bg-[#F39C12]'
  if (status === 'Completed') return 'bg-[#00896F]'
  return 'bg-gray-400'
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Ongoing': return 'bg-[#EAF1FF] text-[#5C8DFF]'
    case 'Planned': return 'bg-[#FFF4E5] text-[#F39C12]'
    case 'Completed': return 'bg-[#E2F7ED] text-[#4BD37B]'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>
