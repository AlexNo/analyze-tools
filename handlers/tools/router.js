const router = require('koa-router')();
const config = require('config');

router.get('/', require('./controller/tools').release);
router.get('/har', require('./controller/tools').har);

module.exports = router;
