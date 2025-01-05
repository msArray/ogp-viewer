# OGP Viewer with Redis and Remix

このプロジェクトは、RedisとRemixを使用して構築されたOGP Viewerです。指定したURLからOGPメタデータを取得し、ビューとして表示します。

## セットアップ手順

### 1. リポジトリのクローン
```bash
git clone https://github.com/msArray/ogp-viewer.git
cd ogp-viewer
```

### 2. 依存関係のインストール
```bash
pnpm install
```

### 3. Redisの起動
Dockerがインストールされている場合以下のコマンドでRedisサーバーを起動することができます。
```bash
./redis.sh
```

### 4. 開発サーバーの起動
```bash
pnpm run dev
```
デフォルトでは、`http://localhost:5173`でアプリが動作します。

---

## 使用方法

1. ホーム画面にアクセスします。
2. URLを入力してOGPデータを取得。
3. データがRedisにキャッシュされ、次回以降のリクエストは高速化されます。キャッシュは最大1日保持されます

## APIエンドポイント

- **GET `/ogp?url={target_url}`**  
指定されたURLのOGPメタデータを取得。
