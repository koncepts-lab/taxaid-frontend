<template>
  <div class="min-h-screen w-full max-w-[100vw] relative flex flex-col font-sans transition-colors duration-300 pb-10 overflow-x-hidden" :class="isDark ? 'dark-mode-bg text-white' : 'bg-[#f3f4f6] text-[#1a1a1a]'">

    <AdminDashboardHeader
      :userName="admin?.role?.name ?? 'Super Admin'"
      :userId="'Welcome, ' + (admin?.full_name ?? 'Super Admin')"
      :showChangeProfile="false"
      notificationsTo="/admin/notifications"
      :adminLogout="true"
      logoutTo="/ad-aqnz-pro-auth-78z46"
    />

    <main class="flex-1 w-full max-w-full px-4 sm:px-8 py-8 space-y-8 overflow-x-hidden min-w-0" style="margin-top: -18px;">

      <!-- Page title & Actions -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0 w-full">
        <div class="space-y-1 min-w-0">
          <div class="flex items-center gap-3 flex-wrap">
            <button
              @click="navigateTo('/admin')"
              class="px-3 py-1 rounded-[8px] border text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              :class="isDark ? 'bg-[#00141080] border-white/10 text-white/70 hover:text-white' : 'bg-white border-[#04C18F33] text-[#004D40] hover:bg-[#E6FFF3]'"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Hub</span>
            </button>
          </div>
          <h1 class="text-[24px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">
            Root Admin Console
          </h1>
          <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">
            Direct low-level system operations: Artisan command runner, live Firebase FCM & SMTP tester, and environment diagnostics.
          </p>
        </div>

        <div class="flex items-center gap-3 flex-shrink-0">
          <button
            @click="refreshSystemInfo"
            :disabled="loadingInfo"
            class="h-[42px] px-4 rounded-[10px] border flex items-center gap-2 text-[14px] font-medium transition-colors cursor-pointer"
            :class="isDark ? 'bg-[#00141080] border-white/10 text-white/80 hover:text-white' : 'bg-white border-[#04C18F33] text-[#004D40] hover:bg-[#E6FFF3]'"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': loadingInfo }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>

          <button
            @click="handleLock"
            class="h-[42px] px-5 rounded-[10px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium text-[14px] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Lock Console</span>
          </button>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-full">
        <div
          v-for="(metric, idx) in statCards"
          :key="idx"
          :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'"
          class="rounded-[16px] p-6 border shadow-sm min-w-0"
        >
          <h5 class="text-[14px] font-medium opacity-70 mb-4">{{ metric.title }}</h5>
          <span class="text-[26px] font-semibold leading-tight" :class="isDark ? 'text-white' : metric.textClass">
            {{ metric.value }}
          </span>
          <p class="text-[12px] opacity-60 mt-1">{{ metric.subtitle }}</p>
        </div>
      </div>

      <!-- Navigation Tabs (Pill style matching TaxAid Admin with horizontal scroll protection) -->
      <div class="w-full max-w-full overflow-x-auto no-scrollbar py-1">
        <div
          :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-gray-100'"
          class="inline-flex items-center gap-1 rounded-[35px] p-[10px] border shadow-sm flex-nowrap"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-6 py-2.5 rounded-full text-[14px] transition-all cursor-pointer whitespace-nowrap"
            :class="activeTab === tab.id
              ? (isDark ? 'bg-[#1b5e50] text-[#fff] shadow-sm' : 'bg-[#82FFE0] text-[#0A0A0A] font-medium')
              : (isDark ? 'bg-transparent text-white/70 hover:text-white' : 'bg-transparent text-[#0A0A0A] font-normal hover:bg-gray-50')"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- TAB 1: ARTISAN COMMAND RUNNER -->
      <div
        v-if="activeTab === 'artisan'"
        :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'"
        class="rounded-[20px] border shadow-sm p-6 sm:p-8 space-y-6 w-full max-w-full min-w-0 overflow-hidden"
      >
        <div class="space-y-1">
          <h2 class="text-[20px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">
            Artisan Command Runner
          </h2>
          <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">
            Execute Laravel Artisan commands on the active environment with connecting database permissions.
          </p>
        </div>

        <!-- Quick Action Buttons with Skeleton Loader to eliminate CLS -->
        <div class="space-y-4">
          <!-- Skeleton Loading State -->
          <div v-if="loadingCommands" class="space-y-4 animate-pulse">
            <div v-for="i in 3" :key="i" class="space-y-2">
              <div class="h-4 w-48 rounded bg-gray-300 dark:bg-white/10"></div>
              <div class="flex flex-wrap gap-2">
                <div v-for="j in 4" :key="j" class="h-8 w-36 rounded-[8px] bg-gray-200 dark:bg-white/5"></div>
              </div>
            </div>
          </div>

          <!-- Loaded Commands State -->
          <div v-else-if="commandGroups.length" class="space-y-4">
            <div v-for="group in commandGroups" :key="group.category" class="space-y-1.5">
              <div class="flex items-center gap-2">
                <span class="text-[12px] font-semibold tracking-wide uppercase opacity-70" :class="isDark ? 'text-[#10FFD4]' : 'text-[#007C65]'">
                  {{ group.category }}
                </span>
                <span class="text-[11px] opacity-50 font-normal">({{ group.description }})</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="cmd in group.commands"
                  :key="cmd.command"
                  type="button"
                  @click="executeArtisan(cmd.command)"
                  :disabled="executingCommand"
                  class="px-3.5 py-1.5 rounded-[8px] border text-[12px] sm:text-[13px] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  :class="cmd.badge === 'destructive'
                    ? (isDark ? 'bg-red-950/40 border-red-500/30 text-red-300 hover:bg-red-900/50' : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100')
                    : cmd.badge === 'primary'
                    ? (isDark ? 'bg-emerald-950/40 border-[#10FFD4]/40 text-[#10FFD4] hover:bg-emerald-900/50' : 'bg-[#E6FFF3] border-[#04C18F55] text-[#004D40] hover:bg-[#cbf7e3] font-medium')
                    : (isDark ? 'bg-black/30 border-white/10 text-white/80 hover:bg-[#00b988]/20 hover:border-[#00b988]/40' : 'bg-gray-50 border-[#04C18F33] text-[#004D40] hover:bg-[#E6FFF3]')"
                >
                  <span>{{ cmd.label }}</span>
                  <span class="text-[11px] opacity-60 font-mono">({{ cmd.command }})</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Command Input Form -->
        <form @submit.prevent="executeArtisan(customCommand)" class="space-y-2">
          <div class="flex items-center justify-between flex-wrap gap-3 pb-1">
            <label class="block text-[13px] font-medium opacity-80">Custom Artisan Command</label>
            <label class="inline-flex items-center gap-2.5 cursor-pointer select-none">
              <div class="relative inline-flex items-center">
                <input
                  type="checkbox"
                  v-model="runAsCloudJob"
                  class="sr-only"
                />
                <div
                  class="w-10 h-5 rounded-full transition-colors duration-200 ease-in-out border flex items-center px-0.5"
                  :class="runAsCloudJob
                    ? (isDark ? 'bg-[#10FFD4] border-[#10FFD4]' : 'bg-[#007C65] border-[#007C65]')
                    : (isDark ? 'bg-black/70 border-white/40' : 'bg-gray-200 border-gray-400')"
                >
                  <div
                    class="w-3.5 h-3.5 rounded-full transition-transform duration-200 ease-in-out shadow-sm"
                    :class="[
                      runAsCloudJob ? 'translate-x-5' : 'translate-x-0',
                      runAsCloudJob
                        ? (isDark ? 'bg-[#004D40]' : 'bg-white')
                        : (isDark ? 'bg-white' : 'bg-gray-500')
                    ]"
                  ></div>
                </div>
              </div>
              <span
                class="text-xs transition-colors"
                :class="runAsCloudJob
                  ? (isDark ? 'text-[#10FFD4] font-semibold' : 'text-[#007C65] font-semibold')
                  : (isDark ? 'text-white/80 font-medium' : 'text-gray-700 font-medium')"
              >
                Run as Cloud Run Job (Async / On-demand worker)
              </span>
            </label>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[13px] font-bold text-[#007C65]" :class="isDark ? 'text-[#10FFD4]' : ''">
                php artisan
              </span>
              <input
                v-model="customCommand"
                type="text"
                placeholder="e.g. org:migrate --org=2, org:status, migrate:status, optimize:clear"
                class="w-full pl-28 pr-4 h-[44px] rounded-[10px] border outline-none font-mono text-[13px] transition"
                :class="isDark ? 'bg-black/40 border-white/10 text-white focus:border-[#10FFD4]' : 'bg-white border-[#04C18F33] text-[#1a1a1a] focus:border-[#00896F]'"
              />
            </div>
            <button
              type="submit"
              :disabled="executingCommand || !customCommand.trim()"
              class="h-[44px] w-[175px] min-w-[175px] rounded-[10px] bg-[#007C65] hover:bg-[#006552] disabled:opacity-50 text-white font-medium text-[14px] transition flex items-center justify-center gap-2 cursor-pointer shadow-sm flex-shrink-0"
            >
              <svg v-if="executingCommand" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{{ runAsCloudJob ? 'Launch Cloud Job' : 'Execute' }}</span>
            </button>
          </div>
        </form>

        <!-- Terminal Output Window (Fixed Height with Vertical & Horizontal Scroll) -->
        <div class="rounded-[16px] overflow-hidden border border-black/20 shadow-lg bg-[#0D1117] text-gray-200 flex flex-col">
          <div class="flex items-center justify-between px-5 py-3 bg-[#161B22] border-b border-white/10 flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-green-500/80"></span>
              </div>
              <span class="font-mono text-xs text-gray-400">Terminal Output</span>
              <span v-if="lastCommand" class="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-[#82FFE0] truncate max-w-[280px] sm:max-w-md">
                php artisan {{ lastCommand }}
              </span>
            </div>

            <div class="flex items-center gap-3">
              <span
                v-if="exitCode !== null"
                :class="[
                  'text-[11px] font-mono px-2.5 py-0.5 rounded font-bold',
                  exitCode === 0 ? 'bg-green-900/60 text-green-300 border border-green-500/40' : 'bg-red-900/60 text-red-300 border border-red-500/40'
                ]"
              >
                Exit: {{ exitCode }} ({{ durationMs }}ms)
              </span>
              <button
                type="button"
                @click="copyOutput"
                class="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition cursor-pointer"
              >
                Copy
              </button>
              <button
                type="button"
                @click="terminalOutput = ''"
                class="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <!-- Fixed Height Scrollable Output Body -->
          <div
            ref="terminalBodyRef"
            class="p-6 font-mono text-xs text-gray-300 overflow-y-auto overflow-x-auto h-[440px] max-h-[440px] leading-relaxed whitespace-pre select-text bg-[#070709] custom-terminal-scrollbar"
          >
            <div v-if="executingCommand" class="flex items-center gap-3 text-yellow-400 animate-pulse">
              <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Executing Artisan command on environment...</span>
            </div>
            <div v-else-if="!terminalOutput" class="text-gray-500 italic">
              No command executed yet. Choose a quick action above or type a custom command.
            </div>
            <div v-else>{{ terminalOutput }}</div>
          </div>
        </div>
      </div>

      <!-- TAB 2: TINKER & DATABASE SQL EDITOR (NEW) -->
      <div
        v-else-if="activeTab === 'tinker'"
        :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'"
        class="rounded-[20px] border shadow-sm p-6 sm:p-8 space-y-6 w-full max-w-full min-w-0 overflow-hidden"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <h2 class="text-[20px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">
              Tinker & Database SQL Console
            </h2>
            <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">
              Execute PHP Eloquent / Tinker code or direct PostgreSQL queries across central and tenant schemas.
            </p>
          </div>

          <!-- Mode Selector Pill -->
          <div
            :class="isDark ? 'bg-black/40 border-white/10' : 'bg-gray-100 border-gray-200'"
            class="inline-flex items-center p-1 rounded-[10px] border flex-shrink-0"
          >
            <button
              type="button"
              @click="tinkerMode = 'tinker'"
              class="px-4 py-1.5 rounded-[8px] text-xs font-medium transition cursor-pointer"
              :class="tinkerMode === 'tinker'
                ? (isDark ? 'bg-[#10FFD4] text-[#004D40] font-bold' : 'bg-white text-[#004D40] shadow-sm font-semibold')
                : (isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900')"
            >
              PHP Tinker
            </button>
            <button
              type="button"
              @click="tinkerMode = 'sql'"
              class="px-4 py-1.5 rounded-[8px] text-xs font-medium transition cursor-pointer"
              :class="tinkerMode === 'sql'
                ? (isDark ? 'bg-[#10FFD4] text-[#004D40] font-bold' : 'bg-white text-[#004D40] shadow-sm font-semibold')
                : (isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900')"
            >
              PostgreSQL Query
            </button>
          </div>
        </div>

        <!-- Schema Selector (when in SQL mode) & Presets -->
        <div class="space-y-3">
          <div v-if="tinkerMode === 'sql'" class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label class="text-[13px] font-medium opacity-80 whitespace-nowrap">Target Database Schema:</label>
            <select
              v-model="targetSchema"
              class="h-[38px] px-3 rounded-[8px] border outline-none font-mono text-xs cursor-pointer max-w-full"
              :class="isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-[#04C18F33] text-[#1a1a1a]'"
            >
              <optgroup label="Central Schemas">
                <option value="public">public</option>
                <option value="taxaid">taxaid</option>
                <option value="user_auth">user_auth</option>
                <option value="shared">shared</option>
                <option value="partner">partner</option>
                <option value="payment">payment</option>
                <option value="ai">ai</option>
              </optgroup>
              <optgroup label="Tenant Schemas" v-if="tenants.length">
                <option v-for="t in tenants" :key="t.id" :value="t.schema_name">
                  {{ t.schema_name }} ({{ t.company_legal_name }})
                </option>
              </optgroup>
            </select>
          </div>

          <!-- Quick Presets -->
          <div class="space-y-1.5">
            <div class="text-[12px] font-medium opacity-70">Quick Snippets:</div>
            <div v-if="loadingCommands" class="flex flex-wrap gap-2 animate-pulse">
              <div v-for="i in 4" :key="i" class="h-6 w-28 rounded bg-gray-200 dark:bg-white/5"></div>
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <button
                v-for="snippet in (tinkerMode === 'tinker' ? tinkerSnippets : sqlSnippets)"
                :key="snippet.label"
                type="button"
                @click="tinkerInput = snippet.code"
                class="px-2.5 py-1 rounded-[6px] border text-xs font-mono transition cursor-pointer"
                :class="isDark ? 'bg-black/30 border-white/10 text-white/70 hover:text-white hover:border-[#10FFD4]/40' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-[#004D40]'"
              >
                {{ snippet.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Code Input Area -->
        <div class="space-y-2">
          <div class="flex items-center justify-between flex-wrap gap-3">
            <label class="text-[13px] font-medium opacity-80">
              {{ tinkerMode === 'tinker' ? 'PHP Tinker Code (e.g. Eloquent / DB facade)' : 'PostgreSQL Query (SELECT, UPDATE, INSERT, ALTER)' }}
            </label>
            <label v-if="tinkerMode === 'tinker'" class="inline-flex items-center gap-2.5 cursor-pointer select-none">
              <div class="relative inline-flex items-center">
                <input
                  type="checkbox"
                  v-model="runAsCloudJob"
                  class="sr-only"
                />
                <div
                  class="w-10 h-5 rounded-full transition-colors duration-200 ease-in-out border flex items-center px-0.5"
                  :class="runAsCloudJob
                    ? (isDark ? 'bg-[#10FFD4] border-[#10FFD4]' : 'bg-[#007C65] border-[#007C65]')
                    : (isDark ? 'bg-black/70 border-white/40' : 'bg-gray-200 border-gray-400')"
                >
                  <div
                    class="w-3.5 h-3.5 rounded-full transition-transform duration-200 ease-in-out shadow-sm"
                    :class="[
                      runAsCloudJob ? 'translate-x-5' : 'translate-x-0',
                      runAsCloudJob
                        ? (isDark ? 'bg-[#004D40]' : 'bg-white')
                        : (isDark ? 'bg-white' : 'bg-gray-500')
                    ]"
                  ></div>
                </div>
              </div>
              <span
                class="text-xs transition-colors"
                :class="runAsCloudJob
                  ? (isDark ? 'text-[#10FFD4] font-semibold' : 'text-[#007C65] font-semibold')
                  : (isDark ? 'text-white/80 font-medium' : 'text-gray-700 font-medium')"
              >
                Run as Cloud Run Job (Async)
              </span>
            </label>
          </div>

          <textarea
            v-model="tinkerInput"
            rows="6"
            :placeholder="tinkerMode === 'tinker' ? 'App\\Models\\User::count();' : 'SELECT * FROM users LIMIT 10;'"
            class="w-full max-w-full p-4 rounded-[12px] border outline-none font-mono text-xs leading-relaxed transition"
            :class="isDark ? 'bg-black/50 border-white/10 text-emerald-300 focus:border-[#10FFD4]' : 'bg-gray-900 border-gray-700 text-emerald-300 focus:border-[#00896F]'"
          ></textarea>

          <div class="flex justify-end items-center pt-1 flex-wrap gap-3">
            <button
              type="button"
              @click="handleRunTinkerOrSql"
              :disabled="executingTinker || !tinkerInput.trim()"
              class="h-[42px] w-[215px] min-w-[215px] rounded-[10px] bg-[#007C65] hover:bg-[#006552] disabled:opacity-50 text-white font-medium text-[14px] transition flex items-center justify-center gap-2 cursor-pointer shadow-sm flex-shrink-0"
            >
              <svg v-if="executingTinker" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{{ tinkerMode === 'tinker' && runAsCloudJob ? 'Launch Tinker Cloud Job' : ('Execute ' + (tinkerMode === 'tinker' ? 'Tinker Code' : 'SQL Query')) }}</span>
            </button>
          </div>
        </div>

        <!-- Tinker & SQL Result Terminal -->
        <div class="rounded-[16px] overflow-hidden border border-black/20 shadow-lg bg-[#0D1117] text-gray-200 flex flex-col w-full max-w-full min-w-0">
          <div class="flex items-center justify-between px-5 py-3 bg-[#161B22] border-b border-white/10 flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-green-500/80"></span>
              </div>
              <span class="font-mono text-xs text-gray-400">Result Output</span>
              <span v-if="tinkerDurationMs > 0" class="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-[#82FFE0]">
                {{ tinkerDurationMs }}ms
              </span>
            </div>

            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="copyTinkerOutput"
                class="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition cursor-pointer"
              >
                Copy
              </button>
              <button
                type="button"
                @click="tinkerResult = ''"
                class="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <div
            class="p-6 font-mono text-xs text-gray-300 overflow-y-auto overflow-x-auto h-[380px] max-h-[380px] leading-relaxed whitespace-pre select-text bg-[#070709] custom-terminal-scrollbar w-full max-w-full min-w-0"
          >
            <div v-if="executingTinker" class="flex items-center gap-3 text-yellow-400 animate-pulse">
              <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Executing {{ tinkerMode === 'tinker' ? 'Tinker snippet' : 'PostgreSQL statement' }} on Cloud Run...</span>
            </div>
            <div v-else-if="!tinkerResult" class="text-gray-500 italic">
              No results yet. Enter a code snippet or SQL statement above and click Execute.
            </div>
            <div v-else>{{ tinkerResult }}</div>
          </div>
        </div>
      </div>

      <!-- TAB 3: FIREBASE FCM TESTER -->
      <div
        v-else-if="activeTab === 'firebase'"
        :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'"
        class="rounded-[20px] border shadow-sm p-6 sm:p-8 space-y-6 w-full max-w-full min-w-0 overflow-hidden"
      >
        <div class="space-y-1">
          <h2 class="text-[20px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">
            Firebase FCM Push Notification Tester
          </h2>
          <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">
            Dispatch test push notifications directly to tenant users or specific device tokens.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-4">
            <!-- Target Mode -->
            <div>
              <label class="block text-[13px] font-medium opacity-80 mb-2">Target Type</label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  @click="fcmForm.target_type = 'tenant_user'"
                  :class="[
                    'p-3 rounded-[12px] border text-left transition text-xs',
                    fcmForm.target_type === 'tenant_user'
                      ? (isDark ? 'border-[#10FFD4] bg-[#10FFD4]/10 text-white' : 'border-[#00896F] bg-[#E6FFF3] text-[#004D40] font-semibold')
                      : (isDark ? 'border-white/10 bg-black/30 text-white/70' : 'border-gray-200 bg-white text-gray-600')
                  ]"
                >
                  <div class="font-medium">Tenant User</div>
                  <div class="text-[10px] opacity-70 mt-0.5">Select specific user</div>
                </button>

                <button
                  type="button"
                  @click="fcmForm.target_type = 'tenant_all'"
                  :class="[
                    'p-3 rounded-[12px] border text-left transition text-xs',
                    fcmForm.target_type === 'tenant_all'
                      ? (isDark ? 'border-[#10FFD4] bg-[#10FFD4]/10 text-white' : 'border-[#00896F] bg-[#E6FFF3] text-[#004D40] font-semibold')
                      : (isDark ? 'border-white/10 bg-black/30 text-white/70' : 'border-gray-200 bg-white text-gray-600')
                  ]"
                >
                  <div class="font-medium">All Users</div>
                  <div class="text-[10px] opacity-70 mt-0.5">Broadcast to tenant</div>
                </button>

                <button
                  type="button"
                  @click="fcmForm.target_type = 'direct_token'"
                  :class="[
                    'p-3 rounded-[12px] border text-left transition text-xs',
                    fcmForm.target_type === 'direct_token'
                      ? (isDark ? 'border-[#10FFD4] bg-[#10FFD4]/10 text-white' : 'border-[#00896F] bg-[#E6FFF3] text-[#004D40] font-semibold')
                      : (isDark ? 'border-white/10 bg-black/30 text-white/70' : 'border-gray-200 bg-white text-gray-600')
                  ]"
                >
                  <div class="font-medium">Direct Token</div>
                  <div class="text-[10px] opacity-70 mt-0.5">Raw FCM token</div>
                </button>
              </div>
            </div>

            <!-- Tenant & User dropdowns -->
            <div v-if="fcmForm.target_type !== 'direct_token'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[13px] font-medium opacity-80 mb-1.5">Tenant Organization</label>
                <select
                  v-model="fcmForm.tenant_id"
                  @change="onTenantSelected"
                  class="w-full h-[42px] px-3.5 rounded-[10px] border outline-none text-[13px] cursor-pointer"
                  :class="isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-[#04C18F33] text-[#1a1a1a]'"
                >
                  <option v-for="t in tenants" :key="t.id" :value="t.id">
                    {{ t.company_legal_name }} ({{ t.schema_name }})
                  </option>
                </select>
              </div>

              <div v-if="fcmForm.target_type === 'tenant_user'">
                <label class="block text-[13px] font-medium opacity-80 mb-1.5">Select User</label>
                <select
                  v-model="fcmForm.user_id"
                  :disabled="!selectedTenantUsers.length"
                  class="w-full h-[42px] px-3.5 rounded-[10px] border outline-none text-[13px] disabled:opacity-50"
                  :class="isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-[#04C18F33] text-[#1a1a1a]'"
                >
                  <option value="" disabled>-- Select User --</option>
                  <option v-for="u in selectedTenantUsers" :key="u.id" :value="u.id">
                    {{ u.name }} ({{ u.email }}) — {{ u.token_count }} token(s)
                  </option>
                </select>
              </div>
            </div>

            <div v-if="fcmForm.target_type === 'direct_token'">
              <label class="block text-[13px] font-medium opacity-80 mb-1.5">Device Token</label>
              <textarea
                v-model="fcmForm.token"
                rows="2"
                placeholder="Paste raw FCM registration token"
                class="w-full p-3 rounded-[10px] border font-mono text-xs outline-none"
                :class="isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-[#04C18F33] text-[#1a1a1a]'"
              ></textarea>
            </div>

            <!-- Payload Details -->
            <div>
              <label class="block text-[13px] font-medium opacity-80 mb-1.5">Notification Title</label>
              <input
                v-model="fcmForm.title"
                type="text"
                placeholder="e.g. Tax Filing Reminder"
                class="w-full h-[42px] px-3.5 rounded-[10px] border outline-none text-[13px]"
                :class="isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-[#04C18F33] text-[#1a1a1a]'"
              />
            </div>

            <div>
              <label class="block text-[13px] font-medium opacity-80 mb-1.5">Notification Body</label>
              <textarea
                v-model="fcmForm.body"
                rows="2"
                placeholder="e.g. Your VAT return submission is due in 3 days."
                class="w-full p-3 rounded-[10px] border text-[13px] outline-none"
                :class="isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-[#04C18F33] text-[#1a1a1a]'"
              ></textarea>
            </div>

            <div>
              <label class="block text-[13px] font-medium opacity-80 mb-1.5">Click Target Link</label>
              <input
                v-model="fcmForm.target_link"
                type="text"
                placeholder="e.g. /alerts"
                class="w-full h-[42px] px-3.5 rounded-[10px] border outline-none font-mono text-[13px]"
                :class="isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-[#04C18F33] text-[#1a1a1a]'"
              />
            </div>

            <button
              @click="sendTestNotification"
              :disabled="sendingFcm"
              class="h-[44px] px-6 rounded-[10px] bg-[#007C65] hover:bg-[#006552] disabled:opacity-50 text-white font-medium text-[14px] transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <svg v-if="sendingFcm" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Dispatch Push Notification</span>
            </button>
          </div>

          <!-- Report Box -->
          <div
            class="rounded-[16px] p-6 border space-y-4 min-w-0"
            :class="isDark ? 'bg-black/30 border-white/10' : 'bg-gray-50 border-gray-200'"
          >
            <h4 class="text-[14px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">
              Delivery Result
            </h4>

            <div v-if="!fcmReport" class="text-xs opacity-60 italic text-center py-8">
              Configure parameters on the left and click Dispatch to test delivery.
            </div>

            <div v-else class="space-y-3">
              <div
                class="p-4 rounded-[10px] text-xs"
                :class="fcmReport.success ? 'bg-green-100 text-green-900 border border-green-300' : 'bg-red-100 text-red-900 border border-red-300'"
              >
                <div class="font-bold">{{ fcmReport.message || (fcmReport.success ? 'Delivered' : 'Failed') }}</div>
                <div v-if="fcmReport.total_targeted" class="text-[11px] opacity-80 mt-1">
                  Targeted: {{ fcmReport.total_targeted }} | Succeeded: {{ fcmReport.success_count }} | Failed: {{ fcmReport.failure_count }}
                </div>
                <div v-if="fcmReport.error" class="font-mono text-[11px] mt-2 whitespace-pre-wrap break-all">
                  {{ fcmReport.error }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: MAILER / SMTP TESTER -->
      <div
        v-else-if="activeTab === 'mail'"
        :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'"
        class="rounded-[20px] border shadow-sm p-6 sm:p-8 space-y-6 w-full max-w-full min-w-0 overflow-hidden"
      >
        <div class="space-y-1">
          <h2 class="text-[20px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">
            SMTP & Mailer Tester
          </h2>
          <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">
            Send real test emails to verify transport, credentials, and SMTP deliverability.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-4">
            <div>
              <label class="block text-[13px] font-medium opacity-80 mb-1.5">Recipient Email Address</label>
              <input
                v-model="mailForm.to_email"
                type="email"
                placeholder="your-email@domain.com"
                class="w-full h-[42px] px-3.5 rounded-[10px] border outline-none text-[13px]"
                :class="isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-[#04C18F33] text-[#1a1a1a]'"
              />
            </div>

            <div>
              <label class="block text-[13px] font-medium opacity-80 mb-1.5">Subject</label>
              <input
                v-model="mailForm.subject"
                type="text"
                placeholder="[TaxAid Test] Root Console Mailer Verification"
                class="w-full h-[42px] px-3.5 rounded-[10px] border outline-none text-[13px]"
                :class="isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-[#04C18F33] text-[#1a1a1a]'"
              />
            </div>

            <div>
              <label class="block text-[13px] font-medium opacity-80 mb-1.5">Message Body</label>
              <textarea
                v-model="mailForm.body"
                rows="3"
                placeholder="Hello! This is a test email verifying that the SMTP configuration is functional on Cloud Run."
                class="w-full p-3 rounded-[10px] border text-[13px] outline-none"
                :class="isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-[#04C18F33] text-[#1a1a1a]'"
              ></textarea>
            </div>

            <button
              @click="sendTestMail"
              :disabled="sendingMail || !mailForm.to_email"
              class="h-[44px] px-6 rounded-[10px] bg-[#007C65] hover:bg-[#006552] disabled:opacity-50 text-white font-medium text-[14px] transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <svg v-if="sendingMail" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Send Test Email</span>
            </button>
          </div>

          <!-- Mailer Info & Result Box -->
          <div
            class="rounded-[16px] p-6 border space-y-4 min-w-0"
            :class="isDark ? 'bg-black/30 border-white/10' : 'bg-gray-50 border-gray-200'"
          >
            <h4 class="text-[14px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">
              SMTP Configuration
            </h4>

            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span class="opacity-70">Mailer:</span>
                <span class="font-bold">{{ systemInfo?.mail?.default_mailer || 'smtp' }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span class="opacity-70">Host:</span>
                <span>{{ systemInfo?.mail?.host || 'mailhost' }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span class="opacity-70">Port:</span>
                <span>{{ systemInfo?.mail?.port }}:{{ systemInfo?.mail?.encryption || 'tls' }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span class="opacity-70">From:</span>
                <span class="text-[11px] truncate max-w-[150px]">{{ systemInfo?.mail?.from_address || 'noreply' }}</span>
              </div>
            </div>

            <div
              v-if="mailReport"
              class="p-4 rounded-[10px] text-xs"
              :class="mailReport.success ? 'bg-green-100 text-green-900 border border-green-300' : 'bg-red-100 text-red-900 border border-red-300'"
            >
              <div class="font-bold">{{ mailReport.message || (mailReport.success ? 'Sent Successfully' : 'Failed') }}</div>
              <div v-if="mailReport.error" class="font-mono text-[11px] mt-1 whitespace-pre-wrap break-all">
                {{ mailReport.error }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 5: CORS & ENVIRONMENT DIAGNOSTICS -->
      <div
        v-else-if="activeTab === 'diagnostics'"
        :class="isDark ? 'bg-[#00141080] border-white/10' : 'bg-white border-[#E5E5E5]'"
        class="rounded-[20px] border shadow-sm p-6 sm:p-8 space-y-6 w-full max-w-full min-w-0 overflow-hidden"
      >
        <div class="space-y-1">
          <h2 class="text-[20px] font-semibold text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">
            System & CORS Diagnostics
          </h2>
          <p class="text-[14px] text-[#00000080]" :class="isDark ? 'text-white/60' : ''">
            Live infrastructure diagnostics for GCP Cloud Run, Cloud SQL, and CORS origin policy.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Runtime -->
          <div class="rounded-[16px] p-6 border space-y-3 font-mono text-xs" :class="isDark ? 'bg-black/30 border-white/10' : 'bg-gray-50 border-gray-200'">
            <h4 class="text-[14px] font-semibold font-sans text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Environment</h4>
            <div class="space-y-2">
              <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span class="opacity-70">App Env:</span>
                <span class="font-bold uppercase">{{ systemInfo?.environment?.app_env }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span class="opacity-70">PHP Version:</span>
                <span>{{ systemInfo?.environment?.php_version }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span class="opacity-70">Laravel:</span>
                <span>{{ systemInfo?.environment?.laravel_version }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span class="opacity-70">Timezone:</span>
                <span>{{ systemInfo?.environment?.timezone }}</span>
              </div>
            </div>
          </div>

          <!-- Database -->
          <div class="rounded-[16px] p-6 border space-y-3 font-mono text-xs" :class="isDark ? 'bg-black/30 border-white/10' : 'bg-gray-50 border-gray-200'">
            <h4 class="text-[14px] font-semibold font-sans text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">Database & Cache</h4>
            <div class="space-y-2">
              <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span class="opacity-70">DB Status:</span>
                <span class="text-green-600 dark:text-green-400 font-bold">{{ systemInfo?.database?.status }} ({{ systemInfo?.database?.latency_ms }}ms)</span>
              </div>
              <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span class="opacity-70">DB Driver:</span>
                <span>{{ systemInfo?.database?.default_connection }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span class="opacity-70">DB Name:</span>
                <span>{{ systemInfo?.database?.database }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span class="opacity-70">Cache Store:</span>
                <span class="text-green-600 dark:text-green-400 font-bold">{{ systemInfo?.cache?.status }} ({{ systemInfo?.cache?.default_store }})</span>
              </div>
            </div>
          </div>

          <!-- Cloud Services ADC -->
          <div class="rounded-[16px] p-6 border space-y-3 font-mono text-xs" :class="isDark ? 'bg-black/30 border-white/10' : 'bg-gray-50 border-gray-200'">
            <h4 class="text-[14px] font-semibold font-sans text-[#004D40]" :class="isDark ? 'text-[#10FFD4]' : ''">GCP Auth (ADC)</h4>
            <div class="space-y-2">
              <div class="py-1 border-b border-black/5 dark:border-white/5">
                <div class="flex justify-between">
                  <span class="opacity-70">GCS Bucket:</span>
                  <span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ systemInfo?.cloud_services?.gcs?.auth_mode }}</span>
                </div>
                <div class="text-[11px] opacity-60 mt-0.5">{{ systemInfo?.cloud_services?.gcs?.bucket }}</div>
              </div>

              <div class="py-1 border-b border-black/5 dark:border-white/5">
                <div class="flex justify-between">
                  <span class="opacity-70">Vertex AI:</span>
                  <span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ systemInfo?.cloud_services?.vertex_ai?.auth_mode }}</span>
                </div>
                <div class="text-[11px] opacity-60 mt-0.5">Location: {{ systemInfo?.cloud_services?.vertex_ai?.location }}</div>
              </div>

              <div class="py-1 border-b border-black/5 dark:border-white/5">
                <div class="flex justify-between">
                  <span class="opacity-70">Firebase FCM:</span>
                  <span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ systemInfo?.cloud_services?.firebase?.auth_mode }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CORS Origin list -->
        <div class="space-y-2">
          <label class="block text-[13px] font-medium opacity-80">Active CORS Allowed Origins</label>
          <div class="flex flex-wrap gap-2 max-w-full">
            <span
              v-for="origin in (systemInfo?.cors?.allowed_origins || [])"
              :key="origin"
              class="px-3.5 py-1.5 rounded-[8px] border font-mono text-xs text-emerald-700 dark:text-emerald-300 break-all max-w-full"
              :class="isDark ? 'bg-black/30 border-white/10' : 'bg-gray-50 border-gray-200'"
            >
              {{ origin }}
            </span>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
const { isDark } = useTheme()
const { isRootUnlocked, runArtisan, runTinker, getJobStatus, runDbQuery, getTenants, testFirebase, testMail, getSystemInfo, getCommands, lock } = useRootAdmin()
const { admin } = useAdminAuth()

onMounted(() => {
  if (admin.value?.role?.name !== 'Super Admin' || !isRootUnlocked.value) {
    navigateTo('/admin')
  }
  refreshSystemInfo()
  loadTenantsList()
  loadCommandsCatalog()
})

const activeTab = ref('artisan')
const tabs = [
  { id: 'artisan', label: 'Artisan Commands' },
  { id: 'tinker', label: 'Tinker & Database Editor' },
  { id: 'firebase', label: 'Firebase Push Tester' },
  { id: 'mail', label: 'Mailer / SMTP Tester' },
  { id: 'diagnostics', label: 'CORS & Environment' },
]

// CLOUD RUN JOB TOGGLE STATE
const runAsCloudJob = ref(false)
let jobPollTimer = null

onUnmounted(() => {
  if (jobPollTimer) {
    clearInterval(jobPollTimer)
  }
})

// Command Classification Tiers:
function isBlacklistedArtisan(cmd) {
  const lower = cmd.trim().toLowerCase()
  const blacklist = ['migrate:fresh', 'migrate:reset', 'db:wipe', 'schema:drop']
  return blacklist.some(b => lower.includes(b)) || (lower.startsWith('central:fresh') && !lower.includes('--fix'))
}

// 1. ARTISAN STATE
const customCommand = ref('')
const terminalOutput = ref('')
const lastCommand = ref('')
const exitCode = ref(null)
const durationMs = ref(0)
const executingCommand = ref(false)
const terminalBodyRef = ref(null)
const loadingCommands = ref(false)
const commandGroups = ref([])

async function loadCommandsCatalog() {
  loadingCommands.value = true
  try {
    const res = await getCommands()
    if (res?.groups) {
      commandGroups.value = res.groups
    }
  } catch (err) {
    console.error('Failed to load dynamic artisan commands catalog', err)
  } finally {
    loadingCommands.value = false
  }
}

async function executeArtisan(cmd) {
  if (!cmd || executingCommand.value) return

  if (isBlacklistedArtisan(cmd)) {
    lastCommand.value = cmd
    terminalOutput.value = `[BLACKLISTED COMMAND]\nThe command '${cmd}' is a complete database wipe/drop operation. It is locked from the Web Console and must be executed directly on the database server CLI.`
    exitCode.value = 1
    durationMs.value = 0
    return
  }

  await executeArtisanInternal(cmd)
}

async function executeArtisanInternal(cmd) {
  executingCommand.value = true
  lastCommand.value = cmd
  exitCode.value = null

  if (jobPollTimer) {
    clearInterval(jobPollTimer)
    jobPollTimer = null
  }

  try {
    if (runAsCloudJob.value) {
      const res = await runArtisan(cmd, undefined, true)
      const jobId = res.job_id
      const modeLabel = res.mode === 'cloud_run_job' ? 'Google Cloud Run Job (On-Demand Instance)' : 'Local Background Async Runner'

      terminalOutput.value = `[ASYNC JOB DISPATCHED]\n` +
        `Job ID:       ${jobId}\n` +
        `Runner Mode:  ${modeLabel}\n` +
        `Status:       RUNNING (Instance Active)\n` +
        `Started At:   ${res.started_at || new Date().toISOString()}\n` +
        (res.logs_url ? `GCP Logs:     ${res.logs_url}\n` : '') +
        `\n------------------------------------------------------------\n` +
        `Execution running in background. No 5-minute HTTP timeout.\n` +
        `Instance will terminate automatically upon completion.\n` +
        `Polling status...\n`

      // Poll status every 2 seconds
      jobPollTimer = setInterval(async () => {
        try {
          const pollRes = await getJobStatus(jobId)
          if (pollRes?.status === 'completed' || pollRes?.status === 'failed') {
            clearInterval(jobPollTimer)
            jobPollTimer = null
            executingCommand.value = false
            exitCode.value = pollRes.exit_code
            durationMs.value = pollRes.duration_ms || 0
            terminalOutput.value = `[ASYNC JOB COMPLETED: ${pollRes.status.toUpperCase()}]\n` +
              `Job ID:       ${jobId}\n` +
              `Exit Code:    ${pollRes.exit_code}\n` +
              `Duration:     ${pollRes.duration_ms || 0}ms\n` +
              `Finished:     ${pollRes.finished_at || new Date().toISOString()}\n` +
              `\n------------------- [OUTPUT] -------------------\n` +
              (pollRes.output || '(No output returned)')
          }
        } catch (pollErr) {
          console.error('Job polling error', pollErr)
        }
      }, 2000)
    } else {
      const res = await runArtisan(cmd)
      terminalOutput.value = res.output || '(No output returned)'
      exitCode.value = res.exit_code
      durationMs.value = res.duration_ms
      executingCommand.value = false
    }

    nextTick(() => {
      if (terminalBodyRef.value) {
        terminalBodyRef.value.scrollTop = 0
      }
    })
  } catch (err) {
    terminalOutput.value = err?.data?.output || err?.data?.message || err?.message || 'Execution error'
    exitCode.value = 1
    executingCommand.value = false
    throw err
  }
}

function copyOutput() {
  if (terminalOutput.value && process.client) {
    navigator.clipboard.writeText(terminalOutput.value)
    alert('Terminal output copied to clipboard!')
  }
}

// 2. TINKER & SQL STATE
const tinkerMode = ref('tinker')
const targetSchema = ref('taxaid')
const tinkerInput = ref('App\\Models\\Tenant::with("organization")->get();')
const tinkerResult = ref('')
const tinkerDurationMs = ref(0)
const executingTinker = ref(false)

const tinkerSnippets = [
  { label: 'Count Organizations', code: 'App\\Models\\Organization::count();' },
  { label: 'List Tenants', code: 'App\\Models\\Tenant::select("id", "company_legal_name", "schema_name")->get();' },
  { label: 'Count Admins', code: 'App\\Models\\Admin::count();' },
  { label: 'DB Version & Connection', code: 'DB::connection()->getPdo()->getAttribute(PDO::ATTR_SERVER_VERSION);' },
]

const sqlSnippets = [
  { label: 'Select Admins', code: 'SELECT id, first_name, last_name, email, role_id FROM taxaid.admins LIMIT 10;' },
  { label: 'Count Users (Schema)', code: 'SELECT count(*) FROM users;' },
  { label: 'View Schema Tables', code: 'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema();' },
  { label: 'Migration Tracking', code: 'SELECT * FROM migrations ORDER BY id DESC LIMIT 10;' },
]

async function handleRunTinkerOrSql() {
  if (!tinkerInput.value.trim() || executingTinker.value) return
  await executeTinkerOrSqlInternal()
}

async function executeTinkerOrSqlInternal() {
  executingTinker.value = true

  try {
    if (tinkerMode.value === 'tinker') {
      if (runAsCloudJob.value) {
        const res = await runTinker(tinkerInput.value.trim(), undefined, true)
        const jobId = res.job_id
        tinkerResult.value = `[TINKER CLOUD JOB DISPATCHED]\nJob ID: ${jobId}\nStatus: Running on on-demand worker...\n\nPolling background output...`

        const pollTimer = setInterval(async () => {
          try {
            const pollRes = await getJobStatus(jobId)
            if (pollRes?.status === 'completed' || pollRes?.status === 'failed') {
              clearInterval(pollTimer)
              executingTinker.value = false
              tinkerDurationMs.value = pollRes.duration_ms || 0
              tinkerResult.value = pollRes.output || '(Execution finished with no output)'
            }
          } catch (pe) {
            console.error('Tinker poll error', pe)
          }
        }, 2000)
      } else {
        const res = await runTinker(tinkerInput.value.trim())
        tinkerResult.value = res.output || '(Execution completed with no return value)'
        tinkerDurationMs.value = res.duration_ms
        executingTinker.value = false
      }
    } else {
      const res = await runDbQuery(tinkerInput.value.trim(), targetSchema.value)
      tinkerResult.value = res.output || JSON.stringify(res.results || res, null, 2)
      tinkerDurationMs.value = res.duration_ms
      executingTinker.value = false
    }
  } catch (err) {
    tinkerResult.value = err?.data?.output || err?.data?.message || err?.message || 'Execution error'
    executingTinker.value = false
    throw err
  }
}

function copyTinkerOutput() {
  if (tinkerResult.value && process.client) {
    navigator.clipboard.writeText(tinkerResult.value)
    alert('Result copied to clipboard!')
  }
}

// 2. FIREBASE STATE
const tenants = ref([])
const sendingFcm = ref(false)
const fcmReport = ref(null)
const fcmForm = ref({
  target_type: 'tenant_user',
  tenant_id: '',
  user_id: '',
  token: '',
  title: 'Tax Deadline Alert',
  body: 'This is a test notification dispatched from the Super Admin Root Console.',
  target_link: '/alerts',
})

const selectedTenantUsers = computed(() => {
  const t = tenants.value.find(item => item.id == fcmForm.value.tenant_id)
  return t?.users || []
})

function onTenantSelected() {
  fcmForm.value.user_id = ''
}

async function loadTenantsList() {
  try {
    const res = await getTenants()
    if (res?.tenants) {
      tenants.value = res.tenants
      if (res.tenants.length && !fcmForm.value.tenant_id) {
        fcmForm.value.tenant_id = res.tenants[0].id
      }
    }
  } catch (err) {
    console.error('Failed to load tenants list', err)
  }
}

async function sendTestNotification() {
  sendingFcm.value = true
  fcmReport.value = null
  try {
    const payload = {
      target_type: fcmForm.value.target_type,
      tenant_id: fcmForm.value.tenant_id,
      user_id: fcmForm.value.user_id,
      token: fcmForm.value.token,
      title: fcmForm.value.title,
      body: fcmForm.value.body,
      data: { target: fcmForm.value.target_link },
    }
    const res = await testFirebase(payload)
    fcmReport.value = res
  } catch (err) {
    fcmReport.value = {
      success: false,
      error: err?.data?.message || err?.message || 'Failed to dispatch FCM notification',
    }
  } finally {
    sendingFcm.value = false
  }
}

// 3. MAILER STATE
const sendingMail = ref(false)
const mailReport = ref(null)
const mailForm = ref({
  to_email: '',
  subject: '[TaxAid Test] Root Console Mailer Verification',
  body: 'Hello!\n\nThis is a test email verifying that the SMTP configuration is functional on Cloud Run.\nSent from Root Super Admin Console.',
})

async function sendTestMail() {
  sendingMail.value = true
  mailReport.value = null
  try {
    const res = await testMail(mailForm.value)
    mailReport.value = res
  } catch (err) {
    mailReport.value = {
      success: false,
      error: err?.data?.error || err?.data?.message || err?.message || 'Failed to send test email',
    }
  } finally {
    sendingMail.value = false
  }
}

// 4. DIAGNOSTICS & METRICS STATE
const systemInfo = ref(null)
const loadingInfo = ref(false)

const statCards = computed(() => [
  {
    title: 'Environment',
    value: systemInfo.value?.environment?.app_env?.toUpperCase() || 'LOCAL',
    subtitle: `PHP ${systemInfo.value?.environment?.php_version || '8.2+'} • Laravel ${systemInfo.value?.environment?.laravel_version || '12'}`,
    textClass: 'text-[#004D40]',
  },
  {
    title: 'Database (Cloud SQL)',
    value: systemInfo.value?.database?.status === 'OK' ? 'Connected' : 'Offline',
    subtitle: `${systemInfo.value?.database?.default_connection || 'pgsql'} (${systemInfo.value?.database?.latency_ms || 0}ms latency)`,
    textClass: systemInfo.value?.database?.status === 'OK' ? 'text-[#007C65]' : 'text-red-500',
  },
  {
    title: 'Active Tenants',
    value: `${tenants.value.length || 0}`,
    subtitle: 'Registered client organizations',
    textClass: 'text-[#004D40]',
  },
  {
    title: 'Cloud Services (ADC)',
    value: systemInfo.value?.cloud_services?.gcs?.auth_mode || 'Active',
    subtitle: 'Keyless Service Account Mode',
    textClass: 'text-[#007C65]',
  },
])

async function refreshSystemInfo() {
  loadingInfo.value = true
  try {
    systemInfo.value = await getSystemInfo()
  } catch (err) {
    console.error('Failed to fetch system info', err)
  } finally {
    loadingInfo.value = false
  }
}

function handleLock() {
  lock()
  navigateTo('/admin')
}
</script>

<style scoped>
.custom-terminal-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-terminal-scrollbar::-webkit-scrollbar-track {
  background: #0d1117;
}
.custom-terminal-scrollbar::-webkit-scrollbar-thumb {
  background: #30363d;
  border-radius: 4px;
}
.custom-terminal-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #484f58;
}
</style>
