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


const app = express()
const port = 3000

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
  return res.render('new')
})

//新增一間餐廳
app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

//優化搜尋功能
//1.關鍵字前後多打了空白鍵還是能搜到餐廳
//2.以餐廳英文名字或餐廳類別搜尋也是可行的
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase().trim()
  const Restaurant = Restaurant.lean()
  const restaurants = Restaurant.results.filter(restaurant => {
    return restaurant.name.toLowerCase().trim().includes(keyword) ||
      restaurant.name_en.toLowerCase().trim().includes(keyword) ||
      restaurant.category.toLowerCase().trim().includes(keyword)
  })
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

//瀏覽特定一間餐廳
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id //以id存取使用者點擊的餐廳
  return Restaurant.findById(id) //從資料庫中找出該餐廳
    .lean() //整理資料
    .then((restaurant) => res.render('show', { restaurant })) //以該筆資料渲染show頁面
})

//修改特定一間餐廳資訊的頁面
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(err => console.log(err))
})

//修改特定一間餐廳資訊
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description

  return Restaurant.findById(id)
    //這邊不用.lean() ??
    .then(restaurant => {
      console.log(restaurant)
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
      restaurant.description = description

      return restaurant.save()
    })
    //修改完成後重新導回"瀏覽該餐廳頁面"
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(err => console.log(err))
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})