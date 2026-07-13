<template>
    <Teleport to="body">
    <Transition name="fade">
        <div v-if="open" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click.self="close">
            <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <div class="p-8 space-y-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-semibold text-gray-900">
                            {{ currentLang === 'ar' ? 'إضافة إدخال جديد' : 'Add New Entry' }}
                        </h2>
                        <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                    </div>

                    <!-- ID (auto-generated, readonly) -->
                    <div v-if="!isInternal">
                        <label class="text-xs text-gray-500">{{ idLabel }}</label>
                        <input type="text" :value="form.identity" readonly
                            class="w-full h-11 border border-[#04C18F80] rounded-xl px-4 text-sm bg-[#F3FDFA] text-gray-700 outline-none" />
                    </div>

                    <!-- Employee (internal only) -->
                    <div v-if="isInternal">
                        <input type="text" v-model="form.employee_name" :placeholder="currentLang === 'ar' ? 'الموظف' : 'Employee'"
                            class="w-full h-11 border border-[#04C18F80] rounded-xl px-4 text-sm outline-none focus:border-[#00896F] bg-white text-gray-900 placeholder:text-gray-400" />
                    </div>

                    <!-- Department (internal only): plain manual input; fixed roles appear as
                         selectable suggestions only while typing — no dropdown button -->
                    <div v-if="isInternal" class="relative" ref="deptRef">
                        <input type="text" v-model="form.department" :placeholder="currentLang === 'ar' ? 'القسم' : 'Department'"
                            @input="deptOpen = true"
                            class="w-full h-11 border border-[#04C18F80] rounded-xl px-4 text-sm outline-none focus:border-[#00896F] bg-white text-gray-900 placeholder:text-gray-400" />
                        <div v-if="deptOpen && form.department.trim() && filteredDepartments.length"
                            class="absolute z-30 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl p-1 max-h-48 overflow-auto">
                            <button v-for="d in filteredDepartments" :key="d" type="button" @mousedown.prevent="form.department = d; deptOpen = false"
                                class="w-full text-left rtl:text-right px-4 py-2 text-sm rounded-lg hover:bg-[#E6FDF9] text-gray-900">{{ d }}</button>
                        </div>
                    </div>

                    <!-- Name combobox (customer/vendor): search existing AR/AP names, already-added filtered out -->
                    <div v-if="!isInternal" class="relative" ref="nameRef">
                        <input type="text" v-model="form.name" :placeholder="nameLabel"
                            @focus="nameOpen = true" @input="nameOpen = true"
                            class="w-full h-11 border border-[#04C18F80] rounded-xl px-4 pr-9 text-sm outline-none focus:border-[#00896F] bg-white text-gray-900 placeholder:text-gray-400" />
                        <svg class="absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" :class="currentLang === 'ar' ? 'left-3' : 'right-3'"
                            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                        <div v-if="nameOpen && filteredCandidates.length"
                            class="absolute z-20 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl p-1 max-h-56 overflow-auto">
                            <button v-for="c in filteredCandidates" :key="c" type="button" @mousedown.prevent="form.name = c; nameOpen = false"
                                class="w-full text-left rtl:text-right px-4 py-2 text-sm rounded-lg hover:bg-[#E6FDF9] text-gray-900">{{ c }}</button>
                        </div>
                        <p v-if="candidatesLoading" class="text-[11px] text-gray-400 mt-1">{{ currentLang === 'ar' ? 'جار التحميل...' : 'Loading names…' }}</p>
                    </div>

                    <!-- Tax ID -->
                    <input v-if="!isInternal" type="text" v-model="form.tax_id" :placeholder="currentLang === 'ar' ? 'الرقم الضريبي' : 'Tax ID'"
                        class="w-full h-11 border border-[#04C18F80] rounded-xl px-4 text-sm outline-none focus:border-[#00896F] bg-white text-gray-900 placeholder:text-gray-400" />

                    <!-- Contact Person -->
                    <input v-if="!isInternal" type="text" v-model="form.contact_person" :placeholder="currentLang === 'ar' ? 'الشخص المسؤول' : 'Contact Person'"
                        class="w-full h-11 border border-[#04C18F80] rounded-xl px-4 text-sm outline-none focus:border-[#00896F] bg-white text-gray-900 placeholder:text-gray-400" />

                    <!-- Vendor order (Figma): Credit Limit before Phone/Email -->
                    <input v-if="type === 'vendor'" type="number" min="0" v-model="form.credit_limit" :placeholder="currentLang === 'ar' ? 'الحد الائتماني' : 'Credit Limit'"
                        class="w-full h-11 border border-[#04C18F80] rounded-xl px-4 text-sm outline-none focus:border-[#00896F] bg-white text-gray-900 placeholder:text-gray-400" />

                    <!-- Email (customer order: before phone) -->
                    <input v-if="type === 'customers'" type="email" v-model="form.email"
                        :placeholder="(currentLang === 'ar' ? 'بريد العميل *' : 'Customer Email *')"
                        class="w-full h-11 border border-[#04C18F80] rounded-xl px-4 text-sm outline-none focus:border-[#00896F] bg-white text-gray-900 placeholder:text-gray-400 placeholder:text-gray-400" />

                    <!-- Phone -->
                    <input type="text" v-model="form.phone_number" :placeholder="currentLang === 'ar' ? 'رقم الهاتف' : 'Phone Number'"
                        class="w-full h-11 border border-[#04C18F80] rounded-xl px-4 text-sm outline-none focus:border-[#00896F] bg-white text-gray-900 placeholder:text-gray-400" />

                    <!-- Email (vendor order: last) / internal email -->
                    <input v-if="type === 'vendor' || isInternal" type="email" v-model="form.email"
                        :placeholder="isInternal ? (currentLang === 'ar' ? 'البريد الإلكتروني *' : 'Email *') : (currentLang === 'ar' ? 'بريد المورد *' : 'Vendor Email *')"
                        class="w-full h-11 border border-[#04C18F80] rounded-xl px-4 text-sm outline-none focus:border-[#00896F] bg-white text-gray-900 placeholder:text-gray-400" />

                    <!-- Credit Limit (customer order: last) -->
                    <input v-if="type === 'customers'" type="number" min="0" v-model="form.credit_limit" :placeholder="currentLang === 'ar' ? 'الحد الائتماني' : 'Credit Limit'"
                        class="w-full h-11 border border-[#04C18F80] rounded-xl px-4 text-sm outline-none focus:border-[#00896F] bg-white text-gray-900 placeholder:text-gray-400" />

                    <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>

                    <div class="flex gap-3 pt-2">
                        <button @click="confirm" :disabled="saving"
                            class="flex-1 flex items-center justify-center gap-2 h-11 bg-[#008169] text-white rounded-xl text-sm font-medium hover:bg-[#006b56] transition-all disabled:opacity-50">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                            {{ saving ? '...' : (currentLang === 'ar' ? 'تأكيد' : 'Confirm') }}
                        </button>
                        <button @click="close"
                            class="flex-1 flex items-center justify-center gap-2 h-11 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            {{ currentLang === 'ar' ? 'إلغاء' : 'Cancel' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useContacts } from '~/composables/data-source/useContacts'
import { useInternalEmails } from '~/composables/data-source/useInternalEmails'

const props = defineProps({
    open:        Boolean,
    type:        { type: String, default: 'customers' }, // customers | vendor | internal-email
    currentLang: { type: String, default: 'en' },
})
const emit = defineEmits(['update:open', 'saved'])

const contactsApi = useContacts()
const emailsApi   = useInternalEmails()

const isInternal = computed(() => props.type === 'internal-email')
const idLabel    = computed(() => props.type === 'vendor'
    ? (props.currentLang === 'ar' ? 'معرف المورد' : 'Vendor ID')
    : (props.currentLang === 'ar' ? 'معرف العميل' : 'Customer ID'))
const nameLabel  = computed(() => props.type === 'vendor'
    ? (props.currentLang === 'ar' ? 'اسم المورد' : 'Vendor Name')
    : (props.currentLang === 'ar' ? 'اسم العميل' : 'Customer Name'))

const blankForm = () => ({
    identity: '', name: '', tax_id: '', contact_person: '',
    email: '', phone_number: '', credit_limit: '',
    employee_name: '', department: '',
})

const form = ref(blankForm())
const saving = ref(false)
const errorMsg = ref(null)

// name combobox
const candidates = ref([])
const candidatesLoading = ref(false)
const nameOpen = ref(false)
const nameRef = ref(null)

// department suggestions — static UI hints only (stored value is free text;
// sending always reads the department saved on internal_emails rows)
const departments = ref(['Sales', 'Procurement', 'Admin', 'Management', 'Accountant'])
const deptOpen = ref(false)
const deptRef = ref(null)

const filteredDepartments = computed(() => {
    const q = (form.value.department ?? '').trim().toLowerCase()
    if (!q) return departments.value
    return departments.value.filter(d => d.toLowerCase().includes(q))
})

const filteredCandidates = computed(() => {
    const q = form.value.name.trim().toLowerCase()
    if (!q) return candidates.value
    return candidates.value.filter(c => c.toLowerCase().includes(q))
})

watch(() => props.open, async (isOpen) => {
    if (!isOpen) return
    form.value = blankForm()
    errorMsg.value = null
    nameOpen.value = false
    deptOpen.value = false
    if (!isInternal.value) {
        const contactType = props.type === 'customers' ? 'customer' : 'vendor'
        try { form.value.identity = await contactsApi.generateIdentity(contactType) } catch {}
        candidatesLoading.value = true
        try { candidates.value = await contactsApi.fetchCandidates(contactType) } catch { candidates.value = [] }
        candidatesLoading.value = false
    }
})

const close = () => emit('update:open', false)

const confirm = async () => {
    errorMsg.value = null
    // client-side required checks (mirrors backend)
    if (isInternal.value) {
        if (!form.value.employee_name.trim() || !form.value.department.trim() || !form.value.email.trim()) {
            errorMsg.value = props.currentLang === 'ar' ? 'الموظف والقسم والبريد مطلوبة' : 'Employee, Department and Email are required.'
            return
        }
    } else if (!form.value.name.trim() || !form.value.email.trim()) {
        errorMsg.value = props.currentLang === 'ar' ? 'الاسم والبريد مطلوبان' : 'Name and Email are required.'
        return
    }

    saving.value = true
    try {
        let saved
        if (isInternal.value) {
            saved = await emailsApi.createEmail({
                employee_name: form.value.employee_name.trim(),
                department:    form.value.department.trim(),
                email:         form.value.email.trim(),
                phone_number:  form.value.phone_number || undefined,
            })
        } else {
            saved = await contactsApi.createContact({
                type:           props.type === 'customers' ? 'customer' : 'vendor',
                identity:       form.value.identity || undefined,
                name:           form.value.name.trim(),
                tax_id:         form.value.tax_id || undefined,
                contact_person: form.value.contact_person || undefined,
                email:          form.value.email.trim(),
                phone_number:   form.value.phone_number || undefined,
                credit_limit:   form.value.credit_limit !== '' ? Number(form.value.credit_limit) : undefined,
            })
        }
        emit('saved', saved)
        close()
    } catch (e) {
        const errs = e?.data?.errors
        errorMsg.value = errs ? Object.values(errs).flat().join(' ') : (e?.data?.message ?? 'Failed to save.')
    } finally {
        saving.value = false
    }
}

// close popovers on outside click
const onClickOutside = (ev) => {
    if (nameRef.value && !nameRef.value.contains(ev.target)) nameOpen.value = false
    if (deptRef.value && !deptRef.value.contains(ev.target)) deptOpen.value = false
}
onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
