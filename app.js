// require packages used in the project
const express = require('express')
// require express-handlebars here
const exphbs = require('express-handlebars')
//require restaurant.json
const restaurantList = require('./restaurant.json')

const app = express()
const port = 3000

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
  //load restaurant.json into index.handlebars
  res.render('index', { restaurants: restaurantList.results })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})