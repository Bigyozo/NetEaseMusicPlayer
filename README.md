Language : 简体中文 | [English](./README_ENG.md)

# 网易云音乐网页端

- 实现了网易云音乐的播放器以及歌单页面、歌曲页面、歌手页面和会员登录等功能。
- 技术栈 angular8, ngrx8, ng-zorro-antd。
- 后端功能利用开源项目网易云音乐 API 实现，详情参见
  [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

## 使用方法

### 项目直接运行

1. 网易云音乐 API 部署完成后，根据后端的 IP 与端口设置 proxyconfig.json 文件中的 target 属性。
2. npm install 后启动项目。

```shell
npm install
npm run start
```

### 编译运行

1. 根据后端项目的 IP 与端口设置 server.js 文件中的 target 属性。
2. 编译项目生成 www 目录。
3. 执行 server.js 文件。

```shell
npm run build
node server.js
```

### docker 容器运行

1. 根据后端项目所在容器的 IP 与端口设置 server.js 文件中的 target 属性。
2. 将编译生成的 www 目录，package.json, server.js 与 Dockerfile 文件放入 Linux 服务器。
3. 生成 docker 镜像。
4. 运行 docker 容器。

```shell
docker build -t imageName .
docker run -d --name containerName -p 8800:8800 imageName
```
