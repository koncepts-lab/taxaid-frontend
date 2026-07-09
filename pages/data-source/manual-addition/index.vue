<template>
  <NuxtLayout name="dashboard">
    <div class="relative z-10 flex h-full overflow-hidden" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <div class="flex-1 overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out lg:p-8 p-0 pt-8">
        
        <div class=" data-source-container pt-8 lg:pt-0">
          <!-- Header -->
          <div class="flex items-start gap-4 mb-6">
            <button @click="router.back()" class="mt-1.5 p-1 rounded-full transition-colors" :class="isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-200 text-gray-700'">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <div>
              <h1 class="font-medium transition-colors duration-300" :class="isDark ? 'text-white' : 'text-[#013E32]'" style="font-size: 24px;">
                {{ currentLang === 'ar' ? 'إضافة يدوية' : 'Manual Addition' }}
              </h1>
              <p class="font-normal mt-1 transition-colors duration-300" :class="isDark ? 'text-white/60' : 'text-[#00000080]'" style="font-size: 14px;">
                {{ currentLang === 'ar' ? 'أضف البيانات الرئيسية للعقد ومعلومات الشيكات المؤجلة يدوياً' : 'Add contract master data and PDC information manually' }}
              </p>
            </div>
          </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-4 gap-6">
          
          <!-- Card 1: Lead Master -->
          <div class="p-6 flex flex-col items-center text-center shadow-sm" style="background: #E0F9F3; border: 2px solid #6FDBBF; border-radius: 20px;">
            <div class="mb-4">
              <img src="/images/icons/Lead-Master.svg" alt="Lead Master" class="w-10 h-10" />
            </div>
            <h3 class="text-base font-medium text-[#013E32] mb-3">{{ currentLang === 'ar' ? 'العملاء المحتملين' : 'Lead Master' }}</h3>
            <p class="text-sm text-gray-500 mb-8 flex-1 leading-relaxed px-2">
              {{ currentLang === 'ar' ? 'إدارة معلومات العملاء المحتملين وتفاصيلهم' : 'Manage lead information and prospect details' }}
            </p>
            <button @click="router.push('/data-source/manual-addition/add-lead')" class="w-full py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors">
              + {{ currentLang === 'ar' ? 'إضافة عميل محتمل' : 'Add Lead' }}
            </button>
          </div>

          <!-- Card 2: Contract Master Data -->
          <div class="p-6 flex flex-col items-center text-center shadow-sm" style="background: #E0F9F3; border: 2px solid #6FDBBF; border-radius: 20px;">
            <div class="mb-4">
              <img src="/images/icons/Contract-Master-Data.svg" alt="Contract Master Data" class="" />
            </div>
            <h3 class="text-base font-medium text-[#013E32] mb-3">{{ currentLang === 'ar' ? 'بيانات العقد' : 'Contract Master Data' }}</h3>
            <p class="text-sm text-gray-500 mb-8 flex-1 leading-relaxed px-2">
              {{ currentLang === 'ar' ? 'تفاصيل العقد والمراحل ونظرة عامة على الميزانية.' : 'Contract details, milestones, and budget overview.' }}
            </p>
            <button @click="router.push('/data-source/manual-addition/add-contract')" class="w-full py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors">
              + {{ currentLang === 'ar' ? 'إضافة عقد' : 'Add Contract' }}
            </button>
          </div>

          <!-- Card 3: PDC In -->
          <div class="p-6 flex flex-col items-center text-center shadow-sm" style="background: #E0F9F3; border: 2px solid #6FDBBF; border-radius: 20px;">
            <div class="mb-4">
              <img src="/images/icons/PDC-In.svg" alt="PDC In" class="w-10 h-10" />
            </div>
            <h3 class="text-base font-medium text-[#013E32] mb-3">{{ currentLang === 'ar' ? 'شيكات واردة' : 'PDC In' }}</h3>
            <p class="text-sm text-gray-500 mb-8 flex-1 leading-relaxed px-2">
              {{ currentLang === 'ar' ? 'الشيكات المؤجلة المستلمة من العملاء' : 'Post-dated cheques received from customers' }}
            </p>
            <button @click="router.push('/data-source/manual-addition/add-pdc-in')" class="w-full py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors">
              + {{ currentLang === 'ar' ? 'إضافة شيك وارد' : 'Add PDC In' }}
            </button>
          </div>

          <!-- Card 4: PDC Out -->
          <div class="p-6 flex flex-col items-center text-center shadow-sm" style="background: #E0F9F3; border: 2px solid #6FDBBF; border-radius: 20px;">
            <div class="mb-4">
              <img src="/images/icons/PDC-Out.svg" alt="PDC Out" class="w-10 h-10" />
            </div>
            <h3 class="text-base font-medium text-[#013E32] mb-3">{{ currentLang === 'ar' ? 'شيكات صادرة' : 'PDC Out' }}</h3>
            <p class="text-sm text-gray-500 mb-8 flex-1 leading-relaxed px-2">
              {{ currentLang === 'ar' ? 'الشيكات المؤجلة الصادرة للموردين' : 'Post-dated cheques issued to vendors' }}
            </p>
            <button @click="router.push('/data-source/manual-addition/add-pdc-out')" class="w-full py-2.5 bg-[#00896F] text-white rounded-lg text-sm font-medium hover:bg-[#00705a] transition-colors">
              + {{ currentLang === 'ar' ? 'إضافة شيك صادر' : 'Add PDC Out' }}
            </button>
          </div>

        </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useState } from '#app'

const router = useRouter()
const currentLang = useState('currentLang', () => 'en')
const { isDark } = useTheme()
</script>
