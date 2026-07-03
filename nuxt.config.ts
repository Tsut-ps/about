// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // https://nuxt.com/docs/4.x/guide/going-further/runtime-config#environment-variables
  runtimeConfig: {
    youtubeApiKey: "",
  },

  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/icon"],

  // Nuxt DevToolsの依存を事前バンドルし、開発時の不要なページリロードを防ぐ
  vite: {
    optimizeDeps: {
      include: ["@vue/devtools-core", "@vue/devtools-kit"],
    },
  },

  icon: {
    provider: "iconify",
    serverBundle: {
      collections: ["mdi", "simple-icons", "material-symbols"], // SSGで必要なコレクションをバンドル
    },
    customCollections: [
      {
        prefix: "custom",
        dir: "./app/assets/icons",
      },
    ],
  },

  // SSG設定
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      retry: 0,
      routes: ["/", "/api/activities"],
    },
  },

  routeRules: {
    "/api/activities": {
      swr: 3600,
    },
  },

  app: {
    baseURL: "/about/",
    head: {
      title: "狐紺くろ",
      htmlAttrs: {
        lang: "ja",
      },
      link: [{ rel: "icon", type: "image/x-icon", href: "/about/favicon.png" }],
      meta: [
        {
          name: "狐紺くろのプロフィール",
          content:
            "垢別リンクです。YouTube/ニコ動、匿名質問、noteへのリンクはこちらから",
        },
      ],
    },
  },
});
