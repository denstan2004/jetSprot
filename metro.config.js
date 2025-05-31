const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add custom resolver configuration
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    '@': `${__dirname}/src`,
  },
};

module.exports = config;
