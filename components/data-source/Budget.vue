<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    isDark: Boolean,
    currentLang: String
});

const isModalOpen = ref(false);
const isVarianceModalOpen = ref(false);
const modalConfig = ref({
    title: '',
    columns: [],
    data: [],
    showSiNo: false,
    totals: {}
});

const months = [
    { en: 'Jan-26', ar: 'يناير-26', key: 'jan' },
    { en: 'Feb-26', ar: 'فبراير-26', key: 'feb' },
    { en: 'Mar-26', ar: 'مارس-26', key: 'mar' },
    { en: 'Apr-26', ar: 'أبريل-26', key: 'apr' },
    { en: 'May-26', ar: 'مايو-26', key: 'may' },
    { en: 'Jun-26', ar: 'يونيو-26', key: 'jun' },
    { en: 'Jul-26', ar: 'يوليو-26', key: 'jul' },
    { en: 'Aug-26', ar: 'أغسطس-26', key: 'aug' },
    { en: 'Sep-26', ar: 'سبتمبر-26', key: 'sep' },
    { en: 'Oct-26', ar: 'أكتوبر-26', key: 'oct' },
    { en: 'Nov-26', ar: 'نوفمبر-26', key: 'nov' },
    { en: 'Dec-26', ar: 'ديسمبر-26', key: 'dec' }
];

const plColumns = [
    { label: 'Particulars', labelAr: 'التفاصيل', key: 'name', sticky: true },
    ...months.map(m => ({ label: m.en, labelAr: m.ar, key: m.key })),
    { label: 'Total', labelAr: 'الإجمالي', key: 'total', fontBold: true }
];

const bsColumns = [
    { label: 'Main Group', labelAr: 'المجموعة الرئيسية', key: 'mainGroup' },
    { label: 'Sub Group', labelAr: 'المجموعة الفرعية', key: 'subGroup' },
    { label: 'Particulars', labelAr: 'التفاصيل', key: 'name', sticky: true },
    ...months.map(m => ({ label: m.en, labelAr: m.ar, key: m.key }))
];
const salaryColumns = [
    { label: 'Employee No.', labelAr: 'رقم الموظف', key: 'empNo' },
    { label: 'Staff Name', labelAr: 'اسم الموظف', key: 'name', sticky: true },
    { label: 'Present Salary', labelAr: 'الراتب الحالي', key: 'presentSalary' },
    ...months.map(m => ({ label: m.en, labelAr: m.ar, key: m.key })),
    { label: 'Total', labelAr: 'الإجمالي', key: 'total', fontBold: true }
];
const fixedAssetsColumns = [
    { label: 'Main Group', labelAr: 'المجموعة الرئيسية', key: 'mainGroup' },
    { label: 'Sub Group', labelAr: 'المجموعة الفرعية', key: 'subGroup' },
    { label: 'Particulars', labelAr: 'التفاصيل', key: 'name', sticky: true },
    ...months.map(m => ({ label: m.en, labelAr: m.ar, key: m.key }))
];
const plData = ref([
    {
        name: 'Revenue',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000',
        jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000',
        total: '15,000,000'
    },
    {
        name: 'Direct Costs',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000',
        jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000',
        total: '15,000,000'
    },
    {
        name: 'Gross Profit',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000',
        jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000',
        total: '15,000,000'
    },
    {
        name: 'Other Indirect Income',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000',
        jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000',
        total: '15,000,000'
    },
    {
        name: 'Indirect Expenses',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000',
        jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000',
        total: '15,000,000'
    },
    {
        name: 'Managerial Remuneration',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000',
        jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000',
        total: '15,000,000'
    },
    {
        name: 'Net(Loss profit for the month)',
        type: 'net-row',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000',
        jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000',
        total: '15,000,000'
    }
]);

const bsData = ref([
    { mainGroup: 'Assets', type: 'header' },
    { mainGroup: '', subGroup: '', name: 'Fixed Assets', jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000' },
    { mainGroup: '', subGroup: '', name: 'Current Assets', jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000' },
    { name: 'Total Assets', type: 'total-row', jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000' },
    { mainGroup: 'Liabilities & Equity', type: 'header' },
    { mainGroup: '', subGroup: '', name: "Shareholder's Equity", jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000' },
    { mainGroup: '', subGroup: '', name: "Long-Term Liabilities", jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000' }
    ,
    { mainGroup: '', subGroup: '', name: "Current Liabilities", jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000' },
    { name: 'Total Liabilities and Equity', type: 'total-row', jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000' },


]);
const fixedAssetsData = ref([
    {
        mainGroup: 'Fixed Assets',
        subGroup: 'Fixed Assets - Vehicles',
        name: 'Fixed Assets - Vehicles',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Fixed Assets',
        subGroup: 'Fixed Assets - Office',
        name: 'Fixed Assets - Computers',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Fixed Assets',
        subGroup: 'Fixed Assets - Machinery',
        name: 'Fixed Assets - Machinery',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Fixed Assets',
        subGroup: 'Fixed Assets - Office',
        name: 'Fixed Assets - Furniture & Fixture',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Fixed Assets',
        subGroup: 'Fixed Assets - Office',
        name: 'Fixed Assets - Office Renovation',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Fixed Assets',
        subGroup: 'Fixed Assets - Office',
        name: 'Fixed Assets - Office Equipment',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Fixed Assets',
        subGroup: 'Fixed Assets - Office',
        name: 'Fixed Assets - Electrical & Tools',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Total Fixed Assets',
        type: 'header', // Light Teal Background
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Fixed Assets',
        subGroup: 'Fixed Assets',
        name: 'Accumulated Depreciation',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Net Fixed Assets',
        type: 'net-row', // Solid Mint Background
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    }
]);
const currentAssetsData = ref([
    {
        mainGroup: 'Current Assets',
        subGroup: 'Sundry Debtors',
        name: 'Sundry Debtors',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        name: '',
        type: 'header', // Light Teal Highlight Row
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Closing Stock',
        name: 'Closing Stock',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        name: '',
        type: 'header', // Light Teal Highlight Row
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Loans & Advanced Assets',
        name: 'Loan & Advances - Mr. Bayan Al Masoud',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Salary Loan & Advances',
        name: 'Loan & Advances - Salahat',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        name: '',
        type: 'header', // Light Teal Highlight Row
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Other Current Assets',
        name: 'Retention Receivable',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Other Current Assets',
        name: 'Bank Margin Receivable',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Other Current Assets',
        name: 'Muayaid Albaroudi (CA)',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Other Current Assets',
        name: 'Refundable Deposit',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Total Current Assets',
        type: 'net-row',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    }
]);
const capitalData = ref([
    {
        mainGroup: 'Shareholder Equity',
        subGroup: 'Capital Account',
        name: 'Current Account',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Shareholder Equity',
        subGroup: 'Capital Account',
        name: 'Share Capital',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Shareholder Equity',
        subGroup: 'Capital Account',
        name: 'Statutory Reserve',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        name: '',
        type: 'header',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Capital Account',
        name: 'Profit & Loss A/C',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Capital Account',
        name: 'Net Profit/Loss for the period',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Capital Account',
        name: 'Closing Balance',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Total Shareholder Equity',
        type: 'net-row',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    }
]);
const nonCurrentLiabilitiesData = ref([
    {
        mainGroup: 'Non Current Liabilities',
        subGroup: 'Provisions',
        name: 'Provision for End of Service',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        name: '',
        type: 'header',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Total Non Current Liabilities',
        type: 'net-row',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    }
]);
const currentLiabilityData = ref([
    {
        mainGroup: 'Current Liability',
        subGroup: 'Loans (Liability)',
        name: 'Loan Account - Mr. Basem',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Liability',
        subGroup: 'Loans (Liability)',
        name: 'ADCB Car Loan',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        name: '',
        type: 'header',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Salary Payable',
        name: 'Managerial Remuneration Payable',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Current Liabilities',
        name: 'Bluedge General Trading LLC',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Current Liabilities',
        name: 'Leave Salary Payable A/c',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        name: '',
        type: 'header',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Other Payables',
        name: 'Utilities Payable',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Other Payables',
        name: 'Etisalat Payable',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        name: '',
        type: 'header',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Current Assets',
        subGroup: 'Sundry Creditors',
        name: 'Sundry Creditors',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Total Current Liability',
        type: 'net-row',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    }
]);
const budgetedRevenueData = ref([
    {
        mainGroup: 'Revenue',
        subGroup: 'Revenue From Project',
        name: 'Revenue From Project',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Revenue',
        subGroup: 'Revenue From Inpro',
        name: 'Revenue From Inpro',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Revenue',
        subGroup: 'Revenue From Veda',
        name: 'Revenue From Veda',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Total',
        type: 'net-row',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    }
]);
const budgetedIndirectIncomeData = ref([
    {
        mainGroup: 'Revenue',
        subGroup: 'Revenue From Project',
        name: 'Revenue From Project',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Revenue',
        subGroup: 'Revenue From Inpro',
        name: 'Revenue From Inpro',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Revenue',
        subGroup: 'Revenue From Veda',
        name: 'Revenue From Veda',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Total',
        type: 'net-row',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    }
]);
const budgetedIndirectExpensesData = ref([
    {
        mainGroup: 'Indirect expenses', subGroup: 'Employee Costs', name: 'Salary',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Indirect expenses', subGroup: 'Office Expense', name: 'Office Rent',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Indirect expenses', subGroup: 'Utilities', name: 'Utilities',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Indirect expenses', subGroup: 'Vehicle Running Expense', name: 'Vehicle Running Expenses',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Indirect expenses', subGroup: 'Employee Costs', name: 'End Of Service Provision',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Indirect expenses', subGroup: 'Employee Costs', name: 'Leave Salary Provision',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Indirect expenses', subGroup: 'Indirect Expenses', name: 'Depreciation Expense',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Indirect expenses', subGroup: 'Office Expense', name: 'Office Expenses',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Indirect expenses', subGroup: 'Indirect Expenses', name: 'Travelling Expense',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Indirect expenses', subGroup: 'Legal And Professional Charges', name: 'Legal Expenses',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Indirect expenses', subGroup: 'Employee Costs', name: 'Visa Expenses',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Total',
        type: 'net-row',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    }
]);
const budgetedDirectExpensesData = ref([
    {
        mainGroup: 'Direct Expenses', subGroup: 'Material Purchase', name: 'Material Purchase',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Direct Expenses', subGroup: 'Material Purchase', name: 'Inpro Purchase',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Direct Expenses', subGroup: 'Material Purchase', name: 'Veda Purchase',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Direct Expenses', subGroup: 'Subcontract Cost', name: 'Subcontract Cost',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Direct Expenses', subGroup: 'Labor Cost', name: 'Labor Cost',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Direct Expenses', subGroup: 'Installation Cost', name: 'Erection Cost',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Direct Expenses', subGroup: 'Equipment Rental Expense', name: 'Equipment Rental',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Direct Expenses', subGroup: 'Other Direct Costs', name: 'Tools & Accessories',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Direct Expenses', subGroup: 'Custom Duty', name: 'Custom Duty',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Direct Expenses', subGroup: 'Transport and Delivery Expenses', name: 'Transport & Delivery',
        jan: '1,250,000', feb: '1,250,000', mar: '1,250,000', apr: '1,250,000', may: '1,250,000', jun: '1,250,000', jul: '1,250,000', aug: '1,250,000', sep: '1,250,000', oct: '1,250,000', nov: '1,250,000', dec: '1,250,000'
    },
    {
        mainGroup: 'Total',
        type: 'net-row',
        jan: '12,500,000', feb: '12,500,000', mar: '12,500,000', apr: '12,500,000', may: '12,500,000', jun: '12,500,000', jul: '12,500,000', aug: '12,500,000', sep: '12,500,000', oct: '12,500,000', nov: '12,500,000', dec: '12,500,000'
    }
]);
const budgetedSalariesData = ref([
    {
        empNo: 'E004',
        name: 'RAFEEKH THUNDAKACHI',
        presentSalary: '3000.00',
        jan: '3500', feb: '3500', mar: '3500', apr: '3500', may: '3500', jun: '3500',
        jul: '3500', aug: '3500', sep: '3500', oct: '3500', nov: '3500', dec: '3500', total: '15,000'
    },
    {
        empNo: 'E004',
        name: 'RAFEEKH THUNDAKACHI',
        presentSalary: '3000.00',
        jan: '3500', feb: '3500', mar: '3500', apr: '3500', may: '3500', jun: '3500',
        jul: '3500', aug: '3500', sep: '3500', oct: '3500', nov: '3500', dec: '3500', total: '15,000'
    },
    {
        empNo: 'E004',
        name: 'RAFEEKH THUNDAKACHI',
        presentSalary: '3000.00',
        jan: '3500', feb: '3500', mar: '3500', apr: '3500', may: '3500', jun: '3500',
        jul: '3500', aug: '3500', sep: '3500', oct: '3500', nov: '3500', dec: '3500', total: '15,000'
    }, {
        empNo: 'E004',
        name: 'RAFEEKH THUNDAKACHI',
        presentSalary: '3000.00',
        jan: '3500', feb: '3500', mar: '3500', apr: '3500', may: '3500', jun: '3500',
        jul: '3500', aug: '3500', sep: '3500', oct: '3500', nov: '3500', dec: '3500', total: '15,000'
    }, {
        empNo: 'E004',
        name: 'RAFEEKH THUNDAKACHI',
        presentSalary: '3000.00',
        jan: '3500', feb: '3500', mar: '3500', apr: '3500', may: '3500', jun: '3500',
        jul: '3500', aug: '3500', sep: '3500', oct: '3500', nov: '3500', dec: '3500', total: '15,000'
    }, {
        empNo: 'E004',
        name: 'RAFEEKH THUNDAKACHI',
        presentSalary: '3000.00',
        jan: '3500', feb: '3500', mar: '3500', apr: '3500', may: '3500', jun: '3500',
        jul: '3500', aug: '3500', sep: '3500', oct: '3500', nov: '3500', dec: '3500', total: '15,000'
    }, {
        empNo: 'E004',
        name: 'RAFEEKH THUNDAKACHI',
        presentSalary: '3000.00',
        jan: '3500', feb: '3500', mar: '3500', apr: '3500', may: '3500', jun: '3500',
        jul: '3500', aug: '3500', sep: '3500', oct: '3500', nov: '3500', dec: '3500', total: '15,000'
    }, {
        empNo: 'E004',
        name: 'RAFEEKH THUNDAKACHI',
        presentSalary: '3000.00',
        jan: '3500', feb: '3500', mar: '3500', apr: '3500', may: '3500', jun: '3500',
        jul: '3500', aug: '3500', sep: '3500', oct: '3500', nov: '3500', dec: '3500', total: '15,000'
    }, {
        empNo: 'E004',
        name: 'RAFEEKH THUNDAKACHI',
        presentSalary: '3000.00',
        jan: '3500', feb: '3500', mar: '3500', apr: '3500', may: '3500', jun: '3500',
        jul: '3500', aug: '3500', sep: '3500', oct: '3500', nov: '3500', dec: '3500', total: '15,000'
    }, {
        empNo: 'E004',
        name: 'RAFEEKH THUNDAKACHI',
        presentSalary: '3000.00',
        jan: '3500', feb: '3500', mar: '3500', apr: '3500', may: '3500', jun: '3500',
        jul: '3500', aug: '3500', sep: '3500', oct: '3500', nov: '3500', dec: '3500', total: '15,000'
    },

    {
        empNo: 'Grand Total',
        type: 'net-row',
        presentSalary: '33000.00',
        jan: '38500', feb: '38500', mar: '38500', apr: '38500', may: '38500', jun: '38500',
        jul: '38500', aug: '38500', sep: '38500', oct: '38500', nov: '38500', dec: '38500', total: '15,000'
    }
]);
const handleReportOpen = (itemId, title) => {
    switch (itemId) {
        case 'b_profit_loss':
            modalConfig.value = {
                title,
                columns: plColumns,
                data: plData.value,
                showSiNo: false
            };
            break;

        case 'b_balance_sheet':
            modalConfig.value = {
                title,
                columns: bsColumns,
                data: bsData.value,
                showSiNo: false
            };
            break;

        case 'b_fixed_assets':
            modalConfig.value = {
                title,
                columns: fixedAssetsColumns,
                data: fixedAssetsData.value,
                showSiNo: false
            };
            break;
        case 'b_current_assets':
            modalConfig.value = {
                title,
                columns: fixedAssetsColumns,
                data: currentAssetsData.value,
                showSiNo: false
            };
            break;

        case 'b_capital':
            modalConfig.value = {
                title,
                columns: fixedAssetsColumns,
                data: capitalData.value,
                showSiNo: false
            };
            break;
        case 'b_non_current_liab':
            modalConfig.value = {
                title,
                columns: fixedAssetsColumns,
                data: nonCurrentLiabilitiesData.value,
                showSiNo: false
            };
            break;

        case 'b_current_liab':
            modalConfig.value = {
                title,
                columns: fixedAssetsColumns,
                data: currentLiabilityData.value,
                showSiNo: false
            };
            break;
        case 'b_revenue':
            modalConfig.value = {
                title,
                columns: fixedAssetsColumns,
                data: budgetedRevenueData.value,
                showSiNo: false
            };
            break;
        case 'b_indirect_income':
            modalConfig.value = {
                title,
                columns: fixedAssetsColumns,
                data: budgetedIndirectIncomeData.value,
                showSiNo: false
            };
            break;
        case 'b_direct_exp':
            modalConfig.value = {
                title,
                columns: fixedAssetsColumns,
                data: budgetedDirectExpensesData.value,
                showSiNo: false
            };
            break;
        case 'b_indirect_exp':
            modalConfig.value = {
                title,
                columns: fixedAssetsColumns,
                data: budgetedIndirectExpensesData.value,
                showSiNo: false
            };
            break;
        case 'b_salaries':
            modalConfig.value = {
                title,
                columns: salaryColumns,
                data: budgetedSalariesData.value,
                showSiNo: false
            };
            break;

        default:
            modalConfig.value = {
                title,
                columns: [
                    { label: 'Particulars', labelAr: 'التفاصيل', key: 'name', sticky: true },
                    ...months.map(m => ({ label: m.en, labelAr: m.ar, key: m.key }))
                ],
                data: [{ name: '-', jan: '-', feb: '-' }],
                showSiNo: true
            };
    }

    isModalOpen.value = true;
};

const budgetSections = [
    {
        id: 'financial',
        label: 'Financial Statements',
        labelAr: 'القوائم المالية',
        lightHeaderBg: 'bg-[#DBEAFE] border border-[#BEDBFF]',
        darkHeaderBg: 'bg-blue-900/40',
        lightCardBg: 'bg-[#EFF6FF] border-[#BEDBFF]',
        buttonBg: 'bg-[#2063BB] hover:bg-[#1e4d8c]',
        items: [
            { id: 'b_balance_sheet', title: 'Balance sheet', titleAr: 'الميزانية العمومية المرصودة' },
            { id: 'b_profit_loss', title: 'Profit & Loss', titleAr: 'الأرباح والخسائر المرصودة' },
        ]
    },
    {
        id: 'assets',
        label: 'Assets & Liabilities',
        labelAr: 'الأصول والالتزامات',
        lightHeaderBg: 'bg-[#F3E8FF] border border-[#E9D4FF]',
        darkHeaderBg: 'bg-purple-900/40',
        lightCardBg: 'bg-[#FAF5FF] border-[#E9D4FF]',
        buttonBg: 'bg-[#733EB9] hover:bg-[#5a3091]',
        items: [
            { id: 'b_fixed_assets', title: 'Fixed Assets', titleAr: 'الأصول الثابتة المرصودة' },
            { id: 'b_current_assets', title: 'Current assets', titleAr: 'الأصول المتداولة المرصودة' },
            { id: 'b_capital', title: 'Capital', titleAr: 'رأس المال المرصود' },
            { id: 'b_non_current_liab', title: 'Non Current liability', titleAr: 'الالتزامات غير المتداولة المرصودة' },
            { id: 'b_current_liab', title: 'Current liability', titleAr: 'الالتزامات المتداولة المرصودة' },
        ]
    },
    {
        id: 'income',
        label: 'Income & Expenses',
        labelAr: 'الإيرادات والمصروفات',
        lightHeaderBg: 'bg-[#DCFCE7] border border-[#B9F8CF]',
        darkHeaderBg: 'bg-green-900/40',
        lightCardBg: 'bg-[#F0FDF4] border-[#B9F8CF]',
        buttonBg: 'bg-[#138A44] hover:bg-[#0e6934]',
        items: [
            { id: 'b_revenue', title: 'Revenue', titleAr: 'الإيرادات المرصودة' },
            { id: 'b_indirect_income', title: 'Indirect Income', titleAr: 'الدخل غير المباشر المرصود' },
            { id: 'b_direct_exp', title: 'Direct expenses', titleAr: 'المصروفات المباشرة المرصودة' },
            { id: 'b_indirect_exp', title: 'Indirect expenses', titleAr: 'المصروفات غير المباشرة المرصودة' },
            { id: 'b_salaries', title: 'Salaries', titleAr: 'الرواتب المرصودة' },
        ]
    }
];

</script>

<template>
    <div class="content-area rounded-[20px] lg:p-8 p-4 transition-all duration-300"
        :class="isDark ? 'bg-[#015F4D]/20 border border-[#00B794]/30' : 'bg-white border border-gray-100 shadow-sm'">

        <div class="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
                <h2 class="text-lg font-normal transition-colors duration-300"
                    :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">
                    {{ currentLang === 'ar' ? 'تخطيط الميزانية' : 'Budget Planning' }}
                </h2>
                <p class="text-base mt-1 transition-colors duration-300"
                    :class="isDark ? 'text-white/60' : 'text-[#00000080]'">
                    {{ currentLang === 'ar' ? 'تتبع ميزانيات الأقسام والفروقات' : 'Track departmental budgets and variances'
                    }}
                </p>
            </div>
            
            <button @click="isVarianceModalOpen = true" 
                    class="flex items-center gap-2 px-4 py-2.5 bg-[#00896A] text-white rounded-lg text-[14px] font-medium hover:bg-[#007056] transition-colors whitespace-nowrap shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ currentLang === 'ar' ? 'التحقق من التباين' : 'Check Variance' }}
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            <div v-for="section in budgetSections" :key="section.id" class="flex flex-col gap-6">
                <div class="py-2.5 px-6 rounded-lg text-sm font-semibold transition-all duration-500"
                    :class="isDark ? section.darkHeaderBg : section.lightHeaderBg">
                    <span :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">
                        {{ currentLang === 'ar' ? section.labelAr : section.label }}
                    </span>
                </div>

                <div v-for="item in section.items" :key="item.id"
                    class="p-6 rounded-2xl border transition-all duration-300" :class="[
                        isDark ? 'bg-white/5 border-white/10 hover:border-white/20' : section.lightCardBg + ' hover:shadow-md'
                    ]">
                    <h3 class="text-base font-medium mb-6" :class="isDark ? 'text-white' : 'text-[#0A0A0A]'">
                        Budgeted - {{ currentLang === 'ar' ? item.titleAr : item.title }}
                    </h3>

                    <button @click="handleReportOpen(item.id, currentLang === 'ar' ? item.titleAr : item.title)"
                        class="flex items-center justify-center gap-2 w-full py-2.5 text-white rounded-lg text-base font-normal transition-all active:scale-95 shadow-sm"
                        :class="section.buttonBg">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                        {{ currentLang === 'ar' ? 'عرض التقرير' : 'View Detailed Report' }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Ensure component name matches your actual file name -->
    <DataSourceBudgetModal :isOpen="isModalOpen" :title="modalConfig.title" :columns="modalConfig.columns"
        :data="modalConfig.data" :isDark="isDark" :currentLang="currentLang" :showSiNo="modalConfig.showSiNo"
        @close="isModalOpen = false" />
        
    <DataSourceVarianceModal 
        :isOpen="isVarianceModalOpen" 
        :isDark="isDark" 
        :currentLang="currentLang"
        @close="isVarianceModalOpen = false"
        @confirm="isVarianceModalOpen = false"
    />
</template>