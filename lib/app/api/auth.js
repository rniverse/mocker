const { Router } = require('root/utils');
const { UserCtrl } = require('./controllers');
const { beforeAuthorizeMw } = require('../middlewares');

const router = Router();

router.use(beforeAuthorizeMw);

router.post('/signin', (req, res) => UserCtrl.signin(req, res));

router.post('/signup', (req, res) => UserCtrl.signup(req, res));

router.post('/reset-password', (req, res) => UserCtrl.resetPassword(req, res));

router.post('/forgot-password', (req, res) => UserCtrl.forgotPassword(req, res));

router.all('/signout', (req, res) => UserCtrl.signout(req, res));

router.use('/**', (_req, _res, next) => next());

module.exports = router;
