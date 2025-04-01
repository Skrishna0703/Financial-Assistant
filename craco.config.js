const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "stream": require.resolve("stream-browserify"),
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "crypto": require.resolve("crypto-browserify"),
          "buffer": require.resolve("buffer/"),
          "process": require.resolve("process/browser.js"),
          "util": require.resolve("util/"),
          "assert": require.resolve("assert/")
        },
        alias: {
          'victory-vendor/d3-scale': 'd3-scale',
          'victory-vendor/d3-shape': 'd3-shape'
        }
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            resolve: {
              fullySpecified: false
            }
          }
        ]
      }
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          process: 'process/browser.js',
          Buffer: ['buffer', 'Buffer']
        }),
        new webpack.DefinePlugin({
          'process.env': JSON.stringify(process.env)
        })
      ]
    }
  }
}; 