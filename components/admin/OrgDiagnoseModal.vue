<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" @click.self="$emit('close')">
      <div class="rounded-2xl shadow-xl w-full max-w-[860px] max-h-[90vh] flex flex-col" :class="isDark ? 'bg-[#012F27] border border-white/25 text-white' : 'bg-white text-gray-800'">
        <div class="flex items-start justify-between gap-4 px-6 py-5 border-b" :class="line">
          <div>
            <h3 class="text-[18px] font-semibold" :class="isDark ? 'text-white' : 'text-[#013E32]'">Organization health check</h3>
            <p class="text-[13px] mt-0.5" :class="muted">
              {{ report?.organization?.name ?? orgName }}
              <span class="ml-1 px-2 py-0.5 rounded-full text-[11px] font-medium" :class="chip">ID: {{ orgId }}</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="run()" :disabled="loading || fixing || running" class="text-[13px] bg-[#007C65] text-white px-3 py-1.5 rounded-md font-medium hover:bg-[#006A56] disabled:opacity-60">{{ loading ? 'Checking…' : 'Run again' }}</button>
            <button @click="$emit('close')" class="text-xl leading-none px-1" :class="muted">&times;</button>
          </div>
        </div>

        <div class="overflow-y-auto px-6 py-5 space-y-5 transition-opacity" :class="loading && report ? 'opacity-50 pointer-events-none' : ''">
          <div v-if="loading && !report" class="space-y-3">
            <div v-for="n in 6" :key="n" class="h-14 rounded-xl animate-pulse" :class="isDark ? 'bg-white/10' : 'bg-gray-100'"></div>
          </div>

          <p v-else-if="error" class="text-sm text-red-500">{{ error }}</p>

          <template v-else-if="report">
            <div>
              <div class="flex items-baseline justify-between mb-1.5">
                <span class="text-[13px] font-medium" :class="body">Health</span>
                <span class="text-[20px] font-semibold" :class="scoreText">{{ score }}%</span>
              </div>
              <div class="flex h-3 w-full rounded-full overflow-hidden" :class="isDark ? 'bg-white/10' : 'bg-gray-100'">
                <div class="bg-[#04C18F] transition-all duration-500" :style="{ width: pct(report.summary.ok) }"></div>
                <div class="bg-amber-400 transition-all duration-500" :style="{ width: pct(report.summary.warning) }"></div>
                <div class="bg-red-500 transition-all duration-500" :style="{ width: pct(report.summary.problem) }"></div>
              </div>
              <div class="flex gap-4 mt-1.5 text-[11px]" :class="muted">
                <span><i class="inline-block w-2 h-2 rounded-full bg-[#04C18F] mr-1"></i>OK</span>
                <span><i class="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1"></i>To look at</span>
                <span><i class="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></i>Problem</span>
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3" :class="verdictBox">
              <div>
                <p class="font-semibold text-[15px]">{{ verdictText }}</p>
                <p v-if="running" class="text-[12px]">Fixes are running in the background. This updates by itself.</p>
                <p v-if="!safeFixCount && !running && report.verdict !== 'healthy'" class="text-[12px]">No one-click fixes are available. The items below need a manual action.</p>
                <p class="text-[12px] opacity-80">{{ report.summary.ok }} ok · {{ report.summary.warning }} to look at · {{ report.summary.problem }} problem(s)</p>
              </div>
              <button v-if="safeFixCount && !running" @click="apply(['all_safe'])" :disabled="fixing"
                class="text-[13px] bg-[#007C65] text-white px-4 py-2 rounded-md font-medium hover:bg-[#006A56] disabled:opacity-50">
                {{ fixing ? 'Fixing…' : 'Fix all safe issues (' + safeFixCount + ')' }}
              </button>
            </div>

            <div v-if="results.length" class="rounded-xl border px-4 py-3 text-[13px] space-y-1" :class="line">
              <p class="font-medium" :class="body">Last fix run</p>
              <p v-for="r in results" :key="r.fix" :class="r.ok ? (isDark ? 'text-[#04C18F]' : 'text-[#007C65]') : 'text-red-500'">{{ r.ok ? '✓' : '✗' }} {{ r.message }}</p>
            </div>

            <ul class="space-y-2">
              <li v-for="c in report.checks" :key="c.id" class="rounded-xl border px-4 py-3" :class="[line, isDark ? 'bg-white/[0.04]' : '']">
                <div class="flex items-start gap-3">
                  <span class="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0" :class="dot(c.status)"></span>
                  <div class="flex-1 min-w-0">
                    <p class="text-[14px] font-medium" :class="isDark ? 'text-white' : 'text-gray-800'">{{ c.title }}</p>
                    <p class="text-[13px]" :class="body">{{ c.detail }}</p>
                    <ul v-if="c.items?.length && c.status !== 'ok'" class="mt-1 text-[12px] list-disc pl-4 space-y-0.5" :class="muted">
                      <li v-for="(i, k) in c.items" :key="k">{{ i }}</li>
                    </ul>
                    <div v-if="c.assign && unassigned(c.assign).length" class="mt-3 space-y-2">
                      <div v-for="t in unassigned(c.assign)" :key="t.tenant_id" class="flex flex-wrap items-center gap-2">
                        <span class="text-[12px] w-24 shrink-0" :class="muted">Tenant ID: {{ t.tenant_id }}</span>
                        <select v-model="selection[pickKey(c.assign.role, t.tenant_id)]" class="border rounded-md px-3 py-1.5 text-[13px] min-w-[220px]" :class="inputCls">
                          <option value="">Select consultant…</option>
                          <option v-for="p in c.assign.consultants" :key="p.id" :value="p.id">{{ p.name }} · {{ p.load }} assigned</option>
                        </select>
                        <button @click="assignConsultant(c.assign.role, t.tenant_id)" :disabled="!selection[pickKey(c.assign.role, t.tenant_id)] || fixing || running"
                          class="text-[12px] bg-[#007C65] text-white px-3 py-1.5 rounded-md font-medium hover:bg-[#006A56] disabled:opacity-50">Assign</button>
                      </div>
                      <p v-if="!c.assign.consultants.length" class="text-[12px] text-red-500">No active {{ c.assign.role }} consultant exists. Add one first.</p>
                    </div>
                    <div v-if="c.fix && c.needs_password && askPassword === c.fix" class="mt-2 flex items-center gap-2">
                      <input v-model="password" type="password" placeholder="Your password" class="border rounded-md px-3 py-1.5 text-[13px] w-56"
                        :class="isDark ? 'bg-white/5 border-white/20 text-white placeholder-white/40' : 'bg-white border-gray-300 text-gray-800'" />
                      <button @click="apply([c.fix])" :disabled="!password || fixing" class="text-[13px] bg-[#007C65] text-white px-3 py-1.5 rounded-md disabled:opacity-50">Confirm</button>
                    </div>
                  </div>
                  <button v-if="c.fix" @click="c.needs_password ? (askPassword = c.fix) : apply([c.fix])" :disabled="fixing || running"
                    class="shrink-0 text-[12px] bg-[#007C65] text-white px-3 py-1.5 rounded-md font-medium hover:bg-[#006A56] disabled:opacity-50">{{ c.fix_label }}</button>
                </div>
              </li>
            </ul>

            <div>
              <h4 class="text-[14px] font-semibold mb-2" :class="isDark ? 'text-white' : 'text-gray-800'">Tenants</h4>
              <div class="flex flex-wrap gap-2">
                <span v-for="t in report.tenants" :key="t.id" class="text-[12px] px-3 py-1 rounded-full" :class="chip">Tenant ID: {{ t.id }} · {{ t.name }} · {{ t.status }}</span>
              </div>
            </div>

            <div>
              <h4 class="text-[14px] font-semibold mb-2" :class="isDark ? 'text-white' : 'text-gray-800'">Users</h4>
              <div class="overflow-x-auto border rounded-xl" :class="line">
                <table class="w-full text-[13px]" :class="body">
                  <thead class="text-left" :class="isDark ? 'bg-white/5 text-white/60' : 'bg-gray-50 text-gray-500'">
                    <tr><th class="px-4 py-2">Name</th><th class="px-4 py-2">Email</th><th class="px-4 py-2">Role</th><th class="px-4 py-2">Status</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="u in report.users" :key="u.id" class="border-t" :class="line">
                      <td class="px-4 py-2">{{ u.name }} <span v-if="u.is_primary" class="ml-1 text-[11px] px-2 py-0.5 rounded-full" :class="isDark ? 'bg-[#04C18F]/20 text-[#04C18F]' : 'bg-[#E4FFF6] text-[#00896F]'">Owner</span></td>
                      <td class="px-4 py-2">{{ u.email }}</td>
                      <td class="px-4 py-2">{{ roleLabel(u.role) }}</td>
                      <td class="px-4 py-2"><span :class="u.status === 'live' ? (isDark ? 'text-[#04C18F]' : 'text-[#007C65]') : 'text-red-500'">{{ u.status === 'live' ? 'Live' : 'Suspended' }}</span></td>
                    </tr>
                    <tr v-if="!report.users.length"><td colspan="4" class="px-4 py-4 text-center" :class="muted">No users</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({ orgId: { type: Number, required: true }, orgName: { type: String, default: '' } })
defineEmits(['close'])

const { diagnoseOrganization } = useClientManagement()
const { isDark } = useTheme()

const line = computed(() => (isDark.value ? 'border-white/25' : 'border-gray-200'))
const muted = computed(() => (isDark.value ? 'text-white/60' : 'text-gray-500'))
const body = computed(() => (isDark.value ? 'text-white/80' : 'text-gray-600'))
const chip = computed(() => (isDark.value ? 'bg-white/10 text-white/80' : 'bg-gray-100 text-gray-600'))
const outlineBtn = computed(() => (isDark.value
  ? 'border-[#04C18F] text-[#04C18F] hover:bg-[#04C18F]/10'
  : 'border-[#007C65] text-[#007C65] hover:bg-[#F0FDF4]'))

const selection = reactive({})
const unassigned = (assign) => assign.tenants.filter((t) => !t.current_id)
const pickKey = (role, tenantId) => `${role}:${tenantId}`
const inputCls = computed(() => (isDark.value ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-800'))

const report = ref(null)
const loading = ref(false)
const fixing = ref(false)
const running = computed(() => report.value?.job?.status === 'running')
const error = ref('')
const results = ref([])
const askPassword = ref('')
const password = ref('')

const safeIds = ['schema', 'owner_primary', 'login_index', 'profile_row', 'implementation_row', 'monthly_review', 'trial', 'ai_settings', 'ai_role_rows']
const safeFixCount = computed(() => (report.value?.checks ?? []).filter((c) => c.fix && safeIds.includes(c.fix)).length)

const verdictText = computed(() => ({ healthy: 'Everything looks healthy', attention: 'Needs attention', problem: 'There are problems' })[report.value?.verdict] ?? '')
const verdictBox = computed(() => {
  const d = isDark.value
  return ({
    healthy: d ? 'bg-[#04C18F]/20 text-[#04C18F] border border-[#04C18F]/40' : 'bg-[#E4FFF6] text-[#006A56]',
    attention: d ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40' : 'bg-amber-50 text-amber-800',
    problem: d ? 'bg-red-500/20 text-red-200 border border-red-400/40' : 'bg-red-50 text-red-700',
  })[report.value?.verdict] ?? (d ? 'bg-white/10' : 'bg-gray-50')
})
const total = computed(() => (report.value?.checks ?? []).length || 1)
const pct = (n) => (n / total.value * 100) + '%'
const score = computed(() => Math.round(((report.value?.summary?.ok ?? 0) + 0.5 * (report.value?.summary?.warning ?? 0)) / total.value * 100))
const scoreText = computed(() => (report.value?.summary?.problem ? 'text-red-500' : report.value?.summary?.warning ? 'text-amber-500' : (isDark.value ? 'text-[#04C18F]' : 'text-[#007C65]')))
const roleLabel = (r) => String(r ?? '').replace(/_user$/, '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) + ' User'
const dot = (s) => (s === 'ok' ? 'bg-[#04C18F]' : s === 'warning' ? 'bg-amber-400' : 'bg-red-500')

async function call(body) {
  try {
    const res = await diagnoseOrganization(props.orgId, body)
    error.value = ''
    return res?.data ?? null
  } catch (e) {
    error.value = e?.data?.message || e?.response?._data?.message || 'Could not run the health check.'
    return null
  }
}

function sync(d) {
  report.value = d
  results.value = d.job?.status === 'done' ? d.job.results : []
  if (d.job?.status === 'running') schedulePoll()
}

let timer = null
function schedulePoll() {
  clearTimeout(timer)
  timer = setTimeout(async () => {
    const d = await call({})
    if (d) sync(d)
  }, 3000)
}

async function run() {
  loading.value = true
  const d = await call({})
  if (d) sync(d)
  loading.value = false
}

async function assignConsultant(role, tenantId) {
  const adminId = selection[pickKey(role, tenantId)]
  if (!adminId) return
  await apply([], [{ type: role, tenant_id: tenantId, admin_id: Number(adminId) }])
  delete selection[pickKey(role, tenantId)]
}

async function apply(fix, assign = []) {
  fixing.value = true
  const body = {}
  if (fix.length) body.fix = fix
  if (assign.length) body.assign = assign
  if (password.value) body.password = password.value
  const d = await call(body)
  if (d) {
    sync(d)
    askPassword.value = ''
    password.value = ''
  }
  fixing.value = false
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  run()
})
onBeforeUnmount(() => {
  clearTimeout(timer)
  document.body.style.overflow = ''
})
</script>
