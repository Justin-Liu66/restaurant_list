const Restaurant = require('../restaurant') //載入restaurant model
const restaurantList = require('../../restaurant.json').results //載入restaurant.json(記得加.result)
const db = require('../../config/mongoose')

db.once('open', () => {

  Restaurant.create(restaurantList)
    .then(() => {
      console.log('restaurantSeeder done!')
      //db.close() //Model Answer中加了這行，再研究
    })
    .catch(err => console.log(err))
})
