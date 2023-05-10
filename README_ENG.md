Language : [简体中文](./README.md) | English

# Netease Cloud Music Website

- The system realizes the functions of music player, song list page, song page, singer page and member login on Netease Cloud Music Website.
- Technology stack: angular8, ngrx8, ng-zorro-antd。
- The backend is implemented using the Netease Cloud Music Node.js API created by Binaryify. View details from
  [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

## Rendering

HomePage
![HomePage](/src/assets/images/main.png)
MusicPlayer
![MusicPlayer](/src/assets/images/player.png)

## HOW TO USE

### Launch Directly

1. Set the target attribute in the proxyconfig.json file according to the IP and port of the backend project.
2. Launch the project after npm install.

```shell
npm install
npm run start
```

### Run After Compile

1.  Set the target attribute in the proxyconfig.json file according to the IP and port of the backend project.
2.  Compile the project into a directory named www.
3.  Execute the server.js file.

```shell
npm run build
node server.js
```

### Run In Docker

1. Set the target attribute in the server.js file according to the IP and port of the container containing the back-end project.
2. Put the compiled www directory, package.json, server.js and Dockerfile files into the Linux server.
3. Generate the docker image.
4. Run the docker container.

```shell
docker build -t imageName .
docker run -d --name containerName -p 8800:8800 imageName
```
