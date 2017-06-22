exports.release = async (ctx, next) => {
    console.log('render main page');
    ctx.body = ctx.render('tools/templates/release');
};

exports.har = async (ctx, next) => {
    console.log('render main page');
    ctx.body = ctx.render('tools/templates/har');
};