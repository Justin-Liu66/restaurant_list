//require express & express-Router()
const express = require('express')
const router = express.Router()
//require Restaurant model
const Restaurant = require('../../models/restaurant')

//define route of homepage (瀏覽全部餐廳)
router.get('/', (req, res) => {
  Restaurant.find() //取出Restaurant model裡的所有資料
    .lean() //把Mongoose的Model物件轉換成乾淨的JS資料陣列
    .then(restaurants => res.render('index', { restaurants })) //把資料傳給index樣板
    .catch(err => console.log(err)) //錯誤處理
})

//export router
module.exports = router