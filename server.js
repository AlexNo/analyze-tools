const Koa = require('koa');
const app = new Koa();
const config = require('config');

config.handlers.forEach(handler => {
    require(`./handlers/${handler}`).init(app);
});


module.exports = app;