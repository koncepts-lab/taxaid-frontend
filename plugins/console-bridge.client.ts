export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  const { unlock } = useRootAdmin()
  const { admin } = useAdminAuth()
  const route = useRoute()

  const NOT_FOUND = 'sysCheck is not defined'
  const GATE_PATH = '/admin'

  const runCheck = async (password?: string) => {
    if (admin.value?.role?.name !== 'Super Admin') {
      return NOT_FOUND
    }

    if (!password) {
      return NOT_FOUND
    }

    const result = await unlock(password)

    if (result.success) {
      console.log(
        '%c[UNLOCKED] Extended access is now active on this screen',
        'background: #7F1D1D; color: #FCA5A5; font-weight: bold; padding: 4px 8px; border-radius: 4px; font-size: 13px;'
      )
      return 'SUCCESS: Access unlocked.'
    } else {
      return NOT_FOUND
    }
  }

  const bindHelper = () => {
    ;(window as any).sysCheck = runCheck.bind(null)
  }

  const unbindHelper = () => {
    delete (window as any).sysCheck
  }

  watch(
    () => route.path,
    (path) => {
      if (path === GATE_PATH) {
        bindHelper()
      } else {
        unbindHelper()
      }
    },
    { immediate: true }
  )
})
