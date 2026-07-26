export const profile = {
  bio: [
    "音声合成キャラに歌ってもらったり、",
    "解説記事を作ったり、",
    "プログラムを書いたり。",
  ],
  contacts: [
    { label: "Twitter(X)", value: "@tsut_ps" },
    { label: "Discord", value: "@tsut_ps" },
  ],
  contactNote: "※Xはあんま見れてないので気がつけないかも……!",
  info: [
    {
      label: "好き",
      values: ["抹茶", "すし", "アニメーション", "けもみみ", "ｽﾔｧ"],
    },
    { label: "苦手", values: ["バグ", "静電気", "乾燥", "湿気"] },
    { label: "できる", values: ["調声", "MIX", "映像つくる", "動画編集"] },
    { label: "アイコン", values: ["ぽんぽんぺいん (@purin9987様)"] },
  ],
  voices: [
    { name: "ずんだもん", tools: "CeVIO・ボイスピ・NEUTRINO" },
    { name: "きりたん", tools: "ボイロ・ボイスピ" },
    { name: "花隈千冬", tools: "SynthV・CeVIOトーク" },
    { name: "鳴花ヒメ・ミコト", tools: "ボカロ・ガイノイドTalk・アイボス2" },
    { name: "伊織弓鶴", tools: "アイボス2" },
    { name: "結月ゆかり", tools: "アイボス(囁)" },
    { name: "ゲキヤク・カゼヒキ", tools: "ボカロ" },
    { name: "りむる", tools: "VoiSona" },
  ],
} as const;
