<template>
  <div class="min-h-screen w-full relative flex flex-col font-sans transition-colors duration-300"
    :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">

    <!-- HEADER -->
    <DashboardHeader role="Accounts" name="Revenue Partnership" />

    <!-- CONTENT -->
    <main class="flex-1 px-8 pb-[0px] pt-8 space-y-6 overflow-y-auto" style="margin-top: -18px;">

      <!-- Alert Banner -->
      <div v-if="showAlertBanner && hasAlert"
        :class="isDark ? 'bg-[#00141080] border-[#F9AF4D80]' : 'bg-[#FEFCE8] border-[#FFF085]'"
        class="rounded-[16px] p-4 flex items-center justify-between shadow-sm relative pr-12 border">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-[#FFBB0D] rounded-full flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="text-white w-6 h-6 transition-colors"
              :class="{ 'hover:text-white': isDark }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 class="text-[16px] font-semibold" :class="isDark ? 'text-white' : 'text-[#854D0E]'">Expiring cards
              detected</h4>
            <p class="text-[14px] font-normal" :class="isDark ? 'text-white/70' : 'text-[#854D0E]'">
              {{ expiringCardsCount }} customers have cards expiring in under {{ expiringCardsDaysThreshold }} days. Update details to prevent payment issues.
            </p>
          </div>
        </div>
        <button @click="showAlertBanner = false" class="transition-colors cursor-pointer"
          :class="isDark ? 'text-white/50 hover:text-white' : 'text-[#854D0E] hover:text-black'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Tabs and Action Buttons -->
      <div class="mb-10 flex items-center justify-between">
        <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'"
          class="rounded-full p-1.5 inline-flex items-center shadow-sm border">
          <button @click="activeTab = 'Overview'"
            class="px-[80px] py-3 rounded-full text-[16px] font-medium transition-all cursor-pointer"
            :class="activeTab === 'Overview' ? (isDark ? 'bg-[#1b5e50] text-[#fff] shadow-sm' : 'bg-[#82FFE0] text-[#0A0A0A] shadow-sm') : (isDark ? 'bg-transparent text-[#fff]' : 'bg-transparent text-[#000]')">
            Overview
          </button>
          <button @click="activeTab = 'Operations'"
            class="px-[80px] py-3 rounded-full text-[16px] font-medium transition-all cursor-pointer"
            :class="activeTab === 'Operations' ? (isDark ? 'bg-[#1b5e50] text-[#fff] shadow-sm' : 'bg-[#82FFE0] text-[#0A0A0A] shadow-sm') : (isDark ? 'bg-transparent text-[#fff]' : 'bg-transparent text-[#000]')">
            Operations
          </button>
        </div>

        <!-- Operations Specific Action Buttons -->
        <div v-if="activeTab === 'Operations'" class="flex items-center gap-4">
          <button @click="showPaymentModal = true"
            class="px-6 py-3 bg-[#9BFFEC66] text-[#000] text-[16px] border border-[#04C18F80] rounded-xl font-normal flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <img src="/images/icons/dirham-black.svg" class="w-4" />
            Payment to Partner
          </button>
          <button @click="showAddPartnerModal = true"
            class="px-6 py-3 bg-[#007C65] text-white rounded-xl font-normal flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer text-[16px]">
            <span class="text-xl leading-none">+</span>
            Add New Partner
          </button>
        </div>
      </div>


      <!-- Overview Content -->
      <div v-if="activeTab === 'Overview'" class="space-y-8">

        <!-- Overview Metrics Section -->
        <section>
          <h2 class="text-[20px] font-normal mb-6" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Overview Metrics
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(stat, idx) in overviewMetrics" :key="idx"
              :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#04C18F80]'"
              class="rounded-[24px] p-6 border shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div class="flex justify-between items-start mb-6">
                <h5 class="text-[18px] font-medium text-[#00000080]">{{ stat.title }}</h5>
                <div class="w-10 h-10 flex items-center justify-center" :class="stat.iconColor || 'p-0'">
                  <img v-if="typeof stat.icon === 'string'" :src="stat.icon" class="w-8 h-8" alt="icon" />
                  <component v-else :is="stat.icon" class="w-8 h-8" />
                </div>
              </div>
              <div class="flex items-baseline gap-2 mb-2">
                <img v-if="stat.isCurrency" src="/images/icons/dirham-black.svg" alt="AED" class="w-6 self-center" />
                <span class="text-[30px] font-normal text-[#1a1a1a] leading-tight">{{ stat.value }}</span>
              </div>
              <p class="text-[14px] text-[#999] font-normal">{{ stat.subtext }}</p>
            </div>
          </div>
        </section>

        <!-- Payment Status Overview Section -->
        <section>
          <h2 class="text-[20px] font-normal mb-6" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Payment Status
            Overview</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(stat, idx) in paymentStatusMetrics" :key="idx" :class="[stat.bgClass || 'bg-[#F0FDF4]', stat.borderColor || 'border-[#04C18F80]']"
              class="rounded-[15px] p-6 border shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start mb-6">
                <h5 class="text-[18px] font-medium text-[#00000080]">{{ stat.title }}</h5>
                <div class="w-10 h-10 flex items-center justify-center" :class="stat.iconColor || 'p-0'">
                  <img v-if="typeof stat.icon === 'string'" :src="stat.icon" class="w-8 h-8" alt="icon" />
                  <component v-else :is="stat.icon" class="w-8 h-8" />
                </div>
              </div>
              <div class="flex items-baseline gap-2 mb-2">
                <img src="/images/icons/dirham-black.svg" alt="AED" class="w-6 self-center" />
                <span class="text-[30px] font-normal text-[#1a1a1a] leading-tight">{{ stat.value }}</span>
              </div>
              <p class="text-[16px] font-normal flex items-center gap-2">
                <span class="text-[24px] font-normal" :style="{ color: stat.textColor || '#045E40' }">{{ stat.count
                }}</span>
                <span class="text-[14px] font-normal" :style="{ color: stat.textColor || '#045E40' }">{{ stat.subtext
                }}</span>
              </p>
            </div>
          </div>
        </section>

      </div>

      <!-- Operations Content -->
      <div v-else class="space-y-12">

        <!-- Report Uploads -->
        <section>
          <h2 class="text-[22px] font-normal mb-6" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Report Uploads</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Month End Report -->
            <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-[#F0FDF4] border-[#BEDBFF]'"
              class="rounded-[24px] p-[24px] border shadow-sm group hover:shadow-md transition-all">
              <div class="flex items-center gap-3 mb-8">
                <img src="/images/icons/Month-End-Report.svg" class="w-7 h-7"
                  :class="{ 'brightness-0 invert': isDark }" />
                <h4 class="text-[16px] font-normal" :class="isDark ? 'text-white' : 'text-[#00614E]'">AI Usage Report</h4>
              </div>
              <div class="space-y-6">
                <div>
                  <label class="block text-[14px] mb-2" :class="isDark ? 'text-white/70' : 'text-[#0A0A0A]'">Upload CSV
                    File</label>
                  <div @click="$refs.csvInput.click()"
                    :class="isDark ? 'bg-transparent border-white/10' : 'bg-[#F9FAFB] border-gray-100'"
                    class="flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:border-[#04C18F80] transition-colors">
                    <span class="font-medium text-[15px]" :class="isDark ? 'text-white' : 'text-[#000]'">Choose
                      File</span>
                    <span class="text-gray-400 text-[14px]">{{ csvFileName || 'No file chosen' }}</span>
                  </div>
                  <input ref="csvInput" type="file" accept=".csv" class="hidden"
                    @change="e => { csvFile = e.target.files[0] ?? null; csvFileName = e.target.files[0]?.name ?? '' }" />
                </div>
                <div class="space-y-3">
                  <button @click="downloadTemplate('ai-usage')" class="w-full flex items-center justify-center gap-3 py-3 border border-[#008169]/30 text-[#008169] rounded-xl text-[15px] font-medium hover:bg-[#00B794]/5 transition-all cursor-pointer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download Sample
                  </button>
                  <button @click="handleUploadAiUsage"
                    class="w-full py-4 bg-[#00835D] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#006b4d] transition-all cursor-pointer shadow-sm">
                    <img src="/images/icons/upload.svg" class="w-5 h-5 brightness-0 invert" />
                    Upload AI Usage Report
                  </button>
                </div>
              </div>
            </div>

            <!-- Hosting Cost Report -->
            <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-[#F0FDF4] border-[#BEDBFF]'"
              class="rounded-[24px] p-[24px] border shadow-sm group hover:shadow-md transition-all">
              <div class="flex items-center gap-3 mb-8">
                <img src="/images/icons/Hosting-Cost-Report.svg" class="w-7 h-7"
                  :class="{ 'brightness-0 invert': isDark }" />
                <h4 class="text-[16px] font-normal" :class="isDark ? 'text-white' : 'text-[#00614E]'">Hosting Cost
                  Report</h4>
              </div>
              <div class="space-y-6">
                <div>
                  <label class="block text-[14px] mb-2" :class="isDark ? 'text-white/70' : 'text-[#0A0A0A]'">Upload
                    Excel File</label>
                  <div @click="$refs.excelInput.click()"
                    :class="isDark ? 'bg-transparent border-white/10' : 'bg-[#F9FAFB] border-gray-100'"
                    class="flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:border-[#04C18F80] transition-colors">
                    <span class="font-medium text-[15px]" :class="isDark ? 'text-white' : 'text-[#000]'">Choose
                      File</span>
                    <span class="text-gray-400 text-[14px]">{{ excelFileName || 'No file chosen' }}</span>
                  </div>
                  <input ref="excelInput" type="file" accept=".xlsx,.xls" class="hidden"
                    @change="e => { excelFile = e.target.files[0] ?? null; excelFileName = e.target.files[0]?.name ?? '' }" />
                </div>
                <div class="space-y-3">
                  <button @click="downloadTemplate('hosting')" class="w-full flex items-center justify-center gap-3 py-3 border border-[#008169]/30 text-[#008169] rounded-xl text-[15px] font-medium hover:bg-[#00B794]/5 transition-all cursor-pointer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download Sample
                  </button>
                  <button @click="handleUploadHosting"
                    class="w-full py-4 bg-[#00835D] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#006b4d] transition-all cursor-pointer shadow-sm">
                    <img src="/images/icons/upload.svg" class="w-5 h-5 brightness-0 invert" />
                    Upload Hosting Cost Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Customer Management -->
        <section class="space-y-8">
          <h2 class="text-[22px] font-normal" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Customer Management</h2>

          <!-- Sub Tabs -->
          <div :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'"
            class="rounded-full p-1.5 flex items-center shadow-sm border overflow-x-auto no-scrollbar">
            <button v-for="tab in customerSubTabs" :key="tab.name" @click="activeCustomerSubTab = tab.name"
              class="w-1/4 px-8 py-3 rounded-full text-[16px] font-medium transition-all cursor-pointer whitespace-nowrap text-center"
              :class="activeCustomerSubTab === tab.name ? (isDark ? 'bg-[#1b5e50] text-[#fff] shadow-sm' : 'bg-[#82FFE0] text-[#0A0A0A] shadow-sm') : (isDark ? 'bg-transparent text-[#fff]' : 'bg-transparent text-[#000]')">
              {{ tab.name }} ({{ tab.count }})
            </button>
          </div>

          <!-- Stats Grid -->
          <div v-if="!['Notify Customers', 'User Master Info'].includes(activeCustomerSubTab)"
            class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(stat, idx) in operationsStats" :key="idx"
              :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#04C18F80]'"
              class="rounded-[24px] p-6 border transition-all hover:shadow-lg group">
              <div class="flex justify-between items-start mb-3">
                <h5 class="text-[18px] font-medium text-[#00000080]">{{ stat.title }}</h5>
                <div class="w-10 h-10 flex items-center justify-center text-[#04C18F]">
                  <img v-if="typeof stat.icon === 'string'" :src="stat.icon" class="w-8 h-8" alt="icon" />
                  <component v-else :is="stat.icon" class="w-8 h-8" />
                </div>
              </div>
              <div class="flex items-baseline gap-2 mb-2">
                <img v-if="stat.isCurrency" src="/images/icons/dirham-black.svg" alt="AED"
                  class="w-6 h-6 self-center" />
                <span class="text-[30px] font-normal text-[#1a1a1a] leading-[45px]">{{ stat.value }}</span>
              </div>
              <p v-if="stat.subtext" class="text-[14px] text-[#999]">{{ stat.subtext }}</p>
            </div>
          </div>
        </section>

        <!-- Search & Filter Bar -->
        <div class="flex items-center gap-4 rounded-[16px] p-5 border transition-all"
          :style="isDark ? 'background-color: #1b5e502e; border-color: #04C18F80;' : 'background-color: #61FFD62E; border-color: #00BE8CBD;'">
          <!-- Search Input -->
          <div class="relative w-full max-w-[60%]">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
              :class="isDark ? 'text-white/40' : 'text-[#00000040]'" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by company name, customer code, or source..."
              class="w-full h-[44px] border rounded-[8px] pl-12 pr-4 text-[14px] placeholder:text-gray-400 focus:outline-none transition-all"
              :class="isDark ? 'bg-white/5 text-white border-white/10' : 'bg-white text-[#1a1a1a] border-[#00BE8CBD]'" />
          </div>

          <!-- Status Filter -->
          <div class="relative w-full max-w-[30%]">
            <svg xmlns="http://www.w3.org/2000/svg"
              class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
              :class="isDark ? 'text-white/60' : 'text-[#00000040]'" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <div @click="isStatusDropdownOpen = !isStatusDropdownOpen"
              class="w-full h-[44px] border rounded-[8px] pl-10 pr-4 text-[14px] flex items-center justify-between cursor-pointer transition-all"
              :class="isDark ? 'bg-white/5 text-white border-white/10' : 'bg-white text-[#1a1a1a] border-[#00BE8CBD]'">
              <span>{{ selectedStatus }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#00000040] transition-transform duration-200"
                :class="{ 'rotate-180': isStatusDropdownOpen, 'brightness-0 invert': isDark }" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Custom Dropdown Menu -->
            <transition name="fade-slide">
              <div v-if="isStatusDropdownOpen"
                :class="isDark ? 'bg-[#111] border-white/10' : 'bg-white border-gray-100'"
                class="absolute top-[calc(100%+4px)] left-0 w-full border rounded-[12px] shadow-xl z-50 p-2 space-y-1">
                <div v-for="status in ['All Statuses', 'Paid', 'Failed']" :key="status"
                  @click="selectedStatus = status; isStatusDropdownOpen = false"
                  class="px-4 py-2.5 rounded-[8px] text-[14px] cursor-pointer transition-colors" :class="[
                    selectedStatus === status
                      ? (isDark ? 'bg-white/10 text-white' : 'bg-[#E4FFF6B0] text-[#000]')
                      : (isDark ? 'text-white/70 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50')
                  ]">
                  {{ status }}
                </div>
              </div>
            </transition>
          </div>

          <!-- Export Button -->
          <button
            class="h-[44px] w-[350px] flex items-center justify-center gap-2 px-5 rounded-[8px] text-[14px] font-medium border transition-all cursor-pointer hover:shadow-sm"
            :style="isDark ? 'background-color: #1b5e502e; border-color: #04C18F80; color: #fff;' : 'background-color: #61FFD62E; border-color: #00BE8CBD; color: #007C65;'">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export to Excel
          </button>
        </div>

        <!-- Customer/Payment Details & Management -->
        <section :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'"
          class="p-8 rounded-[24px] border shadow-sm overflow-hidden">
          <div class="pb-4 flex items-center justify-between">
            <h2 class="text-[22px] font-normal" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">
              {{ activeCustomerSubTab === 'User Master Info' ? 'Customer Details & Management' :
                'Payment Details & Management' }}
            </h2>
            <span class="text-[12px] text-gray-400">Values in AED Million</span>
          </div>
          <!-- Table Wrapper -->
          <div class="overflow-x-auto">
            <!-- Partners Table -->
            <table v-if="activeCustomerSubTab === 'Partners'" class="w-full text-left border-collapse min-w-[1200px]">
              <thead class="bg-[#00835D] text-white">
                <tr>
                  <th class="px-8 py-5 text-[15px] font-medium first:rounded-tl-2xl">Customer Code</th>
                  <th class="px-8 py-5 text-[15px] font-medium relative">
                    <div @click="isSourceMenuOpen = !isSourceMenuOpen"
                      class="flex items-center gap-2 cursor-pointer select-none">
                      Source
                      <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 opacity-70 transition-transform duration-200"
                        :class="{ 'rotate-180': isSourceMenuOpen }" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>

                    <!-- Source Multi-Select Dropdown -->
                    <div v-if="isSourceMenuOpen"
                      class="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-[12px] shadow-2xl z-50 p-2 min-w-[160px] text-left font-normal text-[#1a1a1a]">
                      <div class="space-y-1">
                        <div v-for="source in partnerSourceOptions" :key="source"
                          @click.stop="toggleSourceFilter(source)"
                          class="flex items-center gap-3 p-2 rounded-[8px] hover:bg-gray-50 cursor-pointer transition-colors group">
                          <!-- Checkbox UI -->
                          <div
                            class="w-[18px] h-[18px] rounded-[4px] flex items-center justify-center transition-all flex-shrink-0"
                            :class="selectedSources.includes(source) ? 'bg-[#00835D]' : 'border-2 border-gray-300 group-hover:border-[#00835D80]'">
                            <svg v-if="selectedSources.includes(source)" xmlns="http://www.w3.org/2000/svg"
                              class="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                            </svg>
                          </div>
                          <span class="text-[14px]"
                            :class="selectedSources.includes(source) ? 'text-[#000]' : 'text-gray-700'">
                            {{ source }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Company Name</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Contract Period</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Year</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Revenue</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Collected</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Settlement</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center whitespace-nowrap">Payment Date</th>
                  <th class="px-8 py-5 text-[15px] font-medium last:rounded-tr-2xl text-center">Payment Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 bg-[#F9FAFB]/50">
                <tr v-for="(row, idx) in paymentDetailsRows" :key="idx"
                  :class="isDark ? 'hover:bg-white/5' : 'hover:bg-white'" class="transition-all group">
                  <td class="px-8 py-6 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.code }}
                  </td>
                  <td class="px-8 py-6 text-[14px]" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{ row.source
                  }}</td>
                  <td class="px-8 py-6 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{
                    row.company }}</td>
                  <td class="px-8 py-6 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{
                    row.period }}</td>
                  <td class="px-8 py-6 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{
                    row.year }}</td>
                  <td class="px-8 py-6 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{
                    row.revenue }}</td>
                  <td class="px-8 py-6 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{
                    row.collected }}</td>
                  <td class="px-8 py-6 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{
                    row.settlement }}</td>
                  <td class="px-8 py-6 text-[14px] text-center" :class="isDark ? 'text-white/90' : 'text-[#0A0A0A]'">{{
                    row.date }}</td>
                  <td class="px-8 py-6 text-center">
                    <span
                      :class="row.status === 'Paid' ? 'bg-[#00835D] text-white shadow-[#00835D33]' : 'bg-[#FF4D4D] text-white shadow-[#FF4D4D33]'"
                      class="px-5 py-2 rounded-full text-[12px] font-semibold shadow-sm inline-block min-w-[70px]">
                      {{ row.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Direct Customers Table -->
            <table v-if="activeCustomerSubTab === 'Direct Customers'"
              class="w-full text-left border-collapse min-w-[1200px]">
              <thead class="bg-[#00835D] text-white">
                <tr>
                  <th class="px-8 py-5 text-[15px] font-medium first:rounded-tl-2xl">Customer Code</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Source</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Company Name</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Revenue</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Collected</th>
                  <th class="px-8 py-5 text-[15px] font-medium whitespace-nowrap">Payment Date</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Payment Status</th>
                  <th class="px-8 py-5 text-[15px] font-medium last:rounded-tr-2xl">Pending Reason</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 bg-[#F9FAFB]/50">
                <tr v-for="(row, idx) in directCustomersData" :key="idx" class="hover:bg-white transition-all group">
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.code }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.source }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.company }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.revenue }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.collected }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.date }}</td>
                  <td class="px-8 py-6 text-center">
                    <span
                      :class="row.status === 'Paid' ? 'bg-[#00835D] text-white shadow-[#00835D33]' : 'bg-[#FF4D4D] text-white shadow-[#FF4D4D33]'"
                      class="px-5 py-2 rounded-full text-[12px] font-semibold shadow-sm inline-block min-w-[70px]">
                      {{ row.status }}
                    </span>
                  </td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.reason }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Notify Customers Table -->
            <table v-if="activeCustomerSubTab === 'Notify Customers'"
              class="w-full text-left border-collapse min-w-[1200px]">
              <thead class="bg-[#00835D] text-white">
                <tr>
                  <th class="px-8 py-5 text-[15px] font-medium first:rounded-tl-2xl">Customer Code</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Source</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Company Name</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Contact No.</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Card Type</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Last 4 Digits</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Expiring Date</th>
                  <th class="px-8 py-5 text-[15px] font-medium text-center">Status</th>
                  <th class="px-8 py-5 text-[15px] font-medium last:rounded-tr-2xl text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 bg-[#F9FAFB]/50">
                <tr v-for="(row, idx) in notifyCustomersData" :key="idx" class="hover:bg-white transition-all group">
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.code }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.source }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.company }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.contact }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.cardType }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A] text-center">{{ row.last4 }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A] text-center">{{ row.expiry }}</td>
                  <td class="px-8 py-6 text-center">
                    <span
                      class="bg-[#EF4444] text-white shadow-[#EF444433] px-5 py-2 rounded-full text-[12px] font-semibold shadow-sm inline-block min-w-[70px]">
                      {{ row.status }}
                    </span>
                  </td>
                  <td class="px-8 py-6 text-center">
                    <button v-if="row.action === 'Notify'"
                      @click="handleNotify(row.code)"
                      :disabled="notifyingTenantId === row.code"
                      class="px-5 py-2 bg-[#00835D] text-white rounded-[8px] text-[13px] font-medium flex items-center justify-center gap-2 mx-auto hover:bg-[#007452] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      {{ notifyingTenantId === row.code ? 'Sending...' : 'Notify' }}
                    </button>
                    <button v-else-if="row.action === 'Notified'"
                      class="px-4 py-2 bg-transparent border border-[#00BE8CBD] text-[#00BE8CBD] rounded-[8px] text-[13px] font-medium flex items-center justify-center gap-2 mx-auto cursor-default opacity-80">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Notified
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- User Master Info Table -->
            <table v-if="activeCustomerSubTab === 'User Master Info'"
              class="w-full text-left border-collapse min-w-[1200px]">
              <thead class="bg-[#00835D] text-white">
                <tr>
                  <th class="px-8 py-5 text-[15px] font-medium first:rounded-tl-2xl">Customer Code</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Source</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Company Name</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Bank Details</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Credit Card</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Contact Person</th>
                  <th class="px-8 py-5 text-[15px] font-medium">Contact No.</th>
                  <th class="px-8 py-5 text-[15px] font-medium last:rounded-tr-2xl">Registered Email</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 bg-[#F9FAFB]/50">
                <tr v-for="(row, idx) in userMasterData" :key="idx" class="hover:bg-white transition-all group">
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.code }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.source }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.company }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.bank }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.card }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.contactPerson }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.contactNo }}</td>
                  <td class="px-8 py-6 text-[14px] text-[#0A0A0A]">{{ row.email }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>


    </main>

    <!-- FOOTER -->
    <DashboardFooter />

    <!-- UPLOAD STATUS MODAL -->
    <div v-if="uploadStatus.show"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
      @click.self="uploadStatus.show = false">
      <div :class="isDark ? 'bg-[#111] border border-white/10' : 'bg-white'"
        class="rounded-[24px] shadow-2xl w-full max-w-[420px] p-10 flex flex-col items-center gap-6 text-center relative">
        <button @click="uploadStatus.show = false" class="absolute top-6 right-6 hover:opacity-60 transition-opacity" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div class="w-16 h-16 rounded-full flex items-center justify-center"
          :class="uploadStatus.success ? 'bg-[#E4FFF6]' : 'bg-red-50'">
          <svg v-if="uploadStatus.success" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-[#04C18F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <div>
          <p class="text-[18px] font-medium mb-2" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">{{ uploadStatus.success ? 'Upload Successful' : 'Upload Failed' }}</p>
          <p class="text-[14px]" :class="isDark ? 'text-white/60' : 'text-gray-500'">{{ uploadStatus.message }}</p>
        </div>
        <button @click="uploadStatus.show = false"
          class="px-8 py-3 rounded-xl text-white font-medium transition-all cursor-pointer"
          :class="uploadStatus.success ? 'bg-[#00835D] hover:bg-[#006b4d]' : 'bg-red-500 hover:bg-red-600'">
          OK
        </button>
      </div>
    </div>

    <!-- PAYMENT MODAL -->
    <div v-if="showPaymentModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div :class="isDark ? 'bg-[#111] border border-white/10' : 'bg-white'"
        class="rounded-[24px] shadow-2xl w-full max-w-[650px] overflow-hidden">
        <div class="p-10 relative">
          <!-- Close Button -->
          <button @click="showPaymentModal = false"
            class="absolute top-6 right-8 text-[#000] hover:text-gray-600 transition-colors z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="mb-8">
            <h3 class="text-[18px] font-medium text-[#1a1a1a]">Payment to Partner</h3>
            <p class="text-[#9ea4ad] text-[15px] mt-1 font-normal">Submit a payment request for partner approval</p>
          </div>

          <!-- Form Grid -->
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <!-- Select Partner -->
              <div class="space-y-1.5 relative">
                <label class="text-[15px] font-normal" :class="isDark ? 'text-white/70' : 'text-[#1a1a1a]'">Select
                  Partner *</label>
                <div @click="showPartnerList = !showPartnerList"
                  :class="isDark ? 'bg-white/5 border-white/10' : 'bg-white border-[#82FFE0]'"
                  class="w-full px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer focus:border-[#00DDA3] transition-all">
                  <span
                    :class="[selectedPartner === 'Choose a partner' ? 'text-[#b0b7c1]' : (isDark ? 'text-white' : 'text-[#000]')]"
                    class="text-[15px]">{{ selectedPartner }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-40 transition-transform duration-300"
                    :class="showPartnerList ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <!-- Dropdown List -->
                <transition name="fade-slide">
                  <div v-if="showPartnerList"
                    class="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-xl z-20 border border-gray-50 overflow-hidden py-1">
                    <div v-for="partner in partners" :key="partner"
                      @click="selectPartnerForPayment(partner)"
                      class="px-6 py-4 text-[15px] text-[#1a1a1a] cursor-pointer hover:bg-[#E0FFF7] transition-all font-normal">
                      {{ partner }}
                    </div>
                  </div>
                </transition>
              </div>
              <!-- Payment Date -->
              <div class="space-y-1.5 relative">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Payment Date *</label>
                <div @click="activeModalDropdown = activeModalDropdown === 'calendar' ? null : 'calendar'"
                  class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl flex items-center justify-between cursor-pointer focus:border-[#00DDA3] transition-all">
                  <span :class="!paymentDate ? 'text-[#b0b7c1]' : 'text-[#000]'" class="text-[15px]">
                    {{ paymentDate ? formatDate(paymentDate) : 'dd-mm-yyyy' }}
                  </span>
                  <img src="/images/icons/calendar.svg" class="w-5 h-5 opacity-40 pointer-events-none" />
                </div>

                <!-- Calendar Popover -->
                <transition name="fade-slide">
                  <div v-if="activeModalDropdown === 'calendar'"
                    class="absolute top-[calc(100%+8px)] right-0 z-[60] bg-white border border-gray-100 rounded-2xl shadow-2xl p-2">
                    <VDatePicker v-model="paymentDate" @update:model-value="activeModalDropdown = null" color="emerald"
                      borderless />
                  </div>
                </transition>
              </div>
            </div>

            <!-- Covered Clients Trigger -->
            <div v-if="selectedPartnerId" class="space-y-1.5">
              <label class="text-[15px] font-normal text-[#1a1a1a]">Covered Clients *</label>
              <div @click="showClientPicker = true"
                :class="selectedClientIds.length ? 'border-[#00835D] bg-[#F0FDF4]' : 'border-[#82FFE0] bg-white'"
                class="w-full px-4 py-3 border rounded-xl flex items-center justify-between cursor-pointer hover:border-[#00835D] transition-all">
                <span :class="selectedClientIds.length ? 'text-[#00835D] font-medium' : 'text-[#b0b7c1]'" class="text-[15px]">
                  {{ selectedClientIds.length ? `${selectedClientIds.length} client${selectedClientIds.length > 1 ? 's' : ''} selected` : 'Select clients covered by this payment' }}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#00835D]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>

            <!-- Payment Details -->
            <div class="space-y-1.5">
              <label class="text-[15px] font-normal text-[#1a1a1a]">Payment Details *</label>
              <textarea placeholder="e.g., Commission for October 2024, Revenue share for Q4..." rows="4"
                class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px] resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <!-- Payment Value -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Payment Value (AED) *</label>
                <input type="number" step="0.01" placeholder="0.00"
                  class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <!-- Voucher Number -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Voucher Number *</label>
                <input type="text" placeholder="e.g., VCH-2024-001"
                  class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px]" />
              </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 pt-4">
              <button @click="showPaymentModal = false"
                class="px-8 py-3 bg-white border border-gray-200 text-[#1a1a1a] rounded-xl font-normal hover:bg-gray-50 transition-all cursor-pointer">
                Cancel
              </button>
              <button @click="handleSubmitPayment"
                class="px-8 py-3 bg-[#00835D] text-white rounded-xl font-normal hover:bg-[#007452] transition-all cursor-pointer">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CLIENT PICKER MODAL -->
    <div v-if="showClientPicker"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
      @click.self="showClientPicker = false">
      <div :class="isDark ? 'bg-[#111] border border-white/10' : 'bg-white'"
        class="rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden flex flex-col" style="max-height: 80vh">
        <!-- Header -->
        <div class="px-8 pt-8 pb-4">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-[18px] font-medium" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">Select Clients</h3>
              <p class="text-[13px] mt-0.5" :class="isDark ? 'text-white/50' : 'text-gray-400'">{{ selectedClientIds.length }} of {{ partnerClientsList.length }} selected</p>
            </div>
            <button @click="showClientPicker = false" class="hover:opacity-60 transition-opacity" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <!-- Search -->
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" /></svg>
            <input v-model="clientSearch" type="text" placeholder="Search by company or email..."
              :class="isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30' : 'bg-[#F9FAFB] border-gray-100 text-[#1a1a1a] placeholder:text-gray-400'"
              class="w-full pl-10 pr-4 py-3 border rounded-xl text-[14px] focus:outline-none focus:border-[#00835D] transition-colors" />
          </div>
          <!-- Select All -->
          <label class="flex items-center gap-3 mt-4 cursor-pointer">
            <input type="checkbox"
              :checked="selectedClientIds.length === partnerClientsList.length && partnerClientsList.length > 0"
              :indeterminate="selectedClientIds.length > 0 && selectedClientIds.length < partnerClientsList.length"
              @change="selectedClientIds = selectedClientIds.length === partnerClientsList.length ? [] : partnerClientsList.map(c => c.user_id)"
              class="w-4 h-4 accent-[#00835D] cursor-pointer" />
            <span class="text-[14px] font-medium" :class="isDark ? 'text-white/70' : 'text-[#1a1a1a]'">Select all</span>
          </label>
        </div>

        <!-- Client List -->
        <div class="overflow-y-auto flex-1 px-8 pb-4 divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
          <label v-for="client in filteredClients" :key="client.user_id"
            class="flex items-center gap-3 py-4 cursor-pointer group">
            <input type="checkbox" :value="client.user_id" v-model="selectedClientIds"
              class="w-4 h-4 accent-[#00835D] cursor-pointer flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-[14px] font-medium truncate" :class="isDark ? 'text-white' : 'text-[#1a1a1a]'">{{ client.company_name }}</p>
              <p class="text-[12px] truncate" :class="isDark ? 'text-white/40' : 'text-gray-400'">{{ client.email }}</p>
            </div>
            <svg v-if="selectedClientIds.includes(client.user_id)" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#04C18F] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          </label>
          <p v-if="!filteredClients.length" class="text-[14px] text-gray-400 py-6 text-center">No clients match your search.</p>
        </div>

        <!-- Footer -->
        <div class="px-8 py-5 border-t" :class="isDark ? 'border-white/10' : 'border-gray-100'">
          <button @click="showClientPicker = false"
            class="w-full py-3 bg-[#00835D] hover:bg-[#006b4d] text-white rounded-xl font-medium transition-all cursor-pointer">
            Confirm Selection
          </button>
        </div>
      </div>
    </div>

    <!-- ADD NEW PARTNER MODAL -->
    <div v-if="showAddPartnerModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div :class="isDark ? 'bg-[#111] border border-white/10' : 'bg-white'"
        class="rounded-[24px] shadow-2xl w-full max-w-[650px] overflow-hidden">
        <div class="p-10 relative">
          <!-- Close Button -->
          <button @click="showAddPartnerModal = false"
            class="absolute top-6 right-8 text-[#000] hover:text-gray-600 transition-colors z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="mb-8">
            <h3 class="text-[18px] font-medium text-[#1a1a1a]">Add New Partner Request</h3>
            <p class="text-[#9ea4ad] text-[15px] mt-1 font-normal">Submit a new partner request for admin approval</p>
          </div>

          <!-- Form Grid -->
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <!-- Email -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Email *</label>
                <input type="email" v-model="newPartnerForm.email" placeholder="partner@company.com"
                  class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px]" />
              </div>
              <!-- Contact Person -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Contact Person *</label>
                <input type="text" v-model="newPartnerForm.contact_person" placeholder="John Doe"
                  class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px]" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <!-- Contact Phone -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Contact Phone</label>
                <input type="text" v-model="newPartnerForm.contact_phone" placeholder="+1-555-0000"
                  class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px]" />
              </div>
              <!-- Trading License -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Trading License *</label>
                <input type="text" v-model="newPartnerForm.trading_license" placeholder="TL-2024-XXX"
                  class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px]" />
              </div>
            </div>

            <!-- Address -->
            <div class="space-y-1.5">
              <label class="text-[15px] font-normal text-[#1a1a1a]">Address</label>
              <textarea v-model="newPartnerForm.address" placeholder="Full business address" rows="3"
                class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px] resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <!-- Authorized Person -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Authorized Person</label>
                <input type="text" v-model="newPartnerForm.authorized_person" placeholder="Jane Smith"
                  class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px]" />
              </div>
              <!-- Authorized Person Contact -->
              <div class="space-y-1.5">
                <label class="text-[15px] font-normal text-[#1a1a1a]">Authorized Person Contact</label>
                <input type="text" v-model="newPartnerForm.authorized_person_contact" placeholder="+1-555-0001"
                  class="w-full px-4 py-3 bg-white border border-[#82FFE0] rounded-xl focus:outline-none focus:border-[#00DDA3] placeholder:text-[#b0b7c1] text-[#000] text-[15px]" />
              </div>
            </div>

            <!-- Footer -->
            <p v-if="addPartnerError" class="text-[13px] text-red-500 pt-2">{{ addPartnerError }}</p>
            <div class="flex justify-end gap-3 pt-4">
              <button @click="showAddPartnerModal = false"
                class="px-8 py-3 bg-white border border-gray-200 text-[#1a1a1a] rounded-xl font-normal hover:bg-gray-50 transition-all cursor-pointer">
                Cancel
              </button>
              <button @click="handleAddPartner" :disabled="addPartnerLoading"
                class="px-8 py-3 bg-[#00835D] text-white rounded-xl font-normal hover:bg-[#007452] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                {{ addPartnerLoading ? 'Submitting…' : 'Submit Request' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { DatePicker as VDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import { format } from 'date-fns'

definePageMeta({ layout: false })

const { isDark } = useTheme()

const {
  overview, customers, alerts, loading,
  fetchOverview, fetchCustomers, fetchAlerts,
  submitPaymentToPartner, fetchPartnerClients,
  addPartner, uploadHosting, uploadAiUsage, downloadTemplate,
  fetchNotifyCustomers, fetchUserMasterInfo, fetchActivePartners, sendCardExpiryNotification,
} = useAccountsDashboard()

// ── Tab state (cookie-persisted) ──────────────────────────────────────────
const tabCookie = useCookie('rp_accounts_tab', { default: () => 'Overview' })
const subCookie = useCookie('rp_accounts_sub', { default: () => 'Partners' })
const activeTab            = ref(tabCookie.value)
const activeCustomerSubTab = ref(subCookie.value)
const isStatusDropdownOpen  = ref(false)
const selectedStatus        = ref('All Statuses')
const showAlertBanner       = ref(true)

// ── File upload refs ───────────────────────────────────────────────────────
const csvFile       = ref(null)
const excelFile     = ref(null)
const csvFileName   = ref('')
const excelFileName = ref('')
const csvInput      = ref(null)
const excelInput    = ref(null)

// ── Upload status modal ─────────────────────────────────────────────────────
const uploadStatus = ref({ show: false, success: false, message: '' })
function showUploadResult(success, message) {
  uploadStatus.value = { show: true, success, message }
}

// ── Modal state ────────────────────────────────────────────────────────────
const showPaymentModal    = ref(false)
const showAddPartnerModal = ref(false)
const showPartnerList     = ref(false)
const selectedPartnerId   = ref(null)
const selectedPartner     = ref('Choose a partner')
const partnerClientsList  = ref([])
const selectedClientIds   = ref([])
const showClientPicker    = ref(false)
const clientSearch        = ref('')

const paymentDate       = ref(null)
const paymentDetails    = ref('')
const paymentAmount     = ref('')
const voucherNumber     = ref('')
const activeModalDropdown = ref(null)

const newPartnerForm = ref({ name: '', email: '', contact_person: '', contact_phone: '', trading_license: '', address: '', authorized_person: '', authorized_person_contact: '' })

// ── Table data ─────────────────────────────────────────────────────────────
const partnerRows        = ref([])
const directRows         = ref([])
const notifyRows         = ref([])
const userMasterRows     = ref([])
const activePartnerList  = ref([])
const notifyingTenantId  = ref(null)

// ── Tab sub-data ───────────────────────────────────────────────────────────
const isSourceMenuOpen = ref(false)
const selectedSources  = ref([])

const toggleSourceFilter = (source) => {
  const i = selectedSources.value.indexOf(source)
  i > -1 ? selectedSources.value.splice(i, 1) : selectedSources.value.push(source)
}

const partnerSourceOptions = computed(() => [...new Set(partnerRows.value.map(r => r.source).filter(Boolean))])

const paymentDetailsRows  = computed(() => selectedSources.value.length ? partnerRows.value.filter(r => selectedSources.value.includes(r.source)) : partnerRows.value)
const directCustomersData = computed(() => directRows.value)
const notifyCustomersData = computed(() => notifyRows.value)
const userMasterData      = computed(() => userMasterRows.value)

const customerSubTabs = computed(() => [
  { name: 'Partners',           count: partnerRows.value.length },
  { name: 'Direct Customers',   count: directRows.value.length },
  { name: 'Notify Customers',   count: notifyRows.value.length },
  { name: 'User Master Info',   count: userMasterRows.value.length },
])

// ── Overview metrics ────────────────────────────────────────────────────────
const overviewMetrics = computed(() => {
  const m = overview.value?.metrics
  if (!m) return []
  return [
    { title: 'Total Revenue', isCurrency: true, value: m.total_revenue_aed?.toLocaleString(), subtext: 'All collected payments', icon: '/images/icons/Total-Revenue.svg' },
    { title: 'Active Partners', isCurrency: false, value: m.total_partners, subtext: 'Revenue-linked partners', icon: '/images/icons/Partner.svg' },
    { title: 'Total Customers', isCurrency: false, value: m.total_customers, subtext: 'Across all sources', icon: '/images/icons/Total-Customers.svg' },
  ]
})

const paymentStatusMetrics = computed(() => {
  const ps = overview.value?.payment_status
  if (!ps) return []
  return [
    { title: 'Paid', isCurrency: false, value: ps.paid, count: ps.paid, subtext: 'payments', bgClass: 'bg-[#F0FDF4]', borderColor: 'border-[#04C18F80]', textColor: '#045E40', icon: '/images/icons/Amount-Collected.svg' },
    { title: 'Pending', isCurrency: false, value: ps.pending, count: ps.pending, subtext: 'payments', bgClass: 'bg-[#FFFBEB]', borderColor: 'border-[#FCD34D]', textColor: '#92400E', icon: '/images/icons/pending.svg' },
    { title: 'Failed', isCurrency: false, value: ps.failed, count: ps.failed, subtext: 'payments', bgClass: 'bg-[#FEF2F2]', borderColor: 'border-[#FCA5A5]', textColor: '#991B1B', icon: '/images/icons/overdue.svg' },
  ]
})

// Stats cards for the Operations sub-tabs — derived from loaded row data
const operationsStats = computed(() => {
  const rows = activeCustomerSubTab.value === 'Partners' ? partnerRows.value : directRows.value
  const totalRevenue   = rows.reduce((s, r) => s + (r.rawRevenue ?? 0), 0)
  const totalCollected = rows.reduce((s, r) => s + (r.rawCollected ?? 0), 0)
  const rate = totalRevenue > 0 ? ((totalCollected / totalRevenue) * 100).toFixed(1) : '0.0'
  const subtext = activeCustomerSubTab.value === 'Partners' ? 'Partner-sourced clients' : 'Direct clients'
  const revenueSubtext = activeCustomerSubTab.value === 'Partners' ? 'All partner revenue' : 'All direct revenue'
  return [
    { title: 'Total Customers', isCurrency: false, value: rows.length, subtext, icon: '/images/icons/Total-Customers.svg' },
    { title: 'Total Revenue', isCurrency: true, value: totalRevenue.toLocaleString(), subtext: revenueSubtext, icon: '/images/icons/Total-Revenue.svg' },
    { title: 'Amount Collected', isCurrency: true, value: totalCollected.toLocaleString(), subtext: `Collection rate: ${rate}%`, icon: '/images/icons/Amount-Collected.svg' },
  ]
})

const hasAlert = computed(() => (alerts.value?.length ?? 0) > 0)
const expiringCardsCount = computed(() => alerts.value?.filter(a => a.message?.includes('card')).length ?? 0)
const expiringCardsDaysThreshold = computed(() => 30)

// ── Partners list for modal ─────────────────────────────────────────────────
const partners = computed(() => activePartnerList.value.map(p => p.name))

const filteredClients = computed(() => {
  const q = clientSearch.value.toLowerCase().trim()
  if (!q) return partnerClientsList.value
  return partnerClientsList.value.filter(c =>
    c.company_name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
  )
})

const formatDate = (date) => date ? format(date, 'dd-MM-yyyy') : ''

// ── Cookie sync ───────────────────────────────────────────────────────────
watch(activeTab, (val) => {
  tabCookie.value = val
})
watch(activeCustomerSubTab, (val) => {
  subCookie.value = val
})

// ── Fetch on mount ──────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([fetchOverview(), fetchAlerts()])
  const regs = await fetchActivePartners()
  activePartnerList.value = regs || []
  loadAllSubTabs()
})

async function loadAllSubTabs() {
  await Promise.allSettled([
    loadSubTab('Partners'),
    loadSubTab('Direct Customers'),
    loadSubTab('Notify Customers'),
    loadSubTab('User Master Info'),
  ])
}

async function loadSubTab(tab) {
  try {
    if (tab === 'Partners') {
      const data = await fetchCustomers('partners')
      console.log('[loadSubTab:Partners] rows:', data?.length, data)
      partnerRows.value = (data || []).map(normalizeRow)
    } else if (tab === 'Direct Customers') {
      const data = await fetchCustomers('direct')
      console.log('[loadSubTab:Direct] rows:', data?.length, data)
      directRows.value = (data || []).map(normalizeRow)
    } else if (tab === 'Notify Customers') {
      const data = await fetchNotifyCustomers()
      console.log('[loadSubTab:Notify] rows:', data?.length, data)
      notifyRows.value = (data || []).map(r => ({
        code: r.tenant_id, source: r.partner?.code ?? 'Direct', company: r.company_name,
        contact: r.contact_no ?? '—', cardType: r.card_type ?? '—', last4: r.card_last4 ? `****${r.card_last4}` : '—',
        expiry: r.card_expiry ?? '—', status: 'Expiring', action: r.last_notified_at ? 'Notified' : 'Notify',
      }))
    } else if (tab === 'User Master Info') {
      const data = await fetchUserMasterInfo()
      console.log('[loadSubTab:UserMaster] rows:', data?.length, data)
      userMasterRows.value = (data || []).map(r => ({
        code: r.tenant_id, source: r.partner?.code ?? 'Direct', company: r.company_name,
        bank: r.bank_details ?? '—', card: r.card_type ? `${r.card_type} *${r.card_last4}` : '—',
        contactPerson: r.contact_person ?? '—', contactNo: r.contact_no ?? '—', email: r.email ?? '—',
      }))
    }
  } catch (e) {
    console.error(`[loadSubTab:${tab}]`, e)
  }
}

function normalizeRow(r) {
  return {
    code: r.tenant_id, source: r.partner?.code ?? 'Direct',
    company: r.company_name, period: r.contract_period ?? '—', year: r.year ?? '—',
    rawRevenue: r.revenue_aed ?? 0, rawCollected: r.collected_aed ?? 0,
    revenue: r.revenue_aed?.toLocaleString() ?? '—', collected: r.collected_aed?.toLocaleString() ?? '—',
    settlement: r.settlement_aed?.toLocaleString() ?? '—', date: r.last_payment_date ?? '—',
    status: ({ paid: 'Paid', failed: 'Failed', pending: 'Pending', no_payments: 'No Payments' })[r.payment_status] ?? 'No Payments', reason: '—',
  }
}

// ── Notify Customer ──────────────────────────────────────────────────────────
async function handleNotify(tenantId) {
  notifyingTenantId.value = tenantId
  try {
    await sendCardExpiryNotification(tenantId)
    const data = await fetchNotifyCustomers()
    notifyRows.value = (data || []).map(r => ({
      code: r.tenant_id, source: r.partner?.code ?? 'Direct', company: r.company_name,
      contact: r.contact_no ?? '—', cardType: r.card_type ?? '—', last4: r.card_last4 ? `****${r.card_last4}` : '—',
      expiry: r.card_expiry ?? '—', status: 'Expiring', action: r.last_notified_at ? 'Notified' : 'Notify',
    }))
  } catch (e) {
    console.error('[handleNotify]', e)
  } finally {
    notifyingTenantId.value = null
  }
}

// ── Partner select in modal ─────────────────────────────────────────────────
async function selectPartnerForPayment(name) {
  selectedPartner.value = name
  showPartnerList.value = false
  const p = activePartnerList.value.find(x => x.name === name)
  if (p) {
    selectedPartnerId.value = p.id
    const data = await fetchPartnerClients(p.id)
    partnerClientsList.value = data?.clients ?? []
    selectedClientIds.value = []
    clientSearch.value = ''
  }
}

// ── Modal submit handlers ───────────────────────────────────────────────────
async function handleSubmitPayment() {
  if (!selectedPartnerId.value || !paymentDate.value || !paymentAmount.value || !voucherNumber.value) return
  await submitPaymentToPartner({
    partner_id: selectedPartnerId.value,
    payment_date: format(paymentDate.value, 'yyyy-MM-dd'),
    details: paymentDetails.value,
    amount: parseFloat(paymentAmount.value),
    voucher_number: voucherNumber.value,
    covered_client_ids: selectedClientIds.value,
  })
  showPaymentModal.value = false
}

const addPartnerError   = ref('')
const addPartnerLoading = ref(false)

async function handleAddPartner() {
  addPartnerError.value = ''
  addPartnerLoading.value = true
  try {
    await addPartner({ ...newPartnerForm.value, name: newPartnerForm.value.contact_person })
    showAddPartnerModal.value = false
    newPartnerForm.value = { name: '', email: '', contact_person: '', contact_phone: '', trading_license: '', address: '', authorized_person: '', authorized_person_contact: '' }
  } catch (e) {
    addPartnerError.value = e?.data?.message ?? 'Failed to submit request. Please check all fields.'
  } finally {
    addPartnerLoading.value = false
  }
}

// ── Upload handlers ─────────────────────────────────────────────────────────
const defaultMonth = new Date().toISOString().slice(0, 7)

async function handleUploadHosting() {
  if (!excelFile.value) { showUploadResult(false, 'No file selected.'); return }
  try {
    const res = await uploadHosting(excelFile.value, defaultMonth)
    showUploadResult(true, res?.message ?? 'Hosting report uploaded successfully.')
    excelFileName.value = ''
    excelFile.value = null
  } catch (e) {
    showUploadResult(false, e?.data?.message ?? e?.message ?? 'Upload failed.')
  }
}

async function handleUploadAiUsage() {
  if (!csvFile.value) { showUploadResult(false, 'No file selected.'); return }
  try {
    const res = await uploadAiUsage(csvFile.value, defaultMonth)
    showUploadResult(true, res?.message ?? 'AI usage report uploaded successfully.')
    csvFileName.value = ''
    csvFile.value = null
  } catch (e) {
    showUploadResult(false, e?.data?.message ?? e?.message ?? 'Upload failed.')
  }
}

</script>

<style scoped>
main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: transparent;
}

main::-webkit-scrollbar-thumb {
  background: #E5E5E5;
  border-radius: 10px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
