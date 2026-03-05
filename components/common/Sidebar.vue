<template>
  <aside
    class="fixed top-0 bottom-0 z-30 w-[100px] flex flex-col items-center py-10 transition-all duration-300 hidden lg:flex"
    :class="currentLang === 'ar' ? 'right-0' : 'left-0'" :style="{
      backgroundImage: `url('${isDark ? '/images/side-menu-bg-dark.png' : '/images/side-menu-bg.png'}')`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      transform: currentLang === 'ar' ? 'scaleX(-1)' : 'none'
    }">
    <!-- NAV ITEMS -->
    <nav class="flex-1 w-full flex flex-col items-start justify-center gap-y-[3vh] md:gap-y-[5vh] lg:gap-y-[3vh]"
      :style="{ transform: currentLang === 'ar' ? 'scaleX(-1)' : 'none' }">
      <NuxtLink v-for="(item, index) in navItems" :key="index" :to="item.to" 
        class="nav-item group relative side-icons"
        @mouseenter="hoveredMenuItem = item.label"
        @mouseleave="hoveredMenuItem = null">
        <!-- Default Icon -->
        <img :src="item.icon" 
          class="w-6 group-hover:hidden group-[.router-link-active]:hidden" 
          :class="{ 'hidden': hoveredMenuItem === item.label }"
          :alt="item.label" />
        <!-- Active Icon -->
        <img :src="item.activeIcon" 
          class="w-6 hidden group-hover:block group-[.router-link-active]:block"
          :class="{ '!block': hoveredMenuItem === item.label }"
          :alt="item.label" />

        <!-- TOOLTIP -->
        <div
          class="tooltip absolute px-4 py-2 bg-white text-[#009276] text-[16px] font-medium rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50"
          :class="[
            currentLang === 'ar' ? 'right-full mr-2' : 'left-full ml-2',
            { 'opacity-100 !visible': hoveredMenuItem === item.label }
          ]">
          {{ currentLang === 'ar' ? item.labelAr : item.label }}
          <!-- Arrow -->
          <div class="absolute top-1/2 -translate-y-1/2 border-8 border-transparent"
            :class="currentLang === 'ar' ? 'left-[100%] border-l-white' : 'right-[100%] border-r-white'"></div>
        </div>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup>
const currentLang = useState('currentLang')
const { isDark } = useTheme()
const hoveredMenuItem = useState('hoveredMenuItem', () => null)
const navItems = [
  {
    label: 'Revenue',
    labelAr: 'الإيرادات',
    to: '/revenue',
    icon: '/images/icons/Revenue.svg',
    activeIcon: '/images/icons/Revenue-active.svg'
  },
  {
    label: 'Cashflow',
    labelAr: 'التدفق النقدي',
    to: '/cash-flow',
    icon: '/images/icons/Cashflow.svg',
    activeIcon: '/images/icons/Cashflow-active.svg'
  },
  {
    label: 'Financial Statement',
    labelAr: 'القوائم المالية',
    to: '/financial-statement',
    icon: '/images/icons/Financial-Statement.svg',
    activeIcon: '/images/icons/Financial-Statement-active.svg'
  },
  {
    label: 'Indirect Expense',
    labelAr: 'المصاريف غير المباشرة',
    to: '/indirect-expense',
    icon: '/images/icons/Indirect-Expense.svg',
    activeIcon: '/images/icons/Indirect-Expense-active.svg'
  },
  {
    label: 'Account Receivables',
    labelAr: 'حسابات القبض',
    to: '/accounts-receivable',
    icon: '/images/icons/Account-Receivables.svg',
    activeIcon: '/images/icons/Account-Receivables-active.svg'
  },
  {
    label: 'COGS',
    labelAr: 'تكلفة البضائع المباعة',
    to: '/cogs',
    icon: '/images/icons/C.O.G.S.svg',
    activeIcon: '/images/icons/C.O.G.S-active.svg'
  },
  {
    label: 'Accounts Payable',
    labelAr: 'حسابات الدفع',
    to: '/accounts-payable',
    icon: '/images/icons/Accounts-Payable.svg',
    activeIcon: '/images/icons/Accounts-Payable-active.svg'
  },
  {
    label: 'Cost Center',
    labelAr: 'مركز التكلفة',
    to: '/cost-center',
    icon: '/images/icons/Cost-Center-Project.svg',
    activeIcon: '/images/icons/Cost-Center-Project-active.svg'
  },
  {
    label: 'Tax Queries',
    labelAr: 'استفسارات ضريبية',
    to: '/tax-queries',
    icon: '/images/icons/Tax-Queries.svg',
    activeIcon: '/images/icons/Tax-Queries-active.svg'
  },
]
</script>

<style scoped>
.nav-item {
  width: 87%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-item:hover {
  opacity: 1;
}

.nav-item.router-link-active {
  opacity: 1;
}
</style>
