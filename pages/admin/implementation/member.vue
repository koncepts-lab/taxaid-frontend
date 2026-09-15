<template>
    <NuxtLayout name="admin">
        <ClientOnly>
            <AdminHeader role="member" />
            <AdminMasterList @go-to-project="handleGoToProject" />

            <template #fallback>
                <div class="p-6 space-y-6 min-h-screen font-sans">
                    <div class="h-7 rounded bg-gray-100 animate-pulse" style="width: 180px"></div>

                    <div class="flex items-center gap-3">
                        <div class="flex-1 h-[46px] rounded-xl bg-gray-100 animate-pulse"></div>
                        <div class="w-[46px] h-[46px] rounded-xl bg-gray-100 animate-pulse"></div>
                    </div>

                    <div class="bg-white rounded-[24px] border border-gray-100 shadow-xl overflow-hidden">
                        <div class="overflow-auto" style="height: 836px">
                            <table class="w-full text-left border-separate border-spacing-0 min-w-[1800px] table-auto">
                                <thead class="sticky top-0 z-10">
                                    <tr class="bg-[#00896F] text-white">
                                        <th class="px-6 py-5 text-[13px] font-semibold rounded-tl-lg w-[250px]">Client ID</th>
                                        <th class="px-6 py-5 text-[13px] font-semibold w-[250px]">Client Name</th>
                                        <th class="px-6 py-5 text-[13px] font-semibold w-[150px]">Date Assigned</th>
                                        <th class="px-6 py-5 text-[13px] font-semibold w-[100px]">ERP</th>
                                        <th class="px-6 py-5 text-[13px] font-semibold w-[150px]">Industry</th>
                                        <th class="px-6 py-5 text-[13px] font-semibold w-[250px]">Expected Close</th>
                                        <th class="px-6 py-5 text-[13px] font-semibold w-[200px]">Progress Indicator</th>
                                        <th class="px-6 py-5 text-[13px] font-semibold rounded-tr-lg w-[150px] text-right pe-10">View Status</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr v-for="n in 20" :key="n" class="h-[76px]">
                                        <td class="px-6 py-5"><div class="h-4 rounded bg-gray-100 animate-pulse" style="width: 90px"></div></td>
                                        <td class="px-6 py-5"><div class="h-4 rounded bg-gray-100 animate-pulse" style="width: 150px"></div></td>
                                        <td class="px-6 py-5"><div class="h-4 rounded bg-gray-100 animate-pulse" style="width: 80px"></div></td>
                                        <td class="px-6 py-5"><div class="h-4 rounded bg-gray-100 animate-pulse" style="width: 50px"></div></td>
                                        <td class="px-6 py-5"><div class="h-4 rounded bg-gray-100 animate-pulse" style="width: 90px"></div></td>
                                        <td class="px-6 py-5"><div class="h-4 rounded bg-gray-100 animate-pulse" style="width: 80px"></div></td>
                                        <td class="px-6 py-5">
                                            <div class="flex items-center gap-3">
                                                <div class="w-24 h-2 rounded-full bg-gray-100 animate-pulse"></div>
                                                <div class="h-3.5 w-7 rounded bg-gray-100 animate-pulse"></div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-5 pe-8">
                                            <div class="h-9 w-28 rounded-md bg-gray-100 animate-pulse ml-auto"></div>
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
const router = useRouter()
const selectedClient = useState('selectedImplementationClient')

const handleGoToProject = (project) => {
    selectedClient.value = project
    router.push({ path: '/admin/implementation/project', query: { clientId: project.id } })
}
</script>
