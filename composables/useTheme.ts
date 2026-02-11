export const useTheme = () => {
    const isDark = useState<boolean>('theme-dark', () => false)

    const toggleTheme = () => {
        isDark.value = !isDark.value
    }

    return {
        isDark,
        toggleTheme
    }
}
