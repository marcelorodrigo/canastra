// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    extends: [
        'nuxt-seo-kit'
    ],
    runtimeConfig: {
        indexable: true,
        public: {
          siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://marcelorodrigo.github.io/canastra',
          siteName: 'Pontos da Canastra',
          siteDescription: 'Um aplicativo para que você possa contar os pontos das suas partidas de Canastra',
          language: 'pt',   
        }
      },
})
