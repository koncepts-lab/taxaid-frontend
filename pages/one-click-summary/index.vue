<template>
  <NuxtLayout name="dashboard">
    <div v-if="!isFullScreenChat" class="min-h-screen font-sans flex relative z-10" :class="{ 'dark': isDark }" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <div class="flex-1 min-w-0 no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-0 pt-0"
           :class="[
               isChatOpen 
                   ? (currentLang === 'ar' ? '2xl:ml-[480px] ml-[400px]' : '2xl:mr-[480px] mr-[400px]')
                   : (currentLang === 'ar' ? 'lg:ml-[170px] ml-0' : 'lg:mr-[170px] mr-0')
           ]">
        
        <div class="mb-8 mt-4 mx-4 lg:mx-0">
          <h1 class="text-2xl font-semibold mb-2" :class="isDark ? 'text-white' : 'text-[#013E32]'">
            {{ currentLang === 'ar' ? 'ملخص بنقرة واحدة' : 'One Click Summary' }}
          </h1>
          <p class="text-sm" :class="isDark ? 'text-white/60' : 'text-gray-500'">
            {{ currentLang === 'ar' ? 'انقر على أي بطاقة للحصول على رؤى وتوصيات مدعومة بالذكاء الاصطناعي.' : 'Click any card for AI-powered insights & recommendations.' }}
          </p>
        </div>  

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 mx-4 lg:mx-0">
          <div v-for="(card, index) in cards" :key="index" @click="navigateTo('/chat-with-akeel')"
            class="group rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col h-full"
            :class="isDark ? 'bg-[#01261f]/50 border-white/5 hover:border-[#008169]/50' : 'bg-white border-gray-100 hover:border-[#008169]/30'">
            
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-[#008169] shrink-0 shadow-sm text-white">
                  <img :src="card.icon" class="w-6 h-6 brightness-0 invert" alt="icon" />
                </div>
                <div>
                  <h3 class="font-medium text-base leading-tight" :class="isDark ? 'text-white' : 'text-gray-900'">
                    {{ currentLang === 'ar' ? card.titleAr : card.titleEn }}
                  </h3>
                  <p class="text-[13px] font-medium mt-0.5 text-[#008169]">
                    {{ currentLang === 'ar' ? card.subtitleAr : card.subtitleEn }}
                  </p>
                </div>
              </div>
              
              <div class="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
                   :class="currentLang === 'ar' ? 'group-hover:-translate-x-1 rotate-180' : ''">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400 group-hover:text-[#008169]">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <p class="text-sm leading-relaxed mt-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              {{ currentLang === 'ar' ? card.descAr : card.descEn }}
            </p>
            
          </div>
        </div>
      </div>

      <!-- RIGHT SIDEBAR -->
      <aside class="fixed z-[1000] transition-all duration-500 ease-in-out" :class="[
          currentLang === 'ar' ? 'left-0' : 'right-0',
          'lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:mt-5',
          isChatOpen
              ? 'bottom-0 w-full translate-y-0'
              : 'bottom-24 w-[80px]',
          isChatOpen ? 'lg:2xl:w-120 lg:w-100' : 'lg:w-[80px]'
      ]">
          <CommonChatSideBar v-model:isChatOpen="isChatOpen" @expand="isFullScreenChat = true" />
      </aside>
    </div>

    <!-- FULL SCREEN CHAT -->
    <div v-else class="w-full flex overflow-hidden" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
        <!-- Full Sidebar version -->
        <aside class="w-80 shrink-0 h-[calc(100vh-90px)]">
            <TaxQueriesLeftSideBar @close="isFullScreenChat = false" />
        </aside>

        <!-- Main Chat Area -->
        <main class="flex-1 h-[calc(100vh-90px)] relative w-full lg:w-auto">
            <CommonChatSideBar :isFullScreen="true" @expand="isFullScreenChat = false" />
        </main>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from 'vue'

const isChatOpen = ref(false)
const isFullScreenChat = ref(false)
const { currentLang, isDark } = useTheme()

const cards = ref([
  {
    id: 'revenue',
    icon: '/images/icons/Revenue.svg',
    titleEn: 'Revenue',
    titleAr: 'الإيرادات',
    subtitleEn: 'Income Analysis',
    subtitleAr: 'تحليل الدخل',
    descEn: 'Understand income sources, sales performance, and revenue streams. Analyze trends, identify top-performing products or services, and uncover growth opportunities.',
    descAr: 'فهم مصادر الدخل، وأداء المبيعات، ومسارات الإيرادات. تحليل الاتجاهات، وتحديد المنتجات أو الخدمات الأفضل أداءً، واكتشاف فرص النمو.'
  },
  {
    id: 'cashflow',
    icon: '/images/icons/Cashflow.svg',
    titleEn: 'Cashflow',
    titleAr: 'التدفق النقدي',
    subtitleEn: 'Cash Movement',
    subtitleAr: 'حركة النقد',
    descEn: 'Track money moving in and out of your business. Monitor cash inflows from customers and outflows for operations and expenses.',
    descAr: 'تتبع حركة الأموال داخل وخارج عملك. مراقبة التدفقات النقدية الواردة من العملاء والتدفقات الخارجة للعمليات والمصروفات.'
  },
  {
    id: 'statements',
    icon: '/images/icons/Financial-Statement.svg',
    titleEn: 'Financial Statements',
    titleAr: 'القوائم المالية',
    subtitleEn: 'P&L & Balance Sheet',
    subtitleAr: 'بيان الأرباح والخسائر والميزانية العمومية',
    descEn: 'Access comprehensive profit & loss statements, balance sheets, and income statements. Get a complete picture of your business financial health and performance.',
    descAr: 'الوصول إلى بيانات شاملة للأرباح والخسائر والميزانيات العمومية. احصل على صورة كاملة للصحة المالية والأداء لعملك.'
  },
  {
    id: 'indirect',
    icon: '/images/icons/Indirect-Expense.svg',
    titleEn: 'Indirect Expense',
    titleAr: 'المصاريف غير المباشرة',
    subtitleEn: 'Overhead Costs',
    subtitleAr: 'التكاليف العامة',
    descEn: 'Review overhead costs like rent, utilities, insurance, office supplies, and administrative expenses. Identify areas for cost optimization and efficiency improvements.',
    descAr: 'مراجعة التكاليف العامة مثل الإيجار والمرافق والتأمين واللوازم المكتبية والمصروفات الإدارية. تحديد مجالات تحسين التكلفة وتحسين الكفاءة.'
  },
  {
    id: 'ar',
    icon: '/images/icons/Account-Receivables.svg',
    titleEn: 'Accounts Receivables',
    titleAr: 'حسابات القبض',
    subtitleEn: 'Outstanding Invoices',
    subtitleAr: 'الفواتير المستحقة',
    descEn: 'Monitor outstanding invoices and payments owed to your business. Track aging receivables, improve collection processes, and manage customer payment terms.',
    descAr: 'مراقبة الفواتير المستحقة والمدفوعات المستحقة لعملك. تتبع الذمم المدينة القديمة وتحسين عمليات التحصيل وإدارة شروط الدفع للعملاء.'
  },
  {
    id: 'cogs',
    icon: '/images/icons/C.O.G.S.svg',
    titleEn: 'C.O.G.S',
    titleAr: 'تكلفة البضائع المباعة',
    subtitleEn: 'Production Costs',
    subtitleAr: 'تكاليف الإنتاج',
    descEn: 'Analyze the direct costs of producing your goods or services including materials, labor, and manufacturing expenses. Understand your gross profit margins.',
    descAr: 'تحليل التكاليف المباشرة لإنتاج البضائع أو الخدمات بما في ذلك المواد والعمالة ومصاريف التصنيع. فهم هوامش الربح الإجمالية.'
  },
  {
    id: 'ap',
    icon: '/images/icons/Accounts-Payable.svg',
    titleEn: 'Accounts Payable',
    titleAr: 'حسابات الدفع',
    subtitleEn: 'Bills to Pay',
    subtitleAr: 'الفواتير للدفع',
    descEn: 'Track bills and payments to suppliers and vendors. Manage payment schedules and optimize cash flow timing.',
    descAr: 'تتبع الفواتير والمدفوعات للموردين والبائعين. إدارة جداول الدفع وتحسين توقيت التدفق النقدي.'
  },
  {
    id: 'cost_center',
    icon: '/images/icons/Cost-Center-Project.svg',
    titleEn: 'Cost Center / Project',
    titleAr: 'مركز التكلفة / المشروع',
    subtitleEn: 'Project Profitability',
    subtitleAr: 'ربحية المشروع',
    descEn: 'Evaluate profitability by department, project, or business unit. Track costs and revenues for specific initiatives to understand which areas drive the most value.',
    descAr: 'تقييم الربحية حسب القسم أو المشروع أو وحدة العمل. تتبع التكاليف والإيرادات للمبادرات المحددة لفهم أي المجالات تحقق أكبر قيمة.'
  },
  {
    id: 'tax',
    icon: '/images/icons/Tax-Queries.svg',
    titleEn: 'Tax Queries',
    titleAr: 'الاستفسارات الضريبية',
    subtitleEn: 'Tax Support',
    subtitleAr: 'الدعم الضريبي',
    descEn: 'Get answers to tax-related questions on compliance, deductions, deadlines, and planning. Access expert guidance on complex tax matters.',
    descAr: 'احصل على إجابات للأسئلة المتعلقة بالضرائب حول الامتثال والخصومات والمواعيد النهائية والتخطيط. الوصول إلى إرشادات الخبراء حول المسائل الضريبية المعقدة.'
  }
])
</script>
