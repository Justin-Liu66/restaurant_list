const mongoose = require('mongoose') //載入mongoose
const Schema = mongoose.Schema //mongoose提供的模組
const restaurantSchema = new Schema({
  // 建構新的Schema
  id: {
    type: Number, //資料型別是數字
    required: true, //必填
  },
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
    required: true, //必填
  },
  location: {
    type: String, //資料型別是字串
    required: true, //必填
  },
  phone: {
    type: String, //資料型別是字串
    required: true, //必填
  },
  google_map: {
    type: String, //資料型別是字串
    required: true, //必填
  },
  rating: {
    type: Number, //資料型別是數字
    required: true, //必填
  },
  description: {
    type: String, //資料型別是字串
    required: true, //必填
  },
})
module.exports = mongoose.model('Restaurant', restaurantSchema) //命名並匯出這份 model
