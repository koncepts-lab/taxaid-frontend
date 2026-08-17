<template>
  <div>
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm">
        <div class="text-gray-500 text-[13px] mb-3 font-medium">Active Subscriptions</div>
        <div class="text-3xl font-semibold text-gray-800">{{ stats.active_subscriptions ?? 0 }}</div>
      </div>
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm">
        <div class="text-gray-500 text-[13px] mb-3 font-medium">Active Plans</div>
        <div class="text-3xl font-semibold text-gray-800">{{ stats.active_plans ?? 0 }}</div>
      </div>
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm">
        <div class="text-gray-500 text-[13px] mb-3 font-medium">Total Revenue</div>
        <div class="text-3xl font-semibold text-gray-800">{{ formatMoney(stats.total_revenue, 'AED') }}</div>
      </div>
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm">
        <div class="text-gray-500 text-[13px] mb-3 font-medium">Failed Payments</div>
        <div class="text-3xl font-semibold text-gray-800">{{ stats.failed_payments ?? 0 }}</div>
      </div>
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm">
        <div class="text-gray-500 text-[13px] mb-3 font-medium">Draft Plans</div>
        <div class="text-3xl font-semibold text-gray-800">{{ stats.draft_plans ?? 0 }}</div>
      </div>
      <div class="bg-white border border-[#D1FAE5] rounded-[10px] p-5 shadow-sm">
        <div class="text-gray-500 text-[13px] mb-3 font-medium">Org-Specific Plans</div>
        <div class="text-3xl font-semibold text-gray-800">{{ stats.org_specific_plans ?? 0 }}</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-2 text-sm bg-white p-1.5 rounded-full border border-gray-100 shadow-sm w-fit overflow-x-auto mb-6 mt-6">
      <button v-for="t in tabs" :key="t.key" @click="setTab(t.key)"
        :class="activeTab === t.key ? 'bg-[#7DF5D4] text-[#006A56] font-semibold px-8 shadow-sm' : 'text-gray-700 font-medium px-6 hover:bg-gray-50 hover:text-gray-900'"
        class="py-2 rounded-full transition-colors flex text-center whitespace-nowrap">{{ t.label }}</button>
    </div>

    <!-- ═══════════════════════ ALERTS ═══════════════════════ -->
    <div v-if="activeTab === 'alerts'">
      <h2 class="text-[18px] font-medium text-[#013E32] mb-4">Payment Alerts</h2>

      <div class="mb-8">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Failed Payments</h3>
        <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <div class="w-full overflow-x-auto min-h-[600px]">
            <table class="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr class="bg-red-50 text-red-700 text-sm">
                  <th class="py-3 px-6 font-medium">Organization</th>
                  <th class="py-3 px-6 font-medium">Amount</th>
                  <th class="py-3 px-6 font-medium">Date</th>
                  <th class="py-3 px-6 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody class="text-sm text-gray-700">
                <tr v-if="alertsLoading"><td colspan="4" class="py-8 text-center text-gray-400">Loading...</td></tr>
                <tr v-else-if="!alerts.failed_payments.length"><td colspan="4" class="py-8 text-center text-gray-400">No failed payments.</td></tr>
                <tr v-for="p in alerts.failed_payments" :key="p.id" class="border-b border-gray-100">
                  <td class="py-3 px-6">{{ p.organization?.name ?? `Org #${p.organization_id}` }}</td>
                  <td class="py-3 px-6">{{ formatMoney(p.amount_aed, 'AED') }}</td>
                  <td class="py-3 px-6">{{ p.payment_date }}</td>
                  <td class="py-3 px-6">{{ p.failure_reason ?? '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <CommonPaginationBar v-if="failedMeta.total > 0" :meta="failedMeta" :loading="alertsLoading"
            @page-change="goFailedPage" @per-page-change="(pp) => { failedMeta.per_page = pp; loadAlerts() }" />
        </div>
      </div>

      <div class="mb-8">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Cards Expiring Within 30 Days</h3>
        <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <div class="w-full overflow-x-auto min-h-[600px]">
            <table class="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr class="bg-amber-50 text-amber-700 text-sm">
                  <th class="py-3 px-6 font-medium">Organization</th>
                  <th class="py-3 px-6 font-medium">Card</th>
                  <th class="py-3 px-6 font-medium">Expires</th>
                </tr>
              </thead>
              <tbody class="text-sm text-gray-700">
                <tr v-if="alertsLoading"><td colspan="3" class="py-8 text-center text-gray-400">Loading...</td></tr>
                <tr v-else-if="!alerts.expiring_cards.length"><td colspan="3" class="py-8 text-center text-gray-400">No cards expiring soon.</td></tr>
                <tr v-for="c in alerts.expiring_cards" :key="c.id" class="border-b border-gray-100">
                  <td class="py-3 px-6">{{ c.organization?.name ?? `Org #${c.organization_id}` }}</td>
                  <td class="py-3 px-6">{{ c.card_brand ?? 'Card' }} •••• {{ c.card_last4 }}</td>
                  <td class="py-3 px-6">{{ c.card_exp_month }}/{{ c.card_exp_year }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <CommonPaginationBar v-if="expiringMeta.total > 0" :meta="expiringMeta" :loading="alertsLoading"
            @page-change="goExpiringPage" @per-page-change="(pp) => { expiringMeta.per_page = pp; loadAlerts() }" />
        </div>
      </div>

      <div>
        <h3 class="text-sm font-medium text-gray-700 mb-2">Past Grace Period (Suspension Candidates)</h3>
        <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <div class="w-full overflow-x-auto min-h-[600px]">
            <table class="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr class="bg-red-50 text-red-700 text-sm">
                  <th class="py-3 px-6 font-medium">Organization</th>
                  <th class="py-3 px-6 font-medium">Plan</th>
                  <th class="py-3 px-6 font-medium">Grace Period (days)</th>
                </tr>
              </thead>
              <tbody class="text-sm text-gray-700">
                <tr v-if="alertsLoading"><td colspan="3" class="py-8 text-center text-gray-400">Loading...</td></tr>
                <tr v-else-if="!alerts.past_due_subscriptions.length"><td colspan="3" class="py-8 text-center text-gray-400">Nothing past grace period.</td></tr>
                <tr v-for="s in alerts.past_due_subscriptions" :key="s.id" class="border-b border-gray-100">
                  <td class="py-3 px-6">{{ s.organization?.name ?? `Org #${s.organization_id}` }}</td>
                  <td class="py-3 px-6">{{ s.plan_name }}</td>
                  <td class="py-3 px-6">{{ s.dunning_grace_days ?? 'default' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <CommonPaginationBar v-if="pastdueMeta.total > 0" :meta="pastdueMeta" :loading="alertsLoading"
            @page-change="goPastduePage" @per-page-change="(pp) => { pastdueMeta.per_page = pp; loadAlerts() }" />
        </div>
      </div>
    </div>

    <!-- ═══════════════════════ PLANS ═══════════════════════ -->
    <div v-if="activeTab === 'plans'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-[18px] font-medium text-[#013E32]">Plans</h2>
        <button @click="openPlanModal()" class="bg-[#00896F] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#00705a] transition-colors">+ New Plan</button>
      </div>

      <div class="flex items-center gap-3 mb-4">
        <div class="relative min-w-[160px]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          </span>
          <select v-model="planStatusFilter" @change="loadPlans(1)" class="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
        </div>

        <div class="relative min-w-[160px]">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          </span>
          <select v-model="planTypeFilter" @change="loadPlans(1)" class="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#008169] text-sm text-gray-700 appearance-none shadow-sm">
            <option value="">All Types</option>
            <option value="general">General</option>
            <option value="org">Org-Specific</option>
          </select>
          <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
        </div>
      </div>

      <AdminPlanTable :plans="plans" :loading="plansLoading" :meta="plansMeta"
        @view="openPreview" @edit="openVersionModal" @status="(p, s) => changeStatus(p, s, loadPlans)"
        @page-change="(p) => loadPlans(p)" @per-page-change="plansPerPageChange" />
    </div>

    <!-- ═══════════════ ORG-SPECIFIC PLANS (grouped by org) ═══════════════ -->
    <div v-else-if="activeTab === 'org-plans'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-[18px] font-medium text-[#013E32]">Org-Specific Plans</h2>
        <button @click="openAssignModal" class="bg-[#00896F] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#00705a] transition-colors">+ Assign Org-Specific Plan</button>
      </div>
      <p class="text-xs text-gray-400 mb-4">Shows orgs with at least one active org-specific plan. Plans themselves are created in the Plans tab (using the "Organization Specific Plan" toggle); this just links an existing one to an org.</p>

      <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div class="w-full overflow-x-auto min-h-[600px]">
          <table class="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr class="bg-[#008865] text-white text-sm">
                <th class="py-3 px-6 font-medium whitespace-nowrap">Organization</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Active Plans</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-sm text-gray-700">
              <tr v-if="orgPlansLoading"><td colspan="3" class="py-10 text-center text-gray-400">Loading...</td></tr>
              <tr v-else-if="!orgPlanGroups.length"><td colspan="3" class="py-10 text-center text-gray-400">No orgs with an active org-specific plan yet.</td></tr>
              <tr v-for="row in orgPlanGroups" :key="row.organization.id" class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 font-medium text-gray-800">{{ row.organization.name }}</td>
                <td class="py-4 px-6">{{ row.plans.length }} plan{{ row.plans.length === 1 ? '' : 's' }}</td>
                <td class="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                  <button @click="openOrgGroupModal(row)" class="text-gray-500 text-[13px] font-medium hover:underline">View</button>
                  <button @click="openOrgGroupModal(row, true)" class="text-[#007C65] text-[13px] font-medium hover:underline">Config</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CommonPaginationBar v-if="orgPlansMeta.total > 0" :meta="orgPlansMeta" :loading="orgPlansLoading"
          @page-change="(p) => loadOrgPlans(p)" @per-page-change="orgPlansPerPageChange" />
      </div>
    </div>

    <!-- ═══════════════════ SUBSCRIPTIONS ═══════════════════ -->
    <div v-else-if="activeTab === 'subscriptions'">
      <h2 class="text-[18px] font-medium text-[#013E32] mb-4">Subscriptions</h2>
      <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div class="w-full overflow-x-auto min-h-[600px]">
          <table class="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr class="bg-[#008865] text-white text-sm">
                <th class="py-3 px-6 font-medium whitespace-nowrap">Organization</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Plan</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Cycle</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Status</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Dunning Override (days)</th>
              </tr>
            </thead>
            <tbody class="text-sm text-gray-700">
              <tr v-if="subscriptionsLoading"><td colspan="5" class="py-10 text-center text-gray-400">Loading...</td></tr>
              <tr v-else-if="!subscriptions.length"><td colspan="5" class="py-10 text-center text-gray-400">No subscriptions yet.</td></tr>
              <tr v-for="s in subscriptions" :key="s.id" class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 font-medium text-gray-800">{{ s.organization?.name ?? `Org #${s.organization_id}` }}</td>
                <td class="py-4 px-6">{{ s.plan?.name ?? s.plan_name }}</td>
                <td class="py-4 px-6 capitalize">{{ s.billing_cycle }}</td>
                <td class="py-4 px-6 capitalize">{{ s.status }}</td>
                <td class="py-4 px-6">
                  <input type="number" min="0" v-model.number="s.dunning_grace_days" @change="saveDunning(s)"
                    class="w-24 border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-[#00896F]" placeholder="default" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CommonPaginationBar v-if="subscriptionsMeta.total > 0" :meta="subscriptionsMeta" :loading="subscriptionsLoading"
          @page-change="(p) => loadSubscriptions(p)" @per-page-change="subscriptionsPerPageChange" />
      </div>
    </div>

    <!-- ═══════════════════════ PAYMENTS ═══════════════════════ -->
    <div v-else-if="activeTab === 'payments'">
      <h2 class="text-[18px] font-medium text-[#013E32] mb-4">Payments</h2>
      <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div class="w-full overflow-x-auto min-h-[600px]">
          <table class="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr class="bg-[#008865] text-white text-sm">
                <th class="py-3 px-6 font-medium whitespace-nowrap">Organization</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Amount</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Date</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody class="text-sm text-gray-700">
              <tr v-if="paymentsLoading"><td colspan="4" class="py-10 text-center text-gray-400">Loading...</td></tr>
              <tr v-else-if="!payments.length"><td colspan="4" class="py-10 text-center text-gray-400">No payments yet.</td></tr>
              <tr v-for="pay in payments" :key="pay.id" class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 font-medium text-gray-800">{{ pay.organization?.name ?? `Org #${pay.organization_id}` }}</td>
                <td class="py-4 px-6">{{ formatMoney(pay.amount_aed, 'AED') }}</td>
                <td class="py-4 px-6">{{ pay.payment_date }}</td>
                <td class="py-4 px-6 capitalize">
                  <span :class="statusColor(pay.status)" class="rounded-full px-2.5 py-1 text-[13px] font-medium">{{ pay.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CommonPaginationBar v-if="paymentsMeta.total > 0" :meta="paymentsMeta" :loading="paymentsLoading"
          @page-change="(p) => loadPayments(p)" @per-page-change="paymentsPerPageChange" />
      </div>
    </div>

    <!-- ═══════════════════════ SETTINGS ═══════════════════════ -->
    <div v-else-if="activeTab === 'settings'">
      <!-- Entitlement Definitions -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-[18px] font-medium text-[#013E32]">Entitlement Definitions</h2>
        <button @click="openDefinitionModal()" class="bg-[#00896F] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#00705a] transition-colors">+ New Key</button>
      </div>

      <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm mb-10">
        <div class="w-full overflow-x-auto min-h-[600px]">
          <table class="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr class="bg-[#008865] text-white text-sm">
                <th class="py-3 px-6 font-medium whitespace-nowrap">Key</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Label</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Type</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Unit</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Category</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap">Status</th>
                <th class="py-3 px-6 font-medium whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody class="text-sm text-gray-700">
              <tr v-if="definitionsLoading"><td colspan="7" class="py-10 text-center text-gray-400">Loading...</td></tr>
              <tr v-else-if="!definitions.length"><td colspan="7" class="py-10 text-center text-gray-400">No entitlement keys defined yet.</td></tr>
              <tr v-for="d in definitions" :key="d.id" class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-4 px-6 font-mono text-xs text-gray-800">{{ d.key }}</td>
                <td class="py-4 px-6">{{ d.label }}</td>
                <td class="py-4 px-6 capitalize">{{ d.type.replace('_', ' ') }}</td>
                <td class="py-4 px-6">{{ d.unit ?? '—' }}</td>
                <td class="py-4 px-6">{{ d.category ?? '—' }}</td>
                <td class="py-4 px-6">
                  <span :class="d.is_active ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-gray-100 text-gray-500'" class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-medium">
                    {{ d.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="py-4 px-6 text-right">
                  <button @click="toggleDefinitionActive(d)" class="text-gray-500 text-[13px] font-medium hover:underline">{{ d.is_active ? 'Deactivate' : 'Activate' }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CommonPaginationBar v-if="definitionsMeta.total > 0" :meta="definitionsMeta" :loading="definitionsLoading"
          @page-change="(p) => loadDefinitions(p)" @per-page-change="definitionsPerPageChange" />
      </div>

      <!-- Payment Settings -->
      <h2 class="text-[18px] font-medium text-[#013E32] mb-4">Payment Settings</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white border border-gray-100 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col">
          <label class="block text-sm font-medium text-gray-900 mb-1">Default Dunning Grace Period (days)</label>
          <p class="text-xs text-gray-500 mb-3">Applies to all subscriptions unless overridden individually in the Subscriptions tab.</p>
          <div class="flex gap-3 mt-auto">
            <input type="number" min="0" v-model.number="dunningDefault" class="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
            <button @click="saveSettings" class="bg-[#00896F] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#00705a] transition-colors">Save</button>
          </div>
        </div>

        <div class="bg-white border border-gray-100 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col">
          <label class="block text-sm font-medium text-gray-900 mb-1">Free Trial</label>
          <p class="text-xs text-gray-500 mb-4">Every new org gets this dedicated trial plan for free — not synced to Stripe, freely editable any time.</p>

          <div class="mb-4">
            <label class="block text-xs text-gray-500 mb-1">Trial Length (days)</label>
            <input type="number" min="1" v-model.number="trialDays" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
          </div>

          <div class="mb-4">
            <button @click="openTrialPlanModal" class="w-full bg-white border border-gray-200 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">Edit Trial Plan</button>
          </div>

          <div class="mt-auto">
            <button @click="saveSettings" class="w-full bg-[#00896F] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#00705a] transition-colors">Save</button>
          </div>
        </div>
      </div>

      <!-- TODO: remove for production — demo-only escape hatch to edit any published plan in place, bypassing normal versioning -->
      <h2 class="text-[18px] font-medium text-[#013E32] mb-4 mt-6">Demo: Edit Any Plan</h2>
      <div class="bg-white border border-amber-200 rounded-xl p-6 shadow-sm max-w-md">
        <p class="text-xs text-amber-700 mb-3">For demo/testing only — edits a live plan's price/entitlements in place, even with real subscribers on it. Not for production use.</p>
        <div class="mb-3">
          <select v-model="demoEditPlanId" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#00896F]">
            <option :value="null">— Select a plan —</option>
            <option v-for="p in allPlans" :key="p.id" :value="p.id">{{ p.name }} ({{ p.status }})</option>
          </select>
        </div>
        <button v-if="demoEditPlanId" @click="openDemoEditModal" class="w-full bg-white border border-amber-300 text-amber-700 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-amber-50 transition-colors">Edit Plan (Demo)</button>
      </div>
    </div>

    <!-- ═══════════════ PLAN PREVIEW MODAL ═══════════════ -->
    <div v-if="previewPlan" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-medium text-gray-900">Preview</h3>
            <div class="flex items-center gap-2 bg-gray-100 rounded-full p-1">
              <button @click="previewMode = 'user'" :class="previewMode === 'user' ? 'bg-white shadow-sm' : ''" class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors">User View</button>
              <button @click="previewMode = 'admin'" :class="previewMode === 'admin' ? 'bg-white shadow-sm' : ''" class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors">Admin View</button>
            </div>
          </div>

          <div class="flex items-center gap-2 bg-gray-100 rounded-full p-1 w-fit mb-4">
            <button @click="previewCycle = 'monthly'" :class="previewCycle === 'monthly' ? 'bg-white shadow-sm' : ''" class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors">Monthly</button>
            <button @click="previewCycle = 'annual'" :class="previewCycle === 'annual' ? 'bg-white shadow-sm' : ''" class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors">Annual</button>
          </div>

          <!-- Card matches /settings/subscription's pricing card layout -->
          <div class="border-2 rounded-2xl p-6" :class="previewPlan.is_popular ? 'border-[#04C18F]' : 'border-gray-200'">
            <div class="flex gap-2 mb-3">
              <span v-if="previewPlan.is_popular" class="bg-[#04C18F] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase inline-block">Most Popular</span>
              <span v-if="previewPlan.is_custom" class="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase inline-block">Org-Specific — {{ previewPlan.organization?.name ?? `Org #${previewPlan.organization_id}` }}</span>
            </div>
            <h4 class="text-[24px] font-normal text-gray-900 mb-2">{{ previewPlan.name }}</h4>
            <div class="mb-2">
              <span class="text-[32px] font-regular text-black">
                {{ previewCycle === 'monthly'
                  ? formatMoney(previewPlan.current_version?.monthly_price, previewPlan.current_version?.currency)
                  : formatMoney(previewPlan.current_version?.annual_price, previewPlan.current_version?.currency) }}
              </span>
              <span class="text-[14px] text-[#000000CC]"> {{ previewCycle === 'monthly' ? '/month' : '/year' }}</span>
            </div>
            <p v-if="previewCycle === 'annual' && previewPlan.current_version" class="text-[13px] text-[#04C18F] mb-3 font-medium">
              {{ formatMoney(previewPlan.current_version.annual_price / 12, previewPlan.current_version.currency) }}/mo when billed annually
            </p>
            <p class="text-[14px] text-[#000000CC] mb-4">{{ previewPlan.description || 'No description set.' }}</p>

            <div v-for="(group, gi) in (previewPlan.is_trial || previewCycle === 'monthly' ? previewPlan.current_version?.monthly_features : previewPlan.current_version?.annual_features) ?? []" :key="gi" class="mb-3">
              <p v-if="group.title" class="text-[13px] font-semibold text-gray-800 mb-1">{{ group.title }}</p>
              <ul class="space-y-1.5">
                <li v-for="(pt, pi) in group.points" :key="pi" class="text-[13px] text-gray-800 flex items-start gap-2">
                  <span v-if="pt.included === true" class="text-[#04C18F]">✓</span>
                  <span v-else-if="pt.included === false" class="text-gray-300">✕</span>
                  <span v-else class="text-gray-500">•</span>
                  {{ pt.label }}
                </li>
              </ul>
            </div>
            <p v-if="!(previewPlan.is_trial || previewCycle === 'monthly' ? previewPlan.current_version?.monthly_features : previewPlan.current_version?.annual_features)?.length" class="text-xs text-gray-400 mb-4">No feature list set for this plan yet.</p>

            <div v-if="previewMode === 'admin'" class="border-t border-gray-100 pt-4 mt-4">
              <p class="text-xs font-medium text-gray-500 mb-2">Entitlements (admin-only, not shown to users)</p>
              <div class="grid grid-cols-2 gap-2 text-xs text-gray-700">
                <div v-for="(v, k) in previewPlan.current_version?.entitlements ?? {}" :key="k" class="flex justify-between border border-gray-100 rounded px-2 py-1">
                  <span class="font-mono">{{ k }}</span><span>{{ v === true ? 'yes' : v === false ? 'no' : v }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-100">
          <button @click="previewPlan = null" class="w-full py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>

    <!-- ═══════════════ NEW / EDIT PLAN WIZARD (2 steps) ═══════════════ -->
    <div v-if="planModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-medium text-gray-900">
              {{ isTrialPlanEdit ? 'Edit Trial Plan' : isDemoEdit ? `Edit Plan (Demo) — ${versioningPlan?.name}` : versioningPlan ? `New Version — ${versioningPlan.name}` : 'New Plan' }}
            </h3>
            <div class="flex items-center gap-3">
              <span v-if="!isTrialPlanEdit" class="text-xs text-gray-400">Step {{ wizardStep }} of 3 — {{ wizardStep === 1 ? 'General & Monthly' : wizardStep === 2 ? 'Annual' : 'Checkout Summary' }}</span>
              <span v-else class="text-xs text-gray-400">General & Features</span>
              <button type="button" @click="closePlanModal" class="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <!-- ── STEP 1: general info + monthly ── -->
          <div v-if="wizardStep === 1" class="space-y-4">
            <div v-if="!versioningPlan">
              <label class="block text-sm font-medium text-gray-900 mb-1">Name</label>
              <input v-model="planForm.name" type="text" class="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" :class="!planForm.name.trim() ? 'border-red-300' : 'border-gray-200'" />
              <p v-if="!planForm.name.trim()" class="text-xs text-red-500 mt-1">Name is required.</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-1">Description / Tagline</label>
              <p class="text-xs text-gray-500 mb-1">Shown under the price on the pricing card, e.g. "For growing businesses with multiple entities".</p>
              <textarea v-model="planForm.description" rows="2" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#00896F]"></textarea>
            </div>

            <div v-if="!versioningPlan && !isTrialPlanEdit" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-1">Tier</label>
                <input v-model="planForm.tier" type="text" placeholder="pro, ultimate..." class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-1">Status</label>
                <select v-model="planForm.status" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#00896F]">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div v-if="!isTrialPlanEdit" class="flex items-center gap-6">
              <label class="flex items-center gap-2 text-sm text-gray-700">
                <input v-model="planForm.is_popular" type="checkbox" class="h-4 w-4" />
                Most Popular badge
              </label>
              <label v-if="!versioningPlan" class="flex items-center gap-2 text-sm text-gray-700">
                <input v-model="planForm.is_custom" type="checkbox" class="h-4 w-4" />
                Organization Specific Plan
              </label>
            </div>
            <p v-if="planForm.is_custom" class="text-xs text-gray-400 -mt-2">Created unassigned — link it to an org afterward from the Org-Specific Plans tab.</p>

            <div v-if="!isTrialPlanEdit && !isDemoEdit">
              <label class="block text-sm font-medium text-gray-900 mb-1">Monthly Price</label>
              <input v-model.number="planForm.monthly_price" type="number" step="0.01" class="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" :class="planForm.monthly_price === null || planForm.monthly_price === '' ? 'border-red-300' : 'border-gray-200'" />
              <p v-if="planForm.monthly_price === null || planForm.monthly_price === ''" class="text-xs text-red-500 mt-1">Monthly price is required.</p>
            </div>
            <p v-else-if="isTrialPlanEdit" class="text-xs text-gray-500">Trial plans are always free — no pricing fields.</p>
            <p v-else class="text-xs text-gray-500">Demo edit — entitlements, description and features only. Price is locked (it's backed by a live Stripe price).</p>

            <!-- Entitlements are fully opt-in — pick which keys apply to this plan, not a forced complete list -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">Entitlements</label>
              <p class="text-xs text-gray-500 mb-2">Add only the limits/features that apply to this plan. For testing, unlimited-style values (e.g. 999) are fine — nothing is enforced yet.</p>
              <template v-for="key in Object.keys(planForm.entitlements)" :key="key">
                <!-- 'ai' is a single bundled entitlement (enabled + model + thinking + caps), not a
                     plain scalar — custom multi-field editor instead of the generic row below. -->
                <div v-if="key === 'ai'" class="border border-gray-200 rounded-lg p-3 mb-2">
                  <div class="flex items-center justify-between mb-3">
                    <label class="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <input type="checkbox" v-model="planForm.entitlements.ai.enabled" class="h-4 w-4" /> AI (Akeel) Enabled
                    </label>
                    <button type="button" @click="removeEntitlement(key)" class="text-gray-400 hover:text-red-500 shrink-0">✕</button>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Model</label>
                      <select v-model="planForm.entitlements.ai.model" class="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#00896F]">
                        <option v-for="m in aiModelOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Thinking Level</label>
                      <select v-model="planForm.entitlements.ai.thinking" class="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#00896F]">
                        <option v-for="t in aiThinkingOptions" :key="t.value" :value="t.value">{{ t.label }}</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Max Requests / month</label>
                      <input type="number" min="0" v-model.number="planForm.entitlements.ai.max_requests" @change="clampNonNegative(planForm.entitlements.ai, 'max_requests')" class="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#00896F]" />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">Max Tokens / month</label>
                      <input type="number" min="0" v-model.number="planForm.entitlements.ai.max_tokens" @change="clampNonNegative(planForm.entitlements.ai, 'max_tokens')" class="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#00896F]" />
                    </div>
                  </div>
                </div>

                <div v-else class="flex items-center gap-3 mb-2">
                  <span class="text-xs text-gray-600 w-2/5 truncate" :title="key">{{ definitionLabel(key) }}</span>
                  <select v-if="definitionAllowedValues(key).length" v-model="planForm.entitlements[key]" class="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#00896F]">
                    <option v-for="opt in definitionAllowedValues(key)" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                  </select>
                  <input v-else-if="definitionType(key) === 'boolean'" type="checkbox" v-model="planForm.entitlements[key]" class="h-4 w-4" />
                  <input v-else type="number" min="0" v-model.number="planForm.entitlements[key]" @change="clampNonNegative(planForm.entitlements, key)" class="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#00896F]" />
                  <button type="button" @click="removeEntitlement(key)" class="text-gray-400 hover:text-red-500 shrink-0">✕</button>
                </div>
              </template>
              <div class="flex items-center gap-2 mt-2">
                <select v-model="entitlementToAdd" class="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#00896F]">
                  <option value="">Select an entitlement to add…</option>
                  <option v-for="def in availableDefinitionsToAdd" :key="def.key" :value="def.key">{{ def.label }}</option>
                </select>
                <button type="button" @click="addEntitlement" :disabled="!entitlementToAdd" class="text-xs text-[#007C65] font-medium hover:underline disabled:text-gray-300 disabled:no-underline shrink-0">+ Add Entitlement</button>
              </div>
              <p v-if="!allActiveDefinitions.length" class="text-xs text-gray-400 mt-2">No entitlement keys defined yet — add some in the Entitlement Definitions tab first.</p>
            </div>

            <AdminFeatureGroupsEditor v-model="planForm.monthly_features" :entitlement-keys="allActiveDefinitions" label="Monthly Feature List" />
          </div>

          <!-- ── STEP 2: annual ── -->
          <div v-else-if="wizardStep === 2" class="space-y-4">
            <div v-if="!isTrialPlanEdit && !isDemoEdit" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-1">Annual Price (Base)</label>
                <input v-model.number="planForm.annual_base" type="number" step="0.01" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
                <p class="text-xs text-gray-400 mt-1">Defaults to Monthly × 12 — editable.</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-1">Annual Discount %</label>
                <input v-model.number="planForm.annual_discount_percent" type="number" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
              </div>
            </div>
            <div v-if="!isTrialPlanEdit && !isDemoEdit">
              <label class="block text-sm font-medium text-gray-900 mb-1">Total Annual</label>
              <div class="w-full border border-[#04C18F] bg-[#F0FDFA] rounded-lg px-4 py-2.5 text-sm text-gray-900 font-medium">{{ planForm.annual_price?.toFixed(2) ?? '0.00' }}</div>
              <p class="text-xs text-gray-400 mt-1">Base minus discount — this is the stored, charged annual price.</p>
            </div>
            <p v-if="isDemoEdit" class="text-xs text-gray-500">Annual price is locked for demo edits too — unaffected by this screen.</p>

            <div class="flex justify-end">
              <button type="button" @click="planForm.annual_features = cloneFeatureGroups(planForm.monthly_features)" class="text-xs text-[#007C65] font-medium hover:underline">Copy from Monthly</button>
            </div>
            <AdminFeatureGroupsEditor v-model="planForm.annual_features" :entitlement-keys="allActiveDefinitions" label="Annual Feature List" />
          </div>

          <!-- ── STEP 3: checkout order-summary extras (discounts, taxes, included bullets) ── -->
          <div v-else class="space-y-6">
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-gray-900">Discounts</label>
                <button type="button" @click="addDiscountRow" class="text-xs text-[#007C65] font-medium hover:underline">+ Add Discount</button>
              </div>
              <p class="text-xs text-gray-500 mb-2">Stacked, shown as line items on the checkout order summary. Doesn't change the real price charged.</p>
              <div v-for="(d, i) in planForm.discounts" :key="i" class="flex items-center gap-2 mb-2">
                <input v-model="d.name" type="text" placeholder="e.g. First Month" class="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#00896F]" />
                <input v-model.number="d.amount" type="number" step="0.01" placeholder="Amount" class="w-24 border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#00896F]" />
                <label class="flex items-center gap-1 text-xs text-gray-600 shrink-0">
                  <input v-model="d.is_percent" type="checkbox" class="h-3.5 w-3.5" /> %
                </label>
                <label class="flex items-center gap-1 text-xs text-gray-600 shrink-0">
                  <input v-model="d.one_time" type="checkbox" class="h-3.5 w-3.5" /> One-time
                </label>
                <button type="button" @click="planForm.discounts.splice(i, 1)" class="text-gray-400 hover:text-red-500 shrink-0">✕</button>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-gray-900">Taxes</label>
                <button type="button" @click="addTaxRow" class="text-xs text-[#007C65] font-medium hover:underline">+ Add Tax</button>
              </div>
              <div v-for="(tx, i) in planForm.taxes" :key="i" class="flex items-center gap-2 mb-2">
                <input v-model="tx.name" type="text" placeholder="e.g. VAT" class="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#00896F]" />
                <input v-model.number="tx.amount" type="number" step="0.01" placeholder="Amount" class="w-24 border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#00896F]" />
                <label class="flex items-center gap-1 text-xs text-gray-600 shrink-0">
                  <input v-model="tx.is_percent" type="checkbox" class="h-3.5 w-3.5" /> %
                </label>
                <button type="button" @click="planForm.taxes.splice(i, 1)" class="text-gray-400 hover:text-red-500 shrink-0">✕</button>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-gray-900">What's Included (checkout summary)</label>
                <div class="flex gap-3">
                  <button type="button" @click="copyIncludedFromFeatures" class="text-xs text-[#007C65] font-medium hover:underline">Copy from Features</button>
                  <button type="button" @click="planForm.checkout_included.push('')" class="text-xs text-[#007C65] font-medium hover:underline">+ Add Line</button>
                </div>
              </div>
              <div v-for="(line, i) in planForm.checkout_included" :key="i" class="flex items-center gap-2 mb-2">
                <input v-model="planForm.checkout_included[i]" type="text" placeholder="e.g. No setup fees" class="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#00896F]" />
                <button type="button" @click="planForm.checkout_included.splice(i, 1)" class="text-gray-400 hover:text-red-500 shrink-0">✕</button>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-5 flex gap-4 border-t border-gray-100">
          <button v-if="wizardStep === 1" @click="cancelPlanModal" class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Cancel</button>
          <button v-else @click="wizardStep -= 1" class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Back</button>
          <button v-if="!isTrialPlanEdit && !isDemoEdit" @click="submitPlan(true)" class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Save as Draft</button>
          <button v-if="isTrialPlanEdit" @click="submitPlan(false)" :disabled="!wizardStepValid" class="flex-1 py-2.5 bg-[#00896F] text-white text-sm font-medium rounded-lg hover:bg-[#00705a] disabled:opacity-50">Save</button>
          <button v-else-if="wizardStep === 1" @click="wizardStep = 2" :disabled="!wizardStepValid" class="flex-1 py-2.5 bg-[#00896F] text-white text-sm font-medium rounded-lg hover:bg-[#00705a] disabled:opacity-50">Next: Annual</button>
          <button v-else-if="wizardStep === 2" @click="wizardStep = 3" :disabled="!wizardStepValid" class="flex-1 py-2.5 bg-[#00896F] text-white text-sm font-medium rounded-lg hover:bg-[#00705a] disabled:opacity-50">Next: Checkout Summary</button>
          <button v-else @click="submitPlan(false)" class="flex-1 py-2.5 bg-[#00896F] text-white text-sm font-medium rounded-lg hover:bg-[#00705a]">Save</button>
        </div>
      </div>
    </div>

    <!-- ═══════════════ ASSIGN ORG-SPECIFIC PLAN MODAL ═══════════════ -->
    <div v-if="assignModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div class="p-6">
          <h3 class="text-xl font-medium text-gray-900 mb-4">Assign Org-Specific Plan</h3>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-900 mb-1">Organization</label>
            <input v-model="orgSearchQuery" @input="searchOrgs" type="text" placeholder="Search organizations…"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
            <div v-if="orgSearchResults.length" class="border border-gray-100 rounded-lg mt-2 max-h-40 overflow-y-auto">
              <button v-for="org in orgSearchResults" :key="org.id" @click="selectAssignOrg(org)"
                class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                :class="assignOrgTarget?.id === org.id ? 'bg-[#E6F8F3] font-medium' : ''">{{ org.name }}</button>
            </div>
            <p v-if="assignOrgTarget" class="text-xs text-[#007C65] mt-2 font-medium">Selected: {{ assignOrgTarget.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">Plan(s) to assign</label>
            <p class="text-xs text-gray-500 mb-2">Org-specific plans not yet linked to any org — showing the 5 most recent, search to narrow down.</p>
            <input v-model="planSearchQuery" @input="searchUnassignedPlans" type="text" placeholder="Search plans…"
              class="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm mb-2 focus:outline-none focus:border-[#00896F]" />
            <div class="border border-gray-100 rounded-lg max-h-48 overflow-y-auto">
              <label v-for="plan in unassignedPlans" :key="plan.id" class="flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" :value="plan.id" v-model="selectedUnassignedPlanIds" class="h-4 w-4" />
                <span class="text-sm">{{ plan.name }}</span>
              </label>
              <p v-if="unassignedPlansLoading" class="text-xs text-gray-400 px-4 py-4">Searching...</p>
              <p v-else-if="!unassignedPlans.length" class="text-xs text-gray-400 px-4 py-4">No unassigned org-specific plans — create one in the Plans tab first (check "Organization Specific Plan").</p>
            </div>
          </div>
        </div>
        <div class="px-6 py-5 flex gap-4 border-t border-gray-100">
          <button @click="assignModalOpen = false" class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Cancel</button>
          <button @click="submitAssign" :disabled="!assignOrgTarget || !selectedUnassignedPlanIds.length"
            class="flex-1 py-2.5 bg-[#00896F] text-white text-sm font-medium rounded-lg hover:bg-[#00705a] disabled:opacity-40">Assign</button>
        </div>
      </div>
    </div>

    <!-- ═══════════════ ORG GROUP VIEW / CONFIG MODAL ═══════════════ -->
    <div v-if="orgGroupModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-xl font-medium text-gray-900 mb-1">{{ orgGroupModal.organization.name }}</h3>
          <p class="text-xs text-gray-500 mb-4">{{ orgGroupModal.plans.length }} active plan{{ orgGroupModal.plans.length === 1 ? '' : 's' }}</p>

          <div v-for="plan in orgGroupModal.plans" :key="plan.id" class="border border-gray-100 rounded-lg p-4 mb-3">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ plan.name }}</p>
                <p class="text-xs text-gray-500">{{ formatMoney(plan.current_version?.monthly_price, plan.current_version?.currency) }}/mo · {{ formatMoney(plan.current_version?.annual_price, plan.current_version?.currency) }}/yr</p>
              </div>
              <div class="flex gap-3 shrink-0">
                <button @click="openPreview(plan)" class="text-xs text-gray-500 font-medium hover:underline">View</button>
                <template v-if="orgGroupConfigMode">
                  <button @click="deactivateOrgPlan(plan)" class="text-xs text-amber-600 font-medium hover:underline">Deactivate</button>
                  <button @click="removeOrgPlan(plan)" class="text-xs text-red-500 font-medium hover:underline">Remove</button>
                </template>
              </div>
            </div>
          </div>
          <p v-if="!orgGroupModal.plans.length" class="text-xs text-gray-400">No active plans left for this org.</p>
        </div>
        <div class="px-6 py-4 border-t border-gray-100">
          <button @click="orgGroupModal = null" class="w-full py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>

    <!-- ═══════════════ NEW ENTITLEMENT DEFINITION MODAL ═══════════════ -->
    <div v-if="definitionModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div class="p-6">
          <h3 class="text-xl font-medium text-gray-900 mb-4">New Entitlement Key</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-1">Key</label>
              <input v-model="definitionForm.key" type="text" placeholder="max_tenants" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#00896F]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-1">Label</label>
              <input v-model="definitionForm.label" type="text" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-1">Type</label>
                <select v-model="definitionForm.type" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#00896F]">
                  <option value="boolean">Boolean</option>
                  <option value="numeric">Numeric</option>
                  <option value="unlimited_capable">Unlimited-capable</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-1">Unit</label>
                <input v-model="definitionForm.unit" type="text" placeholder="emails/month" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-1">Category</label>
              <input v-model="definitionForm.category" type="text" placeholder="communications" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#00896F]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-1">Allowed values (optional — turns this into a dropdown per plan)</label>
              <div v-for="(opt, i) in definitionForm.allowed_values" :key="i" class="flex items-center gap-2 mb-2">
                <input v-model="opt.value" type="text" placeholder="value" class="w-2/5 border border-gray-200 rounded-md px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-[#00896F]" />
                <input v-model="opt.label" type="text" placeholder="label shown to admin" class="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#00896F]" />
                <button type="button" @click="definitionForm.allowed_values.splice(i, 1)" class="text-gray-400 hover:text-red-500 shrink-0">✕</button>
              </div>
              <button type="button" @click="definitionForm.allowed_values.push({ value: '', label: '' })" class="text-xs text-[#007C65] font-medium hover:underline">+ Add value</button>
            </div>
          </div>
        </div>
        <div class="px-6 py-5 flex gap-4 border-t border-gray-100">
          <button @click="definitionModalOpen = false" class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Cancel</button>
          <button @click="submitDefinition" class="flex-1 py-2.5 bg-[#00896F] text-white text-sm font-medium rounded-lg hover:bg-[#00705a]">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Payments Admin CMS — authoring/monitoring only, no enforcement logic here.
import { ref, computed, onMounted, watch } from 'vue'

const {
  getPlans, getOrgPlansGrouped, getPlanStats, getOrganizations, assignPlanToOrg, createPlan, createPlanVersion, updatePlanStatus,
  getEntitlementDefinitions, createEntitlementDefinition, toggleEntitlementDefinitionActive: apiToggleDefinitionActive, getAiModelOptions,
  getSubscriptions, getPayments, setDunningOverride, getAlerts,
  getPaymentSettings, updatePaymentSettings, getTrialPlan, saveTrialPlan, demoEditPlan,
} = usePaymentsAdmin()

const stats = ref({})
async function loadStats() {
  const res = await getPlanStats()
  stats.value = res.data || {}
}

const tabs = [
  { key: 'alerts', label: 'Alerts' },
  { key: 'plans', label: 'Plans' },
  { key: 'org-plans', label: 'Org-Specific Plans' },
  { key: 'subscriptions', label: 'Subscriptions' },
  { key: 'payments', label: 'Payments' },
  { key: 'settings', label: 'Settings' },
]
// Defaults to Alerts; ?tab= persists across refresh and the header bell link.
const route = useRoute()
const router = useRouter()
const activeTab = ref(route.query.tab || 'alerts')
function setTab(key) {
  activeTab.value = key
  router.replace({ query: { ...route.query, tab: key } })
}

function formatMoney(amount, currency) {
  if (amount === null || amount === undefined) return '—'
  return `${Number(amount).toFixed(2)} ${currency ?? 'AED'}`
}

function statusColor(status) {
  if (status === 'paid') return 'bg-[#D1FAE5] text-[#065F46]'
  if (status === 'failed') return 'bg-red-100 text-red-600'
  return 'bg-amber-100 text-amber-700'
}

async function changeStatus(plan, status, reload) {
  await updatePlanStatus(plan.id, status)
  await reload()
}

// ── Plans (general) ────────────────────────────────────────────────────
const plans = ref([])
const plansLoading = ref(false)
const plansMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const planStatusFilter = ref('')
const planTypeFilter = ref('') // '' | 'general' | 'org'
async function loadPlans(page = 1) {
  plansLoading.value = true
  try {
    const isCustom = planTypeFilter.value === '' ? undefined : planTypeFilter.value === 'org'
    const res = await getPlans(page, plansMeta.value.per_page, isCustom, planStatusFilter.value || undefined)
    plans.value = (res.data || []).map(p => ({ ...p, current_version: p.current_version ?? null }))
    plansMeta.value = { current_page: res.current_page, per_page: res.per_page, total: res.total, last_page: res.last_page }
  } finally {
    plansLoading.value = false
  }
}
function plansPerPageChange(pp) { plansMeta.value.per_page = pp; loadPlans(1) }

// ── Org-Specific Plans (grouped by org) ─────────────────────────────────
const orgPlanGroups = ref([])
const orgPlansLoading = ref(false)
const orgPlansMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
async function loadOrgPlans(page = 1) {
  orgPlansLoading.value = true
  try {
    const res = await getOrgPlansGrouped(page, orgPlansMeta.value.per_page)
    orgPlanGroups.value = res.data || []
    orgPlansMeta.value = { current_page: res.current_page, per_page: res.per_page, total: res.total, last_page: res.last_page }
  } finally {
    orgPlansLoading.value = false
  }
}
function orgPlansPerPageChange(pp) { orgPlansMeta.value.per_page = pp; loadOrgPlans(1) }

// ── Preview ─────────────────────────────────────────────────────────────
const previewPlan = ref(null)
const previewMode = ref('user')
const previewCycle = ref('annual')
function openPreview(plan) {
  previewPlan.value = plan
  previewMode.value = 'user'
  previewCycle.value = 'annual'
}

// ── Plan wizard (Plans tab only — Org-Specific Plans tab only assigns, doesn't create) ─────────
const planModalOpen = ref(false)
const wizardStep = ref(1)
const versioningPlan = ref(null)
const isTrialPlanEdit = ref(false)
const planForm = ref(emptyPlanForm())
function emptyPlanForm() {
  return {
    name: '', description: '', tier: '', is_popular: false, is_custom: false, status: 'active',
    monthly_price: null, annual_price: null, annual_base: null, annual_discount_percent: 0,
    entitlements: {}, monthly_features: [], annual_features: [],
    discounts: [], taxes: [], checkout_included: [],
  }
}
// Base defaults to Monthly × 12 but only while untouched — doesn't fight a manual edit.
// Trial plans hide these fields entirely and keep a fixed $0 annual price — skip them here.
watch(() => planForm.value.monthly_price, (monthly) => {
  if (isTrialPlanEdit.value || planForm.value.annual_base !== null) return
  planForm.value.annual_base = Math.round(Number(monthly || 0) * 12 * 100) / 100
})

// Total Annual = Base minus discount% — the only value actually stored as annual_price.
watch([() => planForm.value.annual_base, () => planForm.value.annual_discount_percent], ([base, percent]) => {
  if (isTrialPlanEdit.value) return
  const pct = Number(percent || 0)
  planForm.value.annual_price = Math.round(Number(base || 0) * (1 - pct / 100) * 100) / 100
}, { immediate: true })

const wizardStepValid = computed(() => {
  if (wizardStep.value === 1) {
    if (!versioningPlan.value && !planForm.value.name.trim()) return false
    if (!isTrialPlanEdit.value && !isDemoEdit.value && (planForm.value.monthly_price === null || planForm.value.monthly_price === '')) return false
  }
  if (wizardStep.value === 2 && !isTrialPlanEdit.value && !isDemoEdit.value) {
    if (planForm.value.annual_price === null || planForm.value.annual_price === '') return false
  }
  return true
})
function cloneFeatureGroups(groups) {
  return groups.map(g => ({ title: g.title, points: g.points.map(p => ({ ...p })) }))
}
function addDiscountRow() {
  planForm.value.discounts.push({ name: '', amount: 0, is_percent: false, one_time: false })
}
function addTaxRow() {
  planForm.value.taxes.push({ name: '', amount: 0, is_percent: true })
}
function copyIncludedFromFeatures() {
  const groups = planForm.value.monthly_features
  planForm.value.checkout_included = groups.flatMap(g => g.points.filter(p => p.included !== false).map(p => p.label)).filter(Boolean)
}
async function openPlanModal() {
  versioningPlan.value = null
  isTrialPlanEdit.value = false
  isDemoEdit.value = false
  wizardStep.value = 1
  planForm.value = emptyPlanForm()
  await loadAllActiveDefinitions() // refresh so newly-added entitlement keys show up immediately
  planModalOpen.value = true
}

// Dedicated, non-Stripe-tracked trial plan — separate from the regular Plans tab wizard flow.
async function openTrialPlanModal() {
  versioningPlan.value = null
  isTrialPlanEdit.value = true
  isDemoEdit.value = false
  wizardStep.value = 1
  planForm.value = emptyPlanForm()

  const res = await getTrialPlan()
  const plan = res.data
  if (plan) {
    planForm.value.name = plan.name ?? ''
    planForm.value.description = plan.description ?? ''
    if (plan.current_version) {
      planForm.value.monthly_price = Number(plan.current_version.monthly_price)
      planForm.value.annual_price = Number(plan.current_version.annual_price)
      planForm.value.annual_discount_percent = Number(plan.current_version.annual_discount_percent)
      planForm.value.entitlements = { ...(plan.current_version.entitlements || {}) }
      planForm.value.monthly_features = cloneFeatureGroups(plan.current_version.monthly_features || [])
      planForm.value.annual_features = cloneFeatureGroups(plan.current_version.annual_features || [])
      planForm.value.discounts = (plan.current_version.discounts || []).map(d => ({ ...d }))
      planForm.value.taxes = (plan.current_version.taxes || []).map(t => ({ ...t }))
      planForm.value.checkout_included = [...(plan.current_version.checkout_included || [])]
    }
  } else {
    planForm.value.name = 'Trial'
    planForm.value.monthly_price = 0
    planForm.value.annual_price = 0
  }

  await loadAllActiveDefinitions()
  planModalOpen.value = true
}
async function openVersionModal(plan) {
  versioningPlan.value = plan
  isTrialPlanEdit.value = false
  isDemoEdit.value = false
  wizardStep.value = 1
  planForm.value = emptyPlanForm()
  // Pre-fill from the plan's current version so editing starts from what's already live, not blank.
  planForm.value.description = plan.description ?? ''
  planForm.value.tier = plan.tier ?? ''
  planForm.value.is_popular = !!plan.is_popular
  planForm.value.is_custom = !!plan.is_custom
  planForm.value.status = plan.status ?? 'draft'
  if (plan.current_version) {
    planForm.value.monthly_price = Number(plan.current_version.monthly_price)
    const discount = Number(plan.current_version.annual_discount_percent) || 0
    planForm.value.annual_discount_percent = discount
    const storedAnnual = Number(plan.current_version.annual_price)
    planForm.value.annual_base = discount > 0 ? Math.round((storedAnnual / (1 - discount / 100)) * 100) / 100 : storedAnnual
    planForm.value.entitlements = { ...(plan.current_version.entitlements || {}) }
    planForm.value.monthly_features = cloneFeatureGroups(plan.current_version.monthly_features || [])
    planForm.value.annual_features = cloneFeatureGroups(plan.current_version.annual_features || [])
    planForm.value.discounts = (plan.current_version.discounts || []).map(d => ({ ...d }))
    planForm.value.taxes = (plan.current_version.taxes || []).map(t => ({ ...t }))
    planForm.value.checkout_included = [...(plan.current_version.checkout_included || [])]
  }
  await loadAllActiveDefinitions()
  planModalOpen.value = true
}
function closePlanModal() {
  planModalOpen.value = false
  versioningPlan.value = null
  isTrialPlanEdit.value = false
  isDemoEdit.value = false
}
// Cancel on a new, never-saved plan with real data entered auto-saves as draft instead of discarding it.
async function cancelPlanModal() {
  if (!versioningPlan.value && planForm.value.name && planForm.value.monthly_price) {
    await submitPlan(true)
    return
  }
  closePlanModal()
}

// Entitlements are opt-in — admin explicitly adds which keys apply, nothing auto-forced.
const entitlementToAdd = ref('')
const availableDefinitionsToAdd = computed(() =>
  allActiveDefinitions.value.filter(d => !(d.key in planForm.value.entitlements))
)
function definitionLabel(key) {
  return allActiveDefinitions.value.find(d => d.key === key)?.label ?? key
}
function definitionType(key) {
  return allActiveDefinitions.value.find(d => d.key === key)?.type ?? 'numeric'
}
function definitionAllowedValues(key) {
  return allActiveDefinitions.value.find(d => d.key === key)?.allowed_values ?? []
}
const aiModelOptions = ref([])
const aiThinkingOptions = ref([])
async function loadAiModelOptions() {
  const res = await getAiModelOptions()
  aiModelOptions.value = res?.models ?? []
  aiThinkingOptions.value = res?.thinking_levels ?? []
}
function clampNonNegative(obj, key) {
  if ((obj[key] ?? 0) < 0) obj[key] = 0
}
function addEntitlement() {
  if (!entitlementToAdd.value) return
  if (entitlementToAdd.value === 'ai') {
    planForm.value.entitlements.ai = { enabled: true, model: 'gemini-flash', thinking: 'medium', max_requests: 200, max_tokens: 5000 }
    entitlementToAdd.value = ''
    return
  }
  const def = allActiveDefinitions.value.find(d => d.key === entitlementToAdd.value)
  const options = def?.allowed_values ?? []
  planForm.value.entitlements[entitlementToAdd.value] = options.length ? options[0].value : (def?.type === 'boolean' ? false : 0)
  entitlementToAdd.value = ''
}
function removeEntitlement(key) {
  delete planForm.value.entitlements[key]
}

async function submitPlan(asDraft = false) {
  const payload = {
    description: planForm.value.description || null,
    tier: planForm.value.tier || null,
    is_popular: planForm.value.is_popular,
    is_custom: planForm.value.is_custom,
    status: asDraft ? 'draft' : planForm.value.status,
    monthly_price: planForm.value.monthly_price,
    annual_price: planForm.value.annual_price,
    annual_discount_percent: planForm.value.annual_discount_percent,
    entitlements: planForm.value.entitlements,
    monthly_features: planForm.value.monthly_features,
    annual_features: planForm.value.annual_features,
    discounts: planForm.value.discounts,
    taxes: planForm.value.taxes,
    checkout_included: planForm.value.checkout_included,
  }
  if (isTrialPlanEdit.value) {
    await saveTrialPlan({ name: planForm.value.name, ...payload, annual_features: cloneFeatureGroups(planForm.value.monthly_features), discounts: [], taxes: [], checkout_included: [] })
    closePlanModal()
    await loadAllPlans()
    return
  }
  if (isDemoEdit.value) {
    // demo edit is entitlements/description/features only — price is backed by a live, immutable
    // Stripe price and must never be touched from here (see backend PaymentAdminController::demoEditPlan)
    const { monthly_price, annual_price, annual_discount_percent, ...demoPayload } = payload
    await demoEditPlan(versioningPlan.value.id, demoPayload)
    closePlanModal()
    await Promise.all([loadPlans(), loadOrgPlans(), loadAllPlans()])
    return
  }
  if (versioningPlan.value) {
    await createPlanVersion(versioningPlan.value.id, payload)
  } else {
    await createPlan({ name: planForm.value.name, ...payload })
  }
  closePlanModal()
  await Promise.all([loadPlans(), loadOrgPlans()])
}

// ── Assign Org-Specific Plan (Org-Specific Plans tab) ──────────────────
const assignModalOpen = ref(false)
const orgSearchQuery = ref('')
const orgSearchResults = ref([])
const assignOrgTarget = ref(null)
const unassignedPlans = ref([])
const unassignedPlansLoading = ref(false)
const selectedUnassignedPlanIds = ref([])
const planSearchQuery = ref('')
async function loadUnassignedPlans(search) {
  unassignedPlansLoading.value = true
  try {
    const res = await getPlans(1, 5, true, undefined, true, search || undefined)
    unassignedPlans.value = res.data || []
  } finally {
    unassignedPlansLoading.value = false
  }
}
let planSearchDebounce = null
function searchUnassignedPlans() {
  clearTimeout(planSearchDebounce)
  planSearchDebounce = setTimeout(() => loadUnassignedPlans(planSearchQuery.value), 250)
}
async function openAssignModal() {
  orgSearchQuery.value = ''
  orgSearchResults.value = []
  assignOrgTarget.value = null
  selectedUnassignedPlanIds.value = []
  planSearchQuery.value = ''
  await loadUnassignedPlans()
  assignModalOpen.value = true
}
let orgSearchDebounce = null
function searchOrgs() {
  clearTimeout(orgSearchDebounce)
  orgSearchDebounce = setTimeout(async () => {
    if (!orgSearchQuery.value.trim()) { orgSearchResults.value = []; return }
    const res = await getOrganizations(orgSearchQuery.value)
    orgSearchResults.value = res.data || []
  }, 250)
}
function selectAssignOrg(org) {
  assignOrgTarget.value = org
  orgSearchResults.value = []
  orgSearchQuery.value = org.name
}
async function submitAssign() {
  await Promise.all(selectedUnassignedPlanIds.value.map(id => assignPlanToOrg(id, assignOrgTarget.value.id)))
  assignModalOpen.value = false
  await loadOrgPlans()
}

// ── Org group View/Config ───────────────────────────────────────────────
const orgGroupModal = ref(null)
const orgGroupConfigMode = ref(false)
function openOrgGroupModal(row, configMode = false) {
  orgGroupModal.value = row
  orgGroupConfigMode.value = configMode
}
async function deactivateOrgPlan(plan) {
  await updatePlanStatus(plan.id, 'inactive')
  orgGroupModal.value.plans = orgGroupModal.value.plans.filter(p => p.id !== plan.id)
  await loadOrgPlans()
}
async function removeOrgPlan(plan) {
  await assignPlanToOrg(plan.id, null)
  orgGroupModal.value.plans = orgGroupModal.value.plans.filter(p => p.id !== plan.id)
  await loadOrgPlans()
}

// ── Entitlement definitions ────────────────────────────────────────────
const definitions = ref([])
const definitionsLoading = ref(false)
const definitionsMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
async function loadDefinitions(page = 1) {
  definitionsLoading.value = true
  try {
    const res = await getEntitlementDefinitions(page, definitionsMeta.value.per_page)
    definitions.value = res.data || []
    definitionsMeta.value = { current_page: res.current_page, per_page: res.per_page, total: res.total, last_page: res.last_page }
  } finally {
    definitionsLoading.value = false
  }
}
function definitionsPerPageChange(pp) { definitionsMeta.value.per_page = pp; loadDefinitions(1) }

// Unpaginated, purely for the entitlement picker dropdown.
const allActiveDefinitions = ref([])
async function loadAllActiveDefinitions() {
  const res = await getEntitlementDefinitions(1, 1000)
  allActiveDefinitions.value = (res.data || []).filter(d => d.is_active)
}

const definitionModalOpen = ref(false)
const definitionForm = ref(emptyDefinitionForm())
function emptyDefinitionForm() {
  return { key: '', label: '', description: '', type: 'numeric', unit: '', category: '', allowed_values: [] }
}
function openDefinitionModal() {
  definitionForm.value = emptyDefinitionForm()
  definitionModalOpen.value = true
}
async function submitDefinition() {
  const payload = { ...definitionForm.value }
  const values = payload.allowed_values.filter(o => o.value && o.label)
  payload.allowed_values = values.length ? values : null
  await createEntitlementDefinition(payload)
  definitionModalOpen.value = false
  await loadDefinitions()
  await loadAllActiveDefinitions()
}
async function toggleDefinitionActive(def) {
  await apiToggleDefinitionActive(def.id)
  await loadDefinitions()
}

// ── Subscriptions ───────────────────────────────────────────────────────
const subscriptions = ref([])
const subscriptionsLoading = ref(false)
const subscriptionsMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
async function loadSubscriptions(page = 1) {
  subscriptionsLoading.value = true
  try {
    const res = await getSubscriptions(page, subscriptionsMeta.value.per_page)
    subscriptions.value = res.data || []
    subscriptionsMeta.value = { current_page: res.current_page, per_page: res.per_page, total: res.total, last_page: res.last_page }
  } finally {
    subscriptionsLoading.value = false
  }
}
function subscriptionsPerPageChange(pp) { subscriptionsMeta.value.per_page = pp; loadSubscriptions(1) }
async function saveDunning(sub) {
  await setDunningOverride(sub.id, sub.dunning_grace_days || null)
}

// ── Payments ────────────────────────────────────────────────────────────
const payments = ref([])
const paymentsLoading = ref(false)
const paymentsMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
async function loadPayments(page = 1) {
  paymentsLoading.value = true
  try {
    const res = await getPayments(page, paymentsMeta.value.per_page)
    payments.value = res.data || []
    paymentsMeta.value = { current_page: res.current_page, per_page: res.per_page, total: res.total, last_page: res.last_page }
  } finally {
    paymentsLoading.value = false
  }
}
function paymentsPerPageChange(pp) { paymentsMeta.value.per_page = pp; loadPayments(1) }

// ── Settings ────────────────────────────────────────────────────────────
const dunningDefault = ref(7)
const trialDays = ref(14)
const allPlans = ref([]) // every status, every type — source for the demo-edit dropdown below

async function loadAllPlans() {
  const res = await getPlans(1, 1000)
  allPlans.value = res.data || []
}
async function loadSettings() {
  const res = await getPaymentSettings()
  dunningDefault.value = res.data?.dunning_grace_days_default ?? 7
  trialDays.value = res.data?.trial_days ?? 14
}
async function saveSettings() {
  await updatePaymentSettings(dunningDefault.value, trialDays.value)
}

// TODO: remove for production — demo-only escape hatch (see backend PaymentAdminController::demoEditPlan)
const demoEditPlanId = ref(null)
const isDemoEdit = ref(false)
async function openDemoEditModal() {
  const plan = allPlans.value.find(p => p.id === demoEditPlanId.value)
  if (!plan) return
  await openVersionModal(plan)
  isDemoEdit.value = true
}

// ── Alerts ──────────────────────────────────────────────────────────────
const alerts = ref({ failed_payments: [], expiring_cards: [], past_due_subscriptions: [] })
const alertsLoading = ref(false)
const failedMeta   = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const expiringMeta = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })
const pastdueMeta  = ref({ current_page: 1, per_page: 10, total: 0, last_page: 1 })

function metaFromPaginator(p) {
  return { current_page: p.current_page, per_page: p.per_page, total: p.total, last_page: p.last_page }
}

async function loadAlerts() {
  alertsLoading.value = true
  try {
    const res = await getAlerts({
      failed: failedMeta.value.current_page,
      expiring: expiringMeta.value.current_page,
      pastdue: pastdueMeta.value.current_page,
    })
    alerts.value = {
      failed_payments: res.failed_payments?.data ?? [],
      expiring_cards: res.expiring_cards?.data ?? [],
      past_due_subscriptions: res.past_due_subscriptions?.data ?? [],
    }
    if (res.failed_payments) failedMeta.value = metaFromPaginator(res.failed_payments)
    if (res.expiring_cards) expiringMeta.value = metaFromPaginator(res.expiring_cards)
    if (res.past_due_subscriptions) pastdueMeta.value = metaFromPaginator(res.past_due_subscriptions)
  } finally {
    alertsLoading.value = false
  }
}
function goFailedPage(p) { failedMeta.value.current_page = p; loadAlerts() }
function goExpiringPage(p) { expiringMeta.value.current_page = p; loadAlerts() }
function goPastduePage(p) { pastdueMeta.value.current_page = p; loadAlerts() }

onMounted(async () => {
  await Promise.all([
    loadStats(), loadAllActiveDefinitions(), loadAlerts(), loadAiModelOptions(),
    loadPlans(), loadOrgPlans(), loadDefinitions(), loadSubscriptions(), loadPayments(), loadSettings(), loadAllPlans(),
  ])
})
</script>
