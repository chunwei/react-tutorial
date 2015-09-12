var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, 'node_modules');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'app/main.js'),
    vendors: ['react']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,// A regexp to test the require path. accepts either js or jsx
      exclude: [node_modules],
      loader: 'babel-loader'// The module to load. "babel" is short for "babel-loader"
    }, {
      test: /\.css$/,
      loader: 'style!css' //shortcut, Run both loaders style-loader and css-loader
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=16384'  //images that er 25KB or smaller in size will be converted to a BASE64 string and included in the CSS file where it is defined
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
  ]
}
