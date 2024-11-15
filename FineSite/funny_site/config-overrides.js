const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    url: require.resolve('url/')  // Поле для полифилла для модуля `url`
  };

  return config;
};
