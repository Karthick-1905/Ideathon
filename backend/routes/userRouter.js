const router = require('express').Router();

const {getUserProfile} = require('../controllers/userController')

router.route('/getProfile').get(getUserProfile)


module.exports = router