// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    app: {
        head: {
            meta: [{
                name: "google-site-verification",
                content: "Fp7R6n_J3xcccADnN8uc3fX3_ewGLF-FwUrYsdW85Ms"
            }],
            link: [
                {rel: "preconnect", href: "https://cdn.jsdelivr.net"},
                {rel: "icon", href: "favicon.ico", type: "image/x-icon"},
                {rel: "icon", href: "android-chrome-192x192.png", type: "image/png", sizes: "192x192"},
                {rel: "icon", href: "android-chrome-521x512.png", type: "image/png", sizes: "512x512"},
                {rel: "icon", href: "apple-touch-icon.png", type: "image/png", sizes: "180x180"},
                {rel: "icon", href: "favicon-16x16.png", type: "image/png", sizes: "16x16"},
                {rel: "icon", href: "favicon-32x32.png", type: "image/png", sizes: "32x32"},
            ]
        }
    },
    site: {
        url: 'https://marcelorodrigo.github.io',
        name: 'Marcador de pontos da Canastra',
        description: 'Um aplicativo para que você possa marcar os pontos das suas partidas de Canastra',
        defaultLocale: 'pt',
    },
    modules: [
        '@invictus.codes/nuxt-vuetify',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        '@vite-pwa/nuxt',
        "@nuxtjs/seo"
    ],
    runtimeConfig: {
        ssr: true,
        indexable: true,
    },
    vuetify: {
        /* vuetify options */
        vuetifyOptions: {
            icons: {
                defaultSet: 'mdi',
            }
        },
        moduleOptions: {
            /* nuxt-vuetify module options */
            treeshaking: true,
            useIconCDN: false,
            /* vite-plugin-vuetify options */
            styles: true,
            autoImport: true,
        }
    },
    vite: {
        build: {
            target: 'esnext',
        }
    },
    pwa: {
        registerType: 'autoUpdate',
        manifest: {
            name: 'Pontos da Canastra',
            short_name: 'Canastra',
            lang: 'pt',
            theme_color: '#ffffff',
            icons: [
                {
                    src: 'android-chrome-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: 'android-chrome-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
                {
                    src: 'apple-touch-icon.png',
                    sizes: '180x180',
                    type: 'image/png',
                }
            ],
        },
        workbox: {
            navigateFallback: '/',
            globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        },
        client: {
            installPrompt: true,
            periodicSyncForUpdates: 20,
        },
        devOptions: {
            enabled: true,
            type: 'module',
        },
    },
})