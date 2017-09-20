/**
 * Created by gexuhui on 17/9/20.
 */
const os = require('os');
const _  = require('lodash');
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge')
const UglifyJsparallelPlugin = require('webpack-uglify-parallel');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

let baseConfig = require('./webpack.base.conf.js');
let config = require('./config');
let utils = require('./utils');
let bundleConfig = require('./dll/bundle-config.json');


let assets = _.map(bundleConfig.vendor, (asset, name) => {
        return {
            filepath: require.resolve(`./dll/${asset}`),
            outputPath: utils.assetsPath(name),
            typeOfAsset: name,
            publicPath: (process.env.NODE_ENV === 'production'
                ? config.build.assetsPublicPath
                : config.dev.assetsPublicPath) + utils.assetsPath(name)
        }
    })
let webpackConfig = merge(baseConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        filename: utils.assetsPath('js/[name].[chunkhash:7].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash:7].js')
    },
    plugins: [
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
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash:7].css')
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: './index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        }),
        new AddAssetHtmlPlugin(assets),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./dll/manifest.json'),
        })
    ]
});

if (config.build.bundleAnalyzerReport) {
    let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;