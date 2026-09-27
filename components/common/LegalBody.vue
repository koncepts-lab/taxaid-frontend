<template>
  <div>
    <template v-if="loading">
      <div class="h-9 w-72 rounded animate-pulse mb-10" :class="skeletonClass"></div>

      <div v-for="group in 4" :key="group" class="mb-10">
        <div class="h-6 w-48 rounded animate-pulse mb-4" :class="skeletonClass"></div>
        <div v-for="n in 5" :key="n" class="h-4 rounded animate-pulse mb-3"
          :class="[skeletonClass, n === 5 ? 'w-1/2' : n === 4 ? 'w-5/6' : 'w-full']"></div>
      </div>
    </template>

    <p v-else-if="error" class="text-sm" :class="dark ? 'text-white/60' : 'text-gray-500'">
      {{ currentLang === 'ar' ? 'تعذر تحميل هذه الصفحة. حاول مرة أخرى لاحقًا.' : 'Could not load this page. Please try again later.' }}
    </p>

    <div v-else ref="contentRef" class="legal-content" :class="dark ? 'text-white/90' : 'text-[#1A1A1A]'" v-html="html"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  loading: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
  html: { type: String, default: '' },
  dark: { type: Boolean, default: false },
})

const skeletonClass = computed(() => (props.dark ? 'bg-white/10' : 'bg-gray-200'))
const currentLang = useState('currentLang', () => 'en')
const contentRef = ref(null)

const NAV_FLAG = '_nav'

const copyIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>'
const copiedIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>'

const addCopyButton = (anchor, value) => {
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'legal-copy-btn'
  btn.setAttribute('aria-label', 'Copy')
  btn.innerHTML = copyIcon
  btn.addEventListener('click', async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(value)
      btn.innerHTML = copiedIcon
      setTimeout(() => { btn.innerHTML = copyIcon }, 1500)
    } catch {}
  })
  anchor.insertAdjacentElement('afterend', btn)
}

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const isPhoneLike = (v) => {
  if (!/^[+\d][\d\s-]*$/.test(v)) return false
  const digits = v.replace(/\D/g, '')
  return digits.length >= 7 && digits.length <= 15
}

const wireLink = (a) => {
  const raw = a.getAttribute('href')
  if (!raw) return

  // Already a mailto:/tel: link the CMS content itself created — just add the copy button.
  if (/^mailto:/i.test(raw)) {
    addCopyButton(a, decodeURIComponent(raw.replace(/^mailto:/i, '').split('?')[0]))
    return
  }
  if (/^tel:/i.test(raw)) {
    addCopyButton(a, raw.replace(/^tel:/i, ''))
    return
  }
  
  const value = decodeURIComponent(raw).trim()
  if (EMAIL_RE.test(value)) {
    a.setAttribute('href', `mailto:${value}`)
    addCopyButton(a, value)
    return
  }
  if (isPhoneLike(value)) {
    a.setAttribute('href', `tel:${value.replace(/[\s-]/g, '')}`)
    addCopyButton(a, value)
    return
  }

  let url
  try {
    url = new URL(raw, window.location.origin)
  } catch {
    return
  }

  const isAbsolute = /^https?:\/\//i.test(raw) && url.origin !== window.location.origin
  const flag = url.searchParams.get(NAV_FLAG)
  url.searchParams.delete(NAV_FLAG)
  const mode = flag === 'spa' || flag === 'tab' ? flag : (isAbsolute ? 'tab' : 'spa')

  const cleanHref = isAbsolute ? url.toString() : url.pathname + url.search + url.hash
  a.setAttribute('href', cleanHref)

  if (mode === 'tab') {
    a.setAttribute('target', '_blank')
    a.setAttribute('rel', 'noopener noreferrer')
  } else {
    a.removeAttribute('target')
    a.addEventListener('click', (e) => {
      e.preventDefault()
      navigateTo(cleanHref)
    })
  }
}

const enhance = () => {
  const root = contentRef.value
  if (!root) return
  root.querySelectorAll('a[href]').forEach(wireLink)
}

watch(() => props.html, () => nextTick(enhance))
onMounted(() => nextTick(enhance))
</script>

<style scoped>
.legal-content :deep(h1) {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 700;
  margin-bottom: 1rem;
}

.legal-content :deep(h2) {
  font-size: clamp(1.15rem, 3vw, 1.5rem);
  font-weight: 600;
  color: #00896F;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.legal-content :deep(p) {
  line-height: 1.75;
  margin-bottom: 1rem;
}

.legal-content :deep(ul) {
  list-style-type: disc;
  padding-inline-start: 1.5rem;
  margin-bottom: 1rem;
}

.legal-content :deep(li) {
  margin-bottom: 0.5rem;
}

.legal-content :deep(a) {
  color: #00896F;
  text-decoration: underline;
}

.legal-content :deep(.legal-copy-btn) {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}

.legal-content :deep(.legal-copy-btn) {
  margin-inline-start: 0.375rem;
  padding: 0.2rem;
  border-radius: 0.375rem;
  border: none;
  background: transparent;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
}

.legal-content :deep(.legal-copy-btn:hover) {
  opacity: 1;
  background: rgba(0, 137, 111, 0.1);
}
</style>
