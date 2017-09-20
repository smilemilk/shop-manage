/**
 * Created by gexuhui on 17/9/19.
 */
var path = require('path');
var pkg = require('../package.json');

module.exports = {
    build: {    //构件产品时使用的配置
        env: {  //webpack的编译环境
            NODE_ENV: '"production"'
        },
        index: path.resolve(__dirname, `../public/dist/${pkg.name}/${pkg.version}/index.html`),//编译输出的index.html文件
        assetsRoot: path.resolve(__dirname, `../public/dist/${pkg.name}/`),//webpack输出的目标文件夹路径
        assetsSubDirectory: 'static',//webpack编译输出的二级文件夹
        assetsPublicPath: '//cdn.yoho.cn/yoho-shop-manage/',//webpack编译输出的发布路径
        productionSourceMap: true,//使用SourceMap
        productionGzip: false,//默认不打开开启gzip模式
        productionGzipExtensions: ['js', 'css'],//gzip模式下需要压缩的文件的扩展名
        bundleAnalyzerReport: process.env.npm_config_report,
    },
    dev: {//gzip模式下需要压缩的文件的扩展名
        env: {//webpack的编译环境
            NODE_ENV: '"dev"'
        },
        port: 6009,//dev-server监听的端口
        autoOpenBrowser: true,//启动dev-server之后自动打开浏览器
        assetsSubDirectory: 'static',//webpack编译输出的二级目录／文件夹
        proxyTable: {//请求代理表，需要proxyTable 代理的接口（可跨域），可配置特定的请求代理到对应的API接口
            '/Api': 'http://localhost:6007'
        },
        cssSourceMap: false,//是否开启 cssSourceMap
    }
};