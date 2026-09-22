<template>
  <CommonTeamUserModal
    :mode="user ? 'edit' : 'add'"
    :user="user"
    :roles="roles"
    :fields="fields"
    :saving="busy"
    :error="error"
    :actions="user && !user.is_primary ? ['remove'] : []"
    @close="$emit('close')"
    @submit="submit"
    @remove="startDelete"
  />

  <Teleport to="body">
    <div v-if="showDelete" class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="showDelete = false">
      <div class="bg-white rounded-xl shadow-lg w-[400px] max-w-full p-6">
        <h3 class="text-[16px] font-semibold text-gray-900 mb-2">Delete user?</h3>
        <p class="text-sm text-gray-500 mb-4">{{ user?.email }} will be signed out and removed from this company. This cannot be undone.</p>
        <label class="block text-[13px] text-gray-600 mb-1.5">Confirm with your admin password</label>
        <input v-model="adminPassword" type="password" placeholder="Your password" autocomplete="current-password"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#008169]" />
        <p v-if="deleteError" class="text-[13px] text-red-500 mt-2">{{ deleteError }}</p>
        <div class="flex justify-end gap-3 mt-6">
          <button @click="showDelete = false" class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button @click="confirmDelete" :disabled="deleting || !adminPassword"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
            {{ deleting ? 'Deleting…' : 'Delete user' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  tenantId: { type: Number, required: true },
  user: { type: Object, default: null },
  roles: { type: Array, default: () => ['master_user', 'account_user', 'sales_user', 'procurement_user', 'project_manager_user', 'partner_user', 'guest_user'] },
})
const emit = defineEmits(['close', 'saved'])

const { updateTenantUser, addTenantUser, deleteTenantUser } = useClientManagement()

const fields = computed(() => props.user
  ? { identity: false, email: false, role: true, password: false, primary: true, meta: true }
  : { identity: true, email: true, role: true, password: true, primary: false, meta: true })
const busy = ref(false)
const error = ref('')
const showDelete = ref(false)
const adminPassword = ref('')
const deleting = ref(false)
const deleteError = ref('')

function startDelete() {
  adminPassword.value = ''
  deleteError.value = ''
  showDelete.value = true
}

async function confirmDelete() {
  deleting.value = true
  deleteError.value = ''
  try {
    await deleteTenantUser(props.tenantId, props.user.id, adminPassword.value)
    showDelete.value = false
    emit('saved')
  } catch (e) {
    deleteError.value = e?.data?.message || 'Could not delete the user.'
  } finally {
    deleting.value = false
  }
}

const errorMessage = (e) =>
  e?.data?.message || (e?.data?.errors ? Object.values(e.data.errors).flat()[0] : null) || 'Something went wrong. Please try again.'

async function submit(form) {
  busy.value = true
  error.value = ''
  try {
    if (props.user) {
      const payload = {}
      if (form.role !== props.user.role) payload.role = form.role
      if (form.is_primary && !props.user.is_primary) payload.is_primary = true
      for (const key of ['department', 'title', 'position', 'description']) {
        if ((form[key] || '') !== (props.user[key] || '')) payload[key] = form[key] || null
      }
      if (Object.keys(payload).length) await updateTenantUser(props.tenantId, props.user.id, payload)
    } else {
      const payload = { first_name: form.first_name, last_name: form.last_name, contact_number: form.contact_number, email: form.email, role: form.role }
      if (form.password) payload.password = form.password
      for (const key of ['department', 'title', 'position', 'description']) if (form[key]) payload[key] = form[key]
      await addTenantUser(props.tenantId, payload)
    }
    emit('saved')
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    busy.value = false
  }
}
</script>
