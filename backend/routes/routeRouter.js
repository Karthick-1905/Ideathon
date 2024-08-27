const router = require('express').Router();
const {getRoutes} = require('../controllers/routesController')


router.route('/get-routes').post(getRoutes)


module.exports =  router