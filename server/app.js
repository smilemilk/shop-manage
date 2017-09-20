/**
 * Created by gexuhui on 17/9/20.
 */
'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const Express = require('express');
const pkg = require('../package.json');

// const session = require('express-session');
const cookieSession = require('cookie-session');
const favicon = require('serve-favicon');
const path = require('path');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();


global.env = {
    version: pkg.version,
    Production: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'gray',
    Gray: process.env.NODE_ENV === 'gray',
    Test: (process.env.NODE_ENV || '').indexOf('test') >= 0
};

let app = new Express();

const config = require('./common/config');
const logger = require('yoho-node-lib/lib/logger').init(config);
const helpers = require('yoho-node-lib/lib/helpers');

global.yoho = {
    logger,
    helpers,
    config
};
app.use(cookieSession({
    name: '',
    secret: '',
    maxAge: 2 * 60 * 60 * 1000
}));

app.use(compression());
app.use(favicon(path.join(__dirname, '/favicon.ico')));
app.use(Express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(multipartMiddleware);

const middleware = require('./middleware');
const controllers = require('./controllers');

try {
    app.use(middleware.main);

    // 前置中间件
    app.use(middleware.before);

    // controller
    app.use('/Api', controllers);

    // 鉴权中间件
    app.use(middleware.auth);

    // 接口代理中间件
    app.use(middleware.proxy);

    // 异常捕获中间件
    app.use(middleware.error);
} catch (err) {
    logger.error(err);
}


app.listen(config.port, () => {
    logger.info(`shop manage start at ${config.port}`);
});
