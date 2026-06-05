const router = require('express').Router();
const c = require('../controllers/buttonController');
const { authRequired } = require('../middleware/auth');

router.get('/', c.latest);
router.get('/all', c.all);
router.get('/category/:c', c.byCategory);
router.post('/:id/like', authRequired, c.like);

module.exports = router;
