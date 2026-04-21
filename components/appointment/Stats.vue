<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="(stat, idx) in stats" :key="idx" 
            class="p-6 rounded-[20px] border border-[#04C18F80] transition-all duration-300 relative h-[140px]"
            :class="isDark ? 'bg-[#002E26] text-white' : 'bg-[#FFFFFFB2] shadow-sm'">
            
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <p class="text-[14px] font-normal" :class="isDark ? 'text-white/60' : 'text-[#00000099]'">
                        {{ currentLang === 'ar' ? stat.labelAr : stat.label }}
                    </p>
                    <h3 class="text-[25px] font-semibold mt-2" :class="isDark ? 'text-[#00FFBC]' : 'text-[#013E32]'">
                        {{ stat.value }}
                    </h3>
                    
                    <div v-if="stat.sublabel" class="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
                        :class="[
                            idx === 1 ? (isDark ? 'bg-red-500/10 text-red-400' : 'bg-[#FDECE7] text-[#FF5C39]') :
                            idx === 2 ? (isDark ? 'bg-emerald-500/10 text-[#00FFBC]' : 'bg-[#E6FFF5] text-[#00B388]') :
                            (isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-[#E7F0FD] text-[#3B82F6]')
                        ]">
                        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {{ currentLang === 'ar' ? stat.sublabelAr : stat.sublabel }}
                    </div>
                </div>
                <div class="flex-shrink-0">
                    <img :src="stat.icon" :alt="stat.label" class="w-10 h-10" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { isDark } = useTheme()
const currentLang = useState('currentLang', () => 'en')
const { stats } = useAppointmentsPage()
</script>

<style scoped>
</style>
