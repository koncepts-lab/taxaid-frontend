<template>
  <div class="border rounded-xl overflow-hidden shadow-sm" :class="dark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-gray-100'">
    <div class="px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-3" :class="dark ? 'border-white/10' : 'border-gray-100'">
      <div>
        <h2 class="text-[16px] font-medium" :class="dark ? 'text-white' : 'text-[#101828]'">App Version Control</h2>
        <p class="text-[13px] mt-0.5" :class="dark ? 'text-white/60' : 'text-[#4A5565]'">Latest / minimum supported version per platform. The mobile app checks this on launch to prompt or force an update.</p>
      </div>

      <div class="flex rounded-lg border overflow-hidden text-[13px] font-medium w-fit shrink-0" :class="dark ? 'border-white/20' : 'border-gray-200'">
        <button type="button" @click="activePlatform = 'android'" class="px-4 py-2 flex items-center gap-2"
          :class="activePlatform === 'android' ? 'bg-[#00896F] text-white' : (dark ? 'text-white/70 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-50')">
          Android
        </button>
        <button type="button" @click="activePlatform = 'ios'" class="px-4 py-2 flex items-center gap-2"
          :class="activePlatform === 'ios' ? 'bg-[#00896F] text-white' : (dark ? 'text-white/70 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-50')">
          iOS
        </button>
      </div>
    </div>

    <p v-if="error" class="px-6 pt-3 text-[13px] text-red-500">{{ error }}</p>

    <div class="p-6" v-if="loading">
      <div class="skeleton h-4 w-24 rounded mb-4" :class="{ dark }"></div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="n in 6" :key="n" class="skeleton h-10 rounded-lg" :class="{ dark }"></div>
      </div>
    </div>

    <div v-else class="p-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-[13px] font-medium mb-1">Latest version</label>
          <input v-model="form.latest_version" type="text" placeholder="1.2.0" maxlength="20" :class="inputClass" class="font-mono" />
        </div>
        <div>
          <label class="block text-[13px] font-medium mb-1">Latest build number</label>
          <input v-model.number="form.latest_build_number" type="number" min="1" placeholder="12" :class="inputClass" class="font-mono" />
        </div>
        <div>
          <label class="block text-[13px] font-medium mb-1">Minimum supported version</label>
          <input v-model="form.min_supported_version" type="text" placeholder="1.0.0" maxlength="20" :disabled="forceUpdate" :class="inputClass" class="font-mono disabled:opacity-60" />
          <p class="text-[12px] mt-1" :class="dark ? 'text-white/40' : 'text-gray-400'">Below this, the app is force-updated.</p>
        </div>
        <div class="sm:col-span-2">
          <label class="block text-[13px] font-medium mb-1">Store URL</label>
          <input v-model="form.store_url" type="text" placeholder="https://play.google.com/store/apps/details?id=..." :class="inputClass" class="font-mono" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-[13px] font-medium mb-1">Custom message <span class="font-normal opacity-60">(optional, shown on the force/optional update prompt)</span></label>
          <textarea v-model="form.message" rows="2" maxlength="2000" placeholder="We upgraded our tax analysis engine. Please update to continue." :class="inputClass"></textarea>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-6 mt-5">
        <label class="flex items-center gap-2.5 cursor-pointer select-none">
          <span class="text-[13px] font-medium">Active</span>
          <button type="button" role="switch" :aria-checked="form.is_active" @click="form.is_active = !form.is_active"
            class="relative w-10 h-[22px] rounded-full transition-colors shrink-0"
            :class="form.is_active ? 'bg-[#00896F]' : (dark ? 'bg-white/20' : 'bg-gray-300')">
            <span class="absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform" :class="form.is_active ? 'translate-x-[18px]' : ''"></span>
          </button>
          <span class="text-[12px]" :class="dark ? 'text-white/40' : 'text-gray-400'">{{ form.is_active ? 'Checks enforced for this platform' : 'No update prompts shown' }}</span>
        </label>

        <label class="flex items-center gap-2.5 cursor-pointer select-none">
          <span class="text-[13px] font-medium">Force update</span>
          <button type="button" role="switch" :aria-checked="forceUpdate" @click="toggleForce"
            class="relative w-10 h-[22px] rounded-full transition-colors shrink-0"
            :class="forceUpdate ? 'bg-amber-500' : (dark ? 'bg-white/20' : 'bg-gray-300')">
            <span class="absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform" :class="forceUpdate ? 'translate-x-[18px]' : ''"></span>
          </button>
          <span class="text-[12px]" :class="dark ? 'text-white/40' : 'text-gray-400'">{{ forceUpdate ? 'Every older version is blocked now' : 'Older versions can skip for now' }}</span>
        </label>
      </div>

      <p v-if="modalError" class="text-[13px] text-red-500 mt-4">{{ modalError }}</p>
      <div class="flex items-center justify-between mt-5">
        <span v-if="savedAt" class="text-[12px]" :class="dark ? 'text-white/40' : 'text-gray-400'">Saved {{ savedAt }}</span>
        <span v-else></span>
        <button @click="save" :disabled="busy" class="px-4 py-2 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] disabled:opacity-60">
          {{ busy ? 'Saving…' : `Save ${activePlatform === 'android' ? 'Android' : 'iOS'} config` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  dark: { type: Boolean, default: false },
})

const { isDark } = useTheme()
const dark = computed(() => props.dark || isDark.value)

const { list, update, validate, errorMessage } = useAppVersionConfigs()

const inputClass = computed(() => [
  'w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-[#008169]',
  dark.value ? 'bg-transparent border-white/20 text-white placeholder-white/40' : 'border-gray-200',
].join(' '))

const activePlatform = ref('android')
const loading = ref(true)
const busy = ref(false)
const error = ref('')
const modalError = ref('')
const savedAt = ref('')

const configs = ref({ android: null, ios: null })
const EMPTY_FORM = () => ({ latest_version: '', latest_build_number: 1, min_supported_version: '', store_url: '', message: '', is_active: true })
const form = ref(EMPTY_FORM())

const applyPlatform = (platform) => {
  const cfg = configs.value[platform]
  form.value = cfg
    ? { latest_version: cfg.latest_version, latest_build_number: cfg.latest_build_number, min_supported_version: cfg.min_supported_version, store_url: cfg.store_url, message: cfg.message || '', is_active: cfg.is_active }
    : EMPTY_FORM()
  modalError.value = ''
  savedAt.value = ''
}

// "Force update" is derived, not stored: on whenever min_supported_version equals latest_version.
const forceUpdate = computed(() => !!form.value.latest_version && form.value.min_supported_version === form.value.latest_version)

const toggleForce = () => {
  if (forceUpdate.value) {
    form.value.min_supported_version = ''
  } else {
    form.value.min_supported_version = form.value.latest_version
  }
}

watch(activePlatform, (p) => applyPlatform(p))

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await list()
    const [android, ios] = res.data
    configs.value = { android, ios }
    applyPlatform(activePlatform.value)
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}

async function save() {
  modalError.value = ''
  const validationError = validate(form.value)
  if (validationError) {
    modalError.value = validationError
    return
  }

  busy.value = true
  try {
    const payload = {
      latest_version: form.value.latest_version.trim(),
      latest_build_number: Number(form.value.latest_build_number),
      min_supported_version: form.value.min_supported_version.trim(),
      store_url: form.value.store_url.trim(),
      message: form.value.message?.trim() || null,
      is_active: form.value.is_active,
    }
    const res = await update(activePlatform.value, payload)
    configs.value[activePlatform.value] = res.data
    savedAt.value = new Date().toLocaleTimeString()
  } catch (e) {
    modalError.value = errorMessage(e)
  } finally {
    busy.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
.skeleton.dark {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.06) 25%, rgba(255, 255, 255, 0.14) 37%, rgba(255, 255, 255, 0.06) 63%);
  background-size: 400% 100%;
}
@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
</style>
