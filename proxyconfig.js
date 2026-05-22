module.exports = {
  '/api': {
    target: `http://${process.env.API_HOST || '172.17.0.4'}:${process.env.API_PORT || '3000'}/`,
    secure: false,
    changeOrigin: true,
    pathRewrite: { '^/api': '' }
  }
};
