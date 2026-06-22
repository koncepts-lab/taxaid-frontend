<template>
  <div class="mt-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-normal text-gray-900">Daily Activity Tracker</h2>
      <button
        v-if="!hideAddButton"
        @click="showForm = !showForm"
        class="flex items-center gap-2 px-4 py-2 bg-[#00896F] text-white text-sm font-medium rounded-lg hover:bg-[#007A62] transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Activity
      </button>
    </div>

    <!-- Add Internal Activity Form -->
    <div v-if="showForm && !hideAddButton" class="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <p class="text-xs text-gray-500 mb-3">Log an internal activity (client sessions are auto-tracked from appointment timers)</p>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Time In</label>
          <input v-model="form.time_in" type="time" class="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Time Out (optional)</label>
          <input v-model="form.time_out" type="time" class="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#00896F]" />
        </div>
      </div>
      <div v-if="formError" class="mt-2 text-xs text-red-600">{{ formError }}</div>
      <div class="flex gap-2 mt-3">
        <button @click="submitForm" :disabled="submitting" class="px-4 py-2 bg-[#00896F] text-white text-sm font-medium rounded-md hover:bg-[#007A62] disabled:opacity-60 transition-colors">
          {{ submitting ? 'Saving...' : 'Save' }}
        </button>
        <button @click="cancelForm" class="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-md hover:bg-gray-100 transition-colors">
          Cancel
        </button>
      </div>
    </div>

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
        <div v-for="(act, idx) in paged" :key="act.id ?? idx" class="grid grid-cols-5 text-sm text-gray-700 py-3 px-6 border-b border-gray-100">
          <div>{{ act.timeIn }}</div>
          <div>{{ act.timeOut || '—' }}</div>
          <div>{{ act.type }}</div>
          <div>{{ act.clientId }}</div>
          <div>{{ act.clientName }}</div>
        </div>
      </div>
    </div>

    <PaginationBar :page="page" :totalPages="totalPages" :from="from" :to="to" :total="total" @prev="emit('prev')" @next="emit('next')" />

    <!-- Total Footer -->
    <div class="mt-4 bg-[#FFF9E5] border border-[#FDEBBA] rounded-md p-4 flex justify-between items-center text-sm text-gray-900">
      <div>Total hours spent today:</div>
      <div class="text-xl font-bold">{{ totalHours }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PaginationBar from './PaginationBar.vue'

interface Activity {
  id?: number
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
  hideAddButton?: boolean
  page?: number
  totalPages?: number
  from?: number
  to?: number
  total?: number
}>(), {
  isTimerRunning: false,
  activities: () => [],
  totalHours: '0 hrs 0 min',
  hideAddButton: false,
  page: 1,
  totalPages: 1,
  from: 0,
  to: 0,
  total: 0,
})

const emit = defineEmits<{
  'add-activity': [payload: { appointment_type: string; time_in: string; time_out?: string }]
  'prev': []
  'next': []
}>()

const paged = computed(() => props.activities)

const showForm  = ref(false)
const submitting = ref(false)
const formError  = ref('')

const form = ref({ time_in: '', time_out: '' })

function todayDateTime(time: string): string {
  const today = new Date().toISOString().slice(0, 10)
  return `${today} ${time}:00`
}

async function submitForm() {
  formError.value = ''
  if (!form.value.time_in) {
    formError.value = 'Time In is required.'
    return
  }
  submitting.value = true
  try {
    const payload: any = {
      appointment_type: 'internal',
      time_in: todayDateTime(form.value.time_in),
    }
    if (form.value.time_out) {
      payload.time_out = todayDateTime(form.value.time_out)
    }
    emit('add-activity', payload)
    cancelForm()
  } finally {
    submitting.value = false
  }
}

function cancelForm() {
  showForm.value  = false
  form.value      = { time_in: '', time_out: '' }
  formError.value = ''
}
</script>
