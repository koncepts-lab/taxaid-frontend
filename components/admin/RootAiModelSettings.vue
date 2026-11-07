<template>
  <div class="rounded-[20px] border shadow-sm p-6 sm:p-8 space-y-6 w-full max-w-full min-w-0 overflow-hidden"
    :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'">
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2 class="text-[20px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">AI Settings - Model Catalog</h2>
        <p class="text-[13px] opacity-60 mt-1">Manage the real Vertex models available to the platform.</p>
      </div>
      <select v-model="statusFilter" @change="loadModels(1)" class="px-3 py-2 border rounded-md text-sm outline-none" :class="isDark ? 'bg-transparent border-white/10 text-white' : 'border-gray-200'">
        <option value="active">Active</option>
        <option value="all">All Models</option>
        <option value="disabled">Disabled</option>
        <option value="removed">Removed</option>
      </select>
    </div>

    <!-- Models table — paginated, 10/page -->
    <div class="w-full overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[860px] text-sm">
        <thead>
          <tr class="text-xs uppercase opacity-60">
            <th class="py-2 px-3">Model</th>
            <th class="py-2 px-3">Provider</th>
            <th class="py-2 px-3">Mode</th>
            <th class="py-2 px-3">Supported Levels</th>
            <th class="py-2 px-3">Status</th>
            <th class="py-2 px-3">Verify</th>
            <th class="py-2 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr v-for="n in 5" :key="'sk'+n" class="border-t" :class="isDark ? 'border-white/10' : 'border-gray-100'">
              <td v-for="c in 7" :key="c" class="py-3.5 px-3">
                <div class="h-4 rounded animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'" :style="{ width: skeletonWidth(c) }"></div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="m in models" :key="m.id" class="border-t" :class="isDark ? 'border-white/10' : 'border-gray-100'">
              <td class="py-3 px-3">{{ m.model_key }}</td>
              <td class="py-3 px-3">{{ formatMechanism(m.thinking_config?.provider) }}</td>
              <td class="py-3 px-3">{{ formatMechanism(m.thinking_config?.mechanism) }}</td>
              <td class="py-3 px-3">{{ formatSupportedLevels(m) }}</td>
              <td class="py-3 px-3">
                <span class="px-2 py-1 rounded text-xs font-medium"
                  :class="m.deleted_at ? 'bg-gray-200 text-gray-600' : (m.is_active ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEF2F2] text-[#DC2626]')">
                  {{ m.deleted_at ? 'Removed' : (m.is_active ? 'Active' : 'Disabled') }}
                </span>
              </td>
              <td class="py-3 px-3">
                <button @click="runRowVerify(m)" :disabled="rowVerifyBusyId === m.id"
                  class="px-3 py-1.5 border rounded-md text-xs disabled:opacity-60 inline-flex items-center gap-1.5" :class="isDark ? 'border-white/10' : 'border-gray-200 hover:bg-gray-50'">
                  <CommonAnimationsSpinner v-if="rowVerifyBusyId === m.id" />
                  <span>Verify</span>
                </button>
              </td>
              <td class="py-3 px-3 text-right whitespace-nowrap">
                <div v-if="!m.deleted_at" class="inline-flex items-center gap-2">
                  <button @click="toggleActive(m)" :title="m.is_active ? 'Disable this model' : 'Enable this model'"
                    class="p-1.5 rounded-md border" :class="isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="m.is_active ? 'text-[#16A34A]' : 'text-gray-400'">
                      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                      <line x1="12" y1="2" x2="12" y2="12" />
                    </svg>
                  </button>
                  <button @click="removeModel(m)" :disabled="m.is_active"
                    :title="m.is_active ? 'Disable this model before removing it' : 'Remove this model'"
                    class="p-1.5 rounded-md border disabled:opacity-40 disabled:cursor-not-allowed"
                    :class="isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-[#FEF2F2]'">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="m.is_active ? 'text-gray-400' : 'text-[#DC2626]'">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!models.length"><td colspan="7" class="py-10 text-center text-sm opacity-50">No models yet.</td></tr>
          </template>
        </tbody>
      </table>
    </div>
    <CommonPaginationBar v-if="meta.total > 0" :meta="meta" :loading="loading"
      @page-change="(p) => loadModels(p)" @per-page-change="(pp) => { meta.per_page = pp; loadModels(1) }" />

    <!-- Bottom: Add Model (left) + Model Tester chat (right) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Add Model -->
      <div class="p-4 rounded-[12px] border space-y-3" :class="isDark ? 'border-white/10' : 'border-gray-100'">
        <h3 class="text-[14px] font-medium">Add Model</h3>

        <div class="space-y-3">
          <div>
            <label class="block text-[12px] opacity-60 mb-1">Model (real Vertex resource)</label>
            <input v-model="newModel.model_key" type="text" placeholder="e.g. gemini-2.5-flash"
              class="w-full px-3 py-2 border rounded-md text-sm outline-none" :class="isDark ? 'bg-transparent border-white/10 text-white' : 'border-gray-200'" />
          </div>
          <div class="flex gap-3">
            <div class="flex-1">
              <label class="block text-[12px] opacity-60 mb-1">Provider</label>
              <select v-model="newModel.provider" class="w-full px-3 py-2 border rounded-md text-sm outline-none" :class="isDark ? 'bg-transparent border-white/10 text-white' : 'border-gray-200'">
                <option value="google">google</option>
                <option value="anthropic">anthropic</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-[12px] opacity-60 mb-1">Mechanism</label>
              <select v-model="newModel.mechanism" class="w-full px-3 py-2 border rounded-md text-sm outline-none" :class="isDark ? 'bg-transparent border-white/10 text-white' : 'border-gray-200'">
                <option v-for="mech in mechanismsForProvider(newModel.provider)" :key="mech" :value="mech">{{ mech }}</option>
              </select>
            </div>
          </div>

          <div v-if="isLevelMechanism">
            <label class="block text-[12px] opacity-60 mb-1.5">Supported Levels (verified against the real API)</label>
            <button @click="runCheckLevels" :disabled="!newModel.model_key || checkingLevels"
              class="w-full h-[38px] mb-2 rounded-[10px] bg-[#00896F] hover:bg-[#00705a] text-white text-sm font-medium transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2">
              <CommonAnimationsSpinner v-if="checkingLevels" />
              <span>Check Supported Levels</span>
            </button>
            <div class="flex gap-4">
              <label v-for="lvl in ['low', 'medium', 'high']" :key="lvl" class="flex items-center gap-1.5 text-sm">
                <input type="checkbox" :value="lvl" v-model="newModel.levels" />
                <span class="capitalize">{{ lvl }}</span>
                <span v-if="levelCheckResults[lvl]" :class="levelCheckResults[lvl].success ? 'text-green-600' : 'text-red-600'">
                  {{ levelCheckResults[lvl].success ? '✓' : '✗' }}
                </span>
              </label>
            </div>
            <div v-if="newModel.levels.length" class="mt-2">
              <label class="block text-[12px] opacity-60 mb-1">Active Level</label>
              <select v-model="newModel.activeLevel" class="w-full px-3 py-2 border rounded-md text-sm outline-none" :class="isDark ? 'bg-transparent border-white/10 text-white' : 'border-gray-200'">
                <option v-for="lvl in newModel.levels" :key="lvl" :value="lvl">{{ lvl }}</option>
              </select>
            </div>
          </div>
          <div v-else-if="newModel.mechanism === 'claude_budget_tokens'">
            <label class="block text-[12px] opacity-60 mb-1">Budget Tokens</label>
            <input v-model.number="newModel.budgetTokens" type="number" min="1" placeholder="e.g. 16000"
              class="w-full px-3 py-2 border rounded-md text-sm outline-none" :class="isDark ? 'bg-transparent border-white/10 text-white' : 'border-gray-200'" />
          </div>

          <div class="flex gap-2">
            <button v-if="!isLevelMechanism" @click="runAddVerify" :disabled="!newModel.model_key || addVerifyBusy"
              class="h-[38px] px-4 rounded-[10px] border text-sm font-medium disabled:opacity-60 inline-flex items-center gap-2" :class="isDark ? 'border-white/10' : 'border-gray-200 hover:bg-gray-50'">
              <CommonAnimationsSpinner v-if="addVerifyBusy" />
              <span>Verify</span>
            </button>
            <button @click="submitNewModel" :disabled="!addVerifiedOk || saving"
              :title="addVerifiedOk ? '' : (isLevelMechanism ? 'Check supported levels before saving' : 'Verify this config before saving')"
              class="h-[38px] px-4 rounded-[10px] bg-[#00896F] hover:bg-[#00705a] text-white text-sm font-medium transition-colors disabled:opacity-60 inline-flex items-center gap-2">
              <CommonAnimationsSpinner v-if="saving" />
              <span>Save Model</span>
            </button>
            <button @click="resetAddForm" class="h-[38px] px-4 rounded-[10px] border text-sm" :class="isDark ? 'border-white/10' : 'border-gray-200 hover:bg-gray-50'">
              Clear
            </button>
          </div>
          <p v-if="!addVerifiedOk" class="text-xs opacity-50">{{ isLevelMechanism ? 'Check supported levels before saving.' : 'Verify the model before saving it.' }}</p>
        </div>
      </div>

      <!-- Model Tester — real multi-turn chat, sandbox only -->
      <div class="p-4 rounded-[12px] border space-y-3 flex flex-col" :class="isDark ? 'border-white/10' : 'border-gray-100'">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-[14px] font-medium">Model Tester</h3>
          <select v-model="testerModelId" @change="resetChat" class="px-3 py-2 border rounded-md text-sm outline-none min-w-[180px]" :class="isDark ? 'bg-transparent border-white/10 text-white' : 'border-gray-200'">
            <option v-for="m in testerModels" :key="m.id" :value="m.id">{{ m.model_key }}</option>
          </select>
        </div>

        <div class="flex-1 min-h-[220px] max-h-[320px] overflow-y-auto rounded-[8px] border p-3 space-y-2" :class="isDark ? 'border-white/10' : 'border-gray-100 bg-gray-50/50'">
          <p v-if="!chatMessages.length" class="text-xs opacity-50 text-center mt-8">No messages yet. Type something below to start.</p>
          <div v-for="(m, i) in chatMessages" :key="i" class="flex" :class="m.role === 'user' ? 'justify-end' : 'justify-start'">
            <div class="max-w-[80%] px-3 py-2 rounded-[10px] text-sm" :class="m.role === 'user' ? 'bg-[#00896F] text-white' : (isDark ? 'bg-white/10 text-white' : 'bg-white border border-gray-200')">
              {{ m.text }}
            </div>
          </div>
          <div v-if="testerBusy" class="flex justify-start">
            <div class="px-3 py-2 rounded-[10px]" :class="isDark ? 'bg-white/10' : 'bg-white border border-gray-200'">
              <CommonAnimationsSpinner class="opacity-60" />
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <input v-model="testerMessage" type="text" placeholder="Type a message…" @keyup.enter="runTestChat"
            class="flex-1 px-3 py-2 border rounded-md text-sm outline-none" :class="isDark ? 'bg-transparent border-white/10 text-white' : 'border-gray-200'" />
          <button @click="runTestChat" :disabled="!testerModelId || !testerMessage || testerBusy"
            class="h-[40px] px-4 rounded-[10px] bg-[#00896F] hover:bg-[#00705a] text-white text-sm font-medium transition-colors disabled:opacity-60">
            Send
          </button>
        </div>
      </div>
    </div>

    <CommonErrorPopupModal
      :is-open="verifyModalOpen"
      :is-dark="isDark"
      :mode="verifyModalResult?.success ? 'success' : 'error'"
      :title="verifyModalResult?.success ? 'Verified' : 'Verify Failed'"
      :message="verifyModalResult?.success ? `Model is working (${verifyModalResult.time_ms}ms)` : (verifyModalResult?.message ?? 'Request failed.')"
      @close="verifyModalOpen = false"
    />

    <CommonErrorPopupModal
      :is-open="actionErrorOpen"
      :is-dark="isDark"
      mode="error"
      title="Failed"
      :message="actionErrorMessage"
      @close="actionErrorOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const { getAiModels, createAiModel, verifyAiModelConfig, verifyAiModelLevels, updateAiModel, deleteAiModel, verifyAiModel, testChatAiModel } = useRootAdmin()

const LEVEL_MECHANISMS = ['gemini_native_level', 'gemini_token_budget', 'claude_effort']
const PROVIDER_MECHANISMS = {
  google: ['gemini_native_level', 'gemini_token_budget', 'none'],
  anthropic: ['claude_effort', 'claude_budget_tokens', 'none'],
}
function mechanismsForProvider(provider) {
  return PROVIDER_MECHANISMS[provider] ?? []
}

const models = ref([])
const meta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const loading = ref(false)
const statusFilter = ref('active')

const newModel = ref({ model_key: '', provider: 'google', mechanism: 'gemini_native_level', levels: [], activeLevel: null, budgetTokens: null })
watch(() => newModel.value.provider, (provider) => {
  newModel.value.mechanism = mechanismsForProvider(provider)[0] ?? 'none'
})
const saving = ref(false)
const addVerifyBusy = ref(false)
const addVerifiedOk = ref(false)
const checkingLevels = ref(false)
const levelCheckResults = ref({})

const isLevelMechanism = computed(() => LEVEL_MECHANISMS.includes(newModel.value.mechanism))

function buildThinkingConfig(m) {
  const config = { provider: m.provider, mechanism: m.mechanism }
  if (LEVEL_MECHANISMS.includes(m.mechanism)) {
    config.levels = m.levels
    config.active_level = m.activeLevel
  }
  if (m.mechanism === 'claude_budget_tokens') config.budget_tokens = m.budgetTokens
  return config
}
function formatMechanism(value) {
  if (!value) return '—'
  return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
function formatSupportedLevels(m) {
  const config = m.thinking_config ?? {}
  if (config.budget_tokens != null) return `${Number(config.budget_tokens).toLocaleString()} tokens`
  if (config.levels?.length) {
    const label = config.levels.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ')
    return config.active_level ? `${label} (active: ${config.active_level})` : label
  }
  return '—'
}

async function runCheckLevels() {
  checkingLevels.value = true
  levelCheckResults.value = {}
  try {
    const res = await verifyAiModelLevels({
      model_key: newModel.value.model_key,
      provider: newModel.value.provider,
      mechanism: newModel.value.mechanism,
    })
    levelCheckResults.value = res?.levels ?? {}
    const passed = Object.entries(levelCheckResults.value).filter(([, r]) => r.success).map(([lvl]) => lvl)
    newModel.value.levels = passed
    if (passed.length && !passed.includes(newModel.value.activeLevel)) newModel.value.activeLevel = passed[0]
    addVerifiedOk.value = passed.length > 0
  } catch (err) {
    console.error('Failed to check supported levels', err)
  } finally {
    checkingLevels.value = false
  }
}

watch(() => [newModel.value.model_key, newModel.value.provider, newModel.value.mechanism, newModel.value.budgetTokens], () => {
  addVerifiedOk.value = false
})

const rowVerifyBusyId = ref(null)

const verifyModalOpen = ref(false)
const verifyModalResult = ref(null)
const actionErrorOpen = ref(false)
const actionErrorMessage = ref('')

function showActionError(err, fallback) {
  actionErrorMessage.value = err?.data?.message ?? fallback
  actionErrorOpen.value = true
}
function showVerifyResult(result) {
  verifyModalResult.value = result
  verifyModalOpen.value = true
}

const testerModelId = ref(null)
const testerMessage = ref('')
const testerBusy = ref(false)
const chatMessages = ref([])
const testerModels = ref([])

async function loadModels(page = 1) {
  loading.value = true
  try {
    const res = await getAiModels({ page, per_page: meta.value.per_page, status: statusFilter.value })
    models.value = res?.data ?? []
    meta.value = { current_page: res?.current_page ?? 1, per_page: res?.per_page ?? 10, total: res?.total ?? 0, last_page: res?.last_page ?? 1 }
  } catch (err) {
    console.error('Failed to load AI models', err)
  } finally {
    loading.value = false
  }
}

// Independent from the table's filter/pagination — the tester always offers every active model.
async function loadTesterModels() {
  try {
    const res = await getAiModels({ page: 1, per_page: 200, status: 'active' })
    testerModels.value = res?.data ?? []
    if (!testerModelId.value && testerModels.value.length) testerModelId.value = testerModels.value[0].id
  } catch (err) {
    console.error('Failed to load tester models', err)
  }
}

function resetAddForm() {
  newModel.value = { model_key: '', provider: 'google', mechanism: 'gemini_native_level', levels: [], activeLevel: null, budgetTokens: null }
  levelCheckResults.value = {}
  addVerifiedOk.value = false
}

async function runAddVerify() {
  addVerifyBusy.value = true
  try {
    const result = await verifyAiModelConfig({
      model_key: newModel.value.model_key,
      thinking_config: buildThinkingConfig(newModel.value),
    })
    addVerifiedOk.value = !!result?.success
    showVerifyResult(result)
  } catch (e) {
    addVerifiedOk.value = false
    showVerifyResult(e?.data ?? { success: false, message: 'Request failed.' })
  } finally {
    addVerifyBusy.value = false
  }
}

async function submitNewModel() {
  if (!addVerifiedOk.value) return
  saving.value = true
  try {
    await createAiModel({
      model_key: newModel.value.model_key,
      thinking_config: buildThinkingConfig(newModel.value),
    })
    resetAddForm()
    await loadModels(meta.value.current_page)
    await loadTesterModels()
  } catch (err) {
    showActionError(err, 'Failed to create model.')
  } finally {
    saving.value = false
  }
}

async function toggleActive(model) {
  try {
    await updateAiModel(model.id, { is_active: !model.is_active })
    await loadModels(meta.value.current_page)
    await loadTesterModels()
  } catch (err) {
    showActionError(err, 'Failed to update model status.')
  }
}

async function removeModel(model) {
  try {
    await deleteAiModel(model.id)
    await loadModels(meta.value.current_page)
    await loadTesterModels()
  } catch (err) {
    showActionError(err, 'Failed to remove model.')
  }
}

async function runRowVerify(model) {
  rowVerifyBusyId.value = model.id
  try {
    showVerifyResult(await verifyAiModel(model.id))
  } catch (e) {
    showVerifyResult(e?.data ?? { success: false, message: 'Request failed.' })
  } finally {
    rowVerifyBusyId.value = null
  }
}

function resetChat() {
  chatMessages.value = []
}

async function runTestChat() {
  const text = testerMessage.value
  if (!text || !testerModelId.value) return

  chatMessages.value.push({ role: 'user', text })
  testerMessage.value = ''
  testerBusy.value = true
  try {
    const res = await testChatAiModel(testerModelId.value, chatMessages.value)
    chatMessages.value.push({ role: 'model', text: res?.success ? res.reply : `(error) ${res?.message ?? 'Request failed.'}` })
  } catch (e) {
    chatMessages.value.push({ role: 'model', text: '(error) Request failed.' })
  } finally {
    testerBusy.value = false
  }
}

function skeletonWidth(col) {
  const widths = ['85%', '70%', '55%', '60%', '50%', '40%']
  return widths[(col - 1) % widths.length]
}

onMounted(() => {
  loadModels(1)
  loadTesterModels()
})
</script>
