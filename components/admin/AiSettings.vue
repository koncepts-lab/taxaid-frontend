<template>
  <div class="space-y-6 mt-4">

    <!-- Global settings -->
    <div class="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-[16px] font-medium text-[#101828]">Global AI Settings</h2>
          <p class="text-[13px] text-[#4A5565] mt-0.5">Platform-wide kill switch and Akeel's system instructions.</p>
        </div>
        <span :class="settings.ai_enabled_globally ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-red-100 text-red-700'"
          class="rounded-full px-3 py-1 text-[13px] font-medium">{{ settings.ai_enabled_globally ? 'Enabled' : 'Disabled' }}</span>
      </div>
      <label class="flex items-center gap-2 mb-4">
        <input type="checkbox" v-model="settings.ai_enabled_globally" class="w-5 h-5 accent-[#00896F]" />
        <span class="text-sm text-gray-700">AI enabled platform-wide</span>
      </label>
      <label class="block text-[13px] text-gray-600 mb-1.5">System instructions</label>
      <textarea v-model="settings.system_instructions" rows="4"
        class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]"
        placeholder="You are Akeel, an ERP financial assistant for TaxAid..."></textarea>
      <button @click="saveSettings" :disabled="savingSettings"
        class="mt-3 px-5 py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors disabled:opacity-60">
        {{ savingSettings ? 'Saving…' : 'Save Settings' }}
      </button>
    </div>

    <!-- Data links catalog -->
    <div class="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
      <h2 class="text-[16px] font-medium text-[#101828] mb-1">Data-Link Catalog</h2>
      <p class="text-[13px] text-[#4A5565] mb-4">Label/category/description text only — key_word and params are developer-managed.</p>
      <div class="space-y-3">
        <div v-for="link in dataLinks" :key="link.id" class="border border-gray-100 rounded-lg p-4">
          <div class="flex items-center justify-between gap-3 mb-2">
            <code class="text-xs text-gray-400">{{ link.key_word }} · {{ link.domain }}</code>
            <label class="flex items-center gap-1.5 text-xs">
              <input type="checkbox" v-model="link.is_active" class="accent-[#00896F]" /> Active
            </label>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <input v-model="link.label" class="px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" placeholder="Label" />
            <input v-model="link.category" class="px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" placeholder="Category" />
          </div>
          <textarea v-model="link.context" rows="2" class="w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" placeholder="Context / description"></textarea>
          <button @click="saveDataLink(link)" class="mt-2 px-3 py-1.5 bg-[#00896F] text-white rounded text-xs font-medium hover:bg-[#00705a]">Save</button>
        </div>
      </div>
      <CommonPaginationBar v-if="dataLinksMeta.total > 0" :meta="dataLinksMeta" :loading="dataLinksLoading"
        @page-change="(p) => loadDataLinks(p)" @per-page-change="(pp) => { dataLinksPerPage = pp; loadDataLinks(1) }" />
    </div>

    <!-- Rules catalog -->
    <div class="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
      <h2 class="text-[16px] font-medium text-[#101828] mb-4">Rules Catalog</h2>
      <div class="space-y-3">
        <div v-for="rule in rules" :key="rule.id" class="border border-gray-100 rounded-lg p-4">
          <div class="flex items-center justify-between gap-3 mb-2">
            <code class="text-xs text-gray-400">{{ rule.domain }}</code>
            <label class="flex items-center gap-1.5 text-xs">
              <input type="checkbox" v-model="rule.is_active" class="accent-[#00896F]" /> Active
            </label>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <input v-model="rule.label" class="px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" placeholder="Label" />
            <input v-model="rule.category" class="px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" placeholder="Category" />
          </div>
          <textarea v-model="rule.context_template" rows="2" class="w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" placeholder="Context template"></textarea>
          <button @click="saveRule(rule)" class="mt-2 px-3 py-1.5 bg-[#00896F] text-white rounded text-xs font-medium hover:bg-[#00705a]">Save</button>
        </div>
        <p v-if="!rules.length" class="text-sm text-gray-400 py-4 text-center">No rules yet.</p>
      </div>
      <CommonPaginationBar v-if="rulesMeta.total > 0" :meta="rulesMeta" :loading="rulesLoading"
        @page-change="(p) => loadRules(p)" @per-page-change="(pp) => { rulesPerPage = pp; loadRules(1) }" />
    </div>

    <!-- Alert rules catalog -->
    <div class="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
      <h2 class="text-[16px] font-medium text-[#101828] mb-4">Alert Rules Catalog</h2>
      <div class="space-y-3">
        <div v-for="rule in alertRules" :key="rule.id" class="border border-gray-100 rounded-lg p-4">
          <div class="flex items-center justify-between gap-3 mb-2">
            <code class="text-xs text-gray-400">{{ rule.domain }}</code>
            <div class="flex items-center gap-3">
              <select v-model="rule.priority" class="border border-gray-200 rounded text-xs px-2 py-1">
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
              </select>
              <label class="flex items-center gap-1.5 text-xs">
                <input type="checkbox" v-model="rule.is_active" class="accent-[#00896F]" /> Active
              </label>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <input v-model="rule.alert_title" class="px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" placeholder="Alert title" />
            <input v-model="rule.category" class="px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" placeholder="Category" />
          </div>
          <textarea v-model="rule.rag_prompt_instruction" rows="2" class="w-full px-3 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" placeholder="RAG prompt instruction"></textarea>
          <button @click="saveAlertRule(rule)" class="mt-2 px-3 py-1.5 bg-[#00896F] text-white rounded text-xs font-medium hover:bg-[#00705a]">Save</button>
        </div>
      </div>
      <CommonPaginationBar v-if="alertRulesMeta.total > 0" :meta="alertRulesMeta" :loading="alertRulesLoading"
        @page-change="(p) => loadAlertRules(p)" @per-page-change="(pp) => { alertRulesPerPage = pp; loadAlertRules(1) }" />
    </div>

    <!-- Chat prompts (quick questions + tips, per page) -->
    <div class="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-[16px] font-medium text-[#101828]">Chat Quick Questions & Tips</h2>
          <p class="text-[13px] text-[#4A5565] mt-0.5">Per-page config, max 6 questions / 3 tips. "default" is used when a page has no specific row.</p>
        </div>
        <button @click="openPromptModal(null)" class="px-4 py-2 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a]">+ New Page</button>
      </div>

      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-[#008865] text-white text-sm">
            <th class="py-2.5 px-4 font-medium">Page</th>
            <th class="py-2.5 px-4 font-medium">Questions</th>
            <th class="py-2.5 px-4 font-medium">Tips</th>
            <th class="py-2.5 px-4 font-medium">Active</th>
            <th class="py-2.5 px-4 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="text-sm text-gray-700">
          <tr v-if="!chatPrompts.length"><td colspan="5" class="py-8 text-center text-gray-400">No pages configured.</td></tr>
          <tr v-for="p in chatPrompts" :key="p.id" class="border-b border-gray-100 hover:bg-gray-50/50">
            <td class="py-3 px-4 font-medium">{{ p.page }}</td>
            <td class="py-3 px-4">{{ p.questions?.length ?? 0 }}</td>
            <td class="py-3 px-4">{{ p.tips?.length ?? 0 }}</td>
            <td class="py-3 px-4">
              <span :class="p.is_active ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-gray-100 text-gray-500'" class="rounded-full px-2.5 py-1 text-[12px] font-medium">{{ p.is_active ? 'Active' : 'Inactive' }}</span>
            </td>
            <td class="py-3 px-4 text-center">
              <button @click="openPromptModal(p)" class="px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50 mr-1.5">Edit</button>
              <button @click="cloneRow(p)" class="px-3 py-1.5 border border-gray-200 rounded text-xs hover:bg-gray-50 mr-1.5">Clone</button>
              <button @click="deleteRow(p)" class="px-3 py-1.5 border border-red-300 text-red-600 rounded text-xs hover:bg-red-50">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <CommonPaginationBar v-if="chatPromptsMeta.total > 0" :meta="chatPromptsMeta" :loading="chatPromptsLoading"
        @page-change="(p) => loadChatPrompts(p)" @per-page-change="(pp) => { chatPromptsPerPage = pp; loadChatPrompts(1) }" />
    </div>

    <!-- Add/Edit chat prompt modal -->
    <div v-if="promptModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-lg w-[560px] max-w-full p-6 max-h-[85vh] overflow-y-auto">
        <h3 class="text-[16px] font-semibold text-gray-900 mb-4">{{ editingPrompt.id ? 'Edit Page Config' : 'New Page Config' }}</h3>

        <label class="block text-[13px] text-gray-600 mb-1.5">Page</label>
        <select v-model="editingPrompt.page" class="w-full mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]">
          <option value="" disabled>Select a page…</option>
          <option v-for="opt in pageOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>

        <label class="flex items-center gap-2 mb-4">
          <input type="checkbox" v-model="editingPrompt.is_active" class="w-5 h-5 accent-[#00896F]" />
          <span class="text-sm text-gray-700">Active</span>
        </label>

        <div class="mb-4">
          <p class="text-[13px] text-gray-600 mb-1.5 font-medium">Questions ({{ editingPrompt.questions.length }}/6)</p>
          <div v-for="(q, qi) in editingPrompt.questions" :key="qi" class="flex gap-2 mb-1.5">
            <input v-model="q.text" placeholder="English" class="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" />
            <input v-model="q.text_ar" placeholder="Arabic" dir="rtl" class="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" />
            <button @click="editingPrompt.questions.splice(qi, 1)" class="text-red-500 text-xs px-2">✕</button>
          </div>
          <button v-if="editingPrompt.questions.length < 6" @click="editingPrompt.questions.push({ text: '', text_ar: '' })" class="text-[#00896F] text-xs font-medium">+ Add question</button>
        </div>

        <div class="mb-4">
          <p class="text-[13px] text-gray-600 mb-1.5 font-medium">Tips ({{ editingPrompt.tips.length }}/3, plain text)</p>
          <div v-for="(t, ti) in editingPrompt.tips" :key="ti" class="border border-gray-100 rounded p-3 mb-2">
            <div class="flex gap-2 mb-1.5">
              <input v-model="t.heading" placeholder="Heading (EN)" class="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" />
              <input v-model="t.heading_ar" placeholder="Heading (AR)" dir="rtl" class="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]" />
            </div>
            <textarea v-model="t.body" rows="2" placeholder="Body text (EN)" class="w-full mb-1.5 px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]"></textarea>
            <textarea v-model="t.body_ar" rows="2" dir="rtl" placeholder="Body text (AR)" class="w-full mb-1.5 px-2 py-1.5 border border-gray-200 rounded text-sm outline-none focus:border-[#008169]"></textarea>
            <button @click="editingPrompt.tips.splice(ti, 1)" class="text-red-500 text-xs">Remove tip</button>
          </div>
          <button v-if="editingPrompt.tips.length < 3" @click="editingPrompt.tips.push({ heading: '', heading_ar: '', body: '', body_ar: '' })" class="text-[#00896F] text-xs font-medium">+ Add tip</button>
        </div>

        <p v-if="promptError" class="text-[13px] text-red-500 mb-3">{{ promptError }}</p>
        <div class="flex justify-end gap-3">
          <button @click="promptModalOpen = false" class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button @click="savePrompt" :disabled="savingPrompt || !editingPrompt.page"
            class="px-4 py-2 bg-[#00896F] hover:bg-[#00705a] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
            {{ savingPrompt ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const {
  getSettings, updateSettings,
  getDataLinks, updateDataLink,
  getRules, updateRule,
  getAlertRules, updateAlertRule,
  getChatPrompts, createChatPrompt, updateChatPrompt, deleteChatPrompt, cloneChatPrompt,
} = useAdminAi()

// The 9 main report pages + support pages + the reserved 'default' fallback.
const pageOptions = [
  'default', 'dashboard', 'revenue', 'cash-flow', 'cost-center', 'cogs',
  'accounts-payable', 'accounts-receivable', 'indirect-expense', 'financial-statement',
  'tax-queries', 'alerts', 'chat-with-akeel',
]

const settings = ref({ ai_enabled_globally: true, system_instructions: '' })
const savingSettings = ref(false)

const dataLinks = ref([])
const dataLinksMeta = ref({ total: 0 })
const dataLinksLoading = ref(false)
const dataLinksPerPage = ref(15)

const rules = ref([])
const rulesMeta = ref({ total: 0 })
const rulesLoading = ref(false)
const rulesPerPage = ref(15)

const alertRules = ref([])
const alertRulesMeta = ref({ total: 0 })
const alertRulesLoading = ref(false)
const alertRulesPerPage = ref(15)

const chatPrompts = ref([])
const chatPromptsMeta = ref({ total: 0 })
const chatPromptsLoading = ref(false)
const chatPromptsPerPage = ref(15)

function applyMeta(res) {
  return { current_page: res.current_page ?? 1, per_page: res.per_page ?? 15, total: res.total ?? 0, last_page: res.last_page ?? 1 }
}

async function loadDataLinks(page = 1) {
  dataLinksLoading.value = true
  try {
    const res = await getDataLinks({ page, per_page: dataLinksPerPage.value })
    dataLinks.value = res?.data ?? []
    dataLinksMeta.value = applyMeta(res)
  } finally {
    dataLinksLoading.value = false
  }
}

async function loadRules(page = 1) {
  rulesLoading.value = true
  try {
    const res = await getRules({ page, per_page: rulesPerPage.value })
    rules.value = res?.data ?? []
    rulesMeta.value = applyMeta(res)
  } finally {
    rulesLoading.value = false
  }
}

async function loadAlertRules(page = 1) {
  alertRulesLoading.value = true
  try {
    const res = await getAlertRules({ page, per_page: alertRulesPerPage.value })
    alertRules.value = res?.data ?? []
    alertRulesMeta.value = applyMeta(res)
  } finally {
    alertRulesLoading.value = false
  }
}

async function loadChatPrompts(page = 1) {
  chatPromptsLoading.value = true
  try {
    const res = await getChatPrompts({ page, per_page: chatPromptsPerPage.value })
    chatPrompts.value = res?.data ?? []
    chatPromptsMeta.value = applyMeta(res)
  } finally {
    chatPromptsLoading.value = false
  }
}

async function saveSettings() {
  savingSettings.value = true
  try {
    await updateSettings({ system_instructions: settings.value.system_instructions, ai_enabled_globally: settings.value.ai_enabled_globally })
  } finally {
    savingSettings.value = false
  }
}

async function saveDataLink(link) {
  await updateDataLink(link.id, { label: link.label, context: link.context, category: link.category, is_active: link.is_active })
}
async function saveRule(rule) {
  await updateRule(rule.id, { label: rule.label, context_template: rule.context_template, category: rule.category, is_active: rule.is_active })
}
async function saveAlertRule(rule) {
  await updateAlertRule(rule.id, {
    alert_title: rule.alert_title, category: rule.category, priority: rule.priority,
    rag_prompt_instruction: rule.rag_prompt_instruction, is_active: rule.is_active,
  })
}

// ── Chat prompt modal ────────────────────────────────────────────────────
const promptModalOpen = ref(false)
const savingPrompt = ref(false)
const promptError = ref('')
const editingPrompt = reactive({ id: null, page: '', questions: [], tips: [], is_active: true })

function openPromptModal(prompt) {
  promptError.value = ''
  editingPrompt.id = prompt?.id ?? null
  editingPrompt.page = prompt?.page ?? ''
  editingPrompt.questions = prompt?.questions ? JSON.parse(JSON.stringify(prompt.questions)) : []
  editingPrompt.tips = prompt?.tips ? JSON.parse(JSON.stringify(prompt.tips)) : []
  editingPrompt.is_active = prompt?.is_active ?? true
  promptModalOpen.value = true
}

async function savePrompt() {
  savingPrompt.value = true
  promptError.value = ''
  const body = { page: editingPrompt.page, questions: editingPrompt.questions, tips: editingPrompt.tips, is_active: editingPrompt.is_active }
  try {
    if (editingPrompt.id) {
      await updateChatPrompt(editingPrompt.id, body)
    } else {
      await createChatPrompt(body)
    }
    promptModalOpen.value = false
    await loadChatPrompts(chatPromptsMeta.value.current_page)
  } catch (e) {
    promptError.value = e?.data?.message ?? 'Failed to save.'
  } finally {
    savingPrompt.value = false
  }
}

async function cloneRow(prompt) {
  const page = window.prompt('New page key for the clone:')
  if (!page) return
  await cloneChatPrompt(prompt.id, page)
  await loadChatPrompts(chatPromptsMeta.value.current_page)
}

async function deleteRow(prompt) {
  await deleteChatPrompt(prompt.id)
  await loadChatPrompts(chatPromptsMeta.value.current_page)
}

onMounted(async () => {
  try { settings.value = (await getSettings())?.data ?? settings.value } catch {}
  await Promise.all([loadDataLinks(), loadRules(), loadAlertRules(), loadChatPrompts()])
})
</script>
