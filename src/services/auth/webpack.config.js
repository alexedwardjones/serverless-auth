const path = require('path');
const webpack = require('webpack');
const slsw = require('serverless-webpack');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new webpack.IgnorePlugin(/^pg-native$/),
    new webpack.IgnorePlugin(/^tedious$/),
  ]
};