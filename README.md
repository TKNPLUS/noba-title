# YouTube サムネイルクイズ

YouTubeチャンネルの動画サムネイルを使ったクイズゲームです。

## 機能

### ゲームモード
- **通常モード (4択)**: サムネイルから動画タイトルを当てる
- **ハードモード (入力)**: タイトルを直接入力
- **逆クイズ (タイトル→サムネ)**: タイトルからサムネイルを選択
- **ハイ＆ロー (再生数当て)**: 2つの動画のどちらが再生数が多いか当てる
- **再生数予想 (スライダー)**: スライダーで再生数を予想
- **ズームモード (部分拡大)**: サムネイルの一部だけを表示
- **ぼかしモード (徐々に鮮明)**: ぼやけたサムネイルが徐々に鮮明になる

### データ管理機能

#### 1. YouTube Data API からデータ取得
- API KeyとChannel IDを入力することで、任意のYouTubeチャンネルの動画データを取得
- YouTube Shorts の除外オプション（60秒以下 & #shorts含む動画を除外）
- 再生数順にソートされたデータを自動生成

**使い方:**
1. 「⚙️ 設定・データ管理」ボタンをクリック
2. YouTube Data API v3のキーを入力（[Google Cloud Console](https://console.cloud.google.com/)で取得）
3. 対象チャンネルのIDを入力
4. 「データ取得開始」をクリック
5. 取得完了後、データソース選択で生成されたCSVを選択

#### 2. CSVファイルのインポート
- ローカルのCSVファイルをアップロードして使用可能
- CSVフォーマット: `Rank,Title,ViewCount,URL,Thumbnail,PublishedAt,DurationSec`

#### 3. CSVファイルのエクスポート
- 現在使用中のデータをCSVファイルとしてダウンロード

#### 4. プリセット機能
- `nobamangames.csv`: デフォルトデータ（全動画）
- `preset1.csv`: Top 10動画のみ
- 生成・インポートしたCSVも選択可能

## ファイル構成

```
noba-title/
├── index.html          # メインアプリケーション
├── datas/              # データフォルダ
│   ├── nobamangames.csv   # デフォルトデータ
│   └── preset1.csv        # プリセット1 (Top 10)
└── README.md           # このファイル
```

## 使用技術
- HTML5
- Tailwind CSS（CDN）
- PapaParse（CSV解析）
- YouTube Data API v3

## セットアップ

1. リポジトリをクローン
2. Webサーバーで `index.html` を開く（ローカルファイルではCORS制限により正常に動作しません）
3. データ管理機能を使う場合は、YouTube Data API v3のキーを取得

### YouTube Data API v3 キーの取得方法

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. 「APIとサービス」→「ライブラリ」から「YouTube Data API v3」を有効化
4. 「認証情報」→「認証情報を作成」→「APIキー」を選択
5. 生成されたAPIキーをコピーして使用

## 注意事項

- YouTube Data API v3には使用制限があります（デフォルトで1日10,000ユニット）
- 大量の動画を持つチャンネルの場合、データ取得に時間がかかる場合があります
- Shorts判定はブラウザ環境の制約により、動画の長さとタイトル/説明文の #shorts タグで判定しています

## ライセンス

MIT License
