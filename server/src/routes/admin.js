const router = require('express').Router();
const c = require('../controllers/adminController');
const { authRequired, adminRequired } = require('../middleware/auth');

router.use(authRequired, adminRequired);

router.post('/generate', c.generateNow);
router.get('/pending', c.pending);
router.post('/:id/approve', c.approve);
router.delete('/:id', c.remove);
router.get('/stats', c.stats);

module.exports = router;
