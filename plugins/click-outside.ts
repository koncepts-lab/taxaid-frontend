export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click-outside', {
    mounted(el: any, binding) {
      el.__clickOutsideHandler__ = (event: MouseEvent) => {
        if (typeof el.__clickOutsideBinding__ === 'function') {
          if (!el.contains(event.target as Node)) {
            el.__clickOutsideBinding__(event)
          }
        }
      }
      el.__clickOutsideBinding__ = binding.value
      document.addEventListener('click', el.__clickOutsideHandler__, true)
    },
    updated(el: any, binding) {
      el.__clickOutsideBinding__ = binding.value
    },
    unmounted(el: any) {
      if (el.__clickOutsideHandler__) {
        document.removeEventListener('click', el.__clickOutsideHandler__, true)
        delete el.__clickOutsideHandler__
        delete el.__clickOutsideBinding__
      }
    }
  })
})
