export const useTheme = () => {
    const isDark = useCookie<boolean>('theme-dark', { default: () => false })

    const toggleTheme = () => {
        isDark.value = !isDark.value
    }

    return {
        isDark,
        toggleTheme
    }
}
