<template>
  <CommonTeamUserModal
    :mode="user ? 'edit' : 'add'"
    :user="user"
    :roles="roles"
    :fields="fields"
    :saving="busy"
    :error="error"
    @close="$emit('close')"
    @submit="submit"
  />
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  tenantId: { type: Number, required: true },
  user: { type: Object, default: null },
  roles: { type: Array, default: () => ['master_user', 'account_user', 'sales_user', 'procurement_user', 'project_manager_user', 'partner_user', 'guest_user'] },
})
const emit = defineEmits(['close', 'saved'])

const { updateTenantUser, addTenantUser } = useClientManagement()

const fields = computed(() => props.user
  ? { identity: false, email: false, role: true, password: false, primary: true, meta: true }
  : { identity: true, email: true, role: true, password: true, primary: false, meta: true })
const busy = ref(false)
const error = ref('')

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
