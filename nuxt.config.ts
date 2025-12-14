// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/icon"],

  icon: {
    // SSG で /api/_nuxt_icon を使わないようにする
    provider: "none",
    clientBundle: {
      scan: true, // プロジェクト内の <Icon> をスキャンしてバンドル
    },
  },

  // SSG設定
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/"],
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
