import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  // Ensure this is clean
  modules: [],

  css: ["~/assets/main.css"],

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
