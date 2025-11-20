const path = require('path');

module.exports = {
  filenameHashing: false,
  chainWebpack: config => {
    config.plugins.delete('html');
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
  },
  // this must match exactly where WordPress can serve your dist folder
  // publicPath: '/wp-content/plugins/CSC3600_MME/CSC3600-T2-2025-QuantumBananaSystems/frontend/dist/',
  publicPath: '/wp-content/plugins/iwrms-dashboard/frontend/dist/',
  outputDir: path.resolve(__dirname, 'dist'),
  lintOnSave: false,
};
