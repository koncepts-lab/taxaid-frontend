export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  const { unlock } = useRootAdmin()
  const { admin } = useAdminAuth()

  const handleRootUnlock = async (password?: string) => {
    // Strict client-side check: Only 'Super Admin' role may trigger unlock
    if (admin.value?.role?.name !== 'Super Admin') {
      return
    }

    if (!password) {
      const prompted = window.prompt('Enter Root Admin Secret:')
      if (!prompted) return
      password = prompted
    }

    const result = await unlock(password)

    if (result.success) {
      console.log(
        '%c[ROOT ADMIN UNLOCKED] Red Root Admin Card is now active on the dashboard selector!',
        'background: #7F1D1D; color: #FCA5A5; font-weight: bold; padding: 4px 8px; border-radius: 4px; font-size: 13px;'
      )
      return 'SUCCESS: Root Admin Console unlocked.'
    } else {
      console.warn(`[ROOT AUTH FAILED] ${result.message}`)
      return `FAILED: ${result.message}`
    }
  }

  // Define global window helpers ONLY when caller is logged in as Super Admin
  const bindWindowHelpers = () => {
    if (admin.value?.role?.name === 'Super Admin') {
      ;(window as any).rootAdmin = handleRootUnlock
      ;(window as any).root = handleRootUnlock
      ;(window as any)['root-admin'] = handleRootUnlock
    } else {
      delete (window as any).rootAdmin
      delete (window as any).root
      delete (window as any)['root-admin']
    }
  }

  // Watch admin auth state changes
  watch(() => admin.value?.role?.name, () => {
    bindWindowHelpers()
  }, { immediate: true })

  // Keyboard shortcut (Ctrl + Alt + R) strictly active ONLY for Super Admin
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.ctrlKey && e.altKey && (e.key === 'r' || e.key === 'R')) {
      if (admin.value?.role?.name === 'Super Admin') {
        e.preventDefault()
        handleRootUnlock()
      }
    }
  })
})
