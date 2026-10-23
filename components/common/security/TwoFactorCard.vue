<template>
  <div class="rounded-2xl border p-6 transition-all duration-300"
    :class="isDark ? 'bg-[#002E26] border-teal-950/40 text-white' : 'bg-white border-teal-50 shadow-[0_4px_20px_rgba(0,183,148,0.05)]'">

    <div class="flex items-center justify-between gap-4 mb-6">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-[#E8FCF2] dark:bg-teal-950 text-[#00835D]">
          <!-- Shield Check Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
        </div>
        <div>
          <h2 class="leading-tight"
            :style="{
              fontFamily: 'Noto Sans Arabic, sans-serif',
              fontWeight: '400',
              fontSize: '18px',
              color: isDark ? '#FFFFFF' : '#000000'
            }">
            {{ currentLang === 'ar' ? 'المصادقة الثنائية' : 'Two-Factor Authentication' }}
          </h2>
          <p class="mt-1"
            :style="{
              fontWeight: '400',
              fontSize: '14px',
              color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#00000080'
            }">
            {{ currentLang === 'ar' ? 'إضافة طبقة حماية إضافية لحسابك' : 'Add an extra layer of security to your account' }}
          </p>
        </div>
      </div>

      <!-- Switch Toggle Button -->
      <button @click="twoFactorEnabled = !twoFactorEnabled"
        class="relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none shrink-0"
        :style="{
          backgroundColor: twoFactorEnabled ? '#009276' : (isDark ? '#374151' : '#E5E7EB')
        }">
        <span class="inline-block h-5 w-5 rounded-full bg-white transition-all border-[3px]"
          :style="{
            borderColor: twoFactorEnabled ? '#009276' : (isDark ? '#374151' : '#E5E7EB'),
            transform: twoFactorEnabled ? (currentLang === 'ar' ? 'translateX(-22px)' : 'translateX(22px)') : (currentLang === 'ar' ? 'translateX(-2px)' : 'translateX(2px)')
          }"></span>
      </button>
    </div>

    <!-- Banner alert -->
    <Transition name="slide">
      <div class="mt-4 p-4 rounded-lg text-[14px] leading-relaxed transition-all"
        :class="twoFactorEnabled
          ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-950 text-emerald-800 dark:text-emerald-300 border'
          : 'border dark:bg-blue-950/20 dark:border-blue-950/50 dark:text-blue-300'"
        :style="!twoFactorEnabled && !isDark ? {
          backgroundColor: '#EFF6FF',
          border: '1px solid #BEDBFF',
          padding: '25px',
          color: '#1C398E',
          fontSize: '14px',
          fontWeight: '400'
        } : {
          padding: '25px'
        }">
        <p v-if="!twoFactorEnabled">
          {{ currentLang === 'ar'
            ? 'المصادقة الثنائية معطلة حاليًا. قم بتمكينها لإضافة طبقة أمان إضافية باستخدام جهازك المحمول.'
            : 'Two-factor authentication is currently disabled. Enable it to add an extra layer of security using your mobile device.' }}
        </p>
        <p v-else>
          {{ currentLang === 'ar'
            ? 'لقد تم تمكين المصادقة الثنائية لحسابك بنجاح. سيتم طلب رمز أمان إضافي عند تسجيل الدخول.'
            : 'Two-factor authentication is successfully enabled for your account. An extra security token will be required during login.' }}
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')

const twoFactorEnabled = ref(false)
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease-out;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
