// Common tooltip knowledge base: every info tooltip reads its text from here by key, so wording (EN + AR) is edited in one place.
export const TOOLTIPS: Record<string, { en: string; ar: string }> = {
  'costCenterDetail.chart': {
    en: 'Compares what has actually been booked against the budget for each line of this cost center. The variance is the budget minus the actual, as a share of the budget.',
    ar: 'يقارن المبلغ الفعلي المسجل بالميزانية لكل بند في مركز التكلفة هذا. الفرق هو الميزانية ناقص الفعلي كنسبة من الميزانية.',
  },
  'costCenterDetail.table': {
    en: 'Contract position and actual versus budget for this cost center. Year to Go is the budget still remaining for the financial year.',
    ar: 'مركز العقد والفعلي مقابل الميزانية لمركز التكلفة هذا. المتبقي من السنة هو الميزانية التي لم تُستخدم بعد في السنة المالية.',
  },
  'costCenterOverall.chart': {
    en: 'Revenue against total expenses (direct plus indirect) for each cost center, for the financial year up to the selected date. The letters match the project list under the chart.',
    ar: 'الإيرادات مقابل إجمالي المصروفات (المباشرة وغير المباشرة) لكل مركز تكلفة، للسنة المالية حتى التاريخ المحدد. الحروف تطابق قائمة المشاريع أسفل الرسم.',
  },
  'costCenterSummary.table': {
    en: 'Revenue, COGS, indirect expenses and profit for every cost center for the financial year up to the selected date, with a total row. Click a row to open that cost center.',
    ar: 'الإيرادات وتكلفة المبيعات والمصروفات غير المباشرة والربح لكل مركز تكلفة للسنة المالية حتى التاريخ المحدد، مع صف الإجمالي. اضغط على صف لفتح مركز التكلفة.',
  },
  'costCenterSummary.particulars': {
    en: 'The cost center (project) the figures on this row belong to.',
    ar: 'مركز التكلفة (المشروع) الذي تخص أرقام هذا الصف.',
  },
  'costCenterSummary.revenue': {
    en: 'Income booked to this cost center for the financial year up to the selected date.',
    ar: 'الإيرادات المسجلة على مركز التكلفة هذا للسنة المالية حتى التاريخ المحدد.',
  },
  'costCenterSummary.cogs': {
    en: "Cost of goods sold: the direct costs of delivering this cost center's revenue.",
    ar: 'تكلفة المبيعات: التكاليف المباشرة لتحقيق إيرادات مركز التكلفة هذا.',
  },
  'costCenterSummary.indirect': {
    en: 'Overheads and other indirect expenses charged to this cost center.',
    ar: 'المصروفات العامة والمصروفات غير المباشرة المحملة على مركز التكلفة هذا.',
  },
  'costCenterSummary.profit': {
    en: 'Revenue minus COGS minus indirect expenses.',
    ar: 'الإيرادات ناقص تكلفة المبيعات ناقص المصروفات غير المباشرة.',
  },
  'costCenterSummary.margin': {
    en: 'Profit as a percentage of revenue.',
    ar: 'الربح كنسبة مئوية من الإيرادات.',
  },
  'accountsPayable.summary': {
    en: 'Outstanding payables per vendor, split into aging buckets (days overdue) as of the selected date, with a total row. Click a vendor to see its invoices.',
    ar: 'المبالغ المستحقة لكل مورد موزعة على فئات التقادم (أيام التأخر) حتى التاريخ المحدد، مع صف الإجمالي. اضغط على مورد لعرض فواتيره.',
  },
  'accountsPayable.topCustomers': {
    en: 'The vendors with the largest outstanding payables as of the selected date. The line shows the cumulative share of total accounts payable.',
    ar: 'الموردون الذين لديهم أكبر المبالغ المستحقة حتى التاريخ المحدد. يوضح الخط النسبة التراكمية من إجمالي حسابات الدفع.',
  },
  'accountsPayable.historical': {
    en: 'Total accounts payable balance for each month, showing how the amount owed to vendors has moved over time.',
    ar: 'إجمالي رصيد حسابات الدفع لكل شهر، ويوضح كيف تغيرت المبالغ المستحقة للموردين مع الوقت.',
  },
  'accountsPayable.aging': {
    en: 'Outstanding payables grouped by how many days overdue they are, compared with the previous year. The line shows the cumulative share of total accounts payable.',
    ar: 'المبالغ المستحقة مجمعة حسب عدد أيام التأخر ومقارنة بالسنة الماضية. يوضح الخط النسبة التراكمية من إجمالي حسابات الدفع.',
  },
}

export const useTooltips = () => {
  const currentLang = useState('currentLang', () => 'en')

  const tip = (key: string): string => {
    const entry = TOOLTIPS[key]
    if (!entry) return ''

    return (currentLang.value === 'ar' ? entry.ar : entry.en) || entry.en
  }

  return { tip }
}
