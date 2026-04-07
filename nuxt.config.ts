import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
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
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://127.0.0.1/api",
    },
  },
});