const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration ULTRA-OPTIMISÉ pour taille minimale
 */
const config = {
  transformer: {
    minifierConfig: {
      mangle: {
        keep_fnames: false,
        toplevel: true,
      },
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 3,
      },
      output: {
        ascii_only: true,
        beautify: false,
        comments: false,
      },
      sourceMap: false,
      toplevel: true,
    },
  },
  serializer: {
    createModuleIdFactory: function () {
      return function (path) {
        return path.substr(1).replace(/\.js$/, '').replace(/\/index$/, '');
      };
    },
  },
  resolver: {
    blacklistRE: /(.*\/__tests__\/.*|\.test\.js|\.spec\.js)$/,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
