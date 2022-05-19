const { GOOGLE_CLIENT_ID } = require("./constants");

module.exports = {
  dev: process.env.NODE_ENV !== 'production',
  server: {
    port: 4002 // default: 3000
  },
  telemetry: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  ssr: false,
  generate: {
    fallback: true
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Astha App',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['ant-design-vue/dist/antd.css', '~/assets/css/global.css'],

  // tailwindcss: {
  //   cssPath: '~/assets/css/tailwind.css',
  //   configPath: 'tailwind.config.js',
  //   exposeConfig: false,
  //   config: {},
  //   injectPosition: 0,
  // },

  router: {
    middleware: ['auth', 'axios', 'init-storage'],
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/antd-ui', '~/plugins/axios'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
  ],

  content: {},

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : 'https://app-service.asthait.com/',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // analyze: true,
    // or
    analyze: {
      analyzerMode: 'static',
    },
    extend(config, {}) {
      config.node = {
        fs: 'empty',
      };
    },
  },
  auth: {
    strategies: {
      google: {
        clientId: GOOGLE_CLIENT_ID,
        codeChallengeMethod: '',
        scope: ['profile', 'email'],
        responseType: 'token id_token',
      },
    },
  },
  serverMiddleware: ['~/server-middleware/logger'],
};
