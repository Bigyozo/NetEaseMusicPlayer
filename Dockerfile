FROM nginx:alpine

ENV API_IP=172.17.0.3
ENV API_PORT=3000
ENV PORT=8800

COPY ./www/browser /usr/share/nginx/html
COPY ./nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE $PORT
