Language : [简体中文](./README_CHS.md) | [English](./README_ENG.md) | 日本語

# NetEase クラウドミュージック Web アプリ

- ミュージックプレイヤー、プレイリストページ、楽曲ページ、アーティストページ、会員ログインなどの機能を実装しています。
- 技術スタック：angular8、ngrx8、ng-zorro-antd。
- バックエンドは Binaryify が作成した NetEase クラウドミュージック Node.js API を使用して実装されています。詳細は
  [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) を参照してください。

### [デモを試す](http://zhangfanglong.click:8800)

## スクリーンショット

ホーム画面
![ホーム画面](/src/assets/images/main.png)
ミュージックプレイヤー
![ミュージックプレイヤー](/src/assets/images/player.png)

## 使用方法

### NetEase クラウドミュージック API のデプロイ

1. プロジェクトを起動する前に、NetEase クラウドミュージック API をデプロイする必要があります。

```shell
docker pull binaryify/netease_cloud_music_api
docker run -d -p 3000:3000 --name netease_cloud_music_api binaryify/netease_cloud_music_api
```

### 直接起動する場合

1. NetEase クラウドミュージック API の IP とポートに合わせて、`proxyconfig.json` の `target` プロパティを設定します。
2. `npm install` 後にプロジェクトを起動します。

```shell
npm install
npm run start
```

### ビルドして実行する場合

1. NetEase クラウドミュージック API の IP とポートに合わせて、`server.js` の `target` プロパティを設定します。
2. プロジェクトをビルドして `www` ディレクトリを生成します。
3. `server.js` を実行します。

```shell
npm run build
node server.js
```

### Docker コンテナで実行する場合

#### イメージをプルして実行する

1. Docker イメージを直接プルします。
2. Docker コンテナを起動します（API_IP：NetEase API コンテナの IP、API_PORT：NetEase API コンテナのポート、PORT：本プロジェクトのポート）。

```shell
docker pull bigyozo/netease_music_ui
docker run -d --name containerName -p 8800:8800 imageName -e API_IP=172.17.0.3 API_PORT=3000 PORT=8800
```

#### イメージをビルドして実行する

1. ビルド済みの `www` ディレクトリ、`package.json`、`server.js`、`Dockerfile` を Linux サーバーに配置します。
2. Docker イメージをビルドします。
3. Docker コンテナを起動します（API_IP：NetEase API コンテナの IP、API_PORT：NetEase API コンテナのポート、PORT：本プロジェクトのポート）。

```shell
docker build -t imageName .
docker run -d --name containerName -p 8800:8800 imageName -e API_IP=172.17.0.3 API_PORT=3000 PORT=8800
```
