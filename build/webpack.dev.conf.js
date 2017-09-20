/**
 * Created by gexuhui on 17/9/20.
 */
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');//一个可以合并数组和对象的插件
const HtmlWebpackPlugin = require('html-webpack-plugin');//一个用于生成HTML文件并自动注入依赖文件（link/script）的webpack插件
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');//用于更友好地输出webpack的警告、错误等信息
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

let baseConfig = require('./webpack.base.conf.js');
let config = require('./config');
let utils = require('./utils');


Object.keys(baseConfig.entry).forEach(function (name) {
    baseConfig.entry[name] = ['webpack-hot-middleware/client?noInfo=true&reload=true'].concat(baseConfig.entry[name])
});

/**
 * 合并基础的webpack配置
 */
module.exports = merge(baseConfig, {
    module: {//配置样式文件的处理规则，使用styleLoaders
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    plugins: [//配置webpack插件
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),//后页面中的报错不会阻塞，但是会在编译结束后报错
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            inject: true
        }),
        new FriendlyErrorsPlugin(),
    ]
})