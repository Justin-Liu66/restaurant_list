// require packages used in the project
const express = require('express')
// require express-handlebars here
const exphbs = require('express-handlebars')
//require mongoose
const mongoose = require('mongoose')
//reqire body-parser
const bodyParser = require('body-parser')
//require method-override
const methodOverride = require('method-override')

//require Restaurant model
const Restaurant = require('./models/restaurant')
//require routes
const routes = require("./routes")

//設定連線到mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//設定一個參數，把連線狀態暫存下來，才能繼續使用
const db = mongoose.connection
//連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
//連線成功
db.once('open', () => {
  console.log('mongodb connected')
})

const app = express()
const port = 3000

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

//使用app.use規定每一筆request都需經body-parser前置處理
app.use(bodyParser.urlencoded({ extended: true }))

//設定每一筆請求都會透過methodOverride進行前置處理
app.use(methodOverride('_method'))
//設定每一筆請求都要導入路由器
app.use(routes)

// routes setting
//優化搜尋功能
//1.關鍵字前後多打了空白鍵還是能搜到餐廳
//2.以餐廳英文名字或餐廳類別搜尋也是可行的
//3.搜尋欄未填入字串就搜尋時導回首頁
app.get('/search', (req, res) => {

  //若未填入字串就按搜尋，則導回首頁
  if (!req.query.keyword) {
    return res.redirect("/")
  }

  //將使用者輸入的搜尋字串刪去前後空格、轉為小寫，並以keyword變數存下來
  const keyword = req.query.keyword.trim().toLowerCase()

  //從資料庫抓取所有餐廳資料，整理後，存入變數restaurantsData
  Restaurant.find()
    .lean()
    .then(restaurantsData => {
      //過濾變數restaurantsData，將符合搜尋條件的餐廳資料存入變數filterRestaurantsData
      const filterRestaurantsData = restaurantsData.filter(
        restaurant =>
          restaurant.name.toLowerCase().includes(keyword) ||
          restaurant.name_en.toLowerCase().includes(keyword) ||
          restaurant.category.includes(keyword)
      )

      //把keyword搜尋不到結果情況存起來
      const noMatchResult = !filterRestaurantsData.length

      //由index樣板根據變數filterRestaurantsData、keyword、noMatchResult渲染出HTML格式
      res.render("index", { restaurants: filterRestaurantsData, keyword, noMatchResult })
    })
    .catch(err => console.log(err))
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})