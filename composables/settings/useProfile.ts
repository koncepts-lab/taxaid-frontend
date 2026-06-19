import { ref } from 'vue'

export interface PermanentAddress {
  street: string
  city: string
  state: string
  zip: string
}

export interface CommunicationAddress {
  label: string
  street: string
  city: string
  state: string
  zip: string
}

export interface RelatedEntity {
  name: string
  type: string
  ein: string
  state: string
  date: string
}

export interface KeyContact {
  initials: string
  name: string
  role: string
  email: string
  phone: string
  department: string
  notes: string
}

export interface Profile {
  email: string
  phone: string
  companyName: string
  firstName: string | null
  lastName: string | null
  companyLegalName: string | null
  companyNickname: string | null
  ein: string | null
  entityType: string | null
  founded: string | null
  industry: string | null
  fiscalYearEnd: string | null
  profilePic: string | null
  permanentAddress: PermanentAddress
  communicationAddresses: CommunicationAddress[]
  relatedEntities: RelatedEntity[]
  keyContacts: KeyContact[]
}

const _profile    = ref<Profile | null>(null)
const _loading    = ref(false)
const _saving     = ref(false)
const _error      = ref<string | null>(null)
const _pictureUrl = ref<string | null>(null)

async function _loadPictureBlobUrl(): Promise<void> {
  if (!_profile.value?.profilePic) {
    _pictureUrl.value = null
    return
  }
  const config = useRuntimeConfig()
  const token  = useCookie('auth_token')
  try {
    const res = await fetch(`${config.public.apiBase}/profile/picture`, {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    if (res.ok) {
      const blob = await res.blob()
      if (_pictureUrl.value) URL.revokeObjectURL(_pictureUrl.value)
      _pictureUrl.value = URL.createObjectURL(blob)
    } else {
      _pictureUrl.value = null
    }
  } catch {
    _pictureUrl.value = null
  }
}

export function useProfile() {
  async function fetchProfile(force = false): Promise<void> {
    if (_profile.value && !force) return
    _loading.value = true
    _error.value   = null
    try {
      const res: any = await useApi('/profile')
      _profile.value = res.data ?? null
      await _loadPictureBlobUrl()
    } catch (err: any) {
      _error.value = err?.data?.message ?? 'Failed to load profile.'
    } finally {
      _loading.value = false
    }
  }

  async function saveProfile(data: Partial<Profile>): Promise<void> {
    _saving.value = true
    _error.value  = null
    try {
      const payload = {
        first_name:               data.firstName,
        last_name:                data.lastName,
        company_name:             data.companyName,
        company_legal_name:       data.companyLegalName,
        company_nickname:         data.companyNickname,
        ein:                      data.ein,
        entity_type:              data.entityType,
        founded_year:             data.founded,
        industry:                 data.industry,
        fiscal_year_end:          data.fiscalYearEnd,
        email:                    data.email,
        phone:                    data.phone,
        permanent_address:        data.permanentAddress,
        communication_addresses:  data.communicationAddresses,
        related_entities:         data.relatedEntities,
        key_contacts:             data.keyContacts,
      }
      const res: any = await useApi('/profile', { method: 'PUT', body: payload })
      _profile.value = res.data ?? null
    } catch (err: any) {
      _error.value = err?.data?.message ?? 'Failed to save profile.'
      throw err
    } finally {
      _saving.value = false
    }
  }

  async function uploadPicture(file: File): Promise<void> {
    _error.value = null
    try {
      const form = new FormData()
      form.append('picture', file)
      const res: any = await useApi('/profile/picture', { method: 'POST', body: form })
      _profile.value = res.data ?? null
      await _loadPictureBlobUrl()
    } catch (err: any) {
      _error.value = err?.data?.message ?? 'Failed to upload picture.'
      throw err
    }
  }

  function getPictureUrl(): string | null {
    return _profile.value?.profilePic ?? null
  }

  return {
    profile:      _profile,
    pictureUrl:   _pictureUrl,
    loading:      _loading,
    saving:       _saving,
    error:        _error,
    fetchProfile,
    saveProfile,
    uploadPicture,
    getPictureUrl,
  }
}
