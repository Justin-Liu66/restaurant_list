//index.js為"總路由器"
//引用Express & Express路由器
const express = require('express')
const router = express.Router()

//require module: home、restaurants、search
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const search = require('./modules/search')

//distribute the request, of which path is '/', to module: home 
router.use('/', home)
//distribute the request, of which path is '/restaurants', to module: restaurants 
router.use('/restaurants', restaurants)
//distribute the request, of which path is '/search', to module: restaurants 
router.use('/search', search)

//匯出路由器
module.exports = router