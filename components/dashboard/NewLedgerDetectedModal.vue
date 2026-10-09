<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[99999] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
      <div class="rounded-t-[2.5rem] md:rounded-2xl mt-auto md:mt-0 max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl w-full max-w-6xl max-h-[78vh] min-[1800px]:min-h-[92vh] overflow-y-auto" :class="isDark ? 'bg-[#002e26]' : 'bg-white'" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">

        <!-- Header -->
        <div class="sticky top-0 z-20 border-b shadow-sm" :class="isDark ? 'bg-[#002e26] border-white/10' : 'bg-white border-gray-100'">
          <div class="px-6 py-4 flex justify-between items-start border-b" :class="isDark ? 'border-white/10' : 'border-gray-100'">
            <div>
              <div class="flex items-center gap-2 text-xl font-bold uppercase" :class="isDark ? 'text-white' : 'text-gray-800'">
                <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                NEW LEDGER DETECTED
              </div>
              <p class="text-sm mt-2 max-w-2xl" :class="isDark ? 'text-white/60' : 'text-gray-500'">
                {{ ledgers.length }} new ledger account(s) identified. Map each one to the appropriate financial statement code and account groups.
              </p>
            </div>
            <button @click="closeModal" class="transition-colors cursor-pointer" :class="isDark ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-600'">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 pb-6 pt-4 space-y-6">
          <div v-for="(ledger, i) in ledgers" :key="ledger.ledger_name" class="border rounded-xl p-6" :class="[isDark ? 'border-white/10' : 'border-gray-100', i > 0 ? 'border-t' : '']">

            <!-- Ledger Info Box -->
            <div class="border rounded-xl p-6 mb-6" :class="isDark ? 'bg-white/5 border-white/10' : 'bg-[#eafaf1] border-[#bbf7d0]'">
              <label class="block text-sm font-semibold mb-2" :class="isDark ? 'text-white/70' : 'text-gray-700'">Ledger Name</label>
              <input type="text" :value="ledger.ledger_name" class="w-full md:w-1/2 border rounded-lg px-4 py-2.5 font-medium focus:outline-none shadow-sm" :class="isDark ? 'bg-[#002e26] border-white/10 text-white' : 'bg-white border-gray-100 text-gray-800'" readonly />
              <p class="text-xs mt-2" :class="isDark ? 'text-white/50' : 'text-gray-500'">{{ ledger.message }}</p>
            </div>

            <!-- Assign Section -->
            <div>
              <h3 class="text-lg font-bold mb-4" :class="isDark ? 'text-white' : 'text-gray-800'">Assign</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

                <!-- FS Code -->
                <div>
                  <label class="block text-sm font-semibold mb-2" :class="isDark ? 'text-white/70' : 'text-gray-700'">FS Code <span class="text-gray-500">*</span></label>
                  <CommonSingleSelectFilter v-model="mappings[ledger.ledger_name].fs_code" :options="mappingOptions.fs_codes" placeholder="Select FS Code" />
                </div>

                <!-- Main Group -->
                <div>
                  <label class="block text-sm font-semibold mb-2" :class="isDark ? 'text-white/70' : 'text-gray-700'">Main Group <span class="text-gray-500">*</span></label>
                  <CommonSingleSelectFilter v-model="mappings[ledger.ledger_name].main_group" :options="mappingOptions.main_groups" placeholder="Select main group" />
                </div>

                <!-- Sub Group -->
                <div>
                  <label class="block text-sm font-semibold mb-2" :class="isDark ? 'text-white/70' : 'text-gray-700'">Sub Group <span class="text-gray-500">*</span></label>
                  <CommonSingleSelectFilter v-model="mappings[ledger.ledger_name].sub_group" :options="mappingOptions.sub_groups" placeholder="Select sub group" />
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 z-10 px-6 py-4 border-t flex justify-end items-center gap-4" :class="isDark ? 'bg-[#002e26] border-white/10' : 'bg-white'">
          <button @click="closeModal" class="px-6 py-2 border rounded-lg font-medium transition-colors text-sm cursor-pointer" :class="isDark ? 'border-white/20 text-white/80 hover:bg-white/10' : 'border-gray-200 text-gray-700 hover:bg-gray-50'">
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
const { isDark } = useTheme();

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
