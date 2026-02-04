<template>
  <div class="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
    <!-- SIDEBAR -->
    <Sidebar />

    <!-- MAIN CONTENT -->
    <div class="flex-1 flex flex-col overflow-hidden relative">
      <Header />
      
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-[#F3F4F6] p-4 lg:p-6 lg:ml-[110px] transition-all duration-300">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '~/components/common/Sidebar.vue'
import Header from '~/components/common/Header.vue'
</script>
