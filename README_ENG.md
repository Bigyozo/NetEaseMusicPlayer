Language : [简体中文](./README_CHS.md) | English | [日本語](./README.md)

# Netease Cloud Music Website

- The system realizes the functions of music player, song list page, song page, singer page and member login on Netease Cloud Music Website.
- Technology stack: Angular 21, ng-zorro-antd 21.
- The backend is implemented using the Netease Cloud Music Node.js API created by Binaryify. View details from
  [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

### [Have a try](http://zhangfanglong.click:8800)

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

1. Set the property key named 'target' in the `proxyconfig.js` file according to the IP and port of the NeteaseCloudMusicApi.
2. Launch the project after npm install.

```shell
npm install
npm run start
```

### Run In Docker

#### By Pulling Image

1. Pull the docker image of this project.
2. Run docker container (API_IP: IP of NeteaseCloudMusicApi, API_PORT: port of NeteaseCloudMusicApi, PORT: port of this project).

```shell
docker pull bigyozo/netease_music_ui
docker run -d --name containerName -p 8800:8800 -e API_IP=172.17.0.3 -e API_PORT=3000 -e PORT=8800 bigyozo/netease_music_ui
```

#### By Building Image

1. Put the compiled `www/browser` directory, `nginx.conf.template` and `Dockerfile` files into the Linux server.
2. Generate docker image.
3. Run the docker container (API_IP: IP of NeteaseCloudMusicApi, API_PORT: port of NeteaseCloudMusicApi, PORT: port of this project).

```shell
docker build -t imageName .
docker run -d --name containerName -p 8800:8800 -e API_IP=172.17.0.3 -e API_PORT=3000 -e PORT=8800 imageName
```
