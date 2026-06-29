<template>
    <NuxtLayout name="admin">
        <ClientOnly>
            <AdminHeader role="member" />
            <AdminMasterList @go-to-project="handleGoToProject" />

            <template #fallback>
                <div class="p-20 text-center">Loading Member View...</div>
            </template>
        </ClientOnly>
    </NuxtLayout>
</template>
<script setup>
const router = useRouter()
const selectedClient = useState('selectedImplementationClient')

const handleGoToProject = (project) => {
    selectedClient.value = project
    router.push({ path: '/admin/implementation/project', query: { clientId: project.id } })
}
</script>
