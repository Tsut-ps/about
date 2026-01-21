<a href="https://tsut-ps.github.io/about/">
  <img src="./public/256kkn.webp" width="100%" height="auto" />
</a>

# about

## このリポジトリは何をしていますか？

**個人ポートフォリオ・アクティビティ集約サイト**です。

複数のプラットフォーム（YouTube、ニコニコ動画、note、ブログ、Scrapbox、GitHub など）に投稿したコンテンツを自動的に収集し、1つのページで最新の活動を表示します。同じコンテンツが複数のプラットフォームに投稿されている場合は、重複を検出して自動的にグループ化します。

### 主な機能

- **SNS リンク集**: 各種 SNS プロフィールへのリンクを見やすく表示
- **アクティビティフィード**: 複数プラットフォームの最新コンテンツを統合表示
- **重複検出**: タイトルの類似度から同一コンテンツを自動判定してグループ化
- **カテゴリフィルタ**: 動画、ブログ、開発ログなどのカテゴリで絞り込み表示
- **レスポンシブデザイン**: モバイルからデスクトップまで対応

### 技術スタック

- Nuxt 4（Vue 3）+ TypeScript + Composition API 構成
- サーバーサイドで各種 RSS/フィードを集約し、重複をグルーピングして表示
- 静的サイト生成（SSG）と 1 時間のキャッシュ戦略

### 連携サービス

| サービス | 取得方法 | 用途 |
|---------|---------|-----|
| YouTube | RSS フィード | 動画投稿 |
| ニコニコ動画 | RSS フィード | 動画投稿 |
| note | RSS フィード | 記事・ブログ |
| 個人ブログ | RSS フィード | 技術記事 |
| Scrapbox | REST API | 開発ログ・メモ |
| GitHub | REST API | リポジトリ活動 |

## アーキテクチャ

### データフロー

```
1. クライアント → /api/activities リクエスト
2. サーバー → 複数のフィード/API を並行取得（Promise.allSettled）
3. サーバー → 取得した活動をタイトルの類似度でグループ化
4. サーバー → 公開日でソートして返却（1時間キャッシュ）
5. クライアント → フィルタ機能付きで表示
```

### フロントエンド構成

- **app/app.vue**: メインアプリケーション
- **components/ProfileSection.vue**: SNS リンクとプロフィール表示
- **components/ActivitiesSection.vue**: アクティビティフィード表示（フィルタ機能付き）
- **components/ActivityCard.vue**: 個別アクティビティカード
- **components/SNSCard.vue**: SNS リンクカード（アイコンのみ/カード型の2構成）

### サーバー/API 構成

- **server/api/activities.ts**  
  各種フィード（YouTube、ニコニコ、note、ブログ、Scrapbox、GitHub）をまとめて取得し、重複をグループ化して返す API（1時間キャッシュ）
  
- **server/utils/activityGrouper.ts**  
  類似タイトルの活動をグルーピング。タイトルの類似度を計算し、同一コンテンツと判定された場合は最適なサムネイルと日付を選択してまとめる
  
- **server/utils/feedFetcher.ts**  
  サーバーサイドで RSS/Atom フィードを取得、解析、フィルタリングなどの前処理を行う。fast-xml-parser を使用してパース
  
- **server/utils/githubApiFetcher.ts**  
  GitHub REST API からリポジトリの最新活動を取得。README の画像をサムネイルとして抽出
  
- **server/utils/scrapboxApiFetcher.ts**  
  Scrapbox API から最新の開発ログを取得

### 重複検出の仕組み

1. 各プラットフォームからコンテンツを取得
2. タイトルの類似度を計算（装飾文字・助詞・記号などを除外して比較）
3. 類似度が高い（短い方が長い方の60%以上を含む）場合、同一コンテンツと判定
4. グループ化されたアイテムは以下のルールで統合：
   - **サムネイル**: 優先順位に従って最適なものを選択（YouTube > ニコニコ動画 > ブログ > note > Scrapbox）
   - **公開日**: 最も古い公開日を採用（初出日を表示）
   - **プラットフォーム**: すべてのプラットフォーム情報を保持

## 開発・ビルド

```bash
npm install      # 依存関係のインストール
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run preview  # 本番ビルドのローカルプレビュー
```
