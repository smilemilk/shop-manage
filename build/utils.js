/**
 * Created by gexuhui on 17/9/19.
 */
var path = require('path');
var config = require('./config');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
//extract-text-webpack-plugin为了抽离css，防止将样式打包在js中引起页面样式加载错乱

exports.assetsPath = function(_path) {
   var assetsSubDirectoty = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory;
   return path.posix.join(assetsSubDirectoty, _path)
};

exports.cssLoaders = function (options) {
    options = options || {}

    var cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: process.env.NODE_ENV === 'production',
            sourceMap: options.sourceMap
        }
    }
    var autoprefixerLoader = {
        loader: 'autoprefixer-loader'
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders (loader, loaderOptions) {
        var loaders = [cssLoader, autoprefixerLoader]
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,//use指需要什么样的loader去编译文件，这里由于源文件是.css所以选择css-loader
                fallback: 'vue-style-loader'//编译后用什么loader来提取css文件
            })
        } else {
            return ['vue-style-loader'].concat(loaders)
        }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
}