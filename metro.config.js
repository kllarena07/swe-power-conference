const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

// First, apply the transformer configuration
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
    mangle: false,
  },
};

// Then export with NativeWind
module.exports = withNativeWind(config, { input: './global.css' });