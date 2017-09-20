/**
 * Created by gexuhui on 17/9/19.
 */
'use strict';

const webpack = require('webpack');
const _ = require('lodash');
const path = require('path');
const os = require('os');//性能优化
const HappyPack = require('happypack');//性能优化工具

let vueLoaderConfig = require('./vue-loader.conf');
let config = require('./config');
let utils = require('./utils');

let happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length;
});

/**
 *给出正确的绝对路径
 */
function resolve (dir) {
    return path.join(__dirname, '../app', dir);
}

module.exports = {
    entry: {//配置webpack编译入口
        app: './app/app.js'
    },
    output: {//配置webpack输出路径和命名规则
        path: config.build.assetsRoot,//webpack输出的目标文件夹路径
        filename: utils.assetsPath('js/[name].js'),//webpack输出bundle文件命名格式
        chunkFilename: utils.assetsPath('js/[name].js'),
        publicPath: process.env.NODE_ENV === 'production'//webpack编译输出的发布路径
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {//配置模块的规则
        extensions: ['.js', '.vue', '.json'],//自动resolve的扩展名
        alias: {//创建路径别名，有了别名之后引用模块更方便，例如import Vue from 'vue/dist/vue.common.js' 可以写成 import Vue from 'vue'
            vue$: 'vue/dist/vue.esm.js',
            'echarts-lib': 'echarts/lib/echarts',
            'echarts-tooltip': 'echarts/lib/component/tooltip',
            'echarts-legend': 'echarts/lib/component/legend',
            'echarts-line': 'echarts/lib/chart/line',
            'echarts-pie': 'echarts/lib/chart/pie',
            'echarts-scatter': 'echarts/lib/chart/scatter',
            'echarts-map': 'echarts/lib/chart/map'
        },
        modules: [
            resolve(''),
            'node_modules'
        ]
    },
    module: {//配置不同类型模块的处理规则
        rules: [
            {
                test: /\.js$/,
                loader: 'happypack/loader?id=js',
                exclude: /node_modules/
            },
            {//对图片资源文件使用url-loader，query.name指明了输出的命名规则
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {//对字体资源文件使用url-loader,query.name 指明了输出的命名规则
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {//对所有.vue文件使用vue-loader
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'js',
            threadPool: happyThreadPool,
            loaders: ['babel-loader?cacheDirectory=true'],
        }),
        new HappyPack({
            id: 'vue',
            threadPool: happyThreadPool,
            loaders: ['vue-loader'],
        })
    ]
}



