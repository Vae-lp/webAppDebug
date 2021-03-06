var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        test: "./test/index.js",
        zepto: "./test/zepto.js"
    },
    output: {
        path: "./test/",
        filename: "/[name].js",
        sourceMapFilename: "[name].map"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules&localIdentName=[name]-[hash:base64:5]'
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader?modules&localIdentName=[name]-[hash:base64:5]!less-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            comments: false,
            sourceMap: true
        }),
        new HtmlWebpackPlugin({
            title: 'debbger',
            template: './test/index.html',
            filename: './index.html',
            inject: true,
            chunks: ["test", "zepto"]
        })
    ],
    devtool: "#source-map"
};
