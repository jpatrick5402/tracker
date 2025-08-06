// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    DB_URL: process.env.DATABASE_URL,
  },
  modules: ["@nuxt/icon"],
});
