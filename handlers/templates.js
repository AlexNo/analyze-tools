let pug = require('pug');
let config = require('config');
let path = require('path');

exports.init = app => {
    app.use(async (ctx, next) => {
        ctx.render = function(templatePath, locals) {
            locals = locals || {};

            let templatePathResolved = path.join(config.template.root, templatePath + '.pug');

            return pug.renderFile(templatePathResolved, locals);
        };

        await next();
    })
};