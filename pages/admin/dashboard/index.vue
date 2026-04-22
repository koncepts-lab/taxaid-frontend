<template>
    <NuxtLayout name="admin">
        <ClientOnly>
            <AdminHeader v-if="!selectedProject" :role="userRole" />

            <template v-if="!selectedProject">
                <AdminMasterList v-if="userRole === 'member' || userRole === 'lead'"
                    @go-to-project="handleGoToProject" />
                <AdminManagerDashboard v-else-if="userRole === 'manager'" :isDark="isDark" :currentLang="currentLang" />
            </template>

            <AdminProjectImplementation v-else :project="selectedProject" @back="selectedProject = null" />

            <template #fallback>
                <div class="p-20 text-center">Loading Dashboard...</div>
            </template>
        </ClientOnly>
    </NuxtLayout>
</template>
<script setup>
import { ref } from 'vue'

// Role can be: 'member', 'lead', or 'manager'
const userRole = ref('lead')
const selectedProject = ref(null)

const handleGoToProject = (project) => {
    selectedProject.value = project
}
</script>