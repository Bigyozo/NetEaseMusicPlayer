const express = require('express');
const proxy = require('http-proxy-middleware');
const app = express();
const PORT = 8800;
app.use(express.static('www'));
const apiProxy = proxy('/api/**', {
  target: 'http://192.168.40.218:3000/',
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
