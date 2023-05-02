// https://nuxt.com/docs/api/configuration/nuxt-config
import { md1 } from 'vuetify/blueprints'

export default defineNuxtConfig({
    modules: [
        '@invictus.codes/nuxt-vuetify',
        '@pinia/nuxt'
    ],
    extends: [
        'nuxt-seo-kit'
    ],
    runtimeConfig: {
        ssr: true,
        indexable: true,
        public: {
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
            siteName: 'Pontos da Canastra',
            siteDescription: 'Um aplicativo para que você possa contar os pontos das suas partidas de Canastra',
            language: 'pt'
        }
    },
    vuetify: {
        /* vuetify options */
        vuetifyOptions: {
            blueprint: md1
        },
        moduleOptions: {
            /* nuxt-vuetify module options */
            treeshaking: true,
            useIconCDN: true,
            /* vite-plugin-vuetify options */
            styles: true,
            autoImport: true,
        }
    }
})
