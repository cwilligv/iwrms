const path = require('path');

// Define your WordPress path here
const WP_PROD_PATH = '/wp-content/plugins/iwrms-dashboard/frontend/dist/';

module.exports = {
  // Keep filename hashing false so WordPress PHP knows the exact filenames
  filenameHashing: false,

  // If production (Build), use WP path. If Development (Serve), use root.
  publicPath: process.env.NODE_ENV === 'production'
    ? WP_PROD_PATH
    : '/',

  outputDir: path.resolve(__dirname, 'dist'),
  lintOnSave: false,

  chainWebpack: config => {
    // Only delete the HTML generation when building for Production/WordPress
    if (process.env.NODE_ENV === 'production') {
      config.plugins.delete('html');
      config.plugins.delete('preload');
      config.plugins.delete('prefetch');
    } else {
      // Optional: When running locally, you might want to set a page title
      config.plugin('html').tap(args => {
        args[0].title = 'Local Dev - IWRMS Dashboard';
        return args;
      });
    }
  },

  // Optional: Configure the local dev server if you encounter CORS issues with an external API
  devServer: {
    port: 8080, // Default port
    // proxy: 'http://your-wordpress-site.local' // Uncomment and set if you need to hit local WP APIs
  }
};
