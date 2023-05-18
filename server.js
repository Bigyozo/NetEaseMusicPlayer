const express = require('express');
const proxy = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 8800;
const API_IP = process.env.API_IP || '172.17.0.3';
const API_PORT = process.env.API_PORT || 3000;
app.use(express.static('www'));
//target为后端项目地址
const apiProxy = proxy('/api/**', {
  target: 'http://' + API_IP + ':' + API_PORT + '/',
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  }
});
app.use(apiProxy);
app.listen(PORT, function (err) {
  if (err) {
    console.log('err:', err);
  } else {
    console.log('listening:', PORT);
  }
});
