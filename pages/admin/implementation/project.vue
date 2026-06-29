<template>
    <NuxtLayout name="admin">
        <ClientOnly>
            <AdminProjectImplementation v-if="selectedProject" :project="selectedProject" @back="handleBack" />
            <div v-else-if="error" class="p-20 text-center text-red-400">{{ error }}</div>
            <div v-else class="p-20 text-center text-gray-400">Loading project...</div>

            <template #fallback>
                <div class="p-20 text-center">Loading Project...</div>
            </template>
        </ClientOnly>
    </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const route  = useRoute()
const router = useRouter()
const { getClientSteps, getMyClients } = useImplementation()

const selectedClient = useState('selectedImplementationClient')
const selectedProject = ref(null)
const error = ref(null)

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
            const pool = await getMyClients()
            const match = pool.find(p => p.client_id === clientId)
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
        const rawSteps = await getClientSteps(clientId)
        const steps = rawSteps.map(s => ({
            id:          s.id,
            label:       s.step_name,
            status:      !!s.completed,
            clientDelay: !!s.client_delay,
            timestamp:   s.completed_at ?? '',
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

const handleBack = () => {
    router.push('/admin/implementation/member')
}
</script>
