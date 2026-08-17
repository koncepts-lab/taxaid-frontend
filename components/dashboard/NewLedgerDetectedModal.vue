<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[99999] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-t-[2.5rem] md:rounded-2xl mt-auto md:mt-0 max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl w-full max-w-6xl max-h-[78vh] min-[1800px]:min-h-[92vh] overflow-y-auto" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

        <!-- Header -->
        <div class="sticky top-0 z-20 bg-white border-b shadow-sm">
          <div class="px-6 py-4 flex justify-between items-start border-b border-gray-100">
            <div>
              <div class="flex items-center gap-2 text-xl font-bold text-gray-800 uppercase">
                <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                NEW LEDGER DETECTED
              </div>
              <p class="text-sm text-gray-500 mt-2 max-w-2xl">
                {{ ledgers.length }} new ledger account(s) identified. Map each one to the appropriate financial statement code and account groups.
              </p>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 pb-6 pt-4 space-y-6">
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
                  <CommonSingleSelectFilter v-model="mappings[ledger.ledger_name].fs_code" :options="mappingOptions.fs_codes" placeholder="Select FS Code" />
                </div>

                <!-- Main Group -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Main Group <span class="text-gray-500">*</span></label>
                  <CommonSingleSelectFilter v-model="mappings[ledger.ledger_name].main_group" :options="mappingOptions.main_groups" placeholder="Select main group" />
                </div>

                <!-- Sub Group -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Sub Group <span class="text-gray-500">*</span></label>
                  <CommonSingleSelectFilter v-model="mappings[ledger.ledger_name].sub_group" :options="mappingOptions.sub_groups" placeholder="Select sub group" />
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 z-10 bg-white px-6 py-4 border-t flex justify-end items-center gap-4">
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
