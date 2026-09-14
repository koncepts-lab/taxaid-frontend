<template>
    <NuxtLayout name="admin">
        <ClientOnly>
            <AdminProjectImplementation v-if="selectedProject" :project="selectedProject" @back="handleBack" />
            <div v-else-if="error" class="p-20 text-center text-red-400">{{ error }}</div>
            <div v-else class="p-6 space-y-6 font-sans pb-24">
                <div class="flex items-center gap-4">
                    <div class="w-9 h-9 rounded-full" :class="skelClass"></div>
                    <div class="space-y-2">
                        <div class="h-6 rounded animate-pulse" :class="skelClass" style="width: 220px"></div>
                        <div class="h-3.5 rounded animate-pulse" :class="skelClass" style="width: 100px"></div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div v-for="n in 6" :key="n" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div class="h-3.5 rounded animate-pulse mb-2" :class="skelClass" style="width: 40%"></div>
                        <div class="h-4 rounded animate-pulse" :class="skelClass" style="width: 65%"></div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <div class="h-5 rounded animate-pulse mb-2" :class="skelClass" style="width: 55%"></div>
                        <div class="h-3.5 rounded animate-pulse mb-6" :class="skelClass" style="width: 80%"></div>
                        <div class="h-20 rounded-xl animate-pulse mb-4" :class="skelClass"></div>
                        <div class="h-9 rounded-lg animate-pulse" :class="skelClass" style="width: 160px"></div>
                    </div>
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <div class="h-5 rounded animate-pulse mb-2" :class="skelClass" style="width: 70%"></div>
                        <div class="h-3.5 rounded animate-pulse mb-6" :class="skelClass" style="width: 90%"></div>
                        <div class="h-9 rounded-lg animate-pulse" :class="skelClass" style="width: 130px"></div>
                    </div>
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <div class="h-5 rounded animate-pulse mb-2" :class="skelClass" style="width: 60%"></div>
                        <div class="h-3.5 rounded animate-pulse mb-6" :class="skelClass" style="width: 85%"></div>
                        <div class="h-9 rounded-lg animate-pulse" :class="skelClass" style="width: 130px"></div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border shadow-sm p-8 overflow-hidden">
                    <div class="h-5 rounded animate-pulse mb-2" :class="skelClass" style="width: 220px"></div>
                    <div class="h-3.5 rounded animate-pulse mb-6" :class="skelClass" style="width: 340px"></div>
                    <div class="overflow-x-auto border-black/10 border rounded-2xl">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="text-black text-sm tracking-wider border-b border-black/10">
                                    <th class="px-4 py-3 font-medium">Sl Num</th>
                                    <th class="px-4 py-3 font-medium">Particulars</th>
                                    <th class="px-4 py-3 font-medium">Status</th>
                                    <th class="px-4 py-3 font-medium">Client Delay</th>
                                    <th class="px-4 py-3 font-medium">Time Stamp</th>
                                    <th class="px-4 py-3 font-medium">Client Delay Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="n in 8" :key="n" class="border-b border-gray-100">
                                    <td v-for="c in 6" :key="c" class="px-4 py-3">
                                        <div class="h-4 rounded animate-pulse" :class="skelClass" :style="{ width: skelWidth(c) }"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <template #fallback>
                <div class="p-6 space-y-6 font-sans pb-24">
                    <div class="flex items-center gap-4">
                        <div class="w-9 h-9 rounded-full bg-gray-100 animate-pulse"></div>
                        <div class="space-y-2">
                            <div class="h-6 rounded bg-gray-100 animate-pulse" style="width: 220px"></div>
                            <div class="h-3.5 rounded bg-gray-100 animate-pulse" style="width: 100px"></div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div v-for="n in 6" :key="n" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div class="h-3.5 rounded bg-gray-100 animate-pulse mb-2" style="width: 40%"></div>
                            <div class="h-4 rounded bg-gray-100 animate-pulse" style="width: 65%"></div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            <div class="h-5 rounded bg-gray-100 animate-pulse mb-2" style="width: 55%"></div>
                            <div class="h-3.5 rounded bg-gray-100 animate-pulse mb-6" style="width: 80%"></div>
                            <div class="h-20 rounded-xl bg-gray-100 animate-pulse mb-4"></div>
                            <div class="h-9 rounded-lg bg-gray-100 animate-pulse" style="width: 160px"></div>
                        </div>
                        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            <div class="h-5 rounded bg-gray-100 animate-pulse mb-2" style="width: 70%"></div>
                            <div class="h-3.5 rounded bg-gray-100 animate-pulse mb-6" style="width: 90%"></div>
                            <div class="h-9 rounded-lg bg-gray-100 animate-pulse" style="width: 130px"></div>
                        </div>
                        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            <div class="h-5 rounded bg-gray-100 animate-pulse mb-2" style="width: 60%"></div>
                            <div class="h-3.5 rounded bg-gray-100 animate-pulse mb-6" style="width: 85%"></div>
                            <div class="h-9 rounded-lg bg-gray-100 animate-pulse" style="width: 130px"></div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl border shadow-sm p-8 overflow-hidden">
                        <div class="h-5 rounded bg-gray-100 animate-pulse mb-2" style="width: 220px"></div>
                        <div class="h-3.5 rounded bg-gray-100 animate-pulse mb-6" style="width: 340px"></div>
                        <div class="overflow-x-auto border-black/10 border rounded-2xl">
                            <table class="w-full text-left">
                                <thead>
                                    <tr class="text-black text-sm tracking-wider border-b border-black/10">
                                        <th class="px-4 py-3 font-medium">Sl Num</th>
                                        <th class="px-4 py-3 font-medium">Particulars</th>
                                        <th class="px-4 py-3 font-medium">Status</th>
                                        <th class="px-4 py-3 font-medium">Client Delay</th>
                                        <th class="px-4 py-3 font-medium">Time Stamp</th>
                                        <th class="px-4 py-3 font-medium">Client Delay Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="n in 8" :key="n" class="border-b border-gray-100">
                                        <td v-for="c in 6" :key="c" class="px-4 py-3">
                                            <div class="h-4 rounded bg-gray-100 animate-pulse" :style="{ width: skelWidth(c) }"></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </template>
        </ClientOnly>
    </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const route  = useRoute()
const router = useRouter()
const { getClientSteps, getMyClients } = useImplementation()
const { isDark } = useTheme()

const selectedClient = useState('selectedImplementationClient')
const selectedProject = ref(null)
const error = ref(null)

const skelClass = computed(() => (isDark.value ? 'bg-gray-300' : 'bg-gray-100'))
const skelWidth = (col) => ['85%', '70%', '50%', '50%', '60%', '75%'][(col - 1) % 6]

onMounted(async () => {
    const clientId = route.query.clientId
    if (!clientId) {
        router.replace('/admin/implementation/member')
        return
    }

    // On refresh useState is lost — re-fetch client metadata from pool
    let client = selectedClient.value
    if (!client) {
        try {
            const pool = await getMyClients({ perPage: 1000 })
            const match = pool.data.find(p => p.client_id === clientId)
            if (match) {
                client = {
                    name:  match.client_name ?? clientId,
                    erp:   match.erp ?? '-',
                    date:  match.date_assigned ?? '-',
                    close: match.expected_date_to_close ?? '-',
                }
            }
        } catch {}
    }

    try {
        const { steps: rawSteps, tenantStatus } = await getClientSteps(clientId)
        const steps = rawSteps.map(s => ({
            id:          s.id,
            label:       s.step_name,
            status:      !!s.completed,
            clientDelay: !!s.client_delay,
            timestamp:   formatTimestamp(s.completed_at),
            delayReason: s.client_delay_reason ?? '',
            isSaved:     !!s.client_delay_reason,
        }))

        selectedProject.value = {
            id:       clientId,
            clientId: clientId,
            name:     client?.name ?? clientId,
            erp:      client?.erp ?? '-',
            date:     client?.date ?? '-',
            close:    client?.close ?? '-',
            tenantStatus,
            steps,
        }
    } catch {
        selectedProject.value = {
            id:       clientId,
            clientId: clientId,
            name:     client?.name ?? clientId,
            erp:      client?.erp ?? '-',
            date:     client?.date ?? '-',
            close:    client?.close ?? '-',
            steps:    [],
        }
    }
})

// Matches toggleStep()'s optimistic format in ProjectImplementation.vue, so a loaded timestamp
// looks the same as one just set client-side after a checkbox click.
function formatTimestamp(value) {
    if (!value) return ''
    return new Date(value).toLocaleString('en-US', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
    })
}

const handleBack = () => {
    router.push('/admin/implementation/member')
}
</script>
