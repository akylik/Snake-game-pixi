// const path = require('path');
// const { merge } = require('webpack-merge');
// const common = require('./webpack.common');

// module.exports = merge(common, {
//     mode: 'development',
//     devtool: 'eval-source-map',
//     devServer: {
//         hot: true,
//         static:[
//             {
//                 directory: path.join(__dirname, 'build/js'),
//                 publicPath: '/js/',
//                 watch: true
//             },
//             {
//                 directory: path.join(__dirname, 'public'),
//                 publicPath: '/',
//                 watch: true
//             }
//         ],
//         watchFiles: ['src/index.js']
//     }
// });

const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        hot: true,
        static: [
            {
                directory: path.join(__dirname, 'build'),
                publicPath: '/',
                watch: true
            },
            {
                directory: path.join(__dirname, 'public'),
                publicPath: '/',
                watch: true
            }
        ],
        watchFiles: ['src/**/*'],
        port: 8080
    }
});