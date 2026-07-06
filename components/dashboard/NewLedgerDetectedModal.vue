<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

        <!-- Header -->
        <div class="px-8 pt-8 pb-4 flex justify-between items-start">
          <div>
            <div class="flex items-center gap-2 text-xl font-bold text-gray-800 tracking-wide uppercase">
              <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              NEW LEDGER DETECTED
            </div>
            <p class="text-sm text-gray-500 mt-2 max-w-2xl">
              {{ ledgers.length }} new ledger account(s) identified. Map each one to the appropriate financial statement code and account groups.
            </p>
          </div>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mt-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="px-8 py-4 space-y-6">
          <div v-for="(ledger, i) in ledgers" :key="ledger.ledger_name" class="border border-gray-100 rounded-xl p-6" :class="i > 0 ? 'border-t' : ''">

            <!-- Ledger Info Box -->
            <div class="bg-[#eafaf1] border border-[#bbf7d0] rounded-xl p-6 mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Ledger Name</label>
              <input type="text" :value="ledger.ledger_name" class="w-full md:w-1/2 bg-white border border-gray-100 rounded-lg px-4 py-2.5 text-gray-800 font-medium focus:outline-none shadow-sm" readonly />
              <p class="text-xs text-gray-500 mt-2">{{ ledger.message }}</p>
            </div>

            <!-- Assign Section -->
            <div>
              <h3 class="text-lg font-bold text-gray-800 mb-4">Assign</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

                <!-- FS Code -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">FS Code <span class="text-gray-500">*</span></label>
                  <div class="relative">
                    <select v-model="mappings[ledger.ledger_name].fs_code" class="w-full bg-gray-50 border border-gray-100 text-gray-700 text-sm rounded-lg focus:ring-[#058a64] focus:border-[#058a64] block px-4 py-2.5 appearance-none cursor-pointer">
                      <option value="" disabled>Select FS Code</option>
                      <option v-for="code in mappingOptions.fs_codes" :key="code" :value="code">{{ code }}</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <!-- Main Group -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Main Group <span class="text-gray-500">*</span></label>
                  <div class="relative">
                    <select v-model="mappings[ledger.ledger_name].main_group" class="w-full bg-gray-50 border border-gray-100 text-gray-700 text-sm rounded-lg focus:ring-[#058a64] focus:border-[#058a64] block px-4 py-2.5 appearance-none cursor-pointer">
                      <option value="" disabled>Select main group</option>
                      <option v-for="grp in mappingOptions.main_groups" :key="grp" :value="grp">{{ grp }}</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <!-- Sub Group -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Sub Group <span class="text-gray-500">*</span></label>
                  <div class="relative">
                    <select v-model="mappings[ledger.ledger_name].sub_group" class="w-full bg-gray-50 border border-gray-100 text-gray-700 text-sm rounded-lg focus:ring-[#058a64] focus:border-[#058a64] block px-4 py-2.5 appearance-none cursor-pointer">
                      <option value="" disabled>Select sub group</option>
                      <option v-for="grp in mappingOptions.sub_groups" :key="grp" :value="grp">{{ grp }}</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-8 pb-8 pt-8 flex justify-end items-center gap-4">
          <button @click="closeModal" class="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm cursor-pointer">
            Cancel
          </button>
          <button @click="validateAndSubmit" :disabled="submitting || !allMapped" class="px-8 py-2 bg-[#058a64] hover:bg-[#047857] text-white rounded-lg font-medium transition-colors text-sm shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            Validate
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

const props = defineProps({
  data: { type: Array, required: true },
});
const emit = defineEmits(['close', 'resolved']);

const currentLang = useState('currentLang', () => 'en');

const ledgers = computed(() => props.data ?? []);
const mappingOptions = ref({ fs_codes: [], main_groups: [], sub_groups: [] });
const mappings = reactive({});

for (const ledger of ledgers.value) {
  mappings[ledger.ledger_name] = { fs_code: '', main_group: '', sub_group: '' };
}

const allMapped = computed(() =>
  ledgers.value.every((l) => {
    const m = mappings[l.ledger_name];
    return m?.fs_code && m?.main_group && m?.sub_group;
  })
);

onMounted(async () => {
  const res = await useApi('/ledgers/mapping-options');
  if (res?.status === 'success') mappingOptions.value = res.data;
});

const closeModal = () => emit('close');

const submitting = ref(false);
const validateAndSubmit = async () => {
  submitting.value = true;
  try {
    await useApi('/alerts/create-ledgers', {
      method: 'POST',
      body: {
        ledgers: ledgers.value.map((l) => ({
          ledger_name: l.ledger_name,
          ...mappings[l.ledger_name],
        })),
      },
    });
    emit('resolved');
  } finally {
    submitting.value = false;
  }
};
</script>
