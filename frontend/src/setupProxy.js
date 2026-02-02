// frontend/setupProxy.js - FIXED (Don't block WebSocket)
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // DO NOT block WebSocket/sockjs - React dev server needs it
  // Remove the blocking middleware completely
  
  // Only proxy API requests
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log(`[API] ${req.method} ${req.url}`);
      }
    })
  );
  
  app.use(
    '/uploads',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};