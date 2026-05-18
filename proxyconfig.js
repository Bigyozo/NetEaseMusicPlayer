module.exports = {
  "/api": {
    target: `http://${process.env.API_HOST || '192.168.0.57'}:${process.env.API_PORT || '3000'}/`,
    secure: false,
    changeOrigin: true,
    pathRewrite: { "^/api": "" }
  }
};
