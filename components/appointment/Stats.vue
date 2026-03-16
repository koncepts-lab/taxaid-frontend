<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Total Hours -->
        <div class="p-6 rounded-[20px] border border-[#04C18F80] transition-all duration-300 relative h-[140px]"
            :class="isDark ? 'bg-[#002E26] text-white' : 'bg-[#FFFFFFB2] shadow-sm'">
            
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-[14px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000099]'">
                        {{ currentLang === 'ar' ? 'إجمالي الساعات (هذا الشهر)' : 'Total Hours (This Month)' }}
                    </p>
                    <h3 class="text-[25px] font-semibold mt-2" :class="isDark ? 'text-[#00FFBC]' : 'text-[#013E32]'">20 hrs</h3>
                </div>
                <div class="flex-shrink-0">
                    <img src="/images/icons/Hours.svg" alt="Hours" class="w-10 h-10" />
                </div>
            </div>
        </div>

        <!-- Hours Used -->
        <div class="p-6 rounded-[20px] border border-[#04C18F80] transition-all duration-300 relative h-[140px]"
            :class="isDark ? 'bg-[#002E26] text-white' : 'bg-[#FFFFFFB2] shadow-sm'">
            
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <p class="text-[14px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000099]'">
                        {{ currentLang === 'ar' ? 'الساعات المستخدمة' : 'Hours Used' }}
                    </p>
                    <h3 class="text-[25px] font-semibold mt-2" :class="isDark ? 'text-[#00FFBC]' : 'text-[#013E32]'">3 hrs</h3>
                    
                    <div class="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
                        :class="isDark ? 'bg-red-500/10 text-red-400' : 'bg-[#FDECE7] text-[#FF5C39]'">
                        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {{ currentLang === 'ar' ? 'الاجتماعات المكتملة' : 'Completed meetings' }}
                    </div>
                </div>
                <div class="flex-shrink-0">
                    <img src="/images/icons/Hours-Used.svg" alt="Hours Used" class="w-10 h-10" />
                </div>
            </div>
        </div>

        <!-- Hours Remaining -->
        <div class="p-6 rounded-[20px] border border-[#04C18F80] transition-all duration-300 relative h-[140px]"
            :class="isDark ? 'bg-[#002E26] text-white' : 'bg-[#FFFFFFB2] shadow-sm'">
            
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <p class="text-[14px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000099]'">
                        {{ currentLang === 'ar' ? 'الساعات المتبقية' : 'Hours Remaining' }}
                    </p>
                    <h3 class="text-[25px] font-semibold mt-2" :class="isDark ? 'text-[#00FFBC]' : 'text-[#013E32]'">17 hrs</h3>
                    
                    <div class="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
                        :class="isDark ? 'bg-emerald-500/10 text-[#00FFBC]' : 'bg-[#E6FFF5] text-[#00B388]'">
                        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {{ currentLang === 'ar' ? 'الرصيد المتاح' : 'Balance Available' }}
                    </div>
                </div>
                <div class="flex-shrink-0">
                    <img src="/images/icons/Hours-Remaining.svg" alt="Hours Remaining" class="w-10 h-10" />
                </div>
            </div>
        </div>

        <!-- Next Review -->
        <div class="p-6 rounded-[20px] border border-[#04C18F80] transition-all duration-300 relative h-[140px]"
            :class="isDark ? 'bg-[#002E26] text-white' : 'bg-[#FFFFFFB2] shadow-sm'">
            
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <p class="text-[14px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000099]'">
                        {{ currentLang === 'ar' ? 'المراجعة القادمة' : 'Next Review' }}
                    </p>
                    <h3 class="text-[25px] font-semibold mt-2 text-[#013E32]" :class="isDark ? 'text-[#00FFBC]' : 'text-[#013E32]'">Nov 10, 2–4 PM</h3>
                    
                    <div class="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
                        :class="isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-[#E7F0FD] text-[#3B82F6]'">
                        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {{ currentLang === 'ar' ? 'قادم' : 'Upcoming' }}
                    </div>
                </div>
                <div class="flex-shrink-0">
                    <img src="/images/icons/Next-Review.svg" alt="Next Review" class="w-10 h-10" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
</script>

<style scoped>
</style>
