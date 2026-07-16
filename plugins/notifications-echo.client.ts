// In-app notification toasts over Reverb. Subscribes to the user's private
// channel (private-user.{id}) and shows a toast for every `notification`
// event fired by the backend NotificationDispatcher. Silently disabled when
// the Reverb key isn't configured or the visitor isn't logged in.
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token')

  if (!config.public.reverbKey || !config.public.reverbHost || !token.value) return

  let userId: string | null = null
  try { userId = localStorage.getItem('auth_user_id') } catch {}
  if (!userId) return

  ;(window as any).Pusher = Pusher

  const echo = new Echo({
    broadcaster: 'reverb',
    key: config.public.reverbKey,
    wsHost: config.public.reverbHost,
    wsPort: Number(config.public.reverbPort),
    wssPort: Number(config.public.reverbPort),
    forceTLS: config.public.reverbScheme === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${config.public.apiBase}/broadcasting/user-auth`,
    auth: { headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json' } },
  })

  const toast = useToast()

  echo.private(`user.${userId}`).listen('.notification', (e: any) => {
    toast.add({ title: e.title, description: e.body })
  })
})
