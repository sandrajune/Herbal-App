const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    zlib: false,
    querystring: false,
    path: false,
    crypto: false,
    fs: false,
    stream: false,
    http: false,
    net: false,
    url: false,
    async_hooks: false,
    util: require.resolve('util/') // Add polyfill for util
  };

  // Ensure server-side modules are not bundled
  config.plugins.push(
    new webpack.IgnorePlugin({
      resourceRegExp: /^(express|send|body-parser|serve-static|mime|etag|destroy|cookie-signature|parseurl|mime-types)$/,
    })
  );

  config.devServer = {
    ...config.devServer,
    setupMiddlewares: (middlewares, devServer) => {
      return middlewares;
    }
  };

  return config;
};