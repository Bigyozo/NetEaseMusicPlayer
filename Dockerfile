FROM node:lts-alpine
SHELL ["/bin/sh","-c"]
WORKDIR /app
COPY ./www /app/www/
COPY ./server.js /app/
COPY ./package.json /app/
RUN npm install
EXPOSE 8800
ENTRYPOINT ["node","server.js"]
