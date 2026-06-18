<template>
  <div class="mt-8">
    <h2 class="text-xl font-normal text-gray-900 mb-6">Daily Activity Tracker</h2>
    
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <!-- Table Header -->
      <div class="grid grid-cols-5 bg-[#00896F] text-white text-sm font-medium py-3 px-6">
        <div>Time In</div>
        <div>Time Out</div>
        <div>Type of Appointment</div>
        <div>Client Id</div>
        <div>Client Name</div>
      </div>
      
      <!-- Table Body -->
      <div v-if="!isTimerRunning && activities.length === 0" class="text-center py-12 text-gray-500 text-sm border-b border-gray-100">
        No activities logged today. Start by logging in and adding Time In.
      </div>
      <div v-else-if="activities.length === 0" class="text-center py-12 text-gray-500 text-sm border-b border-gray-100">
        Session active. Logging time...
      </div>
      <div v-else>
        <!-- Render activities here if provided -->
        <div v-for="(act, idx) in activities" :key="idx" class="grid grid-cols-5 text-sm text-gray-700 py-3 px-6 border-b border-gray-100">
          <div>{{ act.timeIn }}</div>
          <div>{{ act.timeOut || '-' }}</div>
          <div>{{ act.type }}</div>
          <div>{{ act.clientId }}</div>
          <div>{{ act.clientName }}</div>
        </div>
      </div>
    </div>

    <!-- Total Footer -->
    <div class="mt-8 bg-[#FFF9E5] border border-[#FDEBBA] rounded-md p-4 flex justify-between items-center text-sm text-gray-900">
      <div>Total hours spent today:</div>
      <div class="text-xl font-bold">{{ totalHours }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Activity {
  timeIn: string
  timeOut: string
  type: string
  clientId: string
  clientName: string
}

const props = withDefaults(defineProps<{
  isTimerRunning?: boolean
  activities?: Activity[]
  totalHours?: string
}>(), {
  isTimerRunning: false,
  activities: () => [],
  totalHours: '00:00:00 hrs'
})
</script>
