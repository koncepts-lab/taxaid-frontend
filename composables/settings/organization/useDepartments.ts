export const DEPARTMENTS: { key: string; en: string; ar: string }[] = [
  { key: 'management', en: 'Management', ar: 'الإدارة' },
  { key: 'finance_accounting', en: 'Finance & Accounting', ar: 'المالية والمحاسبة' },
  { key: 'sales', en: 'Sales', ar: 'المبيعات' },
  { key: 'ecommerce', en: 'E-commerce', ar: 'التجارة الإلكترونية' },
  { key: 'procurement', en: 'Procurement', ar: 'المشتريات' },
  { key: 'operations', en: 'Operations', ar: 'العمليات' },
  { key: 'logistics', en: 'Logistics & Supply Chain', ar: 'اللوجستيات وسلسلة الإمداد' },
  { key: 'customer_support', en: 'Customer Support', ar: 'خدمة العملاء' },
  { key: 'marketing', en: 'Marketing', ar: 'التسويق' },
  { key: 'hr', en: 'Human Resources', ar: 'الموارد البشرية' },
  { key: 'it', en: 'IT', ar: 'تقنية المعلومات' },
  { key: 'legal_compliance', en: 'Legal & Compliance', ar: 'الشؤون القانونية والامتثال' },
  { key: 'projects', en: 'Projects', ar: 'المشاريع' },
  { key: 'admin', en: 'Administration', ar: 'الشؤون الإدارية' },
  { key: 'other', en: 'Other', ar: 'أخرى' },
]

export const departmentLabel = (key: string | null | undefined, lang: string = 'en'): string => {
  if (!key) return ''
  const found = DEPARTMENTS.find((d) => d.key === key)
  if (found) return lang === 'ar' ? found.ar : found.en
  return key
}

export const useDepartments = () => ({ departments: DEPARTMENTS, departmentLabel })
