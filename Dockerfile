FROM node:lts-alpine
SHELL ["/bin/sh","-c"]
ENV API_IP 172.17.0.3
ENV API_PORT 3000
ENV PORT 8800
WORKDIR /app
COPY ./www /app/www/
COPY ./server.js /app/
COPY ./package.json /app/
RUN npm install
EXPOSE $PORT
ENTRYPOINT ["node","server.js"]
