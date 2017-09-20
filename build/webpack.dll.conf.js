/**
 * Created by gexuhui on 17/9/20.
 */
const webpack = require('webpack');
const path = require('path');
const os = require('os');
const UglifyJsparallelPlugin = require('webpack-uglify-parallel');
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let utils = require('./utils');
let config = require('./config');

let vendors = [
    'vue',
    'lodash',
    'axios',
    'vue-router',
    'promise-polyfill/promise',
    'iview',
    'yoho-store',
    'yoho-cookie',
    'moment',
    'iview/dist/styles/iview.css'
];
let webpackConfig = {
    output: {
        path: path.join(__dirname, '/dll'),
        filename: '[name].[chunkhash:7].js',
        library: '[name]_[chunkhash]',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    entry: {
        vendor: vendors,
    },
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        }).concat([
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                loader: 'ignore-file-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }])
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, '/dll/manifest.json'),
            name: '[name]_[chunkhash]',
            context: __dirname,
        }),
        new webpack.DefinePlugin({
            'process.env': config.build.env
        }),
        new UglifyJsparallelPlugin({
            workers: os.cpus().length,
            mangle: true,
            compress: {
                warnings: false
            },
            comments: false,
            sourceMap: true
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new AssetsPlugin({
            filename: 'bundle-config.json',
            prettyPrint: true,
            fullPath: false,
            path: path.join(__dirname, '/dll/')
        }),
        new ExtractTextPlugin({
            filename: '[name].[contenthash:7].css'
        })
    ],
};

if (config.build.bundleAnalyzerReport) {
    let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;