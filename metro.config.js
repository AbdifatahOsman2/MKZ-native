// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Custom server configuration
  config.server = {
    ...config.server,
    useGlobalNgrok: true,
  };

  return config;
})();
