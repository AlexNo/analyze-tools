exports.init = app => {
    const router = require('./router');

    app.use(router.routes());
};