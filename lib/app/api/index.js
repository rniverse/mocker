const { Router } = require('root/utils');
const userRoutes = require('./user');
const authRoutes = require('./auth');
const noteRoutes = require('./note');
const { jwtMw } = require('../middlewares');

const router = Router();

router.use('/auth', authRoutes);

router.use(jwtMw);

router.use('/users', userRoutes);

router.use('/notes', noteRoutes);

module.exports = router;
