export const usePermissions = () => {
  const accountType = useCookie('account_type')
  const raw = useCookie<any>('permissions')

  const permissions = computed<Set<string>>(() => {
    let value = raw.value
    if (typeof value === 'string') {
      try { value = JSON.parse(value) } catch { value = [] }
    }
    return new Set(Array.isArray(value) ? value : [])
  })

  const isTaxaid = computed(() => accountType.value === 'taxaid')
  const hasPermissions = computed(() => permissions.value.size > 0)

  const taxaidDenied = ['appointments.create', 'team.manage']
  const has = (key: string) => permissions.value.has(key) || permissions.value.has(`${key.split('.')[0]}.*`)
  const can = (key: string) => (isTaxaid.value ? !taxaidDenied.includes(key) : has(key))

  const canAny = (keys: string[]) => keys.some(can)

  const financialSubTabs = computed(() => ({
    accounts_receivable: can('cards.accounts_receivable'),
    accounts_payable: can('cards.accounts_payable'),
    sales_forecast: can('data_source.sales_forecast'),
    cost_center: can('cards.cost_center'),
    other: can('data_source.financial_all'),
  }))

  const contactSubTabs = computed(() => ({
    customers: can('data_source.access') && can('cards.accounts_receivable'),
    vendor: can('data_source.access') && can('cards.accounts_payable'),
    'internal-email': can('data_source.access'),
  }))

  const hasDataSourceEntry = computed(() =>
    can('data_source.access') && (
      Object.values(financialSubTabs.value).some(Boolean) ||
      Object.values(contactSubTabs.value).some(Boolean) ||
      can('data_source.manual_addition') ||
      can('data_source.contacts_certificate')
    )
  )

  const canEditFinancialData = computed(() => isTaxaid.value)

  return { permissions, isTaxaid, hasPermissions, can, canAny, financialSubTabs, contactSubTabs, hasDataSourceEntry, canEditFinancialData }
}
