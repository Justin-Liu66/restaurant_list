const mongoose = require('mongoose') //require mongoose
const Restaurant = require('../restaurant') //載入restaurant model
const restaurantList = require('../../restaurant.json').results //載入restaurant.json(記得加.result)

//設定連線到mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

//存下連線狀態
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('running restaurantSeeder script!')

  Restaurant.create(restaurantList)
    .then(() => {
      console.log('restaurantSeeder done!')
      //db.close() //Model Answer中加了這行，再研究
    })
    .catch(err => console.log(err))
})
