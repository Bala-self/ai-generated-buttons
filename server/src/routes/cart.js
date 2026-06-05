const router = require('express').Router();
const c = require('../controllers/cartController');
const { authRequired } = require('../middleware/auth');

router.use(authRequired);
router.get('/', c.list);
router.post('/add', c.add);
router.post('/remove', c.remove);

module.exports = router;
