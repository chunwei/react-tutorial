var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReactMini = path.resolve(node_modules, 'react/dist/react.min.js');
var pathToReactRouterMini = path.resolve(node_modules, 'react-router/umd/ReactRouter.min.js');

module.exports = {
  resolve: {
    alias: {
      'react': pathToReactMini,
      'react-router': pathToReactRouterMini

    }
  },
  entry: {
    app: [path.resolve(__dirname, 'src/pages/index/index.js')]
  },

  output: {
    path: path.resolve(__dirname, 'public', 'build'),
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,// A regexp to test the require path. accepts either js or jsx
      loader: 'babel-loader'// The module to load. "babel" is short for "babel-loader"
    }, {
      test: /\.css$/,
      loader: 'style!css!autoprefixer?{browsers:["last 2 version", "> 1%"]}' //shortcut, Run both loaders style-loader and css-loader
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=16384'  //images that er 25KB or smaller in size will be converted to a BASE64 string and included in the CSS file where it is defined
    }],
    noParse: [pathToReactMini, pathToReactRouterMini]
  }
}
