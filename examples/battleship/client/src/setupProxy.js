const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('setting up proxy ', process.env.PROXY_URL)
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.PROXY_URL || 'http://localhost:3001',
    })
  );
};