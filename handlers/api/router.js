const router = require('koa-router')();

router.get('/', require('./controller/api').status);
router.get('/prs/:id', require('./controller/api').prs);

module.exports = router;