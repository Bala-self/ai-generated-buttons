const router = require('express').Router();
const c = require('../controllers/authController');
const { authRequired } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

router.post('/register', authLimiter, c.register);
router.post('/login', authLimiter, c.login);
router.get('/me', authRequired, c.me);

module.exports = router;
