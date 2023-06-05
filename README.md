Language : [简体中文](./README_CHS.md) | English

# Netease Cloud Music Website

- The system realizes the functions of music player, song list page, song page, singer page and member login on Netease Cloud Music Website.
- Technology stack: angular8, ngrx8, ng-zorro-antd。
- The backend is implemented using the Netease Cloud Music Node.js API created by Binaryify. View details from
  [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

### [Have a try](http://zhangfanglong.click)

## Rendering

HomePage
![HomePage](/src/assets/images/main.png)
MusicPlayer
![MusicPlayer](/src/assets/images/player.png)

## HOW TO USE

### Deploy the NeteaseCloudMusicApi

1. Before running the project, NeteaseCloudMusicApi needs to be deployed.

```shell
docker pull binaryify/netease_cloud_music_api
docker run -d -p 3000:3000 --name netease_cloud_music_api binaryify/netease_cloud_music_api
```

### Launch Directly

1. Set the property key named 'target' in the proxyconfig.json file according to the IP and port of the NeteaseCloudMusicApi.
2. Launch the project after npm install.

```shell
npm install
npm run start
```

### Run After Compile

1.  Set the property key named 'target' in the server.js file according to the IP and port of the NeteaseCloudMusicApi.
2.  Compile the project into a directory named www.
3.  Execute the server.js file.

```shell
npm run build
node server.js
```

### Run In Docker

#### By Pulling image

1. Pull the docker image of this project.(Currently this image only supports ARM servers)
2. Run docker container (API_IP: IP of NeteaseCloudMusicApi , API_PORT: port of NeteaseCloudMusicApi, PORT: port of this project).

```shell
docker pull bigyozo/netease_music_ui
docker run -d --name containerName -p 8800:8800 imageName -e API_IP=172.17.0.3 API_PORT=3000 PORT=8800
```

#### By Building image

1.  Put the compiled www directory, package.json, server.js and Dockerfile files into the Linux server.
2.  Generate docker image.
3.  Run the docker container (API_IP: IP of NeteaseCloudMusicApi , API_PORT: port of NeteaseCloudMusicApi, PORT: port of this project).

```shell
docker build -t imageName .
docker run -d --name containerName -p 8800:8800 imageName -e API_IP=172.17.0.3 API_PORT=3000 PORT=8800
```
