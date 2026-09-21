export default defineNuxtPlugin(() => {
  const isDark = useCookie<boolean>('theme-dark', { default: () => false })
  watchEffect(() => document.body.classList.toggle('taxaid-dark', !!isDark.value))
})
