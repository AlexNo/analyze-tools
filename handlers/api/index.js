const mount = require('koa-mount');

exports.init = app => {
    console.log('API initialized');
    const router = require('./router');

    app.use(mount('/api', router.middleware()));
};