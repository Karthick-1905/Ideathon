const router = require('express').Router();

const {getUserProfile,handleSearch,getRecentSearches} = require('../controllers/userController')

router.route('/getProfile').get(getUserProfile)
router.route('/recent-search').post(handleSearch).get(getRecentSearches)


module.exports = router