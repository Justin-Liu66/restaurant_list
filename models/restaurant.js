const mongoose = require('mongoose') //載入mongoose
const Schema = mongoose.Schema //mongoose提供的模組

const restaurantSchema = new Schema({
  // 建構新的Schema
  name: {
    type: String, //資料型別是字串
    required: true, //必填
  },
  name_en: {
    type: String, //資料型別是字串
    required: true, //必填
  },
  category: {
    type: String, //資料型別是字串
    required: true, //必填
  },
  image: {
    type: String, //資料型別是字串
  },
  location: {
    type: String, //資料型別是字串
  },
  phone: {
    type: String, //資料型別是字串
  },
  google_map: {
    type: String, //資料型別是字串
  },
  rating: {
    type: Number, //資料型別是數字
  },
  description: {
    type: String, //資料型別是字串
  },
})

module.exports = mongoose.model('Restaurant', restaurantSchema) //命名並匯出這份 model
