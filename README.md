<a href="https://tsut-ps.github.io/about/">
  <img src="./public/256kkn.webp" width="100%" height="auto" />
</a>

# about

- SNS リンクとアクティビティを出す Web サイト
- Nuxt 4（Vue 3）+ TypeScript + Composition API 構成
- サーバーサイドで各種 RSS/フィードを集約し、重複をグルーピングして表示

## フロント

- アイコンのみ/カードリンクの 2 構成
- フィルタ付きのアクティビティ

## サーバー/API

- **server/api/activities.ts**  
  各種フィード（YouTube, ニコニコ, note, ブログ, Scrapbox）をまとめて取得し、重複をグループ化して返す API（キャッシュあり）
- **server/utils/activityGrouper.ts**  
  類似タイトルの活動をグルーピングし、サムネイルや日付を最適化
- **server/utils/feedFetcher.ts**  
  サーバーサイドで RSS/Atom フィードを取得、解析やフィルタリングなど前処理を行う

## 開発・ビルド

```bash
npm install      # 依存関係のインストール
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run preview  # 本番ビルドのローカルプレビュー
```
