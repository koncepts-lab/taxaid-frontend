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
  'accountsReceivable.summary': {
    en: 'Outstanding receivables per customer, split into aging buckets (days overdue) as of the selected date, with a total row. Click a customer to see its invoices and send payment reminders.',
    ar: 'المبالغ المستحقة لكل عميل موزعة على فئات التقادم (أيام التأخر) حتى التاريخ المحدد، مع صف الإجمالي. اضغط على عميل لعرض فواتيره وإرسال تذكيرات الدفع.',
  },
  'accountsReceivable.topCustomers': {
    en: 'The customers with the largest outstanding receivables as of the selected date. The line shows the cumulative share of total accounts receivable.',
    ar: 'العملاء الذين لديهم أكبر المبالغ المستحقة حتى التاريخ المحدد. يوضح الخط النسبة التراكمية من إجمالي حسابات القبض.',
  },
  'accountsReceivable.historical': {
    en: 'Total accounts receivable balance for each month, showing how the amount owed by customers has moved over time.',
    ar: 'إجمالي رصيد حسابات القبض لكل شهر، ويوضح كيف تغيرت المبالغ المستحقة على العملاء مع الوقت.',
  },
  'accountsReceivable.aging': {
    en: 'Outstanding receivables grouped by how many days overdue they are, compared with an earlier date. The line shows the cumulative share of total accounts receivable.',
    ar: 'المبالغ المستحقة مجمعة حسب عدد أيام التأخر ومقارنة بتاريخ سابق. يوضح الخط النسبة التراكمية من إجمالي حسابات القبض.',
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
  'cogsSummary.table': {
    en: 'Cost of goods sold by subgroup, comparing the current year, previous year and budget up to the selected date, with a total row. Click a row to view its ledgers.',
    ar: 'تكلفة المبيعات حسب كل مجموعة فرعية، مقارنة بالسنة الحالية والسنة السابقة والميزانية حتى التاريخ المحدد، مع صف الإجمالي. اضغط على صف لعرض دفاتره.',
  },
  'cogsSummary.cogs': {
    en: 'The COGS subgroup the figures on this row belong to. Click to expand its ledgers.',
    ar: 'المجموعة الفرعية لتكلفة المبيعات التي تخص أرقام هذا الصف. اضغط للتوسيع وعرض الدفاتر.',
  },
  'cogsSummary.currentYear': {
    en: 'Amount booked to this subgroup for the financial year up to the selected date.',
    ar: 'المبلغ المسجل على هذه المجموعة الفرعية للسنة المالية حتى التاريخ المحدد.',
  },
  'cogsSummary.previousYear': {
    en: 'Amount booked to this subgroup for the same period of the previous financial year.',
    ar: 'المبلغ المسجل على هذه المجموعة الفرعية لنفس الفترة من السنة المالية السابقة.',
  },
  'cogsSummary.budget': {
    en: 'Budgeted amount for this subgroup for the financial year.',
    ar: 'المبلغ المدرج بالميزانية لهذه المجموعة الفرعية للسنة المالية.',
  },
  'cogsSummary.variance': {
    en: 'Current year versus budget, as a percentage of budget.',
    ar: 'السنة الحالية مقابل الميزانية، كنسبة مئوية من الميزانية.',
  },
  'cogsSummary.ytg': {
    en: 'Year to Go: the share of the annual budget still remaining.',
    ar: 'المتبقي من السنة: النسبة المتبقية من الميزانية السنوية.',
  },
  'cogs.last6Months': {
    en: 'Total COGS for each of the last 6 months, compared with the same month a year earlier.',
    ar: 'إجمالي تكلفة المبيعات لكل شهر من آخر 6 أشهر، مقارنة بنفس الشهر من العام السابق.',
  },
  'cogs.revenueToCogsMonthly': {
    en: 'Revenue against COGS for each of the last 6 months, so you can see how the cost ratio has moved over time.',
    ar: 'الإيرادات مقابل تكلفة المبيعات لكل شهر من آخر 6 أشهر، لمتابعة تغير نسبة التكلفة مع الوقت.',
  },
  'cogs.breakdownByCategory': {
    en: 'COGS for the financial year up to the selected date, broken down by category, compared with the previous year.',
    ar: 'تكلفة المبيعات للسنة المالية حتى التاريخ المحدد، موزعة حسب الفئة، مقارنة بالسنة السابقة.',
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
