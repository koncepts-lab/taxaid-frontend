const LABELS: Record<string, { en: string; ar: string }> = {
  master_user: { en: 'Master', ar: 'المدير الرئيسي' },
  account_user: { en: 'Accounts', ar: 'المحاسبة' },
  sales_user: { en: 'Sales', ar: 'المبيعات' },
  procurement_user: { en: 'Procurement', ar: 'المشتريات' },
  project_manager_user: { en: 'Project Manager', ar: 'مدير المشاريع' },
  partner_user: { en: 'Partner', ar: 'شريك' },
  guest_user: { en: 'Guest', ar: 'ضيف' },
  implementation_consultant: { en: 'Implementation Consultant', ar: 'مستشار التنفيذ' },
  review_team: { en: 'Review Team', ar: 'فريق المراجعة' },
}

const titleCase = (value: string) =>
  value
    .replace(/_user$/, '')
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export const roleLabel = (role: string | null | undefined, lang: string = 'en'): string => {
  if (!role) return ''
  const known = LABELS[role]
  if (known) return lang === 'ar' ? known.ar : known.en
  return titleCase(role)
}

export const isOwner = (user: { role?: string | null; is_primary?: boolean } | null | undefined): boolean =>
  user?.role === 'master_user' && !!user?.is_primary

export const userRoleLabel = (user: { role?: string | null; is_primary?: boolean }, lang: string = 'en'): string =>
  isOwner(user) ? (lang === 'ar' ? 'المالك' : 'Owner') : roleLabel(user?.role, lang)

const BADGES: Record<string, string> = {
  owner: 'bg-[#D1FAE5] text-[#065F46]',
  master_user: 'bg-indigo-100 text-indigo-700',
  account_user: 'bg-blue-100 text-blue-700',
  sales_user: 'bg-orange-100 text-orange-700',
  procurement_user: 'bg-purple-100 text-purple-700',
  project_manager_user: 'bg-cyan-100 text-cyan-700',
  partner_user: 'bg-pink-100 text-pink-700',
  guest_user: 'bg-gray-100 text-gray-600',
  implementation_consultant: 'bg-teal-100 text-teal-700',
  review_team: 'bg-yellow-100 text-yellow-700',
}

export const roleBadgeClass = (user: { role?: string | null; is_primary?: boolean }): string =>
  BADGES[isOwner(user) ? 'owner' : (user?.role ?? '')] ?? 'bg-gray-100 text-gray-600'



const DESCRIPTIONS: Record<string, { en: string; ar: string }> = {
  master_user: { en: 'Full access to the organization and its settings', ar: 'وصول كامل إلى المؤسسة وإعداداتها' },
  account_user: { en: 'Manages accounts, receivables and payables', ar: 'يدير الحسابات والذمم المدينة والدائنة' },
  sales_user: { en: 'Works with sales, customers and forecasts', ar: 'يعمل على المبيعات والعملاء والتوقعات' },
  procurement_user: { en: 'Handles purchasing and supplier payments', ar: 'يتولى المشتريات ومدفوعات الموردين' },
  project_manager_user: { en: 'Tracks project costs and budgets', ar: 'يتابع تكاليف المشاريع والميزانيات' },
  partner_user: { en: 'External partner with limited access', ar: 'شريك خارجي بصلاحيات محدودة' },
  guest_user: { en: 'Read-only, view access only', ar: 'للقراءة فقط' },
}

const ICONS: Record<string, string> = {
  master_user: '<path d="M12 2l3 6 6 .9-4.5 4.4 1 6.2L12 16.6 6.5 19.5l1-6.2L3 8.9 9 8z"/>',
  account_user: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h8"/>',
  sales_user: '<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
  procurement_user: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/>',
  project_manager_user: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/>',
  partner_user: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8"/>',
  guest_user: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
}

export const roleDescription = (role: string | null | undefined, lang: string = 'en'): string => {
  const known = role ? DESCRIPTIONS[role] : null
  return known ? (lang === 'ar' ? known.ar : known.en) : ''
}

export const roleIcon = (role: string | null | undefined): string =>
  (role && ICONS[role]) || '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1"/>'

export const useRoleLabel = () => ({ roleLabel, userRoleLabel, roleBadgeClass, isOwner, roleDescription, roleIcon })
