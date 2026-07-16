import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  $development: {
    future: {
      compatibilityVersion: 4,
    },
  },
  // Ensure this is clean
  modules: ["@nuxt/ui"],
  ui: {
    primary: "teal",
    gray: "cool",
  },
  css: ["~/assets/main.css"],

  // Register revenue-partnership components by filename only (no path prefix)
  // so <DashboardHeader> and <DashboardFooter> continue to work everywhere
  components: [
    { path: "~/components", pathPrefix: true },
    // { path: "~/components/common", pathPrefix: false },
    { path: "~/components/revenue-partnership", pathPrefix: false },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  // This tells Nuxt NOT to try and manage Tailwind via its old PostCSS bridge
  postcss: {
    plugins: {
      // Ensure this is empty to avoid the "null to object" error
    },
  },
  imports: {
    dirs: ['composables/**'],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://127.0.0.1/api",
      // Firebase web push (values from Firebase console → Add app → Web).
      // Push is silently disabled while these are empty.
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || "",
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || "",
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_SENDER_ID || "",
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || "",
      firebaseVapidKey: process.env.NUXT_PUBLIC_FIREBASE_VAPID_KEY || "",
      // Reverb websocket (in-app notification toasts)
      reverbKey: process.env.NUXT_PUBLIC_REVERB_KEY || "",
      reverbHost: process.env.NUXT_PUBLIC_REVERB_HOST || "",
      reverbPort: process.env.NUXT_PUBLIC_REVERB_PORT || "8080",
      reverbScheme: process.env.NUXT_PUBLIC_REVERB_SCHEME || "http",
    },
  },
});