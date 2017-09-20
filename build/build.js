/**
 * Created by gexuhui on 17/9/20.
 */
process.env.NODE_ENV = 'production'

var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('./config')
var webpackConfig = require('./webpack.prod.conf')


rm(path.join(config.build.assetsRoot), err => {
    if (err) throw err
    webpack(webpackConfig, function (err, stats) {
        if (err) throw err
        process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n\n')

        console.log(chalk.cyan('  Build complete.\n'))
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
    })
})