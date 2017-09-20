/**
 * Created by gexuhui on 17/9/19.
 */
/**
 * 开发环境配置
 */
'use strict';

var config = require('./config');
/**
 * 如果Node 环境无法判断当前是dev／product环境,使用 config.dev.env.NODE_ENV 作为当前环境
 * 即  如果Node的环境变量中没有设置当前的环境（NODE_ENV），则使用config中的配置作为当前的环境
 */
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

//一个可以调用默认软件打开网址、图片、文件等内容的插件
//这里用它来调用默认浏览器打开dev-server监听的端口，例如：localhost:8080
var opn = require('opn');//一个可以强制打开浏览器并跳转到指定url的插件
var path = require('path');//使用NodeJS自带的文件路径工具
const compression = require('compression');
var express = require('express');
var webpack = require('webpack');

/**
 * 一个express中间件，用于将http请求代理到其他服务器，例如localhost:8080/api/xxx => localhost:3000/api/xxx
 * 该插件可以将前端开发中涉及到的请求代理到API服务器上，方便与服务器对接
 */
var proxyMiddleware = require('http-proxy-middleware');//使用proxyTable
var webpackConfig = require('./webpack.dev.conf');//使用dev环境的webpack配置

/**
 * dev-server监听的端口，默认为config.dev.port设置的端口，即6009
 */
var port = process.env.PORT || config.dev.port;

/**
 * 用于判断是否要自动打开浏览器的布尔变量，当配置文件中没有设置自动打开浏览器的时候其值为false
 */
var autoOpenBrowser = !!config.dev.autoOpenBrowser;

var proxyTable = config.dev.proxyTable;//定义HTTP代理表，代理到API服务器

var app = express();//创建一个express实例
var compiler = webpack(webpackConfig);//根据webpack配置文件创建Compiler对象

/**
 * webpack-dev-middleware使用 compiler对象来对相关的文件进行编译和绑定
 * 编译绑定后将得到的产物存放在内存中而没有写进磁盘
 * 将这个中间件交给express使用之后即可访问这些编译后的产品文件
 */
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
});

/**
 * webpack-hot-middleware,用于实现热重载功能的中间件
 */
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {}
});

app.use(compression());

/**
 * 将proxyTable中的代理请求配置挂载到express服务器上
 */
Object.keys(proxyTable).forEach(function(context) {
    var options = proxyTable[context];
    if (typeof options === 'string') {//格式化options，例如将'www.example.com'变成{target: 'www.example.com'}
        options = {
            target: options
        }
    }
    app.use(proxyMiddleware(options.filter || context, options))
});

/**
 * 重定向不存在的URL，常用于SPA
 */
app.use(require('connect-history-api-fallback')({
    rewrites: [
        {
            from: /\.html$/, to: '/index.html'
        },
        {
            from: /.*?\.(js)|(css)$/,
              to: (context) => {
                return context.parsedUrl.pathname;
            }
        }
    ]
}));

/**
 * 使用webpack中间件
 * 将webpack编译后输出到内存中的文件资源挂载到express服务器上
 */
app.use(devMiddleware);

/**
 * 将热重载中间件挂在到express服务器上
 */
app.use(hotMiddleware);

var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);//静态资源的路径
app.use(staticPath, express.static('./static'));//将静态资源挂到express服务器上

var uri = 'http://localhost:' + port;//应用的地址信息，例如：http://localhost:8080

var _resolve;
var readyPromise = new Promise(resolve => {
    _resolve = resolve
});

console.log('> Starting dev server...');

/**
 * webpack开发中间件合法（valid）之后输出提示语到控制台，表明服务器已启动
 */
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n');
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {//如果符合自动打开浏览器的条件，则通过opn插件调用系统默认浏览器打开对应的地址uri
        opn(uri)
    }
    _resolve();
});

var server = app.listen(port);

module.exports = {//启动express服务器并监听相应的端口（8080）
    ready: readyPromise,
    close: () => {
        server.close()
    }
}

