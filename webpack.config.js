// webpack.config.js or rollup.config.js
const webpack = require('webpack');
module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};
