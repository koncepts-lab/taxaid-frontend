export const usePermissions = () => {
  const accountType = useCookie('account_type')
  const raw = useCookie<any>('permissions')

  const permissions = computed<Record<string, boolean>>(() => {
    const value = raw.value
    if (!value) return {}
    if (typeof value === 'string') {
      try { return JSON.parse(value) } catch { return {} }
    }
    return value
  })

  const isTaxaid = computed(() => accountType.value === 'taxaid')
  const hasPermissions = computed(() => Object.keys(permissions.value).length > 0)

  const taxaidDenied = ['appointments.create', 'team.manage']
  const can = (key: string) => (isTaxaid.value ? !taxaidDenied.includes(key) : permissions.value[key] === true)

  const canAny = (keys: string[]) => keys.some(can)

  const financialSubTabs = computed(() => ({
    accounts_receivable: can('cards.accounts_receivable'),
    accounts_payable: can('cards.accounts_payable'),
    sales_forecast: can('data_source.sales_forecast'),
    cost_center: can('cards.cost_center'),
    other: can('data_source.financial_all'),
  }))

  const hasDataSourceEntry = computed(() =>
    can('data_source.access') && (
      Object.values(financialSubTabs.value).some(Boolean) ||
      can('data_source.manual_addition') ||
      can('data_source.contacts_certificate')
    )
  )

  const canEditFinancialData = computed(() => isTaxaid.value)

  return { permissions, isTaxaid, hasPermissions, can, canAny, financialSubTabs, hasDataSourceEntry, canEditFinancialData }
}
