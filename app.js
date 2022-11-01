// require packages used in the project
const express = require('express')
const session = require('express-session')
const usePassport = require('./config/passport')

// require express-handlebars here
const exphbs = require('express-handlebars')
//reqire body-parser
const bodyParser = require('body-parser')
//require method-override
const methodOverride = require('method-override')

//require routes
const routes = require("./routes")
//require mongoose
require('./config/mongoose')

const app = express()
const port = 3000

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

//setting static files
app.use(express.static('public'))

//使用app.use規定每一筆request都需經body-parser前置處理
app.use(bodyParser.urlencoded({ extended: true }))

//設定每一筆請求都會透過methodOverride進行前置處理
app.use(methodOverride('_method'))

// 呼叫 Passport 函式並傳入 app
usePassport(app)

//設定每一筆請求都要導入路由器
app.use(routes)

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})