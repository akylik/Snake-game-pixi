// const path = require('path');

// module.exports = {
//     entry: './src/index.js',
//     output: {
//         path: path.resolve(__dirname, 'build'),
//         filename: 'js/app.js'
//     }
// }

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/app.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html'
    })
  ]
};
