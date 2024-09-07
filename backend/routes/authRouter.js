const router = require('express').Router();
const {register,login,logout,getme} = require('../controllers/authController')
const {validateLoginInput,validateRegisterInput} = require('../middlewares/validationMiddleware')
const authProvider  = require('../middlewares/authMiddlware')

router.route('/register').post(validateRegisterInput,register)
router.route('/login').post(validateLoginInput,login)
router.route('/logout').post(logout)

router.route('/auth-user').get(authProvider,getme)

module.exports =  router