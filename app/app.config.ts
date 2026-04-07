import type { SNSLink } from "~/types/sns";

export default defineAppConfig<{
  snsLinks: SNSLink[];
}>({
  snsLinks: [
    {
      url: "https://www.youtube.com/@kokonkr",
      iconName: "mdi:youtube",
      iconSize: 32,
      name: "YouTube",
      description: "好きな音声合成キャラに歌ってもらったり(カバー)",
      viewType: "card",
    },
    {
      url: "https://www.nicovideo.jp/user/56264499/video",
      iconName: "simple-icons:niconico",
      iconSize: 28,
      name: "ニコニコ動画",
      description: "ソフトウェアトーク動画が置いてあります",
      viewType: "card",
    },
    {
      url: "https://matcha14.com/",
      iconName: "mdi:web",
      iconSize: 28,
      name: "個人サイト",
      description: "機材、買ったガジェットとか。My new gear……!",
      viewType: "card",
    },
    {
      url: "https://fori.io/Moti-kitsune",
      iconName: "custom:mk",
      iconSize: 28,
      name: "もちきつね",
      description: "映像別名義",
      viewType: "card-aka",
    },
    {
      url: "https://twitter.com/Tsut_ps",
      iconName: "mdi:twitter",
      iconSize: 28,
      name: "Twitter(X)",
      description: "サイト、動画更新、進捗、なんかできた副産物 etc.",
    },
    {
      url: "https://misskey.io/@Tsut_ps",
      iconName: "simple-icons:misskey",
      iconSize: 28,
      name: "Misskey.io",
      description: "Discord以外だったら、ここが一番活発",
    },
    {
      url: "https://github.com/Tsut-ps",
      iconName: "mdi:github",
      iconSize: 30,
      name: "GitHub",
      description: "Web系エンジニア(ほんとは閑静な喫茶店でハッカーしたい)",
    },
    {
      url: "https://note.com/tsutps",
      iconName: "simple-icons:note",
      iconSize: 20,
      name: "note",
      description: "雑な記録。書き散らし",
    },
    {
      url: "https://scrapbox.io/Tsut-ps/",
      iconName: "custom:cosense",
      iconSize: 26,
      name: "Cosense(Scrapbox)",
      description: "コードを書く技術記事とか、思考整理のスクラップ",
    },
    {
      url: "https://www.amazon.jp/hz/wishlist/ls/29Z1OGW2MBBWP",
      iconName: "mdi:gift",
      iconSize: 25,
      name: "欲しいものリスト",
      description:
        "公開してますが、無理のない範囲で支援していただけると幸いです",
    },
  ],
});
