// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('auth_token')
  const publicPages = ['/','/home','/revenue-partnership-login', '/verify-email','/test-auth']//pages access without any login data(test-atuh is for testing apis on LH)

    if (!token.value && !publicPages.includes(to.path)) {
    return navigateTo('/home')
  }
})