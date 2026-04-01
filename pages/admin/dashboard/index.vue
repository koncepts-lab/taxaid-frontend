<template>
    <NuxtLayout name="admin">
        <AdminHeader v-if="!selectedProject" />
        <AdminMasterList v-if="!selectedProject" @go-to-project="handleGoToProject" />
        <AdminProjectImplementation v-else :project="selectedProject" @back="selectedProject = null" />
    </NuxtLayout>
</template>
<script setup>
import { ref } from 'vue'

const selectedProject = ref(null)

const handleGoToProject = (project) => {
    selectedProject.value = project
}
</script>