const webpack = require("webpack");
...
module.exports = {
...,
    plugins: [
        new webpack.ProvidePlugin({
            process: "process/browser"
        }), ...
    ]
};
 config.resolve = {
      fallback: {
        fs: false,
        tls: false,
        net: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        url: false,
        os: false,
        assert: false
      }
    }
