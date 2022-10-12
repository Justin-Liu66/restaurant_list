// require packages used in the project
const express = require('express')
// require express-handlebars here
const exphbs = require('express-handlebars')
//require Restaurant model
const Restaurant = require('./models/restaurant')
//require mongoose
const mongoose = require('mongoose')
//reqire body-parser
const bodyParser = require('body-parser')

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

// routes setting
//瀏覽全部餐廳
app.get('/', (req, res) => {
  Restaurant.find() //取出Restaurant model裡的所有資料
    .lean() //把Mongoose的Model物件轉換成乾淨的JS資料陣列
    .then(restaurants => res.render('index', { restaurants })) //把資料傳給index樣板
    .catch(err => console.log(err)) //錯誤處理
})

//新增餐廳頁面
app.get('/restaurants/new', (req, res) => {
  return res.render('new') //渲染出新增餐廳頁面
})

//新增餐廳
app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body) //根據使用者所輸入的內容，在資料庫中新增一筆餐廳資料
    .then(() => res.redirect('/')) //重新導回首頁
    .catch(err => console.log(err))
})

//優化搜尋功能
//1.關鍵字前後多打了空白鍵還是能搜到餐廳
//2.以餐廳英文名字或餐廳類別搜尋也是可行的
app.get('/search', (req, res) => {

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
      //由index樣板根據變數filterRestaurantsData、keyword渲染出HTML格式
      res.render("index", { restaurants: filterRestaurantsData, keyword })
    })
    .catch(err => console.log(err))
})


//瀏覽特定餐廳
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id //以id存取使用者點擊的餐廳
  return Restaurant.findById(id) //從資料庫中找出該餐廳
    .lean() //整理資料
    .then((restaurant) => res.render('show', { restaurant })) //以該筆資料渲染show頁面
})

//修改特定餐廳資訊的頁面
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id //以id存取使用者點擊欲修改的餐廳
  return Restaurant.findById(id) //透過id從資料庫中找出該筆欲修改的餐廳資料
    .lean()
    .then((restaurant) => res.render('edit', { restaurant })) //使用edit為樣板，根據該餐廳資料製作出修改資訊頁
    .catch(err => console.log(err))
})

//修改特定餐廳資訊
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const body = req.body
  //透過id從資料庫中找出該筆欲修改的資料
  return Restaurant.findById(id)
    //將該筆資料重新賦值成使用者所輸入的內容
    .then(restaurant => {
      restaurant.name = body.name
      restaurant.name_en = body.name_en
      restaurant.category = body.category
      restaurant.image = body.image
      restaurant.location = body.location
      restaurant.phone = body.phone
      restaurant.google_map = body.google_map
      restaurant.rating = body.rating
      restaurant.description = body.description
      //資料庫存檔
      return restaurant.save()
    })
    //修改完成後重新導回"瀏覽該餐廳頁面"
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(err => console.log(err))
})

//刪除特定一間餐廳
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id //存下使用者欲刪除的餐廳之id
  return Restaurant.findByIdAndRemove(id) //根據id從資料庫中找出該餐廳資料並刪除
    .then(() => res.redirect('/')) //刪除完成後重新導回首頁
    .catch(err => console.log(err))
})


// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})