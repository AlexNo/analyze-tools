const serve = require('koa-static');

exports.init = app => {
    app.use(serve('public'));
    app.use(serve('.'));
};